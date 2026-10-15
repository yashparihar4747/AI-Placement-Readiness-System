import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../services/api.js';
import { User, Save, CheckCircle, GraduationCap } from 'lucide-react';

export const ProfilePage = () => {
  const { profile, refreshProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    rollNo: '',
    college: '',
    branch: '',
    semester: 7,
    cgpa: 8.0,
    targetTier: 'tier1',
    targetRole: 'Full Stack SDE / Software Engineer',
    skills: ''
  });
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        rollNo: profile.rollNo || '23IT17',
        college: profile.college || 'Govt. Engineering College, Ajmer',
        branch: profile.branch || 'Computer Science & Engineering',
        semester: profile.semester || 7,
        cgpa: profile.cgpa || 8.4,
        targetTier: profile.targetTier || 'tier1',
        targetRole: profile.targetRole || 'Full Stack SDE / Software Engineer',
        skills: Array.isArray(profile.skills) ? profile.skills.join(', ') : (profile.skills || '')
      });
    }
  }, [profile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');

    try {
      const skillsArr = formData.skills.split(',').map(s => s.trim()).filter(Boolean);
      const res = await api.updateProfile({
        ...formData,
        skills: skillsArr
      });
      if (res.success) {
        await refreshProfile();
        setSuccessMsg('Student profile updated successfully!');
      }
    } catch (err) {
      alert(err.message || 'Error updating profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="page-header-box">
        <div>
          <h1 className="page-title">Candidate Profile & Placement Target</h1>
          <p className="page-subtitle">
            Configure your academic profile, target company tier, and core proficiencies
          </p>
        </div>
      </div>

      {successMsg && (
        <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#065f46', padding: '0.85rem', borderRadius: '10px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle size={18} />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="ui-card">
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.35rem', color: '#334155' }}>
                Full Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input-control"
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.35rem', color: '#334155' }}>
                College Roll Number
              </label>
              <input
                type="text"
                required
                value={formData.rollNo}
                onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
                className="input-control"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.35rem', color: '#334155' }}>
                Institution
              </label>
              <input
                type="text"
                value={formData.college}
                onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                className="input-control"
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.35rem', color: '#334155' }}>
                Branch / Dept
              </label>
              <input
                type="text"
                value={formData.branch}
                onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                className="input-control"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.35rem', color: '#334155' }}>
                Semester
              </label>
              <input
                type="number"
                min="1"
                max="8"
                value={formData.semester}
                onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                className="input-control"
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.35rem', color: '#334155' }}>
                Current CGPA
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="10"
                value={formData.cgpa}
                onChange={(e) => setFormData({ ...formData, cgpa: e.target.value })}
                className="input-control"
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.35rem', color: '#334155' }}>
                Target Company Tier
              </label>
              <select
                value={formData.targetTier}
                onChange={(e) => setFormData({ ...formData, targetTier: e.target.value })}
                className="input-control"
              >
                <option value="tier1">Tier 1: Product-Based</option>
                <option value="tier2">Tier 2: Service-Based</option>
                <option value="tier3">Tier 3: Core / PSU</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.35rem', color: '#334155' }}>
              Target Job Role
            </label>
            <input
              type="text"
              value={formData.targetRole}
              onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
              className="input-control"
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.35rem', color: '#334155' }}>
              Technical Skills (comma-separated)
            </label>
            <input
              type="text"
              value={formData.skills}
              onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
              className="input-control"
              placeholder="e.g. JavaScript, React.js, Node.js, Express, MongoDB, Data Structures, SQL"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
            <button
              type="submit"
              disabled={saving}
              className="btn-primary"
            >
              <Save size={16} />
              <span>{saving ? 'Saving...' : 'Save Profile Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
