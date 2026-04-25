// Trajex — Map mock (SVG roads + route + pins)
function MapMock({ height = 220, accent = '#2563EB', dark = false, animated = true }) {
  const lineColor = dark ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.07)';
  const roadColor = dark ? 'rgba(255,255,255,0.04)' : 'rgba(15,23,42,0.04)';
  return (
    <svg width="100%" height={height} viewBox="0 0 400 220" preserveAspectRatio="xMidYMid slice" style={{ display:'block' }}>
      <rect width="400" height="220" fill={dark ? '#0e131e' : '#f1f5f9'}/>

      {/* Blocks */}
      {[
        [10,10,80,60],[100,10,90,50],[200,10,90,60],[300,10,90,40],
        [10,80,80,60],[100,70,90,80],[200,80,90,60],[300,60,90,80],
        [10,150,80,60],[100,160,90,50],[200,150,90,60],[300,150,90,60],
      ].map((b, i) => (
        <rect key={i} x={b[0]} y={b[1]} width={b[2]} height={b[3]} fill={roadColor} rx="2"/>
      ))}

      {/* Streets */}
      <path d="M0 70 L400 70" stroke={lineColor} strokeWidth="6"/>
      <path d="M0 145 L400 145" stroke={lineColor} strokeWidth="4"/>
      <path d="M95 0 L95 220" stroke={lineColor} strokeWidth="4"/>
      <path d="M195 0 L195 220" stroke={lineColor} strokeWidth="6"/>
      <path d="M295 0 L295 220" stroke={lineColor} strokeWidth="4"/>

      {/* Diagonals */}
      <path d="M0 220 L150 100 L260 130 L400 50" stroke={lineColor} strokeWidth="2" fill="none"/>

      {/* Route */}
      <path d="M40 180 L95 180 L95 145 L195 145 L195 70 L295 70 L295 30"
        stroke={accent} strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round"
        strokeDasharray="4 6"
        style={animated ? { animation: 'tjx-dash 1.2s linear infinite' } : null}/>
      <style>{`@keyframes tjx-dash { to { stroke-dashoffset: -20; } }`}</style>

      {/* Pins */}
      <circle cx="40" cy="180" r="6" fill="#fff" stroke={accent} strokeWidth="2.5"/>
      <circle cx="295" cy="30" r="9" fill={accent}/>
      <circle cx="295" cy="30" r="3" fill="#fff"/>
      {/* Truck icon midway */}
      <g transform="translate(180,134)">
        <circle r="13" fill={accent}/>
        <rect x="-7" y="-3" width="10" height="6" rx="1" fill="#fff"/>
        <path d="M3 -1 L6 -1 L8 2 L8 3 L3 3 Z" fill="#fff"/>
        <circle cx="-3" cy="4" r="1.5" fill={accent}/>
        <circle cx="5" cy="4" r="1.5" fill={accent}/>
      </g>
    </svg>
  );
}

// Trajex — Condition monitoring chart
function ConditionChart({ accent = '#2563EB', dark = false, height = 110 }) {
  const data1 = [22,24,21,25,28,26,23,22,24,23,25,23];
  const data2 = [38,42,40,45,48,46,42,40,44,42,45,42];
  const w = 240, h = height;
  const max = 60, min = 0;
  const toPath = (arr) => arr.map((v,i) => {
    const x = (i/(arr.length-1)) * w;
    const y = h - ((v - min)/(max-min)) * h;
    return (i?'L':'M') + x.toFixed(1) + ' ' + y.toFixed(1);
  }).join(' ');

  return (
    <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id="cc-g1" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={accent} stopOpacity="0.35"/>
          <stop offset="1" stopColor={accent} stopOpacity="0"/>
        </linearGradient>
        <linearGradient id="cc-g2" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#22c55e" stopOpacity="0.25"/>
          <stop offset="1" stopColor="#22c55e" stopOpacity="0"/>
        </linearGradient>
      </defs>
      {[20,40,60].map((y,i) => (
        <line key={i} x1="0" x2={w} y1={h-(y/max)*h} y2={h-(y/max)*h} stroke={dark ? 'rgba(255,255,255,0.06)' : 'rgba(15,23,42,0.05)'} strokeDasharray="2 4"/>
      ))}
      <path d={toPath(data1) + ` L ${w} ${h} L 0 ${h} Z`} fill="url(#cc-g1)"/>
      <path d={toPath(data1)} fill="none" stroke={accent} strokeWidth="2" strokeLinecap="round"/>
      <path d={toPath(data2) + ` L ${w} ${h} L 0 ${h} Z`} fill="url(#cc-g2)"/>
      <path d={toPath(data2)} fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

// Bar chart (mechanical condition)
function BarsChart({ data, accent = '#2563EB', dark = false }) {
  // data: [{label, value}]
  return (
    <div style={{ display:'flex', gap: 10, alignItems:'flex-end', height: 70 }}>
      {data.map((d, i) => {
        const h = (d.value / 100) * 60;
        const good = d.value >= 85;
        return (
          <div key={i} style={{ flex: 1, display:'flex', flexDirection:'column', alignItems:'center', gap: 6 }}>
            <span className="tjx-num" style={{ fontSize: 10, fontWeight: 600, color: dark ? '#cfd6e4' : '#475569' }}>{d.value}%</span>
            <div style={{
              width: '100%', maxWidth: 22, height: h, borderRadius: 6,
              background: good ? accent : '#f59e0b',
              opacity: good ? 1 : 0.85,
            }}/>
            <span style={{ fontSize: 9.5, color: dark ? '#8a93a6' : '#64748b', fontWeight: 500 }}>{d.label}</span>
          </div>
        );
      })}
    </div>
  );
}

// Distribution bars
function DistBar({ pct, color, label, dark }) {
  const segments = 12;
  const filled = Math.round((pct/100) * segments);
  return (
    <div style={{ display:'flex', flexDirection:'column', gap: 6, flex: 1, alignItems:'center' }}>
      <span className="tjx-num" style={{ fontSize: 22, fontWeight: 700, color: dark ? '#e6eaf2' : '#0f172a' }}>{pct}%</span>
      <div style={{ display:'flex', flexDirection:'column-reverse', gap: 2, width: '100%', maxWidth: 36, height: 60 }}>
        {Array.from({length: segments}).map((_,i) => (
          <div key={i} style={{
            flex: 1,
            background: i < filled ? color : (dark ? 'rgba(255,255,255,0.06)' : 'rgba(15,23,42,0.06)'),
            borderRadius: 2,
          }}/>
        ))}
      </div>
      <span style={{ fontSize: 10, color: dark ? '#8a93a6' : '#64748b', textAlign:'center' }}>{label}</span>
    </div>
  );
}

Object.assign(window, { MapMock, ConditionChart, BarsChart, DistBar });
