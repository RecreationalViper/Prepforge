// PrepForge Daily Curator. Runs every morning (GitHub Actions) and writes data/today.json:
// 1 breakfast under 15 min, 1 lunch with 30-40 g protein, 1 balanced dinner, 2 snacks under 200 kcal,
// and 1 world-cuisine dish rotating through 30 countries (generated and added to the library if missing).
// Each pick gets a chef's note (18 words max) and an SEO title. Missing platform videos are flagged for creators.
// AI: Claude if ANTHROPIC_API_KEY is set, otherwise the free chain (Groq, Gemini). Works with no AI too (templates).
import fs from "node:fs";

const SYSTEM = "You are a Michelin sous-chef curating for busy professionals. Prioritize technique, not calories.";
const COUNTRIES = ["Japan", "Mexico", "Italy", "India", "Thailand", "Morocco", "Peru", "Korea", "Lebanon", "Vietnam", "Spain", "Greece", "Ethiopia", "Brazil", "France", "Turkey", "Jamaica", "Indonesia", "Nigeria", "Argentina", "China", "Philippines", "Georgia", "Tunisia", "Portugal", "Malaysia", "Iran", "Senegal", "Sweden", "Colombia"];
const PLATFORMS = ["instagram", "tiktok", "snapchat", "facebook", "youtube", "x", "reddit"];
const AISLES = ["Produce", "Meat & Fish", "Dairy & Eggs", "Bakery", "Pantry", "Spices", "Frozen", "Other"];

const read = (f, d) => { try { return JSON.parse(fs.readFileSync(f, "utf8")); } catch { return d; } };
const library = read("data/recipes.json", []);
const generated = read("data/generated.json", []);
const all = [...library, ...generated];
const archive = read("data/archive.json", []);

const tz = process.env.CURATE_TZ || "America/New_York";
const today = new Date().toLocaleDateString("en-CA", { timeZone: tz });
const dayNum = Math.floor(Date.parse(today) / 864e5);

// recently used ids (last 6 days) are avoided so the table keeps changing
const recent = new Set(archive.filter((d) => d.date !== today).slice(0, 6).flatMap((d) => d.picks.map((p) => p.id)));
const fresh = (list) => { const f = list.filter((r) => !recent.has(r.id)); return f.length ? f : list; };
const pick = (list, salt) => { const l = fresh(list); return l[(dayNum * 7 + salt) % l.length]; };

async function ai(prompt, json = false) {
  const k = (v) => (process.env[v] || "").trim();
  try {
    if (k("ANTHROPIC_API_KEY")) {
      const r = await fetch("https://api.anthropic.com/v1/messages", { method: "POST", headers: { "x-api-key": k("ANTHROPIC_API_KEY"), "anthropic-version": "2023-06-01", "content-type": "application/json" },
        body: JSON.stringify({ model: process.env.CLAUDE_MODEL || "claude-haiku-4-5", max_tokens: 1800, system: SYSTEM, messages: [{ role: "user", content: prompt }] }) });
      if (r.ok) return (await r.json()).content?.[0]?.text || "";
    }
  } catch {}
  try {
    if (k("GROQ_API_KEY")) {
      const r = await fetch("https://api.groq.com/openai/v1/chat/completions", { method: "POST", headers: { Authorization: `Bearer ${k("GROQ_API_KEY")}`, "content-type": "application/json" },
        body: JSON.stringify({ model: "llama-3.3-70b-versatile", temperature: 0.6, max_tokens: 1800, ...(json ? { response_format: { type: "json_object" } } : {}), messages: [{ role: "system", content: SYSTEM }, { role: "user", content: prompt }] }) });
      if (r.ok) return (await r.json()).choices?.[0]?.message?.content || "";
    }
  } catch {}
  try {
    if (k("GEMINI_API_KEY")) {
      const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent`, { method: "POST", headers: { "x-goog-api-key": k("GEMINI_API_KEY"), "content-type": "application/json" },
        body: JSON.stringify({ systemInstruction: { parts: [{ text: SYSTEM }] }, contents: [{ role: "user", parts: [{ text: prompt }] }], generationConfig: { temperature: 0.6, ...(json ? { responseMimeType: "application/json" } : {}) } }) });
      if (r.ok) return ((await r.json()).candidates?.[0]?.content?.parts || []).map((p) => p.text || "").join("");
    }
  } catch {}
  return "";
}
const parseJson = (t) => { try { return JSON.parse(String(t).match(/[[{][\s\S]*[\]}]/)[0]); } catch { return null; } };
const clampWords = (s, n) => String(s || "").replace(/["\n]/g, " ").trim().split(/\s+/).slice(0, n).join(" ");

// 1) World cuisine of the day: use an existing dish from that country or have the chef write one.
let country = COUNTRIES[dayNum % COUNTRIES.length];
let world = all.find((r) => (r.country || r.cuisine) && [r.country, r.cuisine].some((c) => c && c.toLowerCase().startsWith(country.toLowerCase().slice(0, 4))) && !recent.has(r.id));
if (!world) {
  const raw = await ai(`Write one authentic, weeknight-friendly home recipe from ${country} (no more than 45 minutes). Return ONLY JSON with keys:
{"id":"kebab-case-id","title":"dish name, plain English with original name if useful","blurb":"one sentence, max 12 words, sensory","meal":"dinner","cuisine":"${country === "Korea" ? "Korean" : country}","country":"${country}","minutes":number,"servings":number,"kcal":number per serving,"protein":grams per serving,"level":"easy|medium|advanced","moment":"the single most visual moment for the hero photo (e.g. sauce glazing, a flip, a pull)","ingredients":[{"item":"name","qty":number,"unit":"cup|tbsp|tsp|oz|lb|g|cloves|... or empty","aisle":"one of ${AISLES.join(", ")}"}],"steps":["clear imperative steps, 4-7 of them"],"tags":["world"]}`, true);
  const g = parseJson(raw);
  if (g && g.title && Array.isArray(g.ingredients) && Array.isArray(g.steps)) {
    g.id = String(g.id || g.title).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 48);
    if (all.some((r) => r.id === g.id)) g.id += "-" + dayNum;
    world = { ...g, meal: ["breakfast", "lunch", "dinner", "snack"].includes(g.meal) ? g.meal : "dinner", author: "PrepForge Curator", videos: {}, tags: [...new Set([...(g.tags || []), "world"])],
      ingredients: g.ingredients.slice(0, 16).map((i) => ({ item: String(i.item), qty: Number(i.qty) || 1, unit: String(i.unit || ""), aisle: AISLES.includes(i.aisle) ? i.aisle : "Other" })),
      steps: g.steps.slice(0, 8).map(String), minutes: Number(g.minutes) || 30, servings: Number(g.servings) || 2, kcal: Number(g.kcal) || 500, protein: Number(g.protein) || 25 };
    generated.push(world);
    fs.writeFileSync("data/generated.json", JSON.stringify(generated, null, 1));
    all.push(world);
    console.log(`Added a new ${country} dish: ${world.title}`);
  } else { world = pick(all.filter((r) => (r.tags || []).includes("world")), 5); country = world.country || world.cuisine; } // no AI today: show a world dish we already have, labelled honestly
}

// 2) The rest of the table, by the rules
const breakfast = pick(all.filter((r) => r.meal === "breakfast" && r.minutes < 15), 1);
const lunch = pick(all.filter((r) => r.meal === "lunch" && r.protein >= 30 && r.protein <= 40), 2);
const dinner = pick(all.filter((r) => r.meal === "dinner" && r.id !== world.id && r.kcal >= 400 && r.kcal <= 700 && r.protein >= 15), 3);
const snackPool = fresh(all.filter((r) => r.meal === "snack" && r.kcal < 200));
const s1 = snackPool[(dayNum * 3) % snackPool.length], s2 = snackPool[(dayNum * 3 + 1) % snackPool.length] === s1 ? snackPool[(dayNum * 3 + 2) % snackPool.length] : snackPool[(dayNum * 3 + 1) % snackPool.length];
const slots = [["Breakfast", breakfast], ["Lunch", lunch], ["Dinner", dinner], ["Snack", s1], ["Snack", s2], [`World · ${country}`, world]].filter(([, r]) => r);

// 3) Chef's notes + SEO titles in one call
const raw = await ai(`For each dish, write a chef's note (max 18 words, one concrete technique tip, calm and confident, no hype, never mention calories or macros) and an SEO title (max 60 characters). Return ONLY JSON: {"items":[{"id":"...","note":"...","seo":"..."}]}
${slots.map(([s, r]) => `- ${r.id}: ${r.title} (${s}). ${r.blurb} Key step: ${r.steps[Math.min(1, r.steps.length - 1)]}`).join("\n")}`, true);
const notes = Object.fromEntries((parseJson(raw)?.items || []).map((x) => [x.id, x]));
const picks = slots.map(([slot, r]) => {
  const n = notes[r.id] || {};
  const missing = PLATFORMS.filter((p) => !(r.videos || {})[p]);
  return { slot, id: r.id, note: clampWords(n.note || `Taste first. ${r.steps[Math.min(1, r.steps.length - 1)]}`, 18), seo: String(n.seo || `${r.title}: ${r.minutes}-Minute ${r.cuisine} Recipe`).slice(0, 60), missingVideos: missing };
});

const day = { date: today, country, picks, curatedBy: Object.keys(notes).length ? "ai" : "template", at: new Date().toISOString() };
fs.writeFileSync("data/today.json", JSON.stringify(day, null, 1));
fs.writeFileSync("data/archive.json", JSON.stringify([day, ...archive.filter((d) => d.date !== today)].slice(0, 30), null, 1));
const flagged = picks.filter((p) => p.missingVideos.length);
fs.writeFileSync("data/video-requests.json", JSON.stringify(flagged.map((p) => ({ id: p.id, date: today, missing: p.missingVideos })), null, 1));
console.log(`Today's Table ${today}: ${picks.map((p) => `${p.slot}=${p.id}`).join(", ")} (${day.curatedBy}); ${flagged.length} dishes need creator videos.`);
