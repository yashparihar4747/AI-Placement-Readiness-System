// Comprehensive Seeder for 30 Students, 2 TPOs, Drives, Shortlists, Audit Logs, and Historical Activity
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function generateFullSeedData() {
  const salt = bcrypt.genSaltSync(10);
  const passwordHash = bcrypt.hashSync('Demo@1234', salt);
  const legacyPasswordHash = bcrypt.hashSync('password123', salt);

  // 1. TPO Accounts
  const users = [
    {
      id: "admin_tpo_rk_sharma",
      name: "Dr. R. K. Sharma",
      email: "tpo@geca.demo",
      password: passwordHash,
      role: "admin",
      department: "Training & Placement Cell",
      designation: "Head TPO & Professor",
      phone: "+91 98290 12345",
      createdAt: new Date(Date.now() - 120 * 86400000).toISOString()
    },
    {
      id: "admin_tpo_anita_joshi",
      name: "Mrs. Anita Joshi",
      email: "tpo2@geca.demo",
      password: passwordHash,
      role: "admin",
      department: "Training & Placement Cell",
      designation: "Training Officer",
      phone: "+91 98290 54321",
      createdAt: new Date(Date.now() - 90 * 86400000).toISOString()
    },
    // Also include the legacy tpo account to maintain compatibility
    {
      id: "admin_tpo_geca",
      name: "TPO Placement Cell",
      email: "tpo@ecajmer.ac.in",
      password: passwordHash,
      role: "admin",
      createdAt: new Date(Date.now() - 100 * 86400000).toISOString()
    }
  ];

  // 2. Eight Hero Students
  const heroStudentsConfig = [
    {
      id: "user_ganpat_23it17",
      name: "Ganpat Singh",
      email: "ganpat@geca.demo",
      aliasEmail: "ganpat.singh@ecajmer.ac.in",
      rollNo: "23IT17",
      branch: "CSE",
      batch: "2027",
      semester: 7,
      cgpa: 8.8,
      targetTier: "tier1",
      targetRole: "Full Stack SDE / Systems Engineer",
      solvedCount: 55,
      readinessScore: 82,
      lastActiveDaysAgo: 1,
      story: "Top performer, ~82 product-based, 55+ DSA solved, strong history",
      status: "active"
    },
    {
      id: "user_ronak_23it50",
      name: "Ronak Singh Rawat",
      email: "ronak@geca.demo",
      aliasEmail: "ronak.rawat@ecajmer.ac.in",
      rollNo: "23IT50",
      branch: "IT",
      batch: "2027",
      semester: 7,
      cgpa: 8.1,
      targetTier: "tier2",
      targetRole: "Software Engineer",
      solvedCount: 35,
      readinessScore: 70,
      lastActiveDaysAgo: 2,
      story: "Balanced, service-based ready (~70)",
      status: "active"
    },
    {
      id: "user_jagdish_23it23",
      name: "Jagdish Singh Rawat",
      email: "jagdish@geca.demo",
      aliasEmail: "jagdish.rawat@ecajmer.ac.in",
      rollNo: "23IT23",
      branch: "IT",
      batch: "2027",
      semester: 7,
      cgpa: 7.6,
      targetTier: "tier2",
      targetRole: "Backend Developer",
      solvedCount: 28,
      readinessScore: 64,
      lastActiveDaysAgo: 3,
      story: "Weak resume, strong aptitude",
      status: "active"
    },
    {
      id: "user_yash_23it60",
      name: "Yash Parihar",
      email: "yash@geca.demo",
      aliasEmail: "yash.parihar@ecajmer.ac.in",
      rollNo: "23IT60",
      branch: "CSE",
      batch: "2027",
      semester: 7,
      cgpa: 6.8,
      targetTier: "tier1",
      targetRole: "Junior Developer",
      solvedCount: 4,
      readinessScore: 35,
      lastActiveDaysAgo: 1,
      story: "Beginner (~35), best for 'next steps' demo",
      status: "active"
    },
    {
      id: "user_priya_23cs42",
      name: "Priya Meena",
      email: "priya@geca.demo",
      aliasEmail: "priya.sharma@ecajmer.ac.in",
      rollNo: "23EC42",
      branch: "ECE",
      batch: "2027",
      semester: 7,
      cgpa: 8.5,
      targetTier: "tier3",
      targetRole: "Core Embedded & PSU Systems",
      solvedCount: 20,
      readinessScore: 78,
      lastActiveDaysAgo: 2,
      story: "Core/PSU focused, strong aptitude and core subjects",
      status: "active"
    },
    {
      id: "user_neha_23it35",
      name: "Neha Choudhary",
      email: "neha@geca.demo",
      aliasEmail: "neha.c@ecajmer.ac.in",
      rollNo: "23IT35",
      branch: "IT",
      batch: "2027",
      semester: 7,
      cgpa: 7.2,
      targetTier: "tier2",
      targetRole: "Software Engineer",
      solvedCount: 0,
      readinessScore: 0,
      lastActiveDaysAgo: 0,
      story: "Fresh empty account to demo live from zero",
      status: "active"
    },
    {
      id: "user_rahul_23cs55",
      name: "Rahul Verma",
      email: "rahul@geca.demo",
      aliasEmail: "rahul.m@ecajmer.ac.in",
      rollNo: "23EE55",
      branch: "EE",
      batch: "2027",
      semester: 7,
      cgpa: 6.4,
      targetTier: "tier2",
      targetRole: "Associate Software Engineer",
      solvedCount: 18,
      readinessScore: 38,
      lastActiveDaysAgo: 20,
      story: "Inactive 20 days, appears in TPO 'at-risk' list",
      status: "at_risk"
    },
    {
      id: "user_sneha_23cs71",
      name: "Sneha Gupta",
      email: "sneha@geca.demo",
      aliasEmail: "sneha.g@ecajmer.ac.in",
      rollNo: "23CS71",
      branch: "CSE",
      batch: "2027",
      semester: 7,
      cgpa: 9.1,
      targetTier: "tier1",
      targetRole: "Product Engineer",
      solvedCount: 42,
      readinessScore: 84,
      lastActiveDaysAgo: 1,
      story: "Rapidly improving, steep trend chart",
      status: "active"
    }
  ];

  // 3. Twenty-two Additional Students (30 Total Students)
  const remainingStudents = [];
  const branchList = ["CSE", "IT", "ECE", "EE", "ME"];
  const names = [
    "Aarav Sharma", "Ananya Verma", "Aditya Patel", "Bhavya Joshi",
    "Chirag Mehta", "Divya Nair", "Farhan Khan", "Gaurav Saini",
    "Harshita Rathore", "Ishaan Malhotra", "Kavya Choudhary", "Lakshay Sen",
    "Manish Bhati", "Nikhil Jangid", "Pooja Shekhawat", "Rishabh Solanki",
    "Sakshi Kumawat", "Tarun Godara", "Utkarsh Khandelwal", "Varun Vyas",
    "Yashwant Meena", "Zoya Ansari"
  ];

  for (let i = 1; i <= 22; i++) {
    const num = String(i).padStart(2, '0');
    const b = branchList[(i - 1) % branchList.length];
    const cg = Number((6.2 + (i * 0.14) % 3.2).toFixed(2));
    const score = Math.min(94, Math.max(38, Math.round(42 + (i * 2.4))));
    const solved = Math.min(50, Math.max(6, Math.round(i * 2)));

    remainingStudents.push({
      id: `user_student_${num}`,
      name: names[i - 1] || `Student ${num}`,
      email: `student${num}@geca.demo`,
      rollNo: `23${b.slice(0, 2)}${String(10 + i)}`,
      branch: b,
      batch: "2027",
      semester: 7,
      cgpa: cg,
      targetTier: score >= 78 ? "tier1" : score >= 65 ? "tier2" : "tier3",
      targetRole: b === "ME" || b === "EE" ? "Core Systems Engineer" : "Full Stack SDE",
      solvedCount: solved,
      readinessScore: score,
      lastActiveDaysAgo: (i % 6) + 1,
      status: score < 42 || i === 14 ? "at_risk" : "active"
    });
  }

  const allStudentConfigs = [...heroStudentsConfig, ...remainingStudents];

  // Build users and profiles
  const profiles = [];
  for (const st of allStudentConfigs) {
    users.push({
      id: st.id,
      name: st.name,
      email: st.email,
      password: passwordHash,
      role: "student",
      createdAt: new Date(Date.now() - 90 * 86400000).toISOString()
    });

    if (st.aliasEmail) {
      users.push({
        id: `alias_${st.id}`,
        name: st.name,
        email: st.aliasEmail,
        password: passwordHash,
        role: "student",
        createdAt: new Date(Date.now() - 90 * 86400000).toISOString()
      });
    }

    profiles.push({
      id: `prof_${st.id}`,
      userId: st.id,
      name: st.name,
      email: st.email,
      rollNo: st.rollNo,
      college: "Govt. Engineering College, Ajmer",
      branch: st.branch,
      batch: st.batch,
      semester: st.semester,
      cgpa: st.cgpa,
      targetTier: st.targetTier,
      targetRole: st.targetRole,
      readinessScore: st.readinessScore,
      readinessStatus: st.readinessScore >= 75 ? "Placement Ready" : st.readinessScore >= 60 ? "Developing" : "Needs Work",
      skills: ["Data Structures", "Algorithms", "React.js", "Node.js", "SQL", "Git", "Problem Solving"],
      status: st.status,
      lastActiveAt: new Date(Date.now() - st.lastActiveDaysAgo * 86400000).toISOString(),
      updatedAt: new Date().toISOString()
    });
  }

  // 4. DSA Tracker Entries for Students
  const dsaProblemsJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'dsaProblems.json'), 'utf8'));
  const dsaEntries = [];

  for (const st of allStudentConfigs) {
    if (st.solvedCount === 0) continue; // Neha starts with 0
    const countToSolve = Math.min(st.solvedCount, dsaProblemsJson.length);
    for (let j = 0; j < countToSolve; j++) {
      const p = dsaProblemsJson[j];
      dsaEntries.push({
        id: `dsa_${st.id}_${j + 1}`,
        userId: st.id,
        problemId: p.id,
        title: p.title,
        topic: p.topic,
        difficulty: p.difficulty,
        platform: "LeetCode",
        url: p.practiceLink,
        completed: true,
        notes: `Optimized in ${p.optimalComplexity.time} using approach: ${p.approachHint.slice(0, 60)}...`,
        timeSpentMin: p.difficulty === "Easy" ? 15 : p.difficulty === "Medium" ? 30 : 45,
        completedAt: new Date(Date.now() - (60 - Math.min(59, j)) * 86400000).toISOString(),
        createdAt: new Date(Date.now() - (60 - Math.min(59, j)) * 86400000).toISOString()
      });
    }
  }

  // 5. Test Attempts
  const testAttempts = [];
  const aptitudeResults = [];
  const testsJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'tests.json'), 'utf8'));

  for (const st of allStudentConfigs) {
    if (st.solvedCount === 0) continue; // Neha has 0 attempts
    const numTests = st.readinessScore > 75 ? 8 : st.readinessScore > 50 ? 5 : 2;

    for (let k = 0; k < numTests; k++) {
      const t = testsJson[k % testsJson.length];
      const scorePct = Math.min(100, Math.max(30, Math.round(st.readinessScore + (k % 3 === 0 ? 5 : -4))));
      const correct = Math.round((scorePct / 100) * t.questionCount);
      const wrong = t.questionCount - correct;
      const tabSwitches = st.status === "at_risk" ? 4 : k === 1 ? 1 : 0;

      const attemptRecord = {
        id: `att_${st.id}_${k + 1}`,
        userId: st.id,
        testId: t.id,
        testTitle: t.title,
        category: t.category,
        totalQuestions: t.questionCount,
        correctCount: correct,
        wrongCount: wrong,
        scorePercentage: scorePct,
        tabSwitchCount: tabSwitches,
        timeTakenSeconds: (t.durationMinutes * 60) - 120,
        completedAt: new Date(Date.now() - (numTests - k) * 7 * 86400000).toISOString()
      };
      testAttempts.push(attemptRecord);

      // Mirror into aptitude_results for backward compatibility
      aptitudeResults.push({
        id: `apt_${st.id}_${k + 1}`,
        userId: st.id,
        category: t.subtopic?.toLowerCase() || 'quantitative',
        totalQuestions: t.questionCount,
        correctCount: correct,
        scorePercentage: scorePct,
        timeTakenSeconds: (t.durationMinutes * 60) - 120,
        completedAt: attemptRecord.completedAt
      });
    }
  }

  // 6. Resume Analyses
  const resumeAnalyses = [];
  for (const st of allStudentConfigs) {
    if (st.solvedCount === 0) continue;
    const baseAts = st.id === "user_jagdish_23it23" ? 54 : Math.min(95, Math.max(45, st.readinessScore + 2));

    // Version 1 (30 days ago)
    resumeAnalyses.push({
      id: `res_${st.id}_v1`,
      userId: st.id,
      fileName: `${st.name.replace(/\s+/g, '_')}_Resume_v1.pdf`,
      targetRole: st.targetRole,
      atsScore: Math.max(35, baseAts - 12),
      matchScore: Math.max(40, baseAts - 10),
      breakdown: { skillsMatch: baseAts - 10, impactAndMetrics: 50, formatting: 75, experienceDepth: 60, contactAndEducation: 90 },
      matchedKeywords: ["JavaScript", "HTML", "CSS", "Git", "C++"],
      missingKeywords: ["Docker", "CI/CD", "Redis", "Unit Testing", "Microservices"],
      strengths: ["Clear education hierarchy", "Good academic standing"],
      improvements: ["Add quantifiable metrics to project bullets", "Include cloud platforms and REST API documentation"],
      analyzedAt: new Date(Date.now() - 30 * 86400000).toISOString()
    });

    // Version 2 (Recent)
    resumeAnalyses.push({
      id: `res_${st.id}_v2`,
      userId: st.id,
      fileName: `${st.name.replace(/\s+/g, '_')}_Resume_Final.pdf`,
      targetRole: st.targetRole,
      atsScore: baseAts,
      matchScore: baseAts + 4,
      breakdown: { skillsMatch: baseAts + 5, impactAndMetrics: baseAts - 5, formatting: 90, experienceDepth: baseAts, contactAndEducation: 95 },
      matchedKeywords: ["React.js", "Node.js", "Express", "MongoDB", "Data Structures", "REST APIs", "Git", "Docker"],
      missingKeywords: ["Kubernetes", "AWS Lambda"],
      strengths: ["Strong MERN stack competencies", "Measurable project outcomes using Google XYZ formula", "Verified GitHub repository links"],
      improvements: ["Elaborate on database indexing and caching tradeoffs"],
      analyzedAt: new Date(Date.now() - 5 * 86400000).toISOString()
    });
  }

  // 7. Mock Interviews
  const mockInterviews = [];
  for (const st of allStudentConfigs) {
    if (st.solvedCount === 0) continue;
    const intScore = Math.min(94, Math.max(40, st.readinessScore));

    mockInterviews.push({
      id: `mock_${st.id}_01`,
      userId: st.id,
      role: st.targetRole,
      tier: st.targetTier,
      tierName: st.targetTier === "tier1" ? "Product-Based Companies" : st.targetTier === "tier2" ? "Service-Based Companies" : "Core / PSU",
      overallScore: intScore,
      rubric: {
        technicalAccuracy: Number((intScore / 10).toFixed(1)),
        problemSolving: Number((intScore / 10 - 0.4).toFixed(1)),
        communication: Number((intScore / 10 + 0.2).toFixed(1)),
        systemThinking: Number((intScore / 10 - 0.2).toFixed(1))
      },
      questionsAnswered: 3,
      feedback: "Strong architectural explanation of asynchronous execution and caching patterns. Can improve on explaining space complexity for recursive algorithms.",
      transcript: [
        { q: "Explain how you would design an LRU Cache in O(1) time.", a: "I would combine a Hash Map with a Doubly Linked List for constant time lookups and constant time node repositioning." },
        { q: "What happens when a cache miss occurs?", a: "The data is fetched from the primary datastore, a new node is created at the head of the DLL, and the key-node pointer is stored in the map. If capacity is exceeded, tail node is evicted." }
      ],
      completedAt: new Date(Date.now() - 10 * 86400000).toISOString()
    });
  }

  // 8. Readiness Scores History
  const readinessScores = [];
  for (const st of allStudentConfigs) {
    const finalScore = st.readinessScore;
    // Generate 4 weekly snapshots + current snapshot for trend charts
    for (let w = 4; w >= 0; w--) {
      const scoreAtWeek = w === 0 ? finalScore : (
        st.id === "user_sneha_23cs71"
          ? Math.max(30, finalScore - (w * 14)) // Steep rising trend
          : Math.max(25, finalScore - (w * 3))
      );

      readinessScores.push({
        id: `ready_${st.id}_w${w}`,
        userId: st.id,
        targetTier: st.targetTier,
        primaryScore: scoreAtWeek,
        status: scoreAtWeek >= 75 ? "Placement Ready" : scoreAtWeek >= 60 ? "Developing" : "Needs Work",
        pillars: {
          dsa: Math.min(100, Math.round((st.solvedCount / 50) * 100)),
          aptitude: Math.min(100, scoreAtWeek + 2),
          resume: st.id === "user_jagdish_23it23" ? 54 : Math.min(100, scoreAtWeek + 4),
          interview: scoreAtWeek
        },
        calculatedAt: new Date(Date.now() - (w * 7 * 86400000)).toISOString()
      });
    }
  }

  // 9. Drives Management (4 Companies: Product, Service x2, Core/PSU)
  const drives = [
    {
      id: "drive_amazon_2026",
      companyName: "Amazon",
      tier: "tier1",
      role: "Software Development Engineer - I (SDE-1)",
      packageRange: "₹28 - 44 LPA",
      driveDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      status: "Upcoming",
      criteria: {
        minCGPA: 7.5,
        minReadinessScore: 78,
        allowedBranches: ["CSE", "IT", "ECE"],
        noBacklogs: true
      },
      applicants: [
        { studentId: "user_ganpat_23it17", stage: "Applied", appliedAt: new Date().toISOString() },
        { studentId: "user_sneha_23cs71", stage: "Applied", appliedAt: new Date().toISOString() }
      ],
      createdAt: new Date(Date.now() - 10 * 86400000).toISOString()
    },
    {
      id: "drive_tcs_digital_2026",
      companyName: "TCS Digital",
      tier: "tier2",
      role: "Digital Cadre Software Engineer",
      packageRange: "₹7.5 - 9.0 LPA",
      driveDate: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
      status: "Ongoing",
      criteria: {
        minCGPA: 6.5,
        minReadinessScore: 65,
        allowedBranches: ["CSE", "IT", "ECE", "EE", "ME"],
        noBacklogs: true
      },
      applicants: [
        { studentId: "user_ronak_23it50", stage: "Interview", appliedAt: new Date(Date.now() - 5 * 86400000).toISOString() },
        { studentId: "user_jagdish_23it23", stage: "Test", appliedAt: new Date(Date.now() - 5 * 86400000).toISOString() }
      ],
      createdAt: new Date(Date.now() - 15 * 86400000).toISOString()
    },
    {
      id: "drive_infosys_dse_2026",
      companyName: "Infosys DSE",
      tier: "tier2",
      role: "Specialist Programmer / DSE",
      packageRange: "₹6.5 - 9.5 LPA",
      driveDate: new Date(Date.now() + 25 * 86400000).toISOString().split('T')[0],
      status: "Upcoming",
      criteria: {
        minCGPA: 6.0,
        minReadinessScore: 62,
        allowedBranches: ["CSE", "IT", "ECE"],
        noBacklogs: false
      },
      applicants: [],
      createdAt: new Date(Date.now() - 8 * 86400000).toISOString()
    },
    {
      id: "drive_isro_2026",
      companyName: "ISRO / VSSC",
      tier: "tier3",
      role: "Scientist/Engineer 'SC' (Embedded & Systems)",
      packageRange: "₹10 - 15 LPA (Pay Level 10)",
      driveDate: new Date(Date.now() - 10 * 86400000).toISOString().split('T')[0],
      status: "Completed",
      criteria: {
        minCGPA: 6.84,
        minReadinessScore: 70,
        allowedBranches: ["ECE", "EE", "CSE"],
        noBacklogs: true
      },
      applicants: [
        { studentId: "user_priya_23cs42", stage: "Selected", appliedAt: new Date(Date.now() - 25 * 86400000).toISOString() }
      ],
      createdAt: new Date(Date.now() - 30 * 86400000).toISOString()
    }
  ];

  // 10. Saved Shortlists
  const shortlists = [
    {
      id: "sl_tier1_super30",
      name: "Product-Based Super-30 Shortlist",
      tier: "tier1",
      criteria: { minReadiness: 75, minCGPA: 7.5, branches: ["CSE", "IT"] },
      linkedDriveId: "drive_amazon_2026",
      studentIds: ["user_ganpat_23it17", "user_sneha_23cs71", "user_student_01", "user_student_06"],
      createdAt: new Date(Date.now() - 5 * 86400000).toISOString()
    },
    {
      id: "sl_service_mass",
      name: "TCS Digital Eligible Batch 2027",
      tier: "tier2",
      criteria: { minReadiness: 65, minCGPA: 6.5, branches: ["CSE", "IT", "ECE", "EE"] },
      linkedDriveId: "drive_tcs_digital_2026",
      studentIds: ["user_ganpat_23it17", "user_ronak_23it50", "user_jagdish_23it23", "user_priya_23cs42", "user_sneha_23cs71"],
      createdAt: new Date(Date.now() - 3 * 86400000).toISOString()
    }
  ];

  // 11. Audit Log Entries (10 Initial Actions)
  const auditLogs = [
    { id: "aud_01", adminId: "admin_tpo_rk_sharma", adminName: "Dr. R. K. Sharma", action: "CREATE_DRIVE", target: "drive_amazon_2026", details: "Created campus recruitment drive for Amazon SDE-1", ip: "192.168.1.10", timestamp: new Date(Date.now() - 10 * 86400000).toISOString() },
    { id: "aud_02", adminId: "admin_tpo_rk_sharma", adminName: "Dr. R. K. Sharma", action: "SAVE_SHORTLIST", target: "sl_tier1_super30", details: "Generated Super-30 Shortlist for Tier-1 Product firms", ip: "192.168.1.10", timestamp: new Date(Date.now() - 5 * 86400000).toISOString() },
    { id: "aud_03", adminId: "admin_tpo_anita_joshi", adminName: "Mrs. Anita Joshi", action: "ASSIGN_TEST", target: "test_cs_os", details: "Assigned Operating Systems Fundamentals test to CSE & IT Batch 2027", ip: "192.168.1.12", timestamp: new Date(Date.now() - 4 * 86400000).toISOString() },
    { id: "aud_04", adminId: "admin_tpo_anita_joshi", adminName: "Mrs. Anita Joshi", action: "SEND_NUDGE", target: "user_rahul_23cs55", details: "Sent practice nudge notification to at-risk student Rahul Verma", ip: "192.168.1.12", timestamp: new Date(Date.now() - 3 * 86400000).toISOString() },
    { id: "aud_05", adminId: "admin_tpo_rk_sharma", adminName: "Dr. R. K. Sharma", action: "UPDATE_WEIGHTS", target: "tier1_weights", details: "Verified Tier-1 Product scoring weights (40% DSA, 20% Apt, 15% Res, 25% Int)", ip: "192.168.1.10", timestamp: new Date(Date.now() - 2 * 86400000).toISOString() },
    { id: "aud_06", adminId: "admin_tpo_rk_sharma", adminName: "Dr. R. K. Sharma", action: "EXPORT_REPORT", target: "batch_readiness.csv", details: "Exported Batch 2027 placement readiness summary to CSV", ip: "192.168.1.10", timestamp: new Date(Date.now() - 2 * 86400000).toISOString() },
    { id: "aud_07", adminId: "admin_tpo_anita_joshi", adminName: "Mrs. Anita Joshi", action: "UPDATE_STUDENT", target: "user_yash_23it60", details: "Reviewed career roadmap and approved profile for Yash Parihar", ip: "192.168.1.12", timestamp: new Date(Date.now() - 1 * 86400000).toISOString() },
    { id: "aud_08", adminId: "admin_tpo_rk_sharma", adminName: "Dr. R. K. Sharma", action: "CREATE_DRIVE", target: "drive_tcs_digital_2026", details: "Approved TCS Digital on-campus assessment dates", ip: "192.168.1.10", timestamp: new Date(Date.now() - 1 * 86400000).toISOString() },
    { id: "aud_09", adminId: "admin_tpo_anita_joshi", adminName: "Mrs. Anita Joshi", action: "REPLY_MESSAGE", target: "msg_001", details: "Answered inquiry regarding drive criteria for 2027 batch", ip: "192.168.1.12", timestamp: new Date(Date.now() - 12 * 3600000).toISOString() },
    { id: "aud_10", adminId: "admin_tpo_rk_sharma", adminName: "Dr. R. K. Sharma", action: "SNAPSHOT_RUN", target: "batch_snapshots", details: "Manually triggered weekly batch readiness analytics snapshot", ip: "192.168.1.10", timestamp: new Date(Date.now() - 2 * 3600000).toISOString() }
  ];

  // 12. Contact Messages (6 Messages)
  const contactMessages = [
    { id: "msg_001", name: "Anil Saxena", email: "anil.saxena@tcs.com", message: "Regarding scheduling the TCS Digital technical round on September 15th.", read: true, replied: true, createdAt: new Date(Date.now() - 15 * 86400000).toISOString() },
    { id: "msg_002", name: "Ritu Pareek", email: "ritu.p@geca.ac.in", message: "Can non-CS students register for the Product-Based Mock Interview track?", read: true, replied: true, createdAt: new Date(Date.now() - 12 * 86400000).toISOString() },
    { id: "msg_003", name: "Vikram Chauhan", email: "vikram@techcorp.in", message: "Inquiry on hiring female engineers for our diversity recruitment drive.", read: true, replied: false, createdAt: new Date(Date.now() - 8 * 86400000).toISOString() },
    { id: "msg_004", name: "Deepak Sharma", email: "deepak.23it11@geca.ac.in", message: "My LeetCode solved count did not sync in today's morning cron.", read: false, replied: false, createdAt: new Date(Date.now() - 3 * 86400000).toISOString() },
    { id: "msg_005", name: "Kunal Meena", email: "kunal.23ee04@geca.ac.in", message: "Request to add more Core Electrical PSU test papers in the question bank.", read: false, replied: false, createdAt: new Date(Date.now() - 2 * 86400000).toISOString() },
    { id: "msg_006", name: "Swati Agarwal", email: "hr@atlassian.com", message: "Interested in conducting an exclusive pre-placement talk for CSE/IT students.", read: false, replied: false, createdAt: new Date(Date.now() - 1 * 86400000).toISOString() }
  ];

  // 13. Notifications (Announcements & Targeted Nudges)
  const notifications = [
    { id: "notif_001", target: "all", title: "Upcoming Amazon SDE-1 Recruitment Drive Announced", message: "Amazon will conduct their campus assessment on October 5th. Eligible students please verify your readiness score.", type: "drive", createdAt: new Date(Date.now() - 5 * 86400000).toISOString() },
    { id: "notif_002", target: "CSE,IT", title: "New Test Assigned: Operating Systems Fundamentals", message: "A mandatory 20-question OS test has been assigned to your batch. Complete by Sunday 11:59 PM.", type: "test", createdAt: new Date(Date.now() - 3 * 86400000).toISOString() },
    { id: "notif_003", target: "user_rahul_23cs55", title: "Placement Cell Practice Reminder", message: "You have not attempted any DSA or aptitude practice in the past 14 days. Please complete today's daily quiz to maintain progress.", type: "nudge", createdAt: new Date(Date.now() - 2 * 86400000).toISOString() },
    { id: "notif_004", target: "user_yash_23it60", title: "Recommended Action: Start the 30-Day DSA Sprint", message: "Welcome Yash! We noticed you are starting your prep. Check out the 30-Day DSA Roadmap in your dashboard.", type: "nudge", createdAt: new Date(Date.now() - 1 * 86400000).toISOString() }
  ];

  // 14. Batch Snapshots (for MySQL analytics & trend charts)
  const batchSnapshots = [
    { week: 1, weekDate: "2026-10-01", totalStudents: 30, avgReadiness: 56.4, placementReadyCount: 6, needsWorkCount: 9, dsaAvg: 48, aptAvg: 62, resumeAvg: 60, interviewAvg: 55 },
    { week: 2, weekDate: "2026-10-08", totalStudents: 30, avgReadiness: 61.2, placementReadyCount: 9, needsWorkCount: 7, dsaAvg: 54, aptAvg: 65, resumeAvg: 64, interviewAvg: 61 },
    { week: 3, weekDate: "2026-10-15", totalStudents: 30, avgReadiness: 66.8, placementReadyCount: 13, needsWorkCount: 5, dsaAvg: 62, aptAvg: 69, resumeAvg: 68, interviewAvg: 67 },
    { week: 4, weekDate: "2026-10-22", totalStudents: 30, avgReadiness: 71.5, placementReadyCount: 17, needsWorkCount: 3, dsaAvg: 68, aptAvg: 74, resumeAvg: 72, interviewAvg: 72 }
  ];

  // 15. Default Scoring Weights
  const scoreWeights = {
    tier1: { dsa: 40, aptitude: 20, resume: 15, interview: 25, cutoff: 78 },
    tier2: { dsa: 15, aptitude: 35, resume: 20, interview: 30, cutoff: 68 },
    tier3: { dsa: 10, aptitude: 45, resume: 25, interview: 20, cutoff: 70 },
    thresholds: { needsWork: 40, developing: 60, almostReady: 75, placementReady: 85 },
    version: 1,
    updatedAt: new Date().toISOString()
  };

  return {
    users,
    profiles,
    dsa_problems: dsaEntries,
    aptitude_results: aptitudeResults,
    test_attempts: testAttempts,
    resume_analyses: resumeAnalyses,
    mock_interviews: mockInterviews,
    readiness_scores: readinessScores,
    drives,
    shortlists,
    auditlogs: auditLogs,
    contactmessages: contactMessages,
    notifications,
    batch_snapshots: batchSnapshots,
    score_weights: scoreWeights
  };
}

// Write to JSON for inspection and seed runner
const data = generateFullSeedData();
fs.writeFileSync(path.join(__dirname, 'seedDataExport.json'), JSON.stringify(data, null, 2));
console.log(`✅ Generated Seed Data:`);
console.log(` - Users: ${data.users.length}`);
console.log(` - Profiles: ${data.profiles.length}`);
console.log(` - DSA Problems Logged: ${data.dsa_problems.length}`);
console.log(` - Test Attempts: ${data.test_attempts.length}`);
console.log(` - Resume Analyses: ${data.resume_analyses.length}`);
console.log(` - Mock Interviews: ${data.mock_interviews.length}`);
console.log(` - Readiness Scores: ${data.readiness_scores.length}`);
console.log(` - Drives: ${data.drives.length}`);
console.log(` - Shortlists: ${data.shortlists.length}`);
console.log(` - Audit Logs: ${data.auditlogs.length}`);
console.log(` - Contact Messages: ${data.contactmessages.length}`);
