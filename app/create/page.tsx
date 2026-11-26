import GlassCard from "@/components/GlassCard";
export const metadata = { title: "Create" };
export default function Create() {
  return (
    <div className="stack">
      <div><h1>Create</h1><p className="muted" style={{ margin: "6px 0 0" }}>Share a dish of your own.</p></div>
      <GlassCard style={{ padding: 22 }}>
        <div className="mono">Arriving with accounts</div>
        <h2 style={{ margin: "6px 0 10px" }}>Your recipe, your moment.</h2>
        <p className="muted" style={{ margin: 0 }}>Write the steps, add the hero photo, and attach the short video of the moment that sells it (the pull, the flip, the pour). PrepForge links it everywhere it lives: Reels, TikTok, Spotlight, Shorts and more.</p>
      </GlassCard>
    </div>
  );
}
