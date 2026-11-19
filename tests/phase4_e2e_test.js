import http from 'http';

function post(url, data, token = null) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const body = JSON.stringify(data);
    const headers = {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(body)
    };
    if (token) headers['Authorization'] = 'Bearer ' + token;
    const req = http.request({
      hostname: u.hostname,
      port: u.port,
      path: u.pathname,
      method: 'POST',
      headers
    }, res => {
      let d = '';
      res.on('data', chunk => d += chunk);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(d) }); }
        catch (e) { resolve({ status: res.statusCode, body: d }); }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

function get(url, token = null) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const headers = {};
    if (token) headers['Authorization'] = 'Bearer ' + token;
    const req = http.request({
      hostname: u.hostname,
      port: u.port,
      path: u.pathname + (u.search || ''),
      method: 'GET',
      headers
    }, res => {
      let d = '';
      res.on('data', chunk => d += chunk);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(d) }); }
        catch (e) { resolve({ status: res.statusCode, body: d }); }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

const BASE_URL = 'http://localhost:5000';

async function runTestSuite() {
  console.log('=================================================================');
  console.log('  RUNNING PHASE 4: TPO PORTAL & SEEDED DATA COMPREHENSIVE E2E VERIFICATION');
  console.log('=================================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ [PASS] ${message}`);
      passed++;
    } else {
      console.error(`  ❌ [FAIL] ${message}`);
      failed++;
    }
  }

  // 1. TPO and Student Logins
  console.log('--- 1. Testing Unified Authentication & Role Resolution ---');
  const tpoAuth = await post(`${BASE_URL}/api/auth/login`, { email: 'tpo@geca.demo', password: 'Demo@1234' });
  assert(tpoAuth.status === 200 && tpoAuth.body.user?.role === 'admin', 'Head TPO (tpo@geca.demo) logs in with role: admin');

  const tpo2Auth = await post(`${BASE_URL}/api/auth/login`, { email: 'tpo2@geca.demo', password: 'Demo@1234' });
  assert(tpo2Auth.status === 200 && tpo2Auth.body.user?.role === 'admin', 'Training Officer (tpo2@geca.demo) logs in with role: admin');

  const ganpatAuth = await post(`${BASE_URL}/api/auth/login`, { email: 'ganpat@geca.demo', password: 'Demo@1234' });
  assert(ganpatAuth.status === 200 && ganpatAuth.body.user?.role === 'student', 'Student Ganpat Singh logs in with role: student');

  const tpoToken = tpoAuth.body.token;
  const ganpatToken = ganpatAuth.body.token;

  // 2. RBAC Enforcement Checks
  console.log('\n--- 2. Testing Strict RBAC Enforcement ---');
  const unauthRes = await get(`${BASE_URL}/api/admin/overview`);
  assert(unauthRes.status === 401, 'Unauthenticated request to /api/admin/overview receives 401 Unauthorized');

  const studentAdminRes = await get(`${BASE_URL}/api/admin/overview`, ganpatToken);
  assert(studentAdminRes.status === 403, 'Student token calling /api/admin/overview receives 403 Forbidden');

  const studentAdminStudentsRes = await get(`${BASE_URL}/api/admin/students`, ganpatToken);
  assert(studentAdminStudentsRes.status === 403, 'Student token calling /api/admin/students receives 403 Forbidden');

  const studentAdminWeightsRes = await get(`${BASE_URL}/api/admin/weights`, ganpatToken);
  assert(studentAdminWeightsRes.status === 403, 'Student token calling /api/admin/weights receives 403 Forbidden');

  const tpoAdminRes = await get(`${BASE_URL}/api/admin/overview`, tpoToken);
  assert(tpoAdminRes.status === 200 && tpoAdminRes.body.kpis, 'TPO token calling /api/admin/overview succeeds with 200 OK & KPIs');

  // 3. Seed Content Quantity Benchmarks
  console.log('\n--- 3. Testing Seeded Datasets Scale & Variety ---');
  const qBankRes = await get(`${BASE_URL}/api/admin/questions`, tpoToken);
  assert(qBankRes.status === 200, 'TPO Question Bank endpoint returns 200');
  const totalMCQs = qBankRes.body.total || qBankRes.body.questions?.length || 0;
  assert(totalMCQs >= 400, `Question bank has ≥ 400 original MCQs (found: ${totalMCQs})`);
  assert((qBankRes.body.dsaProblems?.length || 0) >= 60, `DSA practice sheet has ≥ 60 curated problems (found: ${qBankRes.body.dsaProblems?.length})`);
  assert((qBankRes.body.interviewQuestions?.length || 0) >= 150, `Interview bank has ≥ 150 questions (found: ${qBankRes.body.interviewQuestions?.length})`);
  assert((qBankRes.body.tests?.length || 0) >= 15, `Test suites has ≥ 15 suites (found: ${qBankRes.body.tests?.length})`);

  // 4. Hero Student Storylines Verification
  console.log('\n--- 4. Testing Hero Student Storylines & Readiness Index ---');
  const heroes = [
    { email: 'ganpat@geca.demo', expectedMin: 78, label: 'Ganpat Singh (Top Performer)' },
    { email: 'ronak@geca.demo', expectedMin: 65, label: 'Ronak Singh Rawat (Balanced Service)' },
    { email: 'jagdish@geca.demo', expectedMin: 60, label: 'Jagdish Singh Rawat (Strong Aptitude)' },
    { email: 'priya@geca.demo', expectedMin: 75, label: 'Priya Meena (Core / PSU Ready)' },
    { email: 'sneha@geca.demo', expectedMin: 75, label: 'Sneha Gupta (Fast Improving)' }
  ];

  for (const h of heroes) {
    const auth = await post(`${BASE_URL}/api/auth/login`, { email: h.email, password: 'Demo@1234' });
    const dash = await get(`${BASE_URL}/api/student/dashboard`, auth.body.token);
    assert(
      dash.status === 200 && dash.body.readinessScore >= h.expectedMin,
      `${h.label}: Score is ${dash.body.readinessScore}% (Expected >= ${h.expectedMin}%)`
    );
  }

  // 5. DSA Sheet Status Toggle & Auto-Recompute
  console.log('\n--- 5. Testing DSA Status Update & Real-Time Recomputation ---');
  const dsaSheetRes = await get(`${BASE_URL}/api/student/dsa-sheet`, ganpatToken);
  assert(dsaSheetRes.status === 200 && dsaSheetRes.body.problems?.length >= 60, 'Student retrieves complete DSA Sheet with status');

  const testProblem = dsaSheetRes.body.problems[0];
  const toggleRes = await post(`${BASE_URL}/api/student/dsa-sheet/${testProblem.id}/status`, { status: 'Solved' }, ganpatToken);
  assert(toggleRes.status === 200 && toggleRes.body.success, `Student marks problem "${testProblem.title}" as Solved -> auto-logs and updates score`);

  // 6. Test Runner Engine & Proctoring
  console.log('\n--- 6. Testing Test Engine Submission & Tab Switch Proctoring ---');
  const testList = await get(`${BASE_URL}/api/student/tests`, ganpatToken);
  const selectedTest = testList.body.tests[0];
  const testDetail = await get(`${BASE_URL}/api/student/tests/${selectedTest.id}`, ganpatToken);
  assert(testDetail.status === 200 && testDetail.body.questions?.length > 0, `Test details loaded with ${testDetail.body.questions?.length} questions`);

  const answersObj = {};
  const qMap = {};
  (qBankRes.body.questions || []).forEach(q => {
    qMap[q.id] = q.correctAnswer !== undefined ? q.correctAnswer : 0;
  });
  for (const q of testDetail.body.questions) {
    answersObj[q.id] = qMap[q.id] !== undefined ? qMap[q.id] : 0;
  }
  const submitRes = await post(`${BASE_URL}/api/student/tests/${selectedTest.id}/submit`, {
    answers: answersObj,
    tabSwitchCount: 2,
    timeTakenSeconds: 340
  }, ganpatToken);
  assert(submitRes.status === 200 && submitRes.body.result?.scorePercentage >= 50, `Test submitted successfully: Score is ${submitRes.body.result?.scorePercentage}%, tabSwitches: ${submitRes.body.result?.tabSwitchCount}`);

  // 7. TPO Shortlisting Criteria Engine
  console.log('\n--- 7. Testing TPO Shortlisting Criteria Engine ---');
  const shortlistRes = await post(`${BASE_URL}/api/admin/shortlists/build`, {
    minScore: 70,
    minCGPA: 7.0,
    branches: ['Computer Science & Engineering', 'Information Technology'],
    targetTier: 'tier1',
    minDsaSolved: 10,
    noBacklogs: true
  }, tpoToken);
  assert(shortlistRes.status === 200 && shortlistRes.body.students?.length > 0, `Criteria engine filtered ${shortlistRes.body.students?.length} qualified candidates`);

  // 8. TPO Audit Trail
  console.log('\n--- 8. Testing System Audit Trail Logging ---');
  const auditRes = await get(`${BASE_URL}/api/admin/audit`, tpoToken);
  assert(auditRes.status === 200 && auditRes.body.logs?.length > 0, `Audit log returns ${auditRes.body.logs?.length} immutable administrative actions`);

  console.log('\n=================================================================');
  console.log(`  TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('=================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTestSuite().catch(err => {
  console.error('Test Suite Fatal Error:', err);
  process.exit(1);
});
