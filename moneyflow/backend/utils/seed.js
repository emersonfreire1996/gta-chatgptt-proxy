/**
 * MoneyFlow seed — runs on `npm run seed`.
 * Re-creates db.json with a properly hashed demo user.
 * Identifiants démo : demo@moneyflow.io / Demo1234
 */
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const { BCRYPT_ROUNDS } = require('../config/constants');

const DB_PATH = path.join(__dirname, '..', 'db.json');

async function main() {
  const sources = ['freelance','affiliation','contenu','coaching','crypto'];
  const today = new Date(); today.setHours(0,0,0,0);
  const ymd = (d) => d.toISOString().slice(0,10);
  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2,8);
  let s = 12345; const rand = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };

  const userId = 'demo-' + uid();
  const passwordHash = await bcrypt.hash('Demo1234', BCRYPT_ROUNDS);

  const gains = [];
  for (let i = 0; i < 45; i++) {
    const d = new Date(today); d.setDate(d.getDate() - Math.floor(rand() * 60));
    const src = sources[Math.floor(rand() * sources.length)];
    const ranges = { freelance:[120,850], affiliation:[15,180], contenu:[25,220], coaching:[80,400], crypto:[20,300] };
    const [lo, hi] = ranges[src];
    const amount = Math.round((lo + rand() * (hi - lo)) * 100) / 100;
    gains.push({ id: uid(), userId, source: src, amount, date: ymd(d), note:'', createdAt: new Date(d).toISOString() });
  }

  const tasks = [
    { id: uid(), userId, title:'Livrer landing page client X',  amount: 450, status:'completed',   priority:'urgent', dueDate: ymd(new Date(today.getTime()-3*86400000)), createdAt: new Date().toISOString(), completedAt: new Date().toISOString() },
    { id: uid(), userId, title:'Article sponsorisé blog tech',  amount: 220, status:'completed',   priority:'normal', dueDate: ymd(new Date(today.getTime()-1*86400000)), createdAt: new Date().toISOString(), completedAt: new Date().toISOString() },
    { id: uid(), userId, title:'Vidéo tutoriel YouTube',         amount: 180, status:'completed',   priority:'normal', dueDate: ymd(today),                                  createdAt: new Date().toISOString(), completedAt: new Date().toISOString() },
    { id: uid(), userId, title:'Refonte UI dashboard fintech',   amount: 1200, status:'in_progress',priority:'urgent', dueDate: ymd(new Date(today.getTime()+5*86400000)),  createdAt: new Date().toISOString() },
    { id: uid(), userId, title:'Coaching 1:1 — Marc D.',         amount: 150, status:'in_progress', priority:'normal', dueDate: ymd(new Date(today.getTime()+2*86400000)),  createdAt: new Date().toISOString() },
    { id: uid(), userId, title:'Newsletter mensuelle',           amount: 90,  status:'in_progress', priority:'low',    dueDate: ymd(new Date(today.getTime()+7*86400000)),  createdAt: new Date().toISOString() },
    { id: uid(), userId, title:'Audit SEO site e-commerce',      amount: 600, status:'pending',     priority:'urgent', dueDate: ymd(new Date(today.getTime()+10*86400000)), createdAt: new Date().toISOString() },
    { id: uid(), userId, title:'Pack icônes Figma',              amount: 350, status:'pending',     priority:'low',    dueDate: ymd(new Date(today.getTime()+14*86400000)), createdAt: new Date().toISOString() },
  ];

  const goalStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const goalEnd   = new Date(today.getFullYear(), today.getMonth()+1, 0);
  const goals = [{
    id: uid(), userId,
    title:'Objectif mensuel', targetAmount: 3000, period:'monthly',
    startDate: ymd(goalStart), endDate: ymd(goalEnd),
    createdAt: new Date().toISOString(),
  }];

  const db = {
    users: [{ id: userId, email:'demo@moneyflow.io', name:'Démo MoneyFlow', plan:'free', passwordHash, createdAt: new Date().toISOString() }],
    gains, tasks, goals,
  };
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
  console.log('✓ db.json seeded — login: demo@moneyflow.io / Demo1234');
}

main().catch((e) => { console.error(e); process.exit(1); });
