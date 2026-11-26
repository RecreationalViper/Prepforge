"use client";
// Local-first store: everything works offline on the phone right away. When Supabase is connected
// (NEXT_PUBLIC_SUPABASE_URL + anon key), lib/sync.ts mirrors these same records to the user's account.
import { useEffect, useState, useCallback } from "react";
import type { Aisle, Recipe } from "@/data/recipes";

export type GroceryItem = { key: string; item: string; qty: number; unit: string; aisle: Aisle; done: boolean; from: string[] };
export type State = {
  saves: string[];
  grocery: GroceryItem[];
  plan: { day: string; id: string }[];
  pantry: string[];
  prefs: { name: string; allergies: string; diet: string; servings: number };
  favStores: string[];
  cooks: { id: string; at: string }[];
};
const KEY = "prepforge:v1";
const EMPTY: State = { saves: [], grocery: [], plan: [], pantry: [], prefs: { name: "", allergies: "", diet: "", servings: 2 }, favStores: [], cooks: [] };

function load(): State {
  if (typeof window === "undefined") return EMPTY;
  try { return { ...EMPTY, ...JSON.parse(localStorage.getItem(KEY) || "{}") }; } catch { return EMPTY; }
}
let state: State = EMPTY;
let loaded = false;
const subs = new Set<() => void>();
function emit() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {} subs.forEach((f) => f()); }
export function update(fn: (s: State) => State) { state = fn(state); emit(); }

export function useStore(): State {
  const [, force] = useState(0);
  useEffect(() => {
    if (!loaded) { state = load(); loaded = true; }
    const f = () => force((n) => n + 1);
    subs.add(f); f();
    const onStorage = (e: StorageEvent) => { if (e.key === KEY) { state = load(); f(); } };
    addEventListener("storage", onStorage);
    return () => { subs.delete(f); removeEventListener("storage", onStorage); };
  }, []);
  return loaded ? state : EMPTY;
}

export function useHydrated() {
  const [h, setH] = useState(false);
  useEffect(() => setH(true), []);
  return h;
}

export const haptic = (ms = 10) => { try { navigator.vibrate?.(ms); } catch {} };

export function toggleSave(id: string) {
  update((s) => ({ ...s, saves: s.saves.includes(id) ? s.saves.filter((x) => x !== id) : [id, ...s.saves] }));
  haptic(12);
}

// ---------- grocery list: merge, combine duplicates, scale by servings ----------
const norm = (s: string) => s.toLowerCase().replace(/\s+/g, " ").trim().replace(/(es|s)$/, "");
export function addRecipeToList(r: Recipe, servings: number) {
  const k = servings / (r.servings || 1);
  update((s) => {
    const list = [...s.grocery];
    for (const ing of r.ingredients) {
      const key = `${norm(ing.item)}|${ing.unit}`;
      const found = list.find((g) => g.key === key);
      const qty = Math.round(ing.qty * k * 100) / 100;
      if (found) { found.qty = Math.round((found.qty + qty) * 100) / 100; found.done = false; if (!found.from.includes(r.title)) found.from = [...found.from, r.title]; }
      else list.push({ key, item: ing.item, qty, unit: ing.unit, aisle: ing.aisle, done: false, from: [r.title] });
    }
    return { ...s, grocery: list };
  });
  haptic(12);
}
export const toggleItem = (key: string) => update((s) => ({ ...s, grocery: s.grocery.map((g) => (g.key === key ? { ...g, done: !g.done } : g)) }));
export const removeItem = (key: string) => update((s) => ({ ...s, grocery: s.grocery.filter((g) => g.key !== key) }));
export const clearDone = () => update((s) => ({ ...s, grocery: s.grocery.filter((g) => !g.done) }));

export function fmtQty(q: number, unit: string) {
  const frac: Record<string, string> = { "0.25": "¼", "0.5": "½", "0.75": "¾", "0.33": "⅓", "0.67": "⅔" };
  const whole = Math.floor(q), rest = Math.round((q - whole) * 100) / 100;
  const f = frac[String(rest)] || (rest ? String(rest).slice(1) : "");
  const n = whole && f ? `${whole}${f.startsWith(".") ? f : " " + f}` : whole ? String(whole) : f || "";
  return `${n}${unit ? " " + unit : ""}`.trim();
}

export function useToast() {
  const [msg, setMsg] = useState("");
  const show = useCallback((m: string) => { setMsg(m); setTimeout(() => setMsg(""), 1800); }, []);
  return { msg, show };
}
