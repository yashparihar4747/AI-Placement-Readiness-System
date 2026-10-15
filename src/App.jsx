import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { Navbar } from './components/Navbar.jsx';
import { Login } from './pages/Login.jsx';
import { Dashboard } from './pages/Dashboard.jsx';
import { DSATracker } from './pages/DSATracker.jsx';
import { AptitudeTests } from './pages/AptitudeTests.jsx';
import { ResumeAnalyzer } from './pages/ResumeAnalyzer.jsx';
import { MockInterview } from './pages/MockInterview.jsx';
import { ReadinessReport } from './pages/ReadinessReport.jsx';
import { ProfilePage } from './pages/ProfilePage.jsx';
import './App.css';

const MainApp = () => {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

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
        <h2>Loading Placement Readiness System...</h2>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <div className="app-container">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="main-layout">
        {activeTab === 'dashboard' && <Dashboard setActiveTab={setActiveTab} />}
        {activeTab === 'dsa' && <DSATracker />}
        {activeTab === 'aptitude' && <AptitudeTests />}
        {activeTab === 'resume' && <ResumeAnalyzer />}
        {activeTab === 'interview' && <MockInterview />}
        {activeTab === 'report' && <ReadinessReport />}
        {activeTab === 'profile' && <ProfilePage />}
      </main>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
