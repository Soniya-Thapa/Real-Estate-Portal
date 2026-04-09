import { Router } from 'express';
import { getAllProperties, getPropertyById } from '../controllers/propertyController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/', authenticateToken, getAllProperties);
router.get('/:id', authenticateToken, getPropertyById);

export default router;