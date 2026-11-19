import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import {
  Award,
  Code2,
  FileText,
  Video,
  TrendingUp,
  Flame,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  BookOpen,
  Calendar,
  Building
} from 'lucide-react';

export const StudentDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [dashData, setDashData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.getStudentDashboard();
        if (res.success) {
          setDashData(res);
        }
      } catch (err) {
        console.error('Failed to load student dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>Evaluating your placement readiness profile...</div>;
  }

  const profile = dashData?.profile || {};
  const score = dashData?.readinessScore ?? 75;
  const pillars = dashData?.pillars || { dsa: 80, aptitude: 75, resume: 70, interview: 75 };
  const tierScores = dashData?.tierScores || {};
  const dailyProblem = dashData?.dailyProblem || { title: 'Two Sum (HashMap)', topic: 'Arrays', difficulty: 'Easy' };
  const badges = dashData?.badges || [
    { title: '30-Day Streak', desc: 'Maintained 30 days active practice', icon: '🔥' },
    { title: 'DSA Ace', desc: 'Solved 50+ Algorithmic Problems', icon: '💻' },
    { title: 'ATS Certified', desc: 'Resume score above 80%', icon: '📄' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Hero Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        color: '#ffffff',
        borderRadius: '20px',
        padding: '2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.3)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
            <span style={{ background: '#3b82f6', color: 'white', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>
              {profile.branch || 'Information Technology'}
            </span>
            <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Roll: {profile.rollNo || '23IT17'} • Batch {profile.batch || '2026'}</span>
          </div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>
            Welcome back, {profile.name || user?.name || 'Ganpat Singh'}!
          </h1>
          <p style={{ color: '#cbd5e1', fontSize: '0.92rem', marginTop: '0.4rem', margin: 0 }}>
            Targeting <strong>{profile.targetTier === 'tier1' ? 'Tier-1 Product Companies' : profile.targetTier === 'tier2' ? 'Tier-2 Service Companies' : 'Core/PSU Companies'}</strong> ({profile.targetRole || 'Software Development Engineer'}).
          </p>
        </div>

        {/* Readiness Index Dial Card */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.06)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '16px',
          padding: '1.25rem 2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1.5rem',
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700, letterSpacing: '0.05em' }}>
              READINESS SCORE
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: score >= 75 ? '#4ade80' : score >= 60 ? '#facc15' : '#f87171' }}>
              {score}%
            </div>
            <div style={{ fontSize: '0.75rem', color: '#cbd5e1', fontWeight: 600 }}>
              {dashData?.status || (score >= 75 ? 'Placement Ready' : 'Developing')}
            </div>
          </div>

          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.8rem'
          }}>
            🎯
          </div>
        </div>
      </div>

      {/* 4 Pillars Progression Grid */}
      <div>
        <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
          Your 4 Placement Pillars
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem' }}>
          {/* DSA */}
          <div
            onClick={() => navigate('/student/dsa')}
            style={{
              background: '#ffffff',
              borderRadius: '14px',
              border: '1px solid #e2e8f0',
              padding: '1.5rem',
              cursor: 'pointer',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.05)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{ background: '#eff6ff', color: '#2563eb', padding: '0.5rem', borderRadius: '10px' }}>
                  <Code2 size={22} />
                </div>
                <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#2563eb' }}>{pillars.dsa}%</span>
              </div>
              <h4 style={{ margin: '0 0 0.35rem 0', fontSize: '1rem', fontWeight: 700 }}>DSA Mastery</h4>
              <p style={{ margin: 0, fontSize: '0.78rem', color: '#64748b' }}>60+ curated problem sheet with complexity & hints</p>
            </div>
            <div style={{ marginTop: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#2563eb', fontSize: '0.8rem', fontWeight: 600 }}>
              <span>Practice DSA Sheet</span> <ArrowRight size={14} />
            </div>
          </div>

          {/* Aptitude & Tests */}
          <div
            onClick={() => navigate('/student/tests')}
            style={{
              background: '#ffffff',
              borderRadius: '14px',
              border: '1px solid #e2e8f0',
              padding: '1.5rem',
              cursor: 'pointer',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.05)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{ background: '#f0fdf4', color: '#16a34a', padding: '0.5rem', borderRadius: '10px' }}>
                  <Award size={22} />
                </div>
                <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#16a34a' }}>{pillars.aptitude}%</span>
              </div>
              <h4 style={{ margin: '0 0 0.35rem 0', fontSize: '1rem', fontWeight: 700 }}>Aptitude & Core CS</h4>
              <p style={{ margin: 0, fontSize: '0.78rem', color: '#64748b' }}>400+ MCQs across Quant, Logical, OS, DBMS & CN</p>
            </div>
            <div style={{ marginTop: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#16a34a', fontSize: '0.8rem', fontWeight: 600 }}>
              <span>Attempt Tests</span> <ArrowRight size={14} />
            </div>
          </div>

          {/* Resume */}
          <div
            onClick={() => navigate('/student/resume')}
            style={{
              background: '#ffffff',
              borderRadius: '14px',
              border: '1px solid #e2e8f0',
              padding: '1.5rem',
              cursor: 'pointer',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.05)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{ background: '#faf5ff', color: '#9333ea', padding: '0.5rem', borderRadius: '10px' }}>
                  <FileText size={22} />
                </div>
                <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#9333ea' }}>{pillars.resume}%</span>
              </div>
              <h4 style={{ margin: '0 0 0.35rem 0', fontSize: '1rem', fontWeight: 700 }}>ATS Resume Analysis</h4>
              <p style={{ margin: 0, fontSize: '0.78rem', color: '#64748b' }}>Keyword matching, impact metrics, and tier suitability</p>
            </div>
            <div style={{ marginTop: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#9333ea', fontSize: '0.8rem', fontWeight: 600 }}>
              <span>Scan Resume</span> <ArrowRight size={14} />
            </div>
          </div>

          {/* AI Mock Interview */}
          <div
            onClick={() => navigate('/student/interview')}
            style={{
              background: '#ffffff',
              borderRadius: '14px',
              border: '1px solid #e2e8f0',
              padding: '1.5rem',
              cursor: 'pointer',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.05)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{ background: '#fffbeb', color: '#d97706', padding: '0.5rem', borderRadius: '10px' }}>
                  <Video size={22} />
                </div>
                <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#d97706' }}>{pillars.interview}%</span>
              </div>
              <h4 style={{ margin: '0 0 0.35rem 0', fontSize: '1rem', fontWeight: 700 }}>AI Mock Interview</h4>
              <p style={{ margin: 0, fontSize: '0.78rem', color: '#64748b' }}>Adaptive technical & HR questions with rubric feedback</p>
            </div>
            <div style={{ marginTop: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#d97706', fontSize: '0.8rem', fontWeight: 600 }}>
              <span>Start Interview</span> <ArrowRight size={14} />
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Daily Problem of the Day + Streak & Badges */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem' }}>
        {/* Daily Problem of the Day */}
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          padding: '1.75rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span style={{ background: '#fef3c7', color: '#b45309', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>
                PROBLEM OF THE DAY
              </span>
              <span style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                padding: '0.15rem 0.45rem',
                borderRadius: '4px',
                background: dailyProblem.difficulty === 'Easy' ? '#ecfdf5' : '#fffbeb',
                color: dailyProblem.difficulty === 'Easy' ? '#065f46' : '#92400e'
              }}>
                {dailyProblem.difficulty}
              </span>
            </div>
            <h3 style={{ margin: '0 0 0.35rem 0', fontSize: '1.2rem', fontWeight: 800 }}>
              {dailyProblem.title}
            </h3>
            <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748b' }}>
              Topic: <strong>{dailyProblem.topic}</strong>. Solving this earns +10 XP and reinforces your DSA readiness pillar.
            </p>
          </div>

          <button
            onClick={() => navigate('/student/dsa')}
            style={{
              background: '#2563eb',
              color: 'white',
              border: 'none',
              padding: '0.65rem 1.25rem',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            Solve On Sheet
          </button>
        </div>

        {/* Streak & Badges */}
        <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Flame size={20} color="#ea580c" />
              <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700 }}>30-Day Activity Streak</h3>
            </div>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#ea580c' }}>Active 🔥</span>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            {badges.map((b, idx) => (
              <div key={idx} style={{
                flex: 1,
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                padding: '0.75rem',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '1.4rem' }}>{b.icon}</div>
                <div style={{ fontWeight: 700, fontSize: '0.8rem', marginTop: '0.25rem' }}>{b.title}</div>
                <div style={{ fontSize: '0.68rem', color: '#64748b' }}>{b.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
