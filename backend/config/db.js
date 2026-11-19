import dotenv from 'dotenv';
import { store } from './store.js';

dotenv.config();

// Collection abstractions matching Synopsis requirements
export const User = store.collection('users');
export const Profile = store.collection('profiles');
export const DSALog = store.collection('dsa_problems');
export const AptitudeResult = store.collection('aptitude_results');
export const ResumeAnalysis = store.collection('resume_analyses');
export const MockInterview = store.collection('mock_interviews');
export const ReadinessScore = store.collection('readiness_scores');

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb+srv://ganpat123:power@cluster0.qr2xvhf.mongodb.net/placement_readiness?retryWrites=true&w=majority';
  try {
    console.log(`🔌 Initializing database connection...`);
    const success = await store.initMongo(uri);
    if (success) {
      console.log('✅ [Database Layer] Connected to MongoDB Atlas & synchronized 7 collections.');
      return true;
    }
  } catch (err) {
    console.error('❌ Database connection error:', err.message);
  }
  console.log('⚠️ [Database Layer] Operating in local resilient store mode (db.json)');
  return false;
};

export const getMongoDB = () => store.mongoDb;
export const getMongoClient = () => store.mongoClient;
