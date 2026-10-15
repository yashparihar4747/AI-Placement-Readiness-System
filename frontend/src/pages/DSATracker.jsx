import React, { useState, useEffect } from 'react';
import { api } from '../services/api.js';
import {
  Code2,
  CheckCircle2,
  Circle,
  ExternalLink,
  Plus,
  Trash2,
  Filter,
  Clock,
  BookOpen,
  Award
} from 'lucide-react';

export const DSATracker = () => {
  const [problems, setProblems] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [topicFilter, setTopicFilter] = useState('All');
  const [diffFilter, setDiffFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);

  // New problem form state
  const [newTitle, setNewTitle] = useState('');
  const [newTopic, setNewTopic] = useState('Arrays');
  const [newDiff, setNewDiff] = useState('Medium');
  const [newPlatform, setNewPlatform] = useState('LeetCode');
  const [newUrl, setNewUrl] = useState('');
  const [newNotes, setNewNotes] = useState('');

  const loadData = async () => {
    try {
      const [probRes, statRes] = await Promise.all([
        api.getDSAProblems({
          topic: topicFilter,
          difficulty: diffFilter,
          completed: statusFilter
        }),
        api.getDSAStats()
      ]);
      if (probRes.success) setProblems(probRes.problems);
      if (statRes.success) setStats(statRes.stats);
    } catch (err) {
      console.error('Error fetching DSA data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [topicFilter, diffFilter, statusFilter]);

  const toggleComplete = async (problem) => {
    try {
      const updatedStatus = !problem.completed;
      await api.updateDSAProblem(problem.id, { completed: updatedStatus });
      setProblems(prev =>
        prev.map(p => (p.id === problem.id ? { ...p, completed: updatedStatus } : p))
      );
      // Refresh stats
      const statRes = await api.getDSAStats();
      if (statRes.success) setStats(statRes.stats);
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this problem from your tracking list?')) return;
    try {
      await api.deleteDSAProblem(id);
      setProblems(prev => prev.filter(p => p.id !== id));
      const statRes = await api.getDSAStats();
      if (statRes.success) setStats(statRes.stats);
    } catch (err) {
      console.error('Error deleting problem:', err);
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      const res = await api.addDSAProblem({
        title: newTitle,
        topic: newTopic,
        difficulty: newDiff,
        platform: newPlatform,
        url: newUrl,
        notes: newNotes,
        completed: false
      });

      if (res.success) {
        setShowAddModal(false);
        setNewTitle('');
        setNewUrl('');
        setNewNotes('');
        loadData();
      }
    } catch (err) {
      alert(err.message || 'Failed to add problem');
    }
  };

  return (
    <div>
      <div className="page-header-box">
        <div>
          <h1 className="page-title">Data Structures & Algorithms Tracker</h1>
          <p className="page-subtitle">
            Systematic problem tracking mapped to tier-1 recruitment topics and difficulty tiers
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary"
        >
          <Plus size={18} />
          <span>Log New Problem</span>
        </button>
      </div>

      {/* Stats Summary Row */}
      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          <div className="ui-card" style={{ padding: '1.25rem' }}>
            <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Total Solved</span>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1e293b', marginTop: '0.25rem' }}>
              {stats.completedCount} <span style={{ fontSize: '1rem', color: '#94a3b8', fontWeight: 500 }}>/ {stats.total}</span>
            </div>
            <div className="progress-track" style={{ marginTop: '0.5rem', height: '6px' }}>
              <div className="progress-fill" style={{ width: `${stats.completionRate}%`, background: '#6366f1' }}></div>
            </div>
          </div>

          <div className="ui-card" style={{ padding: '1.25rem' }}>
            <span style={{ fontSize: '0.8rem', color: '#059669', fontWeight: 600, textTransform: 'uppercase' }}>Easy Problems</span>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#059669', marginTop: '0.25rem' }}>
              {stats.difficultyBreakdown?.Easy?.completed || 0}{' '}
              <span style={{ fontSize: '0.9rem', color: '#94a3b8', fontWeight: 500 }}>/ {stats.difficultyBreakdown?.Easy?.total || 0}</span>
            </div>
          </div>

          <div className="ui-card" style={{ padding: '1.25rem' }}>
            <span style={{ fontSize: '0.8rem', color: '#d97706', fontWeight: 600, textTransform: 'uppercase' }}>Medium Problems</span>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#d97706', marginTop: '0.25rem' }}>
              {stats.difficultyBreakdown?.Medium?.completed || 0}{' '}
              <span style={{ fontSize: '0.9rem', color: '#94a3b8', fontWeight: 500 }}>/ {stats.difficultyBreakdown?.Medium?.total || 0}</span>
            </div>
          </div>

          <div className="ui-card" style={{ padding: '1.25rem' }}>
            <span style={{ fontSize: '0.8rem', color: '#dc2626', fontWeight: 600, textTransform: 'uppercase' }}>Hard Problems</span>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#dc2626', marginTop: '0.25rem' }}>
              {stats.difficultyBreakdown?.Hard?.completed || 0}{' '}
              <span style={{ fontSize: '0.9rem', color: '#94a3b8', fontWeight: 500 }}>/ {stats.difficultyBreakdown?.Hard?.total || 0}</span>
            </div>
          </div>
        </div>
      )}

      {/* Filters Toolbar */}
      <div className="ui-card" style={{ padding: '1rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.85rem', fontWeight: 600 }}>
          <Filter size={16} />
          <span>Filters:</span>
        </div>

        <select
          value={topicFilter}
          onChange={(e) => setTopicFilter(e.target.value)}
          className="input-control"
          style={{ width: 'auto', minWidth: '150px' }}
        >
          <option value="All">All Topics</option>
          <option value="Arrays">Arrays</option>
          <option value="Strings">Strings</option>
          <option value="Linked Lists">Linked Lists</option>
          <option value="Trees">Trees</option>
          <option value="Graphs">Graphs</option>
          <option value="Dynamic Programming">Dynamic Programming</option>
          <option value="Binary Search">Binary Search</option>
        </select>

        <select
          value={diffFilter}
          onChange={(e) => setDiffFilter(e.target.value)}
          className="input-control"
          style={{ width: 'auto', minWidth: '130px' }}
        >
          <option value="All">All Difficulties</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="input-control"
          style={{ width: 'auto', minWidth: '130px' }}
        >
          <option value="All">All Statuses</option>
          <option value="true">Completed</option>
          <option value="false">Pending</option>
        </select>

        <span style={{ marginLeft: 'auto', fontSize: '0.82rem', color: '#64748b' }}>
          Showing {problems.length} problems
        </span>
      </div>

      {/* Problems Table */}
      <div className="ui-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="dsa-table">
          <thead>
            <tr>
              <th style={{ width: '50px', textAlign: 'center' }}>Status</th>
              <th>Problem Title</th>
              <th>Topic</th>
              <th>Difficulty</th>
              <th>Platform</th>
              <th>Notes / Key Pattern</th>
              <th style={{ width: '60px', textAlign: 'center' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {problems.map((problem) => (
              <tr key={problem.id} style={{ background: problem.completed ? '#fafafa' : '#ffffff' }}>
                <td style={{ textAlign: 'center' }}>
                  <button
                    onClick={() => toggleComplete(problem)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}
                    title={problem.completed ? 'Mark pending' : 'Mark solved'}
                  >
                    {problem.completed ? (
                      <CheckCircle2 size={22} color="#10b981" />
                    ) : (
                      <Circle size={22} color="#cbd5e1" />
                    )}
                  </button>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ fontWeight: 600, color: problem.completed ? '#64748b' : '#0f172a', textDecoration: problem.completed ? 'line-through' : 'none' }}>
                      {problem.title}
                    </span>
                    {problem.url && (
                      <a href={problem.url} target="_blank" rel="noopener noreferrer" title="Open on LeetCode/GFG" style={{ color: '#6366f1' }}>
                        <ExternalLink size={14} />
                      </a>
                    )}
                  </div>
                </td>
                <td>
                  <span style={{ background: '#f1f5f9', color: '#475569', padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 500 }}>
                    {problem.topic}
                  </span>
                </td>
                <td>
                  <span className={`difficulty-pill diff-${problem.difficulty}`}>
                    {problem.difficulty}
                  </span>
                </td>
                <td>
                  <span style={{ fontSize: '0.82rem', color: '#64748b' }}>
                    {problem.platform}
                  </span>
                </td>
                <td style={{ fontSize: '0.82rem', color: '#475569', maxWidth: '300px' }}>
                  {problem.notes || <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>No notes added</span>}
                </td>
                <td style={{ textAlign: 'center' }}>
                  <button
                    onClick={() => handleDelete(problem.id)}
                    style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '0.25rem' }}
                    title="Delete Problem"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {problems.length === 0 && (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                  No problems match the current filter selection.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for adding new problem */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '1rem'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '2rem',
            maxWidth: '500px',
            width: '100%',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)'
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.25rem', color: '#0f172a' }}>
              Log New DSA Problem
            </h3>

            <form onSubmit={handleAddSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.35rem', color: '#334155' }}>
                  Problem Title *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Subarray Sum Equals K"
                  className="input-control"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.35rem', color: '#334155' }}>
                    Topic
                  </label>
                  <select
                    value={newTopic}
                    onChange={(e) => setNewTopic(e.target.value)}
                    className="input-control"
                  >
                    <option value="Arrays">Arrays</option>
                    <option value="Strings">Strings</option>
                    <option value="Linked Lists">Linked Lists</option>
                    <option value="Trees">Trees</option>
                    <option value="Graphs">Graphs</option>
                    <option value="Dynamic Programming">Dynamic Programming</option>
                    <option value="Binary Search">Binary Search</option>
                    <option value="Greedy">Greedy</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.35rem', color: '#334155' }}>
                    Difficulty
                  </label>
                  <select
                    value={newDiff}
                    onChange={(e) => setNewDiff(e.target.value)}
                    className="input-control"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.35rem', color: '#334155' }}>
                  Platform URL (LeetCode / GFG)
                </label>
                <input
                  type="url"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="https://leetcode.com/problems/..."
                  className="input-control"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.35rem', color: '#334155' }}>
                  Key Algorithm / Complexity Notes
                </label>
                <textarea
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="e.g. Solved with Prefix Sum + HashMap in O(n) time."
                  rows="3"
                  className="input-control"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                >
                  Save Problem
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
