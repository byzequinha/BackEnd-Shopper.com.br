import express from 'express';
import connectDB from './config/db';
import userRoutes from './routes/userRoutes';

const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Conecte ao banco de dados
connectDB();

// Usar as rotas de usuário
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5000;
//app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;