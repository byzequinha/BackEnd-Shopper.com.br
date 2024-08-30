import mongoose from 'mongoose';

beforeAll(async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/shopeer');
  }
});

afterAll(async () => {
  await mongoose.connection.dropDatabase(); // Limpa o banco de dados de teste após os testes
  await mongoose.connection.close(); // Fecha a conexão
});
