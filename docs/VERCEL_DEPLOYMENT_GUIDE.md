# Complete Vercel Live Deployment Guide
**Project:** AI-Based Placement Preparation and Readiness Tracking System  
**Institution:** Govt. Engineering College, Ajmer (GECA)  
**Candidate:** Ganpat Singh (Roll No: 23IT17)  

---

## 🔍 Understanding & Fixing the "502 Bad Gateway" Error on Vercel

If you previously encountered **`Request failed with status 502`** when calling `/api/...` on Vercel, here is exactly why it happened and how it is now completely fixed:

### Root Causes of 502 on Vercel:
1. **Multiple Sub-lambdas Generated Inside `api/`:**  
   When all backend subfolders (`controllers/`, `routes/`, `services/`) were kept directly inside `api/`, Vercel's Node.js builder attempted to compile **every individual `.js` file** as an independent serverless function. Since routers and controllers do not export an HTTP handler function `(req, res)`, Vercel crashed with `FUNCTION_INVOCATION_FAILED` (502).
2. **Incorrect Rewrite Destination:**  
   Writing `"destination": "/api/index.js"` in `vercel.json` caused Vercel to look for a static file named `/api/index.js` instead of invoking the serverless function mapped to `/api`.

### The Solution:
- All backend application code, controllers, data, and routes are now cleanly organized in [`server/`](file:///d:/cg_project/server/).
- The [`api/`](file:///d:/cg_project/api/) directory contains **ONLY ONE FILE:** [`api/index.js`](file:///d:/cg_project/api/index.js), which exports a single, clean request handler `export default function handler(req, res) { return app(req, res); }`.
- `vercel.json` maps `"source": "/api/(.*)"` directly to `"destination": "/api"`.
- The Express app mounts a master router on **both `/api` and `/`**, so regardless of how Vercel routes the URL path, all endpoints match instantly!

---

## 🌟 How the Unified Full-Stack Architecture Works on Vercel

```
d:\cg_project/
├── api/                  # ⚡ Vercel Serverless Function (ONLY index.js)
│   └── index.js          # Clean serverless handler forwarding to server/app.js
├── server/               # 🚀 Full Backend Application Logic
│   ├── app.js            # Express app with dual routing (/api/* and /*)
│   ├── config/           # Database layer with Vercel /tmp + Atlas support
│   ├── controllers/      # Auth, Profile, DSA, Aptitude, Resume, Interview, Scoring
│   ├── services/         # ATS Parser, Rubric Evaluator, Scoring Engine
│   └── data/             # Benchmark seeds & questions
├── src/                  # ⚛️ React 19 Frontend source code
├── dist/                 # Production compiled static build
├── index.html            # SPA Entry HTML
├── vite.config.js        # Vite configuration with /api proxy
├── vercel.json           # Vercel serverless function & routing rules
├── server.js             # Standalone production runner (Node.js fallback)
└── package.json          # Unified dependencies & scripts
```

---

## 🚀 How to Deploy to Vercel (Step-by-Step)

### Step 1: Commit and Push to GitHub
Open your terminal in `d:\cg_project`:
```bash
git init
git add .
git commit -m "Fix Vercel 502: Unified single serverless lambda with clean server module"
```

Create a new repository on [GitHub](https://github.com/new) (e.g., `ai-placement-readiness-geca`), then link and push:
```bash
git remote add origin https://github.com/YOUR_USERNAME/ai-placement-readiness-geca.git
git branch -M main
git push -u origin main
```

### Step 2: Import into Vercel
1. Log in to [vercel.com](https://vercel.com) (or sign in with your GitHub account).
2. Click **"Add New..."** ➔ **"Project"**.
3. Under "Import Git Repository", select your repository (`ai-placement-readiness-geca`).
4. Vercel will automatically detect:
   - **Framework Preset:** `Vite`
   - **Root Directory:** `./`
   - **Build Command:** `vite build`
   - **Output Directory:** `dist`
5. *(Optional)* Add Environment Variables under the **Environment Variables** tab:
   - `JWT_SECRET`: `geca_placement_secret_key_2026_cse_it`
   - `GEMINI_API_KEY`: *(Optional, your Google Gemini API key)*
   - `MONGODB_URI`: *(Optional, your MongoDB Atlas connection string)*
6. Click **"Deploy"**!

Within ~45 seconds, your deployment will succeed without any 502 errors!

---

## 🧪 Testing the Unified System Locally

### Single-Port Production Mode (Port 5000)
Runs both the compiled React frontend and the Express API together:
```bash
npm run build
npm start
```
- Open browser: `http://localhost:5000`
- Both the frontend UI and API (`/api/health`, `/api/auth/login`, etc.) run on the same port!

### Development Mode (Hot-Reload on Port 3000)
```bash
npm run dev
```
- Open browser: `http://localhost:3000`

---

## 🔑 Examiner & Teacher Demo Verification

Once your Vercel link is live:
1. Open your live Vercel URL.
2. Click **"⚡ Instant Demo Login (Ganpat Singh - 23IT17)"**.
3. All features work immediately:
   - Real-time AI Readiness Score & Tier Switcher
   - DSA Practice tracker & filters
   - Timed Aptitude tests with conceptual explanations
   - Resume ATS parser with drag-and-drop & JD matching
   - Spoken AI Mock Interview with Web Speech synthesis
   - Official Printable College Readiness Dossier
