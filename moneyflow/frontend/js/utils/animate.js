// Animation helpers
export function countUp(el, from, to, duration = 1200, formatter = (n) => Math.round(n)) {
  const start = performance.now();
  const ease = (t) => 1 - Math.pow(1 - t, 5); // ease-out-expo-ish
  function frame(now) {
    const t = Math.min(1, (now - start) / duration);
    const v = from + (to - from) * ease(t);
    el.textContent = formatter(v);
    if (t < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

export function staggerIn(els, base = 80) {
  Array.from(els).forEach((el, i) => {
    el.style.animation = 'none';
    void el.offsetWidth;
    el.style.animation = `mf-fade-up 0.5s cubic-bezier(0.2,0.8,0.2,1) ${i * base}ms both`;
  });
}
