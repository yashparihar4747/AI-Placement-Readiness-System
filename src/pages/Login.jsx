import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import {
  GraduationCap,
  ShieldCheck,
  User,
  Sparkles,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Key
} from 'lucide-react';

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState('student'); // 'student' | 'tpo'
  const [email, setEmail] = useState('ganpat@geca.demo');
  const [password, setPassword] = useState('Demo@1234');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(location.state?.unauthorizedToast ? 'Access denied. Administrative role required for the requested resource.' : '');

  const heroStudents = [
    { name: 'Ganpat Singh', email: 'ganpat@geca.demo', desc: 'Top Performer (~82 Product, 55+ DSA)', badge: 'Hero Top' },
    { name: 'Ronak Singh Rawat', email: 'ronak@geca.demo', desc: 'Balanced (~70 Service-Based)', badge: 'Balanced' },
    { name: 'Jagdish Singh Rawat', email: 'jagdish@geca.demo', desc: 'Weak Resume, Strong Aptitude', badge: 'Developing' },
    { name: 'Yash Parihar', email: 'yash@geca.demo', desc: 'Beginner (~35) for Next-Steps demo', badge: 'Beginner' },
    { name: 'Priya Meena', email: 'priya@geca.demo', desc: 'Core / PSU Focused (90+)', badge: 'Core Ready' },
    { name: 'Neha Choudhary', email: 'neha@geca.demo', desc: 'Fresh Empty Account (Live 0 demo)', badge: 'Fresh' },
    { name: 'Rahul Verma', email: 'rahul@geca.demo', desc: 'Inactive 20 Days (TPO At-Risk Flag)', badge: 'At-Risk' },
    { name: 'Sneha Gupta', email: 'sneha@geca.demo', desc: 'Rapidly Improving (Steep Trend)', badge: 'Fast Growth' },
  ];

  const tpoAccounts = [
    { name: 'Dr. R. K. Sharma', email: 'tpo@geca.demo', desc: 'Head TPO - Full Authority, Main Demo', badge: 'Head TPO' },
    { name: 'Mrs. Anita Joshi', email: 'tpo2@geca.demo', desc: 'Training Officer - Multi-TPO & Users', badge: 'Training Officer' },
  ];

  const handleLoginSubmit = async (e) => {
    if (e) e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const res = await login(email, password);
      if (res && res.success) {
        const role = (res.user.role === 'tpo_admin' || res.user.role === 'admin') ? 'admin' : 'student';
        if (role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/student/dashboard');
        }
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSelectDemoAccount = (accEmail, isTpo = false) => {
    setEmail(accEmail);
    setPassword('Demo@1234');
    setActiveTab(isTpo ? 'tpo' : 'student');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(circle at top right, #1e1b4b 0%, #0f172a 100%)',
      padding: '2rem 1rem',
      color: '#f8fafc',
      fontFamily: 'sans-serif'
    }}>
      <div style={{
        maxWidth: '1100px',
        width: '100%',
        display: 'grid',
        gridTemplateColumns: '1.2fr 1fr',
        gap: '2.5rem',
        background: 'rgba(255, 255, 255, 0.04)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: '24px',
        padding: '2.5rem',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
      }}>
        {/* Left Side: Institutional Overview & Demo Click Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{
                background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                padding: '0.65rem',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <GraduationCap size={28} color="white" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>Govt. Engineering College, Ajmer</h3>
                <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Training & Placement Portal 2026-27</span>
              </div>
            </div>

            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, lineHeight: 1.25, marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>
              AI Placement Readiness & TPO Administration Portal
            </h1>

            <p style={{ color: '#cbd5e1', fontSize: '0.85rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
              Unified platform delivering 4-pillar readiness analytics (DSA, Aptitude, Resume, Interview), automated drive shortlisting, and institutional batch reporting.
            </p>

            {/* Quick-Click Demo Evaluator Cards */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#38bdf8', fontWeight: 700 }}>
                  Demo Accounts (Click to Auto-Fill)
                </span>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>All Passwords: Demo@1234</span>
              </div>

              {/* TPO Staff Demo Accounts */}
              <div style={{ marginBottom: '0.85rem' }}>
                <div style={{ fontSize: '0.7rem', color: '#f59e0b', fontWeight: 700, marginBottom: '0.35rem' }}>TPO ADMINISTRATION:</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  {tpoAccounts.map((t) => (
                    <div
                      key={t.email}
                      onClick={() => handleSelectDemoAccount(t.email, true)}
                      style={{
                        background: email === t.email ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                        border: email === t.email ? '1px solid #f59e0b' : '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '8px',
                        padding: '0.5rem 0.65rem',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{ fontWeight: 700, fontSize: '0.8rem', color: '#fbbf24' }}>{t.name}</div>
                      <div style={{ fontSize: '0.68rem', color: '#cbd5e1' }}>{t.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hero Students */}
              <div>
                <div style={{ fontSize: '0.7rem', color: '#38bdf8', fontWeight: 700, marginBottom: '0.35rem' }}>STUDENT STORYLINES:</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem', maxHeight: '170px', overflowY: 'auto' }}>
                  {heroStudents.map((s) => (
                    <div
                      key={s.email}
                      onClick={() => handleSelectDemoAccount(s.email, false)}
                      style={{
                        background: email === s.email ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                        border: email === s.email ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '8px',
                        padding: '0.45rem 0.65rem',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.78rem' }}>{s.name}</span>
                        <span style={{ fontSize: '0.62rem', background: 'rgba(255,255,255,0.1)', padding: '0.1rem 0.35rem', borderRadius: '4px', color: '#93c5fd' }}>{s.badge}</span>
                      </div>
                      <div style={{ fontSize: '0.68rem', color: '#94a3b8', marginTop: '0.15rem' }}>{s.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Auth Form */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.6)',
          borderRadius: '16px',
          padding: '2rem',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
          {/* Tabs: Student vs TPO */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '0.25rem',
            borderRadius: '10px',
            marginBottom: '1.5rem'
          }}>
            <button
              type="button"
              onClick={() => { setActiveTab('student'); setEmail('ganpat@geca.demo'); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
                background: activeTab === 'student' ? '#3b82f6' : 'transparent',
                color: 'white',
                border: 'none',
                padding: '0.55rem',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer'
              }}
            >
              <User size={15} /> Student Login
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('tpo'); setEmail('tpo@geca.demo'); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
                background: activeTab === 'tpo' ? '#f59e0b' : 'transparent',
                color: activeTab === 'tpo' ? '#0f172a' : 'white',
                border: 'none',
                padding: '0.55rem',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer'
              }}
            >
              <ShieldCheck size={16} /> TPO Portal
            </button>
          </div>

          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: '0 0 0.5rem 0' }}>
            {activeTab === 'tpo' ? 'TPO Officer Sign In' : 'Student Access Portal'}
          </h2>
          <p style={{ margin: '0 0 1.25rem 0', fontSize: '0.82rem', color: '#94a3b8' }}>
            {activeTab === 'tpo' ? 'Authorized access restricted to GECA placement committee.' : 'Access your readiness score, practice tests, and company drives.'}
          </p>

          {error && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid #ef4444',
              borderRadius: '8px',
              padding: '0.65rem 0.85rem',
              color: '#fca5a5',
              fontSize: '0.82rem',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#cbd5e1', display: 'block', marginBottom: '0.35rem' }}>
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  background: 'rgba(0, 0, 0, 0.2)',
                  color: 'white',
                  fontSize: '0.9rem',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#cbd5e1', display: 'block', marginBottom: '0.35rem' }}>
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  background: 'rgba(0, 0, 0, 0.2)',
                  color: 'white',
                  fontSize: '0.9rem',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              style={{
                marginTop: '0.5rem',
                background: activeTab === 'tpo' ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'linear-gradient(135deg, #3b82f6, #6366f1)',
                color: activeTab === 'tpo' ? '#0f172a' : 'white',
                border: 'none',
                padding: '0.75rem',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.95rem',
                cursor: submitting ? 'default' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              {submitting ? 'Authenticating...' : `Enter ${activeTab === 'tpo' ? 'TPO Portal' : 'Student Portal'}`}
              <ArrowRight size={16} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
