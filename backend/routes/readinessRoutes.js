import express from 'express';
import { getReadinessScore, getReadinessReport } from '../controllers/readinessController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/score', getReadinessScore);
router.get('/report', getReadinessReport);

export default router;
