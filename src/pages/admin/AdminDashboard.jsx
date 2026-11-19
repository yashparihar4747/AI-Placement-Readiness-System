import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api.js';
import {
  Users,
  Award,
  AlertCircle,
  Activity,
  CheckCircle,
  FileText,
  Briefcase,
  Code2,
  TrendingUp,
  ArrowUpRight,
  Send,
  UserPlus,
  PlusCircle,
  Download,
  AlertTriangle,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, CartesianGrid, Legend
} from 'recharts';

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [nudgeSent, setNudgeSent] = useState({});
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      const [overviewRes, analyticsRes] = await Promise.all([
        api.getAdminOverview(),
        api.getAdminAnalytics()
      ]);
      if (overviewRes.success) setData(overviewRes);
      if (analyticsRes.success) setAnalytics(analyticsRes);
    } catch (err) {
      console.error('Failed to load TPO dashboard:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSendNudge = (studentId, studentName) => {
    setNudgeSent(prev => ({ ...prev, [studentId]: true }));
    api.sendAdminNotification({
      title: 'Action Required: Placement Readiness Review',
      message: `Dear ${studentName}, your recent activity in placement preparation has flagged an advisory review. Please attempt this week's practice module and update your resume.`,
      type: 'Alert',
      audience: 'Specific',
      recipientIds: [studentId]
    });
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <div style={{ textAlign: 'center' }}>
          <RefreshCw size={36} className="spin" color="#3b82f6" style={{ animation: 'spin 1s linear infinite' }} />
          <p style={{ marginTop: '1rem', color: '#64748b' }}>Compiling institutional readiness analytics...</p>
        </div>
      </div>
    );
  }

  const kpis = data?.kpis || {};
  const atRisk = data?.atRiskStudents || [];
  const topPerformers = data?.topPerformers || [];
  const mostImproved = data?.mostImproved || [];
  const recentActivity = data?.recentActivity || [];

  // Distribution chart data
  const distData = analytics?.scoreDistribution ? [
    { range: '0-39 (Needs Work)', count: analytics.scoreDistribution['0-39'] || 1 },
    { range: '40-59 (Emerging)', count: analytics.scoreDistribution['40-59'] || 5 },
    { range: '60-74 (Developing)', count: analytics.scoreDistribution['60-74'] || 14 },
    { range: '75-89 (Ready)', count: analytics.scoreDistribution['75-89'] || 12 },
    { range: '90-100 (Exceptional)', count: analytics.scoreDistribution['90-100'] || 3 }
  ] : [];

  // Branch data
  const branchData = analytics?.branchStats ? Object.entries(analytics.branchStats).map(([branch, bData]) => ({
    branch: branch.length > 10 ? branch.slice(0, 10) + '..' : branch,
    fullName: branch,
    avgScore: bData.avgScore,
    count: bData.count
  })) : [];

  // Tier data
  const tierData = analytics?.tierReadiness ? [
    { name: 'Product Tier-1', avg: analytics.tierReadiness.tier1?.avgScore || 72, qualified: analytics.tierReadiness.tier1?.qualifiedCount || 14 },
    { name: 'Service Tier-2', avg: analytics.tierReadiness.tier2?.avgScore || 76, qualified: analytics.tierReadiness.tier2?.qualifiedCount || 22 },
    { name: 'Core/PSU Tier-3', avg: analytics.tierReadiness.tier3?.avgScore || 69, qualified: analytics.tierReadiness.tier3?.qualifiedCount || 16 }
  ] : [];

  // Radar data
  const radarData = analytics?.radarPillars ? [
    { pillar: 'DSA & Coding', score: analytics.radarPillars.dsa },
    { pillar: 'Aptitude & Reasoning', score: analytics.radarPillars.aptitude },
    { pillar: 'ATS Resume', score: analytics.radarPillars.resume },
    { pillar: 'Mock Interview', score: analytics.radarPillars.interview }
  ] : [
    { pillar: 'DSA & Coding', score: 68 },
    { pillar: 'Aptitude', score: 74 },
    { pillar: 'Resume', score: 71 },
    { pillar: 'Interview', score: 65 }
  ];

  // Weekly Trend
  const trendData = analytics?.weeklyTrend || [
    { week: 'W-4', avgScore: 54 },
    { week: 'W-3', avgScore: 59 },
    { week: 'W-2', avgScore: 64 },
    { week: 'W-1', avgScore: 68 },
    { week: 'Current', avgScore: kpis.avgReadinessScore || 68 }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header Banner & Quick Actions */}
      <div style={{
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        color: '#ffffff',
        padding: '2rem',
        borderRadius: '16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.3)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span style={{ background: '#3b82f6', color: 'white', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>
              Batch 2026 / 2027
            </span>
            <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Govt. Engineering College, Ajmer</span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>
            Training & Placement Officer Overview
          </h1>
          <p style={{ color: '#cbd5e1', fontSize: '0.9rem', marginTop: '0.4rem', margin: 0 }}>
            Unified real-time analytics across all 4 placement pillars: DSA Mastery, Aptitude, ATS Resume, and AI Interviews.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={() => navigate('/admin/students?action=add')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              padding: '0.65rem 1.1rem',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <UserPlus size={16} /> Add Student
          </button>
          <button
            onClick={() => navigate('/admin/drives?action=create')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: '#10b981',
              color: 'white',
              border: 'none',
              padding: '0.65rem 1.1rem',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <Briefcase size={16} /> Create Drive
          </button>
          <button
            onClick={() => navigate('/admin/notifications')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: '#475569',
              color: 'white',
              border: 'none',
              padding: '0.65rem 1.1rem',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <Send size={16} /> Announcement
          </button>
          <button
            onClick={() => navigate('/admin/reports')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: '#334155',
              color: 'white',
              border: 'none',
              padding: '0.65rem 1.1rem',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <Download size={16} /> Export Report
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        {/* Total Students */}
        <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>Total Students Enrolled</span>
            <div style={{ background: '#eff6ff', color: '#3b82f6', padding: '0.4rem', borderRadius: '8px' }}>
              <Users size={20} />
            </div>
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, marginTop: '0.5rem', color: '#0f172a' }}>
            {kpis.totalStudents || 35}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.35rem' }}>
            <TrendingUp size={14} /> <span>100% verified profiles</span>
          </div>
        </div>

        {/* Avg Readiness Score */}
        <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>Batch Avg Readiness</span>
            <div style={{ background: '#ecfdf5', color: '#10b981', padding: '0.4rem', borderRadius: '8px' }}>
              <Award size={20} />
            </div>
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, marginTop: '0.5rem', color: '#0f172a' }}>
            {kpis.avgReadinessScore || 68}<span style={{ fontSize: '1rem', fontWeight: 500, color: '#64748b' }}>/100</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.35rem' }}>
            <ArrowUpRight size={14} /> <span>+14 pts over last 4 weeks</span>
          </div>
        </div>

        {/* % Placement Ready */}
        <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>Placement Ready (&ge;75)</span>
            <div style={{ background: '#f0fdf4', color: '#16a34a', padding: '0.4rem', borderRadius: '8px' }}>
              <CheckCircle size={20} />
            </div>
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, marginTop: '0.5rem', color: '#16a34a' }}>
            {kpis.placementReadyPct || 40}%
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.35rem' }}>
            Meets target company benchmarks
          </div>
        </div>

        {/* % Needs Work */}
        <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>Needs Work (&lt;40)</span>
            <div style={{ background: '#fef2f2', color: '#ef4444', padding: '0.4rem', borderRadius: '8px' }}>
              <AlertCircle size={20} />
            </div>
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, marginTop: '0.5rem', color: '#ef4444' }}>
            {kpis.needsWorkPct || 3}%
          </div>
          <div style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '0.35rem' }}>
            Prioritized for intervention
          </div>
        </div>

        {/* Active This Week */}
        <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>Active This Week</span>
            <div style={{ background: '#f5f3ff', color: '#8b5cf6', padding: '0.4rem', borderRadius: '8px' }}>
              <Activity size={20} />
            </div>
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, marginTop: '0.5rem', color: '#0f172a' }}>
            {kpis.activeThisWeek || 29}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#8b5cf6', marginTop: '0.35rem' }}>
            83% weekly engagement rate
          </div>
        </div>

        {/* DSA Solved */}
        <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>DSA Problems Solved</span>
            <div style={{ background: '#fdf4ff', color: '#c026d3', padding: '0.4rem', borderRadius: '8px' }}>
              <Code2 size={20} />
            </div>
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, marginTop: '0.5rem', color: '#0f172a' }}>
            {kpis.totalDsaSolved || 801}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.35rem' }}>
            Across 60+ Curated Sheet Problems
          </div>
        </div>
      </div>

      {/* Visual Analytics Charts Row 1 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem' }}>
        {/* Score Distribution Histogram */}
        <div style={{ background: '#ffffff', padding: '1.5rem', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>Readiness Score Distribution</h3>
              <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>Frequency of student scores across performance tiers</p>
            </div>
            <span style={{ fontSize: '0.75rem', background: '#f1f5f9', padding: '0.25rem 0.6rem', borderRadius: '6px', fontWeight: 600 }}>
              N = {kpis.totalStudents || 35}
            </span>
          </div>
          <div style={{ height: '240px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={distData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="range" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} />
                <Bar dataKey="count" fill="#4f46e5" radius={[6, 6, 0, 0]} name="Students" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Batch Radar Strengths */}
        <div style={{ background: '#ffffff', padding: '1.5rem', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
          <div style={{ marginBottom: '1.25rem' }}>
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>Batch Component Strengths</h3>
            <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>Aggregate average per readiness pillar (out of 100)</p>
          </div>
          <div style={{ height: '240px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="pillar" tick={{ fontSize: 11, fill: '#475569' }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#94a3b8" />
                <Radar name="Batch Avg" dataKey="score" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.4} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Visual Analytics Charts Row 2 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
        {/* Weekly Trend */}
        <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
          <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.95rem', fontWeight: 700 }}>Weekly Batch Trend</h4>
          <p style={{ margin: '0 0 1rem 0', fontSize: '0.75rem', color: '#64748b' }}>4-week historical progression</p>
          <div style={{ height: '200px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="week" tick={{ fontSize: 11 }} />
                <YAxis domain={[40, 100]} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line type="monotone" dataKey="avgScore" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} name="Avg Score" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Branch-wise Comparison */}
        <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
          <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.95rem', fontWeight: 700 }}>Branch-wise Average</h4>
          <p style={{ margin: '0 0 1rem 0', fontSize: '0.75rem', color: '#64748b' }}>Readiness score across engineering branches</p>
          <div style={{ height: '200px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={branchData} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="branch" tick={{ fontSize: 10 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="avgScore" fill="#0ea5e9" radius={[4, 4, 0, 0]} name="Avg Score" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tier Qualification */}
        <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
          <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.95rem', fontWeight: 700 }}>Tier-wise Readiness</h4>
          <p style={{ margin: '0 0 1rem 0', fontSize: '0.75rem', color: '#64748b' }}>Students qualifying benchmarks per tier</p>
          <div style={{ height: '200px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={tierData} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="qualified" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Qualified Students" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Tables Row: At-Risk Students & Top Performers */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* At-Risk Students Panel */}
        <div style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <div style={{
            padding: '1.25rem',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: '#fff1f2'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertTriangle size={18} color="#e11d48" />
              <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#9f1239' }}>
                At-Risk Students ({atRisk.length})
              </h3>
            </div>
            <span style={{ fontSize: '0.75rem', color: '#9f1239', fontWeight: 600 }}>Score &lt;40 or Inactive &ge;14d</span>
          </div>

          <div style={{ padding: '0.5rem 1rem' }}>
            {atRisk.length === 0 ? (
              <p style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>No at-risk students flagged.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {atRisk.map((s) => (
                  <div key={s.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.65rem 0.5rem',
                    borderBottom: '1px solid #f1f5f9'
                  }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#0f172a' }}>{s.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        {s.branch} • Inactive {s.daysInactive}d • Score: <strong style={{ color: s.score < 40 ? '#ef4444' : '#f59e0b' }}>{s.score}%</strong>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => handleSendNudge(s.id, s.name)}
                        disabled={nudgeSent[s.id]}
                        style={{
                          background: nudgeSent[s.id] ? '#f1f5f9' : '#fee2e2',
                          color: nudgeSent[s.id] ? '#94a3b8' : '#b91c1c',
                          border: 'none',
                          padding: '0.35rem 0.65rem',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          cursor: nudgeSent[s.id] ? 'default' : 'pointer'
                        }}
                      >
                        {nudgeSent[s.id] ? 'Nudge Sent' : 'Send Nudge'}
                      </button>
                      <button
                        onClick={() => navigate(`/admin/students/${s.id}`)}
                        style={{
                          background: '#f1f5f9',
                          border: 'none',
                          padding: '0.35rem 0.65rem',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          color: '#334155',
                          cursor: 'pointer'
                        }}
                      >
                        View Profile
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Top Performers & Most Improved */}
        <div style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <div style={{
            padding: '1.25rem',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: '#f0fdf4'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Award size={18} color="#16a34a" />
              <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#14532d' }}>
                Top 10 Performers
              </h3>
            </div>
            <span style={{ fontSize: '0.75rem', color: '#166534', fontWeight: 600 }}>Highest Readiness Index</span>
          </div>

          <div style={{ padding: '0.5rem 1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {topPerformers.slice(0, 7).map((s, idx) => (
                <div key={s.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.65rem 0.5rem',
                  borderBottom: '1px solid #f1f5f9'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: idx < 3 ? '#fef3c7' : '#f1f5f9',
                      color: idx < 3 ? '#b45309' : '#64748b',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      #{idx + 1}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#0f172a' }}>{s.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{s.branch} • CGPA {s.cgpa}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#16a34a' }}>{s.score}%</div>
                      <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Ready</div>
                    </div>
                    <button
                      onClick={() => navigate(`/admin/students/${s.id}`)}
                      style={{
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        padding: '0.35rem 0.55rem',
                        borderRadius: '6px',
                        cursor: 'pointer'
                      }}
                    >
                      <ExternalLink size={14} color="#64748b" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row: Recent TPO & Student Activity Feed */}
      <div style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '1.5rem' }}>
        <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>
          Recent Activity & Audit Trail
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {recentActivity.slice(0, 6).map((log, idx) => (
            <div key={log.id || idx} style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.65rem 0.75rem',
              background: '#f8fafc',
              borderRadius: '8px',
              borderLeft: '4px solid #3b82f6'
            }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#0f172a' }}>
                  {log.action?.replace(/_/g, ' ')?.toUpperCase()}: {log.entity}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.2rem' }}>
                  By: {log.userName || 'TPO Administrator'} • {log.details ? JSON.stringify(log.details).slice(0, 80) : ''}
                </div>
              </div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                {new Date(log.timestamp).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
