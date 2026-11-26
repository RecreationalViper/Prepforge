"use client";
import Link from "next/link";
import GlassCard from "@/components/GlassCard";
import { RECIPES, byId, imageFor } from "@/data/recipes";
import { addRecipeToList, update, useStore, useToast } from "@/lib/store";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
export default function Planner() {
  const s = useStore(); const { msg, show } = useToast();
  const set = (day: string, id: string) => update((st) => ({ ...st, plan: [...st.plan.filter((p) => p.day !== day), ...(id ? [{ day, id }] : [])] }));
  const shopAll = () => { s.plan.forEach((p) => { const r = byId(p.id); if (r) addRecipeToList(r, s.prefs.servings || r.servings); }); show("Week added to Grocery"); };
  return (
    <div className="stack">
      <div><h1>Planner</h1><p className="muted" style={{ margin: "6px 0 0" }}>Prep once, eat well. Pick a dinner for each night.</p></div>
      {DAYS.map((d) => { const cur = s.plan.find((p) => p.day === d); const r = cur ? byId(cur.id) : undefined;
        return (
          <GlassCard key={d} style={{ padding: 12, borderRadius: 22 }}>
            <div className="row" style={{ gap: 12 }}>
              <div className="mono" style={{ width: 34 }}>{d}</div>
              {r ? <Link href={`/recipe/${r.id}/`}><img src={imageFor(r, 120, 120)} alt="" style={{ width: 44, height: 44, borderRadius: 12, objectFit: "cover" }} /></Link> : <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(255,255,255,.06)" }} />}
              <select className="input" style={{ flex: 1, minHeight: 40 }} value={cur?.id || ""} onChange={(e) => set(d, e.target.value)} aria-label={`${d} dinner`}>
                <option value="">Nothing planned</option>
                {RECIPES.filter((x) => x.meal !== "snack").map((x) => <option key={x.id} value={x.id}>{x.title}</option>)}
              </select>
            </div>
          </GlassCard>
        ); })}
      <button className="btn primary" disabled={!s.plan.length} onClick={shopAll}>Add the week to Grocery</button>
      {msg && <GlassCard className="toast">{msg}</GlassCard>}
    </div>
  );
}
