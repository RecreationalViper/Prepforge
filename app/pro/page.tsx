import GlassCard from "@/components/GlassCard";
export const metadata = { title: "PrepForge Pro" };
const FEATURES = ["Delivery: send your list to a cart and check out in-app", "Unlimited AI sous-chef (free: 10 chats a month)", "Video uploads for your own recipes", "Restaurant finder for any dish", "Full Today's Table archive", "Collaborative households: one list, one plan"];
export default function Pro() {
  return (
    <div className="stack">
      <div><div className="mono">PrepForge Pro</div><h1 style={{ marginTop: 6 }}>Make it effortless.</h1></div>
      <GlassCard style={{ padding: 22 }}>
        <div className="row" style={{ alignItems: "baseline", gap: 6 }}><span style={{ fontSize: 40, fontWeight: 700 }}>$8.99</span><span className="muted">/ month · 7-day free trial</span></div>
        <ul style={{ margin: "16px 0 18px", paddingLeft: 18, lineHeight: 1.9 }}>{FEATURES.map((f) => <li key={f}>{f}</li>)}</ul>
        <button className="btn primary" disabled style={{ width: "100%" }}>Start free trial · opening soon</button>
        <p className="mono" style={{ margin: "10px 2px 0" }}>Cancel anytime. Payments open shortly.</p>
      </GlassCard>
    </div>
  );
}
