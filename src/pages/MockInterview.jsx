import React, { useState, useEffect } from 'react';
import { api } from '../services/api.js';
import {
  MessagesSquare,
  Bot,
  User,
  Volume2,
  VolumeX,
  Send,
  Award,
  Sparkles,
  ArrowRight,
  RotateCcw,
  CheckCircle,
  HelpCircle,
  AlertCircle
} from 'lucide-react';

export const MockInterview = () => {
  const [tiers, setTiers] = useState([]);
  const [selectedTier, setSelectedTier] = useState('tier1');
  const [role, setRole] = useState('Full Stack Software Engineer');
  const [activeSession, setActiveSession] = useState(null);
  const [studentAnswer, setStudentAnswer] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [lastEvaluation, setLastEvaluation] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [finalResult, setFinalResult] = useState(null);
  const [ttsEnabled, setTtsEnabled] = useState(true);

  useEffect(() => {
    const fetchTiers = async () => {
      try {
        const res = await api.getInterviewTiers();
        if (res.success) setTiers(res.tiers);
      } catch (err) {
        console.error('Error fetching tiers:', err);
      }
    };
    fetchTiers();
  }, []);

  // Web Speech API Text-to-Speech
  const speakText = (text) => {
    if (!ttsEnabled || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  const handleStart = async (tierId) => {
    setSubmitting(true);
    setLastEvaluation(null);
    setIsCompleted(false);
    setFinalResult(null);
    setStudentAnswer('');

    try {
      const res = await api.startInterview(tierId, role);
      if (res.success) {
        setActiveSession({
          sessionId: res.sessionId,
          tier: res.tier,
          stage: res.stage,
          totalStages: res.totalStages,
          topic: res.topic,
          question: res.question
        });
        speakText(res.question);
      }
    } catch (err) {
      alert(err.message || 'Failed to start interview session');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!studentAnswer.trim() || submitting || !activeSession) return;
    setSubmitting(true);

    try {
      const res = await api.submitInterviewAnswer(activeSession.sessionId, studentAnswer);
      if (res.success) {
        setLastEvaluation({
          scores: res.scores,
          stageScore: res.stageScore,
          critique: res.critique,
          suggestedFollowUp: res.suggestedFollowUp,
          answer: studentAnswer
        });

        if (res.isCompleted) {
          // Finish session
          const finRes = await api.finishInterview(activeSession.sessionId);
          if (finRes.success) {
            setFinalResult(finRes.interview);
            setIsCompleted(true);
          }
        } else if (res.nextQuestion) {
          setActiveSession(prev => ({
            ...prev,
            stage: res.nextQuestion.stage,
            topic: res.nextQuestion.topic,
            question: res.nextQuestion.question
          }));
          setStudentAnswer('');
          speakText(res.nextQuestion.question);
        }
      }
    } catch (err) {
      alert(err.message || 'Error submitting answer');
    } finally {
      setSubmitting(false);
    }
  };

  // View 1: Tier Selection Setup
  if (!activeSession && !finalResult) {
    return (
      <div>
        <div className="page-header-box">
          <div>
            <h1 className="page-title">AI Adaptive Mock Interview Module</h1>
            <p className="page-subtitle">
              Interactive technical interview simulation with follow-up probing and multi-dimensional rubric scoring
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {tiers.map((t) => (
            <div key={t.id} className="ui-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <span className="tier-badge badge-blue">
                  {t.id.toUpperCase()} MODULE
                </span>

                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginTop: '0.4rem', color: '#1e293b' }}>
                  {t.name}
                </h3>

                <div style={{ fontSize: '0.8rem', color: '#4f46e5', fontWeight: 600, margin: '0.5rem 0' }}>
                  Target Companies: {t.companies}
                </div>

                <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                  <strong>Evaluation Focus:</strong> {t.focus}
                </p>
              </div>

              <button
                onClick={() => handleStart(t.id)}
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <Sparkles size={16} />
                <span>Begin {t.name} Simulation</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // View 2: Final Result Scorecard
  if (finalResult) {
    return (
      <div style={{ maxWidth: '850px', margin: '0 auto' }}>
        <div className="ui-card" style={{ padding: '2.5rem', textAlign: 'center', marginBottom: '2rem', background: 'linear-gradient(135deg, #312e81 0%, #4338ca 100%)', color: 'white' }}>
          <Award size={48} style={{ margin: '0 auto 0.75rem' }} color="#fbbf24" />
          <h2 style={{ fontSize: '2.2rem', fontWeight: 900, margin: 0 }}>
            Mock Interview Score: {finalResult.overallScore}/100
          </h2>
          <p style={{ color: '#c7d2fe', fontSize: '1rem', marginTop: '0.5rem', maxWidth: '600px', margin: '0.5rem auto 0' }}>
            {finalResult.feedback}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginTop: '2rem', background: 'rgba(255,255,255,0.1)', padding: '1.25rem', borderRadius: '12px' }}>
            <div>
              <span style={{ fontSize: '0.78rem', color: '#c7d2fe', textTransform: 'uppercase', display: 'block' }}>Technical Accuracy</span>
              <span style={{ fontSize: '1.5rem', fontWeight: 800 }}>{finalResult.rubric?.technicalAccuracy}/10</span>
            </div>
            <div>
              <span style={{ fontSize: '0.78rem', color: '#c7d2fe', textTransform: 'uppercase', display: 'block' }}>Problem Solving</span>
              <span style={{ fontSize: '1.5rem', fontWeight: 800 }}>{finalResult.rubric?.problemSolving}/10</span>
            </div>
            <div>
              <span style={{ fontSize: '0.78rem', color: '#c7d2fe', textTransform: 'uppercase', display: 'block' }}>Communication</span>
              <span style={{ fontSize: '1.5rem', fontWeight: 800 }}>{finalResult.rubric?.communication}/10</span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '2rem' }}>
            <button
              onClick={() => { setActiveSession(null); setFinalResult(null); }}
              className="btn-secondary"
              style={{ background: 'white', color: '#312e81', border: 'none' }}
            >
              <RotateCcw size={16} />
              <span>Take Another Interview</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // View 3: Active Conversational Interview Console
  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      {/* Top Session Status Bar */}
      <div className="ui-card" style={{ padding: '1rem 1.5rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#0f172a', color: 'white' }}>
        <div>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>
            {activeSession.tier?.toUpperCase()} SIMULATION
          </span>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0.15rem 0 0' }}>
            Stage {activeSession.stage} of {activeSession.totalStages}: {activeSession.topic}
          </h3>
        </div>

        <button
          onClick={() => setTtsEnabled(!ttsEnabled)}
          style={{
            background: ttsEnabled ? 'rgba(99, 102, 241, 0.3)' : 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: 'white',
            padding: '0.4rem 0.8rem',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.8rem'
          }}
          title={ttsEnabled ? 'Mute AI voice' : 'Enable AI voice'}
        >
          {ttsEnabled ? <Volume2 size={16} color="#818cf8" /> : <VolumeX size={16} color="#94a3b8" />}
          <span>{ttsEnabled ? 'AI Voice ON' : 'Muted'}</span>
        </button>
      </div>

      {/* AI Interviewer Question Box */}
      <div className="ui-card" style={{ padding: '1.75rem', marginBottom: '1.5rem', borderLeft: '5px solid #6366f1' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.85rem' }}>
          <div style={{ background: '#e0e7ff', color: '#4f46e5', padding: '0.4rem', borderRadius: '8px' }}>
            <Bot size={20} />
          </div>
          <div>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e293b' }}>AI Technical Interviewer</span>
            <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block' }}>Senior Engineering Panelist</span>
          </div>
        </div>

        <p style={{ fontSize: '1.1rem', fontWeight: 600, color: '#0f172a', lineHeight: 1.6 }}>
          "{activeSession.question}"
        </p>

        <button
          onClick={() => speakText(activeSession.question)}
          style={{ background: 'none', border: 'none', color: '#6366f1', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem', padding: 0 }}
        >
          <Volume2 size={14} />
          <span>Replay Question Audio</span>
        </button>
      </div>

      {/* Previous Stage Rubric Evaluation (if any) */}
      {lastEvaluation && (
        <div className="ui-card" style={{ padding: '1.25rem', marginBottom: '1.5rem', background: '#f8fafc', borderLeft: '4px solid #10b981' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#059669', textTransform: 'uppercase' }}>
              Rubric Assessment for Previous Stage: {lastEvaluation.stageScore}%
            </span>
          </div>

          <p style={{ fontSize: '0.85rem', color: '#334155', lineHeight: 1.5, marginBottom: '0.75rem' }}>
            <strong>Panelist Critique:</strong> {lastEvaluation.critique}
          </p>

          <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.78rem', color: '#475569' }}>
            <div>Accuracy: <strong>{lastEvaluation.scores?.technicalAccuracy}/10</strong></div>
            <div>Problem Solving: <strong>{lastEvaluation.scores?.problemSolving}/10</strong></div>
            <div>Communication: <strong>{lastEvaluation.scores?.communication}/10</strong></div>
          </div>
        </div>
      )}

      {/* Student Answer Box */}
      <div className="ui-card" style={{ padding: '1.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ background: '#eff6ff', color: '#3b82f6', padding: '0.4rem', borderRadius: '8px' }}>
              <User size={18} />
            </div>
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1e293b' }}>Your Technical Answer</span>
          </div>
          <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
            {studentAnswer.trim().split(/\s+/).filter(Boolean).length} words
          </span>
        </div>

        <textarea
          value={studentAnswer}
          onChange={(e) => setStudentAnswer(e.target.value)}
          placeholder="State your approach, Big-O complexities (Time & Space), edge cases, and architectural tradeoffs..."
          rows="7"
          className="input-control"
          style={{ fontSize: '0.9rem', lineHeight: 1.5 }}
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
          <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
            💡 Tip: Explicitly mention time complexity, space complexity, and corner cases.
          </span>

          <button
            onClick={handleSubmitAnswer}
            disabled={!studentAnswer.trim() || submitting}
            className="btn-primary"
            style={{ padding: '0.65rem 1.5rem' }}
          >
            {submitting ? (
              <span>Evaluating Rubric...</span>
            ) : (
              <>
                <span>Submit Answer</span>
                <Send size={16} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
