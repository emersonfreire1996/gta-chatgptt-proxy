require('dotenv').config();

module.exports = {
  PORT: parseInt(process.env.PORT, 10) || 3001,
  NODE_ENV: process.env.NODE_ENV || 'development',
  JWT_SECRET: process.env.JWT_SECRET || 'dev-secret-change-me',
  JWT_EXPIRES_IN: '7d',
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5500',
  BCRYPT_ROUNDS: 10,
  RATE_LIMIT: { windowMs: 60_000, max: 10 },
  SOURCES: ['freelance','affiliation','dropshipping','crypto','investissement','contenu','coaching','autre'],
  TASK_STATUS: ['pending','in_progress','completed'],
  TASK_PRIORITY: ['urgent','normal','low'],
  GOAL_PERIOD: ['daily','weekly','monthly','yearly'],
};
