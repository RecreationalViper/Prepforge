// Business pages. Plain-language drafts: have them reviewed before charging customers.
export const UPDATED = "November 25, 2026";
export type Doc = { title: string; lead: string; sections: [string, string[]][] };
export const PAGES: Record<string, Doc> = {
  about: { title: "About PrepForge", lead: "PrepForge is a calm place to decide what to cook, cook it well, and share it.", sections: [
    ["Why we built it", ["Most food apps shout. We wanted one that feels like a good kitchen at night: quiet, warm, and ready. No macro math, no gym-bro copy. Taste first."]],
    ["What it does", ["Every morning our curator sets Today's Table: a quick breakfast, a lunch that holds you, a balanced dinner, two light snacks, and one dish from somewhere new.", "Save what you love, plan the week, and turn it all into one smart grocery list with the nearest stores a tap away."]],
    ["Who we are", ["PrepForge is an independent studio based in Solon, Ohio."]]] },
  careers: { title: "Careers", lead: "We're small, on purpose.", sections: [
    ["Open roles", ["No open roles right now. We're always glad to meet food photographers, recipe developers and short-form video creators. Say hello through the Contact page."]]] },
  press: { title: "Press", lead: "Writing about PrepForge? We'd love to help.", sections: [
    ["Press kit", ["Logo, screenshots and a short fact sheet are available on request through the Contact page."]],
    ["One line", ["PrepForge is a prestige cooking network: a daily curated table, a smart grocery list, and recipes that come with the moment that makes them."]]] },
  help: { title: "Help", lead: "Quick answers.", sections: [
    ["How do I save a recipe?", ["Tap the bookmark on any card or recipe. Find everything under Saves, grouped by meal."]],
    ["How does the grocery list work?", ["On any recipe choose your servings and tap Add to List. Matching ingredients combine and quantities scale. Swipe left on an item to delete it."]],
    ["Why can't I see nearby stores?", ["Allow location for PrepForge in your browser or phone settings, then tap Use location on the Grocery page."]],
    ["Can I use PrepForge like an app?", ["Yes. On iPhone open it in Safari, tap Share, then Add to Home Screen. On Android open the menu and choose Install app."]],
    ["Where is my data?", ["Until accounts launch, your saves, lists and plans are stored only on your device."]]] },
  terms: { title: "Terms of Service", lead: `Last updated ${UPDATED}. By using PrepForge you agree to these terms.`, sections: [
    ["Using PrepForge", ["You may use PrepForge for personal, non-commercial cooking and planning. Don't misuse the service, attempt to break it, or scrape it at scale."]],
    ["Your content", ["When accounts launch, you keep ownership of recipes, photos and videos you post. You grant PrepForge a license to display them in the service. Only post what you have the right to share."]],
    ["Food and health", ["Recipes and nutrition figures are estimates and are not medical or dietary advice. Check ingredients for allergens and cook food to safe temperatures."]],
    ["Third-party services", ["Store and restaurant results come from OpenStreetMap; video links open third-party platforms that have their own terms."]],
    ["Subscriptions", ["PrepForge Pro, when available, renews monthly until cancelled. Free trials convert to paid unless cancelled before they end."]],
    ["Liability", ["PrepForge is provided as is. To the extent the law allows, we are not liable for indirect or consequential losses."]],
    ["Changes", ["We may update these terms and will note the date above. Continued use means you accept the update."]]] },
  privacy: { title: "Privacy Policy", lead: `Last updated ${UPDATED}. Short version: we collect as little as possible and never sell your data.`, sections: [
    ["What stays on your device", ["Saves, grocery lists, plans, pantry items and preferences are stored in your browser's local storage. They never leave your device unless you create an account later."]],
    ["Location", ["If you tap Use location, your approximate position is sent once to OpenStreetMap's Overpass service to find nearby stores and restaurants. We don't store it."]],
    ["Images and video", ["Recipe images load from our image service and videos from the platforms they live on. Those services may log standard request data such as IP address."]],
    ["Accounts (coming)", ["When accounts launch we'll store your email and the content you choose to sync, using Supabase. You'll be able to export or delete it at any time."]],
    ["Contact", ["Questions about privacy? Use the Contact page."]]] },
  cookies: { title: "Cookie Policy", lead: `Last updated ${UPDATED}.`, sections: [
    ["Cookies", ["PrepForge doesn't use advertising or tracking cookies."]],
    ["Local storage", ["We use your browser's local storage to remember your saves, lists and settings on this device. You can erase it anytime in Settings."]]] },
  community: { title: "Community Guidelines", lead: "Cook generously. Comment kindly.", sections: [
    ["Be kind", ["Critique the dish, never the person. No harassment, hate or threats."]],
    ["Be honest", ["Post your own recipes, photos and videos, or credit the source. Remixes keep a link to the original."]],
    ["Be safe", ["No dangerous food practices presented as safe, and label common allergens when you know them."]],
    ["Keep it about food", ["No spam, scams or unrelated self-promotion. We may remove content or accounts that break these guidelines."]]] }
};
