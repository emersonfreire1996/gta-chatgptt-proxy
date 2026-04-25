// Trajex — primitives shared across dashboard + apps
const { useState, useEffect, useRef, useMemo } = React;

const TJX = {
  bg: '#eef0f4',
  bgDark: '#0a0e17',
  surface: '#ffffff',
  surfaceDark: '#141925',
  ink: '#0f172a',
  inkDark: '#e6eaf2',
  muted: '#64748b',
  mutedDark: '#8a93a6',
  border: 'rgba(15,23,42,0.08)',
  borderDark: 'rgba(255,255,255,0.08)',
};

function getTheme(dark, accent) {
  return {
    bg: dark ? TJX.bgDark : TJX.bg,
    surface: dark ? 'rgba(20,25,35,0.78)' : 'rgba(255,255,255,0.78)',
    surfaceSolid: dark ? '#141925' : '#ffffff',
    ink: dark ? TJX.inkDark : TJX.ink,
    muted: dark ? TJX.mutedDark : TJX.muted,
    border: dark ? TJX.borderDark : TJX.border,
    accent,
    accentSoft: hexToRgba(accent, 0.12),
    accentMid: hexToRgba(accent, 0.55),
    chip: dark ? 'rgba(255,255,255,0.06)' : 'rgba(15,23,42,0.05)',
    chipInk: dark ? '#cfd6e4' : '#334155',
    dark,
  };
}

function hexToRgba(hex, a) {
  const h = hex.replace('#','');
  const r = parseInt(h.slice(0,2),16), g = parseInt(h.slice(2,4),16), b = parseInt(h.slice(4,6),16);
  return `rgba(${r},${g},${b},${a})`;
}

// Glass card
function Card({ children, style, theme, padding = 16, dark }) {
  const t = theme || getTheme(dark, '#2563EB');
  return (
    <div style={{
      background: t.surface,
      backdropFilter: 'blur(20px) saturate(140%)',
      WebkitBackdropFilter: 'blur(20px) saturate(140%)',
      border: `1px solid ${t.dark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.7)'}`,
      borderRadius: 18,
      padding,
      boxShadow: t.dark
        ? '0 8px 24px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.04) inset'
        : '0 1px 0 rgba(255,255,255,0.6) inset, 0 8px 24px rgba(15,23,42,0.06), 0 1px 2px rgba(15,23,42,0.04)',
      color: t.ink,
      ...style,
    }}>{children}</div>
  );
}

// KPI chip used in topbar
function KPI({ icon, label, value, theme, accent }) {
  const I = window.Icons[icon];
  return (
    <div style={{
      display:'flex', alignItems:'center', gap: 10,
      padding: '8px 14px', borderRadius: 12,
      background: theme.dark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.7)',
      border: `1px solid ${theme.border}`,
      minWidth: 140,
    }}>
      <div style={{
        width: 30, height: 30, borderRadius: 8,
        background: accent ? hexToRgba(theme.accent,0.12) : (theme.dark ? 'rgba(255,255,255,0.06)' : 'rgba(15,23,42,0.04)'),
        color: accent ? theme.accent : theme.muted,
        display:'flex', alignItems:'center', justifyContent:'center',
      }}><I size={16}/></div>
      <div style={{ display:'flex', flexDirection:'column', lineHeight: 1.1 }}>
        <span style={{ fontSize: 10.5, color: theme.muted, fontWeight: 500, letterSpacing: '.02em' }}>{label}</span>
        <span className="tjx-num" style={{ fontSize: 16, fontWeight: 700, color: theme.ink, marginTop: 2 }}>{value}</span>
      </div>
    </div>
  );
}

// Status pill
function Pill({ children, color = '#2563EB', soft = true, theme }) {
  return (
    <span style={{
      display:'inline-flex', alignItems:'center', gap: 6,
      padding: '3px 10px', borderRadius: 999,
      background: soft ? hexToRgba(color, 0.12) : color,
      color: soft ? color : '#fff',
      fontSize: 11, fontWeight: 600,
    }}>
      <span style={{ width:6, height:6, borderRadius:99, background: color }}/>
      {children}
    </span>
  );
}

// Progress bar
function Bar({ value, color = '#2563EB', theme, height = 6 }) {
  return (
    <div className="tjx-track" style={{ height, background: theme?.dark ? 'rgba(255,255,255,0.08)' : undefined }}>
      <div style={{ width: `${Math.min(100,Math.max(0,value))}%`, background: color }}/>
    </div>
  );
}

// Sidebar item
function SideItem({ icon, active, theme, onClick, accent }) {
  const I = window.Icons[icon];
  return (
    <button className="tjx-btn" onClick={onClick} style={{
      width: 44, height: 44, borderRadius: 12,
      display:'flex', alignItems:'center', justifyContent:'center',
      background: active ? (accent || theme.accent) : 'transparent',
      color: active ? '#fff' : theme.muted,
      transition: 'all .15s',
    }}>
      <I size={18}/>
    </button>
  );
}

// Avatar (initials, no image)
function Avatar({ name = 'L D', color = '#2563EB', size = 32 }) {
  const initials = name.split(' ').map(s=>s[0]).slice(0,2).join('').toUpperCase();
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: `linear-gradient(135deg, ${color}, ${hexToRgba(color, 0.6)})`,
      color: '#fff', fontWeight: 700, fontSize: size*0.38,
      display:'flex', alignItems:'center', justifyContent:'center',
      boxShadow: '0 2px 6px rgba(15,23,42,0.15)',
    }}>{initials}</div>
  );
}

// Tiny sparkline
function Spark({ data, color = '#2563EB', width = 100, height = 32, fill = true }) {
  const max = Math.max(...data), min = Math.min(...data);
  const range = max - min || 1;
  const pts = data.map((v,i) => [(i/(data.length-1))*width, height - ((v-min)/range)*height]);
  const path = pts.map((p,i) => (i?'L':'M')+p[0].toFixed(1)+' '+p[1].toFixed(1)).join(' ');
  const fillPath = path + ` L ${width} ${height} L 0 ${height} Z`;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {fill && <path d={fillPath} fill={color} fillOpacity="0.12"/>}
      <path d={path} fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

window.TJX = TJX;
window.getTheme = getTheme;
window.hexToRgba = hexToRgba;
Object.assign(window, { Card, KPI, Pill, Bar, SideItem, Avatar, Spark });
