# AI-Based Placement Preparation and Readiness Tracking System
**Govt. Engineering College, Ajmer (GECA)**  
**Department of Computer Science & Engineering**  
**Document Ref:** GECA/CSE/2026-2027  
**Candidate:** Ganpat Singh (Roll No: 23IT17)  
**TPO Administration:** Dr. R. K. Sharma (Head TPO) & Mrs. Anita Joshi (Training Officer)

---

## 🎯 Executive Overview & Evaluation Guide

PlacementReady is a production-grade, full-stack enterprise platform that unifies placement preparation tracking, AI-assisted skills-gap diagnostics, and an authoritative **Training & Placement Officer (TPO) Administration Portal**.

The system connects live to **MongoDB Atlas Cloud Database**:
`mongodb+srv://ganpat123:power@cluster0.qr2xvhf.mongodb.net/placement_readiness`

Every single button, chart, and module is fully functional with rich real-world seeded datasets—zero placeholders, zero lorem ipsum, and zero broken links.

---

## 🔑 Unified Login & Demo Credentials

Both students and placement officers authenticate at the single `/login` page:
**URL:** [http://localhost:5000/login](http://localhost:5000/login)

All demo accounts share the uniform password: **`Demo@1234`** (with quick-click auto-fill cards on the login screen).

### 1. TPO Portal Accounts
| Officer Name | Email | Password | Role & Purpose |
| :--- | :--- | :--- | :--- |
| **Dr. R. K. Sharma** | `tpo@geca.demo` | `Demo@1234` | Head TPO — Full CRUD authority across all students, drives, shortlists, and scoring weights |
| **Mrs. Anita Joshi** | `tpo2@geca.demo` | `Demo@1234` | Training Officer — Multi-TPO access and user management |

### 2. Student Hero Storyline Accounts (30 Students Total)
| Student Name | Email | Password | Branch & CGPA | Storyline for Evaluators |
| :--- | :--- | :--- | :--- | :--- |
| **Ganpat Singh** | `ganpat@geca.demo` | `Demo@1234` | IT • 8.8 CGPA | **Top Performer:** ~85% Product Ready, 55+ DSA solved, high mock interview rubric |
| **Ronak Singh Rawat** | `ronak@geca.demo` | `Demo@1234` | CSE • 8.1 CGPA | **Balanced Performer:** ~70% Service-Based Ready (TCS Digital / Infosys DSE) |
| **Jagdish Singh Rawat**| `jagdish@geca.demo` | `Demo@1234` | IT • 7.6 CGPA | **Developing Candidate:** Strong Aptitude, but ATS Resume requires revision (54%) |
| **Yash Parihar** | `yash@geca.demo` | `Demo@1234` | IT • 6.8 CGPA | **Beginner Candidate:** (~35%) Perfect to demo prioritized action roadmaps and study paths |
| **Priya Meena** | `priya@geca.demo` | `Demo@1234` | ECE • 8.5 CGPA | **Core / PSU Focused:** Strong gate & domain concepts (ISRO, BEL, DRDO ready) |
| **Neha Choudhary** | `neha@geca.demo` | `Demo@1234` | IT • 7.2 CGPA | **Fresh Empty Account:** Starts at 0 to demonstrate real-time score progression live |
| **Rahul Verma** | `rahul@geca.demo` | `Demo@1234` | CSE • 7.0 CGPA | **At-Risk Inactive:** Inactive 20+ days; triggers TPO intervention console & nudge |
| **Sneha Gupta** | `sneha@geca.demo` | `Demo@1234` | CSE • 9.1 CGPA | **Rapidly Improving:** Steep rising 4-week growth curve (30% -> 42% -> 56% -> 70% -> 84%) |

*Additional 22 accounts (`student01@geca.demo` to `student22@geca.demo`) span CSE, IT, ECE, EE, and ME branches to populate realistic cohort distribution histograms.*

---

## 🛡️ Role-Based Access Control (RBAC) & Security Matrix

Role enforcement is strictly applied on **both Frontend and Backend**:

| Resource | Student Authority | TPO / Admin Authority |
| :--- | :--- | :--- |
| **Own Profile** | Read, Update | Read, Update, Delete (any student) |
| **Other Students Data** | None | Full CRUD on any student |
| **DSA Practice Sheet** | Read, Set own status (auto-updates score) | Full CRUD on practice catalog |
| **Assessment Tests** | Timed runner, Auto-eval, Read own history | Full CRUD, schedule, view student tab-switches |
| **ATS Resume Analysis** | Upload, scan, view feedback (own) | Read, Delete, View keyword gaps (any) |
| **AI Mock Interview** | Interactive voice/text session (own) | Read full transcripts, delete attempt (any) |
| **Scoring Weights** | Read-only target tier formula | Full CRUD sliders (must equal 100%), recompute all |
| **Recruitment Drives** | View eligible drives, apply | Full CRUD, drag-and-drop pipeline stages, velocity planner |
| **Shortlisting Engine** | Read if shortlisted | Multi-criteria live filter, save shortlist, export CSV |
| **Announcements** | Read notifications, mark as read | Broadcast and targeted notifications composer |
| **Audit Trail** | None | Read-only immutable ledger of all TPO actions |
| **Demo Reseed** | None | 1-Click reset to pristine demo state |

- **Frontend Guards:** `ProtectedRoute` checks verified JWT role. A student attempting to open `/admin/*` is immediately redirected with an access denied alert. A TPO attempting to open `/student/*` is redirected to `/admin/dashboard`.
- **Backend Guards:** `requireAuth` + `requireRole('admin')` protects every `/api/admin/*` endpoint (returns `403 Forbidden` if a student token is provided).
- **Data Scoping:** All `/api/student/*` endpoints strictly query by `req.user.id`.

---

## 🌟 Seeded Dataset Scale

- **69 DSA Problems:** Filterable across 12 topics (Arrays, Strings, LinkedList, Trees, DP, Graphs, Heaps, etc.) with difficulty, time/space complexity, hints, and practice links.
- **439 Original MCQs:** Comprehensive question bank across General Aptitude, Logical Reasoning, Verbal Ability, OS, DBMS, Computer Networks, and Engineering.
- **24 Standardized Test Suites:** Timed tests with proctoring window-switch detection, negative marking (-0.25), and detailed step-by-step explanations.
- **155 Interview Prompts:** Tier-segmented technical and HR interview questions with model answers and rubric criteria.
- **12 Top Company Profiles:** Amazon, Google, Microsoft, TCS Digital, Infosys DSE, Wipro, Accenture, ISRO, DRDO, BEL, Flipkart, Atlassian.
- **4 Comprehensive Roadmaps:** SDE Prep, System Design, Core CS, and HR Interview Guides.

---

## 🖥️ Portals & Features Walkthrough

### 1. TPO Administration Portal (`/admin/*`)
- **Dashboard (`/admin/dashboard`):** Real-time KPI summary (Total Students, Batch Avg Readiness, % Ready, % Needs Work, Active this week, DSA solved, Mock interviews done), interactive Recharts histograms, radar chart, at-risk student intervention panel with "Send Nudge" action, top performers table, and recent activity feed.
- **Students Directory (`/admin/students`):** Filter by branch, target tier, score band, and status. Supports "Add Student", "Bulk CSV Import" with template validation, side-by-side candidate comparison, and row actions (View, Edit, Deactivate, Reset Password, Delete).
- **Student Dossier (`/admin/students/:id`):** Deep-dive tabs into Overview, DSA entries, Tests (with proctoring tab switches), ATS Resumes, Mock Interviews with transcripts, and private TPO Advisory Notes. Deleting any sub-item triggers automatic score recomputation.
- **Analytics & Skills Gap (`/admin/analytics`):** Diagnostic bar charts on topic mastery curves and hardest flagged interview questions for curriculum optimization.
- **Dossiers & Reports (`/admin/reports`):** 1-Click CSV exports for Batch Matrix, Branch Summary, Drive Eligibility, and At-Risk Intervention, plus printable PDF report view and "Run Snapshot Now" button.
- **Shortlisting Criteria Engine (`/admin/shortlisting`):** Multi-slider criteria builder (Min Score, Min CGPA, Branches, Tier, Min DSA, Backlog free). Live count updates instantly. Save shortlist, export CSV, and "Notify Shortlisted Students".
- **Drives Management (`/admin/drives`):** Schedule campus visits, manage applicant stages (Applied -> Test -> Interview -> Selected -> Rejected), and use the **Drive Velocity Planner** to forecast cohort qualification in +2 and +4 weeks.
- **Question Bank & Curriculum (`/admin/questions`):** Manage 439 MCQs, 24 test suites, 69 DSA problems, and 155 interview questions.
- **Scoring Weights (`/admin/weights`):** Calibrate tier weights for Product, Service, and Core/PSU. Clicking "Save & Recompute All Cohort Scores" updates all 35 students' scores in real-time.
- **Audit Log (`/admin/audit`):** Searchable immutable ledger recording all administrative mutations with timestamp and IP address.
- **Settings & Demo Reset (`/admin/settings`):** Institutional configuration and 1-click **Reset Database to Demo State** console.

### 2. Student Portal (`/student/*`)
- **Student Dashboard (`/student/dashboard`):** Readiness Score gauge, 4-pillar progression cards, daily Problem of the Day, 30-day streak tracker, and badge milestones.
- **60+ DSA Sheet (`/student/dsa`):** Curated roadmap with difficulty, hints, complexity reveal, practice links, and live status dropdown (Not Started, Attempted, Solved, Revisit) that immediately recomputes readiness score in MongoDB!
- **Tests Hub (`/student/tests`):** Categorized assessment suites with attempt history and best scores.
- **Test Runner (`/student/tests/:id/run`):** Timed exam runner with live countdown timer, question palette, autosave, and proctoring window-switch detection with warning banner.
- **Test Result (`/student/tests/:id/result`):** Score percentage, accuracy, time taken, proctor switches, and question-by-question review with full explanations.
- **Target Companies (`/student/companies`):** 12 company intelligence cards with "Check My Readiness" modal showing match points and preparation gaps.
- **Learning Resources (`/student/resources`):** Curated study roadmaps for SDE, System Design, and Core CS.
- **ATS Resume Analyzer & AI Mock Interview:** Interactive in-browser PDF resume parser and voice-enabled adaptive interview simulator.

---

## ⚡ Quick Start & Verification

### Start Full-Stack Application
```bash
# Install dependencies
npm install

# Start unified server (Port 5000)
npm start
```
Open **[http://localhost:5000](http://localhost:5000)** in your browser.

### Run Comprehensive E2E Verification Suite
```bash
node tests/phase4_e2e_test.js
```
*(Runs 24 automated assertions covering authentication, RBAC 403 checks, hero student scores, DSA status toggling, test engine grading, proctoring, shortlisting criteria, and audit logging).*

### Reseed Database
```bash
npm run seed:reset
```
*(Wipes and cleanly reseeds all collections on MongoDB Atlas in under 5 seconds).*
