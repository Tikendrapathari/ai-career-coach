import express from 'express';
import { generateProblem, evaluateCode, getHint, getCodingStats } from '../controllers/codingController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/generate-problem', protect, generateProblem);
router.post('/evaluate', protect, evaluateCode);
router.post('/hint', protect, getHint);
router.get('/stats', protect, getCodingStats);

export default router;