import express from 'express';
import { generateReport, getReport, exportReportPDF } from '../controllers/reportController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/generate', protect, generateReport);
router.get('/my-report', protect, getReport);
router.get('/export-pdf', protect, exportReportPDF);

export default router;