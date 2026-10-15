import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { initialDSAProblems, initialAptitudeQuestions, defaultStudentProfile } from '../data/seedData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isVercel = Boolean(process.env.VERCEL);
const DB_FILE = isVercel
  ? path.join('/tmp', 'db.json')
  : path.join(__dirname, '..', 'data', 'db.json');

class JSONStore {
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
    this.init();
  }

  init() {
    try {
      const dataDir = path.dirname(DB_FILE);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf8');
        this.data = JSON.parse(raw);
        console.log('📦 [Store] Loaded existing data from store.');
      } else {
        this.seedInitialData();
        this.save();
        console.log('🌱 [Store] Seeded new database store with sample profile and questions.');
      }
    } catch (err) {
      console.warn('⚠️ [Store] File access warning, using in-memory store:', err.message);
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

  save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf8');
    } catch (err) {
      console.warn('⚠️ [Store] File write skipped in serverless environment:', err.message);
    }
  }

  // Model-like collection abstraction
  collection(name) {
    if (!this.data[name]) {
      this.data[name] = [];
    }
    const table = this.data[name];
    const self = this;

    return {
      find: (filter = {}) => {
        return table.filter(item => {
          for (let key in filter) {
            if (item[key] !== filter[key]) return false;
          }
          return true;
        });
      },
      findOne: (filter = {}) => {
        return table.find(item => {
          for (let key in filter) {
            if (item[key] !== filter[key]) return false;
          }
          return true;
        }) || null;
      },
      findById: (id) => {
        return table.find(item => item.id === id) || null;
      },
      create: (data) => {
        const newItem = {
          id: data.id || uuidv4(),
          createdAt: new Date().toISOString(),
          ...data
        };
        table.push(newItem);
        self.save();
        return newItem;
      },
      findByIdAndUpdate: (id, updates) => {
        const index = table.findIndex(item => item.id === id);
        if (index === -1) return null;
        table[index] = { ...table[index], ...updates, updatedAt: new Date().toISOString() };
        self.save();
        return table[index];
      },
      findOneAndUpdate: (filter, updates) => {
        const item = table.find(item => {
          for (let key in filter) {
            if (item[key] !== filter[key]) return false;
          }
          return true;
        });
        if (!item) return null;
        Object.assign(item, updates, { updatedAt: new Date().toISOString() });
        self.save();
        return item;
      },
      findByIdAndDelete: (id) => {
        const index = table.findIndex(item => item.id === id);
        if (index === -1) return null;
        const [deleted] = table.splice(index, 1);
        self.save();
        return deleted;
      },
      deleteMany: (filter = {}) => {
        const initialLen = table.length;
        this.data[name] = table.filter(item => {
          for (let key in filter) {
            if (item[key] === filter[key]) return false;
          }
          return true;
        });
        self.save();
        return { deletedCount: initialLen - this.data[name].length };
      },
      countDocuments: (filter = {}) => {
        return table.filter(item => {
          for (let key in filter) {
            if (item[key] !== filter[key]) return false;
          }
          return true;
        }).length;
      }
    };
  }
}

export const store = new JSONStore();
