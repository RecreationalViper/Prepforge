// Hand-drawn 24px line icons (1.8 stroke) so nothing looks like a stock icon set.
const P = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
export const Icon = {
  home: () => <svg width="22" height="22" viewBox="0 0 24 24" {...P}><path d="M4 10.5 12 4l8 6.5V19a1 1 0 0 1-1 1h-4.5v-5.5h-5V20H5a1 1 0 0 1-1-1z" /></svg>,
  discover: () => <svg width="22" height="22" viewBox="0 0 24 24" {...P}><circle cx="12" cy="12" r="8.5" /><path d="m15.5 8.5-2 5-5 2 2-5z" /></svg>,
  plus: () => <svg width="24" height="24" viewBox="0 0 24 24" {...P} strokeWidth={2.2}><path d="M12 5v14M5 12h14" /></svg>,
  social: () => <svg width="22" height="22" viewBox="0 0 24 24" {...P}><circle cx="9" cy="9" r="3.2" /><circle cx="17" cy="10" r="2.4" /><path d="M3.5 19c.8-3 3-4.6 5.5-4.6s4.7 1.6 5.5 4.6M14.5 15.2c.8-.5 1.6-.7 2.5-.7 2 0 3.5 1.4 4 4.5" /></svg>,
  profile: () => <svg width="22" height="22" viewBox="0 0 24 24" {...P}><circle cx="12" cy="8.5" r="3.8" /><path d="M4.5 20c1.2-3.6 4-5.5 7.5-5.5s6.3 1.9 7.5 5.5" /></svg>,
  search: () => <svg width="18" height="18" viewBox="0 0 24 24" {...P}><circle cx="11" cy="11" r="6.5" /><path d="m20 20-4.2-4.2" /></svg>,
  bookmark: () => <svg width="20" height="20" viewBox="0 0 24 24" {...P}><path d="M6.5 4h11a1 1 0 0 1 1 1v15l-6.5-4-6.5 4V5a1 1 0 0 1 1-1z" /></svg>,
  table: () => <svg width="20" height="20" viewBox="0 0 24 24" {...P}><circle cx="12" cy="12" r="5" /><path d="M4 4v6m0 0v10M2.5 4v4a1.5 1.5 0 0 0 3 0V4M20 4c-1.5 1-2 3-2 5h2v11" /></svg>,
  planner: () => <svg width="20" height="20" viewBox="0 0 24 24" {...P}><rect x="4" y="5" width="16" height="15" rx="3" /><path d="M8 3v4M16 3v4M4 10h16" /></svg>,
  pantry: () => <svg width="20" height="20" viewBox="0 0 24 24" {...P}><path d="M7 3h10v4H7zM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1z" /><path d="M10 12h4" /></svg>,
  grocery: () => <svg width="20" height="20" viewBox="0 0 24 24" {...P}><path d="M3 4h2.5l2.2 10.5h10.6L20.5 7H7" /><circle cx="9.5" cy="19" r="1.4" /><circle cx="17" cy="19" r="1.4" /></svg>,
  star: () => <svg width="20" height="20" viewBox="0 0 24 24" {...P}><path d="m12 3.5 2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.8z" /></svg>,
  settings: () => <svg width="20" height="20" viewBox="0 0 24 24" {...P}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" /></svg>,
  pin: () => <svg width="18" height="18" viewBox="0 0 24 24" {...P}><path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z" /><circle cx="12" cy="10" r="2.3" /></svg>,
  clock: () => <svg width="14" height="14" viewBox="0 0 24 24" {...P}><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></svg>,
  back: () => <svg width="22" height="22" viewBox="0 0 24 24" {...P}><path d="M15 5l-7 7 7 7" /></svg>,
  x: () => <svg width="20" height="20" viewBox="0 0 24 24" {...P}><path d="M6 6l12 12M18 6 6 18" /></svg>
};
