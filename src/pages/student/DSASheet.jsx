import React, { useState, useEffect } from 'react';
import { api } from '../../services/api.js';
import {
  Code2,
  Search,
  Filter,
  CheckCircle,
  ExternalLink,
  HelpCircle,
  Eye,
  RotateCcw,
  Sparkles,
  TrendingUp,
  Award
} from 'lucide-react';

export const DSASheet = () => {
  const [sheet, setSheet] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  // Toggles per problem
  const [openHints, setOpenHints] = useState({});
  const [openComplexity, setOpenComplexity] = useState({});
  const [updatingId, setUpdatingId] = useState(null);

  const loadSheet = async () => {
    try {
      const res = await api.getDSASheet({
        topic: selectedTopic,
        difficulty: selectedDifficulty,
        status: selectedStatus,
        search
      });
      if (res.success && res.problems) {
        setSheet(res.problems);
      }
    } catch (err) {
      console.error('Failed to load DSA sheet:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSheet();
  }, [selectedTopic, selectedDifficulty, selectedStatus, search]);

  const handleStatusChange = async (problemId, newStatus) => {
    setUpdatingId(problemId);
    try {
      const res = await api.updateSheetProblemStatus(problemId, newStatus);
      if (res.success) {
        // Update local sheet state immediately
        setSheet(prev => prev.map(p => p.id === problemId ? { ...p, userStatus: newStatus } : p));
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const solvedCount = sheet.filter(p => p.userStatus === 'Solved' || p.status === 'Solved').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>
            60+ Curated DSA Problem Practice Sheet
          </h2>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>
            Handpicked core algorithmic problems covering all essential interview patterns from FAANG and Tier-1 engineering drives.
          </p>
        </div>

        {/* Progress Pill */}
        <div style={{
          background: '#eff6ff',
          border: '1px solid #bfdbfe',
          borderRadius: '12px',
          padding: '0.5rem 1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <div>
            <div style={{ fontSize: '0.72rem', color: '#1e40af', fontWeight: 600 }}>PROBLEMS SOLVED</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1d4ed8' }}>
              {solvedCount} / {sheet.length}
            </div>
          </div>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: '#2563eb',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '0.85rem'
          }}>
            {Math.round((solvedCount / (sheet.length || 1)) * 100)}%
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div style={{ display: 'flex', gap: '0.75rem', background: '#ffffff', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '240px', display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f8fafc', padding: '0.45rem 0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <Search size={16} color="#94a3b8" />
          <input
            type="text"
            placeholder="Search problems by title, topic..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ background: 'transparent', border: 'none', outline: 'none', fontSize: '0.85rem', width: '100%' }}
          />
        </div>

        <select
          value={selectedTopic}
          onChange={(e) => setSelectedTopic(e.target.value)}
          style={{ padding: '0.45rem 0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
        >
          <option value="">All Topics</option>
          <option value="Arrays">Arrays</option>
          <option value="Strings">Strings</option>
          <option value="Linked List">Linked List</option>
          <option value="Binary Search">Binary Search</option>
          <option value="Trees">Trees & BST</option>
          <option value="Graphs">Graphs</option>
          <option value="Dynamic Programming">Dynamic Programming</option>
          <option value="Heap">Heap & Priority Queue</option>
        </select>

        <select
          value={selectedDifficulty}
          onChange={(e) => setSelectedDifficulty(e.target.value)}
          style={{ padding: '0.45rem 0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
        >
          <option value="">All Difficulties</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          style={{ padding: '0.45rem 0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
        >
          <option value="">All Statuses</option>
          <option value="Solved">Solved</option>
          <option value="Attempted">Attempted</option>
          <option value="Not Started">Not Started</option>
          <option value="Revisit">Revisit</option>
        </select>
      </div>

      {/* Sheet Table */}
      <div style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>
              <th style={{ padding: '0.85rem 1rem', textAlign: 'left', width: '30px' }}>#</th>
              <th style={{ padding: '0.85rem 1rem', textAlign: 'left' }}>Status</th>
              <th style={{ padding: '0.85rem 1rem', textAlign: 'left' }}>Problem Title</th>
              <th style={{ padding: '0.85rem 1rem', textAlign: 'left' }}>Topic</th>
              <th style={{ padding: '0.85rem 1rem', textAlign: 'left' }}>Difficulty</th>
              <th style={{ padding: '0.85rem 1rem', textAlign: 'left' }}>Hints & Complexity</th>
              <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Practice</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>Loading curated problem list...</td></tr>
            ) : sheet.length === 0 ? (
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>No problems match the filter criteria.</td></tr>
            ) : (
              sheet.map((p, idx) => {
                const currentStatus = p.userStatus || p.status || 'Not Started';
                const isSolved = currentStatus === 'Solved';
                return (
                  <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9', background: isSolved ? '#f0fdf4' : 'transparent' }}>
                    <td style={{ padding: '0.85rem 1rem', color: '#94a3b8' }}>{idx + 1}</td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <select
                        value={currentStatus}
                        onChange={(e) => handleStatusChange(p.id, e.target.value)}
                        disabled={updatingId === p.id}
                        style={{
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          padding: '0.25rem 0.5rem',
                          borderRadius: '6px',
                          border: isSolved ? '1px solid #86efac' : '1px solid #cbd5e1',
                          background: isSolved ? '#ecfdf5' : '#ffffff',
                          color: isSolved ? '#15803d' : '#334155',
                          cursor: 'pointer'
                        }}
                      >
                        <option value="Not Started">Not Started</option>
                        <option value="Attempted">Attempted</option>
                        <option value="Solved">✓ Solved</option>
                        <option value="Revisit">Revisit</option>
                      </select>
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ fontWeight: 600, color: '#0f172a' }}>{p.title}</div>
                      {openHints[p.id] && p.hint && (
                        <div style={{ marginTop: '0.35rem', fontSize: '0.78rem', color: '#b45309', background: '#fffbeb', padding: '0.35rem 0.6rem', borderRadius: '4px' }}>
                          💡 <strong>Hint:</strong> {p.hint}
                        </div>
                      )}
                      {openComplexity[p.id] && (
                        <div style={{ marginTop: '0.35rem', fontSize: '0.78rem', color: '#1e40af', background: '#eff6ff', padding: '0.35rem 0.6rem', borderRadius: '4px' }}>
                          ⚡ <strong>Time:</strong> {p.timeComplexity || 'O(N)'} | <strong>Space:</strong> {p.spaceComplexity || 'O(1)'}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: '#475569' }}>{p.topic}</td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span style={{
                        padding: '0.15rem 0.45rem',
                        borderRadius: '4px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        background: p.difficulty === 'Easy' ? '#ecfdf5' : p.difficulty === 'Medium' ? '#fffbeb' : '#fef2f2',
                        color: p.difficulty === 'Easy' ? '#065f46' : p.difficulty === 'Medium' ? '#92400e' : '#991b1b'
                      }}>
                        {p.difficulty}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ display: 'flex', gap: '0.35rem' }}>
                        <button
                          onClick={() => setOpenHints(prev => ({ ...prev, [p.id]: !prev[p.id] }))}
                          title="Toggle Hint"
                          style={{ background: '#f1f5f9', border: 'none', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', cursor: 'pointer' }}
                        >
                          Hint
                        </button>
                        <button
                          onClick={() => setOpenComplexity(prev => ({ ...prev, [p.id]: !prev[p.id] }))}
                          title="Reveal Complexity"
                          style={{ background: '#f1f5f9', border: 'none', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', cursor: 'pointer' }}
                        >
                          Complexity
                        </button>
                      </div>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                      <a
                        href={p.practiceLink || `https://www.google.com/search?q=${encodeURIComponent(p.title + ' problem solving')}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          color: '#2563eb',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          textDecoration: 'none'
                        }}
                      >
                        Code <ExternalLink size={12} />
                      </a>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
