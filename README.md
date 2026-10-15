# AI-Based Placement Preparation and Readiness Tracking System
**Govt. Engineering College, Ajmer (GECA)**  
**Department of Computer Science & Engineering**  
**Document Ref:** GECA/CSE/2026  
**Candidate:** Ganpat Singh (Roll No: 23IT17)  

---

## 🎯 Project Overview & Synopsis Alignment

Students preparing for on-campus and off-campus placements typically juggle disconnected tools for coding, mock interviews, aptitude, and resume reviews without a clear, objective measure of their preparedness for specific company tiers. 

This platform unifies preparation tracking, analyzes skill gaps with AI, and converts activity into an **actionable, tier-segmented placement readiness score**.

---

## 🚀 Scope Completed (Phase 1, Phase 2, and Phase 3)

### Phase 1: Planning & System Design
- [x] Comprehensive System Architecture & Data Flow Diagram.
- [x] Unified database schema supporting student profiles, DSA logs, aptitude attempts, resume analyses, mock interviews, and readiness scores.
- [x] Responsive glassmorphic UI design system with interactive readiness gauges and rubric visualizations.
- [x] Multi-tier mathematical weighting formulation for Product, Service, and Core/PSU companies.

### Phase 2: Core Development
- [x] **Authentication & Authorization:** Secure JWT token-based auth with `bcryptjs` password hashing and protected API routes.
- [x] **Student Profile Management:** Tracks CGPA, semester, college, target role, technical skills, and target company tier.
- [x] **DSA Practice Tracker:** Filterable problem catalog (by topic, difficulty, and completion) with LeetCode/GFG links, time tracking, algorithm notes, and progress analytics.
- [x] **Aptitude Assessment Engine:** Timed test runner across 4 categories (Quantitative, Logical, Verbal, Core CS) with auto-evaluation, countdown timer, question palette, and detailed conceptual explanations.
- [x] **Zero-Config Database Layer:** Integrated persistent JSON store with MongoDB compatibility, ensuring 100% reliability both online and offline.

### Phase 3: AI Module Development
- [x] **AI ATS Resume Analyzer:**
  - In-memory PDF parsing (`pdf-parse`) and direct text analysis.
  - Job Description (JD) keyword match & gap analysis.
  - 5-Dimension ATS score calculation (Skills, Impact Metrics, Formatting, Depth, Contact).
  - Actionable feedback generator applying the Google XYZ formula.
- [x] **Adaptive AI Mock Interview Engine:**
  - Tier-segmented technical rounds (Tier-1 Product, Tier-2 Service, Tier-3 Core/PSU).
  - Web Speech API integration for speech synthesis (spoken questions).
  - Adaptive follow-up questioning based on student responses.
  - 4-Parameter Rubric Evaluation: Technical Accuracy (0-10), Problem Solving (0-10), Communication (0-10), and Completeness.
- [x] **AI Readiness Scoring Engine:**
  - Multi-factor weighted formula combining DSA, Aptitude, Resume, and Interview.
  - Tier-segmented benchmarks (Product: 78%, Service: 68%, Core: 70%).
  - Bottleneck detection and personalized prioritized action roadmap.
  - Official printable college **Readiness Dossier** for TPO cell verification.

---

## 🛠️ Technology Stack

- **Frontend:** React.js 19, Vite, Lucide Icons, Modern CSS Variables & Glassmorphism.
- **Backend:** Node.js, Express.js (ES Modules).
- **Security & Data:** JWT (`jsonwebtoken`), `bcryptjs`, `multer`, `pdf-parse`.
- **Database:** Resilient persistent data store with MongoDB Atlas support (`backend/config/store.js`).
- **AI/ML Layer:** Deterministic NLP & Rubric Engine + optional Google Gemini API integration.

---

## 🏃 Quick Start & How to Run

### Option 1: Unified Single-Port Production Mode (Recommended)
Runs both the compiled React frontend and the Express API together on port 5000:
```powershell
cd d:\cg_project
npm run build
npm start
```
*Open application in browser:* **http://localhost:5000**

### Option 2: Live Deployment on Vercel
This project is pre-configured with `vercel.json` and serverless handler `api/index.js`:
1. Push repository to GitHub.
2. In [Vercel Dashboard](https://vercel.com), click **"Add New..."** -> **"Project"** -> Import this repository.
3. Vercel automatically detects `Vite`, builds to `dist/`, and exposes the backend under `/api/*`.
4. Click **Deploy** -> Your full-stack application goes live with a free SSL `.vercel.app` domain!
- For detailed deployment steps, see: [`docs/VERCEL_DEPLOYMENT_GUIDE.md`](file:///d:/cg_project/docs/VERCEL_DEPLOYMENT_GUIDE.md)

### Option 3: Local Development Mode (Hot-Reload)
```powershell
cd d:\cg_project
npm run dev
```
*Frontend runs at:* `http://localhost:3000`

---

## 🔑 Demo Account Credentials

For instant faculty evaluation, use the one-click demo login on the sign-in screen:
- **Email:** `ganpat.singh@ecajmer.ac.in`
- **Password:** `password123`
- *Or click:* **⚡ Instant Demo Login (Ganpat Singh - 23IT17)** on the login screen!

---

## 📚 Technical Documentation

- Vercel Deployment Guide: [`docs/VERCEL_DEPLOYMENT_GUIDE.md`](file:///d:/cg_project/docs/VERCEL_DEPLOYMENT_GUIDE.md)
- Architecture & Math Specs: [`docs/PHASE1_TO_3_SYSTEM_ARCHITECTURE.md`](file:///d:/cg_project/docs/PHASE1_TO_3_SYSTEM_ARCHITECTURE.md)
- Faculty Mentor & Viva Voce Guide: [`docs/TEACHER_VIVA_AND_TECHNICAL_GUIDE.md`](file:///d:/cg_project/docs/TEACHER_VIVA_AND_TECHNICAL_GUIDE.md)

