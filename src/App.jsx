import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { ProtectedRoute } from './components/common/ProtectedRoute.jsx';

// Auth
import { Login } from './pages/Login.jsx';

// TPO Admin
import { AdminLayout } from './components/admin/AdminLayout.jsx';
import { AdminDashboard } from './pages/admin/AdminDashboard.jsx';
import { AdminStudents } from './pages/admin/AdminStudents.jsx';
import { AdminStudentDetail } from './pages/admin/AdminStudentDetail.jsx';
import { AdminAnalytics } from './pages/admin/AdminAnalytics.jsx';
import { AdminShortlisting } from './pages/admin/AdminShortlisting.jsx';
import { AdminDrives } from './pages/admin/AdminDrives.jsx';
import { AdminQuestions } from './pages/admin/AdminQuestions.jsx';
import { AdminWeights } from './pages/admin/AdminWeights.jsx';
import { AdminNotifications } from './pages/admin/AdminNotifications.jsx';
import { AdminReports } from './pages/admin/AdminReports.jsx';
import { AdminMessages } from './pages/admin/AdminMessages.jsx';
import { AdminUsers } from './pages/admin/AdminUsers.jsx';
import { AdminAudit } from './pages/admin/AdminAudit.jsx';
import { AdminSettings } from './pages/admin/AdminSettings.jsx';

// Student Portal
import { StudentLayout } from './components/student/StudentLayout.jsx';
import { StudentDashboard } from './pages/student/StudentDashboard.jsx';
import { DSASheet } from './pages/student/DSASheet.jsx';
import { TestsHub } from './pages/student/TestsHub.jsx';
import { TestRunner } from './pages/student/TestRunner.jsx';
import { TestResult } from './pages/student/TestResult.jsx';
import { CompanyProfiles } from './pages/student/CompanyProfiles.jsx';
import { LearningResources } from './pages/student/LearningResources.jsx';
import { ResumeAnalyzer } from './pages/ResumeAnalyzer.jsx';
import { MockInterview } from './pages/MockInterview.jsx';
import { ReadinessReport } from './pages/ReadinessReport.jsx';
import { ProfilePage } from './pages/ProfilePage.jsx';

import './App.css';

// Root redirect based on role
const RootRedirect = () => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0f172a',
        color: '#f8fafc',
        fontFamily: 'sans-serif'
      }}>
        <h2>Loading Institutional Placement Portal...</h2>
      </div>
    );
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  const role = (user.role === 'admin' || user.role === 'tpo_admin') ? 'admin' : 'student';
  if (role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  }
  return <Navigate to="/student/dashboard" replace />;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Root & Login */}
          <Route path="/" element={<RootRedirect />} />
          <Route path="/login" element={<Login />} />

          {/* TPO / Admin Portal Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="students" element={<AdminStudents />} />
            <Route path="students/:id" element={<AdminStudentDetail />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route path="shortlisting" element={<AdminShortlisting />} />
            <Route path="drives" element={<AdminDrives />} />
            <Route path="questions" element={<AdminQuestions />} />
            <Route path="weights" element={<AdminWeights />} />
            <Route path="notifications" element={<AdminNotifications />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="messages" element={<AdminMessages />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="audit" element={<AdminAudit />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
          </Route>

          {/* Student Portal Routes */}
          <Route
            path="/student"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/student/dashboard" replace />} />
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="dsa" element={<DSASheet />} />
            <Route path="tests" element={<TestsHub />} />
            <Route path="tests/:id/run" element={<TestRunner />} />
            <Route path="tests/:id/result" element={<TestResult />} />
            <Route path="resume" element={<ResumeAnalyzer />} />
            <Route path="interview" element={<MockInterview />} />
            <Route path="companies" element={<CompanyProfiles />} />
            <Route path="resources" element={<LearningResources />} />
            <Route path="report" element={<ReadinessReport />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="*" element={<Navigate to="/student/dashboard" replace />} />
          </Route>

          {/* Catch-all fallback */}
          <Route path="*" element={<RootRedirect />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
