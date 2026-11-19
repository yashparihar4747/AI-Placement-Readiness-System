const API_BASE = '/api';

const getHeaders = (isMultipart = false) => {
  const token = localStorage.getItem('token');
  const headers = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  if (!isMultipart) {
    headers['Content-Type'] = 'application/json';
  }
  return headers;
};

const handleResponse = async (res) => {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || `Request failed with status ${res.status}`);
  }
  return data;
};

export const api = {
  // ==================== AUTH ====================
  login: async (email, password) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return handleResponse(res);
  },
  register: async (userData) => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return handleResponse(res);
  },
  getMe: async () => {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  // ==================== PROFILE ====================
  getProfile: async () => {
    const res = await fetch(`${API_BASE}/profile`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },
  updateProfile: async (profileData) => {
    const res = await fetch(`${API_BASE}/profile`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(profileData)
    });
    return handleResponse(res);
  },

  // ==================== STUDENT APIS ====================
  getStudentDashboard: async () => {
    const res = await fetch(`${API_BASE}/student/dashboard`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },
  getDSASheet: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/student/dsa-sheet?${query}`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },
  updateSheetProblemStatus: async (problemId, status, notes = '') => {
    const res = await fetch(`${API_BASE}/student/dsa-sheet/${problemId}/status`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ status, notes })
    });
    return handleResponse(res);
  },
  getTestsHub: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/student/tests?${query}`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },
  getTestDetails: async (testId) => {
    const res = await fetch(`${API_BASE}/student/tests/${testId}`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },
  submitTest: async (testId, payload) => {
    const res = await fetch(`${API_BASE}/student/tests/${testId}/submit`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });
    return handleResponse(res);
  },
  getTestHistory: async () => {
    const res = await fetch(`${API_BASE}/student/tests/history/all`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },
  getStudentCompanies: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/student/companies?${query}`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },
  getStudentResources: async () => {
    const res = await fetch(`${API_BASE}/student/resources`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },
  getStudentNotifications: async () => {
    const res = await fetch(`${API_BASE}/student/notifications`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },
  markNotificationRead: async (id) => {
    const res = await fetch(`${API_BASE}/student/notifications/${id}/read`, {
      method: 'PUT',
      headers: getHeaders()
    });
    return handleResponse(res);
  },
  getLeaderboard: async () => {
    const res = await fetch(`${API_BASE}/student/leaderboard`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  // ==================== LEGACY STUDENT MODULES ====================
  getDSAProblems: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/dsa?${query}`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },
  addDSAProblem: async (problemData) => {
    const res = await fetch(`${API_BASE}/dsa/add`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(problemData)
    });
    return handleResponse(res);
  },
  updateDSAProblem: async (id, updates) => {
    const res = await fetch(`${API_BASE}/dsa/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(updates)
    });
    return handleResponse(res);
  },
  deleteDSAProblem: async (id) => {
    const res = await fetch(`${API_BASE}/dsa/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return handleResponse(res);
  },
  getDSAStats: async () => {
    const res = await fetch(`${API_BASE}/dsa/stats`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },
  getAptitudeCategories: async () => {
    const res = await fetch(`${API_BASE}/aptitude/categories`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },
  getAptitudeQuiz: async (category) => {
    const res = await fetch(`${API_BASE}/aptitude/quiz/${category}`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },
  submitAptitudeQuiz: async (category, userAnswers, timeTakenSeconds) => {
    const res = await fetch(`${API_BASE}/aptitude/quiz/${category}/submit`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ userAnswers, timeTakenSeconds })
    });
    return handleResponse(res);
  },
  getAptitudeHistory: async () => {
    const res = await fetch(`${API_BASE}/aptitude/history`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },
  analyzeResume: async (formDataOrData, isMultipart = false) => {
    const res = await fetch(`${API_BASE}/resume/analyze`, {
      method: 'POST',
      headers: getHeaders(isMultipart),
      body: isMultipart ? formDataOrData : JSON.stringify(formDataOrData)
    });
    return handleResponse(res);
  },
  getResumeHistory: async () => {
    const res = await fetch(`${API_BASE}/resume/history`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },
  getInterviewTiers: async () => {
    const res = await fetch(`${API_BASE}/interview/tiers`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },
  startInterview: async (tier, role) => {
    const res = await fetch(`${API_BASE}/interview/start`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ tier, role })
    });
    return handleResponse(res);
  },
  submitInterviewAnswer: async (sessionId, answer) => {
    const res = await fetch(`${API_BASE}/interview/answer`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ sessionId, answer })
    });
    return handleResponse(res);
  },
  finishInterview: async (sessionId) => {
    const res = await fetch(`${API_BASE}/interview/finish`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ sessionId })
    });
    return handleResponse(res);
  },
  getInterviewHistory: async () => {
    const res = await fetch(`${API_BASE}/interview/history`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },
  getReadinessScore: async () => {
    const res = await fetch(`${API_BASE}/readiness/score`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },
  getReadinessReport: async () => {
    const res = await fetch(`${API_BASE}/readiness/report`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  // ==================== TPO / ADMIN APIS ====================
  getAdminOverview: async () => {
    const res = await fetch(`${API_BASE}/admin/overview`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },
  getAdminStudents: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/admin/students?${query}`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },
  createAdminStudent: async (studentData) => {
    const res = await fetch(`${API_BASE}/admin/students`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(studentData)
    });
    return handleResponse(res);
  },
  bulkImportStudents: async (students) => {
    const res = await fetch(`${API_BASE}/admin/students/bulk-import`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ students })
    });
    return handleResponse(res);
  },
  getAdminStudentDetail: async (id) => {
    const res = await fetch(`${API_BASE}/admin/students/${id}`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },
  updateAdminStudent: async (id, updates) => {
    const res = await fetch(`${API_BASE}/admin/students/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(updates)
    });
    return handleResponse(res);
  },
  deleteAdminStudent: async (id, permanent = false) => {
    const res = await fetch(`${API_BASE}/admin/students/${id}?permanent=${permanent}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return handleResponse(res);
  },
  deleteStudentSubItem: async (studentId, itemType, itemId) => {
    const res = await fetch(`${API_BASE}/admin/students/${studentId}/${itemType}/${itemId}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return handleResponse(res);
  },
  addStudentNote: async (studentId, note) => {
    const res = await fetch(`${API_BASE}/admin/students/${studentId}/notes`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ note })
    });
    return handleResponse(res);
  },
  getAdminAnalytics: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/admin/analytics?${query}`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },
  getAdminReports: async () => {
    const res = await fetch(`${API_BASE}/admin/reports`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },
  generateReport: async (type, options = {}) => {
    const res = await fetch(`${API_BASE}/admin/reports/generate`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ type, options })
    });
    return handleResponse(res);
  },
  runBatchSnapshot: async () => {
    const res = await fetch(`${API_BASE}/admin/reports/snapshot`, {
      method: 'POST',
      headers: getHeaders()
    });
    return handleResponse(res);
  },
  getAdminShortlists: async () => {
    const res = await fetch(`${API_BASE}/admin/shortlists`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },
  buildShortlistCriteria: async (criteria) => {
    const res = await fetch(`${API_BASE}/admin/shortlists/build`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(criteria)
    });
    return handleResponse(res);
  },
  saveShortlist: async (shortlistData) => {
    const res = await fetch(`${API_BASE}/admin/shortlists`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(shortlistData)
    });
    return handleResponse(res);
  },
  deleteShortlist: async (id) => {
    const res = await fetch(`${API_BASE}/admin/shortlists/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return handleResponse(res);
  },
  getAdminDrives: async () => {
    const res = await fetch(`${API_BASE}/admin/drives`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },
  createAdminDrive: async (driveData) => {
    const res = await fetch(`${API_BASE}/admin/drives`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(driveData)
    });
    return handleResponse(res);
  },
  updateAdminDrive: async (id, driveData) => {
    const res = await fetch(`${API_BASE}/admin/drives/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(driveData)
    });
    return handleResponse(res);
  },
  deleteAdminDrive: async (id) => {
    const res = await fetch(`${API_BASE}/admin/drives/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return handleResponse(res);
  },
  getDrivePlanner: async (driveId) => {
    const res = await fetch(`${API_BASE}/admin/drives/${driveId}/planner`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },
  updateDriveApplicantStage: async (driveId, studentId, stage) => {
    const res = await fetch(`${API_BASE}/admin/drives/${driveId}/applicant/${studentId}/stage`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ stage })
    });
    return handleResponse(res);
  },
  getAdminQuestions: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/admin/questions?${query}`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },
  createAdminQuestion: async (questionData) => {
    const res = await fetch(`${API_BASE}/admin/questions`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(questionData)
    });
    return handleResponse(res);
  },
  deleteAdminQuestion: async (id) => {
    const res = await fetch(`${API_BASE}/admin/questions/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return handleResponse(res);
  },
  createAdminTest: async (testData) => {
    const res = await fetch(`${API_BASE}/admin/tests`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(testData)
    });
    return handleResponse(res);
  },
  getAdminWeights: async () => {
    const res = await fetch(`${API_BASE}/admin/weights`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },
  updateAdminWeights: async (weights) => {
    const res = await fetch(`${API_BASE}/admin/weights`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(weights)
    });
    return handleResponse(res);
  },
  recomputeAllScores: async () => {
    const res = await fetch(`${API_BASE}/admin/weights/recompute`, {
      method: 'POST',
      headers: getHeaders()
    });
    return handleResponse(res);
  },
  getAdminNotifications: async () => {
    const res = await fetch(`${API_BASE}/admin/notifications`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },
  sendAdminNotification: async (notificationData) => {
    const res = await fetch(`${API_BASE}/admin/notifications`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(notificationData)
    });
    return handleResponse(res);
  },
  getAdminMessages: async () => {
    const res = await fetch(`${API_BASE}/admin/messages`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },
  replyAdminMessage: async (id, note) => {
    const res = await fetch(`${API_BASE}/admin/messages/${id}/reply`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ replyNote: note })
    });
    return handleResponse(res);
  },
  getAdminUsers: async () => {
    const res = await fetch(`${API_BASE}/admin/users`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },
  createAdminUser: async (userData) => {
    const res = await fetch(`${API_BASE}/admin/users`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(userData)
    });
    return handleResponse(res);
  },
  deleteAdminUser: async (id) => {
    const res = await fetch(`${API_BASE}/admin/users/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return handleResponse(res);
  },
  getAdminAuditLogs: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/admin/audit?${query}`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },
  resetDemoData: async () => {
    const res = await fetch(`${API_BASE}/admin/demo/reset`, {
      method: 'POST',
      headers: getHeaders()
    });
    return handleResponse(res);
  }
};
