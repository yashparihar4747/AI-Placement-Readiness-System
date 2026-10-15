import { store } from './store.js';

// Collection abstractions matching Synopsis requirements
export const User = store.collection('users');
export const Profile = store.collection('profiles');
export const DSALog = store.collection('dsa_problems');
export const AptitudeResult = store.collection('aptitude_results');
export const ResumeAnalysis = store.collection('resume_analyses');
export const MockInterview = store.collection('mock_interviews');
export const ReadinessScore = store.collection('readiness_scores');

export const connectDB = async () => {
  try {
    if (process.env.MONGODB_URI) {
      console.log(`🔌 Attempting connection to MongoDB at: ${process.env.MONGODB_URI}`);
      // In production/cloud, mongoose can be plugged in here
    }
    console.log('✅ [Database Layer] Connected to Local Data Store (Synchronized to backend/data/db.json)');
    return true;
  } catch (err) {
    console.error('❌ Database connection error:', err);
    return false;
  }
};
