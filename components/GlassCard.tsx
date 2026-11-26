"use client";
// Liquid Glass panel. Bends light rather than frosting: blur 32 / saturate 180 / contrast 110, a pointer-following
// top specular (::before) and a conic edge lens (::after), both in globals.css.
// The tint drifts 8% toward the hue of whatever orb sits behind the panel, re-sampled every 100 ms while scrolling.
import { useEffect, useRef, type CSSProperties, type ElementType, type ReactNode } from "react";

const ORBS = [
  { x: 0.05, y: -0.1, rgb: [107, 77, 255] }, // violet, top-left
  { x: 0.95, y: 0.05, rgb: [209, 48, 154] }, // magenta, top-right
  { x: 0.4, y: 1.1, rgb: [15, 182, 224] } // cyan, bottom
];
function tintAt(cx: number, cy: number) {
  let w = 0; const c = [0, 0, 0];
  for (const o of ORBS) { const d = Math.hypot(cx - o.x, cy - o.y); const k = 1 / Math.max(0.08, d * d); w += k; o.rgb.forEach((v, i) => (c[i] += v * k)); }
  return `rgba(${c.map((v) => Math.round(v / w)).join(",")},0.08)`;
}

export default function GlassCard({ as: Tag = "div", className = "", style, children, tint = true, ...rest }:
  { as?: ElementType; className?: string; style?: CSSProperties; children?: ReactNode; tint?: boolean; [k: string]: unknown }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el || !tint) return;
    let t = 0;
    const sample = () => {
      const b = el.getBoundingClientRect();
      el.style.setProperty("--tint", tintAt((b.left + b.width / 2) / innerWidth, (b.top + b.height / 2) / innerHeight));
    };
    const onScroll = () => { if (t) return; t = window.setTimeout(() => { t = 0; sample(); }, 100); };
    sample();
    addEventListener("scroll", onScroll, { passive: true }); addEventListener("resize", onScroll);
    return () => { removeEventListener("scroll", onScroll); removeEventListener("resize", onScroll); clearTimeout(t); };
  }, [tint]);
  return <Tag ref={ref} className={`glass ${className}`} style={style} {...rest}>{children}</Tag>;
}
