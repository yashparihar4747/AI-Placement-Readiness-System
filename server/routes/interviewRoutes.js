import express from 'express';
import { getInterviewTiers, startInterview, submitInterviewAnswer, finishInterview, getInterviewHistory } from '../controllers/interviewController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/tiers', getInterviewTiers);
router.post('/start', startInterview);
router.post('/answer', submitInterviewAnswer);
router.post('/finish', finishInterview);
router.get('/history', getInterviewHistory);

export default router;
