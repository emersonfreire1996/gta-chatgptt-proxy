// Format helpers
export const fmtEUR = (n) => new Intl.NumberFormat('fr-FR', { style:'currency', currency:'EUR', maximumFractionDigits: 0 }).format(n || 0);
export const fmtEUR2 = (n) => new Intl.NumberFormat('fr-FR', { style:'currency', currency:'EUR', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n || 0);
export const fmtNum = (n) => new Intl.NumberFormat('fr-FR').format(n || 0);
export const fmtPct = (n) => `${n >= 0 ? '+' : ''}${(n || 0).toFixed(0)}%`;
export const fmtDate = (s) => { if (!s) return '—'; const d = new Date(s); return d.toLocaleDateString('fr-FR', { day:'2-digit', month:'short' }); };
export const fmtDateLong = (s) => { if (!s) return '—'; const d = new Date(s); return d.toLocaleDateString('fr-FR', { day:'2-digit', month:'long', year:'numeric' }); };
export const today = () => new Date().toISOString().slice(0,10);
export const escapeHtml = (s) => String(s || '').replace(/[&<>"']/g, m => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[m]));

export const SOURCE_META = {
  freelance:    { label: 'Freelance',     color: '#6C63FF', icon: '💼' },
  affiliation:  { label: 'Affiliation',   color: '#00D4AA', icon: '🔗' },
  dropshipping: { label: 'Dropshipping',  color: '#FFB547', icon: '📦' },
  crypto:       { label: 'Crypto',        color: '#FF4D6D', icon: '₿'  },
  investissement:{label: 'Investissement',color: '#06b6d4', icon: '📊' },
  contenu:      { label: 'Contenu',       color: '#a855f7', icon: '🎬' },
  coaching:     { label: 'Coaching',      color: '#f59e0b', icon: '🎯' },
  autre:        { label: 'Autre',         color: '#8B8B9E', icon: '✨' },
};
