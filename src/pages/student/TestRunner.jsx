import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../services/api.js';
import {
  Clock,
  AlertTriangle,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  ShieldAlert,
  Send
} from 'lucide-react';

export const TestRunner = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [test, setTest] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Runner state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { [qId]: selectedOptionIndex }
  const [timeLeft, setTimeLeft] = useState(1800); // in seconds
  const [tabSwitches, setTabSwitches] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Load Test Details
  useEffect(() => {
    const fetchTest = async () => {
      try {
        const res = await api.getTestDetails(id);
        if (res.success && res.test) {
          setTest(res.test);
          setQuestions(res.questions || []);
          setTimeLeft((res.test.durationMinutes || 30) * 60);
        }
      } catch (err) {
        console.error('Failed to load test runner:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTest();
  }, [id]);

  // Tab switch detection (Anti-cheating proctoring)
  useEffect(() => {
    const handleBlur = () => {
      setTabSwitches(prev => {
        const next = prev + 1;
        setShowWarning(true);
        return next;
      });
    };

    window.addEventListener('blur', handleBlur);
    return () => window.removeEventListener('blur', handleBlur);
  }, []);

  // Timer countdown
  useEffect(() => {
    if (loading || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [loading, timeLeft]);

  const handleSelectOption = (qId, optionIdx) => {
    setAnswers(prev => ({
      ...prev,
      [qId]: optionIdx
    }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const payload = {
        answers,
        tabSwitchCount: tabSwitches,
        timeTakenSeconds: ((test?.durationMinutes || 30) * 60) - timeLeft
      };
      const res = await api.submitTest(id, payload);
      if (res.success) {
        navigate(`/student/tests/${id}/result`, { state: { result: res.result, test } });
      }
    } catch (err) {
      alert(err.message);
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>Initializing secure examination environment...</div>;
  }

  if (!test || questions.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem' }}>
        <h3>Test questions could not be loaded.</h3>
        <button onClick={() => navigate('/student/tests')} style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}>
          Back to Tests Hub
        </button>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const answeredCount = Object.keys(answers).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Top Test Banner */}
      <div style={{
        background: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        padding: '1rem 1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800 }}>{test.title}</h2>
          <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
            Question {currentIndex + 1} of {questions.length} • {answeredCount} answered
          </div>
        </div>

        {/* Timer */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: timeLeft < 300 ? '#fef2f2' : '#f8fafc',
          border: `1px solid ${timeLeft < 300 ? '#fca5a5' : '#cbd5e1'}`,
          padding: '0.5rem 1rem',
          borderRadius: '8px',
          color: timeLeft < 300 ? '#dc2626' : '#0f172a',
          fontWeight: 800,
          fontSize: '1.1rem'
        }}>
          <Clock size={18} color={timeLeft < 300 ? '#dc2626' : '#2563eb'} />
          <span>{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</span>
        </div>
      </div>

      {/* Anti-Cheating Warning Banner */}
      {showWarning && (
        <div style={{
          background: '#fff1f2',
          border: '1px solid #fecdd3',
          borderRadius: '8px',
          padding: '0.75rem 1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          color: '#9f1239',
          fontSize: '0.85rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldAlert size={18} color="#e11d48" />
            <span>
              <strong>Proctoring Notice:</strong> Window / tab switch detected ({tabSwitches} times). Tab switches are permanently recorded in the TPO performance audit dossier.
            </span>
          </div>
          <button
            onClick={() => setShowWarning(false)}
            style={{ background: 'none', border: 'none', color: '#9f1239', fontWeight: 700, cursor: 'pointer' }}
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Runner Layout: Question area + Palette */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '1.5rem' }}>
        {/* Left: Question Box */}
        <div style={{
          background: '#ffffff',
          borderRadius: '14px',
          border: '1px solid #e2e8f0',
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          minHeight: '480px'
        }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, background: '#eff6ff', color: '#1d4ed8', padding: '0.2rem 0.6rem', borderRadius: '4px' }}>
                {currentQ.topic || test.category}
              </span>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                Difficulty: <strong>{currentQ.difficulty || 'Medium'}</strong>
              </span>
            </div>

            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, lineHeight: 1.5, margin: '0 0 1.5rem 0', color: '#0f172a' }}>
              {currentQ.title || currentQ.question}
            </h3>

            {/* Options */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {(currentQ.options || []).map((opt, oIdx) => {
                const isSelected = answers[currentQ.id] === oIdx;
                return (
                  <div
                    key={oIdx}
                    onClick={() => handleSelectOption(currentQ.id, oIdx)}
                    style={{
                      padding: '0.85rem 1.25rem',
                      borderRadius: '10px',
                      border: isSelected ? '2px solid #2563eb' : '1px solid #cbd5e1',
                      background: isSelected ? '#eff6ff' : '#ffffff',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      fontSize: '0.9rem',
                      fontWeight: isSelected ? 600 : 400,
                      color: isSelected ? '#1d4ed8' : '#334155',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      border: isSelected ? '2px solid #2563eb' : '1px solid #94a3b8',
                      background: isSelected ? '#2563eb' : 'transparent',
                      color: isSelected ? 'white' : '#64748b',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {String.fromCharCode(65 + oIdx)}
                    </div>
                    <span>{opt}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Question Controls */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '1.25rem', marginTop: '1.5rem' }}>
            <button
              onClick={() => setCurrentIndex(i => Math.max(0, i - 1))}
              disabled={currentIndex === 0}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: currentIndex === 0 ? '#f1f5f9' : '#ffffff',
                border: '1px solid #cbd5e1',
                color: currentIndex === 0 ? '#94a3b8' : '#334155',
                padding: '0.55rem 1rem',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: currentIndex === 0 ? 'default' : 'pointer'
              }}
            >
              <ArrowLeft size={16} /> Previous
            </button>

            {currentIndex < questions.length - 1 ? (
              <button
                onClick={() => setCurrentIndex(i => i + 1)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  background: '#2563eb',
                  border: 'none',
                  color: 'white',
                  padding: '0.55rem 1.25rem',
                  borderRadius: '8px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Next <ArrowRight size={16} />
              </button>
            ) : (
              <button
                onClick={() => setShowSubmitModal(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  background: '#16a34a',
                  border: 'none',
                  color: 'white',
                  padding: '0.55rem 1.25rem',
                  borderRadius: '8px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Submit Exam <CheckCircle size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Right: Question Palette */}
        <div style={{
          background: '#ffffff',
          borderRadius: '14px',
          border: '1px solid #e2e8f0',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <h4 style={{ margin: '0 0 1rem 0', fontSize: '0.95rem', fontWeight: 700 }}>Question Palette</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.5rem' }}>
              {questions.map((q, idx) => {
                const isAnswered = answers[q.id] !== undefined;
                const isCurrent = currentIndex === idx;
                return (
                  <button
                    key={q.id || idx}
                    onClick={() => setCurrentIndex(idx)}
                    style={{
                      height: '38px',
                      borderRadius: '8px',
                      border: isCurrent ? '2px solid #2563eb' : '1px solid #cbd5e1',
                      background: isAnswered ? '#ecfdf5' : isCurrent ? '#eff6ff' : '#ffffff',
                      color: isAnswered ? '#15803d' : isCurrent ? '#1d4ed8' : '#334155',
                      fontWeight: 700,
                      fontSize: '0.82rem',
                      cursor: 'pointer'
                    }}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ marginTop: '1.5rem', borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
            <button
              onClick={() => setShowSubmitModal(true)}
              style={{
                width: '100%',
                background: '#10b981',
                color: 'white',
                border: 'none',
                padding: '0.65rem',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.88rem',
                cursor: 'pointer'
              }}
            >
              Finalize & Submit Test
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Submit Modal */}
      {showSubmitModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(15, 23, 42, 0.7)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            width: '440px',
            padding: '2rem',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
          }}>
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem', fontWeight: 800 }}>Confirm Test Submission</h3>
            <p style={{ margin: '0 0 1.25rem 0', fontSize: '0.85rem', color: '#64748b' }}>
              You have answered <strong>{answeredCount}</strong> out of <strong>{questions.length}</strong> questions.
              {tabSwitches > 0 && <span style={{ color: '#dc2626', display: 'block', marginTop: '0.35rem' }}>Proctor recorded {tabSwitches} window switches.</span>}
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                onClick={() => setShowSubmitModal(false)}
                disabled={submitting}
                style={{ padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#f8fafc', cursor: 'pointer' }}
              >
                Return to Exam
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                style={{ padding: '0.6rem 1.25rem', borderRadius: '8px', border: 'none', background: '#16a34a', color: 'white', fontWeight: 700, cursor: 'pointer' }}
              >
                {submitting ? 'Submitting...' : 'Confirm Submission'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
