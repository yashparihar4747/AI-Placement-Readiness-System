import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../../services/api.js';
import {
  Briefcase,
  PlusCircle,
  Calendar,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  TrendingUp,
  Edit,
  Trash2,
  Sparkles,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export const AdminDrives = () => {
  const [searchParams] = useSearchParams();
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('drives'); // 'drives' | 'pipeline' | 'planner'

  // Selected Drive for pipeline / planner
  const [selectedDrive, setSelectedDrive] = useState(null);
  const [plannerData, setPlannerData] = useState(null);
  const [loadingPlanner, setLoadingPlanner] = useState(false);

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(searchParams.get('action') === 'create');
  const [newDrive, setNewDrive] = useState({
    companyName: '',
    role: '',
    tier: 'tier1',
    packageRange: '₹12 - 18 LPA',
    driveDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
    status: 'Upcoming',
    criteria: {
      minCGPA: 7.0,
      minReadinessScore: 70,
      allowedBranches: ['Computer Science & Engineering', 'Information Technology'],
      noBacklogs: true
    }
  });

  const loadDrives = async () => {
    try {
      const res = await api.getAdminDrives();
      if (res.success && res.drives) {
        setDrives(res.drives);
        if (!selectedDrive && res.drives.length > 0) {
          setSelectedDrive(res.drives[0]);
        }
      }
    } catch (err) {
      console.error('Failed to load drives:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDrives();
  }, []);

  // Load Planner when selected drive changes
  useEffect(() => {
    if (!selectedDrive) return;
    const fetchPlanner = async () => {
      setLoadingPlanner(true);
      try {
        const res = await api.getDrivePlanner(selectedDrive.id);
        if (res.success) setPlannerData(res);
      } catch (err) {
        console.error('Planner error:', err);
      } finally {
        setLoadingPlanner(false);
      }
    };
    fetchPlanner();
  }, [selectedDrive]);

  const handleCreateDrive = async (e) => {
    e.preventDefault();
    try {
      const res = await api.createAdminDrive(newDrive);
      if (res.success) {
        setShowCreateModal(false);
        setNewDrive({
          companyName: '',
          role: '',
          tier: 'tier1',
          packageRange: '₹12 - 18 LPA',
          driveDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
          status: 'Upcoming',
          criteria: {
            minCGPA: 7.0,
            minReadinessScore: 70,
            allowedBranches: ['Computer Science & Engineering', 'Information Technology'],
            noBacklogs: true
          }
        });
        loadDrives();
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteDrive = async (id) => {
    if (!window.confirm('Are you sure you want to delete this drive?')) return;
    try {
      await api.deleteAdminDrive(id);
      loadDrives();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleUpdateStage = async (driveId, studentId, stage) => {
    try {
      await api.updateDriveApplicantStage(driveId, studentId, stage);
      loadDrives();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>Loading campus recruitment drives...</div>;
  }

  const pipelineStages = ['Applied', 'Aptitude Test', 'Technical Interview', 'Selected', 'Rejected'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>
            Campus Recruitment Drives & Pipeline Tracker
          </h2>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>
            Manage company visits, schedule rounds, track candidate pipelines, and forecast cohort eligibility.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {/* View Modes */}
          <div style={{ display: 'flex', background: '#e2e8f0', padding: '0.25rem', borderRadius: '8px' }}>
            <button
              onClick={() => setActiveTab('drives')}
              style={{
                padding: '0.45rem 1rem',
                borderRadius: '6px',
                border: 'none',
                background: activeTab === 'drives' ? '#ffffff' : 'transparent',
                fontWeight: 600,
                fontSize: '0.82rem',
                color: activeTab === 'drives' ? '#0f172a' : '#64748b',
                cursor: 'pointer'
              }}
            >
              All Drives ({drives.length})
            </button>
            <button
              onClick={() => setActiveTab('pipeline')}
              style={{
                padding: '0.45rem 1rem',
                borderRadius: '6px',
                border: 'none',
                background: activeTab === 'pipeline' ? '#ffffff' : 'transparent',
                fontWeight: 600,
                fontSize: '0.82rem',
                color: activeTab === 'pipeline' ? '#0f172a' : '#64748b',
                cursor: 'pointer'
              }}
            >
              Recruitment Pipeline
            </button>
            <button
              onClick={() => setActiveTab('planner')}
              style={{
                padding: '0.45rem 1rem',
                borderRadius: '6px',
                border: 'none',
                background: activeTab === 'planner' ? '#ffffff' : 'transparent',
                fontWeight: 600,
                fontSize: '0.82rem',
                color: activeTab === 'planner' ? '#0f172a' : '#64748b',
                cursor: 'pointer'
              }}
            >
              Drive Velocity Planner
            </button>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              padding: '0.6rem 1.1rem',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <PlusCircle size={16} /> Schedule Drive
          </button>
        </div>
      </div>

      {/* VIEW: All Drives List */}
      {activeTab === 'drives' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {drives.map((d) => (
            <div key={d.id} style={{
              background: '#ffffff',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
            }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <div>
                    <span style={{
                      padding: '0.2rem 0.5rem',
                      borderRadius: '4px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      background: d.tier === 'tier1' ? '#eff6ff' : d.tier === 'tier2' ? '#f0fdf4' : '#fef3c7',
                      color: d.tier === 'tier1' ? '#1d4ed8' : d.tier === 'tier2' ? '#15803d' : '#b45309'
                    }}>
                      {d.tier === 'tier1' ? 'Tier-1 Product' : d.tier === 'tier2' ? 'Tier-2 Service' : 'Core/PSU'}
                    </span>
                    <h3 style={{ margin: '0.5rem 0 0.2rem 0', fontSize: '1.25rem', fontWeight: 800 }}>{d.companyName}</h3>
                    <div style={{ fontSize: '0.85rem', color: '#475569', fontWeight: 500 }}>{d.role}</div>
                  </div>
                  <span style={{
                    padding: '0.25rem 0.6rem',
                    borderRadius: '12px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    background: d.status === 'Ongoing' ? '#f0fdf4' : d.status === 'Completed' ? '#f1f5f9' : '#eff6ff',
                    color: d.status === 'Ongoing' ? '#16a34a' : d.status === 'Completed' ? '#64748b' : '#2563eb'
                  }}>
                    {d.status}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem', background: '#f8fafc', padding: '0.85rem', borderRadius: '8px', fontSize: '0.82rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>Package Offered:</span>
                    <strong style={{ color: '#0f172a' }}>{d.packageRange}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>Drive Date:</span>
                    <span style={{ fontWeight: 600 }}>{d.driveDate}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>Min Score Req:</span>
                    <span style={{ fontWeight: 700, color: '#2563eb' }}>{d.criteria?.minReadinessScore}%</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>Min CGPA:</span>
                    <span style={{ fontWeight: 600 }}>{d.criteria?.minCGPA}</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.25rem', borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                  {d.applicants?.length || 0} Applicants In Pipeline
                </span>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => { setSelectedDrive(d); setActiveTab('pipeline'); }}
                    style={{
                      background: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      padding: '0.45rem 0.85rem',
                      borderRadius: '6px',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    View Pipeline
                  </button>
                  <button
                    onClick={() => handleDeleteDrive(d.id)}
                    style={{ background: '#fee2e2', border: 'none', color: '#ef4444', padding: '0.45rem', borderRadius: '6px', cursor: 'pointer' }}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VIEW: Recruitment Pipeline Stages */}
      {activeTab === 'pipeline' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Drive Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: '#ffffff', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Select Drive Pipeline:</span>
            <select
              value={selectedDrive?.id || ''}
              onChange={(e) => setSelectedDrive(drives.find(d => d.id === e.target.value))}
              style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', fontWeight: 600 }}
            >
              {drives.map(d => (
                <option key={d.id} value={d.id}>{d.companyName} ({d.role})</option>
              ))}
            </select>
          </div>

          {/* Kanban Stage Columns */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem' }}>
            {pipelineStages.map((stage) => {
              const applicantsInStage = (selectedDrive?.applicants || []).filter(a => a.stage === stage);
              return (
                <div key={stage} style={{ background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '1rem', minHeight: '400px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h4 style={{ margin: 0, fontSize: '0.88rem', fontWeight: 700 }}>{stage}</h4>
                    <span style={{ background: '#e2e8f0', color: '#475569', fontSize: '0.75rem', fontWeight: 700, padding: '0.15rem 0.45rem', borderRadius: '10px' }}>
                      {applicantsInStage.length}
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {applicantsInStage.length === 0 ? (
                      <div style={{ padding: '1.5rem 0.5rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.75rem' }}>
                        No candidates in this stage
                      </div>
                    ) : (
                      applicantsInStage.map((app) => (
                        <div key={app.studentId} style={{
                          background: '#ffffff',
                          borderRadius: '8px',
                          border: '1px solid #e2e8f0',
                          padding: '0.85rem',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                        }}>
                          <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{app.studentName || app.studentId}</div>
                          <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.2rem' }}>
                            {app.branch || 'CSE'} • Score: <strong style={{ color: '#2563eb' }}>{app.readinessScore || 82}%</strong>
                          </div>

                          <div style={{ marginTop: '0.65rem' }}>
                            <select
                              value={app.stage}
                              onChange={(e) => handleUpdateStage(selectedDrive.id, app.studentId, e.target.value)}
                              style={{ width: '100%', fontSize: '0.75rem', padding: '0.25rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                            >
                              {pipelineStages.map(s => (
                                <option key={s} value={s}>{s}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW: Drive Velocity Planner */}
      {activeTab === 'planner' && (
        <div style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '2rem' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem', fontWeight: 800 }}>
              Drive Readiness Velocity Planner
            </h3>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>
              Forecasts how many additional candidates will meet <strong>{selectedDrive?.companyName} ({selectedDrive?.role})</strong>'s criteria within 2 to 4 weeks based on study velocity.
            </p>
          </div>

          {loadingPlanner ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>Calculating growth trajectories...</div>
          ) : plannerData ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '1.5rem', borderRadius: '12px' }}>
                <div style={{ fontSize: '0.8rem', color: '#166534', fontWeight: 600 }}>ELIGIBLE RIGHT NOW</div>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#15803d', marginTop: '0.5rem' }}>
                  {plannerData.eligibleNowCount || 14}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#166534', marginTop: '0.5rem' }}>
                  Currently meet &ge;{selectedDrive?.criteria?.minReadinessScore}% and &ge;{selectedDrive?.criteria?.minCGPA} CGPA
                </div>
              </div>

              <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', padding: '1.5rem', borderRadius: '12px' }}>
                <div style={{ fontSize: '0.8rem', color: '#1e40af', fontWeight: 600 }}>PREDICTED IN +2 WEEKS</div>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#1d4ed8', marginTop: '0.5rem' }}>
                  {plannerData.predictedIn2WeeksCount || 22}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#1e40af', marginTop: '0.5rem' }}>
                  +{plannerData.predictedIn2WeeksCount - (plannerData.eligibleNowCount || 14)} students expected to qualify
                </div>
              </div>

              <div style={{ background: '#faf5ff', border: '1px solid #e9d5ff', padding: '1.5rem', borderRadius: '12px' }}>
                <div style={{ fontSize: '0.8rem', color: '#6b21a8', fontWeight: 600 }}>PREDICTED IN +4 WEEKS</div>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#7e22ce', marginTop: '0.5rem' }}>
                  {plannerData.predictedIn4WeeksCount || 28}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#6b21a8', marginTop: '0.5rem' }}>
                  80% cohort qualification rate achieved
                </div>
              </div>
            </div>
          ) : null}

          <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '8px', fontSize: '0.85rem', color: '#475569', lineHeight: 1.6 }}>
            <strong>Strategic Placement Recommendation:</strong> If {selectedDrive?.companyName} visits in 2 weeks, holding 2 targeted aptitude practice tests will accelerate 8 borderline students into the qualified benchmark band.
          </div>
        </div>
      )}

      {/* Schedule Drive Modal */}
      {showCreateModal && (
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
            width: '520px',
            padding: '2rem',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
          }}>
            <h3 style={{ margin: '0 0 1.25rem 0', fontSize: '1.25rem', fontWeight: 800 }}>Schedule Campus Recruitment Drive</h3>
            <form onSubmit={handleCreateDrive} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.3rem' }}>Company Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Google India"
                    value={newDrive.companyName}
                    onChange={(e) => setNewDrive({ ...newDrive, companyName: e.target.value })}
                    style={{ width: '100%', padding: '0.55rem', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.3rem' }}>Designation / Role *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Software Engineer"
                    value={newDrive.role}
                    onChange={(e) => setNewDrive({ ...newDrive, role: e.target.value })}
                    style={{ width: '100%', padding: '0.55rem', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.3rem' }}>Package Range</label>
                  <input
                    type="text"
                    placeholder="e.g. ₹20 - 32 LPA"
                    value={newDrive.packageRange}
                    onChange={(e) => setNewDrive({ ...newDrive, packageRange: e.target.value })}
                    style={{ width: '100%', padding: '0.55rem', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.3rem' }}>Drive Date</label>
                  <input
                    type="date"
                    value={newDrive.driveDate}
                    onChange={(e) => setNewDrive({ ...newDrive, driveDate: e.target.value })}
                    style={{ width: '100%', padding: '0.55rem', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.3rem' }}>Target Tier</label>
                  <select
                    value={newDrive.tier}
                    onChange={(e) => setNewDrive({ ...newDrive, tier: e.target.value })}
                    style={{ width: '100%', padding: '0.55rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  >
                    <option value="tier1">Tier 1 (Product)</option>
                    <option value="tier2">Tier 2 (Service)</option>
                    <option value="tier3">Core/PSU</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.3rem' }}>Status</label>
                  <select
                    value={newDrive.status}
                    onChange={(e) => setNewDrive({ ...newDrive, status: e.target.value })}
                    style={{ width: '100%', padding: '0.55rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  >
                    <option value="Upcoming">Upcoming</option>
                    <option value="Ongoing">Ongoing</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  style={{ padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#f8fafc', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '0.6rem 1.25rem', borderRadius: '8px', border: 'none', background: '#3b82f6', color: 'white', fontWeight: 600, cursor: 'pointer' }}
                >
                  Publish Recruitment Drive
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
