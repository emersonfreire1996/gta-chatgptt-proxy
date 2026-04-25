const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { readDB, writeDB, uid } = require('../utils/db');
const { JWT_SECRET, JWT_EXPIRES_IN, BCRYPT_ROUNDS, RATE_LIMIT } = require('../config/constants');
const validateMw = require('../middleware/validate');
const auth = require('../middleware/auth');

// In-memory rate limiter for /auth (simple; per-IP)
const hits = new Map();
function rateLimit(req, res, next) {
  const ip = req.ip || req.connection?.remoteAddress || 'unknown';
  const now = Date.now();
  const arr = (hits.get(ip) || []).filter(t => now - t < RATE_LIMIT.windowMs);
  arr.push(now);
  hits.set(ip, arr);
  if (arr.length > RATE_LIMIT.max) return next({ status: 429, code: 'RATE_LIMIT', message: 'Too many requests' });
  next();
}

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const pwRe = /^(?=.*\d).{8,}$/;
const stripPw = (u) => { const { passwordHash, ...rest } = u; return rest; };

router.post('/register',
  rateLimit,
  validateMw({
    email: { type:'string', required:true, regex: emailRe },
    password: { type:'string', required:true, regex: pwRe, message:'8+ chars with 1 digit' },
    name: { type:'string', required:true, min: 2 },
  }),
  async (req, res, next) => {
    try {
      const db = readDB();
      const { email, password, name } = req.body;
      if (db.users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
        return next({ status: 409, code: 'EMAIL_EXISTS', message: 'Email already registered' });
      }
      const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
      const user = { id: uid(), email, name, plan: 'free', passwordHash, createdAt: new Date().toISOString() };
      db.users.push(user);
      await writeDB(db);
      const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
      res.status(201).json({ token, user: stripPw(user) });
    } catch (e) { next(e); }
  }
);

router.post('/login',
  rateLimit,
  validateMw({
    email: { type:'string', required:true },
    password: { type:'string', required:true },
  }),
  async (req, res, next) => {
    try {
      const db = readDB();
      const { email, password } = req.body;
      const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
      // timing-safe-ish: always compare
      const hash = user ? user.passwordHash : '$2a$10$invalidinvalidinvalidinvalidinvalidinvalidinvalidinvalid';
      const ok = await bcrypt.compare(password, hash);
      if (!user || !ok) return next({ status: 401, code: 'INVALID_CREDS', message: 'Invalid email or password' });
      const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
      res.json({ token, user: stripPw(user) });
    } catch (e) { next(e); }
  }
);

router.get('/me', auth, (req, res, next) => {
  try {
    const db = readDB();
    const user = db.users.find(u => u.id === req.user.id);
    if (!user) return next({ status: 404, code: 'USER_NOT_FOUND', message: 'User not found' });
    res.json({ user: stripPw(user) });
  } catch (e) { next(e); }
});

module.exports = router;
