import express from 'express';
import {
  authTest,
  signUp,
  login,
  logout,
  getUserProfile,
} from '../controllers/auth';
import { protect } from '../middleware/auth';

const router = express.Router();

router.post('/test', protect, authTest);
router.post('/signup', signUp);
router.post('/login', login);
router.post('/logout', logout);

router.get('/me', protect, getUserProfile);

export default router;
