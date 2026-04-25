import { auth } from '../auth.js';
import { toast } from '../components/toast.js';
import { storage } from '../utils/storage.js';

export async function renderSettings(root) {
  const u = auth.user() || {};
  root.innerHTML = `
    <div class="view fade-up">
      <div class="view-header">
        <div><h2>Paramètres</h2><p class="secondary">Profil, préférences et données.</p></div>
      </div>
      <div class="settings-grid">
        <div class="menu">
          <div class="item active">Profil</div>
          <div class="item">Préférences</div>
          <div class="item">Données</div>
        </div>
        <div style="display:flex;flex-direction:column;gap:24px">
          <div class="card">
            <h3 style="margin-bottom:16px">Profil</h3>
            <div style="display:flex;gap:24px;align-items:center;margin-bottom:24px">
              <div class="avatar" style="width:72px;height:72px;font-size:24px">${(u.name||'U').split(' ').map(s=>s[0]).slice(0,2).join('').toUpperCase()}</div>
              <div>
                <div style="font-weight:600;font-size:16px">${u.name||'Utilisateur'}</div>
                <div class="muted" style="font-size:13px">${u.email||'—'}</div>
                <div class="badge badge-accent" style="margin-top:8px">Plan ${u.plan||'free'}</div>
              </div>
            </div>
            <div style="display:flex;gap:12px">
              <div class="field" style="flex:1"><label>Nom</label><input class="input" value="${u.name||''}" data-name></div>
              <div class="field" style="flex:1"><label>Email</label><input class="input" value="${u.email||''}" disabled></div>
            </div>
            <button class="btn btn-primary" style="margin-top:16px" data-save>Enregistrer</button>
          </div>
          <div class="card">
            <h3 style="margin-bottom:16px">Préférences</h3>
            <div style="display:flex;justify-content:space-between;align-items:center;padding:12px 0;border-bottom:1px solid var(--border)">
              <div><div style="font-weight:500">Devise</div><div class="muted" style="font-size:12px">Affichage des montants</div></div>
              <select class="select" style="width:auto" data-currency><option>EUR €</option><option>USD $</option><option>GBP £</option></select>
            </div>
            <div style="display:flex;justify-content:space-between;align-items:center;padding:12px 0">
              <div><div style="font-weight:500">Réinitialiser la démo</div><div class="muted" style="font-size:12px">Restaurer les données de seed (mode démo uniquement)</div></div>
              <button class="btn btn-ghost btn-sm" data-reset>Réinitialiser</button>
            </div>
          </div>
          <div class="card" style="border-color:rgba(255,77,109,0.2)">
            <h3 style="margin-bottom:8px;color:var(--danger)">Zone dangereuse</h3>
            <p style="font-size:13px;margin-bottom:16px">La déconnexion supprimera votre session locale.</p>
            <button class="btn btn-danger" data-logout>Se déconnecter</button>
          </div>
        </div>
      </div>
    </div>
  `;
  root.querySelector('[data-save]').onclick = () => toast('Préférences enregistrées', 'success');
  root.querySelector('[data-reset]').onclick = () => {
    storage.remove('mf_mock_db'); toast('Données démo réinitialisées — rechargement…', 'info');
    setTimeout(() => location.reload(), 700);
  };
  root.querySelector('[data-logout]').onclick = () => auth.logout();
}
