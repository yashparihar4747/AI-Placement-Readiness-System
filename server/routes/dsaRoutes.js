import express from 'express';
import { getProblems, addProblem, updateProblem, deleteProblem, getStats } from '../controllers/dsaController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/', getProblems);
router.post('/add', addProblem);
router.get('/stats', getStats);
router.put('/:id', updateProblem);
router.delete('/:id', deleteProblem);

export default router;
