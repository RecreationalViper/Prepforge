import Link from "next/link";
import GlassCard from "@/components/GlassCard";
export default function NotFound() {
  return <GlassCard className="empty"><h1>Not on the menu.</h1><p className="muted">That page doesn't exist.</p><Link className="btn primary" href="/">Back home</Link></GlassCard>;
}
