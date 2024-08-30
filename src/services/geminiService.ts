import mongoose, { Document } from 'mongoose';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const geminiClient = axios.create({
  baseURL: 'https://api.gemini.com/v1/',
  headers: {
    'Content-Type': 'application/json',
    'X-GEMINI-APIKEY': process.env.GEMINI_API_KEY as string,
  },
});

export const uploadImageToGemini = async (base64Image: string) => {
  try {
    const response = await geminiClient.post('/upload', { image: base64Image });
    return response.data;
  } catch (error) {
    console.error('Error uploading image to Gemini:', error);
    throw error;
  }
};

export const extractValueFromImage = async (geminiResponse: any) => {
  try {
    const response = await axios.post('url_da_api_llm', { image_url: geminiResponse.imageUrl });
    return response.data.value;
  } catch (error) {
    console.error('Error extracting value from image:', error);
    throw error;
  }
};

// Definição do esquema e modelo para medidas
const measureSchema = new mongoose.Schema({
  customer_code: { type: String, required: true },
  measure_datetime: { type: Date, required: true },
  measure_type: { type: String, required: true },
  image_url: String,
  guid: String,
  value: Number,
});

interface MeasureDocument extends Document {
  customer_code: string;
  measure_datetime: Date;
  measure_type: string;
  image_url?: string;
  guid?: string;
  value?: number;
}

const Measure = mongoose.model<MeasureDocument>('Measure', measureSchema);

export const fetchMeasuresFromDatabase = async (measureType: string): Promise<MeasureDocument[]> => {
  try {
    const measures = await Measure.find({ measure_type: measureType }).exec();
    return measures;
  } catch (error) {
    console.error('Error fetching measures from database:', error);
    throw error;
  }
};

// Função para verificar leitura duplicada
export const checkDuplicateReading = async (
  customerCode: string,
  measureDateTime: string,
  measureType: string
): Promise<boolean> => {
  try {
    const measures = await fetchMeasuresFromDatabase(measureType);

    // Verificando duplicatas de forma segura considerando tipos opcionais
    return measures.some((measure) => 
      measure.customer_code !== undefined && 
      measure.customer_code === customerCode &&
      measure.measure_datetime !== undefined &&
      measure.measure_datetime.toISOString() === new Date(measureDateTime).toISOString()
    );
  } catch (error) {
    console.error('Error checking duplicate reading:', error);
    throw error;
  } 
};

export const saveMeasurement = async (measureData: any) => {
  // Implementar a lógica real para salvar a medição no banco de dados
  try {
    const newMeasure = new Measure(measureData);
    return await newMeasure.save();
  } catch (error) {
    console.error('Error saving measurement:', error);
    throw error;
  }
};
