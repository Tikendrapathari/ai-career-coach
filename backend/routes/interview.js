import express from 'express';
import { generateQuestions, evaluateAnswer, saveInterview, getInterviewHistory, getInterviewById, generateCompanyQuestions } from '../controllers/interviewController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/questions', protect, generateQuestions);
router.post('/company-questions', protect, generateCompanyQuestions);
router.post('/evaluate', protect, evaluateAnswer);
router.post('/save', protect, saveInterview);
router.get('/history', protect, getInterviewHistory);
router.get('/:id', protect, getInterviewById);

export default router;