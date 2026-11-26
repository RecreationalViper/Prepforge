"use client";
import { useState } from "react";
import GlassCard from "@/components/GlassCard";
import RecipeCard from "@/components/RecipeCard";
import { RECIPES } from "@/data/recipes";
import { update, useStore } from "@/lib/store";

export default function Pantry() {
  const s = useStore(); const [v, setV] = useState("");
  const add = () => { const items = v.split(",").map((x) => x.trim().toLowerCase()).filter(Boolean); if (!items.length) return; update((st) => ({ ...st, pantry: [...new Set([...items, ...st.pantry])] })); setV(""); };
  const score = (r: (typeof RECIPES)[number]) => r.ingredients.filter((i) => s.pantry.some((p) => i.item.toLowerCase().includes(p) || p.includes(i.item.toLowerCase()))).length / r.ingredients.length;
  const best = s.pantry.length ? [...RECIPES].map((r) => ({ r, k: score(r) })).filter((x) => x.k > 0).sort((a, b) => b.k - a.k).slice(0, 4) : [];
  return (
    <div className="stack">
      <div><h1>Pantry</h1><p className="muted" style={{ margin: "6px 0 0" }}>Tell PrepForge what's on hand; it finds what you can make.</p></div>
      <div className="row"><input className="input" placeholder="eggs, rice, lemon…" value={v} onChange={(e) => setV(e.target.value)} onKeyDown={(e) => e.key === "Enter" && add()} /><button className="btn primary" onClick={add}>Add</button></div>
      {s.pantry.length > 0 && <div className="chips">{s.pantry.map((p) => <button key={p} className="chip" style={{ cursor: "pointer" }} onClick={() => update((st) => ({ ...st, pantry: st.pantry.filter((x) => x !== p) }))}>{p} ✕</button>)}</div>}
      {best.length > 0 && <div className="section-head"><h2>You can almost make</h2></div>}
      {best.map(({ r, k }) => <RecipeCard key={r.id} r={r} width="100%" label={`${Math.round(k * 100)}% on hand`} />)}
      {!s.pantry.length && <GlassCard className="empty"><span className="muted">Add a few staples to get matches.</span></GlassCard>}
    </div>
  );
}
