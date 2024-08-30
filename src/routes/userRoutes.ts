import { Router } from 'express';
import { createUser, getUsers, getUserById, updateUser, deleteUser } from '../controllers/userController';
import { getMeasures } from '../controllers/measuresController';

const router: Router = Router();

// Rota GET /measures - defina antes das rotas com parâmetros dinâmicos
router.get('/measures', getMeasures);

// Rotas de usuário
router.post('/', createUser);
router.get('/', getUsers);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;
