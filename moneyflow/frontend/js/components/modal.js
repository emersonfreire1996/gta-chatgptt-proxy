// Modal
import { escapeHtml } from '../utils/format.js';

export function openModal({ title, body, primaryLabel = 'Confirmer', primaryClass = 'btn-primary', cancelLabel = 'Annuler', onConfirm }) {
  return new Promise((resolve) => {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
      <div class="modal" role="dialog" aria-modal="true">
        <h3>${escapeHtml(title)}</h3>
        <div class="modal-body"></div>
        <div class="modal-actions">
          <button class="btn btn-ghost" data-act="cancel">${escapeHtml(cancelLabel)}</button>
          <button class="btn ${primaryClass}" data-act="ok">${escapeHtml(primaryLabel)}</button>
        </div>
      </div>`;
    const bodyEl = overlay.querySelector('.modal-body');
    if (typeof body === 'string') bodyEl.innerHTML = body;
    else if (body instanceof Node) bodyEl.appendChild(body);
    document.body.appendChild(overlay);

    const close = (val) => { overlay.remove(); resolve(val); };
    overlay.addEventListener('click', (e) => { if (e.target === overlay) close(null); });
    overlay.querySelector('[data-act=cancel]').onclick = () => close(null);
    overlay.querySelector('[data-act=ok]').onclick = async () => {
      try {
        const r = onConfirm ? await onConfirm(overlay) : true;
        if (r !== false) close(r ?? true);
      } catch (e) { /* keep open */ }
    };
    document.addEventListener('keydown', function esc(e) {
      if (e.key === 'Escape') { close(null); document.removeEventListener('keydown', esc); }
    });
  });
}

export function confirmDanger(title, message) {
  return openModal({
    title, body: `<p>${escapeHtml(message)}</p>`,
    primaryLabel: 'Supprimer', primaryClass: 'btn-danger',
  });
}
