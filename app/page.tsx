import Link from "next/link";
import RecipeCard from "@/components/RecipeCard";
import GlassCard from "@/components/GlassCard";
import Greeting from "@/components/Greeting";
import { RECIPES, imageFor, MEAL_LABEL, type Meal } from "@/data/recipes";
import { TODAY, resolve } from "@/lib/today";

export default function Home() {
  const picks = resolve(TODAY);
  const date = new Date(TODAY.date + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  return (
    <div>
      <Greeting />
      <div className="section-head">
        <div><div className="mono">Today's Table · {date}</div><h2 style={{ marginTop: 4 }}>Six dishes, chosen this morning.</h2></div>
        <Link href="/today/" className="mono" style={{ color: "#c8d3e6" }}>All →</Link>
      </div>
      <div className="scroller">
        {picks.map((p) => <RecipeCard key={p.slot + p.id} r={p.r} note={p.note} label={p.slot} />)}
      </div>

      {(["dinner", "breakfast", "lunch", "snack"] as Meal[]).map((m) => {
        const list = RECIPES.filter((r) => r.meal === m).slice(0, 6);
        return (
          <section key={m}>
            <div className="section-head"><h2>{MEAL_LABEL[m]}</h2><Link href={`/discover/?meal=${m}`} className="mono" style={{ color: "#c8d3e6" }}>More →</Link></div>
            <div className="scroller">
              {list.map((r) => (
                <Link key={r.id} href={`/recipe/${r.id}/`} className="tile glass" style={{ minWidth: "46%", scrollSnapAlign: "start", borderRadius: 22 }}>
                  <img src={imageFor(r, 500, 500)} alt={r.title} loading="lazy" />
                  <span className="over"><b>{r.title}</b><span className="mono" style={{ marginTop: 4 }}>{r.minutes} min · {r.cuisine}</span></span>
                </Link>
              ))}
            </div>
          </section>
        );
      })}

      <GlassCard style={{ padding: 22, marginTop: 10 }}>
        <div className="mono">Prep once, eat well</div>
        <h2 style={{ margin: "6px 0 8px" }}>Your week, on one list.</h2>
        <p className="muted" style={{ margin: "0 0 14px" }}>Add any recipe to Grocery. Duplicates combine, quantities scale to your table, and the nearest stores are a tap away.</p>
        <Link href="/grocery/" className="btn primary">Open Grocery</Link>
      </GlassCard>
    </div>
  );
}
