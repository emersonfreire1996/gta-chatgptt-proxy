import { api } from '../api.js';
import { fmtEUR, fmtEUR2, escapeHtml } from '../utils/format.js';
import { ring, lineChart } from '../components/charts.js';
import { openModal, confirmDanger } from '../components/modal.js';
import { toast } from '../components/toast.js';

export async function renderGoals(root) {
  const [{ goals }, stats] = await Promise.all([api.get('/goals'), api.get('/stats')]);
  const main = goals[0];
  const progress = main ? (stats.totals.month / main.targetAmount) * 100 : 0;
  const monthDay = new Date().getDate();
  const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth()+1, 0).getDate();
  const projected = monthDay ? (stats.totals.month / monthDay) * daysInMonth : 0;
  const willHit = main ? projected >= main.targetAmount : false;

  root.innerHTML = `
    <div class="view fade-up">
      <div class="view-header">
        <div><h2>Objectifs</h2><p class="secondary">Mesurez votre progression réelle vers vos cibles.</p></div>
        <button class="btn btn-primary" data-add>+ Nouvel objectif</button>
      </div>
      ${main ? `
        <div class="card goal-hero fade-up fade-up-1">
          <canvas data-ring width="220" height="220"></canvas>
          <div class="info">
            <h3>${escapeHtml(main.title)}</h3>
            <div class="big mono">${fmtEUR2(stats.totals.month)}</div>
            <div class="target">sur ${fmtEUR(main.targetAmount)} • ${Math.round(progress)}% atteint</div>
            <div class="projection ${willHit?'ok':'bad'}">
              ${willHit
                ? `Projection : ${fmtEUR(projected)} d'ici la fin du mois — vous y serez ✓`
                : `Projection : ${fmtEUR(projected)} d'ici la fin du mois — il manque ${fmtEUR(main.targetAmount - projected)}`}
            </div>
          </div>
        </div>
        <div class="card chart-card fade-up fade-up-2">
          <header><h3>Trajectoire du mois</h3></header>
          <canvas data-line height="220"></canvas>
        </div>
      ` : `
        <div class="card empty-state">
          <h4>Pas encore d'objectif</h4>
          <p>Créez votre premier objectif mensuel pour suivre votre progression.</p>
        </div>
      `}
      <div class="card" style="padding:0;overflow:hidden">
        <table class="table">
          <thead><tr><th>Titre</th><th>Cible</th><th>Période</th><th></th></tr></thead>
          <tbody>
            ${goals.map(g => `<tr>
              <td>${escapeHtml(g.title)}</td>
              <td class="mono">${fmtEUR(g.targetAmount)}</td>
              <td>${g.period}</td>
              <td style="text-align:right"><button class="btn btn-ghost btn-sm" data-del-g="${g.id}">×</button></td>
            </tr>`).join('') || '<tr><td colspan="4"><div class="empty-state"><p>Aucun objectif</p></div></td></tr>'}
          </tbody>
        </table>
      </div>
    </div>
  `;
  if (main) {
    ring(root.querySelector('[data-ring]'), progress, { size: 220, label: Math.round(progress) + '%', sub: 'atteint' });
    // Cumulative line
    const today = new Date();
    const days = []; let cum = 0;
    const monthData = stats.dailyLast30.filter(d => new Date(d.date).getMonth() === today.getMonth());
    monthData.forEach(d => { cum += d.amount; days.push({ date: d.date, amount: cum }); });
    if (days.length) lineChart(root.querySelector('[data-line]'), days, { color: '#00D4AA' });
  }
  root.querySelector('[data-add]').onclick = () => openGoalModal();
  root.querySelectorAll('[data-del-g]').forEach(b => b.onclick = async () => {
    if (!await confirmDanger('Supprimer cet objectif ?', 'Irréversible.')) return;
    await api.delete(`/goals/${b.dataset.delG}`); renderGoals(root);
  });
}

async function openGoalModal() {
  const today = new Date(); const ym = today.toISOString().slice(0,10);
  const monthEnd = new Date(today.getFullYear(), today.getMonth()+1, 0).toISOString().slice(0,10);
  const body = `
    <form class="field" data-form>
      <div class="field"><label>Titre</label><input class="input" name="title" required maxlength="200" value="Objectif mensuel"></div>
      <div style="display:flex;gap:12px;margin-top:12px">
        <div class="field" style="flex:1"><label>Cible (€)</label><input class="input" name="targetAmount" type="number" min="1" step="1" required value="3000"></div>
        <div class="field" style="flex:1"><label>Période</label><select class="select" name="period">
          <option value="weekly">Hebdomadaire</option><option value="monthly" selected>Mensuel</option><option value="yearly">Annuel</option>
        </select></div>
      </div>
      <div style="display:flex;gap:12px;margin-top:12px">
        <div class="field" style="flex:1"><label>Début</label><input class="input" name="startDate" type="date" required value="${ym}"></div>
        <div class="field" style="flex:1"><label>Fin</label><input class="input" name="endDate" type="date" required value="${monthEnd}"></div>
      </div>
    </form>
  `;
  await openModal({
    title: 'Nouvel objectif', body, primaryLabel: 'Créer',
    onConfirm: async (overlay) => {
      const data = Object.fromEntries(new FormData(overlay.querySelector('[data-form]')));
      data.targetAmount = +data.targetAmount;
      try { await api.post('/goals', data); toast('Objectif créé 🎯', 'success'); const v = document.querySelector('[data-view-root]'); if (v) renderGoals(v); return true; }
      catch (e) { toast(e.message, 'error'); return false; }
    }
  });
}
