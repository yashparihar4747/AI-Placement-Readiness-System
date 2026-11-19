import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../services/api.js';
import {
  User,
  ArrowLeft,
  Mail,
  GraduationCap,
  Calendar,
  Award,
  Code2,
  FileText,
  Video,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Trash2,
  Edit,
  Save,
  RotateCcw,
  BookOpen,
  Send,
  Shield,
  Layers
} from 'lucide-react';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const AdminStudentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [recomputing, setRecomputing] = useState(false);

  // Edit Profile Modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({});

  // Notes
  const [newNote, setNewNote] = useState('');
  const [savingNote, setSavingNote] = useState(false);

  const fetchDetail = async () => {
    try {
      const res = await api.getAdminStudentDetail(id);
      if (res.success && res.student) {
        setStudent(res.student);
        setEditForm({
          name: res.student.name,
          email: res.student.email,
          rollNo: res.student.rollNo,
          branch: res.student.branch,
          batch: res.student.batch,
          cgpa: res.student.cgpa,
          targetTier: res.student.targetTier,
          status: res.student.status
        });
      }
    } catch (err) {
      console.error('Failed to fetch student:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await api.updateAdminStudent(id, {
        ...editForm,
        cgpa: parseFloat(editForm.cgpa) || 7.5
      });
      setShowEditModal(false);
      fetchDetail();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteSubItem = async (itemType, itemId) => {
    if (!window.confirm(`Are you sure you want to delete this ${itemType}? Student readiness score will automatically recompute.`)) return;
    setRecomputing(true);
    try {
      const res = await api.deleteStudentSubItem(id, itemType, itemId);
      if (res.success) {
        await fetchDetail();
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setRecomputing(false);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    setSavingNote(true);
    try {
      const res = await api.addStudentNote(id, newNote);
      if (res.success) {
        setNewNote('');
        fetchDetail();
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setSavingNote(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', color: '#64748b' }}>
        Loading comprehensive student dossier...
      </div>
    );
  }

  if (!student) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem' }}>
        <h3>Student profile not found.</h3>
        <button onClick={() => navigate('/admin/students')} style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}>
          Back to Students
        </button>
      </div>
    );
  }

  const score = student.readinessScore || 0;
  const pillars = student.pillars || { dsa: 0, aptitude: 0, resume: 0, interview: 0 };
  const dsaEntries = student.dsaEntries || [];
  const testAttempts = student.testAttempts || [];
  const resumes = student.resumes || [];
  const interviews = student.interviews || [];
  const notes = student.tpoNotes || [];

  const radarData = [
    { pillar: 'DSA & Coding', score: pillars.dsa },
    { pillar: 'Aptitude & Core', score: pillars.aptitude },
    { pillar: 'ATS Resume', score: pillars.resume },
    { pillar: 'Mock Interview', score: pillars.interview },
  ];

  const scoreHistoryData = (student.scoreHistory || []).map((sh, idx) => ({
    week: `W-${student.scoreHistory.length - idx}`,
    score: sh.primaryScore
  }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Back and Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button
          onClick={() => navigate('/admin/students')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: 'transparent',
            border: 'none',
            color: '#64748b',
            cursor: 'pointer',
            fontSize: '0.9rem',
            fontWeight: 600
          }}
        >
          <ArrowLeft size={16} /> Back to Student Registry
        </button>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={() => setShowEditModal(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              padding: '0.55rem 1rem',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <Edit size={15} /> Edit Student Profile
          </button>
        </div>
      </div>

      {/* Hero Dossier Card */}
      <div style={{
        background: '#ffffff',
        borderRadius: '16px',
        padding: '1.75rem',
        border: '1px solid #e2e8f0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #4f46e5, #06b6d4)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.8rem',
            fontWeight: 800
          }}>
            {student.name ? student.name[0] : 'S'}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <h1 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 800, color: '#0f172a' }}>
                {student.name}
              </h1>
              <span style={{
                padding: '0.2rem 0.6rem',
                borderRadius: '12px',
                fontSize: '0.75rem',
                fontWeight: 700,
                background: student.status === 'at_risk' ? '#fee2e2' : '#ecfdf5',
                color: student.status === 'at_risk' ? '#b91c1c' : '#15803d'
              }}>
                {student.status?.toUpperCase() || 'ACTIVE'}
              </span>
            </div>
            <div style={{ display: 'flex', gap: '1.25rem', marginTop: '0.4rem', fontSize: '0.85rem', color: '#64748b' }}>
              <span><strong>Roll:</strong> {student.rollNo || '23IT17'}</span>
              <span><strong>Branch:</strong> {student.branch}</span>
              <span><strong>Batch:</strong> {student.batch || '2026'}</span>
              <span><strong>CGPA:</strong> {student.cgpa}</span>
              <span><strong>Email:</strong> {student.email}</span>
            </div>
          </div>
        </div>

        {/* Readiness Dial Card */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1.25rem',
          background: '#f8fafc',
          padding: '1rem 1.5rem',
          borderRadius: '12px',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>OVERALL READINESS</div>
            <div style={{
              fontSize: '2rem',
              fontWeight: 800,
              color: score >= 75 ? '#16a34a' : score >= 60 ? '#d97706' : '#dc2626'
            }}>
              {score}%
            </div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569' }}>
              {student.readinessStatus || (score >= 75 ? 'Placement Ready' : score >= 60 ? 'Developing' : 'Needs Work')}
            </div>
          </div>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: score >= 75 ? '#f0fdf4' : score >= 60 ? '#fffbeb' : '#fef2f2',
            border: `4px solid ${score >= 75 ? '#22c55e' : score >= 60 ? '#f59e0b' : '#ef4444'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '1rem',
            color: score >= 75 ? '#15803d' : score >= 60 ? '#b45309' : '#b91c1c'
          }}>
            {student.targetTier ? student.targetTier.toUpperCase() : 'T1'}
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        borderBottom: '1px solid #e2e8f0',
        paddingBottom: '0.25rem'
      }}>
        {[
          { key: 'overview', label: 'Overview & Analytics', icon: Layers },
          { key: 'dsa', label: `DSA Entries (${dsaEntries.length})`, icon: Code2 },
          { key: 'tests', label: `Tests & Aptitude (${testAttempts.length})`, icon: Award },
          { key: 'resumes', label: `Resumes (${resumes.length})`, icon: FileText },
          { key: 'interviews', label: `Mock Interviews (${interviews.length})`, icon: Video },
          { key: 'notes', label: `TPO Private Notes (${notes.length})`, icon: BookOpen },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.65rem 1rem',
                borderRadius: '8px 8px 0 0',
                border: 'none',
                background: isActive ? '#ffffff' : 'transparent',
                color: isActive ? '#2563eb' : '#64748b',
                fontWeight: isActive ? 700 : 500,
                fontSize: '0.88rem',
                cursor: 'pointer',
                borderBottom: isActive ? '2px solid #2563eb' : 'none'
              }}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT: Overview */}
      {activeTab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem' }}>
          {/* Radar Strengths & Pillars */}
          <div style={{ background: '#ffffff', padding: '1.5rem', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: 700 }}>4-Pillar Competency Breakdown</h3>
            <div style={{ height: '240px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="pillar" tick={{ fontSize: 11 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar name={student.name} dataKey="score" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.4} />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', marginTop: '1rem' }}>
              <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>DSA & Coding</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#3b82f6' }}>{pillars.dsa}%</div>
              </div>
              <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Aptitude & Core</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#10b981' }}>{pillars.aptitude}%</div>
              </div>
              <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>ATS Resume</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#8b5cf6' }}>{pillars.resume}%</div>
              </div>
              <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Interview</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f59e0b' }}>{pillars.interview}%</div>
              </div>
            </div>
          </div>

          {/* Historical Trend */}
          <div style={{ background: '#ffffff', padding: '1.5rem', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: 700 }}>Readiness Score History</h3>
            <div style={{ height: '240px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={scoreHistoryData.length ? scoreHistoryData : [{ week: 'W-1', score }, { week: 'Now', score }]}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="week" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="score" stroke="#4f46e5" strokeWidth={3} dot={{ r: 4 }} name="Readiness Index" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div style={{ marginTop: '1rem', padding: '0.75rem', background: '#eff6ff', borderRadius: '8px', fontSize: '0.8rem', color: '#1e40af' }}>
              Target Tier: <strong>{student.targetTier?.toUpperCase()}</strong>. Target Role: <strong>{student.targetRole || 'Software Development Engineer'}</strong>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: DSA Entries */}
      {activeTab === 'dsa' && (
        <div style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>DSA Tracked Problems</h3>
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
              {dsaEntries.filter(d => d.completed).length} of {dsaEntries.length} solved
            </span>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>
                <th style={{ padding: '0.65rem', textAlign: 'left' }}>Problem Title</th>
                <th style={{ padding: '0.65rem', textAlign: 'left' }}>Topic</th>
                <th style={{ padding: '0.65rem', textAlign: 'left' }}>Difficulty</th>
                <th style={{ padding: '0.65rem', textAlign: 'left' }}>Status</th>
                <th style={{ padding: '0.65rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {dsaEntries.length === 0 ? (
                <tr><td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>No DSA problems logged yet.</td></tr>
              ) : (
                dsaEntries.map((d) => (
                  <tr key={d.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '0.65rem', fontWeight: 600 }}>{d.title}</td>
                    <td style={{ padding: '0.65rem', color: '#64748b' }}>{d.topic}</td>
                    <td style={{ padding: '0.65rem' }}>
                      <span style={{
                        padding: '0.15rem 0.45rem',
                        borderRadius: '4px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        background: d.difficulty === 'Easy' ? '#ecfdf5' : d.difficulty === 'Medium' ? '#fffbeb' : '#fef2f2',
                        color: d.difficulty === 'Easy' ? '#065f46' : d.difficulty === 'Medium' ? '#92400e' : '#991b1b'
                      }}>
                        {d.difficulty}
                      </span>
                    </td>
                    <td style={{ padding: '0.65rem' }}>
                      <span style={{
                        padding: '0.15rem 0.45rem',
                        borderRadius: '4px',
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        background: d.completed ? '#f0fdf4' : '#f8fafc',
                        color: d.completed ? '#16a34a' : '#64748b'
                      }}>
                        {d.completed ? 'Solved' : 'Attempted'}
                      </span>
                    </td>
                    <td style={{ padding: '0.65rem', textAlign: 'right' }}>
                      <button
                        onClick={() => handleDeleteSubItem('dsa', d.id)}
                        disabled={recomputing}
                        title="Delete DSA Entry & Recompute Score"
                        style={{ background: '#fef2f2', border: 'none', color: '#ef4444', padding: '0.3rem 0.5rem', borderRadius: '4px', cursor: 'pointer' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB CONTENT: Tests & Aptitude */}
      {activeTab === 'tests' && (
        <div style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '1.5rem' }}>
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: 700 }}>Assessment & Test Attempts</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>
                <th style={{ padding: '0.65rem', textAlign: 'left' }}>Test Title</th>
                <th style={{ padding: '0.65rem', textAlign: 'left' }}>Category</th>
                <th style={{ padding: '0.65rem', textAlign: 'left' }}>Score</th>
                <th style={{ padding: '0.65rem', textAlign: 'left' }}>Correct / Total</th>
                <th style={{ padding: '0.65rem', textAlign: 'left' }}>Tab Switches</th>
                <th style={{ padding: '0.65rem', textAlign: 'left' }}>Date</th>
                <th style={{ padding: '0.65rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {testAttempts.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>No test attempts recorded.</td></tr>
              ) : (
                testAttempts.map((t) => (
                  <tr key={t.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '0.65rem', fontWeight: 600 }}>{t.testTitle || t.testId}</td>
                    <td style={{ padding: '0.65rem', color: '#64748b' }}>{t.category || 'Aptitude'}</td>
                    <td style={{ padding: '0.65rem', fontWeight: 700, color: (t.scorePercentage || 0) >= 70 ? '#16a34a' : '#d97706' }}>
                      {t.scorePercentage || 0}%
                    </td>
                    <td style={{ padding: '0.65rem' }}>{t.correctCount} / {t.totalQuestions}</td>
                    <td style={{ padding: '0.65rem' }}>
                      <span style={{
                        padding: '0.15rem 0.45rem',
                        borderRadius: '4px',
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        background: (t.tabSwitchCount || 0) > 2 ? '#fee2e2' : '#f1f5f9',
                        color: (t.tabSwitchCount || 0) > 2 ? '#b91c1c' : '#64748b'
                      }}>
                        {t.tabSwitchCount || 0} switches
                      </span>
                    </td>
                    <td style={{ padding: '0.65rem', color: '#94a3b8' }}>{new Date(t.completedAt).toLocaleDateString()}</td>
                    <td style={{ padding: '0.65rem', textAlign: 'right' }}>
                      <button
                        onClick={() => handleDeleteSubItem('test', t.id)}
                        disabled={recomputing}
                        title="Delete Attempt & Recompute Score"
                        style={{ background: '#fef2f2', border: 'none', color: '#ef4444', padding: '0.3rem 0.5rem', borderRadius: '4px', cursor: 'pointer' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB CONTENT: Resumes */}
      {activeTab === 'resumes' && (
        <div style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '1.5rem' }}>
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: 700 }}>ATS Resume Analysis Dossier</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {resumes.length === 0 ? (
              <p style={{ color: '#94a3b8', padding: '2rem', textAlign: 'center' }}>No resume uploaded yet.</p>
            ) : (
              resumes.map((r) => (
                <div key={r.id} style={{
                  padding: '1.25rem',
                  borderRadius: '10px',
                  border: '1px solid #e2e8f0',
                  background: '#f8fafc',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <FileText size={18} color="#3b82f6" />
                      <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700 }}>{r.fileName}</h4>
                      <span style={{ fontSize: '0.75rem', background: '#e2e8f0', padding: '0.15rem 0.45rem', borderRadius: '4px' }}>
                        Target: {r.targetRole || 'SDE'}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.75rem', fontSize: '0.85rem' }}>
                      <span>ATS Score: <strong style={{ color: '#2563eb' }}>{r.atsScore}%</strong></span>
                      <span>Job Match: <strong style={{ color: '#16a34a' }}>{r.matchScore}%</strong></span>
                      <span>Analyzed: {new Date(r.createdAt || Date.now()).toLocaleDateString()}</span>
                    </div>
                    {r.missingKeywords && r.missingKeywords.length > 0 && (
                      <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#b91c1c' }}>
                        Missing Keywords: {r.missingKeywords.slice(0, 5).join(', ')}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => handleDeleteSubItem('resume', r.id)}
                    disabled={recomputing}
                    style={{ background: '#fef2f2', border: 'none', color: '#ef4444', padding: '0.4rem 0.75rem', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem' }}
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENT: Mock Interviews */}
      {activeTab === 'interviews' && (
        <div style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '1.5rem' }}>
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: 700 }}>AI Mock Interview Sessions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {interviews.length === 0 ? (
              <p style={{ color: '#94a3b8', padding: '2rem', textAlign: 'center' }}>No mock interview sessions recorded.</p>
            ) : (
              interviews.map((m) => (
                <div key={m.id} style={{
                  padding: '1.25rem',
                  borderRadius: '10px',
                  border: '1px solid #e2e8f0',
                  background: '#f8fafc'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{m.role} ({m.tier?.toUpperCase()})</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Completed: {new Date(m.completedAt).toLocaleString()}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.7rem', color: '#64748b' }}>RUBRIC SCORE</div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#3b82f6' }}>{m.overallScore}%</div>
                      </div>
                      <button
                        onClick={() => handleDeleteSubItem('interview', m.id)}
                        disabled={recomputing}
                        style={{ background: '#fef2f2', border: 'none', color: '#ef4444', padding: '0.4rem', borderRadius: '6px', cursor: 'pointer' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Transcripts */}
                  {m.transcripts && m.transcripts.length > 0 && (
                    <div style={{ marginTop: '0.75rem', borderTop: '1px solid #e2e8f0', paddingTop: '0.75rem' }}>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.4rem' }}>Q&A Transcript Sample:</div>
                      {m.transcripts.slice(0, 2).map((t, tidx) => (
                        <div key={tidx} style={{ fontSize: '0.78rem', marginBottom: '0.5rem', background: '#ffffff', padding: '0.5rem', borderRadius: '6px' }}>
                          <div style={{ fontWeight: 600, color: '#1e293b' }}>Q: {t.question}</div>
                          <div style={{ color: '#475569', marginTop: '0.2rem' }}>A: {t.answer}</div>
                          {t.feedback && <div style={{ color: '#2563eb', marginTop: '0.2rem', fontStyle: 'italic' }}>AI Feedback: {t.feedback}</div>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENT: Private TPO Notes */}
      {activeTab === 'notes' && (
        <div style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '1.5rem' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem', fontWeight: 700 }}>Internal TPO Advisory Notes</h3>
          <p style={{ margin: '0 0 1rem 0', fontSize: '0.8rem', color: '#64748b' }}>
            Private notes visible exclusively to placement coordinators and officers.
          </p>

          <form onSubmit={handleAddNote} style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.75rem' }}>
            <input
              type="text"
              placeholder="Add advisory note, interview remark, or company feedback..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              style={{ flex: 1, padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}
            />
            <button
              type="submit"
              disabled={savingNote}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: '#3b82f6',
                color: 'white',
                border: 'none',
                padding: '0.65rem 1.25rem',
                borderRadius: '8px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <Send size={15} /> Save Note
            </button>
          </form>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {notes.length === 0 ? (
              <p style={{ color: '#94a3b8', padding: '1rem', textAlign: 'center' }}>No internal notes saved yet.</p>
            ) : (
              notes.map((n) => (
                <div key={n.id} style={{
                  padding: '0.85rem',
                  background: '#f8fafc',
                  borderRadius: '8px',
                  borderLeft: '4px solid #3b82f6'
                }}>
                  <div style={{ fontSize: '0.85rem', color: '#0f172a' }}>{n.note}</div>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '0.35rem' }}>
                    By {n.authorName} • {new Date(n.createdAt).toLocaleString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            width: '500px',
            padding: '2rem',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
          }}>
            <h3 style={{ margin: '0 0 1.25rem 0', fontSize: '1.2rem', fontWeight: 800 }}>Edit Student Details</h3>
            <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.3rem' }}>Name</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  style={{ width: '100%', padding: '0.55rem', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.3rem' }}>Branch</label>
                  <select
                    value={editForm.branch}
                    onChange={(e) => setEditForm({ ...editForm, branch: e.target.value })}
                    style={{ width: '100%', padding: '0.55rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  >
                    <option value="Computer Science & Engineering">CSE</option>
                    <option value="Information Technology">IT</option>
                    <option value="Electronics & Communication Engineering">ECE</option>
                    <option value="Electrical Engineering">EE</option>
                    <option value="Mechanical Engineering">ME</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.3rem' }}>CGPA</label>
                  <input
                    type="number"
                    step="0.1"
                    value={editForm.cgpa}
                    onChange={(e) => setEditForm({ ...editForm, cgpa: e.target.value })}
                    style={{ width: '100%', padding: '0.55rem', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.3rem' }}>Target Tier</label>
                  <select
                    value={editForm.targetTier}
                    onChange={(e) => setEditForm({ ...editForm, targetTier: e.target.value })}
                    style={{ width: '100%', padding: '0.55rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  >
                    <option value="tier1">Tier 1 (Product)</option>
                    <option value="tier2">Tier 2 (Service)</option>
                    <option value="tier3">Tier 3 (Core/PSU)</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.3rem' }}>Status</label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                    style={{ width: '100%', padding: '0.55rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  >
                    <option value="active">Active</option>
                    <option value="at_risk">At-Risk</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  style={{ padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#f8fafc', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '0.6rem 1.25rem', borderRadius: '8px', border: 'none', background: '#3b82f6', color: 'white', fontWeight: 600, cursor: 'pointer' }}
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
