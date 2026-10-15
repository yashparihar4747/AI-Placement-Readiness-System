import { AptitudeResult } from '../config/db.js';
import { initialAptitudeQuestions } from '../data/seedData.js';

export const getCategories = (req, res) => {
  const categories = [
    {
      id: 'quantitative',
      title: 'Quantitative Aptitude',
      description: 'Percentages, Profit & Loss, Time & Work, Speed-Distance, Probability, Ratios',
      questionCount: initialAptitudeQuestions.quantitative.length,
      estimatedMinutes: 10,
      icon: 'Calculator'
    },
    {
      id: 'logical',
      title: 'Logical Reasoning',
      description: 'Number Series, Blood Relations, Coding-Decoding, Syllogisms, Direction Sense',
      questionCount: initialAptitudeQuestions.logical.length,
      estimatedMinutes: 10,
      icon: 'Brain'
    },
    {
      id: 'verbal',
      title: 'Verbal Ability & English',
      description: 'Sentence Correction, Synonyms & Antonyms, Idioms, Reading Comprehension',
      questionCount: initialAptitudeQuestions.verbal.length,
      estimatedMinutes: 8,
      icon: 'BookOpen'
    },
    {
      id: 'core_cs',
      title: 'Core Computer Science',
      description: 'Operating Systems, Data Structures, DBMS & SQL, Computer Networks, OOP',
      questionCount: initialAptitudeQuestions.core_cs.length,
      estimatedMinutes: 10,
      icon: 'Terminal'
    }
  ];

  return res.json({ success: true, categories });
};

export const getQuizQuestions = (req, res) => {
  try {
    const { category } = req.params;
    const questions = initialAptitudeQuestions[category];

    if (!questions) {
      return res.status(404).json({ message: `Category '${category}' not found.` });
    }

    // Sanitize questions: strip correctAnswer and explanation for active test taking
    const clientQuestions = questions.map(q => ({
      id: q.id,
      topic: q.topic,
      question: q.question,
      options: q.options
    }));

    return res.json({
      success: true,
      category,
      totalQuestions: clientQuestions.length,
      timeLimitMinutes: 10,
      questions: clientQuestions
    });
  } catch (err) {
    console.error('getQuizQuestions error:', err);
    return res.status(500).json({ message: 'Error retrieving quiz questions', error: err.message });
  }
};

export const submitQuiz = async (req, res) => {
  try {
    const { category } = req.params;
    const { userAnswers = {}, timeTakenSeconds = 0 } = req.body;

    const questions = initialAptitudeQuestions[category];
    if (!questions) {
      return res.status(404).json({ message: `Category '${category}' not found.` });
    }

    let correctCount = 0;
    const detailedReview = [];
    const topicBreakdown = {};

    questions.forEach(q => {
      const selectedOption = userAnswers[q.id];
      const isCorrect = selectedOption !== undefined && Number(selectedOption) === q.correctAnswer;

      if (isCorrect) correctCount++;

      // Track by topic
      if (!topicBreakdown[q.topic]) {
        topicBreakdown[q.topic] = { total: 0, correct: 0 };
      }
      topicBreakdown[q.topic].total++;
      if (isCorrect) topicBreakdown[q.topic].correct++;

      detailedReview.push({
        id: q.id,
        question: q.question,
        options: q.options,
        selectedOption: selectedOption !== undefined ? Number(selectedOption) : null,
        correctAnswer: q.correctAnswer,
        isCorrect,
        explanation: q.explanation,
        topic: q.topic
      });
    });

    const scorePercentage = Math.round((correctCount / questions.length) * 100);

    const resultRecord = AptitudeResult.create({
      userId: req.user.id,
      category,
      totalQuestions: questions.length,
      correctCount,
      scorePercentage,
      timeTakenSeconds,
      topicBreakdown,
      completedAt: new Date().toISOString()
    });

    return res.json({
      success: true,
      result: resultRecord,
      scorePercentage,
      correctCount,
      totalQuestions: questions.length,
      detailedReview,
      message: `Test submitted! You scored ${scorePercentage}% (${correctCount}/${questions.length})`
    });
  } catch (err) {
    console.error('submitQuiz error:', err);
    return res.status(500).json({ message: 'Error submitting quiz', error: err.message });
  }
};

export const getHistory = async (req, res) => {
  try {
    const results = AptitudeResult.find({ userId: req.user.id });
    return res.json({
      success: true,
      count: results.length,
      history: results.sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
    });
  } catch (err) {
    console.error('getHistory error:', err);
    return res.status(500).json({ message: 'Error retrieving aptitude history', error: err.message });
  }
};
