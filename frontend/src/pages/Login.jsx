import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { GraduationCap, Sparkles, CheckCircle, ArrowRight, ShieldCheck } from 'lucide-react';

export const Login = () => {
  const { login, register } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [rollNo, setRollNo] = useState('23IT17');
  const [branch, setBranch] = useState('Computer Science & Engineering');
  const [targetTier, setTargetTier] = useState('tier1');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      if (isRegister) {
        await register({ name, email, password, rollNo, branch, targetTier });
      } else {
        await login(email, password);
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickDemoLogin = async () => {
    setError('');
    setSubmitting(true);
    try {
      await login('ganpat.singh@ecajmer.ac.in', 'password123');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(circle at top right, #312e81 0%, #0f172a 100%)',
      padding: '2rem 1rem',
      color: '#f8fafc'
    }}>
      <div style={{
        maxWidth: '1000px',
        width: '100%',
        display: 'grid',
        gridTemplateColumns: '1.2fr 1fr',
        gap: '2.5rem',
        background: 'rgba(255, 255, 255, 0.04)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: '24px',
        padding: '3rem',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
      }}>
        {/* Left Info Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
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
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Govt. Engineering College, Ajmer</h3>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Department of Computer Science & Engineering</span>
              </div>
            </div>

            <h1 style={{ fontSize: '2.25rem', fontWeight: 800, lineHeight: 1.2, marginBottom: '1rem', letterSpacing: '-0.02em' }}>
              AI-Based Placement Preparation & Readiness Tracking System
            </h1>

            <p style={{ color: '#cbd5e1', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '2rem' }}>
              A unified platform consolidating DSA practice, aptitude performance, ATS resume analytics,
              and adaptive AI mock interviews into an actionable, tier-segmented placement readiness score.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {[
                'Multi-Tier AI Scoring Engine (Product, Service, and Core/PSU)',
                'ATS-Compliant Resume Analyzer with Job Description matching',
                'Adaptive AI Mock Interview with real-time rubric scoring',
                'Curated DSA Roadmap & Timed Aptitude Assessment Engine'
              ].map((text, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.88rem', color: '#e2e8f0' }}>
                  <CheckCircle size={18} color="#34d399" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{
            marginTop: '2.5rem',
            paddingTop: '1.5rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            fontSize: '0.82rem',
            color: '#94a3b8'
          }}>
            GECA/CSE/2026 • Lead Student: Ganpat Singh (Roll No: 23IT17)
          </div>
        </div>

        {/* Right Form Card */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.98)',
          borderRadius: '20px',
          padding: '2.25rem',
          color: '#0f172a',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>
              {isRegister ? 'Student Registration' : 'Student Sign In'}
            </h2>
            <button
              type="button"
              onClick={() => { setIsRegister(!isRegister); setError(''); }}
              style={{
                background: 'none',
                border: 'none',
                color: '#4f46e5',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer'
              }}
            >
              {isRegister ? 'Already registered? Log in' : 'New student? Register'}
            </button>
          </div>

          {error && (
            <div style={{
              background: '#fef2f2',
              color: '#dc2626',
              padding: '0.65rem 0.9rem',
              borderRadius: '8px',
              fontSize: '0.85rem',
              marginBottom: '1rem',
              border: '1px solid #fecaca'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {isRegister && (
              <>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.35rem', color: '#334155' }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ganpat Singh"
                    className="input-control"
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.35rem', color: '#334155' }}>
                      Roll Number
                    </label>
                    <input
                      type="text"
                      required
                      value={rollNo}
                      onChange={(e) => setRollNo(e.target.value)}
                      placeholder="23IT17"
                      className="input-control"
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.35rem', color: '#334155' }}>
                      Target Tier
                    </label>
                    <select
                      value={targetTier}
                      onChange={(e) => setTargetTier(e.target.value)}
                      className="input-control"
                    >
                      <option value="tier1">Tier 1: Product-Based</option>
                      <option value="tier2">Tier 2: Service-Based</option>
                      <option value="tier3">Tier 3: Core / PSU</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.35rem', color: '#334155' }}>
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ganpat.singh@ecajmer.ac.in"
                className="input-control"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.35rem', color: '#334155' }}>
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input-control"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem', padding: '0.75rem' }}
            >
              {submitting ? 'Authenticating...' : (isRegister ? 'Complete Registration' : 'Sign In to Dashboard')}
              <ArrowRight size={18} />
            </button>
          </form>

          {/* Quick Demo Access */}
          <div style={{ marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: '1px solid #e2e8f0', textAlign: 'center' }}>
            <span style={{ fontSize: '0.78rem', color: '#64748b', display: 'block', marginBottom: '0.75rem' }}>
              Examiner & Teacher Quick Demo Access:
            </span>
            <button
              type="button"
              onClick={handleQuickDemoLogin}
              disabled={submitting}
              style={{
                width: '100%',
                background: '#f1f5f9',
                color: '#312e81',
                border: '1px solid #cbd5e1',
                padding: '0.65rem 1rem',
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                transition: 'background 0.2s'
              }}
            >
              <Sparkles size={16} color="#6366f1" />
              ⚡ Instant Demo Login (Ganpat Singh - 23IT17)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
