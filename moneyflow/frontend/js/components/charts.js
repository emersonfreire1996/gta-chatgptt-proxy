// Lightweight Canvas charts — line, bar, donut, ring
const DPR = () => window.devicePixelRatio || 1;
function setupCanvas(canvas, w, h) {
  const r = DPR(); canvas.width = w * r; canvas.height = h * r;
  canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
  const ctx = canvas.getContext('2d'); ctx.scale(r, r); return ctx;
}
function roundRect(ctx, x, y, w, h, r) {
  if (w < 2*r) r = w/2; if (h < 2*r) r = h/2;
  ctx.beginPath();
  ctx.moveTo(x+r,y); ctx.arcTo(x+w,y,x+w,y+h,r); ctx.arcTo(x+w,y+h,x,y+h,r);
  ctx.arcTo(x,y+h,x,y,r); ctx.arcTo(x,y,x+w,y,r); ctx.closePath();
}

export function lineChart(canvas, data, opts = {}) {
  const w = canvas.clientWidth || opts.width || 600;
  const h = opts.height || 220;
  const ctx = setupCanvas(canvas, w, h);
  const padding = { l: 40, r: 12, t: 16, b: 24 };
  const W = w - padding.l - padding.r, H = h - padding.t - padding.b;
  const values = data.map(d => d.amount);
  const max = Math.max(1, ...values) * 1.15;
  const stepX = data.length > 1 ? W / (data.length - 1) : W;
  const color = opts.color || '#6C63FF';

  // Grid
  ctx.strokeStyle = 'rgba(255,255,255,0.05)'; ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = padding.t + (H / 4) * i;
    ctx.beginPath(); ctx.moveTo(padding.l, y); ctx.lineTo(padding.l + W, y); ctx.stroke();
    ctx.fillStyle = '#4A4A5C'; ctx.font = '11px Inter'; ctx.textAlign = 'right';
    ctx.fillText(Math.round(max - (max/4)*i) + '€', padding.l - 6, y + 3);
  }

  // Area
  const grad = ctx.createLinearGradient(0, padding.t, 0, padding.t + H);
  grad.addColorStop(0, color + '50'); grad.addColorStop(1, color + '00');
  ctx.fillStyle = grad; ctx.beginPath();
  ctx.moveTo(padding.l, padding.t + H);
  data.forEach((d, i) => {
    const x = padding.l + i * stepX;
    const y = padding.t + H - (d.amount / max) * H;
    ctx.lineTo(x, y);
  });
  ctx.lineTo(padding.l + (data.length-1) * stepX, padding.t + H); ctx.closePath(); ctx.fill();

  // Line
  ctx.strokeStyle = color; ctx.lineWidth = 2.4; ctx.lineJoin = 'round'; ctx.beginPath();
  data.forEach((d, i) => {
    const x = padding.l + i * stepX;
    const y = padding.t + H - (d.amount / max) * H;
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  });
  ctx.stroke();

  // Last point
  if (data.length) {
    const last = data[data.length-1];
    const x = padding.l + (data.length-1) * stepX;
    const y = padding.t + H - (last.amount / max) * H;
    ctx.fillStyle = color; ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI*2); ctx.fill();
    ctx.strokeStyle = '#0F0F17'; ctx.lineWidth = 2; ctx.stroke();
  }
}

export function barChart(canvas, data, opts = {}) {
  const w = canvas.clientWidth || 600, h = opts.height || 220;
  const ctx = setupCanvas(canvas, w, h);
  const padding = { l: 40, r: 12, t: 16, b: 24 };
  const W = w - padding.l - padding.r, H = h - padding.t - padding.b;
  const values = data.map(d => d.amount);
  const max = Math.max(1, ...values) * 1.15;
  const barW = (W / data.length) * 0.55;
  const gap = (W / data.length) * 0.45;
  const color = opts.color || '#6C63FF';

  ctx.strokeStyle = 'rgba(255,255,255,0.05)';
  for (let i=0;i<=4;i++){const y=padding.t+(H/4)*i;ctx.beginPath();ctx.moveTo(padding.l,y);ctx.lineTo(padding.l+W,y);ctx.stroke();ctx.fillStyle='#4A4A5C';ctx.font='11px Inter';ctx.textAlign='right';ctx.fillText(Math.round(max-(max/4)*i)+'€',padding.l-6,y+3);}

  data.forEach((d, i) => {
    const x = padding.l + i * (barW + gap) + gap/2;
    const bh = (d.amount / max) * H;
    const y = padding.t + H - bh;
    const grad = ctx.createLinearGradient(0, y, 0, y+bh);
    grad.addColorStop(0, color); grad.addColorStop(1, color + '60');
    ctx.fillStyle = grad; roundRect(ctx, x, y, barW, bh, 4); ctx.fill();
  });
}

export function donutChart(canvas, data, opts = {}) {
  const size = opts.size || 200;
  const ctx = setupCanvas(canvas, size, size);
  const cx = size/2, cy = size/2, r = size/2 - 8, ir = r - 28;
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  let angle = -Math.PI / 2;
  data.forEach(d => {
    const slice = (d.value / total) * Math.PI * 2;
    ctx.beginPath();
    ctx.arc(cx, cy, r, angle, angle + slice);
    ctx.arc(cx, cy, ir, angle + slice, angle, true);
    ctx.closePath();
    ctx.fillStyle = d.color; ctx.fill();
    angle += slice;
  });
}

export function ring(canvas, percent, opts = {}) {
  const size = opts.size || 200;
  const ctx = setupCanvas(canvas, size, size);
  const cx = size/2, cy = size/2, r = size/2 - 12;
  ctx.lineWidth = opts.thickness || 14; ctx.lineCap = 'round';
  ctx.strokeStyle = 'rgba(255,255,255,0.06)';
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI*2); ctx.stroke();
  const grad = ctx.createLinearGradient(0,0,size,size);
  grad.addColorStop(0, '#6C63FF'); grad.addColorStop(1, '#00D4AA');
  ctx.strokeStyle = grad;
  ctx.beginPath();
  ctx.arc(cx, cy, r, -Math.PI/2, -Math.PI/2 + (Math.PI*2)*Math.min(1, Math.max(0, percent/100)));
  ctx.stroke();
  if (opts.label) {
    ctx.fillStyle = '#F5F5F7'; ctx.font = `600 ${size*0.18}px Space Grotesk`; ctx.textAlign = 'center';
    ctx.fillText(opts.label, cx, cy + size*0.06);
    if (opts.sub) { ctx.fillStyle = '#8B8B9E'; ctx.font = '11px Inter'; ctx.fillText(opts.sub, cx, cy + size*0.20); }
  }
}

export function sparkline(canvas, values, color = '#6C63FF') {
  const w = opts_w(canvas, 80), h = 30;
  const ctx = setupCanvas(canvas, w, h);
  const max = Math.max(1, ...values), min = Math.min(...values, 0);
  const range = max - min || 1;
  ctx.strokeStyle = color; ctx.lineWidth = 1.6; ctx.beginPath();
  values.forEach((v, i) => {
    const x = (i / (values.length - 1 || 1)) * w;
    const y = h - ((v - min) / range) * h;
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  });
  ctx.stroke();
}
function opts_w(c, d) { return c.clientWidth || d; }
