"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import GlassCard from "./GlassCard";
import { Icon } from "./Icons";
import { RECIPES, imageFor } from "@/data/recipes";
import { useStore } from "@/lib/store";

const NAV: [string, string, keyof typeof Icon][] = [
  ["/", "Home", "home"], ["/today", "Today's Table", "table"], ["/discover", "Discover", "discover"], ["/planner", "Planner", "planner"],
  ["/pantry", "Pantry", "pantry"], ["/social", "Social Feed", "social"], ["/grocery", "Grocery", "grocery"], ["/saves", "Saves", "bookmark"],
  ["/pro", "Pro Upgrade", "star"], ["/settings", "Settings", "settings"]
];
const FOOT: [string, string][] = [["/about", "About"], ["/careers", "Careers"], ["/press", "Press"], ["/contact", "Contact Us"], ["/help", "Help"], ["/terms", "Terms"], ["/privacy", "Privacy"], ["/cookies", "Cookies"], ["/community", "Community Guidelines"]];

export default function TopBar() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [focus, setFocus] = useState(false);
  const path = usePathname();
  const router = useRouter();
  const s = useStore();
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => { setOpen(false); setFocus(false); }, [path]);
  useEffect(() => { document.body.style.overflow = open ? "hidden" : ""; }, [open]);
  useEffect(() => {
    const k = (e: KeyboardEvent) => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); box.current?.querySelector("input")?.focus(); } if (e.key === "Escape") { setOpen(false); setFocus(false); } };
    addEventListener("keydown", k); return () => removeEventListener("keydown", k);
  }, []);

  const results = useMemo(() => {
    const t = q.trim().toLowerCase(); if (t.length < 2) return null;
    const recipes = RECIPES.filter((r) => `${r.title} ${r.cuisine} ${r.meal} ${r.tags.join(" ")}`.toLowerCase().includes(t)).slice(0, 6);
    const ings = RECIPES.filter((r) => r.ingredients.some((i) => i.item.toLowerCase().includes(t)) && !recipes.includes(r)).slice(0, 4);
    const people = [...new Set(RECIPES.map((r) => r.author))].filter((a) => a.toLowerCase().includes(t)).slice(0, 3);
    return { recipes, ings, people };
  }, [q]);
  const initial = (s.prefs.name || "P").trim()[0]?.toUpperCase() || "P";

  return (
    <>
      <header className="topbar">
        <GlassCard className="topbar-inner" style={{ borderRadius: 24 }}>
          <button className="icon-btn" aria-label="Open menu" aria-expanded={open} onClick={() => setOpen(true)}>
            <span className="burger"><i /><i /><i /></span>
          </button>
          <div className="search" ref={box}>
            <Icon.search />
            <input type="search" value={q} placeholder="Search recipes, people, ingredients..." aria-label="Search"
              onChange={(e) => setQ(e.target.value)} onFocus={() => setFocus(true)} onBlur={() => setTimeout(() => setFocus(false), 150)}
              onKeyDown={(e) => { if (e.key === "Enter" && q.trim()) router.push(`/discover/?q=${encodeURIComponent(q.trim())}`); }} />
            {focus && results && (
              <GlassCard className="results" style={{ borderRadius: 22 }} role="listbox">
                {!results.recipes.length && !results.ings.length && !results.people.length && <div className="muted" style={{ padding: 10 }}>Nothing yet for “{q}”.</div>}
                {results.recipes.length > 0 && <div className="mono" style={{ padding: "6px 8px" }}>Recipes</div>}
                {results.recipes.map((r) => (
                  <Link key={r.id} href={`/recipe/${r.id}/`} className="result"><img src={imageFor(r, 120, 120)} alt="" loading="lazy" /><div><b>{r.title}</b><div className="mono">{r.cuisine} · {r.minutes} min</div></div></Link>
                ))}
                {results.ings.length > 0 && <div className="mono" style={{ padding: "6px 8px" }}>Made with “{q}”</div>}
                {results.ings.map((r) => (
                  <Link key={r.id} href={`/recipe/${r.id}/`} className="result"><img src={imageFor(r, 120, 120)} alt="" loading="lazy" /><div><b>{r.title}</b><div className="mono">{r.meal}</div></div></Link>
                ))}
                {results.people.length > 0 && <div className="mono" style={{ padding: "6px 8px" }}>People</div>}
                {results.people.map((p) => (<Link key={p} href="/social/" className="result"><span className="avatar" style={{ margin: 4 }}>{p[0]}</span><b>{p}</b></Link>))}
              </GlassCard>
            )}
          </div>
          <Link href="/profile/" className="avatar" aria-label="Profile">{initial}</Link>
        </GlassCard>
      </header>

      <div className={`scrim ${open ? "open" : ""}`} onClick={() => setOpen(false)} />
      <GlassCard as="aside" className={`drawer ${open ? "open" : ""}`} style={{ background: "rgba(8,9,18,.72)" }} aria-hidden={!open} tint={false}>
        <div className="row between" style={{ padding: "4px 6px 14px" }}>
          <div className="row"><span style={{ width: 12, height: 12, borderRadius: 6, background: "conic-gradient(from 0deg,#6b4dff,#0fb6e0,#d1309a,#6b4dff)" }} /><b style={{ letterSpacing: ".22em", fontSize: 14 }}>PREPFORGE</b></div>
          <button className="icon-btn" aria-label="Close menu" onClick={() => setOpen(false)}><Icon.x /></button>
        </div>
        <nav>
          {NAV.map(([href, label, ic]) => { const I = Icon[ic]; return (
            <Link key={href} href={href === "/" ? "/" : `${href}/`} aria-current={path === href || path === `${href}/` ? "page" : undefined}><span className="ic"><I /></span>{label}</Link>
          ); })}
        </nav>
        <div className="foot">{FOOT.map(([href, label]) => <Link key={href} href={`${href}/`}>{label}</Link>)}</div>
      </GlassCard>
    </>
  );
}
