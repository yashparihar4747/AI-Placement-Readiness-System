import React, { useState } from 'react';
import { api } from '../services/api.js';
import {
  FileCheck2,
  UploadCloud,
  FileText,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  RefreshCw,
  Tag
} from 'lucide-react';

export const ResumeAnalyzer = () => {
  const [file, setFile] = useState(null);
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState(
    'Looking for a Full Stack Software Engineer proficient in React.js, Node.js, Express, MongoDB, RESTful APIs, System Design, Git, Docker, and Data Structures.'
  );
  const [targetRole, setTargetRole] = useState('Full Stack Software Engineer');
  const [inputMode, setInputMode] = useState('text'); // 'file' or 'text'
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState('');

  // Sample default resume text for quick testing
  const sampleResumeText = `GANPAT SINGH
Govt. Engineering College, Ajmer | Department of CSE
Email: ganpat.singh@ecajmer.ac.in | Phone: +91 98765 43210
GitHub: github.com/ganpatsingh | LinkedIn: linkedin.com/in/ganpatsingh

EDUCATION:
B.Tech in Computer Science & Engineering (2022 - 2026)
Govt. Engineering College, Ajmer — CGPA: 8.4/10

TECHNICAL SKILLS:
- Languages: JavaScript (ES6+), C++, SQL, HTML5, CSS3
- Frontend: React.js, Redux, Tailwind CSS, Responsive Design
- Backend & DB: Node.js, Express.js, MongoDB, REST APIs
- Tools & Core: Git, Postman, Linux, Data Structures & Algorithms, OOP, DBMS

PROJECTS:
1. AI Placement Preparation & Readiness Tracking System (MERN Stack)
   - Architected full-stack web platform using React.js and Node.js to track placement readiness.
   - Designed modular RESTful APIs serving 500+ mock student preparation queries.
   - Built ATS resume analyzer and rubric-based mock interview evaluator reducing manual tracking time by 45%.

2. High-Performance E-Commerce Microservices
   - Engineered product catalog service with MongoDB indexing, accelerating query latency by 35%.
   - Integrated secure JWT bearer authentication and role-based access control.

ACHIEVEMENTS & CERTIFICATIONS:
- Solved 150+ DSA problems across LeetCode & GeeksforGeeks.
- Finalist in Rajasthan State Level Smart India Hackathon.`;

  const handleAnalyze = async () => {
    setError('');
    setLoading(true);

    try {
      if (inputMode === 'file') {
        if (!file) {
          throw new Error('Please select a PDF or TXT resume file first.');
        }
        const formData = new FormData();
        formData.append('resume', file);
        formData.append('jobDescription', jobDescription);
        formData.append('targetRole', targetRole);

        const res = await api.analyzeResume(formData, true);
        if (res.success) setAnalysisResult(res.analysis);
      } else {
        const textToAnalyze = resumeText.trim() || sampleResumeText;
        const res = await api.analyzeResume({
          resumeText: textToAnalyze,
          jobDescription,
          targetRole
        }, false);
        if (res.success) setAnalysisResult(res.analysis);
      }
    } catch (err) {
      setError(err.message || 'Error analyzing resume');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadSample = () => {
    setResumeText(sampleResumeText);
    setInputMode('text');
  };

  return (
    <div>
      <div className="page-header-box">
        <div>
          <h1 className="page-title">AI ATS Resume Analyzer & JD Matcher</h1>
          <p className="page-subtitle">
            Evaluate resume structure, ATS readability, quantifiable impact metrics, and target job description keyword coverage
          </p>
        </div>
      </div>

      {error && (
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '0.85rem', borderRadius: '10px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Input Controls Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Left: Resume Input */}
        <div className="ui-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: '#1e293b' }}>
              1. Resume Input
            </h3>
            <div style={{ display: 'flex', gap: '0.35rem' }}>
              <button
                onClick={() => setInputMode('text')}
                className={`tier-pill-btn ${inputMode === 'text' ? 'active' : ''}`}
                style={{ color: inputMode === 'text' ? '#312e81' : '#64748b', background: inputMode === 'text' ? '#e0e7ff' : '#f1f5f9' }}
              >
                Text Paste
              </button>
              <button
                onClick={() => setInputMode('file')}
                className={`tier-pill-btn ${inputMode === 'file' ? 'active' : ''}`}
                style={{ color: inputMode === 'file' ? '#312e81' : '#64748b', background: inputMode === 'file' ? '#e0e7ff' : '#f1f5f9' }}
              >
                Upload File (.pdf)
              </button>
            </div>
          </div>

          {inputMode === 'file' ? (
            <div style={{
              border: '2px dashed #cbd5e1',
              borderRadius: '12px',
              padding: '2.5rem 1.5rem',
              textAlign: 'center',
              background: '#f8fafc',
              cursor: 'pointer'
            }}>
              <UploadCloud size={40} color="#6366f1" style={{ margin: '0 auto 0.75rem' }} />
              <p style={{ fontWeight: 600, color: '#334155', marginBottom: '0.25rem' }}>
                {file ? file.name : 'Upload PDF or TXT Resume'}
              </p>
              <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Supports .pdf, .txt up to 5MB</span>
              <input
                type="file"
                accept=".pdf,.txt"
                onChange={(e) => setFile(e.target.files[0])}
                style={{ display: 'block', margin: '1rem auto 0', fontSize: '0.85rem' }}
              />
            </div>
          ) : (
            <div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.5rem' }}>
                <button
                  type="button"
                  onClick={handleLoadSample}
                  style={{ background: 'none', border: 'none', color: '#4f46e5', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer' }}
                >
                  ⚡ Load Sample Resume (Ganpat Singh)
                </button>
              </div>
              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste your plain-text resume here..."
                rows="11"
                className="input-control"
                style={{ fontFamily: 'monospace', fontSize: '0.82rem' }}
              />
            </div>
          )}
        </div>

        {/* Right: Job Description & Target Role */}
        <div className="ui-card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: '#1e293b' }}>
            2. Target Job Description & Role
          </h3>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.35rem', color: '#334155' }}>
              Target Role
            </label>
            <input
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="input-control"
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.35rem', color: '#334155' }}>
              Job Description (JD) Requirements
            </label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste company job description keywords..."
              rows="8"
              className="input-control"
              style={{ fontSize: '0.85rem' }}
            />
          </div>

          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', marginTop: '1.25rem', padding: '0.75rem' }}
          >
            {loading ? (
              <>
                <RefreshCw size={18} className="spin-icon" />
                <span>Running AI ATS Parser...</span>
              </>
            ) : (
              <>
                <Sparkles size={18} />
                <span>Analyze Resume with AI</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Analysis Output Section */}
      {analysisResult && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Top Score Banner */}
          <div className="ui-card" style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '2rem', alignItems: 'center', background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)', color: 'white' }}>
            <div style={{ textAlign: 'center', padding: '1rem', borderRight: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ fontSize: '3.5rem', fontWeight: 900, color: analysisResult.atsScore >= 75 ? '#34d399' : '#fbbf24', lineHeight: 1 }}>
                {analysisResult.atsScore}
              </div>
              <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#c7d2fe', marginTop: '0.4rem' }}>
                ATS Readability Score
              </div>
            </div>

            <div>
              <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.15)', padding: '0.25rem 0.65rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                JD Match: {analysisResult.matchScore}%
              </div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>
                {analysisResult.atsScore >= 75 ? 'ATS Optimized & Drive Ready' : 'Needs Optimization for High-Volume Screenings'}
              </h2>
              <p style={{ color: '#cbd5e1', fontSize: '0.88rem', marginTop: '0.4rem', lineHeight: 1.5 }}>
                Evaluated against 5 ATS dimensions: Skills Match, Quantifiable Impact, Structural Formatting, Experience Depth, and Contact Completeness.
              </p>
            </div>
          </div>

          {/* 5-Dimension Rubric Meter Breakdown */}
          <div className="ui-card">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem', color: '#1e293b' }}>
              ATS Dimension Breakdown
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
              {Object.entries(analysisResult.breakdown || {}).map(([dim, score]) => {
                const names = {
                  skillsMatch: 'Skills & Tech Match',
                  impactAndMetrics: 'Quantified Metrics',
                  formatting: 'Section Structure',
                  experienceDepth: 'Project Depth',
                  contactAndEducation: 'Contact & Education'
                };
                return (
                  <div key={dim} style={{ background: '#f8fafc', padding: '1rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, color: '#334155' }}>
                      <span>{names[dim] || dim}</span>
                      <span style={{ color: score >= 70 ? '#059669' : '#d97706' }}>{score}%</span>
                    </div>
                    <div className="progress-track" style={{ height: '6px', marginTop: '0.65rem' }}>
                      <div className="progress-fill" style={{ width: `${score}%`, background: score >= 70 ? '#10b981' : '#f59e0b' }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Keywords Match Section */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            {/* Matched Keywords */}
            <div className="ui-card">
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#059669', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={18} />
                <span>Matched Skills in Resume ({analysisResult.matchedKeywords?.length || 0})</span>
              </h4>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {analysisResult.matchedKeywords?.map((kw, i) => (
                  <span key={i} className="tag-badge tag-success">
                    ✓ {kw}
                  </span>
                ))}
              </div>
            </div>

            {/* Missing Keywords */}
            <div className="ui-card">
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#dc2626', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertCircle size={18} />
                <span>Missing High-Impact Keywords ({analysisResult.missingKeywords?.length || 0})</span>
              </h4>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {analysisResult.missingKeywords?.map((kw, i) => (
                  <span key={i} className="tag-badge tag-danger">
                    + {kw}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Actionable Feedback Checklist */}
          <div className="ui-card">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: '#1e293b' }}>
              Actionable Improvement Checklist
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {analysisResult.improvements?.map((imp, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem', background: '#fffbeb', border: '1px solid #fef3c7', padding: '0.85rem', borderRadius: '8px', fontSize: '0.88rem', color: '#92400e' }}>
                  <span style={{ fontWeight: 700, background: '#f59e0b', color: 'white', width: '20px', height: '20px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', flexShrink: 0 }}>
                    {idx + 1}
                  </span>
                  <span>{imp}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
