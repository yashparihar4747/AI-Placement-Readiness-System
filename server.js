import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import app from './server/app.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 5000;
const distPath = path.join(__dirname, 'dist');

// Serve static frontend files from dist (if built)
app.use(express.static(distPath));

// For any other request, send back React's index.html
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/auth') || req.path.startsWith('/health')) {
    return next();
  }
  res.sendFile(path.join(distPath, 'index.html'), (err) => {
    if (err) {
      res.status(200).send('AI Placement Readiness System API is running. Build frontend with "npm run build".');
    }
  });
});

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 Unified Full-Stack Application Running on PORT ${PORT}`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`📚 Govt. Engineering College, Ajmer - GECA/CSE/2026`);
  console.log(`=======================================================`);
});
