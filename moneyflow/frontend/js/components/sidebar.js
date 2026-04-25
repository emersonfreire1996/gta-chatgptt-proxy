import { auth } from '../auth.js';

const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: 'home' },
  { id: 'gains', label: 'Mes Gains', icon: 'wallet' },
  { id: 'tasks', label: 'Tâches', icon: 'check' },
  { id: 'goals', label: 'Objectifs', icon: 'target' },
  { id: 'stats', label: 'Statistiques', icon: 'chart' },
  { id: 'settings', label: 'Paramètres', icon: 'gear' },
];

const ICONS = {
  home: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12 12 4l9 8M5 10v10h14V10"/></svg>',
  wallet:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 7h15a3 3 0 0 1 3 3v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Zm0 0V6a2 2 0 0 1 2-2h11M17 13h2"/></svg>',
  check: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m4 12 5 5L20 6"/></svg>',
  target:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/></svg>',
  chart: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></svg>',
  gear:  '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1A2 2 0 1 1 4.3 17l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1A2 2 0 1 1 7 4.3l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z"/></svg>',
  collapse:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m15 6-6 6 6 6"/></svg>',
};

export function renderSidebar(root, currentRoute, onNav) {
  const u = auth.user() || { name: 'Démo', plan: 'free' };
  const initials = (u.name || u.email || 'U').split(' ').map(s=>s[0]).slice(0,2).join('').toUpperCase();
  root.innerHTML = `
    <div class="brand">
      <div class="mark"></div>
      <span>MoneyFlow</span>
    </div>
    <nav>
      ${NAV.map(n => `
        <div class="nav-item ${n.id === currentRoute ? 'active' : ''}" data-nav="${n.id}">
          ${ICONS[n.icon]}
          <span>${n.label}</span>
        </div>`).join('')}
    </nav>
    <div class="user-card">
      <div class="avatar">${initials}</div>
      <div class="info">
        <span class="name">${u.name || 'Utilisateur'}</span>
        <span class="plan">Plan ${u.plan || 'free'}</span>
      </div>
    </div>
    <button class="collapse-btn" data-collapse>${ICONS.collapse}</button>
  `;
  root.querySelectorAll('[data-nav]').forEach(el => {
    el.onclick = () => onNav(el.dataset.nav);
  });
  root.querySelector('[data-collapse]').onclick = () => {
    document.querySelector('.app').classList.toggle('collapsed');
  };
}
