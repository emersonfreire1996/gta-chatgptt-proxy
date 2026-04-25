// Toast system
const stack = (() => {
  let el = document.querySelector('.toast-stack');
  if (!el) { el = document.createElement('div'); el.className = 'toast-stack'; document.body.appendChild(el); }
  return el;
})();

export function toast(message, type = 'info', duration = 3200) {
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.innerHTML = `<span class="dot"></span><div class="body"></div><button class="close" aria-label="Fermer">×</button>`;
  t.querySelector('.body').textContent = message;
  stack.appendChild(t);
  const close = () => { t.classList.add('removing'); setTimeout(() => t.remove(), 250); };
  t.querySelector('.close').onclick = close;
  setTimeout(close, duration);
  return t;
}
