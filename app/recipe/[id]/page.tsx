import { notFound } from "next/navigation";
import { RECIPES, byId } from "@/data/recipes";
import { TODAY } from "@/lib/today";
import RecipeView from "./RecipeView";

export const dynamicParams = false;
export function generateStaticParams() { return RECIPES.map((r) => ({ id: r.id })); }
export function generateMetadata({ params }: { params: { id: string } }) {
  const r = byId(params.id); if (!r) return {};
  const seo = TODAY.picks.find((p) => p.id === r.id)?.seo;
  return { title: seo || `${r.title}: ${r.minutes}-minute ${r.cuisine} recipe`, description: r.blurb };
}
export default function Page({ params }: { params: { id: string } }) {
  const r = byId(params.id); if (!r) notFound();
  return <RecipeView r={r} />;
}
