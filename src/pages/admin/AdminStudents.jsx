import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../../services/api.js';
import {
  Users,
  Search,
  Filter,
  UserPlus,
  Upload,
  Download,
  Trash2,
  Edit,
  Eye,
  Key,
  CheckCircle,
  XCircle,
  ArrowUpDown,
  MoreVertical,
  Shield,
  Layers,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip } from 'recharts';

export const AdminStudents = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [students, setStudents] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  // Filters & State
  const [search, setSearch] = useState('');
  const [branch, setBranch] = useState('');
  const [tier, setTier] = useState('');
  const [scoreRange, setScoreRange] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState('readinessScore');
  const [sortOrder, setSortOrder] = useState('desc');

  // Modals
  const [showAddModal, setShowAddModal] = useState(searchParams.get('action') === 'add');
  const [showImportModal, setShowImportModal] = useState(false);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);
  const [deleteConfirmStudent, setDeleteConfirmStudent] = useState(null);

  // New Student Form
  const [newStudent, setNewStudent] = useState({
    name: '',
    email: '',
    rollNo: '',
    branch: 'Computer Science & Engineering',
    batch: '2026',
    cgpa: '8.0',
    targetTier: 'tier1',
    password: 'Demo@1234'
  });

  // Bulk CSV text
  const [csvText, setCsvText] = useState('');
  const [importReport, setImportReport] = useState(null);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await api.getAdminStudents({
        search,
        branch,
        tier,
        scoreRange,
        status,
        page,
        limit: 15,
        sortBy,
        sortOrder
      });
      if (res.success) {
        setStudents(res.students || []);
        setTotal(res.total || 0);
      }
    } catch (err) {
      console.error('Failed to load students:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [search, branch, tier, scoreRange, status, page, sortBy, sortOrder]);

  const handleCreateStudent = async (e) => {
    e.preventDefault();
    try {
      const res = await api.createAdminStudent({
        ...newStudent,
        cgpa: parseFloat(newStudent.cgpa) || 8.0
      });
      if (res.success) {
        setShowAddModal(false);
        setNewStudent({
          name: '',
          email: '',
          rollNo: '',
          branch: 'Computer Science & Engineering',
          batch: '2026',
          cgpa: '8.0',
          targetTier: 'tier1',
          password: 'Demo@1234'
        });
        fetchStudents();
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleBulkImport = async () => {
    try {
      // Parse CSV
      const lines = csvText.trim().split('\n');
      const parsed = [];
      for (let i = 1; i < lines.length; i++) {
        const parts = lines[i].split(',').map(p => p.trim());
        if (parts.length >= 3 && parts[0] && parts[1]) {
          parsed.push({
            name: parts[0],
            email: parts[1],
            rollNo: parts[2] || `23IT${i + 50}`,
            branch: parts[3] || 'Computer Science & Engineering',
            batch: parts[4] || '2026',
            cgpa: parseFloat(parts[5]) || 7.5,
            targetTier: parts[6] || 'tier1'
          });
        }
      }

      if (parsed.length === 0) {
        alert('No valid rows found. Please follow the CSV template.');
        return;
      }

      const res = await api.bulkImportStudents(parsed);
      setImportReport(res);
      fetchStudents();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (permanent = false) => {
    if (!deleteConfirmStudent) return;
    try {
      await api.deleteAdminStudent(deleteConfirmStudent.id, permanent);
      setDeleteConfirmStudent(null);
      fetchStudents();
    } catch (err) {
      alert(err.message);
    }
  };

  const toggleSelectStudent = (id) => {
    if (selectedStudentIds.includes(id)) {
      setSelectedStudentIds(selectedStudentIds.filter(x => x !== id));
    } else {
      if (selectedStudentIds.length < 2) {
        setSelectedStudentIds([...selectedStudentIds, id]);
      } else {
        setSelectedStudentIds([selectedStudentIds[1], id]);
      }
    }
  };

  // Compare candidates
  const student1 = students.find(s => s.id === selectedStudentIds[0]) || students[0];
  const student2 = students.find(s => s.id === selectedStudentIds[1]) || students[1];

  const compareRadarData = [
    { pillar: 'DSA & Coding', [student1?.name || 'Student 1']: student1?.pillars?.dsa || 75, [student2?.name || 'Student 2']: student2?.pillars?.dsa || 60 },
    { pillar: 'Aptitude & Core', [student1?.name || 'Student 1']: student1?.pillars?.aptitude || 80, [student2?.name || 'Student 2']: student2?.pillars?.aptitude || 70 },
    { pillar: 'ATS Resume', [student1?.name || 'Student 1']: student1?.pillars?.resume || 72, [student2?.name || 'Student 2']: student2?.pillars?.resume || 85 },
    { pillar: 'Mock Interview', [student1?.name || 'Student 1']: student1?.pillars?.interview || 82, [student2?.name || 'Student 2']: student2?.pillars?.interview || 65 },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Action Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>
            Student Registry & Performance Directory
          </h2>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>
            Total {total} enrolled students. Manage profiles, track pillar progression, and compare benchmarks.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {selectedStudentIds.length === 2 && (
            <button
              onClick={() => setShowCompareModal(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: '#8b5cf6',
                color: 'white',
                border: 'none',
                padding: '0.6rem 1rem',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <Layers size={16} /> Compare Selected (2)
            </button>
          )}

          <button
            onClick={() => setShowImportModal(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: '#f1f5f9',
              color: '#334155',
              border: '1px solid #cbd5e1',
              padding: '0.6rem 1rem',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <Upload size={16} /> Bulk Import CSV
          </button>

          <button
            onClick={() => setShowAddModal(true)}
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
            <UserPlus size={16} /> Add Student
          </button>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div style={{
        background: '#ffffff',
        padding: '1.25rem',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '1rem',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Search */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: '#f8fafc',
          padding: '0.5rem 0.75rem',
          borderRadius: '8px',
          border: '1px solid #e2e8f0',
          width: '280px'
        }}>
          <Search size={16} color="#94a3b8" />
          <input
            type="text"
            placeholder="Search by name, roll no, email..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            style={{ background: 'transparent', border: 'none', outline: 'none', fontSize: '0.85rem', width: '100%' }}
          />
        </div>

        {/* Dropdown Filters */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {/* Branch */}
          <select
            value={branch}
            onChange={(e) => { setBranch(e.target.value); setPage(1); }}
            style={{ padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', background: '#ffffff' }}
          >
            <option value="">All Branches</option>
            <option value="Computer Science & Engineering">CSE</option>
            <option value="Information Technology">IT</option>
            <option value="Electronics & Communication Engineering">ECE</option>
            <option value="Electrical Engineering">EE</option>
            <option value="Mechanical Engineering">ME</option>
          </select>

          {/* Tier */}
          <select
            value={tier}
            onChange={(e) => { setTier(e.target.value); setPage(1); }}
            style={{ padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', background: '#ffffff' }}
          >
            <option value="">All Target Tiers</option>
            <option value="tier1">Tier 1 (Product)</option>
            <option value="tier2">Tier 2 (Service)</option>
            <option value="tier3">Tier 3 (Core/PSU)</option>
          </select>

          {/* Score Range */}
          <select
            value={scoreRange}
            onChange={(e) => { setScoreRange(e.target.value); setPage(1); }}
            style={{ padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', background: '#ffffff' }}
          >
            <option value="">All Readiness Scores</option>
            <option value="75-100">&ge; 75 (Placement Ready)</option>
            <option value="60-74">60 - 74 (Developing)</option>
            <option value="0-59">&lt; 60 (Needs Work)</option>
          </select>

          {/* Status */}
          <select
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(1); }}
            style={{ padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', background: '#ffffff' }}
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="at_risk">At-Risk</option>
            <option value="inactive">Inactive</option>
          </select>

          {/* Reset button */}
          {(search || branch || tier || scoreRange || status) && (
            <button
              onClick={() => { setSearch(''); setBranch(''); setTier(''); setScoreRange(''); setStatus(''); setPage(1); }}
              style={{
                background: '#f1f5f9',
                border: 'none',
                padding: '0.5rem 0.75rem',
                borderRadius: '8px',
                fontSize: '0.82rem',
                color: '#64748b',
                cursor: 'pointer'
              }}
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Main Student Data Table */}
      <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontWeight: 600 }}>
              <th style={{ padding: '0.85rem 1rem', width: '40px' }}>Select</th>
              <th style={{ padding: '0.85rem 1rem' }}>Student Name</th>
              <th style={{ padding: '0.85rem 1rem' }}>Branch & Roll</th>
              <th style={{ padding: '0.85rem 1rem' }}>CGPA</th>
              <th style={{ padding: '0.85rem 1rem' }}>Target Tier</th>
              <th style={{ padding: '0.85rem 1rem' }}>Readiness Score</th>
              <th style={{ padding: '0.85rem 1rem' }}>Pillar Strengths</th>
              <th style={{ padding: '0.85rem 1rem' }}>Status</th>
              <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={9} style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                  Loading students...
                </td>
              </tr>
            ) : students.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                  No students found matching current filter criteria.
                </td>
              </tr>
            ) : (
              students.map((s) => {
                const score = s.readinessScore || 0;
                const isSelected = selectedStudentIds.includes(s.id);
                return (
                  <tr
                    key={s.id}
                    style={{
                      borderBottom: '1px solid #f1f5f9',
                      background: isSelected ? '#f5f3ff' : 'transparent',
                      transition: 'background 0.1s ease'
                    }}
                  >
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectStudent(s.id)}
                        style={{ cursor: 'pointer' }}
                      />
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div
                        onClick={() => navigate(`/admin/students/${s.id}`)}
                        style={{ fontWeight: 600, color: '#3b82f6', cursor: 'pointer' }}
                      >
                        {s.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{s.email}</div>
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ fontWeight: 500 }}>{s.branch}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Roll: {s.rollNo || 'N/A'}</div>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>
                      {s.cgpa || 7.5}
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span style={{
                        padding: '0.2rem 0.5rem',
                        borderRadius: '4px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        background: s.targetTier === 'tier1' ? '#eff6ff' : s.targetTier === 'tier2' ? '#f0fdf4' : '#fef3c7',
                        color: s.targetTier === 'tier1' ? '#1d4ed8' : s.targetTier === 'tier2' ? '#15803d' : '#b45309'
                      }}>
                        {s.targetTier === 'tier1' ? 'Tier-1 Product' : s.targetTier === 'tier2' ? 'Tier-2 Service' : 'Tier-3 Core'}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{
                          fontWeight: 800,
                          fontSize: '0.95rem',
                          color: score >= 75 ? '#16a34a' : score >= 60 ? '#d97706' : '#dc2626'
                        }}>
                          {score}%
                        </div>
                        <div style={{
                          width: '60px',
                          height: '6px',
                          background: '#f1f5f9',
                          borderRadius: '3px',
                          overflow: 'hidden'
                        }}>
                          <div style={{
                            width: `${Math.min(100, score)}%`,
                            height: '100%',
                            background: score >= 75 ? '#16a34a' : score >= 60 ? '#d97706' : '#dc2626'
                          }} />
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ display: 'flex', gap: '0.35rem', fontSize: '0.7rem' }}>
                        <span title="DSA" style={{ background: '#f1f5f9', padding: '0.15rem 0.35rem', borderRadius: '3px' }}>
                          D:{s.pillars?.dsa || 0}
                        </span>
                        <span title="Aptitude" style={{ background: '#f1f5f9', padding: '0.15rem 0.35rem', borderRadius: '3px' }}>
                          A:{s.pillars?.aptitude || 0}
                        </span>
                        <span title="Resume" style={{ background: '#f1f5f9', padding: '0.15rem 0.35rem', borderRadius: '3px' }}>
                          R:{s.pillars?.resume || 0}
                        </span>
                        <span title="Interview" style={{ background: '#f1f5f9', padding: '0.15rem 0.35rem', borderRadius: '3px' }}>
                          I:{s.pillars?.interview || 0}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span style={{
                        padding: '0.2rem 0.5rem',
                        borderRadius: '12px',
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        background: s.status === 'at_risk' ? '#fee2e2' : '#ecfdf5',
                        color: s.status === 'at_risk' ? '#b91c1c' : '#15803d'
                      }}>
                        {s.status === 'at_risk' ? 'At-Risk' : 'Active'}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.4rem' }}>
                        <button
                          onClick={() => navigate(`/admin/students/${s.id}`)}
                          title="View Full Profile"
                          style={{
                            background: '#eff6ff',
                            border: 'none',
                            color: '#2563eb',
                            padding: '0.35rem 0.5rem',
                            borderRadius: '6px',
                            cursor: 'pointer'
                          }}
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmStudent(s)}
                          title="Delete / Archive Student"
                          style={{
                            background: '#fef2f2',
                            border: 'none',
                            color: '#ef4444',
                            padding: '0.35rem 0.5rem',
                            borderRadius: '6px',
                            cursor: 'pointer'
                          }}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {/* Pagination Bar */}
        <div style={{
          padding: '0.85rem 1.25rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: '#f8fafc',
          borderTop: '1px solid #e2e8f0',
          fontSize: '0.85rem',
          color: '#64748b'
        }}>
          <div>
            Showing {students.length} of {total} registered students
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              style={{
                padding: '0.35rem 0.75rem',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                background: page === 1 ? '#f1f5f9' : '#ffffff',
                cursor: page === 1 ? 'default' : 'pointer',
                fontSize: '0.82rem'
              }}
            >
              Previous
            </button>
            <span style={{ display: 'flex', alignItems: 'center', padding: '0 0.5rem', fontWeight: 600 }}>
              Page {page}
            </span>
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={students.length < 15}
              style={{
                padding: '0.35rem 0.75rem',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                background: students.length < 15 ? '#f1f5f9' : '#ffffff',
                cursor: students.length < 15 ? 'default' : 'pointer',
                fontSize: '0.82rem'
              }}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Add Student Modal */}
      {showAddModal && (
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
            <h3 style={{ margin: '0 0 1.25rem 0', fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
              Add New Student to Institutional Database
            </h3>
            <form onSubmit={handleCreateStudent} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.35rem' }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vikram Sharma"
                  value={newStudent.name}
                  onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                  style={{ width: '100%', padding: '0.55rem', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.35rem' }}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="vikram@geca.demo"
                    value={newStudent.email}
                    onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                    style={{ width: '100%', padding: '0.55rem', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.35rem' }}>
                    Roll Number *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="23CS45"
                    value={newStudent.rollNo}
                    onChange={(e) => setNewStudent({ ...newStudent, rollNo: e.target.value })}
                    style={{ width: '100%', padding: '0.55rem', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.35rem' }}>
                    Branch
                  </label>
                  <select
                    value={newStudent.branch}
                    onChange={(e) => setNewStudent({ ...newStudent, branch: e.target.value })}
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
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.35rem' }}>
                    CGPA
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="4.0"
                    max="10.0"
                    value={newStudent.cgpa}
                    onChange={(e) => setNewStudent({ ...newStudent, cgpa: e.target.value })}
                    style={{ width: '100%', padding: '0.55rem', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.35rem' }}>
                    Target Placement Tier
                  </label>
                  <select
                    value={newStudent.targetTier}
                    onChange={(e) => setNewStudent({ ...newStudent, targetTier: e.target.value })}
                    style={{ width: '100%', padding: '0.55rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  >
                    <option value="tier1">Product Tier-1 (FAANG/Unicorn)</option>
                    <option value="tier2">Service Tier-2 (TCS/Infosys)</option>
                    <option value="tier3">Core Engineering / PSU</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.35rem' }}>
                    Initial Password
                  </label>
                  <input
                    type="text"
                    value={newStudent.password}
                    onChange={(e) => setNewStudent({ ...newStudent, password: e.target.value })}
                    style={{ width: '100%', padding: '0.55rem', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={{ padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#f8fafc', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '0.6rem 1.25rem', borderRadius: '8px', border: 'none', background: '#3b82f6', color: 'white', fontWeight: 600, cursor: 'pointer' }}
                >
                  Enroll Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk CSV Import Modal */}
      {showImportModal && (
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
            width: '600px',
            padding: '2rem',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
          }}>
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem', fontWeight: 800 }}>
              Bulk Import Students via CSV
            </h3>
            <p style={{ margin: '0 0 1rem 0', fontSize: '0.82rem', color: '#64748b' }}>
              Paste comma-separated values matching format: <code>name, email, rollNo, branch, batch, cgpa, targetTier</code>
            </p>

            <textarea
              rows={8}
              value={csvText}
              onChange={(e) => setCsvText(e.target.value)}
              placeholder="name,email,rollNo,branch,batch,cgpa,targetTier&#10;Aarav Sharma,aarav@geca.demo,23IT70,Information Technology,2026,8.2,tier1&#10;Bhavna Sen,bhavna@geca.demo,23CS81,Computer Science & Engineering,2026,7.9,tier2"
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontFamily: 'monospace',
                fontSize: '0.8rem',
                boxSizing: 'border-box'
              }}
            />

            {importReport && (
              <div style={{
                marginTop: '1rem',
                padding: '0.75rem',
                borderRadius: '8px',
                background: '#ecfdf5',
                border: '1px solid #a7f3d0',
                fontSize: '0.82rem',
                color: '#065f46'
              }}>
                <CheckCircle size={16} style={{ verticalAlign: 'middle', marginRight: '0.4rem' }} />
                Successfully imported {importReport.importedCount} students!
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.25rem' }}>
              <button
                type="button"
                onClick={() => setCsvText("name,email,rollNo,branch,batch,cgpa,targetTier\nAarav Sharma,aarav@geca.demo,23IT70,Information Technology,2026,8.2,tier1\nBhavna Sen,bhavna@geca.demo,23CS81,Computer Science & Engineering,2026,7.9,tier2")}
                style={{ background: 'none', border: 'none', color: '#3b82f6', fontSize: '0.8rem', cursor: 'pointer', textDecoration: 'underline' }}
              >
                Load Sample Template
              </button>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  onClick={() => { setShowImportModal(false); setImportReport(null); }}
                  style={{ padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#f8fafc', cursor: 'pointer' }}
                >
                  Close
                </button>
                <button
                  onClick={handleBulkImport}
                  style={{ padding: '0.6rem 1.25rem', borderRadius: '8px', border: 'none', background: '#10b981', color: 'white', fontWeight: 600, cursor: 'pointer' }}
                >
                  Execute Import
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Compare Students Side-by-Side Modal */}
      {showCompareModal && student1 && student2 && (
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
            width: '780px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '2rem',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
          }}>
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.3rem', fontWeight: 800 }}>
              Side-by-Side Candidate Benchmarking
            </h3>
            <p style={{ margin: '0 0 1.5rem 0', fontSize: '0.85rem', color: '#64748b' }}>
              Comparative breakdown between {student1.name} and {student2.name}
            </p>

            {/* Radar chart */}
            <div style={{ height: '260px', marginBottom: '1.5rem' }}>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={compareRadarData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="pillar" tick={{ fontSize: 11 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar name={student1.name} dataKey={student1.name} stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                  <Radar name={student2.name} dataKey={student2.name} stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                  <Legend />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Comparison Table */}
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  <th style={{ padding: '0.65rem', textAlign: 'left' }}>Metric</th>
                  <th style={{ padding: '0.65rem', textAlign: 'center', color: '#3b82f6' }}>{student1.name}</th>
                  <th style={{ padding: '0.65rem', textAlign: 'center', color: '#10b981' }}>{student2.name}</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '0.65rem', fontWeight: 600 }}>Branch & Roll</td>
                  <td style={{ padding: '0.65rem', textAlign: 'center' }}>{student1.branch} ({student1.rollNo})</td>
                  <td style={{ padding: '0.65rem', textAlign: 'center' }}>{student2.branch} ({student2.rollNo})</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '0.65rem', fontWeight: 600 }}>Academic CGPA</td>
                  <td style={{ padding: '0.65rem', textAlign: 'center', fontWeight: 700 }}>{student1.cgpa}</td>
                  <td style={{ padding: '0.65rem', textAlign: 'center', fontWeight: 700 }}>{student2.cgpa}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '0.65rem', fontWeight: 600 }}>Target Placement Tier</td>
                  <td style={{ padding: '0.65rem', textAlign: 'center' }}>{student1.targetTier?.toUpperCase()}</td>
                  <td style={{ padding: '0.65rem', textAlign: 'center' }}>{student2.targetTier?.toUpperCase()}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '0.65rem', fontWeight: 600 }}>Overall Readiness Index</td>
                  <td style={{ padding: '0.65rem', textAlign: 'center', fontWeight: 800, color: '#3b82f6', fontSize: '1rem' }}>
                    {student1.readinessScore || 0}%
                  </td>
                  <td style={{ padding: '0.65rem', textAlign: 'center', fontWeight: 800, color: '#10b981', fontSize: '1rem' }}>
                    {student2.readinessScore || 0}%
                  </td>
                </tr>
              </tbody>
            </table>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowCompareModal(false)}
                style={{ padding: '0.6rem 1.25rem', borderRadius: '8px', border: 'none', background: '#0f172a', color: 'white', fontWeight: 600, cursor: 'pointer' }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete / Archive Confirmation Modal */}
      {deleteConfirmStudent && (
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ background: '#fee2e2', color: '#ef4444', padding: '0.6rem', borderRadius: '50%' }}>
                <AlertTriangle size={24} />
              </div>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>Confirm Student Deletion</h3>
            </div>
            <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.5, margin: '0 0 1.5rem 0' }}>
              Are you sure you want to remove <strong>{deleteConfirmStudent.name}</strong> ({deleteConfirmStudent.email})?
              All write operations are logged to the audit trail.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                onClick={() => setDeleteConfirmStudent(null)}
                style={{ padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#f8fafc', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(false)}
                style={{ padding: '0.6rem 1rem', borderRadius: '8px', border: 'none', background: '#f59e0b', color: 'white', fontWeight: 600, cursor: 'pointer' }}
              >
                Archive (Soft Delete)
              </button>
              <button
                onClick={() => handleDelete(true)}
                style={{ padding: '0.6rem 1rem', borderRadius: '8px', border: 'none', background: '#ef4444', color: 'white', fontWeight: 600, cursor: 'pointer' }}
              >
                Permanent Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
