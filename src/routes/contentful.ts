import express from 'express';
import { protect } from '../middleware/auth';

const router = express.Router();

router.post('addAdventureIdea', protect, () => {});

export default router;
