const P = {
  ink: '#1a1410',
  paper: '#faf6ef',
  paper2: '#f1e8d8',
  brand: '#c8552b',
  brand2: '#b08948',
  teal: '#0f4c5c',
}

export function SceneBook() {
  return (
    <svg viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <defs>
        <linearGradient id="skyBook" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={P.brand}/>
          <stop offset="60%" stopColor={P.brand2}/>
          <stop offset="100%" stopColor={P.paper2}/>
        </linearGradient>
      </defs>
      <rect width="400" height="500" fill="url(#skyBook)"/>
      <circle cx="280" cy="170" r="70" fill={P.paper} opacity="0.85"/>
      <circle cx="280" cy="170" r="56" fill={P.brand} opacity="0.45"/>
      <g fill={P.ink} opacity="0.55">
        <rect x="0" y="240" width="50" height="60"/>
        <rect x="55" y="220" width="22" height="80"/>
        <rect x="82" y="235" width="34" height="65"/>
        <path d="M120 240 l30 -28 l30 28 z"/>
        <rect x="120" y="240" width="60" height="60"/>
        <circle cx="195" cy="232" r="14"/>
        <rect x="186" y="232" width="18" height="68"/>
        <rect x="210" y="250" width="40" height="50"/>
        <rect x="252" y="230" width="28" height="70"/>
        <rect x="282" y="244" width="48" height="56"/>
        <rect x="332" y="220" width="22" height="80"/>
        <rect x="356" y="240" width="44" height="60"/>
      </g>
      <path d="M0 360 Q 100 320 200 360 T 400 360 L400 500 L0 500 Z" fill={P.paper2}/>
      <path d="M0 410 Q 140 380 260 410 T 400 410 L400 500 L0 500 Z" fill={P.brand} opacity="0.55"/>
      <path d="M0 450 Q 120 430 230 450 T 400 450 L400 500 L0 500 Z" fill={P.ink} opacity="0.85"/>
      <g transform="translate(150 380)">
        <rect x="0" y="0" width="100" height="62" rx="6" fill={P.paper} stroke={P.ink} strokeWidth="2"/>
        <rect x="6" y="6" width="88" height="48" rx="3" fill={P.teal}/>
        <rect x="14" y="14" width="40" height="6" rx="3" fill={P.paper}/>
        <rect x="14" y="26" width="60" height="4" rx="2" fill={P.paper} opacity="0.6"/>
        <rect x="14" y="36" width="32" height="10" rx="2" fill={P.brand}/>
        <rect x="-6" y="62" width="112" height="6" rx="2" fill={P.ink}/>
      </g>
    </svg>
  )
}

export function SceneLand() {
  return (
    <svg viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <defs>
        <linearGradient id="skyLand" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={P.teal}/>
          <stop offset="100%" stopColor={P.brand}/>
        </linearGradient>
      </defs>
      <rect width="400" height="500" fill="url(#skyLand)"/>
      <circle cx="100" cy="140" r="50" fill={P.paper} opacity="0.9"/>
      <g fill={P.paper} opacity="0.5">
        <ellipse cx="320" cy="120" rx="60" ry="14"/>
        <ellipse cx="340" cy="100" rx="40" ry="10"/>
        <ellipse cx="60" cy="220" rx="50" ry="10"/>
      </g>
      <g transform="translate(150 200) rotate(-12)">
        <path d="M0 0 L100 -8 L150 -2 L130 8 L60 12 Z" fill={P.paper} stroke={P.ink} strokeWidth="2"/>
        <path d="M40 -4 L20 -28 L48 -4 Z" fill={P.paper} stroke={P.ink} strokeWidth="2"/>
        <path d="M50 12 L30 38 L58 14 Z" fill={P.paper} stroke={P.ink} strokeWidth="2"/>
        <circle cx="120" cy="0" r="3" fill={P.brand}/>
        <circle cx="105" cy="0" r="2" fill={P.ink}/>
        <circle cx="92" cy="0" r="2" fill={P.ink}/>
      </g>
      <path d="M150 198 Q 80 220 -10 250" stroke={P.paper} strokeWidth="3" fill="none" opacity="0.6" strokeLinecap="round" strokeDasharray="2 6"/>
      <path d="M0 340 Q 100 320 200 340 T 400 340 L400 500 L0 500 Z" fill={P.teal}/>
      <g fill={P.paper}>
        <rect x="20" y="295" width="35" height="50"/><rect x="50" y="285" width="28" height="60"/>
        <rect x="75" y="300" width="36" height="45"/><rect x="108" y="280" width="30" height="65"/>
        <rect x="135" y="295" width="34" height="50"/><rect x="166" y="285" width="28" height="60"/>
        <rect x="190" y="300" width="36" height="45"/><rect x="224" y="282" width="30" height="63"/>
        <rect x="252" y="298" width="34" height="47"/><rect x="284" y="290" width="28" height="55"/>
        <rect x="310" y="300" width="36" height="45"/><rect x="344" y="285" width="30" height="60"/>
      </g>
    </svg>
  )
}

export function SceneDrive() {
  return (
    <svg viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <defs>
        <linearGradient id="skyDrive" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={P.brand}/>
          <stop offset="100%" stopColor={P.paper2}/>
        </linearGradient>
        <linearGradient id="roadDrive" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={P.ink}/>
          <stop offset="100%" stopColor={P.ink} stopOpacity="0.5"/>
        </linearGradient>
      </defs>
      <rect width="400" height="500" fill="url(#skyDrive)"/>
      <circle cx="200" cy="170" r="80" fill={P.paper} opacity="0.95"/>
      <g fill={P.ink} opacity="0.55">
        <path d="M0 280 L60 220 L120 270 L180 200 L260 280 L320 230 L400 270 L400 320 L0 320 Z"/>
      </g>
      <g fill={P.ink} opacity="0.85">
        <path d="M0 310 L70 270 L140 310 L210 260 L280 310 L350 280 L400 300 L400 360 L0 360 Z"/>
      </g>
      <path d="M0 360 Q 100 340 200 360 T 400 360 L 400 420 L0 420 Z" fill={P.brand2}/>
      <path d="M0 400 Q 130 380 240 400 T 400 400 L 400 460 L0 460 Z" fill={P.brand}/>
      <path d="M170 460 L230 460 L300 360 L290 360 L210 460 Z" fill="url(#roadDrive)" opacity="0.9" transform="translate(0 -10)"/>
      <g transform="translate(150 420)">
        <rect x="0" y="14" width="100" height="28" rx="6" fill={P.paper} stroke={P.ink} strokeWidth="2"/>
        <path d="M14 14 L26 -4 L72 -4 L86 14 Z" fill={P.paper} stroke={P.ink} strokeWidth="2"/>
        <path d="M28 0 L46 -2 L46 12 L26 12 Z" fill={P.teal} opacity="0.5"/>
        <path d="M52 -2 L70 0 L72 12 L52 12 Z" fill={P.teal} opacity="0.5"/>
        <circle cx="24" cy="42" r="9" fill={P.ink}/>
        <circle cx="24" cy="42" r="4" fill={P.paper}/>
        <circle cx="76" cy="42" r="9" fill={P.ink}/>
        <circle cx="76" cy="42" r="4" fill={P.paper}/>
        <rect x="86" y="20" width="6" height="6" rx="1" fill={P.brand2}/>
      </g>
      <g transform="translate(330 320)" stroke={P.ink} strokeWidth="2.5" strokeLinecap="round" fill="none">
        <path d="M10 90 Q 8 50 12 0"/>
        <path d="M12 0 Q -10 10 -20 24"/><path d="M12 0 Q 30 8 44 18"/>
        <path d="M12 0 Q -4 -10 -18 -10"/><path d="M12 0 Q 24 -10 38 -6"/>
        <path d="M12 0 Q 10 -20 14 -30"/>
      </g>
    </svg>
  )
}

export function SceneAlgiers() {
  return (
    <svg viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <defs>
        <linearGradient id="skyAlg" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={P.brand}/>
          <stop offset="50%" stopColor={P.brand2}/>
          <stop offset="100%" stopColor={P.paper2}/>
        </linearGradient>
      </defs>
      <rect width="400" height="500" fill="url(#skyAlg)"/>
      <circle cx="300" cy="130" r="55" fill={P.paper} opacity="0.85"/>
      <path d="M0 260 L80 200 L160 250 L240 190 L320 240 L400 210 L400 290 L0 290 Z" fill={P.ink} opacity="0.35"/>
      <rect x="0" y="290" width="400" height="22" fill={P.teal}/>
      <g fill={P.paper}>
        <rect x="10" y="280" width="36" height="60"/><rect x="44" y="270" width="30" height="70"/>
        <rect x="72" y="285" width="40" height="55"/><rect x="110" y="265" width="32" height="75"/>
        <rect x="140" y="280" width="36" height="60"/><rect x="174" y="270" width="30" height="70"/>
        <rect x="202" y="285" width="40" height="55"/><rect x="240" y="262" width="32" height="78"/>
        <rect x="270" y="280" width="36" height="60"/><rect x="304" y="270" width="30" height="70"/>
        <rect x="332" y="285" width="40" height="55"/><rect x="370" y="270" width="30" height="70"/>
      </g>
      <g fill={P.paper}>
        <circle cx="180" cy="270" r="14"/>
        <rect x="167" y="270" width="26" height="18"/>
        <rect x="178" y="240" width="6" height="40"/>
        <circle cx="181" cy="238" r="4"/>
      </g>
      <rect x="0" y="312" width="400" height="188" fill={P.paper2}/>
      <path d="M0 312 Q 100 330 200 320 T 400 326 L 400 380 L 0 380 Z" fill={P.brand} opacity="0.3"/>
    </svg>
  )
}

export function IconArrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}
export function IconPlane() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M21 16l-9-4-9 4v-2l9-5V4a1.5 1.5 0 1 1 3 0v5l6 3.5v2z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/>
    </svg>
  )
}
export function IconShield() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M12 3 4 6v6c0 5 3.5 8.5 8 9 4.5-.5 8-4 8-9V6l-8-3z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/>
      <path d="M8.5 12 11 14.5 16 9.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}
export function IconCheck() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path d="M5 12.5 10 17 19 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}
export function IconWhatsApp() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.5 14.4c-.3-.1-1.6-.8-1.9-.9-.3-.1-.5-.1-.7.1-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-1.8-.9-2.9-1.6-4.1-3.6-.3-.5.3-.5.9-1.5.1-.2 0-.4 0-.5s-.7-1.7-1-2.3c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4 0 1.4 1 2.8 1.2 3 .1.2 2 3.1 4.9 4.4 1.8.8 2.6.8 3.5.7.5 0 1.6-.7 1.8-1.3.2-.6.2-1.2.2-1.3 0-.1-.2-.2-.4-.3zM12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.5 1.3 5L2 22l5.1-1.3c1.4.8 3.1 1.2 4.9 1.2 5.5 0 10-4.5 10-10S17.5 2 12 2z"/>
    </svg>
  )
}
export function IconPin() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M12 22s7-7.58 7-13a7 7 0 1 0-14 0c0 5.42 7 13 7 13z" stroke="currentColor" strokeWidth="1.7"/>
      <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.7"/>
    </svg>
  )
}
export function IconCar() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
      <path d="M3 14l1.5-5A2 2 0 0 1 6.4 7.5h11.2a2 2 0 0 1 1.9 1.5L21 14M3 14h18M3 14v4a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-1M21 14v4a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-1" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="7.5" cy="14.5" r="1.2" fill="currentColor"/>
      <circle cx="16.5" cy="14.5" r="1.2" fill="currentColor"/>
    </svg>
  )
}
export function IconCog() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
      <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" stroke="currentColor" strokeWidth="1.7"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" stroke="currentColor" strokeWidth="1.7"/>
    </svg>
  )
}
export function IconFuel() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
      <path d="M3 22V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16M3 22h14M13 8h4a2 2 0 0 1 2 2v3a2 2 0 0 0 2 2h0" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
    </svg>
  )
}
export function IconUsers() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
      <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.7"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
    </svg>
  )
}
