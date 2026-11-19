import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';
import { initialDSAProblems, initialAptitudeQuestions, defaultStudentProfile } from '../server/data/seedData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://ganpat123:power@cluster0.qr2xvhf.mongodb.net/placement_readiness?retryWrites=true&w=majority';

async function migrate() {
  console.log('Connecting to MongoDB Atlas at:', MONGODB_URI);
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db('placement_readiness');

  console.log('Connected! Checking and preparing data migration...');

  // Standard demo password hash for 'password123'
  const salt = bcrypt.genSaltSync(10);
  const password123Hash = bcrypt.hashSync('password123', salt);

  // Load local db files
  const serverDbPath = path.join(__dirname, '..', 'server', 'data', 'db.json');
  const backendDbPath = path.join(__dirname, '..', 'backend', 'data', 'db.json');

  const serverDb = fs.existsSync(serverDbPath) ? JSON.parse(fs.readFileSync(serverDbPath, 'utf8')) : {};
  const backendDb = fs.existsSync(backendDbPath) ? JSON.parse(fs.readFileSync(backendDbPath, 'utf8')) : {};

  // Helper for safe insert
  const safeInsert = async (col, doc, query) => {
    const existing = await col.findOne(query);
    if (!existing) {
      const copy = { ...doc };
      if (copy._id) {
        const idTaken = await col.findOne({ _id: copy._id });
        if (idTaken) {
          delete copy._id;
        }
      }
      await col.insertOne(copy);
      return true;
    }
    return false;
  };

  // 1. Migrate Users & update passwords to match 'password123'
  console.log('\n--- Migrating Users ---');
  const userCol = db.collection('users');
  const existingUsers = await userCol.find({}).toArray();
  const existingUserMap = new Map();
  for (const u of existingUsers) {
    if (u.id) existingUserMap.set(u.id, u);
    if (u.email) existingUserMap.set(u.email.toLowerCase(), u);
  }

  // Predefined primary demo accounts
  const demoUsers = [
    {
      id: 'user_ganpat_23it17',
      email: 'ganpat.singh@ecajmer.ac.in',
      name: 'Ganpat Singh',
      role: 'student',
      password: password123Hash,
      createdAt: new Date().toISOString()
    },
    {
      id: 'admin_tpo_geca',
      email: 'tpo@ecajmer.ac.in',
      name: 'TPO Placement Cell',
      role: 'tpo_admin',
      password: password123Hash,
      createdAt: new Date().toISOString()
    },
    {
      id: 'user_yash_23it60',
      email: 'yash.parihar@ecajmer.ac.in',
      name: 'Yash Parihar',
      role: 'student',
      password: password123Hash,
      createdAt: new Date().toISOString()
    },
    {
      id: 'user_ronak_23it50',
      email: 'ronak.rawat@ecajmer.ac.in',
      name: 'Ronak Singh Rawat',
      role: 'student',
      password: password123Hash,
      createdAt: new Date().toISOString()
    },
    {
      id: 'user_jagdish_23it23',
      email: 'jagdish.rawat@ecajmer.ac.in',
      name: 'Jagdish Singh Rawat',
      role: 'student',
      password: password123Hash,
      createdAt: new Date().toISOString()
    },
    {
      id: 'user_priya_23cs42',
      email: 'priya.sharma@ecajmer.ac.in',
      name: 'Priya Sharma',
      role: 'student',
      password: password123Hash,
      createdAt: new Date().toISOString()
    },
    {
      id: 'user_aman_23cs11',
      email: 'aman.verma@ecajmer.ac.in',
      name: 'Aman Verma',
      role: 'student',
      password: password123Hash,
      createdAt: new Date().toISOString()
    },
    {
      id: 'user_neha_23it35',
      email: 'neha.c@ecajmer.ac.in',
      name: 'Neha Choudhary',
      role: 'student',
      password: password123Hash,
      createdAt: new Date().toISOString()
    },
    {
      id: 'user_rahul_23cs55',
      email: 'rahul.m@ecajmer.ac.in',
      name: 'Rahul Meena',
      role: 'student',
      password: password123Hash,
      createdAt: new Date().toISOString()
    }
  ];

  for (const user of demoUsers) {
    const found = existingUserMap.get(user.id) || existingUserMap.get(user.email.toLowerCase());
    if (found) {
      await userCol.updateOne(
        { _id: found._id },
        { $set: { password: password123Hash, email: user.email, name: user.name, role: user.role, id: user.id } }
      );
      console.log(`Updated user: ${user.email} with password123 hash`);
    } else {
      await userCol.insertOne({
        _id: user.id,
        ...user
      });
      console.log(`Inserted demo user: ${user.email}`);
    }
  }

  // Update legacy demo users
  await userCol.updateMany(
    { email: { $in: ['tpo@geca.demo', 'ganpat@geca.demo', 'yash@geca.demo'] } },
    { $set: { password: password123Hash } }
  );

  // 2. Migrate Profiles
  console.log('\n--- Migrating Profiles ---');
  const profileCol = db.collection('profiles');
  const allProfiles = [
    ...(serverDb.profiles || []),
    ...(backendDb.profiles || []),
    {
      id: 'prof_user_ganpat_23it17',
      userId: 'user_ganpat_23it17',
      ...defaultStudentProfile,
      updatedAt: new Date().toISOString()
    }
  ];

  for (const p of allProfiles) {
    const profId = p.id || ('prof_' + p.userId);
    const existing = await profileCol.findOne({ $or: [{ id: profId }, { userId: p.userId }] });
    if (!existing) {
      await profileCol.insertOne({
        _id: profId,
        id: profId,
        ...p
      });
      console.log(`Inserted profile: ${profId} for user ${p.userId}`);
    } else {
      await profileCol.updateOne(
        { _id: existing._id },
        { $set: { ...p, id: profId } }
      );
    }
  }

  // 3. Migrate DSA Problems
  console.log('\n--- Migrating DSA Problems ---');
  const dsaCol = db.collection('dsa_problems');
  const allDsa = [
    ...initialDSAProblems.map(p => ({ ...p, userId: 'user_ganpat_23it17' })),
    ...(serverDb.dsa_problems || []),
    ...(backendDb.dsa_problems || [])
  ];

  let dsaInserted = 0;
  for (const item of allDsa) {
    const inserted = await safeInsert(
      dsaCol,
      {
        ...item,
        id: item.id || `dsa_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`
      },
      {
        $or: [
          { id: item.id, userId: item.userId },
          { title: item.title, userId: item.userId }
        ]
      }
    );
    if (inserted) dsaInserted++;
  }
  console.log(`DSA Problems: inserted ${dsaInserted} new records. Total: ${await dsaCol.countDocuments()}`);

  // 4. Migrate Aptitude Questions
  console.log('\n--- Migrating Aptitude Questions ---');
  const aptQCol = db.collection('aptitude_questions');
  let aptQInserted = 0;
  for (const [category, questions] of Object.entries(initialAptitudeQuestions)) {
    for (const q of questions) {
      const inserted = await safeInsert(aptQCol, { ...q, category }, { id: q.id });
      if (inserted) aptQInserted++;
    }
  }
  console.log(`Aptitude Questions: inserted ${aptQInserted} new records. Total: ${await aptQCol.countDocuments()}`);

  // 5. Migrate Aptitude Results
  console.log('\n--- Migrating Aptitude Results ---');
  const aptResCol = db.collection('aptitude_results');
  const allAptRes = [
    ...(serverDb.aptitude_results || []),
    ...(backendDb.aptitude_results || [])
  ];
  let aptResInserted = 0;
  for (const res of allAptRes) {
    const inserted = await safeInsert(aptResCol, res, { id: res.id });
    if (inserted) aptResInserted++;
  }
  console.log(`Aptitude Results: inserted ${aptResInserted} new records. Total: ${await aptResCol.countDocuments()}`);

  // 6. Migrate Resume Analyses
  console.log('\n--- Migrating Resume Analyses ---');
  const resumeCol = db.collection('resume_analyses');
  const allResume = [
    ...(serverDb.resume_analyses || []),
    ...(backendDb.resume_analyses || [])
  ];
  let resumeInserted = 0;
  for (const r of allResume) {
    const inserted = await safeInsert(resumeCol, r, { id: r.id });
    if (inserted) resumeInserted++;
  }
  console.log(`Resume Analyses: inserted ${resumeInserted} new records. Total: ${await resumeCol.countDocuments()}`);

  // 7. Migrate Mock Interviews
  console.log('\n--- Migrating Mock Interviews ---');
  const mockCol = db.collection('mock_interviews');
  const allMock = [
    ...(serverDb.mock_interviews || []),
    ...(backendDb.mock_interviews || [])
  ];
  let mockInserted = 0;
  for (const m of allMock) {
    const inserted = await safeInsert(mockCol, m, { id: m.id });
    if (inserted) mockInserted++;
  }
  console.log(`Mock Interviews: inserted ${mockInserted} new records. Total: ${await mockCol.countDocuments()}`);

  // 8. Migrate Readiness Scores
  console.log('\n--- Migrating Readiness Scores ---');
  const readyCol = db.collection('readiness_scores');
  const allReady = [
    ...(serverDb.readiness_scores || []),
    ...(backendDb.readiness_scores || [])
  ];
  let readyInserted = 0;
  for (const s of allReady) {
    const inserted = await safeInsert(readyCol, s, { id: s.id });
    if (inserted) readyInserted++;
  }
  console.log(`Readiness Scores: inserted ${readyInserted} new records. Total: ${await readyCol.countDocuments()}`);

  // Summary
  console.log('\n=============================================');
  console.log('🎉 MongoDB Atlas Complete Migration Status:');
  console.log('=============================================');
  const collections = await db.listCollections().toArray();
  for (const c of collections) {
    const count = await db.collection(c.name).countDocuments();
    console.log(` - ${c.name.padEnd(20)}: ${count} documents`);
  }

  await client.close();
}

migrate().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
