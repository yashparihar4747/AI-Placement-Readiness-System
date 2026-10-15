import React, { useState, useEffect } from 'react';
import { api } from '../services/api.js';
import {
  FileSpreadsheet,
  Printer,
  CheckCircle,
  AlertCircle,
  GraduationCap,
  Award,
  Layers,
  Building
} from 'lucide-react';

export const ReadinessReport = () => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await api.getReadinessReport();
        if (res.success) setReportData(res.report);
      } catch (err) {
        console.error('Error fetching report:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  if (loading || !reportData) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>
        Loading Official Readiness Report...
      </div>
    );
  }

  const { studentInfo, executiveSummary, componentMetrics, tierComparison, actionPlan } = reportData;

  return (
    <div style={{ maxWidth: '950px', margin: '0 auto' }}>
      <div className="page-header-box" style={{ alignItems: 'center' }}>
        <div>
          <h1 className="page-title">Placement Readiness Dossier</h1>
          <p className="page-subtitle">
            Formal batch readiness evaluation document generated for TPO cell verification
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="btn-secondary"
        >
          <Printer size={16} />
          <span>Print / Export PDF</span>
        </button>
      </div>

      {/* Official Printable Report Container */}
      <div className="ui-card" style={{ padding: '3rem', background: '#ffffff', border: '1px solid #cbd5e1', boxShadow: 'var(--shadow-md)' }}>
        {/* Header Institution Banner */}
        <div style={{ textAlign: 'center', borderBottom: '2px solid #0f172a', paddingBottom: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '56px', height: '56px', borderRadius: '50%', background: '#1e1b4b', color: 'white', marginBottom: '0.75rem' }}>
            <GraduationCap size={32} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.02em', margin: 0 }}>
            Govt. Engineering College, Ajmer
          </h2>
          <div style={{ fontSize: '0.85rem', color: '#475569', fontWeight: 600, marginTop: '0.2rem' }}>
            (An Autonomous Institution of Govt. of Rajasthan) • NH-48, Badliya Circle, Ajmer
          </div>
          <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '0.2rem' }}>
            Training & Placement Cell (TPO) • Placement Preparation & Evaluation Record
          </div>
        </div>

        {/* Student Profile Metadata Table */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', background: '#f8fafc', padding: '1.25rem', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '2rem' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase' }}>Candidate Name</div>
            <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>{studentInfo.name}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase' }}>Roll Number</div>
            <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>{studentInfo.rollNo}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase' }}>Branch & Department</div>
            <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#334155' }}>{studentInfo.branch}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase' }}>Academic CGPA / Target</div>
            <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#334155' }}>{studentInfo.cgpa} / 10 • {studentInfo.targetTier}</div>
          </div>
        </div>

        {/* Executive Verdict Banner */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '1.25rem 1.75rem', borderRadius: '8px', marginBottom: '2rem' }}>
          <div>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#059669', textTransform: 'uppercase' }}>
              Consolidated Placement Readiness Verdict
            </span>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#065f46', margin: '0.2rem 0' }}>
              {executiveSummary.overallReadiness} — {executiveSummary.status}
            </h3>
            <span style={{ fontSize: '0.82rem', color: '#047857' }}>
              Campus Drive Shortlist Status: <strong>{executiveSummary.qualifiedForTargetDrive}</strong>
            </span>
          </div>

          <div style={{ textAlign: 'right' }}>
            <Award size={48} color="#059669" />
          </div>
        </div>

        {/* Four Pillar Metrics */}
        <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          1. Component Readiness Scores
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ border: '1px solid #e2e8f0', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>DSA Practice</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#4f46e5', marginTop: '0.25rem' }}>{componentMetrics.dsaScore}</div>
          </div>
          <div style={{ border: '1px solid #e2e8f0', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Aptitude Test</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0284c7', marginTop: '0.25rem' }}>{componentMetrics.aptitudeScore}</div>
          </div>
          <div style={{ border: '1px solid #e2e8f0', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Resume ATS</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#059669', marginTop: '0.25rem' }}>{componentMetrics.resumeAtsScore}</div>
          </div>
          <div style={{ border: '1px solid #e2e8f0', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Mock Interview</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#7c3aed', marginTop: '0.25rem' }}>{componentMetrics.mockInterviewScore}</div>
          </div>
        </div>

        {/* Tier-Wise Comparison Matrix */}
        <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          2. Multi-Tier Readiness Matrix
        </h4>
        <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden', marginBottom: '2rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>
                <th style={{ padding: '0.75rem 1rem' }}>Company Tier</th>
                <th style={{ padding: '0.75rem 1rem' }}>Calculated Score</th>
                <th style={{ padding: '0.75rem 1rem' }}>Institutional Cutoff</th>
                <th style={{ padding: '0.75rem 1rem' }}>Placement Status</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(tierComparison || {}).map(([key, t]) => (
                <tr key={key} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>{t.tierName}</td>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 800, color: '#1e293b' }}>{t.score}%</td>
                  <td style={{ padding: '0.85rem 1rem', color: '#64748b' }}>{t.benchmark}%</td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <span style={{ color: t.isQualified ? '#059669' : '#d97706', fontWeight: 700 }}>
                      {t.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Action Roadmap */}
        <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          3. Mandatory Preparatory Action Items
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '2.5rem' }}>
          {actionPlan?.map((item, idx) => (
            <div key={idx} style={{ padding: '0.75rem', background: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '0.85rem' }}>
              <strong>[{item.priority} Priority] ({item.pillar}):</strong> {item.action} — <span style={{ color: '#059669' }}>{item.impact}</span>
            </div>
          ))}
        </div>

        {/* Signatures Footer */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', marginTop: '3rem', paddingTop: '2rem', borderTop: '1px dashed #cbd5e1', textAlign: 'center' }}>
          <div>
            <div style={{ borderBottom: '1px solid #94a3b8', height: '40px', marginBottom: '0.5rem' }}></div>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155' }}>Ganpat Singh (23IT17)</div>
            <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Student Candidate</div>
          </div>
          <div>
            <div style={{ borderBottom: '1px solid #94a3b8', height: '40px', marginBottom: '0.5rem' }}></div>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155' }}>Faculty Project Supervisor</div>
            <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Dept. of Computer Science & Engg.</div>
          </div>
          <div>
            <div style={{ borderBottom: '1px solid #94a3b8', height: '40px', marginBottom: '0.5rem' }}></div>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155' }}>TPO Officer / Placement Cell</div>
            <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Govt. Engineering College, Ajmer</div>
          </div>
        </div>
      </div>
    </div>
  );
};
