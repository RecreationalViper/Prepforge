import library from "./recipes.json";
import generated from "./generated.json";
// PrepForge recipe library. Quantities are per the listed servings; the grocery list scales them.
// Each recipe carries 7 short-video slots (filled as creators upload); empty = "coming soon".
export type Aisle = "Produce" | "Meat & Fish" | "Dairy & Eggs" | "Bakery" | "Pantry" | "Spices" | "Frozen" | "Other";
export type Meal = "breakfast" | "lunch" | "dinner" | "snack";
export type Ingredient = { item: string; qty: number; unit: string; aisle: Aisle };
export type Platform = "instagram" | "tiktok" | "snapchat" | "facebook" | "youtube" | "x" | "reddit";
export type Recipe = {
  id: string; title: string; blurb: string; meal: Meal; cuisine: string; minutes: number; servings: number;
  kcal: number; protein: number; level: "easy" | "medium" | "advanced"; moment: string; author: string;
  ingredients: Ingredient[]; steps: string[]; videos: Partial<Record<Platform, string>>; tags: string[];
};

export const PLATFORMS: { id: Platform; name: string; short: string }[] = [
  { id: "instagram", name: "Instagram Reels", short: "IG" },
  { id: "tiktok", name: "TikTok", short: "TT" },
  { id: "snapchat", name: "Snapchat Spotlight", short: "SC" },
  { id: "facebook", name: "Facebook Reels", short: "FB" },
  { id: "youtube", name: "YouTube Shorts", short: "YT" },
  { id: "x", name: "X Video", short: "X" },
  { id: "reddit", name: "Reddit r/food", short: "RD" }
];


// The hand-written library plus dishes the daily curator has added (world cuisines).
export const RECIPES: Recipe[] = [...(library as Recipe[]), ...(generated as Recipe[])];

export const byId = (id: string) => RECIPES.find((r) => r.id === id);

// Hero images are generated once per recipe from its signature moment (free Pollinations Flux), cached by the browser.
export function imageFor(r: Pick<Recipe, "id" | "title" | "moment">, w = 800, h = 1000) {
  let seed = 0;
  for (const c of r.id) seed = (seed * 31 + c.charCodeAt(0)) >>> 0;
  const prompt = `editorial food photography, ${r.moment}, ${r.title}, dark moody background, soft window light, shallow depth of field, 35mm, no text`;
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=${w}&height=${h}&seed=${seed % 100000}&nologo=true&model=flux`;
}

export const MEAL_LABEL: Record<Meal, string> = { breakfast: "Breakfast", lunch: "Lunch", dinner: "Dinner", snack: "Snack" };
