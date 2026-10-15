import { DSALog, AptitudeResult, ResumeAnalysis, MockInterview, Profile, ReadinessScore } from '../config/db.js';
import { calculateComprehensiveReadiness } from '../services/scoringEngine.js';

export const getReadinessScore = async (req, res) => {
  try {
    const profile = Profile.findOne({ userId: req.user.id });
    const targetTier = profile?.targetTier || 'tier1';

    const dsaProblems = DSALog.find({ userId: req.user.id });
    const aptitudeResults = AptitudeResult.find({ userId: req.user.id });
    const resumeAnalyses = ResumeAnalysis.find({ userId: req.user.id });
    const mockInterviews = MockInterview.find({ userId: req.user.id });

    const readinessData = calculateComprehensiveReadiness({
      dsaProblems,
      aptitudeResults,
      resumeAnalyses,
      mockInterviews,
      targetTier
    });

    // Save record to DB history
    const saved = ReadinessScore.create({
      userId: req.user.id,
      targetTier,
      primaryScore: readinessData.primaryScore,
      status: readinessData.status,
      pillars: readinessData.pillars,
      tierScores: readinessData.tierScores,
      actionRoadmap: readinessData.actionRoadmap,
      calculatedAt: new Date().toISOString()
    });

    return res.json({
      success: true,
      readiness: readinessData,
      historyId: saved.id
    });
  } catch (err) {
    console.error('getReadinessScore error:', err);
    return res.status(500).json({ message: 'Error calculating readiness score', error: err.message });
  }
};

export const getReadinessReport = async (req, res) => {
  try {
    const profile = Profile.findOne({ userId: req.user.id });
    const targetTier = profile?.targetTier || 'tier1';

    const dsaProblems = DSALog.find({ userId: req.user.id });
    const aptitudeResults = AptitudeResult.find({ userId: req.user.id });
    const resumeAnalyses = ResumeAnalysis.find({ userId: req.user.id });
    const mockInterviews = MockInterview.find({ userId: req.user.id });

    const readinessData = calculateComprehensiveReadiness({
      dsaProblems,
      aptitudeResults,
      resumeAnalyses,
      mockInterviews,
      targetTier
    });

    // Report format tailored for student and TPO review
    const report = {
      studentInfo: {
        name: profile?.name || req.user.name,
        email: req.user.email,
        rollNo: profile?.rollNo || '23IT17',
        college: profile?.college || 'Govt. Engineering College, Ajmer',
        branch: profile?.branch || 'Computer Science & Engineering',
        targetTier: targetTier.toUpperCase(),
        targetRole: profile?.targetRole || 'Full Stack SDE',
        cgpa: profile?.cgpa || 8.0
      },
      executiveSummary: {
        overallReadiness: `${readinessData.primaryScore}%`,
        status: readinessData.status,
        qualifiedForTargetDrive: readinessData.isQualified ? 'YES' : 'IN PROGRESS',
        weakestArea: readinessData.weakestArea,
        secondaryFocus: readinessData.secondaryFocus
      },
      componentMetrics: {
        dsaScore: `${readinessData.pillars.dsa}/100`,
        aptitudeScore: `${readinessData.pillars.aptitude}/100`,
        resumeAtsScore: `${readinessData.pillars.resume}/100`,
        mockInterviewScore: `${readinessData.pillars.interview}/100`
      },
      tierComparison: readinessData.tierScores,
      actionPlan: readinessData.actionRoadmap,
      generatedAt: new Date().toISOString()
    };

    return res.json({ success: true, report });
  } catch (err) {
    console.error('getReadinessReport error:', err);
    return res.status(500).json({ message: 'Error generating readiness report', error: err.message });
  }
};
