import app from '../server/app.js';

// Vercel Serverless Function Entry Point
export default function handler(req, res) {
  return app(req, res);
}
