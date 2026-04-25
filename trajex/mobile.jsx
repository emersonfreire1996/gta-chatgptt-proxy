// Trajex — Mobile manager app (fleet overview)
function MobileManager({ tweaks }) {
  const { dark, accent } = tweaks;
  const t = getTheme(dark, accent);
  const I = window.Icons;
  const [tab, setTab] = useState('fleet');

  return (
    <div style={{
      width: '100%', height: '100%',
      background: dark ? '#0a0e17' : '#eef0f4',
      backgroundImage: dark
        ? 'radial-gradient(ellipse at top, rgba(37,99,235,0.15), transparent 50%)'
        : 'radial-gradient(ellipse at top, rgba(37,99,235,0.08), transparent 60%)',
      color: t.ink,
      fontFamily: 'Manrope, system-ui, sans-serif',
      display:'flex', flexDirection:'column',
      padding: '16px 16px 0',
      overflow:'hidden',
    }}>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom: 18 }}>
        <button className="tjx-btn" style={{ width: 38, height: 38, borderRadius: 12, background: dark ? 'rgba(255,255,255,0.06)' : '#fff', color: t.ink, display:'flex', alignItems:'center', justifyContent:'center', border:`1px solid ${t.border}` }}>
          <I.Back size={16}/>
        </button>
        <div style={{ textAlign:'center' }}>
          <div style={{ fontSize: 10.5, color: t.muted, fontWeight: 600 }}>Bonjour, Léa</div>
          <div style={{ fontSize: 16, fontWeight: 800, marginTop: 1 }}>Ma flotte</div>
        </div>
        <button className="tjx-btn" style={{ width: 38, height: 38, borderRadius: 12, background: dark ? 'rgba(255,255,255,0.06)' : '#fff', color: t.ink, display:'flex', alignItems:'center', justifyContent:'center', border:`1px solid ${t.border}`, position:'relative' }}>
          <I.Bell size={16}/>
          <span style={{ position:'absolute', top: 7, right: 8, width: 7, height: 7, borderRadius: 99, background: accent, border: `2px solid ${dark ? '#0a0e17' : '#fff'}` }}/>
        </button>
      </div>

      {/* KPI row */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 10, marginBottom: 14 }}>
        <Card theme={t} padding={12}>
          <div style={{ display:'flex', alignItems:'center', gap: 8 }}>
            <div style={{ width:30, height:30, borderRadius:9, background: hexToRgba(accent, 0.12), color: accent, display:'flex', alignItems:'center', justifyContent:'center' }}><I.Truck size={15}/></div>
            <div>
              <div style={{ fontSize: 9.5, color: t.muted, fontWeight: 600 }}>Active</div>
              <div className="tjx-num" style={{ fontSize: 18, fontWeight: 800, lineHeight: 1 }}>56</div>
            </div>
          </div>
        </Card>
        <Card theme={t} padding={12}>
          <div style={{ display:'flex', alignItems:'center', gap: 8 }}>
            <div style={{ width:30, height:30, borderRadius:9, background: 'rgba(245,158,11,0.12)', color: '#f59e0b', display:'flex', alignItems:'center', justifyContent:'center' }}><I.Wrench size={15}/></div>
            <div>
              <div style={{ fontSize: 9.5, color: t.muted, fontWeight: 600 }}>Maintenance</div>
              <div className="tjx-num" style={{ fontSize: 18, fontWeight: 800, lineHeight: 1 }}>8</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Map card */}
      <Card theme={t} padding={0} style={{ overflow:'hidden', marginBottom: 14 }}>
        <div style={{ position:'relative' }}>
          <MapMock height={150} accent={accent} dark={dark}/>
          <div style={{ position:'absolute', top: 10, left: 10, display:'flex', gap: 6 }}>
            <Pill color={accent}>12 en route</Pill>
          </div>
          <div style={{ position:'absolute', bottom: 10, left: 10, right: 10, padding: '8px 12px', borderRadius: 12, background: dark ? 'rgba(20,25,35,0.9)' : 'rgba(255,255,255,0.95)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div>
              <div style={{ fontSize: 10, color: t.muted, fontWeight: 600 }}>Distance totale aujourd'hui</div>
              <div className="tjx-num" style={{ fontSize: 15, fontWeight: 800 }}>2 847 km</div>
            </div>
            <button className="tjx-btn" style={{ padding: '6px 12px', borderRadius: 999, background: accent, color:'#fff', fontSize: 11, fontWeight: 700, display:'flex', alignItems:'center', gap: 4 }}>
              Voir <I.Chev size={12}/>
            </button>
          </div>
        </div>
      </Card>

      {/* Section title */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom: 10 }}>
        <span style={{ fontSize: 14, fontWeight: 800 }}>Véhicules</span>
        <span style={{ fontSize: 11, color: accent, fontWeight: 700 }}>Tout voir</span>
      </div>

      {/* Vehicle cards */}
      <div style={{ flex: 1, display:'flex', flexDirection:'column', gap: 10, overflowY:'auto' }} className="tjx-noscroll">
        {[
          { id:'TR-001', name: 'MAN TGX', driver:'L. Davidson', status:'En route', cap: 50, eta:'11:45' },
          { id:'TR-002', name: 'SCANIA R-Series', driver:'M. Petit', status:'En route', cap: 82, eta:'14:20' },
          { id:'TR-006', name: 'RENAULT T-High', driver:'A. Bernard', status:'Maintenance', cap: 0, eta:'—' },
        ].map((v, i) => {
          const sc = v.status === 'En route' ? '#22c55e' : '#f59e0b';
          return (
            <Card key={v.id} theme={t} padding={12}>
              <div style={{ display:'flex', alignItems:'center', gap: 12 }}>
                <div style={{ width: 56, height: 44, display:'flex', alignItems:'center', justifyContent:'center', background: dark ? 'rgba(255,255,255,0.04)' : 'rgba(15,23,42,0.04)', borderRadius: 10 }}>
                  <TruckMini accent={accent} dark={dark} size={36}/>
                </div>
                <div style={{ flex:1, minWidth: 0 }}>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                    <span className="tjx-num" style={{ fontSize: 9.5, color: t.muted, fontWeight: 700 }}>{v.id}</span>
                    <Pill color={sc}>{v.status}</Pill>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 800, marginTop: 1 }}>{v.name}</div>
                  <div style={{ fontSize: 10.5, color: t.muted, fontWeight: 500, marginTop: 1 }}>{v.driver} · ETA {v.eta}</div>
                  <div style={{ display:'flex', alignItems:'center', gap: 6, marginTop: 6 }}>
                    <div style={{ flex: 1 }}><Bar value={v.cap} color={accent} theme={t} height={4}/></div>
                    <span className="tjx-num" style={{ fontSize: 10, fontWeight: 700 }}>{v.cap}%</span>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Bottom tabbar */}
      <div style={{
        margin: '12px -16px 0', padding: '10px 24px 22px',
        background: dark ? 'rgba(20,25,35,0.85)' : 'rgba(255,255,255,0.85)',
        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        borderTop: `1px solid ${t.border}`,
        display:'flex', justifyContent:'space-around', alignItems:'center',
      }}>
        {[
          {id:'home', icon:'Home', label:'Accueil'},
          {id:'fleet', icon:'Truck', label:'Flotte'},
          {id:'map', icon:'Map', label:'Carte'},
          {id:'docs', icon:'Doc', label:'Docs'},
          {id:'me', icon:'User', label:'Profil'},
        ].map(tt => {
          const Ic = I[tt.icon];
          const active = tt.id === tab;
          return (
            <button key={tt.id} className="tjx-btn" onClick={()=>setTab(tt.id)} style={{
              display:'flex', flexDirection:'column', alignItems:'center', gap: 3,
              background:'transparent', color: active ? accent : t.muted,
            }}>
              <Ic size={18}/>
              <span style={{ fontSize: 9, fontWeight: 700 }}>{tt.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Trajex — Mobile driver app (active mission)
function MobileDriver({ tweaks }) {
  const { dark, accent } = tweaks;
  const t = getTheme(dark, accent);
  const I = window.Icons;

  return (
    <div style={{
      width: '100%', height: '100%',
      background: dark ? '#0a0e17' : '#eef0f4',
      color: t.ink,
      fontFamily: 'Manrope, system-ui, sans-serif',
      display:'flex', flexDirection:'column',
      overflow:'hidden',
      position:'relative',
    }}>
      {/* Map fills upper part */}
      <div style={{ height: '55%', position:'relative' }}>
        <MapMock height={400} accent={accent} dark={dark}/>
        {/* Header overlay */}
        <div style={{ position:'absolute', top: 16, left: 16, right: 16, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <button className="tjx-btn" style={{ width: 38, height: 38, borderRadius: 12, background: dark ? 'rgba(20,25,35,0.85)' : 'rgba(255,255,255,0.95)', color: t.ink, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 2px 8px rgba(0,0,0,0.08)' }}>
            <I.Back size={16}/>
          </button>
          <div style={{ padding: '8px 14px', borderRadius: 999, background: dark ? 'rgba(20,25,35,0.85)' : 'rgba(255,255,255,0.95)', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', display:'flex', alignItems:'center', gap: 6 }}>
            <span style={{ width:6, height:6, borderRadius:99, background:'#22c55e' }}/>
            <span style={{ fontSize: 11.5, fontWeight: 700 }}>En mission</span>
          </div>
          <button className="tjx-btn" style={{ width: 38, height: 38, borderRadius: 12, background: dark ? 'rgba(20,25,35,0.85)' : 'rgba(255,255,255,0.95)', color: t.ink, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 2px 8px rgba(0,0,0,0.08)' }}>
            <I.Menu size={16}/>
          </button>
        </div>

        {/* Speed bubble */}
        <div style={{
          position:'absolute', bottom: 24, right: 16,
          width: 76, height: 76, borderRadius: '50%',
          background: dark ? 'rgba(20,25,35,0.92)' : 'rgba(255,255,255,0.95)',
          display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
          boxShadow: '0 6px 20px rgba(15,23,42,0.15)',
          border: `2px solid ${accent}`,
        }}>
          <span className="tjx-num" style={{ fontSize: 24, fontWeight: 800, lineHeight: 1, letterSpacing:'-.03em' }}>78</span>
          <span style={{ fontSize: 9, color: t.muted, fontWeight: 700, marginTop: 2 }}>km/h</span>
        </div>
      </div>

      {/* Bottom sheet */}
      <div style={{
        flex: 1, marginTop: -22,
        background: dark ? '#141925' : '#fff',
        borderRadius: '24px 24px 0 0',
        padding: '14px 18px 22px',
        boxShadow: '0 -8px 24px rgba(15,23,42,0.08)',
        display:'flex', flexDirection:'column',
        overflow:'hidden',
      }}>
        {/* Handle */}
        <div style={{ width: 40, height: 4, borderRadius: 99, background: t.border, alignSelf:'center', marginBottom: 14 }}/>

        {/* Mission header */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom: 10 }}>
          <div>
            <div style={{ fontSize: 10.5, color: t.muted, fontWeight: 600 }}>Livraison · P-00134</div>
            <div style={{ fontSize: 17, fontWeight: 800, marginTop: 1, letterSpacing:'-.01em' }}>Marseille (13002)</div>
          </div>
          <Pill color={accent}>Express</Pill>
        </div>

        {/* Time/distance row */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap: 10, marginTop: 4 }}>
          <Block theme={t} label="Distance" value="42 km" tnum/>
          <Block theme={t} label="Arrivée" value="11:45" tnum/>
          <Block theme={t} label="ETA" value="2h 14" tnum/>
        </div>

        {/* Next stop card */}
        <div style={{
          marginTop: 14, padding: 12, borderRadius: 14,
          background: dark ? 'rgba(255,255,255,0.04)' : 'rgba(15,23,42,0.03)',
          display:'flex', alignItems:'center', gap: 12,
        }}>
          <div style={{ width:38, height: 38, borderRadius: 10, background: hexToRgba(accent, 0.15), color: accent, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <I.Pin size={18}/>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 10, color: t.muted, fontWeight: 600 }}>Prochain arrêt · 3 min</div>
            <div style={{ fontSize: 13, fontWeight: 700, marginTop: 1, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>14 rue Paradis · Pickup</div>
          </div>
          <button className="tjx-btn" style={{ width: 36, height: 36, borderRadius: 10, background: accent, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <I.Arrow size={15}/>
          </button>
        </div>

        {/* Action buttons */}
        <div style={{ display:'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 12 }}>
          <button className="tjx-btn" style={{
            padding: '14px', borderRadius: 14,
            background: accent, color:'#fff',
            fontSize: 13, fontWeight: 800,
            display:'flex', alignItems:'center', justifyContent:'center', gap: 8,
            boxShadow: `0 4px 14px ${hexToRgba(accent, 0.35)}`,
          }}>
            <I.Check size={16}/>Livraison faite
          </button>
          <button className="tjx-btn" style={{
            padding: '14px', borderRadius: 14,
            background: dark ? 'rgba(255,255,255,0.06)' : 'rgba(15,23,42,0.05)', color: t.ink,
            fontSize: 13, fontWeight: 800,
            display:'flex', alignItems:'center', justifyContent:'center', gap: 8,
          }}>
            <I.Phone size={16}/>Contacter
          </button>
        </div>

        {/* Today summary */}
        <div className="tjx-div" style={{ margin: '16px 0' }}/>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom: 10 }}>
          <span style={{ fontSize: 12, fontWeight: 800 }}>Aujourd'hui</span>
          <span className="tjx-num" style={{ fontSize: 11, color: t.muted, fontWeight: 700 }}>05:25:02</span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap: 10 }}>
          <Spark data={[3,5,4,7,6,9,8,11,10,13,12]} color={accent} width={140} height={36}/>
          <div style={{ marginLeft: 'auto', textAlign:'right' }}>
            <div style={{ fontSize: 10, color: t.muted, fontWeight: 600 }}>Livraisons</div>
            <div className="tjx-num" style={{ fontSize: 16, fontWeight: 800 }}>13<span style={{ fontSize: 11, color: t.muted, fontWeight: 600 }}> / 20</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Block({ theme, label, value, tnum }) {
  return (
    <div style={{ padding: '8px 10px', borderRadius: 12, background: theme.dark ? 'rgba(255,255,255,0.04)' : 'rgba(15,23,42,0.03)' }}>
      <div style={{ fontSize: 9.5, color: theme.muted, fontWeight: 600 }}>{label}</div>
      <div className={tnum ? 'tjx-num' : ''} style={{ fontSize: 14, fontWeight: 800, marginTop: 2, letterSpacing:'-.01em' }}>{value}</div>
    </div>
  );
}

Object.assign(window, { MobileManager, MobileDriver });
