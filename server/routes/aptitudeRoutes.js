import express from 'express';
import { getCategories, getQuizQuestions, submitQuiz, getHistory } from '../controllers/aptitudeController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/categories', getCategories);
router.get('/quiz/:category', getQuizQuestions);
router.post('/quiz/:category/submit', submitQuiz);
router.get('/history', getHistory);

export default router;
