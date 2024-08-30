import { Router } from 'express';
import { uploadMeasurement, confirmMeasurement } from '../controllers/measuresController';

const router = Router();

router.post('/upload', uploadMeasurement);
router.patch('/confirm', confirmMeasurement);

export default router;
