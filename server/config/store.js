import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { MongoClient } from 'mongodb';
import { initialDSAProblems, initialAptitudeQuestions, defaultStudentProfile } from '../data/seedData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isVercel = Boolean(process.env.VERCEL);
const DB_FILE = isVercel
  ? path.join('/tmp', 'db.json')
  : path.join(__dirname, '..', 'data', 'db.json');

const DEFAULT_MONGO_URI = 'mongodb+srv://ganpat123:power@cluster0.qr2xvhf.mongodb.net/placement_readiness?retryWrites=true&w=majority';

class MongoJSONStore {
  constructor() {
    this.data = {
      users: [],
      profiles: [],
      dsa_problems: [],
      aptitude_results: [],
      resume_analyses: [],
      mock_interviews: [],
      readiness_scores: []
    };
    this.mongoClient = null;
    this.mongoDb = null;
    this.isMongoConnected = false;

    // Load initial local data
    this.initLocal();
  }

  initLocal() {
    try {
      const dataDir = path.dirname(DB_FILE);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf8');
        this.data = JSON.parse(raw);
        console.log('📦 [Store] Loaded local database cache.');
      } else {
        this.seedInitialData();
        this.save();
        console.log('🌱 [Store] Seeded initial sample data.');
      }
    } catch (err) {
      console.warn('⚠️ [Store] File access warning, using memory store:', err.message);
      this.seedInitialData();
      this.save();
    }
  }

  seedInitialData() {
    const salt = bcrypt.genSaltSync(10);
    const demoPasswordHash = bcrypt.hashSync('password123', salt);
    const demoUserId = 'user_ganpat_23it17';

    this.data.users = [
      {
        id: demoUserId,
        email: 'ganpat.singh@ecajmer.ac.in',
        password: demoPasswordHash,
        name: 'Ganpat Singh',
        role: 'student',
        createdAt: new Date().toISOString()
      },
      {
        id: 'admin_tpo_geca',
        email: 'tpo@ecajmer.ac.in',
        password: demoPasswordHash,
        name: 'TPO Placement Cell',
        role: 'tpo_admin',
        createdAt: new Date().toISOString()
      }
    ];

    this.data.profiles = [
      {
        id: 'prof_' + demoUserId,
        userId: demoUserId,
        ...defaultStudentProfile,
        updatedAt: new Date().toISOString()
      }
    ];

    this.data.dsa_problems = initialDSAProblems.map(p => ({
      ...p,
      userId: demoUserId
    }));

    this.data.aptitude_results = [
      {
        id: 'apt_res_01',
        userId: demoUserId,
        category: 'quantitative',
        totalQuestions: 5,
        correctCount: 4,
        scorePercentage: 80,
        timeTakenSeconds: 320,
        topicBreakdown: { "Percentages": 100, "Time & Work": 100, "Speed & Distance": 100, "Probability": 0, "Averages": 100 },
        completedAt: new Date(Date.now() - 3 * 86400000).toISOString()
      },
      {
        id: 'apt_res_02',
        userId: demoUserId,
        category: 'logical',
        totalQuestions: 5,
        correctCount: 4,
        scorePercentage: 80,
        timeTakenSeconds: 280,
        topicBreakdown: { "Number Series": 100, "Blood Relations": 100, "Coding-Decoding": 100, "Syllogism": 0, "Direction Sense": 100 },
        completedAt: new Date(Date.now() - 2 * 86400000).toISOString()
      },
      {
        id: 'apt_res_03',
        userId: demoUserId,
        category: 'core_cs',
        totalQuestions: 5,
        correctCount: 5,
        scorePercentage: 100,
        timeTakenSeconds: 240,
        topicBreakdown: { "Operating Systems": 100, "Data Structures": 100, "DBMS": 100, "Networks": 100, "OOP": 100 },
        completedAt: new Date(Date.now() - 1 * 86400000).toISOString()
      }
    ];

    this.data.resume_analyses = [
      {
        id: 'resume_01',
        userId: demoUserId,
        fileName: 'Ganpat_Singh_Resume.pdf',
        targetRole: 'Full Stack SDE / Software Engineer',
        atsScore: 78,
        matchScore: 82,
        breakdown: {
          skillsMatch: 85,
          impactAndMetrics: 70,
          formatting: 80,
          experienceDepth: 75,
          contactAndEducation: 90
        },
        matchedKeywords: ['React.js', 'Node.js', 'Express', 'MongoDB', 'Data Structures', 'REST APIs', 'Git'],
        missingKeywords: ['Docker', 'CI/CD Pipelines', 'Redis / Caching', 'Unit Testing (Jest/Mocha)', 'System Design'],
        strengths: [
          'Strong full-stack core competencies with MERN stack explicitly demonstrated.',
          'Good academic foundation from Govt. Engineering College, Ajmer.',
          'Clear project descriptions with architecture flow.'
        ],
        improvements: [
          'Quantify project outcomes: e.g. "reduced latency by 35%" or "serves 500+ daily requests".',
          'Include cloud and deployment proficiencies (Docker, AWS, or CI/CD).',
          'Ensure uniform date formatting across project and education sections.'
        ],
        analyzedAt: new Date(Date.now() - 2 * 86400000).toISOString()
      }
    ];

    this.data.mock_interviews = [
      {
        id: 'interview_01',
        userId: demoUserId,
        role: 'Full Stack SDE (Product-Based)',
        tier: 'tier1',
        overallScore: 81,
        rubric: {
          technicalAccuracy: 8.5,
          problemSolving: 8.0,
          communication: 8.0,
          systemThinking: 8.0
        },
        questionsAnswered: 3,
        feedback: 'Demonstrated solid grasp of asynchronous event loop in Node.js and state lifecycle in React. Can improve on explaining database indexing tradeoffs and space complexity.',
        completedAt: new Date(Date.now() - 1 * 86400000).toISOString()
      }
    ];
  }

  async initMongo(uri = DEFAULT_MONGO_URI) {
    try {
      let finalUri = uri.trim();
      // Ensure DB name is targeted properly
      if (finalUri.endsWith('.mongodb.net/') || finalUri.endsWith('.mongodb.net')) {
        finalUri = finalUri.replace(/\/?$/, '/placement_readiness?retryWrites=true&w=majority');
      }

      console.log(`📡 Connecting to MongoDB Atlas Cluster...`);
      this.mongoClient = new MongoClient(finalUri);
      await this.mongoClient.connect();

      // Extract DB name or default to 'placement_readiness'
      const dbMatch = finalUri.match(/\.mongodb\.net\/([^?]+)/);
      const dbName = (dbMatch && dbMatch[1]) ? dbMatch[1] : 'placement_readiness';

      this.mongoDb = this.mongoClient.db(dbName);
      this.isMongoConnected = true;

      console.log(`✅ [MongoDB Atlas] Connected to database: "${dbName}"`);

      // Sync existing MongoDB collections into this.data
      await this.syncFromMongo();

      // Ensure primary dummy accounts are intact with password123
      await this.ensureDemoAccounts();

      return true;
    } catch (err) {
      console.error('❌ [MongoDB Atlas] Connection error:', err.message);
      this.isMongoConnected = false;
      return false;
    }
  }

  async syncFromMongo() {
    if (!this.mongoDb) return;
    try {
      const collections = [
        'users',
        'profiles',
        'dsa_problems',
        'aptitude_results',
        'resume_analyses',
        'mock_interviews',
        'readiness_scores'
      ];

      for (const colName of collections) {
        const docs = await this.mongoDb.collection(colName).find({}).toArray();
        if (docs && docs.length > 0) {
          this.data[colName] = docs.map(d => ({
            ...d,
            id: d.id || d._id?.toString()
          }));
        }
      }

      // Save synced data locally as resilient backup
      this.save();
      console.log(`🔄 [MongoDB Atlas] Synchronized all collections into memory store.`);
    } catch (err) {
      console.warn('⚠️ [MongoDB Atlas] Sync warning:', err.message);
    }
  }

  async ensureDemoAccounts() {
    if (!this.mongoDb) return;
    try {
      const salt = bcrypt.genSaltSync(10);
      const password123Hash = bcrypt.hashSync('password123', salt);

      const demoUsers = [
        {
          id: 'user_ganpat_23it17',
          email: 'ganpat.singh@ecajmer.ac.in',
          name: 'Ganpat Singh',
          role: 'student',
          password: password123Hash
        },
        {
          id: 'admin_tpo_geca',
          email: 'tpo@ecajmer.ac.in',
          name: 'TPO Placement Cell',
          role: 'tpo_admin',
          password: password123Hash
        }
      ];

      for (const u of demoUsers) {
        const existing = await this.mongoDb.collection('users').findOne({
          $or: [{ id: u.id }, { email: u.email }]
        });
        if (existing) {
          await this.mongoDb.collection('users').updateOne(
            { _id: existing._id },
            { $set: { password: password123Hash, email: u.email, name: u.name, role: u.role, id: u.id } }
          );
        } else {
          await this.mongoDb.collection('users').insertOne({
            _id: u.id,
            ...u,
            createdAt: new Date().toISOString()
          });
        }
      }

      // Refresh memory users array
      const freshUsers = await this.mongoDb.collection('users').find({}).toArray();
      this.data.users = freshUsers.map(d => ({ ...d, id: d.id || d._id?.toString() }));
      this.save();
    } catch (err) {
      console.warn('⚠️ [MongoDB Atlas] Error ensuring demo accounts:', err.message);
    }
  }

  save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf8');
    } catch (err) {
      // In serverless / read-only environment, ignore write warnings
    }
  }

  // Model-like collection abstraction
  collection(name) {
    if (!this.data[name]) {
      this.data[name] = [];
    }
    const self = this;
    const getTable = () => self.data[name] || [];

    const matchesFilter = (item, filter) => {
      for (let key in filter) {
        if (key === 'id') {
          if (item.id !== filter[key] && item._id?.toString() !== filter[key]) return false;
        } else if (key === '_id') {
          if (item._id?.toString() !== filter[key]?.toString() && item.id !== filter[key]?.toString()) return false;
        } else if (item[key] !== filter[key]) {
          return false;
        }
      }
      return true;
    };

    return {
      find: (filter = {}) => {
        return getTable().filter(item => matchesFilter(item, filter));
      },

      findOne: (filter = {}) => {
        return getTable().find(item => matchesFilter(item, filter)) || null;
      },

      findById: (id) => {
        return getTable().find(item => item.id === id || item._id === id || item._id?.toString() === id) || null;
      },

      create: (data) => {
        const id = data.id || uuidv4();
        const newItem = {
          _id: data._id || id,
          id,
          createdAt: new Date().toISOString(),
          ...data
        };
        const arr = getTable();
        arr.push(newItem);
        self.save();

        // Write directly to MongoDB Atlas
        if (self.mongoDb) {
          self.mongoDb.collection(name).updateOne(
            { $or: [{ id: newItem.id }, { _id: newItem.id }] },
            { $set: newItem },
            { upsert: true }
          ).catch(err => {
            console.error(`❌ [MongoDB Atlas] Error persisting to collection '${name}':`, err.message);
          });
        }

        return newItem;
      },

      findByIdAndUpdate: (id, updates) => {
        const arr = getTable();
        const index = arr.findIndex(item => item.id === id || item._id === id || item._id?.toString() === id);
        if (index === -1) return null;

        arr[index] = { ...arr[index], ...updates, updatedAt: new Date().toISOString() };
        self.save();

        // Update directly in MongoDB Atlas
        if (self.mongoDb) {
          self.mongoDb.collection(name).updateOne(
            { $or: [{ id }, { _id: id }] },
            { $set: updates }
          ).catch(err => {
            console.error(`❌ [MongoDB Atlas] Error updating document in '${name}':`, err.message);
          });
        }

        return arr[index];
      },

      findOneAndUpdate: (filter, updates) => {
        const arr = getTable();
        const item = arr.find(item => matchesFilter(item, filter));
        if (!item) return null;

        Object.assign(item, updates, { updatedAt: new Date().toISOString() });
        self.save();

        // Update in MongoDB Atlas
        if (self.mongoDb) {
          const query = { ...filter };
          self.mongoDb.collection(name).updateOne(
            query,
            { $set: updates }
          ).catch(err => {
            console.error(`❌ [MongoDB Atlas] Error updating document in '${name}':`, err.message);
          });
        }

        return item;
      },

      findByIdAndDelete: (id) => {
        const arr = getTable();
        const index = arr.findIndex(item => item.id === id || item._id === id || item._id?.toString() === id);
        if (index === -1) return null;

        const [deleted] = arr.splice(index, 1);
        self.save();

        // Delete from MongoDB Atlas
        if (self.mongoDb) {
          self.mongoDb.collection(name).deleteOne({
            $or: [{ id }, { _id: id }]
          }).catch(err => {
            console.error(`❌ [MongoDB Atlas] Error deleting from collection '${name}':`, err.message);
          });
        }

        return deleted;
      },

      deleteMany: (filter = {}) => {
        const arr = getTable();
        const initialLen = arr.length;
        self.data[name] = arr.filter(item => !matchesFilter(item, filter));
        self.save();

        // DeleteMany in MongoDB Atlas
        if (self.mongoDb) {
          self.mongoDb.collection(name).deleteMany(filter).catch(err => {
            console.error(`❌ [MongoDB Atlas] Error deleting multiple in '${name}':`, err.message);
          });
        }

        return { deletedCount: initialLen - self.data[name].length };
      },

      countDocuments: (filter = {}) => {
        return getTable().filter(item => matchesFilter(item, filter)).length;
      }
    };
  }
}

export const store = new MongoJSONStore();
