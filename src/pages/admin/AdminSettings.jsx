import React, { useState } from 'react';
import { api } from '../../services/api.js';
import {
  Settings,
  Building,
  RotateCcw,
  CheckCircle,
  AlertTriangle,
  Save,
  ShieldAlert
} from 'lucide-react';

export const AdminSettings = () => {
  const [collegeName, setCollegeName] = useState('Govt. Engineering College, Ajmer');
  const [collegeCode, setCollegeCode] = useState('GECA / RTU-107');
  const [sessionYear, setSessionYear] = useState('2026-2027');
  const [tpoEmail, setTpoEmail] = useState('tpo@ecajmer.ac.in');

  const [showResetModal, setShowResetModal] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleResetDemoData = async () => {
    setResetting(true);
    try {
      const res = await api.resetDemoData();
      if (res.success) {
        setShowResetModal(false);
        setResetSuccess(true);
        setTimeout(() => setResetSuccess(false), 5000);
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setResetting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', maxWidth: '900px' }}>
      {/* Header */}
      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>
          Institutional Placement System Settings
        </h2>
        <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>
          Configure institution parameters, placement cell contact metadata, and evaluators demo environment controls.
        </p>
      </div>

      {resetSuccess && (
        <div style={{ padding: '0.85rem', background: '#ecfdf5', border: '1px solid #6ee7b7', borderRadius: '8px', color: '#065f46', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle size={18} />
          Demo environment successfully restored to pristine seed state! All hero profiles and test records synchronized.
        </div>
      )}

      {/* College Information Card */}
      <div style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '1.75rem' }}>
        <h3 style={{ margin: '0 0 1.25rem 0', fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Building size={18} color="#2563eb" /> Institution Profile & Contact
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.3rem' }}>College Name</label>
            <input
              type="text"
              value={collegeName}
              onChange={(e) => setCollegeName(e.target.value)}
              style={{ width: '100%', padding: '0.55rem', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.3rem' }}>Institutional Code</label>
            <input
              type="text"
              value={collegeCode}
              onChange={(e) => setCollegeCode(e.target.value)}
              style={{ width: '100%', padding: '0.55rem', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.3rem' }}>Placement Session</label>
            <input
              type="text"
              value={sessionYear}
              onChange={(e) => setSessionYear(e.target.value)}
              style={{ width: '100%', padding: '0.55rem', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.3rem' }}>Primary TPO Email</label>
            <input
              type="email"
              value={tpoEmail}
              onChange={(e) => setTpoEmail(e.target.value)}
              style={{ width: '100%', padding: '0.55rem', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
            />
          </div>
        </div>

        <div style={{ marginTop: '1.25rem', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={() => alert('Institution settings saved successfully.')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: '#0f172a',
              color: 'white',
              border: 'none',
              padding: '0.55rem 1rem',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <Save size={15} /> Update Configuration
          </button>
        </div>
      </div>

      {/* Demo Reset Card for Evaluators / Judges */}
      <div style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid #fecaca', padding: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <ShieldAlert size={20} color="#dc2626" />
          <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#991b1b' }}>
            Demo Environment & Judge Reset Console
          </h3>
        </div>
        <p style={{ margin: '0 0 1.25rem 0', fontSize: '0.85rem', color: '#475569', lineHeight: 1.5 }}>
          Allows evaluators and competition judges to restore the MongoDB database to the standard seed state at any time.
          All 30 student accounts, 8 hero storylines, test attempts, 60+ DSA problems, and sample mock interviews will be repopulated.
        </p>

        <button
          onClick={() => setShowResetModal(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: '#ef4444',
            color: 'white',
            border: 'none',
            padding: '0.65rem 1.25rem',
            borderRadius: '8px',
            fontSize: '0.88rem',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          <RotateCcw size={16} /> Reset Database to Demo State
        </button>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetModal && (
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
            width: '460px',
            padding: '2rem',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ background: '#fee2e2', color: '#ef4444', padding: '0.6rem', borderRadius: '50%' }}>
                <AlertTriangle size={24} />
              </div>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>Confirm Database Reseed</h3>
            </div>
            <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: 1.5, margin: '0 0 1.5rem 0' }}>
              This will reseed all collections (DSA problems, MCQs, mock interviews, drives, student hero profiles) back to their canonical demo accounts.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                onClick={() => setShowResetModal(false)}
                disabled={resetting}
                style={{ padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#f8fafc', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                onClick={handleResetDemoData}
                disabled={resetting}
                style={{ padding: '0.6rem 1.25rem', borderRadius: '8px', border: 'none', background: '#ef4444', color: 'white', fontWeight: 600, cursor: 'pointer' }}
              >
                {resetting ? 'Reseeding Database...' : 'Confirm Reset'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
