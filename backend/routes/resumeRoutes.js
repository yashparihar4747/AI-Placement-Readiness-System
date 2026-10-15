import express from 'express';
import { analyzeResume, getResumeHistory } from '../controllers/resumeController.js';
import { protect } from '../middleware/auth.js';
import { uploadResume } from '../middleware/upload.js';

const router = express.Router();

router.use(protect);

router.post('/analyze', uploadResume.single('resume'), analyzeResume);
router.get('/history', getResumeHistory);

export default router;
