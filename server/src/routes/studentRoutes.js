// Master Student Routes (/api/student/*)
import express from 'express';
import { requireAuth, requireRole } from '../middleware/auth.js';
import * as studentCtrl from '../controllers/studentController.js';

const router = express.Router();

// Enforce authentication on all student endpoints
router.use(requireAuth);

// 5.1 Dashboard & Roadmap
router.get('/dashboard', studentCtrl.getStudentDashboard);
router.get('/dsa/sheet', studentCtrl.getDSASheet);
router.get('/dsa-sheet', studentCtrl.getDSASheet);
router.post('/dsa/status', studentCtrl.updateDSAStatus);
router.post('/dsa-sheet/:problemId/status', (req, res, next) => {
  req.body.problemId = req.params.problemId || req.body.problemId;
  return studentCtrl.updateDSAStatus(req, res, next);
});
router.get('/dsa/challenge', studentCtrl.getDSAChallenge);

// 5.2 Tests Hub & Runner
router.get('/tests', studentCtrl.getTests);
router.get('/tests/:id', studentCtrl.startTest);
router.get('/tests/:id/start', studentCtrl.startTest);
router.post('/tests/:id/submit', studentCtrl.submitTest);
router.get('/tests/history', studentCtrl.getTestHistory);
router.get('/tests/history/all', studentCtrl.getTestHistory);
router.get('/leaderboard', studentCtrl.getLeaderboard);

// 5.3 Companies & Resources
router.get('/companies', studentCtrl.getCompanies);
router.get('/resources', studentCtrl.getResources);
router.get('/notifications', studentCtrl.getStudentNotifications);
router.put('/notifications/:id/read', (req, res) => res.json({ success: true, message: 'Notification marked read' }));

export default router;
