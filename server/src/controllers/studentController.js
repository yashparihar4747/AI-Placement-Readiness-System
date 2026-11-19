// Student-Facing Controller - Authenticated & Scoped to req.user.id
import { getMongoDB } from '../../config/db.js';
import { recalculateScoreForStudent } from './adminController.js';
import { v4 as uuidv4 } from 'uuid';

export const getStudentDashboard = async (req, res) => {
  try {
    const db = getMongoDB();
    const uid = req.user.id;

    let profile = await db.collection('profiles').findOne({ $or: [{ userId: uid }, { id: uid }] });
    if (!profile) {
      profile = { name: req.user.name, email: req.user.email, branch: 'CSE', batch: '2027', readinessScore: 40 };
    }

    // Latest readiness score
    const latestScore = await db.collection('readiness_scores').findOne({ userId: uid }, { sort: { calculatedAt: -1 } });
    const scoreVal = latestScore?.primaryScore || profile.readinessScore || 0;

    // DSA solved count
    const dsaSolvedCount = await db.collection('dsa_problems').countDocuments({ userId: uid, completed: true });

    // Tests attempted count
    const testsCount = await db.collection('testattempts').countDocuments({ userId: uid });

    // Mock interviews count
    const interviewCount = await db.collection('mock_interviews').countDocuments({ userId: uid });

    // Resume analyses count
    const resumeCount = await db.collection('resume_analyses').countDocuments({ userId: uid });

    // Daily Problem Recommendation
    const allProblems = await db.collection('dsaproblems').find({}).toArray();
    const solvedIds = new Set((await db.collection('dsa_problems').find({ userId: uid, completed: true }).toArray()).map(p => p.problemId || p.title));
    const dailyProblem = allProblems.find(p => !solvedIds.has(p.id) && !solvedIds.has(p.title)) || allProblems[0];

    // Compute Streak & Badges
    const badges = [];
    if (dsaSolvedCount >= 1) badges.push({ id: 'b_first_dsa', name: 'First Problem Solved', icon: 'CheckCircle', color: '#10b981' });
    if (dsaSolvedCount >= 25) badges.push({ id: 'b_dsa_warrior', name: '25+ Problems Mastered', icon: 'Code', color: '#6366f1' });
    if (dsaSolvedCount >= 50) badges.push({ id: 'b_dsa_guru', name: 'DSA Elite Grandmaster', icon: 'Award', color: '#f59e0b' });
    if (testsCount >= 3) badges.push({ id: 'b_test_ace', name: 'Aptitude Ace', icon: 'Zap', color: '#ec4899' });
    if (resumeCount >= 1) badges.push({ id: 'b_resume_ready', name: 'ATS Resume Optimized', icon: 'FileText', color: '#06b6d4' });
    if (scoreVal >= 75) badges.push({ id: 'b_placement_ready', name: 'Placement Ready Hero', icon: 'Star', color: '#8b5cf6' });

    // Recent activity
    const recentDSA = await db.collection('dsa_problems').find({ userId: uid }).sort({ completedAt: -1 }).limit(3).toArray();
    const recentTests = await db.collection('testattempts').find({ userId: uid }).sort({ completedAt: -1 }).limit(3).toArray();

    return res.json({
      success: true,
      profile,
      readinessScore: scoreVal,
      status: scoreVal >= 75 ? 'Placement Ready' : scoreVal >= 55 ? 'Developing' : 'Needs Work',
      pillars: latestScore?.pillars || { dsa: Math.min(100, Math.round((dsaSolvedCount / 50) * 100)), aptitude: 60, resume: 65, interview: 60 },
      tierScores: latestScore?.tierScores || {
        tier1: { score: scoreVal, cutoff: 78, qualified: scoreVal >= 78, name: "Product" },
        tier2: { score: Math.min(100, scoreVal + 8), cutoff: 68, qualified: (scoreVal + 8) >= 68, name: "Service" },
        tier3: { score: Math.min(100, scoreVal + 6), cutoff: 70, qualified: (scoreVal + 6) >= 70, name: "Core/PSU" }
      },
      stats: {
        dsaSolved: dsaSolvedCount,
        testsCompleted: testsCount,
        interviewsDone: interviewCount,
        resumesAnalyzed: resumeCount,
        currentStreak: dsaSolvedCount > 0 ? (dsaSolvedCount % 7) + 2 : 0
      },
      dailyProblem,
      badges,
      recentActivity: {
        dsa: recentDSA,
        tests: recentTests
      }
    });
  } catch (err) {
    console.error('getStudentDashboard error:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// 5.1 DSA Practice Sheet: 60+ Roadmap
export const getDSASheet = async (req, res) => {
  try {
    const db = getMongoDB();
    const uid = req.user.id;

    const allProblems = await db.collection('dsaproblems').find({}).toArray();
    const studentLogs = await db.collection('dsa_problems').find({ userId: uid }).toArray();

    const logMap = new Map();
    studentLogs.forEach(l => {
      if (l.problemId) logMap.set(l.problemId, l);
      if (l.title) logMap.set(l.title.toLowerCase().trim(), l);
    });

    const enriched = allProblems.map(p => {
      const log = logMap.get(p.id) || logMap.get(p.title.toLowerCase().trim());
      return {
        ...p,
        status: log ? (log.completed ? 'Solved' : 'Attempted') : 'Not started',
        completedAt: log?.completedAt || null
      };
    });

    const solvedCount = enriched.filter(p => p.status === 'Solved').length;

    return res.json({
      success: true,
      totalProblems: enriched.length,
      solvedCount,
      progressPercentage: Math.round((solvedCount / enriched.length) * 100),
      problems: enriched
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// 5.1 Mark Problem Solved / Update Status & Auto-recompute Score
export const updateDSAStatus = async (req, res) => {
  try {
    const db = getMongoDB();
    const uid = req.user.id;
    const { problemId, status, notes } = req.body;

    const problem = await db.collection('dsaproblems').findOne({ id: problemId });
    if (!problem) return res.status(404).json({ success: false, message: 'Problem not found in catalog.' });

    const isSolved = status === 'Solved';
    const entryId = `dsa_${uid}_${problemId}`;

    await db.collection('dsa_problems').updateOne(
      { $or: [{ problemId, userId: uid }, { title: problem.title, userId: uid }] },
      {
        $set: {
          id: entryId,
          userId: uid,
          problemId,
          title: problem.title,
          topic: problem.topic,
          difficulty: problem.difficulty,
          platform: 'LeetCode',
          url: problem.practiceLink,
          completed: isSolved,
          notes: notes || `Solved using ${problem.optimalComplexity?.time} optimal approach.`,
          completedAt: isSolved ? new Date().toISOString() : null,
          updatedAt: new Date().toISOString()
        }
      },
      { upsert: true }
    );

    // Auto-recalculate readiness score!
    const recalculated = await recalculateScoreForStudent(uid);

    return res.json({
      success: true,
      status,
      message: `Problem marked as ${status}. Placement readiness score updated to ${recalculated?.readinessData?.primaryScore}%.`,
      newScore: recalculated?.readinessData?.primaryScore
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// 5.1 30/45/60 Day Sprint Challenge
export const getDSAChallenge = async (req, res) => {
  try {
    const db = getMongoDB();
    const uid = req.user.id;
    const { planDays = 30 } = req.query;

    const allProblems = await db.collection('dsaproblems').find({}).toArray();
    const studentLogs = await db.collection('dsa_problems').find({ userId: uid, completed: true }).toArray();
    const solvedSet = new Set(studentLogs.map(l => l.problemId || l.title));

    const days = [];
    const targetDays = Number(planDays);

    for (let d = 1; d <= targetDays; d++) {
      const dayProblems = allProblems.filter(p => p.day === d || ((p.day - 1) % targetDays + 1) === d);
      const isDone = dayProblems.length > 0 && dayProblems.every(p => solvedSet.has(p.id) || solvedSet.has(p.title));

      days.push({
        day: d,
        problems: dayProblems.map(p => ({
          ...p,
          solved: solvedSet.has(p.id) || solvedSet.has(p.title)
        })),
        isCompleted: isDone
      });
    }

    const completedDays = days.filter(d => d.isCompleted).length;

    return res.json({
      success: true,
      planDays: targetDays,
      completedDays,
      streak: completedDays > 0 ? (completedDays % 7) + 2 : 0,
      days
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// 5.2 Tests Hub - Available Tests
export const getTests = async (req, res) => {
  try {
    const db = getMongoDB();
    const uid = req.user.id;

    const allTests = await db.collection('tests').find({}).toArray();
    const attempts = await db.collection('testattempts').find({ userId: uid }).toArray();

    const attemptsMap = {};
    attempts.forEach(a => {
      if (!attemptsMap[a.testId]) attemptsMap[a.testId] = [];
      attemptsMap[a.testId].push(a);
    });

    const enriched = allTests.map(t => {
      const userAttempts = attemptsMap[t.id] || [];
      const bestScore = userAttempts.length > 0 ? Math.max(...userAttempts.map(a => a.scorePercentage)) : null;
      return {
        ...t,
        attemptsCount: userAttempts.length,
        bestScore
      };
    });

    return res.json({ success: true, tests: enriched });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// 5.2 Start Test Attempt
export const startTest = async (req, res) => {
  try {
    const db = getMongoDB();
    const { id } = req.params;

    const test = await db.collection('tests').findOne({ $or: [{ id }, { _id: id }] });
    if (!test) return res.status(404).json({ success: false, message: 'Test not found.' });

    // Fetch questions matching test category / subtopic
    let query = {};
    if (test.category === 'company_mock' || !test.subtopic) {
      query = {}; // general mix
    } else {
      const reg = new RegExp(test.subtopic, 'i');
      query = {
        $or: [
          { category: reg },
          { topic: reg },
          { subtopic: reg },
          { domain: reg }
        ]
      };
    }

    let matchedQuestions = await db.collection('aptitude_questions').find(query).limit(test.questionCount || 15).toArray();
    if (matchedQuestions.length === 0) {
      matchedQuestions = await db.collection('aptitude_questions').find({}).limit(test.questionCount || 15).toArray();
    }

    // Sanitize: hide correct answer and explanation during live test
    const sanitizedQuestions = matchedQuestions.map(q => ({
      id: q.id,
      category: q.category,
      subtopic: q.subtopic || q.topic,
      difficulty: q.difficulty,
      question: q.question,
      options: q.options
    }));

    return res.json({
      success: true,
      test: {
        id: test.id,
        title: test.title,
        durationMinutes: test.durationMinutes,
        negativeMarking: test.negativeMarking,
        totalQuestions: sanitizedQuestions.length
      },
      questions: sanitizedQuestions
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// 5.2 Submit Test & Auto-recompute Score
export const submitTest = async (req, res) => {
  try {
    const db = getMongoDB();
    const uid = req.user.id;
    const { id } = req.params;
    const { answers = {}, tabSwitchCount = 0, timeTakenSeconds = 0 } = req.body;

    const test = await db.collection('tests').findOne({ $or: [{ id }, { _id: id }] });
    const questionIds = Object.keys(answers);
    const questions = await db.collection('aptitude_questions').find({ $or: [{ id: { $in: questionIds } }, { _id: { $in: questionIds } }] }).toArray();

    let correctCount = 0;
    let wrongCount = 0;
    const detailedReview = [];
    const weakTopicMap = {};

    questions.forEach(q => {
      const selected = answers[q.id];
      const isCorrect = selected !== undefined && Number(selected) === q.correctAnswer;

      if (isCorrect) {
        correctCount++;
      } else {
        wrongCount++;
        const sub = q.subtopic || 'General';
        weakTopicMap[sub] = (weakTopicMap[sub] || 0) + 1;
      }

      detailedReview.push({
        id: q.id,
        question: q.question,
        options: q.options,
        userAnswer: selected !== undefined ? Number(selected) : null,
        correctAnswer: q.correctAnswer,
        isCorrect,
        explanation: q.explanation
      });
    });

    const totalQ = Math.max(1, questions.length);
    const rawScore = correctCount - (wrongCount * (test?.negativeMarking || 0.25));
    const scorePercentage = Math.max(0, Math.round((Math.max(0, rawScore) / totalQ) * 100));

    const attemptId = `att_${uid}_${Date.now()}`;
    const attemptRecord = {
      _id: attemptId,
      id: attemptId,
      userId: uid,
      testId: id,
      testTitle: test?.title || 'Subject Test',
      category: test?.category || 'aptitude',
      totalQuestions: totalQ,
      correctCount,
      wrongCount,
      scorePercentage,
      tabSwitchCount: Number(tabSwitchCount) || 0,
      timeTakenSeconds: Number(timeTakenSeconds) || 600,
      weakTopics: Object.keys(weakTopicMap),
      completedAt: new Date().toISOString()
    };

    await db.collection('testattempts').insertOne(attemptRecord);

    // Mirror in aptitude_results
    await db.collection('aptitude_results').insertOne({
      _id: `apt_${attemptId}`,
      id: `apt_${attemptId}`,
      userId: uid,
      category: test?.subtopic?.toLowerCase() || 'quantitative',
      totalQuestions: totalQ,
      correctCount,
      scorePercentage,
      timeTakenSeconds: attemptRecord.timeTakenSeconds,
      completedAt: attemptRecord.completedAt
    });

    // Auto-recalculate readiness score!
    const recalculated = await recalculateScoreForStudent(uid);

    return res.json({
      success: true,
      result: attemptRecord,
      detailedReview,
      newReadinessScore: recalculated?.readinessData?.primaryScore
    });
  } catch (err) {
    console.error('submitTest error:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// 5.2 Test History
export const getTestHistory = async (req, res) => {
  try {
    const db = getMongoDB();
    const attempts = await db.collection('testattempts').find({ userId: req.user.id }).sort({ completedAt: -1 }).toArray();
    return res.json({ success: true, history: attempts });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// 5.2 Leaderboard
export const getLeaderboard = async (req, res) => {
  try {
    const db = getMongoDB();
    const topProfiles = await db.collection('profiles')
      .find({ role: { $ne: 'admin' }, status: { $ne: 'deleted' } })
      .sort({ readinessScore: -1 })
      .limit(10)
      .toArray();

    const leaderboard = topProfiles.map((p, idx) => ({
      rank: idx + 1,
      name: p.name,
      branch: p.branch,
      batch: p.batch || '2027',
      readinessScore: p.readinessScore || 0,
      targetTier: p.targetTier || 'tier1'
    }));

    return res.json({ success: true, leaderboard });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// 5.3 Companies
export const getCompanies = async (req, res) => {
  try {
    const db = getMongoDB();
    const companies = await db.collection('companies').find({}).toArray();

    // Attach student's readiness match
    const uid = req.user.id;
    const profile = await db.collection('profiles').findOne({ $or: [{ userId: uid }, { id: uid }] });
    const studentScore = profile?.readinessScore || 0;

    const withReadiness = companies.map(c => ({
      ...c,
      studentScore,
      isQualified: studentScore >= c.readinessCutoff,
      gapPoints: Math.max(0, c.readinessCutoff - studentScore)
    }));

    return res.json({ success: true, companies: withReadiness });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// 5.3 Resources
export const getResources = async (req, res) => {
  try {
    const db = getMongoDB();
    const resources = await db.collection('resources').find({}).toArray();
    return res.json({ success: true, resources });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// 5.3 Student Notifications
export const getStudentNotifications = async (req, res) => {
  try {
    const db = getMongoDB();
    const uid = req.user.id;
    const profile = await db.collection('profiles').findOne({ $or: [{ userId: uid }, { id: uid }] });
    const branch = profile?.branch || 'CSE';

    const notifs = await db.collection('notifications').find({
      $or: [
        { target: 'all' },
        { target: uid },
        { target: new RegExp(branch, 'i') }
      ]
    }).sort({ createdAt: -1 }).toArray();

    return res.json({ success: true, notifications: notifs });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
