import express from 'express';
import { authMiddleware } from '../middleware/auth';
import { getRentals } from '../controllers/rentalController';

const router = express.Router();

router.get('/', authMiddleware, getRentals);

export default router; 