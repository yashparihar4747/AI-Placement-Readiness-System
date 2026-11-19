// Master Idempotent & Reset Seeder for MongoDB Atlas & Relational Storage
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { MongoClient } from 'mongodb';
import { generateFullSeedData } from './seedStudents.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://ganpat123:power@cluster0.qr2xvhf.mongodb.net/placement_readiness?retryWrites=true&w=majority';
const isReset = process.argv.includes('--reset');

async function seed() {
  console.log('====================================================');
  console.log(`🌱 PlacementReady Master Seeder [Mode: ${isReset ? 'RESET & RESEED' : 'IDEMPOTENT UPSERT'}]`);
  console.log('====================================================');

  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db('placement_readiness');

  console.log('📡 Connected to MongoDB Atlas: placement_readiness');

  // Load generated seed files
  const dsaCatalog = JSON.parse(fs.readFileSync(path.join(__dirname, 'dsaProblems.json'), 'utf8'));
  const allMCQs = JSON.parse(fs.readFileSync(path.join(__dirname, 'allQuestions.json'), 'utf8'));
  const tests = JSON.parse(fs.readFileSync(path.join(__dirname, 'tests.json'), 'utf8'));
  const interviewBank = JSON.parse(fs.readFileSync(path.join(__dirname, 'interviewBank.json'), 'utf8'));
  const companies = JSON.parse(fs.readFileSync(path.join(__dirname, 'companies.json'), 'utf8'));
  const resources = JSON.parse(fs.readFileSync(path.join(__dirname, 'resources.json'), 'utf8'));
  const fullData = generateFullSeedData();

  if (isReset) {
    console.log('⚠️ Dropping all collections for clean re-seed...');
    const existingCollections = await db.listCollections().toArray();
    for (const c of existingCollections) {
      try {
        await db.collection(c.name).drop();
        console.log(` - Dropped: ${c.name}`);
      } catch (err) {
        // ignore
      }
    }
  }

  // Generic fast bulk upsert helper
  const upsertMany = async (collectionName, items, keyField = 'id') => {
    if (!items || items.length === 0) return;
    const col = db.collection(collectionName);
    const operations = items.map(item => {
      const idVal = item[keyField] || item._id;
      return {
        updateOne: {
          filter: { $or: [{ [keyField]: idVal }, { _id: idVal }] },
          update: { $set: { _id: idVal, ...item, [keyField]: idVal } },
          upsert: true
        }
      };
    });

    for (let i = 0; i < operations.length; i += 500) {
      await col.bulkWrite(operations.slice(i, i + 500), { ordered: false });
    }

    console.log(` - [${collectionName.padEnd(20)}] Total in DB: ${(await col.countDocuments()).toString().padStart(4)} | Processed: ${items.length}`);
  };

  console.log('\n--- 1. Seed Content Banks ---');
  await upsertMany('dsaproblems', dsaCatalog, 'id');
  await upsertMany('aptitude_questions', allMCQs, 'id');
  await upsertMany('tests', tests, 'id');
  await upsertMany('interview_bank', interviewBank, 'id');
  await upsertMany('companies', companies, 'id');
  await upsertMany('resources', resources, 'id');

  console.log('\n--- 2. Seed Users & Profiles ---');
  await upsertMany('users', fullData.users, 'id');
  await upsertMany('profiles', fullData.profiles, 'id');

  console.log('\n--- 3. Seed Student Historical Activity ---');
  await upsertMany('dsa_problems', fullData.dsa_problems, 'id');
  await upsertMany('testattempts', fullData.test_attempts, 'id');
  await upsertMany('aptitude_results', fullData.aptitude_results, 'id');
  await upsertMany('resume_analyses', fullData.resume_analyses, 'id');
  await upsertMany('mock_interviews', fullData.mock_interviews, 'id');
  await upsertMany('readiness_scores', fullData.readiness_scores, 'id');

  console.log('\n--- 4. Seed TPO Management Data ---');
  await upsertMany('drives', fullData.drives, 'id');
  await upsertMany('shortlists', fullData.shortlists, 'id');
  await upsertMany('auditlogs', fullData.auditlogs, 'id');
  await upsertMany('contactmessages', fullData.contactmessages, 'id');
  await upsertMany('notifications', fullData.notifications, 'id');

  // Seed Relational / Analytics Datastores
  const analyticsData = {
    batch_snapshots: fullData.batch_snapshots,
    score_weights: fullData.score_weights
  };
  fs.writeFileSync(path.join(__dirname, '..', '..', 'data', 'analytics.json'), JSON.stringify(analyticsData, null, 2));
  console.log(` - [analytics.json      ] Saved 4 weeks of batch snapshots and score weights.`);

  // Sync to local db.json for backup
  const localDb = {
    users: fullData.users,
    profiles: fullData.profiles,
    dsa_problems: fullData.dsa_problems,
    aptitude_results: fullData.aptitude_results,
    resume_analyses: fullData.resume_analyses,
    mock_interviews: fullData.mock_interviews,
    readiness_scores: fullData.readiness_scores
  };
  fs.writeFileSync(path.join(__dirname, '..', '..', 'data', 'db.json'), JSON.stringify(localDb, null, 2));

  console.log('\n====================================================');
  console.log('🎉 SEEDING COMPLETE! Full Platform Content Active.');
  console.log('====================================================');

  await client.close();
}

seed().catch(err => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
