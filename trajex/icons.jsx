// Trajex — minimal stroke icons. 1.6 stroke, currentColor.
const I = ({ children, size = 18, ...rest }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...rest}>{children}</svg>
);

const Icons = {
  Home:    (p) => <I {...p}><path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/></I>,
  Truck:   (p) => <I {...p}><path d="M3 7h11v9H3z"/><path d="M14 10h4l3 3v3h-7"/><circle cx="7" cy="18" r="1.6"/><circle cx="17" cy="18" r="1.6"/></I>,
  Car:     (p) => <I {...p}><path d="M5 13l1.5-4.5A2 2 0 0 1 8.4 7h7.2a2 2 0 0 1 1.9 1.5L19 13"/><path d="M3 13h18v4H3z"/><circle cx="7" cy="17" r="1.4"/><circle cx="17" cy="17" r="1.4"/></I>,
  Map:     (p) => <I {...p}><path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2z"/><path d="M9 4v14"/><path d="M15 6v14"/></I>,
  Pin:     (p) => <I {...p}><path d="M12 22s7-7 7-12a7 7 0 1 0-14 0c0 5 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/></I>,
  Wrench:  (p) => <I {...p}><path d="M14.7 6.3a4 4 0 1 0 3 3l-9 9-3 .7.7-3z"/></I>,
  Calendar:(p) => <I {...p}><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9h18M8 3v4M16 3v4"/></I>,
  Bell:    (p) => <I {...p}><path d="M6 8a6 6 0 1 1 12 0c0 5 2 6 2 6H4s2-1 2-6z"/><path d="M10 19a2 2 0 0 0 4 0"/></I>,
  Search:  (p) => <I {...p}><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></I>,
  Settings:(p) => <I {...p}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3h.1a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8v.1a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></I>,
  Plus:    (p) => <I {...p}><path d="M12 5v14M5 12h14"/></I>,
  Chev:    (p) => <I {...p}><path d="m9 6 6 6-6 6"/></I>,
  ChevDown:(p) => <I {...p}><path d="m6 9 6 6 6-6"/></I>,
  Back:    (p) => <I {...p}><path d="m15 6-6 6 6 6"/></I>,
  Fuel:    (p) => <I {...p}><path d="M4 21V6a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v15"/><path d="M4 21h11"/><path d="M15 9h2a2 2 0 0 1 2 2v6a1.5 1.5 0 0 0 3 0V8l-3-3"/></I>,
  Battery: (p) => <I {...p}><rect x="2" y="7" width="18" height="10" rx="2"/><path d="M22 11v2"/><path d="M5 10v4M8 10v4M11 10v4"/></I>,
  Shield:  (p) => <I {...p}><path d="M12 3 4 6v6c0 5 4 8 8 9 4-1 8-4 8-9V6z"/></I>,
  Doc:     (p) => <I {...p}><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><path d="M9 13h6M9 17h4"/></I>,
  User:    (p) => <I {...p}><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></I>,
  Users:   (p) => <I {...p}><circle cx="9" cy="8" r="3.5"/><path d="M2 20a7 7 0 0 1 14 0"/><path d="M16 4a3.5 3.5 0 0 1 0 7"/><path d="M22 20a6 6 0 0 0-5-6"/></I>,
  Chart:   (p) => <I {...p}><path d="M4 19V5"/><path d="M4 19h16"/><path d="M8 16v-4M12 16V9M16 16v-7"/></I>,
  Filter:  (p) => <I {...p}><path d="M4 5h16l-6 8v6l-4-2v-4z"/></I>,
  Expand:  (p) => <I {...p}><path d="M3 9V3h6M21 9V3h-6M3 15v6h6M21 15v6h-6"/></I>,
  Speed:   (p) => <I {...p}><path d="M12 14l5-5"/><circle cx="12" cy="14" r="9"/><path d="M3 14a9 9 0 0 1 18 0"/></I>,
  Temp:    (p) => <I {...p}><path d="M14 14V5a2 2 0 1 0-4 0v9a4 4 0 1 0 4 0z"/></I>,
  Phone:   (p) => <I {...p}><path d="M5 4h3l2 5-2 1a11 11 0 0 0 6 6l1-2 5 2v3a2 2 0 0 1-2 2A17 17 0 0 1 3 6a2 2 0 0 1 2-2z"/></I>,
  Send:    (p) => <I {...p}><path d="M22 2 11 13"/><path d="M22 2 15 22l-4-9-9-4z"/></I>,
  Arrow:   (p) => <I {...p}><path d="M5 12h14M13 5l7 7-7 7"/></I>,
  Alert:   (p) => <I {...p}><path d="M12 3 2 21h20z"/><path d="M12 10v5M12 18h0"/></I>,
  Check:   (p) => <I {...p}><path d="m5 13 4 4L19 7"/></I>,
  X:       (p) => <I {...p}><path d="M6 6l12 12M18 6 6 18"/></I>,
  Menu:    (p) => <I {...p}><path d="M4 7h16M4 12h16M4 17h16"/></I>,
  Key:     (p) => <I {...p}><circle cx="8" cy="15" r="4"/><path d="m11 12 9-9"/><path d="m17 6 3 3"/></I>,
  Refresh: (p) => <I {...p}><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/><path d="M3 21v-5h5"/></I>,
  More:    (p) => <I {...p}><circle cx="5" cy="12" r="1.4"/><circle cx="12" cy="12" r="1.4"/><circle cx="19" cy="12" r="1.4"/></I>,
  Eye:     (p) => <I {...p}><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></I>,
  Pkg:     (p) => <I {...p}><path d="M21 8 12 3 3 8v8l9 5 9-5z"/><path d="M3 8l9 5 9-5"/><path d="M12 13v8"/></I>,
  Route:   (p) => <I {...p}><circle cx="6" cy="18" r="2"/><circle cx="18" cy="6" r="2"/><path d="M8 18h7a3 3 0 0 0 0-6h-6a3 3 0 0 1 0-6h7"/></I>,
  Mic:     (p) => <I {...p}><rect x="9" y="3" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0 0 14 0"/><path d="M12 18v3"/></I>,
  Star:    (p) => <I {...p}><path d="m12 3 2.6 5.5 6 .9-4.4 4.2 1 6L12 16.8l-5.2 2.8 1-6L3.4 9.4l6-.9z"/></I>,
  Logo:    ({ size = 22, color = '#2563EB' }) => (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <path d="M6 22 L16 6 L26 22 L20 22 L16 14 L12 22 Z" fill={color}/>
      <path d="M14 22 L16 18 L18 22 Z" fill="#0f172a"/>
    </svg>
  ),
};

window.Icons = Icons;
