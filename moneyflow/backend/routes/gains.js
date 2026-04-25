const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const validateMw = require('../middleware/validate');
const { readDB, writeDB, uid } = require('../utils/db');
const { SOURCES } = require('../config/constants');

router.use(auth);

router.get('/', (req, res, next) => {
  try {
    const db = readDB();
    const { from, to, source } = req.query;
    let items = db.gains.filter(g => g.userId === req.user.id);
    if (from) items = items.filter(g => g.date >= from);
    if (to) items = items.filter(g => g.date <= to);
    if (source) items = items.filter(g => g.source === source);
    items.sort((a, b) => b.date.localeCompare(a.date));
    res.json({ gains: items });
  } catch (e) { next(e); }
});

router.post('/',
  validateMw({
    source: { type:'enum', enum: SOURCES, required:true },
    amount: { type:'number', required:true, min: 0 },
    date:   { type:'string', required:true, regex: /^\d{4}-\d{2}-\d{2}$/ },
    note:   { type:'string' },
  }),
  async (req, res, next) => {
    try {
      const db = readDB();
      const gain = {
        id: uid(), userId: req.user.id,
        source: req.body.source, amount: req.body.amount,
        date: req.body.date, note: req.body.note || '',
        createdAt: new Date().toISOString(),
      };
      db.gains.push(gain);
      await writeDB(db);
      res.status(201).json({ gain });
    } catch (e) { next(e); }
  }
);

router.put('/:id', async (req, res, next) => {
  try {
    const db = readDB();
    const idx = db.gains.findIndex(g => g.id === req.params.id && g.userId === req.user.id);
    if (idx === -1) return next({ status: 404, code: 'NOT_FOUND', message: 'Gain not found' });
    const allowed = ['source','amount','date','note'];
    for (const k of allowed) if (k in req.body) db.gains[idx][k] = req.body[k];
    await writeDB(db);
    res.json({ gain: db.gains[idx] });
  } catch (e) { next(e); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const db = readDB();
    const idx = db.gains.findIndex(g => g.id === req.params.id && g.userId === req.user.id);
    if (idx === -1) return next({ status: 404, code: 'NOT_FOUND', message: 'Gain not found' });
    const [removed] = db.gains.splice(idx, 1);
    await writeDB(db);
    res.json({ gain: removed });
  } catch (e) { next(e); }
});

module.exports = router;
