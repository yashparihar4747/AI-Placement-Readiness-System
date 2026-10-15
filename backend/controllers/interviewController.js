import { MockInterview } from '../config/db.js';
import { INTERVIEW_TAXONOMY, evaluateInterviewAnswerDeterministic } from '../services/aiService.js';
import { v4 as uuidv4 } from 'uuid';

// In-memory active interview sessions cache
const activeSessions = new Map();

export const getInterviewTiers = (req, res) => {
  const tiers = [
    {
      id: 'tier1',
      name: 'Product-Based Companies',
      companies: 'Google, Microsoft, Amazon, Atlassian, Swiggy, Flipkart',
      focus: 'High DSA, System Design, Scalability, Concurrency, Big-O Optimization',
      totalStages: 3
    },
    {
      id: 'tier2',
      name: 'Service-Based Companies',
      companies: 'TCS Digital/Prime, Infosys DSE, Wipro Turbo, Accenture',
      focus: 'Core Data Structures, OOPs, DBMS/SQL, Web Fundamentals, Code Cleanliness',
      totalStages: 3
    },
    {
      id: 'tier3',
      name: 'Core Engineering / PSU / Tech',
      companies: 'ISRO, DRDO, BEL, BHEL, Embedded / Core Tech',
      focus: 'OS Internals, Networking Protocols, Memory Architecture, Testing Methodologies',
      totalStages: 3
    }
  ];

  return res.json({ success: true, tiers });
};

export const startInterview = (req, res) => {
  try {
    const { tier = 'tier1', role = 'Full Stack Software Engineer' } = req.body;
    const tierConfig = INTERVIEW_TAXONOMY[tier] || INTERVIEW_TAXONOMY['tier1'];

    const sessionId = uuidv4();
    const firstStage = tierConfig.stages[0];

    const sessionData = {
      id: sessionId,
      userId: req.user.id,
      tier,
      tierName: tierConfig.name,
      role,
      currentStageIndex: 0,
      totalStages: tierConfig.stages.length,
      responses: [],
      startedAt: new Date().toISOString()
    };

    activeSessions.set(sessionId, sessionData);

    return res.status(201).json({
      success: true,
      sessionId,
      tier,
      stage: firstStage.stage,
      totalStages: tierConfig.stages.length,
      topic: firstStage.topic,
      question: firstStage.question,
      message: 'Interview session initialized. Answer the question thoughtfully.'
    });
  } catch (err) {
    console.error('startInterview error:', err);
    return res.status(500).json({ message: 'Error starting interview', error: err.message });
  }
};

export const submitInterviewAnswer = (req, res) => {
  try {
    const { sessionId, answer } = req.body;

    if (!sessionId || !answer) {
      return res.status(400).json({ message: 'Session ID and answer are required.' });
    }

    const session = activeSessions.get(sessionId);
    if (!session || session.userId !== req.user.id) {
      return res.status(404).json({ message: 'Active interview session not found or expired.' });
    }

    const tierConfig = INTERVIEW_TAXONOMY[session.tier];
    const currentStage = tierConfig.stages[session.currentStageIndex];

    // Evaluate answer with rubric
    const evaluation = evaluateInterviewAnswerDeterministic(currentStage.question, answer, currentStage);

    session.responses.push({
      stage: currentStage.stage,
      topic: currentStage.topic,
      question: currentStage.question,
      answer,
      evaluation
    });

    session.currentStageIndex++;

    const isCompleted = session.currentStageIndex >= tierConfig.stages.length;

    let nextQuestion = null;
    if (!isCompleted) {
      const nextStage = tierConfig.stages[session.currentStageIndex];
      nextQuestion = {
        stage: nextStage.stage,
        topic: nextStage.topic,
        question: nextStage.question
      };
    }

    return res.json({
      success: true,
      stageScore: evaluation.overallScore,
      scores: evaluation.scores,
      critique: evaluation.critique,
      suggestedFollowUp: evaluation.suggestedFollowUp,
      isCompleted,
      nextQuestion
    });
  } catch (err) {
    console.error('submitInterviewAnswer error:', err);
    return res.status(500).json({ message: 'Error evaluating answer', error: err.message });
  }
};

export const finishInterview = (req, res) => {
  try {
    const { sessionId } = req.body;
    const session = activeSessions.get(sessionId);

    if (!session || session.userId !== req.user.id) {
      return res.status(404).json({ message: 'Interview session not found' });
    }

    const responses = session.responses;
    if (responses.length === 0) {
      return res.status(400).json({ message: 'Cannot finish interview with 0 answers recorded.' });
    }

    // Aggregate overall scores
    let totalScore = 0;
    let techAccTotal = 0;
    let probSolveTotal = 0;
    let commTotal = 0;

    responses.forEach(r => {
      totalScore += r.evaluation.overallScore;
      techAccTotal += r.evaluation.scores.technicalAccuracy;
      probSolveTotal += r.evaluation.scores.problemSolving;
      commTotal += r.evaluation.scores.communication;
    });

    const count = responses.length;
    const overallScore = Math.round(totalScore / count);
    const avgTech = parseFloat((techAccTotal / count).toFixed(1));
    const avgProb = parseFloat((probSolveTotal / count).toFixed(1));
    const avgComm = parseFloat((commTotal / count).toFixed(1));

    let finalFeedback = 'Good effort. Continue refining technical clarity and system design depth.';
    if (overallScore >= 80) {
      finalFeedback = 'Outstanding technical mastery and clear, structured communication. Well suited for tier-1 interview rounds!';
    } else if (overallScore >= 65) {
      finalFeedback = 'Solid conceptual base. Make sure to articulate edge cases, Big-O complexities, and concurrency aspects explicitly.';
    }

    const savedRecord = MockInterview.create({
      userId: req.user.id,
      role: session.role,
      tier: session.tier,
      tierName: session.tierName,
      overallScore,
      rubric: {
        technicalAccuracy: avgTech,
        problemSolving: avgProb,
        communication: avgComm
      },
      questionsAnswered: count,
      responses,
      feedback: finalFeedback,
      completedAt: new Date().toISOString()
    });

    // Clean session from memory
    activeSessions.delete(sessionId);

    return res.json({
      success: true,
      interview: savedRecord,
      message: `Interview complete! Overall Score: ${overallScore}/100`
    });
  } catch (err) {
    console.error('finishInterview error:', err);
    return res.status(500).json({ message: 'Error finishing interview', error: err.message });
  }
};

export const getInterviewHistory = (req, res) => {
  try {
    const list = MockInterview.find({ userId: req.user.id });
    return res.json({
      success: true,
      count: list.length,
      history: list.sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
    });
  } catch (err) {
    console.error('getInterviewHistory error:', err);
    return res.status(500).json({ message: 'Error retrieving interview history', error: err.message });
  }
};
