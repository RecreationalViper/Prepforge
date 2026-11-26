"use client";
import { useSearchParams } from "next/navigation";
import { useMemo, useState, useEffect } from "react";
import RecipeCard from "@/components/RecipeCard";
import { RECIPES, MEAL_LABEL, type Meal } from "@/data/recipes";

const MEALS: ("all" | Meal)[] = ["all", "breakfast", "lunch", "dinner", "snack"];
export default function DiscoverView() {
  const sp = useSearchParams();
  const [q, setQ] = useState("");
  const [meal, setMeal] = useState<"all" | Meal>("all");
  const [quick, setQuick] = useState(false);
  useEffect(() => { setQ(sp.get("q") || ""); const m = sp.get("meal"); if (m && (MEALS as string[]).includes(m)) setMeal(m as Meal); }, [sp]);
  const list = useMemo(() => {
    const t = q.trim().toLowerCase();
    return RECIPES.filter((r) => (meal === "all" || r.meal === meal) && (!quick || r.minutes <= 20) &&
      (!t || `${r.title} ${r.cuisine} ${r.blurb} ${r.tags.join(" ")} ${r.ingredients.map((i) => i.item).join(" ")} ${r.author}`.toLowerCase().includes(t)));
  }, [q, meal, quick]);
  return (
    <div className="stack">
      <div><h1>Discover</h1><p className="muted" style={{ margin: "6px 0 0" }}>{RECIPES.length} dishes and counting. New world dishes arrive every morning.</p></div>
      <input className="input" type="search" placeholder="Try “salmon”, “Thai”, “under 15”..." value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search recipes" />
      <div className="seg">{MEALS.map((m) => <button key={m} aria-pressed={meal === m} onClick={() => setMeal(m)}>{m === "all" ? "All" : MEAL_LABEL[m]}</button>)}</div>
      <label className="row mono" style={{ gap: 8, cursor: "pointer" }}><input type="checkbox" checked={quick} onChange={(e) => setQuick(e.target.checked)} /> 20 minutes or less</label>
      {list.map((r) => <RecipeCard key={r.id} r={r} width="100%" />)}
      {!list.length && <p className="muted empty">Nothing matches yet. Try an ingredient you have.</p>}
    </div>
  );
}
