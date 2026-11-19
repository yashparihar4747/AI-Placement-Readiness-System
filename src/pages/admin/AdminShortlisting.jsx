import React, { useState, useEffect } from 'react';
import { api } from '../../services/api.js';
import {
  Filter,
  Save,
  Download,
  Send,
  Trash2,
  CheckCircle,
  Users,
  Briefcase,
  Layers,
  Sparkles
} from 'lucide-react';

export const AdminShortlisting = () => {
  const [activeTab, setActiveTab] = useState('builder'); // 'builder' | 'saved'

  // Criteria
  const [minScore, setMinScore] = useState(70);
  const [minCGPA, setMinCGPA] = useState(7.0);
  const [selectedBranches, setSelectedBranches] = useState(['Computer Science & Engineering', 'Information Technology', 'Electronics & Communication Engineering']);
  const [targetTier, setTargetTier] = useState('tier1');
  const [minDsaSolved, setMinDsaSolved] = useState(15);
  const [noBacklogs, setNoBacklogs] = useState(true);

  // Results
  const [eligibleStudents, setEligibleStudents] = useState([]);
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);
  const [loading, setLoading] = useState(false);

  // Saved Shortlists
  const [savedShortlists, setSavedShortlists] = useState([]);
  const [drives, setDrives] = useState([]);

  // Save Modal
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [shortlistName, setShortlistName] = useState('');
  const [linkedDriveId, setLinkedDriveId] = useState('');
  const [notificationSent, setNotificationSent] = useState({});

  const branchesList = [
    { label: 'CSE', value: 'Computer Science & Engineering' },
    { label: 'IT', value: 'Information Technology' },
    { label: 'ECE', value: 'Electronics & Communication Engineering' },
    { label: 'EE', value: 'Electrical Engineering' },
    { label: 'ME', value: 'Mechanical Engineering' }
  ];

  // Evaluate Shortlist Live
  const evaluateLive = async () => {
    setLoading(true);
    try {
      const res = await api.buildShortlistCriteria({
        minScore,
        minCGPA,
        branches: selectedBranches,
        targetTier,
        minDsaSolved,
        noBacklogs
      });
      if (res.success) {
        setEligibleStudents(res.students || []);
        setSelectedStudentIds((res.students || []).map(s => s.id));
      }
    } catch (err) {
      console.error('Error evaluating shortlist:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    evaluateLive();
  }, [minScore, minCGPA, selectedBranches, targetTier, minDsaSolved, noBacklogs]);

  // Load Saved
  const loadSavedData = async () => {
    try {
      const [shortlistsRes, drivesRes] = await Promise.all([
        api.getAdminShortlists(),
        api.getAdminDrives()
      ]);
      if (shortlistsRes.success) setSavedShortlists(shortlistsRes.shortlists || []);
      if (drivesRes.success) setDrives(drivesRes.drives || []);
    } catch (err) {
      console.error('Failed to load saved shortlists:', err);
    }
  };

  useEffect(() => {
    loadSavedData();
  }, []);

  const handleBranchToggle = (branch) => {
    if (selectedBranches.includes(branch)) {
      setSelectedBranches(selectedBranches.filter(b => b !== branch));
    } else {
      setSelectedBranches([...selectedBranches, branch]);
    }
  };

  const handleSaveShortlist = async (e) => {
    e.preventDefault();
    try {
      const res = await api.saveShortlist({
        name: shortlistName,
        linkedDriveId,
        studentIds: selectedStudentIds,
        criteria: { minScore, minCGPA, branches: selectedBranches, targetTier, minDsaSolved, noBacklogs }
      });
      if (res.success) {
        setShowSaveModal(false);
        setShortlistName('');
        loadSavedData();
        setActiveTab('saved');
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteShortlist = async (id) => {
    if (!window.confirm('Are you sure you want to delete this saved shortlist?')) return;
    try {
      await api.deleteShortlist(id);
      loadSavedData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleNotifyShortlisted = async (shortlist) => {
    setNotificationSent(prev => ({ ...prev, [shortlist.id]: true }));
    try {
      await api.sendAdminNotification({
        title: `Congratulations! Shortlisted for ${shortlist.name}`,
        message: `You have met the institutional readiness benchmarks and are shortlisted for upcoming placement drive: ${shortlist.name}. Please ensure your resume is up to date.`,
        type: 'Drive',
        audience: 'Specific',
        recipientIds: shortlist.studentIds
      });
      alert(`Notification sent to ${shortlist.studentIds?.length || 0} shortlisted candidates!`);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleExportCSV = (studentsList, name = 'shortlist') => {
    const headers = ['Name,Email,Roll,Branch,CGPA,ReadinessScore,TargetTier'];
    const rows = studentsList.map(s => `"${s.name}","${s.email}","${s.rollNo || ''}","${s.branch}",${s.cgpa},${s.readinessScore || 0},"${s.targetTier}"`);
    const csvContent = headers.concat(rows).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>
            Drive Shortlisting & Criteria Engine
          </h2>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>
            Build multi-parameter filters to instantly qualify students for company recruitment rounds.
          </p>
        </div>

        {/* Tab Toggle */}
        <div style={{ display: 'flex', background: '#e2e8f0', padding: '0.25rem', borderRadius: '8px' }}>
          <button
            onClick={() => setActiveTab('builder')}
            style={{
              padding: '0.45rem 1rem',
              borderRadius: '6px',
              border: 'none',
              background: activeTab === 'builder' ? '#ffffff' : 'transparent',
              fontWeight: 600,
              fontSize: '0.82rem',
              color: activeTab === 'builder' ? '#0f172a' : '#64748b',
              cursor: 'pointer'
            }}
          >
            Criteria Builder
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            style={{
              padding: '0.45rem 1rem',
              borderRadius: '6px',
              border: 'none',
              background: activeTab === 'saved' ? '#ffffff' : 'transparent',
              fontWeight: 600,
              fontSize: '0.82rem',
              color: activeTab === 'saved' ? '#0f172a' : '#64748b',
              cursor: 'pointer'
            }}
          >
            Saved Shortlists ({savedShortlists.length})
          </button>
        </div>
      </div>

      {activeTab === 'builder' ? (
        <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: '1.5rem' }}>
          {/* Left Criteria Controls */}
          <div style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Filter size={18} color="#2563eb" /> Filter Parameters
            </h3>

            {/* Target Tier */}
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.35rem' }}>
                Company Placement Tier
              </label>
              <select
                value={targetTier}
                onChange={(e) => setTargetTier(e.target.value)}
                style={{ width: '100%', padding: '0.55rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
              >
                <option value="tier1">Product Tier-1 (FAANG, Unicorns &gt; 12 LPA)</option>
                <option value="tier2">Service Tier-2 (TCS Digital, Infosys 6-10 LPA)</option>
                <option value="tier3">Core Engineering & PSU</option>
              </select>
            </div>

            {/* Min Readiness Score Slider */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                <span>Min Readiness Score</span>
                <span style={{ color: '#2563eb' }}>{minScore}%</span>
              </div>
              <input
                type="range"
                min="40"
                max="95"
                value={minScore}
                onChange={(e) => setMinScore(parseInt(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>

            {/* Min CGPA Slider */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                <span>Min Academic CGPA</span>
                <span style={{ color: '#16a34a' }}>{minCGPA.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="5.0"
                max="9.0"
                step="0.1"
                value={minCGPA}
                onChange={(e) => setMinCGPA(parseFloat(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>

            {/* Min DSA Solved */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                <span>Min DSA Problems Solved</span>
                <span style={{ color: '#9333ea' }}>{minDsaSolved}</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                value={minDsaSolved}
                onChange={(e) => setMinDsaSolved(parseInt(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>

            {/* Allowed Branches */}
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.5rem' }}>
                Eligible Engineering Branches
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {branchesList.map((b) => (
                  <label key={b.value} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={selectedBranches.includes(b.value)}
                      onChange={() => handleBranchToggle(b.value)}
                    />
                    <span>{b.label} ({b.value.split(' ')[0]})</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Backlog Free */}
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', cursor: 'pointer', marginTop: '0.5rem' }}>
              <input
                type="checkbox"
                checked={noBacklogs}
                onChange={(e) => setNoBacklogs(e.target.checked)}
              />
              <span style={{ fontWeight: 600 }}>Active Backlog Free Mandatory</span>
            </label>
          </div>

          {/* Right Live Results Panel */}
          <div style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  background: '#eff6ff',
                  color: '#2563eb',
                  padding: '0.4rem 0.85rem',
                  borderRadius: '20px',
                  fontWeight: 800,
                  fontSize: '0.9rem'
                }}>
                  {eligibleStudents.length} Students Qualified
                </div>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                  {selectedStudentIds.length} selected for action
                </span>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  onClick={() => handleExportCSV(eligibleStudents, 'shortlist')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    background: '#f1f5f9',
                    border: '1px solid #cbd5e1',
                    padding: '0.5rem 0.85rem',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  <Download size={14} /> Export CSV
                </button>
                <button
                  onClick={() => setShowSaveModal(true)}
                  disabled={eligibleStudents.length === 0}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    background: '#2563eb',
                    color: 'white',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    cursor: eligibleStudents.length === 0 ? 'default' : 'pointer'
                  }}
                >
                  <Save size={14} /> Save Shortlist
                </button>
              </div>
            </div>

            {/* Candidates Table */}
            <div style={{ flex: 1, overflowY: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>
                    <th style={{ padding: '0.65rem', textAlign: 'left', width: '30px' }}>
                      <input
                        type="checkbox"
                        checked={selectedStudentIds.length === eligibleStudents.length && eligibleStudents.length > 0}
                        onChange={(e) => {
                          if (e.target.checked) setSelectedStudentIds(eligibleStudents.map(s => s.id));
                          else setSelectedStudentIds([]);
                        }}
                      />
                    </th>
                    <th style={{ padding: '0.65rem', textAlign: 'left' }}>Candidate</th>
                    <th style={{ padding: '0.65rem', textAlign: 'left' }}>Branch & Roll</th>
                    <th style={{ padding: '0.65rem', textAlign: 'left' }}>CGPA</th>
                    <th style={{ padding: '0.65rem', textAlign: 'left' }}>Readiness</th>
                    <th style={{ padding: '0.65rem', textAlign: 'left' }}>DSA Count</th>
                  </tr>
                </thead>
                <tbody>
                  {eligibleStudents.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                        No candidates match the selected threshold criteria. Try adjusting sliders.
                      </td>
                    </tr>
                  ) : (
                    eligibleStudents.map((s) => {
                      const isChecked = selectedStudentIds.includes(s.id);
                      return (
                        <tr key={s.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '0.65rem' }}>
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => {
                                if (isChecked) setSelectedStudentIds(selectedStudentIds.filter(x => x !== s.id));
                                else setSelectedStudentIds([...selectedStudentIds, s.id]);
                              }}
                            />
                          </td>
                          <td style={{ padding: '0.65rem' }}>
                            <div style={{ fontWeight: 600, color: '#0f172a' }}>{s.name}</div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{s.email}</div>
                          </td>
                          <td style={{ padding: '0.65rem' }}>
                            <div>{s.branch}</div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{s.rollNo}</div>
                          </td>
                          <td style={{ padding: '0.65rem', fontWeight: 700 }}>{s.cgpa}</td>
                          <td style={{ padding: '0.65rem', fontWeight: 800, color: (s.readinessScore || 0) >= 75 ? '#16a34a' : '#d97706' }}>
                            {s.readinessScore || 0}%
                          </td>
                          <td style={{ padding: '0.65rem' }}>
                            <span style={{ background: '#f1f5f9', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 600 }}>
                              {s.dsaSolvedCount || Math.round((s.pillars?.dsa || 60) * 0.5)} solved
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* Saved Shortlists View */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {savedShortlists.length === 0 ? (
            <div style={{ background: '#ffffff', padding: '3rem', borderRadius: '14px', textAlign: 'center', color: '#94a3b8', gridColumn: '1 / -1' }}>
              No shortlists saved yet. Build and save a shortlist in the Criteria Builder.
            </div>
          ) : (
            savedShortlists.map((sl) => (
              <div key={sl.id} style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>{sl.name}</h3>
                    <span style={{ background: '#eff6ff', color: '#2563eb', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700 }}>
                      {sl.studentIds?.length || 0} Candidates
                    </span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '1rem' }}>
                    Target: {sl.criteria?.targetTier?.toUpperCase()} • Min Score: {sl.criteria?.minScore}% • Min CGPA: {sl.criteria?.minCGPA}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                    Saved on {new Date(sl.createdAt || Date.now()).toLocaleDateString()}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.25rem', borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
                  <button
                    onClick={() => handleNotifyShortlisted(sl)}
                    disabled={notificationSent[sl.id]}
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.35rem',
                      background: notificationSent[sl.id] ? '#f1f5f9' : '#3b82f6',
                      color: notificationSent[sl.id] ? '#94a3b8' : 'white',
                      border: 'none',
                      padding: '0.5rem',
                      borderRadius: '6px',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: notificationSent[sl.id] ? 'default' : 'pointer'
                    }}
                  >
                    <Send size={14} /> {notificationSent[sl.id] ? 'Notified' : 'Notify Students'}
                  </button>
                  <button
                    onClick={() => handleDeleteShortlist(sl.id)}
                    style={{ background: '#fee2e2', border: 'none', color: '#ef4444', padding: '0.5rem', borderRadius: '6px', cursor: 'pointer' }}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Save Shortlist Modal */}
      {showSaveModal && (
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
            width: '460px',
            padding: '2rem',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
          }}>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.2rem', fontWeight: 800 }}>Save Candidate Shortlist</h3>
            <form onSubmit={handleSaveShortlist} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.3rem' }}>
                  Shortlist Label / Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Amazon SDE-1 Eligible Round 1"
                  value={shortlistName}
                  onChange={(e) => setShortlistName(e.target.value)}
                  style={{ width: '100%', padding: '0.55rem', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.3rem' }}>
                  Link to Recruitment Drive (Optional)
                </label>
                <select
                  value={linkedDriveId}
                  onChange={(e) => setLinkedDriveId(e.target.value)}
                  style={{ width: '100%', padding: '0.55rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                >
                  <option value="">No linked drive (General shortlist)</option>
                  {drives.map(d => (
                    <option key={d.id} value={d.id}>{d.companyName} - {d.role}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setShowSaveModal(false)}
                  style={{ padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#f8fafc', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '0.6rem 1.25rem', borderRadius: '8px', border: 'none', background: '#2563eb', color: 'white', fontWeight: 600, cursor: 'pointer' }}
                >
                  Confirm & Save ({selectedStudentIds.length} Candidates)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
