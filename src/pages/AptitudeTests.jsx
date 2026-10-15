import React, { useState, useEffect } from 'react';
import { api } from '../services/api.js';
import {
  Brain,
  Calculator,
  BookOpen,
  Terminal,
  Clock,
  CheckCircle,
  XCircle,
  ArrowRight,
  RotateCcw,
  Award,
  ChevronRight,
  AlertTriangle
} from 'lucide-react';

export const AptitudeTests = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [quizData, setQuizData] = useState(null);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [isTestActive, setIsTestActive] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await api.getAptitudeCategories();
        if (res.success) setCategories(res.categories);
      } catch (err) {
        console.error('Error fetching categories:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCats();
  }, []);

  // Timer countdown
  useEffect(() => {
    if (!isTestActive || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isTestActive, timeLeft]);

  const handleStartCategory = async (catId) => {
    setLoading(true);
    try {
      const res = await api.getAptitudeQuiz(catId);
      if (res.success) {
        setSelectedCategory(catId);
        setQuizData(res);
        setCurrentQIndex(0);
        setUserAnswers({});
        setTimeLeft(600);
        setIsTestActive(true);
        setTestResult(null);
      }
    } catch (err) {
      alert(err.message || 'Failed to start quiz');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (qId, optionIdx) => {
    setUserAnswers(prev => ({
      ...prev,
      [qId]: optionIdx
    }));
  };

  const handleSubmitTest = async () => {
    if (!selectedCategory || submitting) return;
    setSubmitting(true);
    try {
      const timeTaken = 600 - timeLeft;
      const res = await api.submitAptitudeQuiz(selectedCategory, userAnswers, timeTaken);
      if (res.success) {
        setTestResult(res);
        setIsTestActive(false);
      }
    } catch (err) {
      alert(err.message || 'Error submitting test');
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const getIcon = (catId) => {
    switch (catId) {
      case 'quantitative': return <Calculator size={24} color="#4f46e5" />;
      case 'logical': return <Brain size={24} color="#0284c7" />;
      case 'verbal': return <BookOpen size={24} color="#059669" />;
      case 'core_cs': return <Terminal size={24} color="#7c3aed" />;
      default: return <Brain size={24} color="#4f46e5" />;
    }
  };

  // View 1: Quiz Categories Selection
  if (!isTestActive && !testResult) {
    return (
      <div>
        <div className="page-header-box">
          <div>
            <h1 className="page-title">Aptitude & Technical Assessments</h1>
            <p className="page-subtitle">
              Timed tests designed around standardized campus recruitment aptitude screening patterns
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {categories.map((cat) => (
            <div key={cat.id} className="ui-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1rem' }}>
                  <div style={{ padding: '0.65rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    {getIcon(cat.id)}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: '#1e293b' }}>
                      {cat.title}
                    </h3>
                    <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                      {cat.questionCount} Questions • {cat.estimatedMinutes} Mins
                    </span>
                  </div>
                </div>

                <p style={{ color: '#475569', fontSize: '0.88rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                  {cat.description}
                </p>
              </div>

              <button
                onClick={() => handleStartCategory(cat.id)}
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <span>Start Timed Test</span>
                <ChevronRight size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // View 2: Active Timed Quiz Runner
  if (isTestActive && quizData) {
    const q = quizData.questions[currentQIndex];
    const totalQ = quizData.questions.length;
    const answeredCount = Object.keys(userAnswers).length;

    return (
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {/* Quiz Top Toolbar */}
        <div className="ui-card" style={{ padding: '1rem 1.5rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#1e1b4b', color: 'white' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>
              {selectedCategory?.toUpperCase()} TEST
            </h3>
            <span style={{ fontSize: '0.8rem', color: '#c7d2fe' }}>
              Question {currentQIndex + 1} of {totalQ} ({answeredCount} answered)
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', background: 'rgba(255,255,255,0.15)', padding: '0.4rem 0.85rem', borderRadius: '8px', fontWeight: 700, fontSize: '1rem' }}>
            <Clock size={18} color="#f59e0b" />
            <span style={{ color: timeLeft < 60 ? '#ef4444' : 'white' }}>{formatTime(timeLeft)}</span>
          </div>
        </div>

        {/* Question Palette Navigation */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          {quizData.questions.map((item, idx) => {
            const isAnswered = userAnswers[item.id] !== undefined;
            const isCurrent = idx === currentQIndex;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentQIndex(idx)}
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '8px',
                  border: isCurrent ? '2px solid #4f46e5' : '1px solid #cbd5e1',
                  background: isAnswered ? '#ecfdf5' : '#ffffff',
                  color: isAnswered ? '#059669' : '#334155',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  cursor: 'pointer'
                }}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>

        {/* Question Card */}
        <div className="ui-card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'inline-block', background: '#f1f5f9', color: '#475569', fontSize: '0.78rem', fontWeight: 600, padding: '0.2rem 0.6rem', borderRadius: '6px', marginBottom: '1rem' }}>
            Topic: {q.topic}
          </div>

          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', lineHeight: 1.5, marginBottom: '1.75rem' }}>
            Q{currentQIndex + 1}. {q.question}
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {q.options.map((opt, optIdx) => {
              const isSelected = userAnswers[q.id] === optIdx;
              return (
                <div
                  key={optIdx}
                  onClick={() => handleSelectOption(q.id, optIdx)}
                  className={`quiz-option-card ${isSelected ? 'selected' : ''}`}
                >
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    border: isSelected ? '2px solid #4f46e5' : '1px solid #cbd5e1',
                    background: isSelected ? '#4f46e5' : 'transparent',
                    color: isSelected ? 'white' : '#64748b',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.82rem'
                  }}>
                    {String.fromCharCode(65 + optIdx)}
                  </div>
                  <span style={{ fontSize: '0.95rem', color: isSelected ? '#1e1b4b' : '#334155' }}>
                    {opt}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            onClick={() => setCurrentQIndex(prev => Math.max(0, prev - 1))}
            disabled={currentQIndex === 0}
            className="btn-secondary"
            style={{ opacity: currentQIndex === 0 ? 0.5 : 1 }}
          >
            Previous
          </button>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            {currentQIndex < totalQ - 1 ? (
              <button
                onClick={() => setCurrentQIndex(prev => prev + 1)}
                className="btn-primary"
              >
                <span>Next Question</span>
                <ArrowRight size={16} />
              </button>
            ) : (
              <button
                onClick={handleSubmitTest}
                disabled={submitting}
                className="btn-primary"
                style={{ background: '#059669' }}
              >
                <CheckCircle size={16} />
                <span>{submitting ? 'Submitting...' : 'Finish & Submit Test'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // View 3: Post-Test Results & Explanations
  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      {/* Score Header Card */}
      <div className="ui-card" style={{ padding: '2.5rem', textAlign: 'center', marginBottom: '2rem', background: 'linear-gradient(135deg, #064e3b 0%, #047857 100%)', color: 'white' }}>
        <Award size={48} style={{ margin: '0 auto 0.75rem' }} color="#34d399" />
        <h2 style={{ fontSize: '2rem', fontWeight: 800, margin: 0 }}>
          Test Result: {testResult?.scorePercentage}%
        </h2>
        <p style={{ color: '#a7f3d0', fontSize: '1rem', marginTop: '0.5rem' }}>
          You answered <strong>{testResult?.correctCount}</strong> out of <strong>{testResult?.totalQuestions}</strong> questions correctly.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1.5rem' }}>
          <button
            onClick={() => handleStartCategory(selectedCategory)}
            className="btn-secondary"
            style={{ background: 'white', color: '#064e3b', border: 'none' }}
          >
            <RotateCcw size={16} />
            <span>Retake This Test</span>
          </button>
          <button
            onClick={() => { setTestResult(null); setIsTestActive(false); setSelectedCategory(null); }}
            className="btn-secondary"
            style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: 'none' }}
          >
            All Categories
          </button>
        </div>
      </div>

      {/* Detailed Review List */}
      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', color: '#1e293b' }}>
        Question-by-Question Detailed Explanations
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {testResult?.detailedReview?.map((rev, idx) => (
          <div key={rev.id} className="ui-card" style={{ borderLeft: `5px solid ${rev.isCorrect ? '#10b981' : '#ef4444'}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>
                QUESTION {idx + 1} • {rev.topic}
              </span>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.8rem',
                fontWeight: 700,
                color: rev.isCorrect ? '#059669' : '#dc2626'
              }}>
                {rev.isCorrect ? <CheckCircle size={16} /> : <XCircle size={16} />}
                {rev.isCorrect ? 'Correct (+1)' : 'Incorrect (0)'}
              </span>
            </div>

            <p style={{ fontWeight: 600, fontSize: '0.95rem', color: '#1e293b', marginBottom: '0.85rem' }}>
              {rev.question}
            </p>

            <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '8px', marginBottom: '0.85rem', fontSize: '0.85rem' }}>
              <div style={{ color: rev.isCorrect ? '#059669' : '#dc2626' }}>
                Your Answer: <strong>{rev.selectedOption !== null ? rev.options[rev.selectedOption] : 'Skipped'}</strong>
              </div>
              {!rev.isCorrect && (
                <div style={{ color: '#059669', marginTop: '0.25rem' }}>
                  Correct Answer: <strong>{rev.options[rev.correctAnswer]}</strong>
                </div>
              )}
            </div>

            <div style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.5, background: '#eff6ff', padding: '0.75rem', borderRadius: '8px', borderLeft: '3px solid #3b82f6' }}>
              <strong>Concept Explanation:</strong> {rev.explanation}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
