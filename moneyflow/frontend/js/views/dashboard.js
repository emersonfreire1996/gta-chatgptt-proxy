import { api } from '../api.js';
import { fmtEUR, fmtEUR2, fmtDate } from '../utils/format.js';
import { lineChart, donutChart, ring } from '../components/charts.js';
import { countUp } from '../utils/animate.js';
import { SOURCE_META } from '../utils/format.js';

export async function renderDashboard(root) {
  root.innerHTML = `
    <div class="view fade-up">
      <div class="kpi-row">
        ${['Aujourd\'hui', 'Cette semaine', 'Ce mois', 'Total'].map((l,i)=>`
          <div class="card kpi fade-up fade-up-${i+1}" data-kpi="${i}">
            <span class="label">${l}</span>
            <span class="value mono" data-value>0 €</span>
            <span class="sub muted">Chargement…</span>
          </div>`).join('')}
      </div>
      <div class="row-2">
        <div class="card chart-card fade-up fade-up-3">
          <header><div><h3>Évolution des gains</h3><p class="secondary" style="font-size:13px">30 derniers jours</p></div></header>
          <canvas data-chart="line" height="220"></canvas>
        </div>
        <div class="card chart-card fade-up fade-up-4">
          <header><h3>Répartition par source</h3></header>
          <div style="display:flex;gap:24px;align-items:center">
            <canvas data-chart="donut" width="180" height="180"></canvas>
            <div data-legend style="flex:1;display:flex;flex-direction:column;gap:10px;font-size:13px"></div>
          </div>
        </div>
      </div>
      <div class="row-2">
        <div class="card chart-card fade-up fade-up-5">
          <header><h3>Tâches en cours</h3><a href="#tasks" class="secondary" style="font-size:13px">Tout voir →</a></header>
          <div data-tasks></div>
        </div>
        <div class="card chart-card fade-up fade-up-6">
          <header><h3>Objectif du mois</h3></header>
          <div style="display:flex;flex-direction:column;align-items:center;gap:12px">
            <canvas data-chart="ring" width="180" height="180"></canvas>
            <div style="text-align:center" data-goal-text></div>
          </div>
        </div>
      </div>
    </div>
  `;

  const [stats, tasksRes] = await Promise.all([api.get('/stats'), api.get('/tasks')]);
  const kpiVals = [stats.totals.today, stats.totals.week, stats.totals.month, stats.totals.allTime];
  const subs = [
    'gains du jour',
    `${stats.dailyLast30.filter(d=>d.amount>0).length} jours actifs`,
    stats.comparison.trend + ' vs mois dernier',
    `${stats.streak.current} jours d'affilée`,
  ];
  root.querySelectorAll('[data-kpi]').forEach((el, i) => {
    const v = el.querySelector('[data-value]');
    countUp(v, 0, kpiVals[i], 1100, (n) => fmtEUR(n));
    el.querySelector('.sub').textContent = subs[i];
  });

  // Line
  lineChart(root.querySelector('[data-chart=line]'), stats.dailyLast30);
  // Donut
  const donutData = stats.sourceBreakdown.slice(0,6).map(s => ({ value: s.amount, color: SOURCE_META[s.source]?.color || '#888' }));
  donutChart(root.querySelector('[data-chart=donut]'), donutData);
  const legend = root.querySelector('[data-legend]');
  legend.innerHTML = stats.sourceBreakdown.slice(0,6).map(s => `
    <div style="display:flex;align-items:center;gap:10px">
      <span style="width:10px;height:10px;border-radius:50%;background:${SOURCE_META[s.source]?.color||'#888'}"></span>
      <span style="flex:1">${SOURCE_META[s.source]?.label||s.source}</span>
      <span class="mono">${fmtEUR(s.amount)}</span>
      <span class="muted" style="font-size:11px;width:38px;text-align:right">${s.percentage}%</span>
    </div>`).join('') || '<span class="muted">Aucune donnée</span>';

  // Tasks list
  const inProg = tasksRes.tasks.filter(t => t.status !== 'completed').slice(0,4);
  root.querySelector('[data-tasks]').innerHTML = inProg.length ? inProg.map(t => `
    <div style="padding:12px 0;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center">
      <div>
        <div style="font-weight:500">${t.title}</div>
        <div class="muted" style="font-size:12px">échéance ${fmtDate(t.dueDate)}</div>
      </div>
      <span class="mono success-text">${fmtEUR(t.amount)}</span>
    </div>`).join('') : '<p class="muted">Aucune tâche en cours.</p>';

  // Goal ring
  const goalsRes = await api.get('/goals');
  const goal = goalsRes.goals[0];
  if (goal) {
    const progress = (stats.totals.month / goal.targetAmount) * 100;
    ring(root.querySelector('[data-chart=ring]'), progress, { label: Math.round(progress) + '%', sub: 'atteint' });
    root.querySelector('[data-goal-text]').innerHTML = `<div class="mono" style="font-size:18px">${fmtEUR2(stats.totals.month)} / ${fmtEUR(goal.targetAmount)}</div><div class="muted" style="font-size:12px">${goal.title}</div>`;
  }
}
