const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { readDB } = require('../utils/db');

router.use(auth);

const ymd = (d) => d.toISOString().slice(0, 10);
const startOfWeek = (d) => { const x = new Date(d); const day = (x.getDay()+6)%7; x.setDate(x.getDate()-day); x.setHours(0,0,0,0); return x; };
const startOfMonth = (d) => new Date(d.getFullYear(), d.getMonth(), 1);
const startOfYear = (d) => new Date(d.getFullYear(), 0, 1);

router.get('/', (req, res, next) => {
  try {
    const db = readDB();
    const userId = req.user.id;
    const gains = db.gains.filter(g => g.userId === userId);
    const goals = db.goals.filter(g => g.userId === userId);
    const today = new Date(); today.setHours(0,0,0,0);
    const todayStr = ymd(today);
    const weekStart = startOfWeek(today);
    const monthStart = startOfMonth(today);
    const yearStart = startOfYear(today);
    const lastMonthStart = new Date(today.getFullYear(), today.getMonth()-1, 1);
    const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);

    const sumIf = (pred) => gains.filter(pred).reduce((s,g)=>s+g.amount, 0);
    const totals = {
      today:   sumIf(g => g.date === todayStr),
      week:    sumIf(g => new Date(g.date) >= weekStart),
      month:   sumIf(g => new Date(g.date) >= monthStart),
      year:    sumIf(g => new Date(g.date) >= yearStart),
      allTime: sumIf(() => true),
    };

    // Best day
    const byDay = {};
    gains.forEach(g => { byDay[g.date] = (byDay[g.date]||0) + g.amount; });
    const bestDay = Object.entries(byDay).sort((a,b)=>b[1]-a[1])[0] || ['—', 0];

    // Source breakdown
    const bySource = {};
    gains.forEach(g => { bySource[g.source] = (bySource[g.source]||0) + g.amount; });
    const sourceBreakdown = Object.entries(bySource)
      .map(([source, amount]) => ({ source, amount, percentage: totals.allTime ? +(amount/totals.allTime*100).toFixed(1) : 0 }))
      .sort((a,b) => b.amount - a.amount);
    const bestSource = sourceBreakdown[0] || { source:'—', amount:0, percentage:0 };

    // Daily last 30
    const dailyLast30 = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(today); d.setDate(d.getDate()-i);
      const k = ymd(d);
      dailyLast30.push({ date: k, amount: byDay[k] || 0 });
    }

    // Weekly last 12
    const weeklyLast12 = [];
    for (let i = 11; i >= 0; i--) {
      const ws = new Date(weekStart); ws.setDate(ws.getDate() - i*7);
      const we = new Date(ws); we.setDate(we.getDate()+7);
      const sum = sumIf(g => { const d = new Date(g.date); return d >= ws && d < we; });
      weeklyLast12.push({ week: ymd(ws), amount: sum });
    }

    // Monthly last 12
    const monthlyLast12 = [];
    for (let i = 11; i >= 0; i--) {
      const ms = new Date(today.getFullYear(), today.getMonth()-i, 1);
      const me = new Date(today.getFullYear(), today.getMonth()-i+1, 1);
      const sum = sumIf(g => { const d = new Date(g.date); return d >= ms && d < me; });
      monthlyLast12.push({ month: ms.toISOString().slice(0,7), amount: sum });
    }

    // Comparison
    const lastMonth = sumIf(g => { const d = new Date(g.date); return d >= lastMonthStart && d <= lastMonthEnd; });
    const trendNum = lastMonth > 0 ? ((totals.month - lastMonth) / lastMonth) * 100 : (totals.month > 0 ? 100 : 0);
    const comparison = { thisMonth: totals.month, lastMonth, trend: (trendNum >= 0 ? '+' : '') + trendNum.toFixed(0) + '%' };

    // Streak
    let current = 0, best = 0, run = 0;
    const sortedDays = Object.keys(byDay).sort();
    let prev = null;
    sortedDays.forEach(d => {
      if (prev) {
        const diff = (new Date(d) - new Date(prev)) / 86400000;
        run = diff === 1 ? run+1 : 1;
      } else run = 1;
      best = Math.max(best, run);
      prev = d;
    });
    if (sortedDays.length) {
      const last = sortedDays[sortedDays.length-1];
      const diff = (today - new Date(last)) / 86400000;
      current = diff <= 1 ? run : 0;
    }

    res.json({
      totals, bestDay: { date: bestDay[0], amount: bestDay[1] }, bestSource,
      sourceBreakdown, dailyLast30, weeklyLast12, monthlyLast12,
      comparison, streak: { current, best },
      goalsCount: goals.length,
    });
  } catch (e) { next(e); }
});

module.exports = router;
