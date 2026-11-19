import React, { useState, useEffect } from 'react';
import { api } from '../../services/api.js';
import {
  Sliders,
  Save,
  RotateCcw,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Sparkles
} from 'lucide-react';

export const AdminWeights = () => {
  const [weights, setWeights] = useState({
    tier1: { dsa: 40, aptitude: 20, resume: 15, interview: 25 },
    tier2: { dsa: 15, aptitude: 35, resume: 20, interview: 30 },
    tier3: { dsa: 10, aptitude: 45, resume: 25, interview: 20 },
  });

  const [thresholds, setThresholds] = useState({
    placementReady: 75,
    developing: 60
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [recomputing, setRecomputing] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  useEffect(() => {
    const fetchWeights = async () => {
      try {
        const res = await api.getAdminWeights();
        if (res.success && res.weights) {
          setWeights(res.weights);
          if (res.thresholds) setThresholds(res.thresholds);
        }
      } catch (err) {
        console.error('Failed to load weights:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchWeights();
  }, []);

  const handleWeightChange = (tier, pillar, value) => {
    const val = parseInt(value) || 0;
    setWeights(prev => ({
      ...prev,
      [tier]: {
        ...prev[tier],
        [pillar]: val
      }
    }));
  };

  const getTierSum = (tier) => {
    const t = weights[tier] || {};
    return (t.dsa || 0) + (t.aptitude || 0) + (t.resume || 0) + (t.interview || 0);
  };

  const handleSaveAndRecompute = async () => {
    // Validate sums
    for (const tier of ['tier1', 'tier2', 'tier3']) {
      if (getTierSum(tier) !== 100) {
        alert(`Error: ${tier.toUpperCase()} weights must sum to exactly 100%. Currently: ${getTierSum(tier)}%`);
        return;
      }
    }

    setSaving(true);
    setRecomputing(true);
    try {
      await api.updateAdminWeights({ weights, thresholds });
      const recomputeRes = await api.recomputeAllScores();
      setStatusMessage(`Successfully saved weights and updated all ${recomputeRes.recomputedCount || 35} student scores in real time!`);
      setTimeout(() => setStatusMessage(null), 5000);
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
      setRecomputing(false);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>Loading scoring engine configuration...</div>;
  }

  const renderTierCard = (tierKey, tierTitle, desc, color) => {
    const t = weights[tierKey] || {};
    const sum = getTierSum(tierKey);
    const isSumValid = sum === 100;

    return (
      <div style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.1rem', fontWeight: 700, color }}>{tierTitle}</h3>
            <p style={{ margin: 0, fontSize: '0.78rem', color: '#64748b' }}>{desc}</p>
          </div>
          <span style={{
            fontSize: '0.78rem',
            fontWeight: 800,
            padding: '0.2rem 0.6rem',
            borderRadius: '12px',
            background: isSumValid ? '#ecfdf5' : '#fef2f2',
            color: isSumValid ? '#15803d' : '#b91c1c'
          }}>
            Sum: {sum}%
          </span>
        </div>

        {/* DSA Slider */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
            <span>DSA & Problem Solving</span>
            <span>{t.dsa || 0}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={t.dsa || 0}
            onChange={(e) => handleWeightChange(tierKey, 'dsa', e.target.value)}
            style={{ width: '100%' }}
          />
        </div>

        {/* Aptitude Slider */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
            <span>Aptitude & Core CS Tests</span>
            <span>{t.aptitude || 0}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={t.aptitude || 0}
            onChange={(e) => handleWeightChange(tierKey, 'aptitude', e.target.value)}
            style={{ width: '100%' }}
          />
        </div>

        {/* Resume Slider */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
            <span>ATS Resume Parsing & Match</span>
            <span>{t.resume || 0}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={t.resume || 0}
            onChange={(e) => handleWeightChange(tierKey, 'resume', e.target.value)}
            style={{ width: '100%' }}
          />
        </div>

        {/* Interview Slider */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
            <span>Mock Technical & HR Interview</span>
            <span>{t.interview || 0}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={t.interview || 0}
            onChange={(e) => handleWeightChange(tierKey, 'interview', e.target.value)}
            style={{ width: '100%' }}
          />
        </div>
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>
            Multi-Tier Scoring Weights & Readiness Thresholds
          </h2>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>
            Calibrate algorithmic weights for Product, Service, and Core/PSU company categories.
          </p>
        </div>

        <button
          onClick={handleSaveAndRecompute}
          disabled={saving}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: '#2563eb',
            color: 'white',
            border: 'none',
            padding: '0.65rem 1.25rem',
            borderRadius: '8px',
            fontSize: '0.88rem',
            fontWeight: 700,
            cursor: saving ? 'default' : 'pointer',
            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)'
          }}
        >
          {recomputing ? (
            <>
              <RefreshCw size={16} className="spin" style={{ animation: 'spin 1s linear infinite' }} />
              Recomputing Scores...
            </>
          ) : (
            <>
              <Save size={16} /> Save & Recompute All Cohort Scores
            </>
          )}
        </button>
      </div>

      {statusMessage && (
        <div style={{ padding: '0.85rem', background: '#ecfdf5', border: '1px solid #6ee7b7', borderRadius: '8px', color: '#065f46', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle size={18} />
          {statusMessage}
        </div>
      )}

      {/* 3 Tier Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
        {renderTierCard(
          'tier1',
          'Tier 1: Product-Based',
          'FAANG, Unicorns & Tier-1 Tech (DSA & Interview Heavy)',
          '#1d4ed8'
        )}
        {renderTierCard(
          'tier2',
          'Tier 2: Service-Based',
          'TCS Digital, Infosys DSE, Wipro (Aptitude & Verbal Balanced)',
          '#15803d'
        )}
        {renderTierCard(
          'tier3',
          'Tier 3: Core & PSU',
          'ISRO, BEL, BHEL, DRDO & Embedded (Domain Concepts & Gate Focused)',
          '#b45309'
        )}
      </div>

      {/* Thresholds */}
      <div style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '1.5rem' }}>
        <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.05rem', fontWeight: 700 }}>Institutional Readiness Classification Thresholds</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
              <span>"Placement Ready" Threshold</span>
              <span style={{ color: '#16a34a', fontWeight: 800 }}>&ge; {thresholds.placementReady}%</span>
            </div>
            <input
              type="range"
              min="65"
              max="90"
              value={thresholds.placementReady}
              onChange={(e) => setThresholds({ ...thresholds, placementReady: parseInt(e.target.value) })}
              style={{ width: '100%' }}
            />
            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.75rem', color: '#64748b' }}>Students meeting this score unlock tier drive eligibility.</p>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
              <span>"Developing" Benchmark</span>
              <span style={{ color: '#d97706', fontWeight: 800 }}>&ge; {thresholds.developing}%</span>
            </div>
            <input
              type="range"
              min="40"
              max="65"
              value={thresholds.developing}
              onChange={(e) => setThresholds({ ...thresholds, developing: parseInt(e.target.value) })}
              style={{ width: '100%' }}
            />
            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.75rem', color: '#64748b' }}>Students below this score are flagged in the At-Risk advisory console.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
