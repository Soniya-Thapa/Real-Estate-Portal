import { Router } from 'express';
import {
  getMyFavourites,
  addFavourite,
  removeFavourite,
  checkFavouriteStatus,
} from '../controllers/favouriteController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/', authenticateToken, getMyFavourites);
router.post('/', authenticateToken, addFavourite);
router.delete('/:propertyId', authenticateToken, removeFavourite);
router.get('/status/:propertyId', authenticateToken, checkFavouriteStatus);

export default router;