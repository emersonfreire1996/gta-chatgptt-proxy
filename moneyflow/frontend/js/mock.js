// Mock API — runs entirely client-side when backend unreachable.
// Mirrors the Express routes so the demo works in static preview.
import { storage } from './utils/storage.js';

const MOCK_DB_KEY = 'mf_mock_db';

export function isMockMode() {
  return window.__MF_MOCK === true || window.MF_FORCE_MOCK === true;
}

const sources = ['freelance','affiliation','contenu','coaching','crypto'];
const ymd = (d) => d.toISOString().slice(0,10);
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2,8);

function seed() {
  const today = new Date(); today.setHours(0,0,0,0);
  let s = 12345; const rand = () => { s = (s*9301+49297)%233280; return s/233280; };
  const userId = 'demo-mock';
  const gains = [];
  for (let i=0; i<45; i++) {
    const d = new Date(today); d.setDate(d.getDate()-Math.floor(rand()*60));
    const src = sources[Math.floor(rand()*sources.length)];
    const ranges = { freelance:[120,850], affiliation:[15,180], contenu:[25,220], coaching:[80,400], crypto:[20,300] };
    const [lo,hi] = ranges[src];
    const amount = Math.round((lo + rand()*(hi-lo))*100)/100;
    gains.push({ id:uid(), userId, source:src, amount, date:ymd(d), note:'', createdAt: new Date(d).toISOString() });
  }
  const tasks = [
    { id:uid(),userId,title:'Livrer landing page client X',amount:450,status:'completed',priority:'urgent',dueDate:ymd(new Date(today.getTime()-3*86400000)),createdAt:new Date().toISOString()},
    { id:uid(),userId,title:'Article sponsorisé blog tech',amount:220,status:'completed',priority:'normal',dueDate:ymd(new Date(today.getTime()-1*86400000)),createdAt:new Date().toISOString()},
    { id:uid(),userId,title:'Vidéo tutoriel YouTube',amount:180,status:'completed',priority:'normal',dueDate:ymd(today),createdAt:new Date().toISOString()},
    { id:uid(),userId,title:'Refonte UI dashboard fintech',amount:1200,status:'in_progress',priority:'urgent',dueDate:ymd(new Date(today.getTime()+5*86400000)),createdAt:new Date().toISOString()},
    { id:uid(),userId,title:'Coaching 1:1 — Marc D.',amount:150,status:'in_progress',priority:'normal',dueDate:ymd(new Date(today.getTime()+2*86400000)),createdAt:new Date().toISOString()},
    { id:uid(),userId,title:'Newsletter mensuelle',amount:90,status:'in_progress',priority:'low',dueDate:ymd(new Date(today.getTime()+7*86400000)),createdAt:new Date().toISOString()},
    { id:uid(),userId,title:'Audit SEO site e-commerce',amount:600,status:'pending',priority:'urgent',dueDate:ymd(new Date(today.getTime()+10*86400000)),createdAt:new Date().toISOString()},
    { id:uid(),userId,title:'Pack icônes Figma',amount:350,status:'pending',priority:'low',dueDate:ymd(new Date(today.getTime()+14*86400000)),createdAt:new Date().toISOString()},
  ];
  const goalStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const goalEnd = new Date(today.getFullYear(), today.getMonth()+1, 0);
  const goals = [{ id:uid(),userId,title:'Objectif mensuel',targetAmount:3000,period:'monthly',startDate:ymd(goalStart),endDate:ymd(goalEnd),createdAt:new Date().toISOString() }];
  return {
    users: [{ id:userId, email:'demo@moneyflow.io', name:'Démo MoneyFlow', plan:'free', password:'Demo1234' }],
    gains, tasks, goals,
  };
}

function getDB() {
  let db = storage.get(MOCK_DB_KEY);
  if (!db) { db = seed(); storage.set(MOCK_DB_KEY, db); }
  return db;
}
function saveDB(db) { storage.set(MOCK_DB_KEY, db); }

function buildStats(db, userId) {
  const gains = db.gains.filter(g=>g.userId===userId);
  const today = new Date(); today.setHours(0,0,0,0);
  const todayStr = ymd(today);
  const weekStart = new Date(today); weekStart.setDate(weekStart.getDate()-(weekStart.getDay()+6)%7);
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const yearStart = new Date(today.getFullYear(), 0, 1);
  const lastMonthStart = new Date(today.getFullYear(), today.getMonth()-1, 1);
  const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);
  const sumIf = (p) => gains.filter(p).reduce((s,g)=>s+g.amount,0);
  const totals = {
    today: sumIf(g=>g.date===todayStr),
    week: sumIf(g=>new Date(g.date)>=weekStart),
    month: sumIf(g=>new Date(g.date)>=monthStart),
    year: sumIf(g=>new Date(g.date)>=yearStart),
    allTime: sumIf(()=>true),
  };
  const byDay = {}; gains.forEach(g=>{byDay[g.date]=(byDay[g.date]||0)+g.amount;});
  const bestDay = Object.entries(byDay).sort((a,b)=>b[1]-a[1])[0]||['—',0];
  const bySource = {}; gains.forEach(g=>{bySource[g.source]=(bySource[g.source]||0)+g.amount;});
  const sourceBreakdown = Object.entries(bySource).map(([source,amount])=>({ source, amount, percentage: totals.allTime?+(amount/totals.allTime*100).toFixed(1):0 })).sort((a,b)=>b.amount-a.amount);
  const bestSource = sourceBreakdown[0]||{source:'—',amount:0,percentage:0};
  const dailyLast30=[];
  for(let i=29;i>=0;i--){const d=new Date(today);d.setDate(d.getDate()-i);const k=ymd(d);dailyLast30.push({date:k,amount:byDay[k]||0});}
  const weeklyLast12=[];
  for(let i=11;i>=0;i--){const ws=new Date(weekStart);ws.setDate(ws.getDate()-i*7);const we=new Date(ws);we.setDate(we.getDate()+7);weeklyLast12.push({week:ymd(ws),amount:sumIf(g=>{const d=new Date(g.date);return d>=ws&&d<we;})});}
  const monthlyLast12=[];
  for(let i=11;i>=0;i--){const ms=new Date(today.getFullYear(),today.getMonth()-i,1);const me=new Date(today.getFullYear(),today.getMonth()-i+1,1);monthlyLast12.push({month:ms.toISOString().slice(0,7),amount:sumIf(g=>{const d=new Date(g.date);return d>=ms&&d<me;})});}
  const lastMonth=sumIf(g=>{const d=new Date(g.date);return d>=lastMonthStart&&d<=lastMonthEnd;});
  const trendNum=lastMonth>0?((totals.month-lastMonth)/lastMonth)*100:(totals.month>0?100:0);
  const comparison={ thisMonth: totals.month, lastMonth, trend:(trendNum>=0?'+':'')+trendNum.toFixed(0)+'%' };
  let current=0,best=0,run=0,prev=null;
  Object.keys(byDay).sort().forEach(d=>{if(prev){const diff=(new Date(d)-new Date(prev))/86400000;run=diff===1?run+1:1;}else run=1;best=Math.max(best,run);prev=d;});
  const sortedDays=Object.keys(byDay).sort();
  if(sortedDays.length){const last=sortedDays[sortedDays.length-1];const diff=(today-new Date(last))/86400000;current=diff<=1?run:0;}
  return { totals, bestDay:{date:bestDay[0],amount:bestDay[1]}, bestSource, sourceBreakdown, dailyLast30, weeklyLast12, monthlyLast12, comparison, streak:{current,best}, goalsCount: db.goals.filter(g=>g.userId===userId).length };
}

export async function mockApi(method, path, body) {
  await new Promise(r=>setTimeout(r,180));
  const db = getDB();
  const userId = 'demo-mock';
  const u = db.users[0];

  if (path === '/auth/login' && method === 'POST') {
    if (body.email !== u.email || body.password !== u.password) {
      const e = new Error('Identifiants incorrects'); throw e;
    }
    const { password, ...user } = u;
    return { token: 'mock.' + uid(), user };
  }
  if (path === '/auth/register' && method === 'POST') {
    const { password, ...user } = u;
    return { token: 'mock.' + uid(), user: { ...user, name: body.name || user.name, email: body.email } };
  }
  if (path === '/auth/me' && method === 'GET') {
    const { password, ...user } = u; return { user };
  }

  if (path.startsWith('/gains')) {
    if (method === 'GET') return { gains: db.gains.filter(g=>g.userId===userId).sort((a,b)=>b.date.localeCompare(a.date)) };
    if (method === 'POST') { const g = { id:uid(), userId, ...body, createdAt:new Date().toISOString() }; db.gains.push(g); saveDB(db); return { gain: g }; }
    const id = path.split('/')[2];
    if (method === 'PUT') { const g = db.gains.find(x=>x.id===id); if(!g) throw new Error('Not found'); Object.assign(g, body); saveDB(db); return { gain: g }; }
    if (method === 'DELETE') { const i = db.gains.findIndex(x=>x.id===id); if(i<0) throw new Error('Not found'); const [r] = db.gains.splice(i,1); saveDB(db); return { gain: r }; }
  }
  if (path.startsWith('/tasks')) {
    if (path === '/tasks' && method === 'GET') return { tasks: db.tasks.filter(t=>t.userId===userId) };
    if (path === '/tasks' && method === 'POST') { const t={id:uid(),userId,...body,createdAt:new Date().toISOString()}; db.tasks.push(t); saveDB(db); return { task:t }; }
    const m = path.match(/^\/tasks\/([^/]+)(\/complete)?$/);
    if (m) {
      const id = m[1]; const t = db.tasks.find(x=>x.id===id); if(!t) throw new Error('Not found');
      if (m[2] && method === 'PATCH') {
        t.status='completed'; t.completedAt=new Date().toISOString();
        const g = { id:uid(), userId, source:'autre', amount:t.amount, date:ymd(new Date()), note:`Tâche : ${t.title}`, taskId:t.id, createdAt:new Date().toISOString() };
        db.gains.push(g); saveDB(db); return { task:t, gain:g };
      }
      if (method === 'PUT') { Object.assign(t, body); saveDB(db); return { task:t }; }
      if (method === 'DELETE') { const i = db.tasks.findIndex(x=>x.id===id); const [r]=db.tasks.splice(i,1); saveDB(db); return { task:r }; }
    }
  }
  if (path.startsWith('/goals')) {
    if (method === 'GET') return { goals: db.goals.filter(g=>g.userId===userId) };
    if (method === 'POST') { const g={id:uid(),userId,...body,createdAt:new Date().toISOString()}; db.goals.push(g); saveDB(db); return { goal:g }; }
    const id = path.split('/')[2];
    if (method === 'PUT') { const g=db.goals.find(x=>x.id===id); Object.assign(g,body); saveDB(db); return { goal:g }; }
    if (method === 'DELETE') { const i=db.goals.findIndex(x=>x.id===id); const [r]=db.goals.splice(i,1); saveDB(db); return { goal:r }; }
  }
  if (path === '/stats' && method === 'GET') return buildStats(db, userId);

  throw new Error('Mock route not implemented: ' + method + ' ' + path);
}
