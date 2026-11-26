import GlassCard from "@/components/GlassCard";
export const metadata = { title: "Social Feed" };
export default function Social() {
  return (
    <div className="stack">
      <div><h1>Social</h1><p className="muted" style={{ margin: "6px 0 0" }}>Cookbooks, follows, remixes and step-by-step comments.</p></div>
      <GlassCard style={{ padding: 22 }}>
        <div className="mono">Arriving next</div>
        <h2 style={{ margin: "6px 0 10px" }}>Cook together.</h2>
        <ul className="muted" style={{ margin: 0, paddingLeft: 18, lineHeight: 1.8 }}>
          <li>Profiles with cookbooks, followers and total cooks</li>
          <li>Remix any recipe: it keeps a link to the original and shows the version tree</li>
          <li>Comments on each step, not just the dish</li>
          <li>A feed of what people you follow actually cooked</li>
        </ul>
      </GlassCard>
    </div>
  );
}
