import Link from "next/link";
import GlassCard from "@/components/GlassCard";
import RecipeCard from "@/components/RecipeCard";
import { imageFor } from "@/data/recipes";
import { ARCHIVE, TODAY, resolve } from "@/lib/today";

export const metadata = { title: "Today's Table" };
export default function Today() {
  const picks = resolve(TODAY);
  return (
    <div className="stack">
      <div><div className="mono">Curated {new Date(TODAY.date + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</div><h1 style={{ marginTop: 6 }}>Today's Table</h1>
        <p className="muted" style={{ margin: "8px 0 0" }}>A breakfast under fifteen minutes, a lunch that holds you, a balanced dinner, two light snacks and one dish from somewhere new: {TODAY.country}.</p></div>
      <div className="stack">{picks.map((p) => <RecipeCard key={p.slot + p.id} r={p.r} note={p.note} label={p.slot} width="100%" />)}</div>
      <div className="section-head"><h2>The last 30 days</h2></div>
      <div className="stack">
        {ARCHIVE.filter((d) => d.date !== TODAY.date).map((d) => (
          <GlassCard key={d.date} style={{ padding: 14, borderRadius: 22 }}>
            <div className="mono" style={{ marginBottom: 10 }}>{new Date(d.date + "T12:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })} · {d.country}</div>
            <div className="scroller" style={{ paddingBottom: 4 }}>
              {resolve(d).map((p) => (
                <Link key={p.slot + p.id} href={`/recipe/${p.id}/`} className="tile" style={{ minWidth: 110, maxWidth: 110, borderRadius: 16 }}>
                  <img src={imageFor(p.r, 300, 300)} alt={p.r.title} loading="lazy" /><span className="over" style={{ padding: 8 }}><b style={{ fontSize: 12 }}>{p.r.title}</b></span>
                </Link>
              ))}
            </div>
          </GlassCard>
        ))}
        {ARCHIVE.length <= 1 && <GlassCard className="empty" style={{ borderRadius: 22 }}><span className="muted">The archive fills in day by day. Tomorrow's table lands at 6 a.m.</span></GlassCard>}
      </div>
    </div>
  );
}
