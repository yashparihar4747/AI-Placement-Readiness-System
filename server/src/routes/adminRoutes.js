// Master Admin Routes for TPO Portal (/api/admin/*)
import express from 'express';
import { requireAuth, requireRole, auditLogger } from '../middleware/auth.js';
import * as adminCtrl from '../controllers/adminController.js';

const router = express.Router();

// Enforce authentication, admin role, and audit logging on every route
router.use(requireAuth);
router.use(requireRole('admin'));
router.use(auditLogger);

// 4.1 Dashboard Overview
router.get('/overview', adminCtrl.getOverview);

// 4.3 Analytics & Reporting
router.get('/analytics', adminCtrl.getAnalytics);
router.get('/analytics/tests', adminCtrl.getTestAnalytics);
router.get('/reports', adminCtrl.getReports);
router.post('/reports/generate', adminCtrl.generateReport);
router.post('/reports/snapshot', adminCtrl.runBatchSnapshot);

// 4.2 Students Management
router.get('/students', adminCtrl.getStudents);
router.post('/students', adminCtrl.createStudent);
router.post('/students/import', adminCtrl.importStudents);
router.post('/students/bulk-import', adminCtrl.importStudents);
router.get('/students/:id', adminCtrl.getStudentDetail);
router.put('/students/:id', adminCtrl.updateStudent);
router.delete('/students/:id', adminCtrl.deleteStudent);
router.post('/students/:id/restore', adminCtrl.restoreStudent);
router.post('/students/:id/reset-password', adminCtrl.resetPassword);
router.post('/students/:id/deactivate', adminCtrl.deactivateStudent);
router.post('/students/:id/notes', adminCtrl.addStudentNote);
router.delete('/students/:id/:type/:itemId', adminCtrl.deleteStudentSubItem);
router.post('/students/:id/recompute', async (req, res) => {
  const result = await adminCtrl.recalculateScoreForStudent(req.params.id);
  res.json({ success: true, message: 'Score recomputed', result });
});

// 4.4 Shortlisting Engine
router.get('/shortlists', adminCtrl.getShortlists);
router.post('/shortlists', adminCtrl.createShortlist);
router.post('/shortlists/build', adminCtrl.buildShortlistCriteria);
router.delete('/shortlists/:id', adminCtrl.deleteShortlist);
router.get('/shortlists/:id/export', adminCtrl.exportShortlistCSV);

// 4.5 Drives Management
router.get('/drives', adminCtrl.getDrives);
router.post('/drives', adminCtrl.createDrive);
router.put('/drives/:id', adminCtrl.updateDrive);
router.delete('/drives/:id', adminCtrl.deleteDrive);
router.get('/drives/:id/planner', adminCtrl.getDrivePlanner);
router.put('/drives/:id/students/:studentId/stage', adminCtrl.updateApplicantStage);
router.put('/drives/:id/applicant/:studentId/stage', adminCtrl.updateApplicantStage);

// 4.6 Question Bank, Tests and DSA
router.get('/questions', adminCtrl.getQuestions);
router.post('/questions', adminCtrl.createQuestion);
router.delete('/questions/:id', adminCtrl.deleteQuestion);

// 4.7 Scoring Weights
router.get('/weights', adminCtrl.getWeights);
router.put('/weights', adminCtrl.updateWeights);
router.post('/weights/recompute', adminCtrl.recomputeAllScores);
router.post('/weights/recompute-all', adminCtrl.recomputeAllScores);

// 4.8 Notifications
router.get('/notifications', adminCtrl.getNotifications);
router.post('/notifications', adminCtrl.sendNotification);

// 4.9 Messages
router.get('/messages', adminCtrl.getMessages);
router.put('/messages/:id', adminCtrl.updateMessageStatus);
router.put('/messages/:id/reply', (req, res, next) => {
  req.body.replied = true;
  return adminCtrl.updateMessageStatus(req, res, next);
});

// 4.10 Users & Roles
router.get('/users', adminCtrl.getUsers);
router.post('/users', adminCtrl.createTPOUser);
router.delete('/users/:id', adminCtrl.deleteUser);

// 4.11 Audit Log
router.get('/audit', adminCtrl.getAuditLogs);

// 4.12 Reset Demo Data
router.post('/demo/reset', adminCtrl.resetDemoData);

export default router;
