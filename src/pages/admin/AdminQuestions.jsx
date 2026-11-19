import React, { useState, useEffect } from 'react';
import { api } from '../../services/api.js';
import {
  HelpCircle,
  PlusCircle,
  Search,
  Filter,
  Trash2,
  BookOpen,
  CheckCircle,
  Layers,
  Code2,
  Video,
  Award
} from 'lucide-react';

export const AdminQuestions = () => {
  const [activeTab, setActiveTab] = useState('mcq'); // 'mcq' | 'tests' | 'dsa' | 'interview'

  // Data
  const [questions, setQuestions] = useState([]);
  const [tests, setTests] = useState([]);
  const [dsaProblems, setDsaProblems] = useState([]);
  const [interviewQuestions, setInterviewQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters for MCQs
  const [domainFilter, setDomainFilter] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('');
  const [search, setSearch] = useState('');

  // Modals
  const [showAddQuestionModal, setShowAddQuestionModal] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    title: '',
    domain: 'aptitude',
    topic: 'Quantitative',
    difficulty: 'Medium',
    options: ['', '', '', ''],
    correctAnswerIndex: 0,
    explanation: ''
  });

  const loadAll = async () => {
    setLoading(true);
    try {
      const res = await api.getAdminQuestions({
        domain: domainFilter,
        difficulty: difficultyFilter,
        search
      });
      if (res.success) {
        setQuestions(res.questions || []);
        setTests(res.tests || []);
        setDsaProblems(res.dsaProblems || []);
        setInterviewQuestions(res.interviewQuestions || []);
      }
    } catch (err) {
      console.error('Failed to load questions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, [domainFilter, difficultyFilter, search]);

  const handleCreateQuestion = async (e) => {
    e.preventDefault();
    try {
      const res = await api.createAdminQuestion(newQuestion);
      if (res.success) {
        setShowAddQuestionModal(false);
        setNewQuestion({
          title: '',
          domain: 'aptitude',
          topic: 'Quantitative',
          difficulty: 'Medium',
          options: ['', '', '', ''],
          correctAnswerIndex: 0,
          explanation: ''
        });
        loadAll();
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteQuestion = async (id) => {
    if (!window.confirm('Delete this question from institutional repository?')) return;
    try {
      await api.deleteAdminQuestion(id);
      loadAll();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>
            Question Bank & Curated Curriculum Repository
          </h2>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>
            Manage {questions.length}+ MCQs, {tests.length} Standardized Tests, {dsaProblems.length} DSA Sheet Problems, and {interviewQuestions.length} Interview Prompts.
          </p>
        </div>

        <button
          onClick={() => setShowAddQuestionModal(true)}
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
          <PlusCircle size={16} /> Add Question
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.25rem' }}>
        {[
          { key: 'mcq', label: `MCQ Bank (${questions.length})`, icon: HelpCircle },
          { key: 'tests', label: `Standardized Tests (${tests.length})`, icon: Award },
          { key: 'dsa', label: `DSA Practice Sheet (${dsaProblems.length})`, icon: Code2 },
          { key: 'interview', label: `Mock Interview Bank (${interviewQuestions.length})`, icon: Video },
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

      {/* TAB: MCQs */}
      {activeTab === 'mcq' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Filter Bar */}
          <div style={{ display: 'flex', gap: '0.75rem', background: '#ffffff', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f8fafc', padding: '0.45rem 0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <Search size={16} color="#94a3b8" />
              <input
                type="text"
                placeholder="Search MCQs by question text or topic..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ background: 'transparent', border: 'none', outline: 'none', fontSize: '0.85rem', width: '100%' }}
              />
            </div>

            <select
              value={domainFilter}
              onChange={(e) => setDomainFilter(e.target.value)}
              style={{ padding: '0.45rem 0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
            >
              <option value="">All Domains</option>
              <option value="aptitude">General Aptitude</option>
              <option value="cs_core">Core CS (OS, DBMS, CN)</option>
              <option value="engineering">Core Engineering</option>
            </select>

            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              style={{ padding: '0.45rem 0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
            >
              <option value="">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          {/* Questions List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {questions.slice(0, 30).map((q, idx) => (
              <div key={q.id || idx} style={{
                background: '#ffffff',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                padding: '1.25rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '0.15rem 0.45rem', borderRadius: '4px', background: '#eff6ff', color: '#1d4ed8' }}>
                        {q.domain?.toUpperCase() || 'APTITUDE'}
                      </span>
                      <span style={{ fontSize: '0.72rem', background: '#f1f5f9', color: '#475569', padding: '0.15rem 0.45rem', borderRadius: '4px' }}>
                        {q.topic || 'General'}
                      </span>
                      <span style={{
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        padding: '0.15rem 0.45rem',
                        borderRadius: '4px',
                        background: q.difficulty === 'Easy' ? '#ecfdf5' : q.difficulty === 'Medium' ? '#fffbeb' : '#fef2f2',
                        color: q.difficulty === 'Easy' ? '#065f46' : q.difficulty === 'Medium' ? '#92400e' : '#991b1b'
                      }}>
                        {q.difficulty}
                      </span>
                    </div>
                    <div style={{ fontWeight: 600, fontSize: '0.92rem', color: '#0f172a' }}>
                      Q{idx + 1}. {q.title || q.question}
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteQuestion(q.id)}
                    style={{ background: '#fee2e2', border: 'none', color: '#ef4444', padding: '0.35rem', borderRadius: '6px', cursor: 'pointer' }}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>

                {/* Options Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '0.85rem' }}>
                  {(q.options || []).map((opt, oIdx) => (
                    <div key={oIdx} style={{
                      padding: '0.5rem 0.75rem',
                      borderRadius: '6px',
                      fontSize: '0.82rem',
                      background: oIdx === (q.correctAnswerIndex ?? q.correctIndex) ? '#ecfdf5' : '#f8fafc',
                      border: oIdx === (q.correctAnswerIndex ?? q.correctIndex) ? '1px solid #10b981' : '1px solid #e2e8f0',
                      color: oIdx === (q.correctAnswerIndex ?? q.correctIndex) ? '#065f46' : '#334155',
                      fontWeight: oIdx === (q.correctAnswerIndex ?? q.correctIndex) ? 600 : 400
                    }}>
                      {String.fromCharCode(65 + oIdx)}. {opt}
                    </div>
                  ))}
                </div>

                {/* Explanation */}
                {q.explanation && (
                  <div style={{ marginTop: '0.75rem', fontSize: '0.78rem', color: '#64748b', background: '#f8fafc', padding: '0.5rem 0.75rem', borderRadius: '6px' }}>
                    <strong>Explanation:</strong> {q.explanation}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: Standardized Tests */}
      {activeTab === 'tests' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
          {tests.map((t) => (
            <div key={t.id} style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '0.72rem', background: '#eff6ff', color: '#1d4ed8', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 700 }}>
                  {t.category?.toUpperCase() || 'ASSESSMENT'}
                </span>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  {t.durationMinutes || 30} mins
                </span>
              </div>
              <h3 style={{ margin: '0.5rem 0 0.35rem 0', fontSize: '1.05rem', fontWeight: 700 }}>{t.title}</h3>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>{t.description}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem', fontSize: '0.8rem' }}>
                <span><strong>{t.questionCount || 20}</strong> Questions</span>
                <span>Negative Marking: <strong>{t.negativeMarking ? 'Yes (-0.25)' : 'No'}</strong></span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB: DSA Practice Sheet */}
      {activeTab === 'dsa' && (
        <div style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '1.5rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>
                <th style={{ padding: '0.65rem', textAlign: 'left' }}>#</th>
                <th style={{ padding: '0.65rem', textAlign: 'left' }}>Problem Title</th>
                <th style={{ padding: '0.65rem', textAlign: 'left' }}>Topic</th>
                <th style={{ padding: '0.65rem', textAlign: 'left' }}>Difficulty</th>
                <th style={{ padding: '0.65rem', textAlign: 'left' }}>Time / Space Complexity</th>
              </tr>
            </thead>
            <tbody>
              {dsaProblems.slice(0, 35).map((p, idx) => (
                <tr key={p.id || idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '0.65rem', color: '#94a3b8' }}>{idx + 1}</td>
                  <td style={{ padding: '0.65rem', fontWeight: 600 }}>{p.title}</td>
                  <td style={{ padding: '0.65rem', color: '#64748b' }}>{p.topic}</td>
                  <td style={{ padding: '0.65rem' }}>
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
                  <td style={{ padding: '0.65rem', color: '#64748b', fontSize: '0.78rem' }}>
                    {p.timeComplexity || 'O(N)'} / {p.spaceComplexity || 'O(1)'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB: Mock Interview Bank */}
      {activeTab === 'interview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {interviewQuestions.slice(0, 25).map((iq, idx) => (
            <div key={iq.id || idx} style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '1.25rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.72rem', background: '#eff6ff', color: '#1d4ed8', padding: '0.15rem 0.45rem', borderRadius: '4px', fontWeight: 700 }}>
                  {iq.tier?.toUpperCase() || 'PRODUCT TIER-1'}
                </span>
                <span style={{ fontSize: '0.72rem', background: '#f1f5f9', color: '#475569', padding: '0.15rem 0.45rem', borderRadius: '4px' }}>
                  {iq.category || 'Technical'}
                </span>
              </div>
              <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.95rem', fontWeight: 700 }}>{iq.question}</h4>
              <div style={{ fontSize: '0.82rem', color: '#475569', background: '#f8fafc', padding: '0.75rem', borderRadius: '6px' }}>
                <strong>Model Key Points:</strong> {iq.modelAnswer || iq.keyPoints?.join('; ') || 'Candidate should articulate data flow and trade-offs.'}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Question Modal */}
      {showAddQuestionModal && (
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
            width: '560px',
            padding: '2rem',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
          }}>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.25rem', fontWeight: 800 }}>Create Original MCQ Item</h3>
            <form onSubmit={handleCreateQuestion} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.3rem' }}>Question Statement *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Enter problem statement..."
                  value={newQuestion.title}
                  onChange={(e) => setNewQuestion({ ...newQuestion, title: e.target.value })}
                  style={{ width: '100%', padding: '0.55rem', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.3rem' }}>Domain</label>
                  <select
                    value={newQuestion.domain}
                    onChange={(e) => setNewQuestion({ ...newQuestion, domain: e.target.value })}
                    style={{ width: '100%', padding: '0.55rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  >
                    <option value="aptitude">General Aptitude</option>
                    <option value="cs_core">Core CS</option>
                    <option value="engineering">Engineering</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.3rem' }}>Topic</label>
                  <input
                    type="text"
                    value={newQuestion.topic}
                    onChange={(e) => setNewQuestion({ ...newQuestion, topic: e.target.value })}
                    style={{ width: '100%', padding: '0.55rem', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.3rem' }}>Difficulty</label>
                  <select
                    value={newQuestion.difficulty}
                    onChange={(e) => setNewQuestion({ ...newQuestion, difficulty: e.target.value })}
                    style={{ width: '100%', padding: '0.55rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.3rem' }}>Options & Correct Answer</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {newQuestion.options.map((opt, oIdx) => (
                    <div key={oIdx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <input
                        type="radio"
                        name="correctOpt"
                        checked={newQuestion.correctAnswerIndex === oIdx}
                        onChange={() => setNewQuestion({ ...newQuestion, correctAnswerIndex: oIdx })}
                      />
                      <input
                        type="text"
                        placeholder={`Option ${String.fromCharCode(65 + oIdx)}`}
                        value={opt}
                        onChange={(e) => {
                          const newOpts = [...newQuestion.options];
                          newOpts[oIdx] = e.target.value;
                          setNewQuestion({ ...newQuestion, options: newOpts });
                        }}
                        style={{ flex: 1, padding: '0.45rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.3rem' }}>Explanation</label>
                <input
                  type="text"
                  placeholder="Rationale for the correct option..."
                  value={newQuestion.explanation}
                  onChange={(e) => setNewQuestion({ ...newQuestion, explanation: e.target.value })}
                  style={{ width: '100%', padding: '0.55rem', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setShowAddQuestionModal(false)}
                  style={{ padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#f8fafc', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '0.6rem 1.25rem', borderRadius: '8px', border: 'none', background: '#3b82f6', color: 'white', fontWeight: 600, cursor: 'pointer' }}
                >
                  Save Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
