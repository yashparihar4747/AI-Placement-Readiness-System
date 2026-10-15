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
  // Auth
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

  // Profile
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

  // DSA Tracker
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

  // Aptitude
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

  // Resume Analyzer
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

  // Mock Interview
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

  // Readiness
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
  }
};
