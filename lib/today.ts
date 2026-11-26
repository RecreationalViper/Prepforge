import today from "@/data/today.json";
import archive from "@/data/archive.json";
import { byId, type Recipe } from "@/data/recipes";
export type Pick = { slot: string; id: string; note: string; seo: string; missingVideos: string[] };
export type Day = { date: string; country: string; picks: Pick[]; curatedBy: string; at: string };
export const TODAY = today as Day;
export const ARCHIVE = archive as Day[];
export const resolve = (d: Day) => d.picks.map((p) => ({ ...p, r: byId(p.id) })).filter((p): p is Pick & { r: Recipe } => !!p.r);
