import { auth } from '../auth.js';
import { escapeHtml } from '../utils/format.js';

const TITLES = {
  dashboard: 'Dashboard',
  gains: 'Mes gains',
  tasks: 'Tâches',
  goals: 'Objectifs',
  stats: 'Statistiques',
  settings: 'Paramètres',
};

export function renderTopbar(root, route, ctx = {}) {
  root.innerHTML = `
    <h2>${escapeHtml(TITLES[route] || '')}</h2>
    <div class="search">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
      <input class="input" placeholder="Rechercher…" />
      <span class="kbd">⌘K</span>
    </div>
    <div class="right">
      <button class="btn btn-ghost btn-icon" title="Notifications">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10 21a2 2 0 0 0 4 0"/></svg>
      </button>
      <button class="btn btn-ghost" data-logout>Déconnexion</button>
    </div>
  `;
  root.querySelector('[data-logout]').onclick = () => auth.logout();
}
