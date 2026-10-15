import React, { useState, useEffect } from 'react';
import { api } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import {
  Code2,
  Brain,
  FileCheck2,
  MessagesSquare,
  Sparkles,
  TrendingUp,
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Award,
  Layers,
  Building2,
  RefreshCw
} from 'lucide-react';

export const Dashboard = ({ setActiveTab }) => {
  const { profile, refreshProfile } = useAuth();
  const [readiness, setReadiness] = useState(null);
  const [selectedTier, setSelectedTier] = useState(profile?.targetTier || 'tier1');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchReadiness = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.getReadinessScore();
      if (res.success) {
        setReadiness(res.readiness);
      }
    } catch (err) {
      console.error('Failed to load readiness:', err);
      setError(err.message || 'Error fetching readiness data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReadiness();
  }, []);

  const handleTierSwitch = async (tierKey) => {
    setSelectedTier(tierKey);
    try {
      await api.updateProfile({ targetTier: tierKey });
      await refreshProfile();
      await fetchReadiness();
    } catch (err) {
      console.error('Error switching tier:', err);
    }
  };

  if (loading && !readiness) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', flexDirection: 'column', gap: '1rem' }}>
        <RefreshCw size={36} className="spin-icon" color="#4f46e5" />
        <span style={{ color: '#64748b', fontWeight: 600 }}>Calculating AI Readiness Matrix...</span>
      </div>
    );
  }

  const primaryScore = readiness?.primaryScore || 75;
  const activeTier = readiness?.tierScores?.[selectedTier] || readiness?.tierScores?.tier1;
  const pillars = readiness?.pillars || { dsa: 80, aptitude: 80, resume: 75, interview: 75 };

  // Calculate SVG Circle Stroke
  const radius = 68;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (primaryScore / 100) * circumference;

  return (
    <div>
      {/* Top Banner Header */}
      <div className="page-header-box">
        <div>
          <h1 className="page-title">Placement Readiness Dashboard</h1>
          <p className="page-subtitle">
            Consolidated AI evaluation across DSA, Aptitude, Resume ATS, and Technical Mock Interviews
          </p>
        </div>

        <button
          onClick={fetchReadiness}
          className="btn-secondary"
          title="Recalculate Scores"
        >
          <RefreshCw size={16} />
          <span>Sync Readiness</span>
        </button>
      </div>

      {error && (
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '0.85rem', borderRadius: '10px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Hero Circular Gauge Card */}
      <div className="readiness-hero-card">
        <div>
          <div className="hero-tag">
            <Sparkles size={14} />
            <span>AI PREDICTIVE READINESS ENGINE</span>
          </div>

          <h2 className="hero-title">{activeTier?.tierName || 'Product-Based Tech'}</h2>
          <p className="hero-description">
            Your readiness score is evaluated using multi-objective weighting modeled after campus recruitment benchmarks.
            Minimum qualified drive cutoff: <strong>{activeTier?.benchmark}%</strong>.
          </p>

          <div style={{ marginTop: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.82rem', color: '#c7d2fe', fontWeight: 600 }}>Select Company Tier:</span>
            <div className="tier-selector-pills">
              <button
                onClick={() => handleTierSwitch('tier1')}
                className={`tier-pill-btn ${selectedTier === 'tier1' ? 'active' : ''}`}
              >
                Tier 1: Product-Based
              </button>
              <button
                onClick={() => handleTierSwitch('tier2')}
                className={`tier-pill-btn ${selectedTier === 'tier2' ? 'active' : ''}`}
              >
                Tier 2: Service-Based
              </button>
              <button
                onClick={() => handleTierSwitch('tier3')}
                className={`tier-pill-btn ${selectedTier === 'tier3' ? 'active' : ''}`}
              >
                Tier 3: Core / PSU
              </button>
            </div>
          </div>
        </div>

        {/* Circular Gauge */}
        <div className="gauge-wrapper">
          <svg className="gauge-svg" viewBox="0 0 170 170">
            <circle
              className="gauge-bg-circle"
              cx="85"
              cy="85"
              r={radius}
            />
            <circle
              className="gauge-progress-circle"
              cx="85"
              cy="85"
              r={radius}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              stroke={primaryScore >= (activeTier?.benchmark || 75) ? '#10b981' : '#f59e0b'}
            />
          </svg>
          <div className="gauge-center-content">
            <div className="gauge-score-value">{primaryScore}</div>
            <div className="gauge-score-label">Readiness %</div>
          </div>
        </div>
      </div>

      {/* 4 Pillars Grid */}
      <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem', color: '#1e293b' }}>
        Core Evaluation Pillars
      </h3>

      <div className="pillars-grid">
        {/* DSA Pillar */}
        <div className="ui-card pillar-card" style={{ borderLeftColor: '#6366f1' }}>
          <div>
            <div className="pillar-header">
              <div className="pillar-icon-box" style={{ background: '#eef2ff', color: '#4f46e5' }}>
                <Code2 size={20} />
              </div>
              <div className="pillar-score-badge">{pillars.dsa}%</div>
            </div>
            <div className="pillar-title">DSA Practice</div>
            <div className="pillar-subtitle">Problem solving, algorithms & data structures</div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${pillars.dsa}%`, background: '#6366f1' }}></div>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('dsa')}
            style={{ marginTop: '0.85rem', background: 'none', border: 'none', color: '#4f46e5', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem', padding: 0 }}
          >
            <span>Open DSA Tracker</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {/* Aptitude Pillar */}
        <div className="ui-card pillar-card" style={{ borderLeftColor: '#0ea5e9' }}>
          <div>
            <div className="pillar-header">
              <div className="pillar-icon-box" style={{ background: '#e0f2fe', color: '#0284c7' }}>
                <Brain size={20} />
              </div>
              <div className="pillar-score-badge">{pillars.aptitude}%</div>
            </div>
            <div className="pillar-title">Aptitude & Logic</div>
            <div className="pillar-subtitle">Quantitative, Logical, Verbal & Core CS</div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${pillars.aptitude}%`, background: '#0ea5e9' }}></div>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('aptitude')}
            style={{ marginTop: '0.85rem', background: 'none', border: 'none', color: '#0284c7', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem', padding: 0 }}
          >
            <span>Take Aptitude Quiz</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {/* Resume Pillar */}
        <div className="ui-card pillar-card" style={{ borderLeftColor: '#10b981' }}>
          <div>
            <div className="pillar-header">
              <div className="pillar-icon-box" style={{ background: '#ecfdf5', color: '#059669' }}>
                <FileCheck2 size={20} />
              </div>
              <div className="pillar-score-badge">{pillars.resume}%</div>
            </div>
            <div className="pillar-title">Resume ATS Score</div>
            <div className="pillar-subtitle">Keyword match, impact metrics, format</div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${pillars.resume}%`, background: '#10b981' }}></div>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('resume')}
            style={{ marginTop: '0.85rem', background: 'none', border: 'none', color: '#059669', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem', padding: 0 }}
          >
            <span>Analyze Resume</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {/* Mock Interview Pillar */}
        <div className="ui-card pillar-card" style={{ borderLeftColor: '#8b5cf6' }}>
          <div>
            <div className="pillar-header">
              <div className="pillar-icon-box" style={{ background: '#f5f3ff', color: '#7c3aed' }}>
                <MessagesSquare size={20} />
              </div>
              <div className="pillar-score-badge">{pillars.interview}%</div>
            </div>
            <div className="pillar-title">Mock Interview</div>
            <div className="pillar-subtitle">Adaptive technical & rubric evaluation</div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${pillars.interview}%`, background: '#8b5cf6' }}></div>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('interview')}
            style={{ marginTop: '0.85rem', background: 'none', border: 'none', color: '#7c3aed', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem', padding: 0 }}
          >
            <span>Start AI Interview</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* Tier Comparison Cards Grid */}
      <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem', color: '#1e293b' }}>
        Company Tier Readiness Breakdown
      </h3>

      <div className="tier-cards-grid">
        {readiness?.tierScores && Object.entries(readiness.tierScores).map(([key, item]) => {
          const isCurrentSelected = selectedTier === key;
          return (
            <div
              key={key}
              className="ui-card tier-card-item"
              style={{
                borderColor: isCurrentSelected ? '#6366f1' : 'var(--border)',
                boxShadow: isCurrentSelected ? '0 0 0 2px #6366f1' : 'var(--shadow-sm)'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span className={`tier-badge badge-${item.statusColor}`}>
                    {item.status}
                  </span>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0f172a' }}>{item.score}%</span>
                    <span style={{ display: 'block', fontSize: '0.72rem', color: '#64748b' }}>Target: {item.benchmark}%</span>
                  </div>
                </div>

                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginTop: '0.4rem', color: '#1e293b' }}>
                  {item.tierName}
                </h4>

                <div className="tier-weights-list">
                  <div>DSA: <strong>{item.weights.dsa}%</strong></div>
                  <div>Aptitude: <strong>{item.weights.aptitude}%</strong></div>
                  <div>Resume: <strong>{item.weights.resume}%</strong></div>
                  <div>Interview: <strong>{item.weights.interview}%</strong></div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9' }}>
                <span style={{ fontSize: '0.8rem', color: item.isQualified ? '#059669' : '#d97706', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <CheckCircle2 size={16} />
                  {item.isQualified ? 'Eligible for Batch Shortlist' : 'Below Drive Cutoff'}
                </span>
                {!isCurrentSelected && (
                  <button
                    onClick={() => handleTierSwitch(key)}
                    style={{ background: 'none', border: 'none', color: '#4f46e5', fontWeight: 600, fontSize: '0.78rem', cursor: 'pointer' }}
                  >
                    Select Tier
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* AI Action Roadmap & Gap Analysis */}
      <div className="ui-card roadmap-container">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{ background: '#fef3c7', color: '#d97706', padding: '0.5rem', borderRadius: '8px' }}>
              <TrendingUp size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: '#1e293b' }}>
                AI Personalized Improvement Roadmap
              </h3>
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                Primary bottleneck identified: <strong>{readiness?.weakestArea}</strong>
              </span>
            </div>
          </div>
        </div>

        <div>
          {readiness?.actionRoadmap?.map((item, idx) => (
            <div key={idx} className="roadmap-item">
              <span className={`priority-chip priority-${item.priority}`}>
                {item.priority}
              </span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#1e293b' }}>
                  [{item.pillar}] {item.action}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#059669', marginTop: '0.2rem', fontWeight: 500 }}>
                  Estimated Impact: {item.impact}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
