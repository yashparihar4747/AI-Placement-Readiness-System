import { DSALog } from '../config/db.js';
import { initialDSAProblems } from '../data/seedData.js';

export const getProblems = async (req, res) => {
  try {
    let problems = DSALog.find({ userId: req.user.id });

    // If user has zero problems seeded, initialize with seed problems
    if (problems.length === 0) {
      initialDSAProblems.forEach(p => {
        DSALog.create({
          ...p,
          userId: req.user.id
        });
      });
      problems = DSALog.find({ userId: req.user.id });
    }

    const { topic, difficulty, completed } = req.query;
    let filtered = [...problems];

    if (topic && topic !== 'All') {
      filtered = filtered.filter(p => p.topic.toLowerCase() === topic.toLowerCase());
    }
    if (difficulty && difficulty !== 'All') {
      filtered = filtered.filter(p => p.difficulty.toLowerCase() === difficulty.toLowerCase());
    }
    if (completed !== undefined && completed !== 'All') {
      const isComp = completed === 'true';
      filtered = filtered.filter(p => !!p.completed === isComp);
    }

    return res.json({ success: true, count: filtered.length, problems: filtered });
  } catch (err) {
    console.error('getProblems error:', err);
    return res.status(500).json({ message: 'Error retrieving DSA problems', error: err.message });
  }
};

export const addProblem = async (req, res) => {
  try {
    const { title, topic, difficulty, platform, url, completed, notes, timeSpentMin } = req.body;
    if (!title || !topic) {
      return res.status(400).json({ message: 'Problem title and topic are required.' });
    }

    const problem = DSALog.create({
      userId: req.user.id,
      title,
      topic,
      difficulty: difficulty || 'Medium',
      platform: platform || 'LeetCode',
      url: url || '',
      completed: !!completed,
      notes: notes || '',
      timeSpentMin: Number(timeSpentMin) || 0,
      completedAt: completed ? new Date().toISOString() : null
    });

    return res.status(201).json({ success: true, problem, message: 'Problem logged successfully.' });
  } catch (err) {
    console.error('addProblem error:', err);
    return res.status(500).json({ message: 'Error adding DSA problem', error: err.message });
  }
};

export const updateProblem = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = DSALog.findById(id);

    if (!existing || existing.userId !== req.user.id) {
      return res.status(404).json({ message: 'DSA Problem record not found' });
    }

    const updates = { ...req.body };
    if (updates.completed === true && !existing.completed) {
      updates.completedAt = new Date().toISOString();
    } else if (updates.completed === false) {
      updates.completedAt = null;
    }

    const updated = DSALog.findByIdAndUpdate(id, updates);
    return res.json({ success: true, problem: updated });
  } catch (err) {
    console.error('updateProblem error:', err);
    return res.status(500).json({ message: 'Error updating problem', error: err.message });
  }
};

export const deleteProblem = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = DSALog.findById(id);

    if (!existing || existing.userId !== req.user.id) {
      return res.status(404).json({ message: 'DSA Problem record not found' });
    }

    DSALog.findByIdAndDelete(id);
    return res.json({ success: true, message: 'Problem removed from tracker' });
  } catch (err) {
    console.error('deleteProblem error:', err);
    return res.status(500).json({ message: 'Error deleting problem', error: err.message });
  }
};

export const getStats = async (req, res) => {
  try {
    const problems = DSALog.find({ userId: req.user.id });
    const total = problems.length;
    const completed = problems.filter(p => p.completed);

    const difficultyBreakdown = {
      Easy: { total: 0, completed: 0 },
      Medium: { total: 0, completed: 0 },
      Hard: { total: 0, completed: 0 }
    };

    const topicBreakdown = {};

    problems.forEach(p => {
      const diff = p.difficulty || 'Medium';
      if (!difficultyBreakdown[diff]) {
        difficultyBreakdown[diff] = { total: 0, completed: 0 };
      }
      difficultyBreakdown[diff].total++;
      if (p.completed) difficultyBreakdown[diff].completed++;

      const top = p.topic || 'General';
      if (!topicBreakdown[top]) {
        topicBreakdown[top] = { total: 0, completed: 0 };
      }
      topicBreakdown[top].total++;
      if (p.completed) topicBreakdown[top].completed++;
    });

    return res.json({
      success: true,
      stats: {
        total,
        completedCount: completed.length,
        completionRate: total > 0 ? Math.round((completed.length / total) * 100) : 0,
        difficultyBreakdown,
        topicBreakdown
      }
    });
  } catch (err) {
    console.error('getStats error:', err);
    return res.status(500).json({ message: 'Error calculating stats', error: err.message });
  }
};
