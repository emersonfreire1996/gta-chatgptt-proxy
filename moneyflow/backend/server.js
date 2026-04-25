const express = require('express');
const cors = require('cors');
const path = require('path');
const { PORT, NODE_ENV, CORS_ORIGIN } = require('./config/constants');
const logger = require('./utils/logger');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Security headers (helmet-lite)
app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader('X-DNS-Prefetch-Control', 'off');
  next();
});

app.use(cors({ origin: CORS_ORIGIN, credentials: false }));
app.use(express.json({ limit: '1mb' }));

app.use((req, _res, next) => { logger.info(req.method, req.url); next(); });

app.get('/api/health', (_req, res) => res.json({ ok: true, env: NODE_ENV, ts: Date.now() }));
app.use('/api/auth',  require('./routes/auth'));
app.use('/api/gains', require('./routes/gains'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/goals', require('./routes/goals'));
app.use('/api/stats', require('./routes/stats'));

// Serve frontend statically (optional)
app.use('/', express.static(path.join(__dirname, '..', 'frontend')));

app.use((req, _res, next) => next({ status: 404, code: 'NOT_FOUND', message: `Route ${req.url} not found` }));
app.use(errorHandler);

app.listen(PORT, () => {
  logger.ok(`MoneyFlow API listening on http://localhost:${PORT}  (${NODE_ENV})`);
  logger.info(`CORS origin: ${CORS_ORIGIN}`);
  logger.info(`Demo: demo@moneyflow.io / Demo1234`);
});
