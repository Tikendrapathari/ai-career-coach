import express from 'express';
import { generateRoadmap, getRoadmap, updateProgress } from '../controllers/roadmapController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/generate', protect, generateRoadmap);
router.get('/my-roadmap', protect, getRoadmap);
router.put('/progress', protect, updateProgress);

export default router;