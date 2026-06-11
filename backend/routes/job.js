import express from 'express';
import { getJobRecommendations, getSkillGap } from '../controllers/jobController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/recommendations', protect, getJobRecommendations);
router.get('/skill-gap', protect, getSkillGap);

export default router;