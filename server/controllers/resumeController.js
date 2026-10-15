import pdf from 'pdf-parse/lib/pdf-parse.js';
import { ResumeAnalysis } from '../config/db.js';
import { analyzeResumeDeterministic } from '../services/aiService.js';

export const analyzeResume = async (req, res) => {
  try {
    let resumeText = '';
    let fileName = 'Direct_Paste_Resume.txt';

    // 1. Check if file was uploaded via multipart/form-data
    if (req.file) {
      fileName = req.file.originalname;
      if (req.file.mimetype === 'application/pdf' || req.file.originalname.endsWith('.pdf')) {
        try {
          const pdfData = await pdf(req.file.buffer);
          resumeText = pdfData.text || '';
        } catch (pdfErr) {
          console.warn('PDF parsing error, attempting plain text fallback:', pdfErr.message);
          resumeText = req.file.buffer.toString('utf8');
        }
      } else {
        resumeText = req.file.buffer.toString('utf8');
      }
    } else if (req.body.resumeText) {
      resumeText = req.body.resumeText;
      fileName = req.body.fileName || 'Pasted_Resume_Text.txt';
    }

    if (!resumeText || resumeText.trim().length < 50) {
      return res.status(400).json({
        message: 'Resume content is too short or could not be read. Please upload a valid PDF or paste your resume text.'
      });
    }

    const { jobDescription = '', targetRole = 'Software Engineer' } = req.body;

    // Run deterministic ATS analysis
    const analysis = analyzeResumeDeterministic(resumeText, jobDescription, targetRole);

    // Save record to DB
    const record = ResumeAnalysis.create({
      userId: req.user.id,
      fileName,
      targetRole,
      jobDescriptionSnippet: jobDescription.slice(0, 300),
      atsScore: analysis.atsScore,
      matchScore: analysis.matchScore,
      breakdown: analysis.breakdown,
      matchedKeywords: analysis.matchedKeywords,
      missingKeywords: analysis.missingKeywords,
      strengths: analysis.strengths,
      improvements: analysis.improvements,
      analyzedAt: new Date().toISOString()
    });

    return res.json({
      success: true,
      analysis: record,
      message: `Resume analyzed successfully! Overall ATS Score: ${analysis.atsScore}/100`
    });
  } catch (err) {
    console.error('analyzeResume error:', err);
    return res.status(500).json({ message: 'Error analyzing resume', error: err.message });
  }
};

export const getResumeHistory = async (req, res) => {
  try {
    const list = ResumeAnalysis.find({ userId: req.user.id });
    return res.json({
      success: true,
      history: list.sort((a, b) => new Date(b.analyzedAt) - new Date(a.analyzedAt))
    });
  } catch (err) {
    console.error('getResumeHistory error:', err);
    return res.status(500).json({ message: 'Error fetching resume history', error: err.message });
  }
};
