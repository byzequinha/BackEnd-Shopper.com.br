import mongoose, { Schema, Document } from 'mongoose';

interface IMeasure extends Document {
  customer_code: string;
  measure_datetime: Date;
  measure_type: string;
  image_url: string;
  guid: string;
  value: number;
}

const measureSchema: Schema = new Schema({
  customer_code: { type: String, required: true },
  measure_datetime: { type: Date, required: true },
  measure_type: { type: String, required: true },
  image_url: { type: String, required: true },
  guid: { type: String, required: true },
  value: { type: Number, required: true },
});

// Verifique se o modelo já existe antes de compilar
export default mongoose.models.Measure || mongoose.model<IMeasure>('Measure', measureSchema);
