const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const validateMw = require('../middleware/validate');
const { readDB, writeDB, uid } = require('../utils/db');
const { GOAL_PERIOD } = require('../config/constants');

router.use(auth);

router.get('/', (req, res, next) => {
  try {
    const db = readDB();
    const items = db.goals.filter(g => g.userId === req.user.id)
      .sort((a, b) => (b.startDate || '').localeCompare(a.startDate || ''));
    res.json({ goals: items });
  } catch (e) { next(e); }
});

router.post('/',
  validateMw({
    title:        { type:'string', required:true, min: 2 },
    targetAmount: { type:'number', required:true, min: 1 },
    period:       { type:'enum', enum: GOAL_PERIOD, required:true },
    startDate:    { type:'string', required:true, regex: /^\d{4}-\d{2}-\d{2}$/ },
    endDate:      { type:'string', required:true, regex: /^\d{4}-\d{2}-\d{2}$/ },
  }),
  async (req, res, next) => {
    try {
      const db = readDB();
      const goal = {
        id: uid(), userId: req.user.id,
        title: req.body.title, targetAmount: req.body.targetAmount,
        period: req.body.period, startDate: req.body.startDate, endDate: req.body.endDate,
        createdAt: new Date().toISOString(),
      };
      db.goals.push(goal);
      await writeDB(db);
      res.status(201).json({ goal });
    } catch (e) { next(e); }
  }
);

router.put('/:id', async (req, res, next) => {
  try {
    const db = readDB();
    const idx = db.goals.findIndex(g => g.id === req.params.id && g.userId === req.user.id);
    if (idx === -1) return next({ status: 404, code: 'NOT_FOUND', message: 'Goal not found' });
    const allowed = ['title','targetAmount','period','startDate','endDate'];
    for (const k of allowed) if (k in req.body) db.goals[idx][k] = req.body[k];
    await writeDB(db);
    res.json({ goal: db.goals[idx] });
  } catch (e) { next(e); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const db = readDB();
    const idx = db.goals.findIndex(g => g.id === req.params.id && g.userId === req.user.id);
    if (idx === -1) return next({ status: 404, code: 'NOT_FOUND', message: 'Goal not found' });
    const [removed] = db.goals.splice(idx, 1);
    await writeDB(db);
    res.json({ goal: removed });
  } catch (e) { next(e); }
});

module.exports = router;
