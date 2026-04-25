import { api } from '../api.js';
import { fmtEUR, fmtDate, escapeHtml, today } from '../utils/format.js';
import { toast } from '../components/toast.js';
import { openModal, confirmDanger } from '../components/modal.js';

const COLS = [
  { id: 'pending',     label: 'À faire' },
  { id: 'in_progress', label: 'En cours' },
  { id: 'completed',   label: 'Terminé' },
];

export async function renderTasks(root) {
  root.innerHTML = `
    <div class="view fade-up">
      <div class="view-header">
        <div><h2>Tâches</h2><p class="secondary">Glissez-déposez pour changer l'état. Cocher une tâche ajoute son montant aux gains.</p></div>
        <button class="btn btn-primary" data-add>+ Nouvelle tâche</button>
      </div>
      <div class="kanban" data-kanban>
        ${COLS.map(c => `
          <div class="kanban-col" data-col="${c.id}">
            <h4>${c.label}<span class="badge badge-accent" data-count="${c.id}">0</span></h4>
            <div data-list="${c.id}"></div>
          </div>`).join('')}
      </div>
    </div>
  `;

  const { tasks } = await api.get('/tasks');
  draw(tasks);

  root.querySelector('[data-add]').onclick = () => openTaskModal();

  function draw(list) {
    COLS.forEach(c => {
      const el = root.querySelector(`[data-list="${c.id}"]`);
      const arr = list.filter(t => t.status === c.id);
      root.querySelector(`[data-count="${c.id}"]`).textContent = arr.length;
      el.innerHTML = arr.map(t => `
        <div class="task-card" draggable="true" data-id="${t.id}">
          <div class="title">${escapeHtml(t.title)}</div>
          <div class="meta">
            <span style="display:flex;align-items:center;gap:6px">
              <span class="priority-dot ${t.priority||'normal'}"></span>${fmtDate(t.dueDate)}
            </span>
            <span class="amount">${fmtEUR(t.amount)}</span>
          </div>
          <div style="display:flex;gap:6px;justify-content:flex-end;margin-top:6px">
            ${t.status!=='completed'?`<button class="btn btn-ghost btn-sm" data-complete="${t.id}">✓ Terminer</button>`:''}
            <button class="btn btn-ghost btn-sm" data-edit="${t.id}">Modifier</button>
            <button class="btn btn-ghost btn-sm" data-del="${t.id}">×</button>
          </div>
        </div>`).join('') || '<p class="muted" style="font-size:12px;text-align:center;padding:24px 0">Vide</p>';
    });
    bind(list);
  }

  function bind(list) {
    root.querySelectorAll('.task-card').forEach(card => {
      card.ondragstart = (e) => { e.dataTransfer.setData('text', card.dataset.id); card.classList.add('dragging'); };
      card.ondragend = () => card.classList.remove('dragging');
    });
    root.querySelectorAll('.kanban-col').forEach(col => {
      col.ondragover = (e) => { e.preventDefault(); col.classList.add('drop-target'); };
      col.ondragleave = () => col.classList.remove('drop-target');
      col.ondrop = async (e) => {
        e.preventDefault(); col.classList.remove('drop-target');
        const id = e.dataTransfer.getData('text');
        const newStatus = col.dataset.col;
        const t = list.find(x => x.id === id);
        if (!t || t.status === newStatus) return;
        if (newStatus === 'completed') {
          await api.patch(`/tasks/${id}/complete`); toast(`+ ${fmtEUR(t.amount)} ajouté ✨`, 'success');
        } else {
          await api.put(`/tasks/${id}`, { ...t, status: newStatus });
        }
        const { tasks } = await api.get('/tasks'); draw(tasks);
      };
    });
    root.querySelectorAll('[data-complete]').forEach(b => b.onclick = async () => {
      const t = list.find(x => x.id === b.dataset.complete);
      await api.patch(`/tasks/${b.dataset.complete}/complete`);
      toast(`+ ${fmtEUR(t.amount)} ajouté ✨`, 'success');
      const { tasks } = await api.get('/tasks'); draw(tasks);
    });
    root.querySelectorAll('[data-edit]').forEach(b => b.onclick = () => openTaskModal(list.find(x => x.id === b.dataset.edit)));
    root.querySelectorAll('[data-del]').forEach(b => b.onclick = async () => {
      if (!await confirmDanger('Supprimer la tâche ?', 'Action irréversible.')) return;
      await api.delete(`/tasks/${b.dataset.del}`);
      const { tasks } = await api.get('/tasks'); draw(tasks);
      toast('Tâche supprimée', 'success');
    });
  }
}

async function openTaskModal(task = null) {
  const isEdit = !!task;
  const body = `
    <form class="field" data-form>
      <div class="field"><label>Titre</label><input class="input" name="title" required maxlength="200" value="${escapeHtml(task?.title||'')}"></div>
      <div style="display:flex;gap:12px;margin-top:12px">
        <div class="field" style="flex:1"><label>Montant (€)</label><input class="input" name="amount" type="number" step="0.01" min="0" required value="${task?.amount||''}"></div>
        <div class="field" style="flex:1"><label>Échéance</label><input class="input" name="dueDate" type="date" value="${task?.dueDate||today()}"></div>
      </div>
      <div style="display:flex;gap:12px;margin-top:12px">
        <div class="field" style="flex:1"><label>Priorité</label>
          <select class="select" name="priority">
            <option value="low" ${task?.priority==='low'?'selected':''}>Basse</option>
            <option value="normal" ${(!task||task.priority==='normal')?'selected':''}>Normale</option>
            <option value="urgent" ${task?.priority==='urgent'?'selected':''}>Urgente</option>
          </select>
        </div>
        <div class="field" style="flex:1"><label>Statut</label>
          <select class="select" name="status">
            <option value="pending" ${(!task||task.status==='pending')?'selected':''}>À faire</option>
            <option value="in_progress" ${task?.status==='in_progress'?'selected':''}>En cours</option>
            <option value="completed" ${task?.status==='completed'?'selected':''}>Terminé</option>
          </select>
        </div>
      </div>
    </form>
  `;
  await openModal({
    title: isEdit ? 'Modifier la tâche' : 'Nouvelle tâche', body,
    primaryLabel: isEdit ? 'Enregistrer' : 'Créer',
    onConfirm: async (overlay) => {
      const data = Object.fromEntries(new FormData(overlay.querySelector('[data-form]')));
      data.amount = +data.amount;
      try {
        if (isEdit) await api.put(`/tasks/${task.id}`, data); else await api.post('/tasks', data);
        toast(isEdit ? 'Tâche modifiée' : 'Tâche créée', 'success');
        const view = document.querySelector('[data-view-root]'); if (view) renderTasks(view);
        return true;
      } catch (e) { toast(e.message, 'error'); return false; }
    }
  });
}
