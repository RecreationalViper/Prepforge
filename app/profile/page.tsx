"use client";
import Link from "next/link";
import GlassCard from "@/components/GlassCard";
import { useStore } from "@/lib/store";
export default function Profile() {
  const s = useStore();
  const name = s.prefs.name || "Guest cook";
  return (
    <div className="stack">
      <GlassCard style={{ padding: 22, textAlign: "center" }}>
        <div className="avatar" style={{ width: 72, height: 72, fontSize: 28, margin: "0 auto 12px" }}>{name[0].toUpperCase()}</div>
        <h1 style={{ fontSize: 24 }}>{name}</h1>
        <div className="row" style={{ justifyContent: "center", gap: 22, marginTop: 14 }}>
          <div><b>{s.cooks.length}</b><div className="mono">Cooks</div></div>
          <div><b>{s.saves.length}</b><div className="mono">Saves</div></div>
          <div><b>0</b><div className="mono">Followers</div></div>
        </div>
      </GlassCard>
      <Link href="/saves/" className="btn">Saves</Link>
      <Link href="/settings/" className="btn">Settings</Link>
      <Link href="/pro/" className="btn primary">PrepForge Pro</Link>
    </div>
  );
}
