"use client";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { imageFor, MEAL_LABEL, type Recipe } from "@/data/recipes";
import SaveButton from "./SaveButton";
import Platforms from "./Platforms";
import { Icon } from "./Icons";

// 3D card: tilts up to 8° toward the finger with a real spring (stiffness 300, damping 20), scales to 1.02.
function useSpringTilt() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const k = 300, c = 20; // spring stiffness, damping (mass 1)
    let x = 0, y = 0, s = 1, vx = 0, vy = 0, vs = 0, tx = 0, ty = 0, ts = 1, raf = 0, last = 0;
    const step = (now: number) => {
      const dt = Math.min(0.032, (now - last) / 1000 || 0.016); last = now;
      vx += (k * (tx - x) - c * vx) * dt; x += vx * dt;
      vy += (k * (ty - y) - c * vy) * dt; y += vy * dt;
      vs += (k * (ts - s) - c * vs) * dt; s += vs * dt;
      el.style.transform = `rotateX(${y.toFixed(2)}deg) rotateY(${x.toFixed(2)}deg) scale(${s.toFixed(4)})`;
      if (Math.abs(tx - x) + Math.abs(ty - y) + Math.abs(ts - s) + Math.abs(vx) + Math.abs(vy) > 0.01) raf = requestAnimationFrame(step); else raf = 0;
    };
    const kick = () => { if (!raf) { last = performance.now(); raf = requestAnimationFrame(step); } };
    const move = (e: PointerEvent) => { const b = el.getBoundingClientRect(); tx = ((e.clientX - b.left) / b.width - 0.5) * 16; ty = -((e.clientY - b.top) / b.height - 0.5) * 16; ts = 1.02; kick(); };
    const leave = () => { tx = 0; ty = 0; ts = 1; kick(); };
    el.addEventListener("pointermove", move); el.addEventListener("pointerleave", leave); el.addEventListener("pointercancel", leave); el.addEventListener("pointerup", leave);
    return () => { cancelAnimationFrame(raf); el.removeEventListener("pointermove", move); el.removeEventListener("pointerleave", leave); el.removeEventListener("pointercancel", leave); el.removeEventListener("pointerup", leave); };
  }, []);
  return ref;
}

export default function RecipeCard({ r, note, label, width = "78%" }: { r: Recipe; note?: string; label?: string; width?: string }) {
  const ref = useSpringTilt();
  return (
    <div className="rcard-wrap" style={{ minWidth: width, maxWidth: width }}>
      <div ref={ref} className="rcard glass" style={{ borderRadius: 28 }}>
        <div className="media"><img src={imageFor(r)} alt={r.title} loading="lazy" decoding="async" /></div>
        <Link href={`/recipe/${r.id}/`} className="cover" aria-label={r.title} />
        <span className="chip kicker">{label || MEAL_LABEL[r.meal]}</span>
        <SaveButton id={r.id} />
        <div className="body">
          <div>
            <div className="h1" style={{ fontSize: 26 }}>{r.title}</div>
            <div style={{ color: "#c8d3e6", marginTop: 6, fontSize: 14 }}>{note || r.blurb}</div>
          </div>
          <div className="chips"><span className="chip"><Icon.clock /> {r.minutes} min</span><span className="chip">{r.cuisine}</span><span className="chip">{r.level}</span></div>
          <div style={{ position: "relative", zIndex: 3 }}><Platforms r={r} small /></div>
        </div>
      </div>
    </div>
  );
}
