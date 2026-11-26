"use client";
import Link from "next/link";
import { useState } from "react";
import GlassCard from "@/components/GlassCard";
import SaveButton from "@/components/SaveButton";
import { RECIPES, imageFor, MEAL_LABEL, type Meal } from "@/data/recipes";
import { useStore, useHydrated } from "@/lib/store";

export default function Saves() {
  const s = useStore(); const ready = useHydrated();
  const [q, setQ] = useState("");
  const saved = RECIPES.filter((r) => s.saves.includes(r.id) && (!q || `${r.title} ${r.cuisine} ${r.ingredients.map((i) => i.item).join(" ")}`.toLowerCase().includes(q.toLowerCase())));
  return (
    <div className="stack">
      <div><h1>Saves</h1><p className="muted" style={{ margin: "6px 0 0" }}>Everything you've bookmarked, by meal.</p></div>
      <input className="input" type="search" placeholder="Search your saves" value={q} onChange={(e) => setQ(e.target.value)} />
      {ready && !s.saves.length && <GlassCard className="empty"><h2>Nothing saved yet</h2><p className="muted">Tap the bookmark on any dish and it lands here.</p><Link className="btn primary" href="/discover/">Discover dishes</Link></GlassCard>}
      {(["breakfast", "lunch", "dinner", "snack"] as Meal[]).map((m) => {
        const list = saved.filter((r) => r.meal === m); if (!list.length) return null;
        return (
          <section key={m}>
            <div className="section-head"><h2>{MEAL_LABEL[m]}</h2><span className="mono">{list.length}</span></div>
            <div className="today-grid">
              {list.map((r) => (
                <div key={r.id} style={{ position: "relative" }}>
                  <Link href={`/recipe/${r.id}/`} className="tile glass" style={{ borderRadius: 22 }}>
                    <img src={imageFor(r, 500, 500)} alt={r.title} loading="lazy" />
                    <span className="over"><b>{r.title}</b><span className="mono" style={{ marginTop: 4 }}>{r.minutes} min</span></span>
                  </Link>
                  <SaveButton id={r.id} />
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
