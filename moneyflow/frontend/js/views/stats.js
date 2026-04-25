import { api } from '../api.js';
import { fmtEUR, fmtEUR2, fmtDate, SOURCE_META } from '../utils/format.js';
import { lineChart, barChart, donutChart } from '../components/charts.js';

export async function renderStats(root) {
  const stats = await api.get('/stats');
  root.innerHTML = `
    <div class="view fade-up">
      <div class="view-header">
        <div><h2>Statistiques</h2><p class="secondary">Comprenez d'où vient l'argent et où vous en êtes.</p></div>
      </div>
      <div class="stats-grid">
        <div class="card big-card fade-up fade-up-1">
          <div class="label">Meilleur jour</div>
          <div class="value">${fmtEUR2(stats.bestDay.amount)}</div>
          <div class="muted" style="font-size:12px;margin-top:8px">${fmtDate(stats.bestDay.date)}</div>
        </div>
        <div class="card big-card fade-up fade-up-2">
          <div class="label">Meilleure source</div>
          <div class="value">${SOURCE_META[stats.bestSource.source]?.label || '—'}</div>
          <div class="muted" style="font-size:12px;margin-top:8px">${fmtEUR(stats.bestSource.amount)} • ${stats.bestSource.percentage}% du total</div>
        </div>
        <div class="card big-card fade-up fade-up-3">
          <div class="label">Streak actuel</div>
          <div class="value">${stats.streak.current}j 🔥</div>
          <div class="muted" style="font-size:12px;margin-top:8px">Record : ${stats.streak.best} jours</div>
        </div>
      </div>
      <div class="row-2">
        <div class="card chart-card fade-up fade-up-4">
          <header><h3>Gains hebdomadaires (12 sem.)</h3></header>
          <canvas data-bar height="220"></canvas>
        </div>
        <div class="card chart-card fade-up fade-up-5">
          <header><h3>Mois par mois (12 mois)</h3></header>
          <canvas data-line height="220"></canvas>
        </div>
      </div>
      <div class="card chart-card fade-up fade-up-6">
        <header><h3>Répartition complète par source</h3></header>
        <div style="display:flex;gap:32px;align-items:center;flex-wrap:wrap">
          <canvas data-donut width="220" height="220"></canvas>
          <div style="flex:1;min-width:240px">
            ${stats.sourceBreakdown.map(s => `
              <div style="display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid var(--border)">
                <span style="width:10px;height:10px;border-radius:50%;background:${SOURCE_META[s.source]?.color||'#888'}"></span>
                <span style="flex:1">${SOURCE_META[s.source]?.label || s.source}</span>
                <span class="mono">${fmtEUR(s.amount)}</span>
                <span class="muted" style="width:42px;text-align:right">${s.percentage}%</span>
              </div>`).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
  barChart(root.querySelector('[data-bar]'), stats.weeklyLast12.map(w=>({ amount:w.amount })));
  lineChart(root.querySelector('[data-line]'), stats.monthlyLast12.map(m=>({ amount:m.amount })), { color:'#00D4AA' });
  donutChart(root.querySelector('[data-donut]'), stats.sourceBreakdown.map(s => ({ value: s.amount, color: SOURCE_META[s.source]?.color || '#888' })), { size: 220 });
}
