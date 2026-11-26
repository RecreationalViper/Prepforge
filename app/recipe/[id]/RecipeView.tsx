"use client";
import Link from "next/link";
import { useState } from "react";
import GlassCard from "@/components/GlassCard";
import SaveButton from "@/components/SaveButton";
import Platforms from "@/components/Platforms";
import { Icon } from "@/components/Icons";
import { imageFor, MEAL_LABEL, type Recipe } from "@/data/recipes";
import { addRecipeToList, fmtQty, update, useStore, useToast, haptic } from "@/lib/store";

export default function RecipeView({ r }: { r: Recipe }) {
  const s = useStore();
  const [servings, setServings] = useState<number>(r.servings);
  const [have, setHave] = useState<Record<number, boolean>>({});
  const [done, setDone] = useState<Record<number, boolean>>({});
  const [playing, setPlaying] = useState(true);
  const { msg, show } = useToast();
  const k = servings / r.servings;
  const video = r.videos?.tiktok || r.videos?.instagram; // a direct .mp4 plays inline; platform links open their apps
  const mp4 = video && /\.mp4(\?|$)/.test(video) ? video : null;
  const cooked = s.cooks.filter((c) => c.id === r.id).length;

  return (
    <div className="stack" style={{ gap: 16 }}>
      <div className="row between">
        <Link href="/" className="icon-btn glass" aria-label="Back" style={{ borderRadius: 16 }}><Icon.back /></Link>
        <span className="mono">{MEAL_LABEL[r.meal]} · {r.cuisine}</span>
        <span style={{ width: 44 }} />
      </div>

      <div className="hero glass" style={{ borderRadius: 28 }}>
        {mp4
          ? <video src={mp4} poster={imageFor(r)} autoPlay={playing} muted loop playsInline onClick={(e) => { const v = e.currentTarget; if (v.paused) { v.play(); setPlaying(true); } else { v.pause(); setPlaying(false); } }} />
          : <img src={imageFor(r)} alt={r.title} />}
        <SaveButton id={r.id} />
        {mp4 && <span className="chip" style={{ position: "absolute", bottom: 14, left: 14 }}>{playing ? "Tap to pause" : "Tap to play"}</span>}
      </div>

      <div>
        <h1>{r.title}</h1>
        <p className="muted" style={{ margin: "8px 0 12px" }}>{r.blurb}</p>
        <div className="chips"><span className="chip"><Icon.clock /> {r.minutes} min</span><span className="chip">{r.level}</span><span className="chip">by {r.author}</span>{cooked > 0 && <span className="chip">cooked {cooked}×</span>}</div>
      </div>

      <GlassCard style={{ padding: 14, borderRadius: 22 }}>
        <div className="mono" style={{ marginBottom: 10 }}>Watch it made</div>
        <Platforms r={r} />
      </GlassCard>

      <GlassCard style={{ padding: 16 }}>
        <div className="row between" style={{ marginBottom: 12 }}>
          <h2>Ingredients</h2>
          <div className="row" aria-label="Servings">
            <button className="btn small" onClick={() => { setServings(Math.max(1, servings - 1)); haptic(6); }} aria-label="Fewer servings">−</button>
            <span className="mono" style={{ minWidth: 70, textAlign: "center", color: "#e6f0ff" }}>{servings} {servings === 1 ? "serving" : "servings"}</span>
            <button className="btn small" onClick={() => { setServings(servings + 1); haptic(6); }} aria-label="More servings">+</button>
          </div>
        </div>
        <div className="list">
          {r.ingredients.map((g, i) => (
            <div key={i} className="li" style={{ background: "rgba(0,0,0,.22)" }}>
              <button className={`check ${have[i] ? "on" : ""}`} aria-label={`Have ${g.item}`} onClick={() => setHave({ ...have, [i]: !have[i] })}>{have[i] && <svg width="14" height="14" viewBox="0 0 24 24"><path d="M5 12l5 5 9-10" stroke="#05060c" strokeWidth="3" fill="none" strokeLinecap="round" /></svg>}</button>
              <span style={{ flex: 1, opacity: have[i] ? 0.5 : 1 }}>{g.item}</span>
              <span className="mono" style={{ color: "#c8d3e6" }}>{fmtQty(Math.round(g.qty * k * 100) / 100, g.unit)}</span>
            </div>
          ))}
        </div>
        <button className="btn primary" style={{ width: "100%", marginTop: 14 }} onClick={() => { addRecipeToList(r, servings); show("Added to your grocery list"); }}>Add to List</button>
      </GlassCard>

      <GlassCard style={{ padding: 16 }}>
        <h2 style={{ marginBottom: 12 }}>Method</h2>
        <div className="list">
          {r.steps.map((step, i) => (
            <button key={i} className="li" style={{ background: "rgba(0,0,0,.22)", border: 0, textAlign: "left", cursor: "pointer", alignItems: "flex-start", opacity: done[i] ? 0.45 : 1 }} onClick={() => { setDone({ ...done, [i]: !done[i] }); haptic(8); }}>
              <span className="step-n">{i + 1}</span><span style={{ flex: 1, paddingTop: 3 }}>{step}</span>
            </button>
          ))}
        </div>
        <p className="mono" style={{ margin: "12px 2px 0" }}>Tap a step when it's done · step comments arrive with accounts</p>
      </GlassCard>

      <div className="row" style={{ gap: 10 }}>
        <button className="btn" style={{ flex: 1 }} onClick={() => { update((st) => ({ ...st, cooks: [{ id: r.id, at: new Date().toISOString() }, ...st.cooks].slice(0, 200) })); show("Logged. Nicely done."); }}>I cooked this</button>
        <button className="btn" style={{ flex: 1 }} onClick={async () => { const url = location.href; try { if (navigator.share) await navigator.share({ title: r.title, text: r.blurb, url }); else { await navigator.clipboard.writeText(url); show("Link copied"); } } catch {} }}>Share</button>
      </div>
      {msg && <GlassCard className="toast" style={{ borderRadius: 16 }}>{msg}</GlassCard>}
    </div>
  );
}
