"use client";
import Link from "next/link";
import { useRef, useState } from "react";
import GlassCard from "@/components/GlassCard";
import { Icon } from "@/components/Icons";
import { RECIPES, type Aisle } from "@/data/recipes";
import { clearDone, fmtQty, removeItem, toggleItem, update, useHydrated, useStore, haptic, type GroceryItem } from "@/lib/store";

const AISLES: Aisle[] = ["Produce", "Meat & Fish", "Dairy & Eggs", "Bakery", "Pantry", "Spices", "Frozen", "Other"];
type Place = { id: number; name: string; lat: number; lon: number; km: number; hours?: string; cuisine?: string };

const km = (a: number, b: number, c: number, d: number) => { const R = 6371, x = ((c - a) * Math.PI) / 180, y = ((d - b) * Math.PI) / 180; const h = Math.sin(x / 2) ** 2 + Math.cos((a * Math.PI) / 180) * Math.cos((c * Math.PI) / 180) * Math.sin(y / 2) ** 2; return 2 * R * Math.asin(Math.sqrt(h)); };
const navUrl = (p: Place) => (/iPhone|iPad|Mac/.test(navigator.userAgent) ? `https://maps.apple.com/?daddr=${p.lat},${p.lon}&q=${encodeURIComponent(p.name)}` : `https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lon}`);
// Free, keyless nearby search (OpenStreetMap / Overpass).
async function nearby(lat: number, lon: number, filter: string, radius = 6000): Promise<Place[]> {
  const q = `[out:json][timeout:20];(node${filter}(around:${radius},${lat},${lon});way${filter}(around:${radius},${lat},${lon}););out center 40;`;
  const r = await fetch("https://overpass-api.de/api/interpreter", { method: "POST", body: "data=" + encodeURIComponent(q), headers: { "content-type": "application/x-www-form-urlencoded" } });
  const j = await r.json();
  return (j.elements || []).map((e: any) => { const la = e.lat ?? e.center?.lat, lo = e.lon ?? e.center?.lon; return { id: e.id, name: e.tags?.name || "Unnamed", lat: la, lon: lo, km: km(lat, lon, la, lo), hours: e.tags?.opening_hours, cuisine: e.tags?.cuisine }; })
    .filter((p: Place) => p.name !== "Unnamed" && p.lat).sort((a: Place, b: Place) => a.km - b.km);
}

function Row({ g }: { g: GroceryItem }) {
  const start = useRef(0); const [dx, setDx] = useState(0);
  return (
    <div style={{ position: "relative", borderRadius: 18, overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(209,48,154,.35)", display: "flex", justifyContent: "flex-end", alignItems: "center", paddingRight: 18 }} className="mono">Delete</div>
      <div className="li" style={{ background: "rgba(12,14,26,.92)", transform: `translateX(${dx}px)`, transition: dx ? "none" : "transform 200ms cubic-bezier(.2,.8,.2,1)", touchAction: "pan-y" }}
        onTouchStart={(e) => (start.current = e.touches[0].clientX)}
        onTouchMove={(e) => setDx(Math.min(0, e.touches[0].clientX - start.current))}
        onTouchEnd={() => { if (dx < -90) { haptic(14); removeItem(g.key); } setDx(0); }}>
        <button className={`check ${g.done ? "on" : ""}`} aria-label={`Got ${g.item}`} onClick={() => { toggleItem(g.key); haptic(6); }}>{g.done && <svg width="14" height="14" viewBox="0 0 24 24"><path d="M5 12l5 5 9-10" stroke="#05060c" strokeWidth="3" fill="none" strokeLinecap="round" /></svg>}</button>
        <div style={{ flex: 1, opacity: g.done ? 0.45 : 1, textDecoration: g.done ? "line-through" : "none" }}>
          <div>{g.item}</div>
          <div className="mono" style={{ fontSize: 10, marginTop: 2 }}>{g.from.join(" · ")}</div>
        </div>
        <span className="mono" style={{ color: "#c8d3e6" }}>{fmtQty(g.qty, g.unit)}</span>
        <button className="icon-btn" style={{ width: 32, height: 32, flex: "0 0 32px" }} aria-label={`Remove ${g.item}`} onClick={() => removeItem(g.key)}><Icon.x /></button>
      </div>
    </div>
  );
}

export default function Grocery() {
  const s = useStore(); const ready = useHydrated();
  const [mode, setMode] = useState<"store" | "delivery">("store");
  const [stores, setStores] = useState<Place[] | null>(null);
  const [food, setFood] = useState<Place[] | null>(null);
  const [status, setStatus] = useState("");
  const dish = RECIPES.find((r) => s.grocery.some((g) => g.from.includes(r.title)));
  const cuisine = (dish?.cuisine || "").toLowerCase();

  const locate = () => {
    if (!navigator.geolocation) { setStatus("Location isn't available on this device."); return; }
    setStatus("Finding you…");
    navigator.geolocation.getCurrentPosition(async ({ coords }) => {
      try {
        setStatus("Looking for stores…");
        const [st, rs] = await Promise.all([
          nearby(coords.latitude, coords.longitude, '["shop"~"supermarket|grocery|greengrocer"]'),
          cuisine ? nearby(coords.latitude, coords.longitude, `["amenity"="restaurant"]["cuisine"~"${cuisine.replace(/[^a-z]/g, "")}",i]`, 10000) : Promise.resolve([])
        ]);
        setStores(st.slice(0, 3)); setFood(rs.slice(0, 3)); setStatus("");
      } catch { setStatus("Couldn't reach the map service. Try again in a moment."); }
    }, () => setStatus("Location is off. Allow it in your browser settings to see nearby stores."), { enableHighAccuracy: false, timeout: 12000 });
  };

  const share = async () => {
    const text = AISLES.map((a) => { const l = s.grocery.filter((g) => g.aisle === a && !g.done); return l.length ? `${a}\n${l.map((g) => `• ${g.item} ${fmtQty(g.qty, g.unit)}`).join("\n")}` : ""; }).filter(Boolean).join("\n\n");
    try { if (navigator.share) await navigator.share({ title: "Grocery list", text }); else await navigator.clipboard.writeText(text); } catch {}
  };
  const open = s.grocery.filter((g) => !g.done).length;

  return (
    <div className="stack">
      <div><h1>Grocery</h1><p className="muted" style={{ margin: "6px 0 0" }}>One list for the week. Duplicates combine, quantities scale.</p></div>
      <div className="seg"><button aria-pressed={mode === "store"} onClick={() => setMode("store")}>In-Store</button><button aria-pressed={mode === "delivery"} onClick={() => setMode("delivery")}>Delivery · Pro</button></div>

      {mode === "delivery" ? (
        <GlassCard style={{ padding: 20 }}>
          <div className="mono">PrepForge Pro · $8.99/month</div>
          <h2 style={{ margin: "6px 0 8px" }}>Order this list for delivery.</h2>
          <p className="muted" style={{ margin: "0 0 14px" }}>Send your list straight to a delivery cart, see the total, check out without leaving PrepForge, and keep favorite stores. Arriving with Pro.</p>
          <button className="btn primary" disabled style={{ width: "100%" }}>Order with Instacart · coming soon</button>
          <Link href="/pro/" className="btn ghost" style={{ width: "100%", marginTop: 8 }}>What's in Pro</Link>
        </GlassCard>
      ) : (
        <>
          {ready && !s.grocery.length && <GlassCard className="empty"><h2>Your list is empty</h2><p className="muted">Open any recipe and tap “Add to List”.</p><Link className="btn primary" href="/today/">Browse Today's Table</Link></GlassCard>}
          {s.grocery.length > 0 && (
            <div className="row between"><span className="mono">{open} to get · swipe left to delete</span>
              <div className="row"><button className="btn small" onClick={share}>Share</button><button className="btn small" onClick={clearDone}>Clear checked</button></div></div>
          )}
          {AISLES.map((a) => { const l = s.grocery.filter((g) => g.aisle === a); if (!l.length) return null;
            return <section key={a}><div className="mono" style={{ margin: "10px 4px 8px" }}>{a}</div><div className="list">{l.map((g) => <Row key={g.key} g={g} />)}</div></section>; })}

          <GlassCard style={{ padding: 16, marginTop: 6 }}>
            <div className="row between"><div><h2>Near you</h2><div className="mono" style={{ marginTop: 4 }}>Nearest stores{cuisine ? ` · ${dish?.cuisine} restaurants` : ""}</div></div>
              <button className="btn small" onClick={locate}><Icon.pin /> {stores ? "Refresh" : "Use location"}</button></div>
            {status && <p className="muted" style={{ margin: "12px 0 0" }}>{status}</p>}
            {stores && (
              <div className="list" style={{ marginTop: 12 }}>
                {!stores.length && <p className="muted">No grocery stores found within 6 km.</p>}
                {stores.map((p) => (
                  <div key={p.id} className="map-card" style={{ background: "rgba(0,0,0,.25)" }}>
                    <div style={{ minWidth: 0 }}><b>{p.name}</b><div className="mono" style={{ marginTop: 3 }}>{(p.km * 0.621).toFixed(1)} mi{p.hours ? ` · ${p.hours.slice(0, 40)}` : ""}</div></div>
                    <div className="row" style={{ gap: 6 }}>
                      <button className="btn small ghost" aria-label="Favorite store" onClick={() => update((st) => ({ ...st, favStores: st.favStores.includes(p.name) ? st.favStores.filter((x) => x !== p.name) : [...st.favStores, p.name] }))}>{s.favStores.includes(p.name) ? "★" : "☆"}</button>
                      <a className="btn small" href={navUrl(p)} target="_blank" rel="noopener">Navigate</a>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {food && food.length > 0 && (
              <>
                <div className="mono" style={{ margin: "16px 2px 8px" }}>Restaurants nearby serving {dish?.cuisine}</div>
                <div className="list">
                  {food.map((p) => (
                    <div key={p.id} className="map-card" style={{ background: "rgba(0,0,0,.25)" }}>
                      <div style={{ minWidth: 0 }}><b>{p.name}</b><div className="mono" style={{ marginTop: 3 }}>{(p.km * 0.621).toFixed(1)} mi{p.cuisine ? ` · ${p.cuisine.replace(/;/g, ", ")}` : ""}</div></div>
                      <a className="btn small" href={navUrl(p)} target="_blank" rel="noopener">Navigate</a>
                    </div>
                  ))}
                </div>
              </>
            )}
            <p className="mono" style={{ margin: "12px 2px 0", fontSize: 10 }}>Map data © OpenStreetMap contributors</p>
          </GlassCard>
        </>
      )}
    </div>
  );
}
