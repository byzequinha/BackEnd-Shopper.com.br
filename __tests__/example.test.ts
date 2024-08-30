import request from 'supertest';
import app from '../src/index';
import mongoose from 'mongoose';
import Measure from '../src/models/measureModel';

beforeAll(async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/shopper');
  }

  // Insere dados de teste no banco antes de rodar os testes
  await Measure.create({
    customer_code: '12345',
    measure_datetime: new Date(),
    measure_type: 'WATER',
    image_url: 'http://example.com/image.jpg',
    guid: 'unique-guid',
    value: 123,
  });
}, 50000); // Aumenta o tempo limite para 50 segundos

afterAll(async () => {
  try {
    if (mongoose.connection.readyState !== 0) {
      console.log('Dropping test database...');
      await mongoose.connection.dropDatabase(); // Limpa o banco de dados de teste após os testes

      console.log('Closing database connection...');
      await mongoose.disconnect(); // Garante que a conexão é completamente fechada
      console.log('Database connection closed.');
    }
  } catch (error) {
    console.error('Error closing the database connection:', error);
  }
}, 50000); // Aumenta o tempo limite para 50 segundos

describe('GET /measures', () => {
  it('should return 200 when a valid measure_type is provided', async () => {
    const response = await request(app).get('/api/users/measures?measure_type=WATER');
    console.log('Response body:', response.body);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('measures');
  });

  it('should return 400 when an invalid measure_type is provided', async () => {
    const response = await request(app).get('/api/users/measures?measure_type=INVALID');
    console.log('Response body:', response.body);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error_code', 'INVALID_TYPE');
  });
});
