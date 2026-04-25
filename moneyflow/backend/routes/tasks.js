const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const validateMw = require('../middleware/validate');
const { readDB, writeDB, uid } = require('../utils/db');
const { TASK_STATUS, TASK_PRIORITY } = require('../config/constants');

router.use(auth);

router.get('/', (req, res, next) => {
  try {
    const db = readDB();
    const items = db.tasks.filter(t => t.userId === req.user.id)
      .sort((a, b) => (a.dueDate || '').localeCompare(b.dueDate || ''));
    res.json({ tasks: items });
  } catch (e) { next(e); }
});

router.post('/',
  validateMw({
    title:    { type:'string', required:true, min: 2 },
    amount:   { type:'number', required:true, min: 0 },
    status:   { type:'enum', enum: TASK_STATUS, required:true },
    priority: { type:'enum', enum: TASK_PRIORITY, required:true },
    dueDate:  { type:'string', regex: /^\d{4}-\d{2}-\d{2}$/ },
  }),
  async (req, res, next) => {
    try {
      const db = readDB();
      const task = {
        id: uid(), userId: req.user.id,
        title: req.body.title, amount: req.body.amount,
        status: req.body.status, priority: req.body.priority,
        dueDate: req.body.dueDate || null,
        createdAt: new Date().toISOString(),
      };
      db.tasks.push(task);
      await writeDB(db);
      res.status(201).json({ task });
    } catch (e) { next(e); }
  }
);

router.put('/:id', async (req, res, next) => {
  try {
    const db = readDB();
    const idx = db.tasks.findIndex(t => t.id === req.params.id && t.userId === req.user.id);
    if (idx === -1) return next({ status: 404, code: 'NOT_FOUND', message: 'Task not found' });
    const allowed = ['title','amount','status','priority','dueDate'];
    for (const k of allowed) if (k in req.body) db.tasks[idx][k] = req.body[k];
    await writeDB(db);
    res.json({ task: db.tasks[idx] });
  } catch (e) { next(e); }
});

router.patch('/:id/complete', async (req, res, next) => {
  try {
    const db = readDB();
    const task = db.tasks.find(t => t.id === req.params.id && t.userId === req.user.id);
    if (!task) return next({ status: 404, code: 'NOT_FOUND', message: 'Task not found' });
    task.status = 'completed';
    task.completedAt = new Date().toISOString();
    const gain = {
      id: uid(), userId: req.user.id,
      source: 'autre', amount: task.amount,
      date: new Date().toISOString().slice(0, 10),
      note: `Tâche : ${task.title}`,
      taskId: task.id,
      createdAt: new Date().toISOString(),
    };
    db.gains.push(gain);
    await writeDB(db);
    res.json({ task, gain });
  } catch (e) { next(e); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const db = readDB();
    const idx = db.tasks.findIndex(t => t.id === req.params.id && t.userId === req.user.id);
    if (idx === -1) return next({ status: 404, code: 'NOT_FOUND', message: 'Task not found' });
    const [removed] = db.tasks.splice(idx, 1);
    await writeDB(db);
    res.json({ task: removed });
  } catch (e) { next(e); }
});

module.exports = router;
