import { api } from '../api.js';
import { fmtEUR2, fmtDate, escapeHtml, today, SOURCE_META } from '../utils/format.js';
import { toast } from '../components/toast.js';
import { openModal, confirmDanger } from '../components/modal.js';

let state = { gains: [], filter: 'all', sort: 'date-desc' };

export async function renderGains(root) {
  root.innerHTML = `
    <div class="view fade-up">
      <div class="view-header">
        <div>
          <h2>Mes gains</h2>
          <p class="secondary">Toutes vos sources de revenus en un coup d'œil</p>
        </div>
        <div class="actions">
          <button class="btn btn-ghost" data-export>Exporter CSV</button>
          <button class="btn btn-primary" data-add>+ Ajouter un gain</button>
        </div>
      </div>
      <div class="card" style="padding:16px 20px">
        <div class="filters" data-filters></div>
      </div>
      <div class="card" style="padding:0;overflow:hidden">
        <table class="table">
          <thead>
            <tr>
              <th data-sort="date">Date</th>
              <th data-sort="source">Source</th>
              <th>Note</th>
              <th data-sort="amount" style="text-align:right">Montant</th>
              <th></th>
            </tr>
          </thead>
          <tbody data-rows></tbody>
        </table>
      </div>
    </div>
  `;

  const filtersEl = root.querySelector('[data-filters]');
  const sources = ['all', ...Object.keys(SOURCE_META)];
  filtersEl.innerHTML = sources.map(s => `<button class="chip ${state.filter===s?'active':''}" data-f="${s}">${s==='all'?'Toutes':SOURCE_META[s].label}</button>`).join('');
  filtersEl.querySelectorAll('[data-f]').forEach(el => el.onclick = () => { state.filter = el.dataset.f; renderGains(root); });

  root.querySelectorAll('[data-sort]').forEach(th => {
    th.onclick = () => {
      const k = th.dataset.sort;
      state.sort = state.sort === `${k}-desc` ? `${k}-asc` : `${k}-desc`;
      renderRows();
    };
  });

  root.querySelector('[data-add]').onclick = () => openGainModal();
  root.querySelector('[data-export]').onclick = () => exportCsv();

  const { gains } = await api.get('/gains');
  state.gains = gains;
  renderRows();

  function renderRows() {
    let arr = state.filter === 'all' ? state.gains : state.gains.filter(g => g.source === state.filter);
    const [k, dir] = state.sort.split('-');
    arr = [...arr].sort((a, b) => {
      let va = a[k], vb = b[k];
      if (k === 'amount') { va = +va; vb = +vb; }
      return dir === 'asc' ? (va > vb ? 1 : -1) : (va < vb ? 1 : -1);
    });
    const tbody = root.querySelector('[data-rows]');
    tbody.innerHTML = arr.length ? arr.map(g => {
      const m = SOURCE_META[g.source] || { label: g.source, color: '#888' };
      return `
      <tr data-id="${g.id}">
        <td class="mono">${fmtDate(g.date)}</td>
        <td><span class="source-tag" style="background:${m.color}22;color:${m.color}">${m.label}</span></td>
        <td class="muted">${escapeHtml(g.note || '—')}</td>
        <td class="amount" style="text-align:right">${fmtEUR2(g.amount)}</td>
        <td style="text-align:right">
          <button class="btn btn-ghost btn-sm" data-edit="${g.id}">Modifier</button>
          <button class="btn btn-ghost btn-sm" data-del="${g.id}">×</button>
        </td>
      </tr>`;
    }).join('') : `<tr><td colspan="5"><div class="empty-state"><h4>Aucun gain</h4><p>Commencez par ajouter votre premier gain.</p></div></td></tr>`;
    tbody.querySelectorAll('[data-edit]').forEach(b => b.onclick = () => openGainModal(state.gains.find(g => g.id === b.dataset.edit)));
    tbody.querySelectorAll('[data-del]').forEach(b => b.onclick = async () => {
      const ok = await confirmDanger('Supprimer ce gain ?', 'Cette action est irréversible.');
      if (!ok) return;
      await api.delete(`/gains/${b.dataset.del}`);
      state.gains = state.gains.filter(g => g.id !== b.dataset.del);
      renderRows(); toast('Gain supprimé', 'success');
    });
  }

  function exportCsv() {
    const rows = [['date','source','amount','note']].concat(state.gains.map(g => [g.date,g.source,g.amount,g.note||'']));
    const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g,'""')}"`).join(',')).join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type:'text/csv' }));
    a.download = 'moneyflow-gains.csv'; a.click();
    toast('Export téléchargé', 'success');
  }
}

async function openGainModal(gain = null) {
  const isEdit = !!gain;
  const opts = Object.entries(SOURCE_META).map(([k,v]) => `<option value="${k}" ${gain?.source===k?'selected':''}>${v.label}</option>`).join('');
  const body = `
    <form class="field" data-form>
      <div class="field"><label>Source</label><select class="select" name="source" required>${opts}</select></div>
      <div style="display:flex;gap:12px;margin-top:12px">
        <div class="field" style="flex:1"><label>Montant (€)</label><input class="input" name="amount" type="number" step="0.01" min="0.01" required value="${gain?.amount||''}"></div>
        <div class="field" style="flex:1"><label>Date</label><input class="input" name="date" type="date" required value="${gain?.date||today()}"></div>
      </div>
      <div class="field" style="margin-top:12px"><label>Note (optionnel)</label><input class="input" name="note" maxlength="200" value="${escapeHtml(gain?.note||'')}"></div>
    </form>
  `;
  await openModal({
    title: isEdit ? 'Modifier le gain' : 'Nouveau gain',
    body, primaryLabel: isEdit ? 'Enregistrer' : 'Ajouter',
    onConfirm: async (overlay) => {
      const f = overlay.querySelector('[data-form]');
      const data = Object.fromEntries(new FormData(f));
      data.amount = +data.amount;
      try {
        if (isEdit) await api.put(`/gains/${gain.id}`, data); else await api.post('/gains', data);
        toast(isEdit ? 'Gain modifié' : 'Gain ajouté ✨', 'success');
        // Re-render parent view
        const view = document.querySelector('[data-view-root]');
        if (view) renderGains(view);
        return true;
      } catch (e) { toast(e.message, 'error'); return false; }
    }
  });
}
