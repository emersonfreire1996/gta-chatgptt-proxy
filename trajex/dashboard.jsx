// Trajex — Web Dashboard (Fleet Management)
function Dashboard({ tweaks }) {
  const { dark, accent, density, vehicleType } = tweaks;
  const t = getTheme(dark, accent);
  const compact = density === 'compact';
  const comfy = density === 'comfy';
  const pad = compact ? 14 : comfy ? 22 : 18;
  const gap = compact ? 12 : comfy ? 20 : 16;

  const [activeNav, setActiveNav] = useState('fleet');
  const [selectedCell, setSelectedCell] = useState(7);
  const [selectedTruck, setSelectedTruck] = useState('TR-001');

  const cells = useMemo(() => [
    {id:'BX-13',kg:0},{id:'BX-14',kg:0},{id:'BX-17',kg:0},{id:'BX-18',kg:400},{id:'BX-19',kg:0},{id:'BX-20',kg:0},
    {id:'BX-09',kg:400},{id:'BX-10',kg:400},{id:'BX-15',kg:700},{id:'BX-16',kg:700},{id:'BX-21',kg:0},{id:'BX-22',kg:300},
  ], []);

  const trucks = [
    { id:'TR-001', model: vehicleType === 'van' ? 'RENAULT MASTER' : 'MAN TGX', burden: '5.000 / 10.000kg', vol:'23 / 45 m³', cap: 50, status:'En route', selected: true },
    { id:'TR-002', model: vehicleType === 'van' ? 'CITROËN JUMPER' : 'SCANIA R-SERIES', cap: 82, status:'En route' },
    { id:'TR-003', model: vehicleType === 'van' ? 'FORD TRANSIT' : 'VOLVO FH', cap: 77, status:'En route' },
    { id:'TR-004', model: vehicleType === 'van' ? 'MERCEDES SPRINTER' : 'IVECO STRALIS', cap: 64, status:'En attente' },
    { id:'TR-005', model: vehicleType === 'van' ? 'PEUGEOT BOXER' : 'DAF XF', cap: 91, status:'En route' },
    { id:'TR-006', model: vehicleType === 'van' ? 'OPEL MOVANO' : 'RENAULT T-HIGH', cap: 38, status:'Maintenance' },
    { id:'TR-007', model: vehicleType === 'van' ? 'FIAT DUCATO' : 'KENWORTH T680', cap: 72, status:'En route' },
  ];

  const I = window.Icons;

  return (
    <div style={{
      width: 1280, height: 800, background: dark ? TJX.bgDark : TJX.bg,
      color: t.ink, position:'relative', overflow:'hidden',
      fontFamily: 'Manrope, Inter, system-ui, sans-serif',
      backgroundImage: dark
        ? 'radial-gradient(ellipse at 20% 0%, rgba(37,99,235,0.08), transparent 60%)'
        : 'radial-gradient(ellipse at 20% 0%, rgba(37,99,235,0.06), transparent 50%)',
    }}>
      {/* Topbar */}
      <div style={{ display:'flex', alignItems:'center', gap: 14, padding: '18px 22px' }}>
        {/* Logo */}
        <div style={{ display:'flex', alignItems:'center', gap: 8, marginRight: 4 }}>
          <I.Logo size={26} color={accent}/>
          <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: '-0.02em' }}>Trajex</span>
        </div>

        {/* Nav pills */}
        <div style={{ display:'flex', alignItems:'center', gap: 4, marginLeft: 8 }}>
          {[
            {id:'home', icon:'Home'},
            {id:'fleet', icon:'Truck', label:'Fleet management'},
            {id:'map', icon:'Map'},
            {id:'docs', icon:'Doc'},
            {id:'chart', icon:'Chart'},
          ].map(n => {
            const Ic = I[n.icon];
            const active = activeNav === n.id;
            return (
              <button key={n.id} className="tjx-btn" onClick={()=>setActiveNav(n.id)} style={{
                display:'flex', alignItems:'center', gap: 8,
                padding: n.label ? '9px 14px' : '9px',
                borderRadius: 999,
                background: active ? (dark ? 'rgba(255,255,255,0.08)' : '#fff') : 'transparent',
                color: active ? t.ink : t.muted,
                fontWeight: 600, fontSize: 12.5,
                boxShadow: active && !dark ? '0 1px 3px rgba(15,23,42,0.06), 0 0 0 1px rgba(15,23,42,0.04)' : 'none',
              }}><Ic size={16}/>{n.label && <span>{n.label}</span>}</button>
            );
          })}
        </div>

        {/* KPIs */}
        <div style={{ display:'flex', alignItems:'center', gap: 18, marginLeft: 'auto', marginRight: 8 }}>
          <KPIInline color="#22c55e" label="Active vehicles" value="56" theme={t}/>
          <KPIInline color="#f59e0b" label="In maintenance" value="8" theme={t}/>
          <KPIInline color={accent} label="Avg. efficiency" value="87%" theme={t}/>
          <KPIInline color="#0ea5e9" label="Cargo in transit" value="128" theme={t}/>
        </div>

        {/* Right cluster */}
        <div style={{ display:'flex', alignItems:'center', gap: 8 }}>
          <RoundBtn theme={t} icon="Bell" badge="2" accent={accent}/>
          <RoundBtn theme={t} icon="Search"/>
          <RoundBtn theme={t} icon="Settings"/>
          <Avatar name="Léa Dubois" color={accent}/>
        </div>
      </div>

      {/* Body */}
      <div style={{ display:'grid', gridTemplateColumns: '320px 1fr 320px', gap, padding: `0 22px` }}>
        {/* Left column */}
        <div style={{ display:'flex', flexDirection:'column', gap }}>
          <Card theme={t} padding={pad}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <span style={{ fontSize: 11, color: t.muted, fontWeight: 600 }}>Vehicle</span>
              <Pill color="#22c55e">Active</Pill>
              <span className="tjx-num" style={{ fontSize: 11, color: t.muted, fontWeight: 600 }}>{selectedTruck}</span>
            </div>
            <div style={{ marginTop: 12, fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em' }}>{trucks[0].model}</div>
            <div style={{ display:'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 14 }}>
              <Stat theme={t} label="Charge" value="5.000 / 10.000kg"/>
              <Stat theme={t} label="Volume utilisé" value="23 / 45 m³"/>
            </div>
            <div style={{ marginTop: 14 }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom: 6, fontSize: 11 }}>
                <span style={{ color: t.muted, fontWeight: 600 }}>Capacité utilisée</span>
                <span className="tjx-num" style={{ fontWeight: 700 }}>50%</span>
              </div>
              <Bar value={50} color={accent} theme={t}/>
            </div>

            <div style={{ display:'flex', alignItems:'center', gap: 10, marginTop: 16, padding: '10px 12px', borderRadius: 12, background: dark ? 'rgba(255,255,255,0.04)' : 'rgba(15,23,42,0.03)' }}>
              <Avatar name="Luc Davidson" color="#0ea5e9" size={32}/>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 10, color: t.muted, fontWeight: 600 }}>Conducteur</div>
                <div style={{ fontSize: 13, fontWeight: 700 }}>Luc Davidson</div>
              </div>
              <div style={{ width: 30, height: 30, borderRadius: 8, background: accent, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <I.Phone size={14}/>
              </div>
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 10, marginTop: 12 }}>
              <MiniStat theme={t} icon="Fuel" label="Carburant" value="60%" accent={accent} bar={60}/>
              <MiniStat theme={t} icon="Temp" label="Température" value="24°C" accent={accent}/>
            </div>
          </Card>

          <Card theme={t} padding={pad}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom: 12 }}>
              <div style={{ display:'flex', alignItems:'center', gap: 8 }}>
                <I.Map size={15}/>
                <span style={{ fontSize: 13, fontWeight: 700 }}>Trajet en cours</span>
                <Pill color={accent}>En route</Pill>
              </div>
              <button className="tjx-btn" style={{ width:24, height:24, borderRadius:8, background:'transparent', color:t.muted }}>
                <I.Expand size={13}/>
              </button>
            </div>
            <div style={{ borderRadius: 12, overflow:'hidden', border:`1px solid ${t.border}` }}>
              <MapMock height={140} accent={accent} dark={dark}/>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', marginTop: 10, fontSize: 11 }}>
              <div><div style={{ color: t.muted, fontWeight: 600 }}>Départ</div><div style={{ fontWeight: 700, marginTop: 2 }}>Lyon · 06:30</div></div>
              <div style={{ textAlign:'right' }}><div style={{ color: t.muted, fontWeight: 600 }}>ETA</div><div style={{ fontWeight: 700, marginTop: 2 }}>Marseille · 11:45</div></div>
            </div>
          </Card>
        </div>

        {/* Center column */}
        <div style={{ display:'flex', flexDirection:'column', gap }}>
          <Card theme={t} padding={pad} style={{ position:'relative' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap: 10, marginBottom: 12 }}>
              <button className="tjx-btn" style={{
                display:'flex', alignItems:'center', gap: 8, padding: '10px 18px', borderRadius: 999,
                background: accent, color:'#fff', fontWeight: 700, fontSize: 13,
                boxShadow: `0 4px 12px ${hexToRgba(accent, 0.35)}`,
              }}><I.Plus size={15}/>Ajouter un véhicule</button>
              <RoundBtn theme={t} icon="Refresh" small/>
              <RoundBtn theme={t} icon="Doc" small/>
              <RoundBtn theme={t} icon="More" small/>
            </div>

            <TruckSVG cells={cells} selectedCell={selectedCell} onCellClick={setSelectedCell} accent={accent} dark={dark}/>

            {/* Tabs under truck */}
            <div style={{ display:'flex', alignItems:'center', gap: 8, marginTop: 4 }}>
              <Tab icon="Map" label="Carte" active theme={t} accent={accent}/>
              <Tab icon="Alert" label="Alertes" badge="3" theme={t}/>
              <Tab icon="Pkg" label="Cargo" theme={t}/>
              <Tab icon="Wrench" label="Maintenance" theme={t}/>
            </div>
          </Card>

          {/* Bottom row: stats trio */}
          <div style={{ display:'grid', gridTemplateColumns: '1.05fr 1fr 1.1fr', gap }}>
            <Card theme={t} padding={pad}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                <div>
                  <div style={{ fontSize: 11, color: t.muted, fontWeight: 600 }}>Conduite active</div>
                  <div className="tjx-num" style={{ fontSize: 22, fontWeight: 800, marginTop: 4, letterSpacing:'-.02em' }}>8h 40min<span style={{ fontSize: 12, color: t.muted, fontWeight: 600 }}> / 10h max</span></div>
                </div>
                <Pill color="#22c55e">Normal</Pill>
              </div>
              <div style={{ marginTop: 14 }}><Bar value={80} color={accent} theme={t}/></div>
              <div style={{ display:'flex', justifyContent:'space-between', marginTop: 6, fontSize: 10.5, color: t.muted, fontWeight: 600 }}>
                <span>00:00</span><span>04:00</span><span>08:00</span><span>10:00</span>
              </div>
              <div className="tjx-div" style={{ margin: '14px 0' }}/>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <div>
                  <div style={{ fontSize: 11, color: t.muted, fontWeight: 600 }}>Vitesse moyenne</div>
                  <div className="tjx-num" style={{ fontSize: 18, fontWeight: 800, marginTop: 2 }}>78<span style={{ fontSize:11, color: t.muted, fontWeight: 600 }}> km/h</span></div>
                </div>
                <Spark data={[60,65,70,75,72,80,78,82,78]} color={accent} width={90} height={32}/>
              </div>
            </Card>

            <Card theme={t} padding={pad}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                <div>
                  <div style={{ fontSize: 11, color: t.muted, fontWeight: 600 }}>État mécanique</div>
                  <div className="tjx-num" style={{ fontSize: 22, fontWeight: 800, marginTop: 4 }}>91%</div>
                </div>
                <Pill color="#22c55e">Optimal</Pill>
              </div>
              <div style={{ marginTop: 14 }}>
                <BarsChart accent={accent} dark={dark} data={[
                  {label:'Moteur',value:90},{label:'Freins',value:90},{label:'Pneus',value:80},{label:'Huile',value:89},{label:'Susp.',value:92},
                ]}/>
              </div>
            </Card>

            <Card theme={t} padding={pad}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                <div style={{ display:'flex', alignItems:'center', gap: 8 }}>
                  <span style={{ width:6, height:6, borderRadius:99, background:'#ef4444', boxShadow:'0 0 0 4px rgba(239,68,68,0.18)', animation:'pulse 1.6s infinite' }}/>
                  <span style={{ fontSize: 13, fontWeight: 700 }}>Caméra · {selectedTruck}</span>
                </div>
                <span className="tjx-num" style={{ fontSize: 11, color: t.muted, fontWeight: 600 }}>04:39:16</span>
              </div>
              <div style={{
                marginTop: 12, height: 110, borderRadius: 12, overflow:'hidden',
                background: 'linear-gradient(135deg, #0f1420 0%, #1a2030 100%)',
                position:'relative',
                border: `1px solid ${t.border}`,
              }}>
                {/* Cargo interior abstract */}
                <svg width="100%" height="100%" viewBox="0 0 240 110" preserveAspectRatio="xMidYMid slice">
                  <defs>
                    <linearGradient id="cam-g" x1="0" x2="1" y1="0" y2="0.5">
                      <stop offset="0" stopColor="#1a2030"/>
                      <stop offset="0.5" stopColor="#2a3142"/>
                      <stop offset="1" stopColor="#1a2030"/>
                    </linearGradient>
                  </defs>
                  <rect width="240" height="110" fill="url(#cam-g)"/>
                  {/* Perspective lines */}
                  <path d="M0 0 L120 55 L0 110 Z" fill="rgba(255,255,255,0.03)"/>
                  <path d="M240 0 L120 55 L240 110 Z" fill="rgba(255,255,255,0.03)"/>
                  {/* Boxes */}
                  {[
                    [40,40,40,30],[90,35,40,35],[140,38,40,32],
                  ].map((b,i) => (
                    <rect key={i} x={b[0]} y={b[1]} width={b[2]} height={b[3]} fill={hexToRgba(accent, 0.6)} stroke={accent} strokeWidth="0.5" rx="1.5"/>
                  ))}
                  {/* Scanlines */}
                  <rect width="240" height="110" fill="url(#cam-g)" opacity="0.1"/>
                </svg>
                <div style={{ position:'absolute', top:8, left:10, display:'flex', alignItems:'center', gap: 6, padding: '3px 8px', borderRadius: 999, background:'rgba(239,68,68,0.9)', color:'#fff', fontSize: 9.5, fontWeight: 700 }}>
                  <span style={{ width:5, height:5, borderRadius: 99, background:'#fff' }}/>LIVE
                </div>
                <button className="tjx-btn" style={{ position:'absolute', top:8, right:8, width:24, height:24, borderRadius: 8, background:'rgba(255,255,255,0.15)', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <I.Expand size={12}/>
                </button>
              </div>
            </Card>
          </div>
        </div>

        {/* Right column — Truck list */}
        <Card theme={t} padding={pad} style={{ display:'flex', flexDirection:'column', minHeight: 580 }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom: 12 }}>
            <span style={{ fontSize: 14, fontWeight: 800 }}>Liste des véhicules</span>
            <button className="tjx-btn" style={{ width:28, height:28, borderRadius:8, background: dark ? 'rgba(255,255,255,0.06)' : 'rgba(15,23,42,0.04)', color: t.muted, display:'flex', alignItems:'center', justifyContent:'center' }}>
              <I.Filter size={13}/>
            </button>
          </div>

          <div style={{ display:'flex', flexDirection:'column', gap: 8, overflowY:'auto' }} className="tjx-noscroll">
            {trucks.map((tr, i) => {
              const isSel = tr.id === selectedTruck;
              const statusColor = tr.status === 'En route' ? '#22c55e' : tr.status === 'Maintenance' ? '#f59e0b' : '#0ea5e9';
              return (
                <div key={tr.id} onClick={()=>setSelectedTruck(tr.id)} style={{
                  padding: 10, borderRadius: 14, cursor:'pointer',
                  background: isSel ? (dark ? 'rgba(255,255,255,0.06)' : '#fff') : 'transparent',
                  border: `1px solid ${isSel ? hexToRgba(accent, 0.35) : 'transparent'}`,
                  boxShadow: isSel ? `0 4px 12px ${hexToRgba(accent, 0.12)}` : 'none',
                  transition: 'all .15s',
                }}>
                  <div style={{ display:'flex', alignItems:'center', gap: 10 }}>
                    <div style={{ width: 56, height: 42, display:'flex', alignItems:'center', justifyContent:'center', background: dark ? 'rgba(255,255,255,0.04)' : 'rgba(15,23,42,0.04)', borderRadius: 8, flexShrink: 0 }}>
                      {vehicleType === 'van' ? <VanMini accent={accent} dark={dark} size={36}/> : <TruckMini accent={accent} dark={dark} size={36}/>}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                        <span className="tjx-num" style={{ fontSize: 10, color: t.muted, fontWeight: 700 }}>{tr.id}</span>
                        <Pill color={statusColor}>{tr.status}</Pill>
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 800, marginTop: 2, letterSpacing:'-.01em' }}>{tr.model}</div>
                      {isSel && (
                        <div style={{ marginTop: 8, fontSize: 10.5, color: t.muted }}>
                          <div style={{ display:'flex', justifyContent:'space-between', marginBottom: 3 }}>
                            <span style={{ fontWeight: 600 }}>Charge</span><span className="tjx-num" style={{ fontWeight: 700, color: t.ink }}>{tr.burden}</span>
                          </div>
                          <div style={{ display:'flex', justifyContent:'space-between', marginBottom: 6 }}>
                            <span style={{ fontWeight: 600 }}>Volume utilisé</span><span className="tjx-num" style={{ fontWeight: 700, color: t.ink }}>{tr.vol}</span>
                          </div>
                        </div>
                      )}
                      <div style={{ display:'flex', alignItems:'center', gap: 8, marginTop: isSel ? 6 : 6 }}>
                        <span style={{ fontSize: 10, color: t.muted, fontWeight: 600 }}>Capacité</span>
                        <div style={{ flex: 1 }}><Bar value={tr.cap} color={accent} theme={t} height={4}/></div>
                        <span className="tjx-num" style={{ fontSize: 10.5, fontWeight: 700 }}>{tr.cap}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}`}</style>
    </div>
  );
}

// Helpers used above
function KPIInline({ color, label, value, theme }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap: 8 }}>
      <span style={{ width:6, height:6, borderRadius:99, background: color }}/>
      <div style={{ display:'flex', flexDirection:'column', lineHeight: 1.05 }}>
        <span style={{ fontSize: 9.5, color: theme.muted, fontWeight: 600, letterSpacing:'.02em', textTransform:'uppercase' }}>{label}</span>
        <span className="tjx-num" style={{ fontSize: 16, fontWeight: 800, color: theme.ink, marginTop: 1 }}>{value}</span>
      </div>
    </div>
  );
}

function RoundBtn({ theme, icon, badge, accent, small }) {
  const Ic = window.Icons[icon];
  const sz = small ? 32 : 36;
  return (
    <button className="tjx-btn" style={{
      width: sz, height: sz, borderRadius: 999,
      background: theme.dark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.7)',
      border: `1px solid ${theme.border}`,
      color: theme.ink, display:'flex', alignItems:'center', justifyContent:'center',
      position:'relative',
    }}>
      <Ic size={small ? 14 : 16}/>
      {badge && (
        <span className="tjx-num" style={{
          position:'absolute', top:-3, right:-3, minWidth:16, height:16, padding:'0 4px',
          borderRadius:99, background: accent || '#ef4444', color:'#fff', fontSize:9.5, fontWeight: 700,
          display:'flex', alignItems:'center', justifyContent:'center', border:'2px solid '+ (theme.dark ? '#0a0e17' : '#eef0f4'),
        }}>{badge}</span>
      )}
    </button>
  );
}

function Stat({ theme, label, value }) {
  return (
    <div>
      <div style={{ fontSize: 10, color: theme.muted, fontWeight: 600 }}>{label}</div>
      <div className="tjx-num" style={{ fontSize: 13, fontWeight: 700, marginTop: 2, letterSpacing:'-.01em' }}>{value}</div>
    </div>
  );
}

function MiniStat({ theme, icon, label, value, accent, bar }) {
  const Ic = window.Icons[icon];
  return (
    <div style={{ padding: '10px 12px', borderRadius: 12, background: theme.dark ? 'rgba(255,255,255,0.04)' : 'rgba(15,23,42,0.03)' }}>
      <div style={{ display:'flex', alignItems:'center', gap: 6 }}>
        <Ic size={13} color={theme.muted}/>
        <span style={{ fontSize: 10, color: theme.muted, fontWeight: 600 }}>{label}</span>
      </div>
      <div className="tjx-num" style={{ fontSize: 16, fontWeight: 800, marginTop: 4 }}>{value}</div>
      {bar !== undefined && <div style={{ marginTop: 6 }}><Bar value={bar} color={accent} theme={theme} height={4}/></div>}
    </div>
  );
}

function Tab({ icon, label, badge, active, theme, accent }) {
  const Ic = window.Icons[icon];
  return (
    <button className="tjx-btn" style={{
      display:'flex', alignItems:'center', gap: 6,
      padding: '7px 14px', borderRadius: 999,
      background: active ? (accent || theme.accent) : (theme.dark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.7)'),
      color: active ? '#fff' : theme.muted,
      border: active ? 'none' : `1px solid ${theme.border}`,
      fontSize: 11.5, fontWeight: 700,
    }}>
      <Ic size={13}/>{label}
      {badge && <span className="tjx-num" style={{ marginLeft:2, minWidth:14, height:14, padding:'0 4px', borderRadius:99, background:'#ef4444', color:'#fff', fontSize:9, display:'inline-flex', alignItems:'center', justifyContent:'center', fontWeight:700 }}>{badge}</span>}
    </button>
  );
}

window.Dashboard = Dashboard;
