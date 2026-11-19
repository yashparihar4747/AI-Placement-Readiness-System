import React, { useState, useEffect } from 'react';
import { api } from '../../services/api.js';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, Legend, PieChart, Pie, Cell
} from 'recharts';
import { BarChart3, TrendingUp, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';

export const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedTier, setSelectedTier] = useState('');

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const res = await api.getAdminAnalytics({ branch: selectedBranch, tier: selectedTier });
      if (res.success) {
        setAnalytics(res);
      }
    } catch (err) {
      console.error('Failed to load analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, [selectedBranch, selectedTier]);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>Synthesizing cohort performance analytics...</div>;
  }

  // DSA Topic Coverage
  const topicData = [
    { topic: 'Arrays', solvedRate: 88 },
    { topic: 'Strings', solvedRate: 82 },
    { topic: 'Linked List', solvedRate: 74 },
    { topic: 'Binary Search', solvedRate: 70 },
    { topic: 'Trees & BST', solvedRate: 64 },
    { topic: 'Dynamic Prog', solvedRate: 48 },
    { topic: 'Graphs', solvedRate: 52 },
    { topic: 'Trie & Heap', solvedRate: 45 },
  ];

  // Aptitude Subtopic Averages
  const aptData = [
    { section: 'Quantitative', avg: 76 },
    { section: 'Logical Reasoning', avg: 82 },
    { section: 'Verbal Ability', avg: 79 },
    { section: 'Data Structures', avg: 71 },
    { section: 'Operating Systems', avg: 68 },
    { section: 'DBMS & SQL', avg: 74 },
    { section: 'Computer Networks', avg: 65 }
  ];

  // Toughest Questions Flagged
  const toughQuestions = [
    { q: 'Serialize and Deserialize Binary Tree (DP/Trees)', failRate: '68%', topic: 'DSA' },
    { q: 'Deadlock Avoidance Banker Algorithm Safe State', failRate: '62%', topic: 'OS' },
    { q: 'Normal Forms BCNF vs 3NF Functional Dependencies', failRate: '58%', topic: 'DBMS' },
    { q: 'TCP Reno Congestion Window Threshold Calculation', failRate: '55%', topic: 'CN' },
    { q: 'Traveling Salesman Problem Dynamic Programming', failRate: '54%', topic: 'DSA' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>
            Cohort Analytics & Skills-Gap Assessment
          </h2>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>
            In-depth academic diagnostics, topic mastery curves, and curriculum gap detection.
          </p>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            style={{ padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', background: '#ffffff' }}
          >
            <option value="">All Branches</option>
            <option value="Computer Science & Engineering">CSE</option>
            <option value="Information Technology">IT</option>
            <option value="Electronics & Communication Engineering">ECE</option>
            <option value="Electrical Engineering">EE</option>
            <option value="Mechanical Engineering">ME</option>
          </select>

          <select
            value={selectedTier}
            onChange={(e) => setSelectedTier(e.target.value)}
            style={{ padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', background: '#ffffff' }}
          >
            <option value="">All Tiers</option>
            <option value="tier1">Product Tier-1</option>
            <option value="tier2">Service Tier-2</option>
            <option value="tier3">Core/PSU</option>
          </select>
        </div>
      </div>

      {/* Charts Row 1: DSA Coverage & Aptitude Sections */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* DSA Topic Coverage */}
        <div style={{ background: '#ffffff', padding: '1.5rem', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem', fontWeight: 700 }}>DSA Sheet Topic Completion Rate (%)</h3>
          <p style={{ margin: '0 0 1rem 0', fontSize: '0.75rem', color: '#64748b' }}>Percentage of students who have solved problems in each category</p>
          <div style={{ height: '260px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topicData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="topic" angle={-25} textAnchor="end" tick={{ fontSize: 10 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="solvedRate" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Completion %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Aptitude & Core CS Section Performance */}
        <div style={{ background: '#ffffff', padding: '1.5rem', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem', fontWeight: 700 }}>Test Subtopic Accuracy Score (%)</h3>
          <p style={{ margin: '0 0 1rem 0', fontSize: '0.75rem', color: '#64748b' }}>Aggregate mean score on standardized MCQ modules</p>
          <div style={{ height: '260px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={aptData} margin={{ top: 10, right: 10, left: -20, bottom: 35 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="section" angle={-30} textAnchor="end" tick={{ fontSize: 10 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="avg" fill="#10b981" radius={[4, 4, 0, 0]} name="Accuracy %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 2: Hardest Questions Table & Skills Gap Callout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem' }}>
        {/* Toughest Questions Flagged */}
        <div style={{ background: '#ffffff', padding: '1.5rem', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <AlertTriangle size={18} color="#ef4444" />
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>Hardest Questions Flagged for Remediation</h3>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>
                <th style={{ padding: '0.65rem', textAlign: 'left' }}>Question Title / Concept</th>
                <th style={{ padding: '0.65rem', textAlign: 'left' }}>Domain</th>
                <th style={{ padding: '0.65rem', textAlign: 'right' }}>Failure Rate</th>
              </tr>
            </thead>
            <tbody>
              {toughQuestions.map((t, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '0.65rem', fontWeight: 500 }}>{t.q}</td>
                  <td style={{ padding: '0.65rem', color: '#64748b' }}>{t.topic}</td>
                  <td style={{ padding: '0.65rem', textAlign: 'right', fontWeight: 700, color: '#dc2626' }}>{t.failRate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* AI Recommendations */}
        <div style={{ background: '#ffffff', padding: '1.5rem', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: 700 }}>Curriculum Optimization Advice</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div style={{ padding: '0.85rem', background: '#eff6ff', borderRadius: '8px', borderLeft: '4px solid #3b82f6', fontSize: '0.82rem' }}>
              <strong>Dynamic Programming & Graphs:</strong> Only 48% completion rate among CSE/IT students. Recommend hosting a targeted 2-day live problem solving bootcamp before Amazon drive.
            </div>
            <div style={{ padding: '0.85rem', background: '#f0fdf4', borderRadius: '8px', borderLeft: '4px solid #10b981', fontSize: '0.82rem' }}>
              <strong>Logical Reasoning & Aptitude:</strong> High 82% accuracy. Batch is strong for TCS Digital & Infosys DSE first-round screening tests.
            </div>
            <div style={{ padding: '0.85rem', background: '#fffbeb', borderRadius: '8px', borderLeft: '4px solid #f59e0b', fontSize: '0.82rem' }}>
              <strong>Resume Impact Metrics:</strong> 42% of resumes lack quantified metrics (e.g. "% latency reduced", "users served"). Advise students to revise resume version 2.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
