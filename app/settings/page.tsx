"use client";
import Link from "next/link";
import GlassCard from "@/components/GlassCard";
import { update, useStore } from "@/lib/store";
export default function Settings() {
  const s = useStore();
  const set = (k: keyof typeof s.prefs, v: string | number) => update((st) => ({ ...st, prefs: { ...st.prefs, [k]: v } }));
  return (
    <div className="stack">
      <h1>Settings</h1>
      <GlassCard style={{ padding: 16 }} className="stack">
        <label className="stack" style={{ gap: 6 }}><span className="mono">Your name</span><input className="input" value={s.prefs.name} onChange={(e) => set("name", e.target.value)} placeholder="First name" /></label>
        <label className="stack" style={{ gap: 6 }}><span className="mono">Allergies</span><input className="input" value={s.prefs.allergies} onChange={(e) => set("allergies", e.target.value)} placeholder="peanuts, shellfish" /></label>
        <label className="stack" style={{ gap: 6 }}><span className="mono">How you eat</span><input className="input" value={s.prefs.diet} onChange={(e) => set("diet", e.target.value)} placeholder="vegetarian, no pork…" /></label>
        <label className="stack" style={{ gap: 6 }}><span className="mono">Default servings</span><input className="input" type="number" min={1} max={12} value={s.prefs.servings} onChange={(e) => set("servings", Math.max(1, Number(e.target.value) || 1))} /></label>
      </GlassCard>
      <GlassCard style={{ padding: 16 }}>
        <div className="mono">Your data</div>
        <p className="muted" style={{ margin: "6px 0 12px" }}>Saves, lists and plans live on this device until accounts arrive.</p>
        <button className="btn" onClick={() => { if (confirm("Erase saves, grocery list and plans on this device?")) { localStorage.removeItem("prepforge:v1"); location.reload(); } }}>Erase this device's data</button>
      </GlassCard>
      <div className="chips">{["about", "help", "privacy", "terms"].map((p) => <Link key={p} className="chip" href={`/${p}/`}>{p}</Link>)}</div>
    </div>
  );
}
