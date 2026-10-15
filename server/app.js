import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import dsaRoutes from './routes/dsaRoutes.js';
import aptitudeRoutes from './routes/aptitudeRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js';
import interviewRoutes from './routes/interviewRoutes.js';
import readinessRoutes from './routes/readinessRoutes.js';

dotenv.config();

const app = express();

// Initialize DB connection
connectDB();

// Core middleware
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Master router containing all API endpoints
const apiRouter = express.Router();

const healthResponse = (req, res) => {
  res.json({
    status: 'online',
    platform: 'Vercel Serverless / Unified Host',
    system: 'AI-Based Placement Preparation and Readiness Tracking System',
    institution: 'Govt. Engineering College, Ajmer (GECA)',
    date: new Date().toISOString(),
    phasesComplete: [
      'Phase 1: Planning & Design',
      'Phase 2: Core Development',
      'Phase 3: AI Module Development'
    ]
  });
};

apiRouter.get('/health', healthResponse);
apiRouter.use('/auth', authRoutes);
apiRouter.use('/profile', profileRoutes);
apiRouter.use('/dsa', dsaRoutes);
apiRouter.use('/aptitude', aptitudeRoutes);
apiRouter.use('/resume', resumeRoutes);
apiRouter.use('/interview', interviewRoutes);
apiRouter.use('/readiness', readinessRoutes);

// Mount master router on BOTH '/api' and '/'
// This guarantees that whether Vercel passes '/api/auth/login' or '/auth/login', it matches perfectly!
app.use('/api', apiRouter);
app.use('/', apiRouter);

// Fallback 404 handler for API routes
app.use((req, res, next) => {
  // If request is an API request, return JSON 404
  if (req.path.startsWith('/api') || req.path.startsWith('/auth') || req.path.startsWith('/health')) {
    return res.status(404).json({
      success: false,
      message: `API route not found: ${req.method} ${req.originalUrl || req.url}`
    });
  }
  next();
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('🔥 Server Error:', err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

export default app;
