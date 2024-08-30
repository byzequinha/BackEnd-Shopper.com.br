import { Request, Response } from 'express';
import { 
  uploadImageToGemini, 
  extractValueFromImage, 
  saveMeasurement, 
  checkDuplicateReading, 
  fetchMeasuresFromDatabase 
} from '../services/geminiService';
import { confirmMeasurementValue, validateMeasurement } from '../services/llmService';

// Endpoint GET /measures
export const getMeasures = async (req: Request, res: Response) => {
  const { measure_type } = req.query;

  // Validação do parâmetro measure_type
  if (typeof measure_type !== 'string' || !['WATER', 'GAS'].includes(measure_type.toUpperCase())) {
    console.log('Invalid measure_type:', measure_type);
    return res.status(400).json({
      error_code: 'INVALID_TYPE',
      error_description: 'Tipo de medição não permitido',
    });
  }

  try {
    console.log('Fetching measures for type:', measure_type);
    const measures = await fetchMeasuresFromDatabase(measure_type.toUpperCase());

    if (!measures || measures.length === 0) {
      console.log('No measures found for type:', measure_type);
      return res.status(404).json({
        error_code: 'MEASURES_NOT_FOUND',
        error_description: 'Nenhuma leitura encontrada',
      });
    }

    res.status(200).json({
      customer_code: 'example_customer_code',
      measures,
    });
  } catch (error) {
    console.error('Error fetching measures:', error);
    res.status(500).json({
      error_code: 'INTERNAL_SERVER_ERROR',
      error_description: 'Erro interno do servidor',
    });
  }
};

// Endpoint POST /upload
export const uploadMeasurement = async (req: Request, res: Response) => {
    try {
        const { image, customer_code, measure_datetime, measure_type } = req.body;

        // Validação dos dados
        if (!image || !customer_code || !measure_datetime || !measure_type) {
            return res.status(400).json({
                error_code: "INVALID_DATA",
                error_description: "Dados fornecidos no corpo da requisição são inválidos"
            });
        }

        // Validação do measure_type
        if (!["WATER", "GAS"].includes(measure_type.toUpperCase())) {
            return res.status(400).json({
                error_code: "INVALID_TYPE",
                error_description: "Tipo de medição não permitido"
            });
        }

        // Verificar leitura duplicada
        const duplicate = await checkDuplicateReading(customer_code, measure_datetime, measure_type);
        if (duplicate) {
            return res.status(409).json({
                error_code: "DOUBLE_REPORT",
                error_description: "Leitura do mês já realizada"
            });
        }

        // Fazer upload da imagem e extrair valor
        const geminiResponse = await uploadImageToGemini(image);
        const extractedValue = await extractValueFromImage(geminiResponse);

        // Salvar medição
        const measure = await saveMeasurement({
            customer_code,
            measure_datetime,
            measure_type,
            image_url: geminiResponse.imageUrl,
            guid: geminiResponse.guid,
            value: extractedValue
        });

        res.status(200).json(measure);
    } catch (error) {
        res.status(500).json({
            error_code: "INTERNAL_SERVER_ERROR",
            error_description: "Erro interno do servidor"
        });
    }
};

// Endpoint PATCH /confirm
export const confirmMeasurement = async (req: Request, res: Response) => {
    try {
        const { measure_uuid, confirmed_value } = req.body;

        // Validação dos dados
        const validationError = validateMeasurement({ measure_uuid, confirmed_value });
        if (validationError) {
            return res.status(400).json(validationError);
        }

        // Confirmar medição
        const result = await confirmMeasurementValue(measure_uuid, confirmed_value);

        if (result.error) {
            return res.status(result.error.status).json(result.error);
        }

        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({
            error_code: "INTERNAL_SERVER_ERROR",
            error_description: 'Erro interno do servidor'
        });
    }
};
