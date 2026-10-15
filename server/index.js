import app from './app.js';

// Vercel Serverless Function entry point
export default app;

// Standalone runner for local testing (node api/index.js)
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 API server running locally on http://localhost:${PORT}`);
  });
}
