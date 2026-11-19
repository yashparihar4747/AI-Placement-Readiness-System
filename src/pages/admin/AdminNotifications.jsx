import React, { useState, useEffect } from 'react';
import { api } from '../../services/api.js';
import {
  Bell,
  Send,
  Trash2,
  CheckCircle,
  Users,
  Briefcase,
  AlertTriangle,
  Info
} from 'lucide-react';

export const AdminNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState('Drive');
  const [audience, setAudience] = useState('All');
  const [sending, setSending] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);

  const loadNotifications = async () => {
    try {
      const res = await api.getAdminNotifications();
      if (res.success && res.notifications) {
        setNotifications(res.notifications);
      }
    } catch (err) {
      console.error('Failed to load notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      const res = await api.sendAdminNotification({
        title,
        message,
        type,
        audience
      });
      if (res.success) {
        setTitle('');
        setMessage('');
        setSuccessMsg(`Notification successfully dispatched to cohort!`);
        setTimeout(() => setSuccessMsg(null), 4000);
        loadNotifications();
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header */}
      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>
          Broadcast & Targeted Notifications
        </h2>
        <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>
          Dispatch recruitment drive alerts, assessment reminders, and individual mentor nudges.
        </p>
      </div>

      {successMsg && (
        <div style={{ padding: '0.85rem', background: '#ecfdf5', border: '1px solid #6ee7b7', borderRadius: '8px', color: '#065f46', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle size={18} />
          {successMsg}
        </div>
      )}

      {/* Composer & Sent List Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: '1.5rem' }}>
        {/* Left: Compose Form */}
        <div style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '1.5rem' }}>
          <h3 style={{ margin: '0 0 1.25rem 0', fontSize: '1.1rem', fontWeight: 700 }}>Compose Announcement</h3>
          <form onSubmit={handleSend} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.3rem' }}>
                Subject / Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Amazon SDE-1 Recruitment Drive Registration"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{ width: '100%', padding: '0.55rem', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.3rem' }}>
                Notification Category
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                style={{ width: '100%', padding: '0.55rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}
              >
                <option value="Drive">Placement Drive Update</option>
                <option value="Assessment">Scheduled Assessment</option>
                <option value="Reminder">Remediation / Practice Reminder</option>
                <option value="Alert">Advisory Alert</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.3rem' }}>
                Target Cohort Audience
              </label>
              <select
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                style={{ width: '100%', padding: '0.55rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}
              >
                <option value="All">All Registered Students (35)</option>
                <option value="CSE/IT">CSE & IT Departments Only</option>
                <option value="ECE/EE/ME">Core Engineering Departments</option>
                <option value="AtRisk">At-Risk Students (&lt;40 score)</option>
                <option value="PlacementReady">Placement Ready (&ge;75 score)</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.3rem' }}>
                Message Content *
              </label>
              <textarea
                rows={4}
                required
                placeholder="Enter official communication text..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                style={{ width: '100%', padding: '0.55rem', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
              />
            </div>

            <button
              type="submit"
              disabled={sending}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
                background: '#3b82f6',
                color: 'white',
                border: 'none',
                padding: '0.65rem',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '0.88rem',
                cursor: sending ? 'default' : 'pointer',
                marginTop: '0.5rem'
              }}
            >
              <Send size={16} /> Disseminate Notice
            </button>
          </form>
        </div>

        {/* Right: Sent Notifications Feed */}
        <div style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '1.5rem' }}>
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', fontWeight: 700 }}>Broadcast History</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {notifications.length === 0 ? (
              <p style={{ color: '#94a3b8', padding: '2rem', textAlign: 'center' }}>No notifications published yet.</p>
            ) : (
              notifications.map((n) => (
                <div key={n.id} style={{
                  padding: '1rem',
                  borderRadius: '10px',
                  border: '1px solid #e2e8f0',
                  background: '#f8fafc',
                  borderLeft: `4px solid ${n.type === 'Alert' ? '#ef4444' : n.type === 'Drive' ? '#10b981' : '#3b82f6'}`
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.35rem' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>{n.title}</div>
                    <span style={{ fontSize: '0.72rem', background: '#e2e8f0', color: '#475569', padding: '0.15rem 0.45rem', borderRadius: '4px' }}>
                      Audience: {n.audience || 'All'}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.5 }}>
                    {n.message}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '0.5rem' }}>
                    Sent on {new Date(n.createdAt || Date.now()).toLocaleString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
