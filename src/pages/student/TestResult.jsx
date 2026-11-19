import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Award,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Clock,
  ShieldAlert,
  RotateCcw,
  Sparkles
} from 'lucide-react';

export const TestResult = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const result = location.state?.result;
  const test = location.state?.test;

  if (!result) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem' }}>
        <h3>Test result not found.</h3>
        <button
          onClick={() => navigate('/student/tests')}
          style={{ marginTop: '1rem', padding: '0.55rem 1.25rem', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
        >
          Back to Tests Hub
        </button>
      </div>
    );
  }

  const scorePct = result.scorePercentage ?? 0;
  const isPassed = scorePct >= 65;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '960px', margin: '0 auto' }}>
      {/* Top Banner */}
      <div style={{
        background: isPassed ? 'linear-gradient(135deg, #065f46 0%, #047857 100%)' : 'linear-gradient(135deg, #991b1b 0%, #b91c1c 100%)',
        color: '#ffffff',
        borderRadius: '20px',
        padding: '2.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <span style={{ background: 'rgba(255,255,255,0.2)', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>
            TEST COMPLETED
          </span>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, margin: '0.5rem 0' }}>
            {test?.title || 'Standardized Assessment'}
          </h1>
          <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.9 }}>
            Your assessment results have been submitted and automatically updated your Aptitude & Core readiness pillar.
          </p>
        </div>

        <div style={{
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          padding: '1.25rem 2rem',
          textAlign: 'center',
          border: '1px solid rgba(255, 255, 255, 0.25)'
        }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em' }}>ACCURACY SCORE</div>
          <div style={{ fontSize: '3rem', fontWeight: 900 }}>{scorePct}%</div>
          <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>{isPassed ? 'Benchmark Qualified' : 'Needs Practice'}</div>
        </div>
      </div>

      {/* Summary KPI Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
        <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Correct Answers</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#16a34a', marginTop: '0.25rem' }}>
            {result.correctCount} / {result.totalQuestions}
          </div>
        </div>

        <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Wrong Answers</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#dc2626', marginTop: '0.25rem' }}>
            {result.wrongCount}
          </div>
        </div>

        <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Time Taken</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginTop: '0.25rem' }}>
            {Math.round((result.timeTakenSeconds || 600) / 60)} mins
          </div>
        </div>

        <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Window Switches</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: (result.tabSwitchCount || 0) > 2 ? '#dc2626' : '#16a34a', marginTop: '0.25rem' }}>
            {result.tabSwitchCount || 0}
          </div>
        </div>
      </div>

      {/* Question by Question Review */}
      <div style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '1.75rem' }}>
        <h3 style={{ margin: '0 0 1.25rem 0', fontSize: '1.15rem', fontWeight: 800 }}>Comprehensive Question Review</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {(result.review || []).map((item, idx) => (
            <div key={idx} style={{
              padding: '1.25rem',
              borderRadius: '10px',
              border: '1px solid #e2e8f0',
              background: item.isCorrect ? '#f0fdf4' : '#fef2f2'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#0f172a' }}>
                  Q{idx + 1}. {item.question}
                </div>
                <span style={{
                  padding: '0.2rem 0.5rem',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  background: item.isCorrect ? '#dcfce7' : '#fee2e2',
                  color: item.isCorrect ? '#15803d' : '#b91c1c'
                }}>
                  {item.isCorrect ? 'Correct (+1.0)' : 'Incorrect (-0.25)'}
                </span>
              </div>

              <div style={{ marginTop: '0.75rem', fontSize: '0.82rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <div>Your Answer: <strong>{item.selectedOption !== undefined ? item.selectedOption : 'Unanswered'}</strong></div>
                <div>Correct Answer: <strong style={{ color: '#16a34a' }}>{item.correctOption}</strong></div>
              </div>

              {item.explanation && (
                <div style={{ marginTop: '0.75rem', background: '#ffffff', padding: '0.65rem 0.85rem', borderRadius: '6px', fontSize: '0.78rem', color: '#475569', border: '1px solid #e2e8f0' }}>
                  <strong>Explanation:</strong> {item.explanation}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button
          onClick={() => navigate('/student/tests')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: '#ffffff',
            border: '1px solid #cbd5e1',
            padding: '0.65rem 1.25rem',
            borderRadius: '8px',
            fontSize: '0.85rem',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          <ArrowLeft size={16} /> Return to Tests Hub
        </button>

        <button
          onClick={() => navigate('/student/dashboard')}
          style={{
            background: '#2563eb',
            color: 'white',
            border: 'none',
            padding: '0.65rem 1.5rem',
            borderRadius: '8px',
            fontSize: '0.85rem',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          View Updated Readiness Dashboard
        </button>
      </div>
    </div>
  );
};
