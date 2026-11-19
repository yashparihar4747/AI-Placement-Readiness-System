import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api.js';
import {
  Award,
  Clock,
  CheckCircle,
  HelpCircle,
  ArrowRight,
  TrendingUp,
  FileQuestion,
  Filter
} from 'lucide-react';

export const TestsHub = () => {
  const navigate = useNavigate();
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('');

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const res = await api.getTestsHub({ category: categoryFilter });
        if (res.success && res.tests) {
          setTests(res.tests);
        }
      } catch (err) {
        console.error('Failed to load tests hub:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTests();
  }, [categoryFilter]);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>Loading assessment test suites...</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>
            Assessment & Standardized Tests Hub
          </h2>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>
            Timed examination suites across Quantitative, Logical, Core CS (OS, DBMS, CN), and company-specific mocks.
          </p>
        </div>

        {/* Filter */}
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          style={{ padding: '0.5rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', background: '#ffffff' }}
        >
          <option value="">All Categories ({tests.length})</option>
          <option value="Aptitude">General Aptitude</option>
          <option value="Core CS">Core Computer Science</option>
          <option value="Core Engineering">Core Engineering</option>
          <option value="Company Mock">Company Specific Mocks</option>
        </select>
      </div>

      {/* Tests Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {tests.map((t) => {
          const attempt = t.userAttempt;
          return (
            <div key={t.id} style={{
              background: '#ffffff',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
            }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '0.2rem 0.5rem',
                    borderRadius: '4px',
                    background: '#eff6ff',
                    color: '#1d4ed8'
                  }}>
                    {t.category?.toUpperCase() || 'ASSESSMENT'}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', color: '#64748b' }}>
                    <Clock size={13} /> {t.durationMinutes || 30} mins
                  </div>
                </div>

                <h3 style={{ margin: '0 0 0.4rem 0', fontSize: '1.15rem', fontWeight: 800 }}>
                  {t.title}
                </h3>
                <p style={{ margin: '0 0 1rem 0', fontSize: '0.82rem', color: '#64748b', lineHeight: 1.5 }}>
                  {t.description}
                </p>

                <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '8px', fontSize: '0.8rem', display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <span>Questions: <strong>{t.questionCount || 20}</strong></span>
                  <span>Negative Marking: <strong>{t.negativeMarking ? 'Yes (-0.25)' : 'None'}</strong></span>
                </div>
              </div>

              {/* Bottom Action / Best Score */}
              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {attempt ? (
                  <div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b' }}>BEST SCORE</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: (attempt.scorePercentage || 0) >= 70 ? '#16a34a' : '#d97706' }}>
                      {attempt.scorePercentage}%
                    </div>
                  </div>
                ) : (
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Not attempted yet</span>
                )}

                <button
                  onClick={() => navigate(`/student/tests/${t.id}/run`)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    background: '#2563eb',
                    color: 'white',
                    border: 'none',
                    padding: '0.55rem 1.1rem',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  {attempt ? 'Retake Test' : 'Start Test'} <ArrowRight size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
