// Trajex — Truck SVG illustration (original, simplified semi-trailer side view)
function TruckSVG({ width = 520, height = 220, cells, selectedCell, onCellClick, accent = '#2563EB', dark = false }) {
  // 12 cargo cells in 2 rows × 6 cols overlaid on trailer
  return (
    <svg width="100%" viewBox={`0 0 ${width} ${height}`} style={{ display:'block' }}>
      <defs>
        <linearGradient id="tjx-trailer" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={dark ? '#1e2533' : '#f8fafc'}/>
          <stop offset="1" stopColor={dark ? '#0f1420' : '#e2e8f0'}/>
        </linearGradient>
        <linearGradient id="tjx-cab" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={dark ? '#293142' : '#ffffff'}/>
          <stop offset="1" stopColor={dark ? '#161b27' : '#cbd5e1'}/>
        </linearGradient>
      </defs>

      {/* Ground shadow */}
      <ellipse cx={width/2} cy={height-8} rx={width*0.42} ry="6" fill={dark ? 'rgba(0,0,0,0.5)' : 'rgba(15,23,42,0.08)'}/>

      {/* Trailer body */}
      <rect x="20" y="40" width="380" height="130" rx="8" fill="url(#tjx-trailer)" stroke={dark ? '#2a3142' : '#cbd5e1'} strokeWidth="1"/>
      {/* Trailer top rib */}
      <rect x="20" y="40" width="380" height="6" fill={dark ? '#0e131e' : '#94a3b8'} opacity="0.4"/>
      {/* Trailer panels */}
      {[0,1,2,3,4].map(i => (
        <line key={i} x1={20 + 76*(i+1)} y1="46" x2={20 + 76*(i+1)} y2="170" stroke={dark ? '#2a3142' : '#cbd5e1'} strokeWidth="0.6" opacity="0.6"/>
      ))}
      {/* Trailer skirt */}
      <rect x="20" y="170" width="380" height="14" fill={dark ? '#0a0f1a' : '#94a3b8'} opacity="0.5"/>

      {/* Cab */}
      <path d={`M 400 70 Q 405 60 415 60 L 470 60 Q 485 60 488 75 L 495 100 L 500 110 L 500 170 L 400 170 Z`} fill="url(#tjx-cab)" stroke={dark ? '#2a3142' : '#cbd5e1'} strokeWidth="1"/>
      {/* Windshield */}
      <path d={`M 415 68 L 470 68 Q 480 68 482 78 L 488 98 L 415 98 Z`} fill={dark ? '#0a0f1a' : '#1e293b'} opacity="0.85"/>
      <path d={`M 419 72 L 466 72 Q 474 72 476 80 L 481 95 L 419 95 Z`} fill={dark ? '#0a0f1a' : '#334155'} opacity="0.4"/>
      {/* Door */}
      <rect x="408" y="108" width="3" height="48" fill={dark ? '#3a4255' : '#94a3b8'} opacity="0.5"/>
      {/* Headlight */}
      <rect x="494" y="118" width="6" height="14" rx="1" fill={accent}/>

      {/* Wheels */}
      {[80, 200, 280, 470].map((cx,i) => (
        <g key={i}>
          <circle cx={cx} cy="184" r="18" fill={dark ? '#0a0e17' : '#1e293b'}/>
          <circle cx={cx} cy="184" r="10" fill={dark ? '#1a2030' : '#334155'}/>
          <circle cx={cx} cy="184" r="4" fill={dark ? '#3a4255' : '#94a3b8'}/>
        </g>
      ))}
      {/* Rear wheel pair */}
      {[230].map((cx,i) => (
        <g key={'r'+i}>
          <circle cx={cx} cy="184" r="18" fill={dark ? '#0a0e17' : '#1e293b'}/>
          <circle cx={cx} cy="184" r="10" fill={dark ? '#1a2030' : '#334155'}/>
        </g>
      ))}

      {/* Cargo grid overlay (interactive) */}
      <g transform="translate(28, 50)">
        {cells.map((cell, i) => {
          const col = i % 6, row = Math.floor(i / 6);
          const cw = 60, ch = 56, gap = 2;
          const x = col * (cw + gap), y = row * (ch + gap);
          const isSel = selectedCell === i;
          const filled = cell.kg > 0;
          return (
            <g key={i} onClick={() => onCellClick && onCellClick(i)} style={{ cursor: onCellClick ? 'pointer' : 'default' }}>
              <rect x={x} y={y} width={cw} height={ch} rx="6"
                fill={isSel ? accent : (filled ? hexToRgba(accent, 0.85) : (dark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.85)'))}
                stroke={isSel ? '#fff' : (dark ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.1)')}
                strokeWidth={isSel ? 2 : 1}
              />
              <text x={x + cw/2} y={y + 18} textAnchor="middle" fontSize="8.5" fontWeight="600"
                fill={isSel || filled ? '#fff' : (dark ? '#cfd6e4' : '#475569')}
                fontFamily="Manrope, system-ui">{cell.id}</text>
              <text x={x + cw/2} y={y + 36} textAnchor="middle" fontSize="11" fontWeight="700"
                fill={isSel || filled ? '#fff' : (dark ? '#e6eaf2' : '#0f172a')}
                fontFamily="Manrope, system-ui">{cell.kg ? cell.kg + 'kg' : '+'}</text>
              {filled && !isSel && (
                <circle cx={x + cw/2} cy={y + 46} r="2.2" fill="#fff" opacity="0.7"/>
              )}
            </g>
          );
        })}
      </g>
    </svg>
  );
}

// Mini truck card image (for list items)
function TruckMini({ accent = '#2563EB', dark = false, size = 56 }) {
  return (
    <svg width={size*1.3} height={size} viewBox="0 0 80 60" fill="none">
      <rect x="3" y="14" width="46" height="32" rx="3" fill={dark ? '#1e2533' : '#f1f5f9'} stroke={dark ? '#2a3142' : '#cbd5e1'} strokeWidth="0.8"/>
      <path d="M49 22 L62 22 L72 32 L72 46 L49 46 Z" fill={dark ? '#293142' : '#ffffff'} stroke={dark ? '#2a3142' : '#cbd5e1'} strokeWidth="0.8"/>
      <path d="M52 26 L60 26 L67 33 L52 33 Z" fill={dark ? '#0a0f1a' : '#334155'} opacity="0.7"/>
      <rect x="69" y="36" width="3" height="4" fill={accent}/>
      <circle cx="14" cy="48" r="6" fill={dark ? '#0a0e17' : '#1e293b'}/>
      <circle cx="14" cy="48" r="2.5" fill={dark ? '#3a4255' : '#94a3b8'}/>
      <circle cx="38" cy="48" r="6" fill={dark ? '#0a0e17' : '#1e293b'}/>
      <circle cx="38" cy="48" r="2.5" fill={dark ? '#3a4255' : '#94a3b8'}/>
      <circle cx="62" cy="48" r="6" fill={dark ? '#0a0e17' : '#1e293b'}/>
      <circle cx="62" cy="48" r="2.5" fill={dark ? '#3a4255' : '#94a3b8'}/>
    </svg>
  );
}

// Mini van/car for variation
function VanMini({ accent = '#2563EB', dark = false, size = 56 }) {
  return (
    <svg width={size*1.3} height={size} viewBox="0 0 80 60" fill="none">
      <path d="M5 20 L50 20 L62 30 L72 32 L72 46 L5 46 Z" fill={dark ? '#293142' : '#ffffff'} stroke={dark ? '#2a3142' : '#cbd5e1'} strokeWidth="0.8"/>
      <rect x="8" y="24" width="20" height="14" rx="1" fill={dark ? '#0a0f1a' : '#334155'} opacity="0.5"/>
      <path d="M52 24 L60 24 L66 30 L52 30 Z" fill={dark ? '#0a0f1a' : '#334155'} opacity="0.7"/>
      <rect x="69" y="36" width="3" height="3" fill={accent}/>
      <circle cx="20" cy="48" r="6" fill={dark ? '#0a0e17' : '#1e293b'}/>
      <circle cx="20" cy="48" r="2.5" fill={dark ? '#3a4255' : '#94a3b8'}/>
      <circle cx="58" cy="48" r="6" fill={dark ? '#0a0e17' : '#1e293b'}/>
      <circle cx="58" cy="48" r="2.5" fill={dark ? '#3a4255' : '#94a3b8'}/>
    </svg>
  );
}

Object.assign(window, { TruckSVG, TruckMini, VanMini });
