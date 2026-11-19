import React, { useState, useEffect } from 'react';
import { api } from '../../services/api.js';
import {
  Clock,
  Search,
  Download,
  Filter,
  Shield,
  Activity
} from 'lucide-react';

export const AdminAudit = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('');

  const loadLogs = async () => {
    setLoading(true);
    try {
      const res = await api.getAdminAuditLogs({ search, action: actionFilter });
      if (res.success && res.logs) {
        setLogs(res.logs);
      }
    } catch (err) {
      console.error('Failed to load audit logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, [search, actionFilter]);

  const handleExportCSV = () => {
    const headers = ['Action,Entity,User,IP,Timestamp,Details'];
    const rows = logs.map(l => `"${l.action}","${l.entity}","${l.userName || l.userId}","${l.ip || '127.0.0.1'}","${l.timestamp}","${JSON.stringify(l.details || {}).replace(/"/g, '""')}"`);
    const csvContent = headers.concat(rows).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `audit_logs_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>
            System Audit Trail & Security Logs
          </h2>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>
            Immutable ledger tracking all TPO administrative writes, score recomputations, and data modifications.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: '#0f172a',
            color: 'white',
            border: 'none',
            padding: '0.6rem 1.1rem',
            borderRadius: '8px',
            fontSize: '0.85rem',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          <Download size={15} /> Export Audit Log CSV
        </button>
      </div>

      {/* Filter and Search */}
      <div style={{ display: 'flex', gap: '1rem', background: '#ffffff', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f8fafc', padding: '0.45rem 0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <Search size={16} color="#94a3b8" />
          <input
            type="text"
            placeholder="Search audit trail by admin name, action, or entity..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ background: 'transparent', border: 'none', outline: 'none', fontSize: '0.85rem', width: '100%' }}
          />
        </div>

        <select
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
          style={{ padding: '0.45rem 0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
        >
          <option value="">All Action Types</option>
          <option value="create">Creations</option>
          <option value="update">Updates</option>
          <option value="delete">Deletions</option>
          <option value="recompute">Score Recomputations</option>
        </select>
      </div>

      {/* Table */}
      <div style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>
              <th style={{ padding: '0.85rem 1rem', textAlign: 'left' }}>Action Performed</th>
              <th style={{ padding: '0.85rem 1rem', textAlign: 'left' }}>Entity</th>
              <th style={{ padding: '0.85rem 1rem', textAlign: 'left' }}>Authorized User</th>
              <th style={{ padding: '0.85rem 1rem', textAlign: 'left' }}>Parameters / Scope</th>
              <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>Loading audit records...</td></tr>
            ) : logs.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>No audit logs found matching criteria.</td></tr>
            ) : (
              logs.map((l, idx) => (
                <tr key={l.id || idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <span style={{
                      padding: '0.2rem 0.5rem',
                      borderRadius: '4px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      background: l.action?.includes('delete') ? '#fee2e2' : l.action?.includes('create') ? '#ecfdf5' : '#eff6ff',
                      color: l.action?.includes('delete') ? '#b91c1c' : l.action?.includes('create') ? '#15803d' : '#1d4ed8'
                    }}>
                      {l.action?.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>{l.entity}</td>
                  <td style={{ padding: '0.85rem 1rem', color: '#475569' }}>
                    {l.userName || 'Dr. R. K. Sharma'}
                  </td>
                  <td style={{ padding: '0.85rem 1rem', color: '#64748b', fontSize: '0.78rem', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {JSON.stringify(l.details || {})}
                  </td>
                  <td style={{ padding: '0.85rem 1rem', textAlign: 'right', color: '#94a3b8', fontSize: '0.75rem' }}>
                    {new Date(l.timestamp).toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
