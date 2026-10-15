// Multi-Factor AI Readiness Scoring Engine
// Implements the mathematical weighting models segmented by Company Tier

export const TIER_WEIGHTS = {
  tier1: {
    name: 'Product-Based (FAANG, Unicorns, Tier-1 Tech)',
    dsa: 0.40,
    aptitude: 0.20,
    resume: 0.15,
    interview: 0.25,
    benchmarkScore: 78
  },
  tier2: {
    name: 'Service-Based (TCS, Infosys, Wipro, Accenture)',
    dsa: 0.15,
    aptitude: 0.35,
    resume: 0.20,
    interview: 0.30,
    benchmarkScore: 68
  },
  tier3: {
    name: 'Core Engineering / PSU / Government Technical',
    dsa: 0.10,
    aptitude: 0.45,
    resume: 0.25,
    interview: 0.20,
    benchmarkScore: 70
  }
};

/**
 * Calculates raw DSA score out of 100 based on solved problem difficulty and topic coverage
 */
export const calculateDSAScore = (dsaProblems = []) => {
  const completed = dsaProblems.filter(p => p.completed);
  if (completed.length === 0) return 30; // base onboarding credit

  let easyCount = 0;
  let mediumCount = 0;
  let hardCount = 0;
  const uniqueTopics = new Set();

  completed.forEach(p => {
    uniqueTopics.add(p.topic);
    const diff = (p.difficulty || 'Easy').toLowerCase();
    if (diff === 'hard') hardCount++;
    else if (diff === 'medium') mediumCount++;
    else easyCount++;
  });

  // Difficulty point formula: Easy = 2pts, Medium = 5pts, Hard = 10pts
  const totalPoints = (easyCount * 2) + (mediumCount * 5) + (hardCount * 10);

  // Target college benchmark = 45 points for full score
  const volumeScore = Math.min(100, (totalPoints / 45) * 100);

  // Topic breadth multiplier (8 core topics)
  const topicCoverage = Math.min(1.0, uniqueTopics.size / 6);

  const finalDSAScore = Math.round((volumeScore * 0.75) + (topicCoverage * 100 * 0.25));
  return Math.min(98, Math.max(20, finalDSAScore));
};

/**
 * Calculates Aptitude score out of 100 from completed quizzes
 */
export const calculateAptitudeScore = (aptitudeResults = []) => {
  if (!aptitudeResults || aptitudeResults.length === 0) return 40;

  const total = aptitudeResults.reduce((sum, item) => sum + (item.scorePercentage || 0), 0);
  const avg = Math.round(total / aptitudeResults.length);
  return Math.min(100, Math.max(20, avg));
};

/**
 * Main Readiness Calculator across all tiers
 */
export const calculateComprehensiveReadiness = ({
  dsaProblems = [],
  aptitudeResults = [],
  resumeAnalyses = [],
  mockInterviews = [],
  targetTier = 'tier1'
}) => {
  const dsaScore = calculateDSAScore(dsaProblems);
  const aptitudeScore = calculateAptitudeScore(aptitudeResults);

  // Resume score
  const latestResume = resumeAnalyses && resumeAnalyses.length > 0
    ? resumeAnalyses[resumeAnalyses.length - 1]
    : null;
  const resumeScore = latestResume ? (latestResume.atsScore || 70) : 55;

  // Mock interview score
  const latestInterview = mockInterviews && mockInterviews.length > 0
    ? mockInterviews[mockInterviews.length - 1]
    : null;
  const interviewScore = latestInterview ? (latestInterview.overallScore || 65) : 50;

  // Compute tier-wise scores
  const tierScores = {};
  for (const [tierKey, config] of Object.entries(TIER_WEIGHTS)) {
    const compositeScore = Math.round(
      (dsaScore * config.dsa) +
      (aptitudeScore * config.aptitude) +
      (resumeScore * config.resume) +
      (interviewScore * config.interview)
    );

    let status = 'Foundation Stage';
    let statusColor = 'amber';
    if (compositeScore >= config.benchmarkScore + 5) {
      status = 'Placement Ready';
      statusColor = 'emerald';
    } else if (compositeScore >= config.benchmarkScore - 8) {
      status = 'Interview Ready (Near Target)';
      statusColor = 'blue';
    } else if (compositeScore >= 50) {
      status = 'In Progress';
      statusColor = 'orange';
    } else {
      status = 'Needs Attention';
      statusColor = 'rose';
    }

    tierScores[tierKey] = {
      tierName: config.name,
      score: compositeScore,
      benchmark: config.benchmarkScore,
      isQualified: compositeScore >= config.benchmarkScore,
      status,
      statusColor,
      weights: {
        dsa: Math.round(config.dsa * 100),
        aptitude: Math.round(config.aptitude * 100),
        resume: Math.round(config.resume * 100),
        interview: Math.round(config.interview * 100)
      }
    };
  }

  // Selected tier primary score
  const activeTierConfig = tierScores[targetTier] || tierScores['tier1'];

  // Identify bottlenecks & generate personalized next steps
  const pillars = [
    { name: 'Data Structures & Algorithms', score: dsaScore, key: 'dsa' },
    { name: 'Aptitude & Logical Reasoning', score: aptitudeScore, key: 'aptitude' },
    { name: 'ATS Resume Quality', score: resumeScore, key: 'resume' },
    { name: 'Mock Technical Interview', score: interviewScore, key: 'interview' }
  ];

  // Sort by lowest score to pinpoint priority focus
  pillars.sort((a, b) => a.score - b.score);
  const lowestPillar = pillars[0];
  const secondLowest = pillars[1];

  const actionRoadmap = [];

  if (dsaScore < 75) {
    actionRoadmap.push({
      priority: 'High',
      pillar: 'DSA',
      action: 'Solve 3 Medium problems in Trees and Dynamic Programming on LeetCode / GFG.',
      impact: '+6 to +10 pts on Tier-1 readiness'
    });
  }

  if (aptitudeScore < 75) {
    actionRoadmap.push({
      priority: 'High',
      pillar: 'Aptitude',
      action: 'Take a timed test on Quantitative (Percentages & Time-Work) and Syllogisms.',
      impact: '+8 pts on Tier-2 & Tier-3 readiness'
    });
  }

  if (resumeScore < 75) {
    actionRoadmap.push({
      priority: 'Medium',
      pillar: 'Resume',
      action: 'Incorporate quantifiable metrics (e.g., latency, users, % improvement) and align keywords with target JD.',
      impact: '+5 to +8 pts ATS compatibility'
    });
  }

  if (interviewScore < 75) {
    actionRoadmap.push({
      priority: 'Medium',
      pillar: 'Interview',
      action: 'Practice an adaptive mock interview session focusing on System Design and Big-O explanations.',
      impact: '+7 pts interview communication score'
    });
  }

  if (actionRoadmap.length === 0) {
    actionRoadmap.push({
      priority: 'Refinement',
      pillar: 'Maintenance',
      action: 'Maintain consistent daily problem solving and attempt company-specific mock tests.',
      impact: 'Maintain peak readiness'
    });
  }

  return {
    primaryScore: activeTierConfig.score,
    targetTier,
    activeTierName: activeTierConfig.tierName,
    status: activeTierConfig.status,
    statusColor: activeTierConfig.statusColor,
    isQualified: activeTierConfig.isQualified,
    benchmarkScore: activeTierConfig.benchmark,
    pillars: {
      dsa: dsaScore,
      aptitude: aptitudeScore,
      resume: resumeScore,
      interview: interviewScore
    },
    tierScores,
    weakestArea: lowestPillar.name,
    secondaryFocus: secondLowest.name,
    actionRoadmap,
    evaluatedAt: new Date().toISOString()
  };
};
