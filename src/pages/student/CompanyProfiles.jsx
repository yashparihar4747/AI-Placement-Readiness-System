import React, { useState, useEffect } from 'react';
import { api } from '../../services/api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import {
  Building2,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Award,
  Layers
} from 'lucide-react';

export const CompanyProfiles = () => {
  const { profile } = useAuth();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [readinessModalCompany, setReadinessModalCompany] = useState(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await api.getStudentCompanies();
        if (res.success && res.companies) {
          setCompanies(res.companies);
        }
      } catch (err) {
        console.error('Failed to load companies:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>Loading target company hiring profiles...</div>;
  }

  const studentScore = profile?.readinessScore || 75;
  const studentCGPA = profile?.cgpa || 7.5;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header */}
      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>
          Target Company Hiring Intelligence & Readiness Matching
        </h2>
        <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>
          Compare your algorithmic readiness score and academic qualifications against hiring benchmarks of 12+ recurring campus recruiters.
        </p>
      </div>

      {/* Companies Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {companies.map((c) => {
          const reqScore = c.minReadinessScore || 70;
          const reqCGPA = c.minCGPA || 6.5;
          const isEligible = studentScore >= reqScore && studentCGPA >= reqCGPA;

          return (
            <div key={c.id || c.name} style={{
              background: '#ffffff',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
            }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '10px',
                      background: '#f1f5f9',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '1.1rem',
                      color: '#1e293b'
                    }}>
                      {c.name ? c.name[0] : 'C'}
                    </div>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800 }}>{c.name}</h3>
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{c.tier?.toUpperCase()} Recruiter</span>
                    </div>
                  </div>

                  <span style={{
                    padding: '0.2rem 0.5rem',
                    borderRadius: '4px',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    background: isEligible ? '#ecfdf5' : '#fffbeb',
                    color: isEligible ? '#15803d' : '#b45309'
                  }}>
                    {isEligible ? 'Target Qualified' : 'Gap Identified'}
                  </span>
                </div>

                <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: '8px', fontSize: '0.82rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', margin: '1rem 0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>Package Offered:</span>
                    <strong style={{ color: '#0f172a' }}>{c.package}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>Min Readiness Required:</span>
                    <span style={{ fontWeight: 700, color: '#2563eb' }}>{reqScore}%</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>Min Academic CGPA:</span>
                    <span style={{ fontWeight: 600 }}>{reqCGPA}</span>
                  </div>
                </div>

                <div style={{ fontSize: '0.8rem', color: '#475569', lineHeight: 1.5, marginBottom: '1rem' }}>
                  <strong>Key Focus Areas:</strong> {c.keySkills?.join(', ') || 'DSA, System Design, SQL, OOPs'}
                </div>
              </div>

              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
                <button
                  onClick={() => setReadinessModalCompany(c)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem',
                    background: '#2563eb',
                    color: 'white',
                    border: 'none',
                    padding: '0.6rem',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  <TrendingUp size={15} /> Check My Readiness
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Readiness Check Modal */}
      {readinessModalCompany && (
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
            width: '520px',
            padding: '2rem',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
          }}>
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem', fontWeight: 800 }}>
              Readiness Match for {readinessModalCompany.name}
            </h3>
            <p style={{ margin: '0 0 1.25rem 0', fontSize: '0.82rem', color: '#64748b' }}>
              Tier Benchmark: {readinessModalCompany.tier?.toUpperCase()} • Typical Package: {readinessModalCompany.package}
            </p>

            {/* Score Comparison */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '10px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>YOUR READINESS SCORE</div>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: '#2563eb', marginTop: '0.25rem' }}>
                  {studentScore}%
                </div>
              </div>
              <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '10px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>COMPANY CUTOFF</div>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', marginTop: '0.25rem' }}>
                  {readinessModalCompany.minReadinessScore || 70}%
                </div>
              </div>
            </div>

            {/* Gap Guidance */}
            <div style={{
              padding: '1rem',
              borderRadius: '8px',
              background: studentScore >= (readinessModalCompany.minReadinessScore || 70) ? '#ecfdf5' : '#fffbeb',
              border: `1px solid ${studentScore >= (readinessModalCompany.minReadinessScore || 70) ? '#a7f3d0' : '#fde68a'}`,
              fontSize: '0.85rem',
              color: studentScore >= (readinessModalCompany.minReadinessScore || 70) ? '#065f46' : '#92400e',
              lineHeight: 1.5,
              marginBottom: '1.5rem'
            }}>
              {studentScore >= (readinessModalCompany.minReadinessScore || 70) ? (
                <>✓ <strong>Strong Candidate:</strong> Your algorithmic and aptitude performance clears the placement cell's qualification threshold for this drive.</>
              ) : (
                <>⚠ <strong>Preparation Gap:</strong> You are currently {(readinessModalCompany.minReadinessScore || 70) - studentScore} points below cutoff. Focus on solving 8 more Medium DSA problems and retaking the Core CS Assessment.</>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setReadinessModalCompany(null)}
                style={{ padding: '0.6rem 1.25rem', borderRadius: '8px', border: 'none', background: '#0f172a', color: 'white', fontWeight: 600, cursor: 'pointer' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
