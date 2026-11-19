// Enhanced Auth & RBAC Middleware with Mutation Audit Logging
import jwt from 'jsonwebtoken';
import { User } from '../../config/db.js';
import { getMongoDB } from '../../config/db.js';
import { v4 as uuidv4 } from 'uuid';

const JWT_SECRET = process.env.JWT_SECRET || 'geca_placement_secret_key_2026_cse_it';

export const requireAuth = (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);

      const user = User.findById(decoded.id);
      if (!user) {
        return res.status(401).json({ success: false, message: 'Authentication failed: User account not found.' });
      }

      // Normalize role: allow 'tpo_admin' or 'admin' to map to 'admin'
      const normalizedRole = (user.role === 'tpo_admin' || user.role === 'admin') ? 'admin' : 'student';

      req.user = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: normalizedRole,
        originalRole: user.role
      };

      return next();
    } catch (err) {
      console.error('JWT Verification Error:', err.message);
      return res.status(401).json({ success: false, message: 'Not authorized: Token expired or invalid.' });
    }
  }

  return res.status(401).json({ success: false, message: 'Authentication required: No bearer token provided.' });
};

export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access forbidden: ${allowedRoles.join('/')} role required. Your role: '${req.user.role}'.`
      });
    }

    next();
  };
};

// Audit logger for all mutating actions made by TPO/Admin
export const auditLogger = async (req, res, next) => {
  const originalJson = res.json;

  res.json = function (body) {
    // Only log mutating actions that succeeded
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method) && res.statusCode < 400 && req.user && req.user.role === 'admin') {
      try {
        const db = getMongoDB();
        if (db) {
          const actionName = `${req.method}_${req.baseUrl.replace('/api/admin/', '').replace('/', '_').toUpperCase()}`;
          const logEntry = {
            _id: uuidv4(),
            id: `aud_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
            adminId: req.user.id,
            adminName: req.user.name,
            action: actionName,
            target: req.originalUrl,
            details: req.body ? JSON.stringify(req.body).slice(0, 300) : 'No payload',
            ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1',
            timestamp: new Date().toISOString()
          };
          db.collection('auditlogs').insertOne(logEntry).catch(e => console.warn('Audit log write error:', e.message));
        }
      } catch (err) {
        console.warn('Audit logger exception:', err.message);
      }
    }
    return originalJson.call(this, body);
  };

  next();
};

export const generateToken = (userId, role = 'student') => {
  const normalizedRole = (role === 'tpo_admin' || role === 'admin') ? 'admin' : 'student';
  return jwt.sign({ id: userId, role: normalizedRole }, JWT_SECRET, { expiresIn: '30d' });
};
