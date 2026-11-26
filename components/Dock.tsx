"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import GlassCard from "./GlassCard";
import { Icon } from "./Icons";

const ITEMS: [string, string, keyof typeof Icon][] = [["/", "Home", "home"], ["/discover/", "Discover", "discover"], ["/create/", "Create", "plus"], ["/social/", "Social", "social"], ["/profile/", "Profile", "profile"]];
export default function Dock() {
  const path = usePathname();
  const norm = (p: string) => (p.endsWith("/") ? p : p + "/");
  return (
    <nav className="dock" aria-label="Main">
      <GlassCard className="dock-inner" style={{ borderRadius: 999 }}>
        {ITEMS.map(([href, label, ic]) => { const I = Icon[ic]; const on = href === "/" ? path === "/" : norm(path).startsWith(href);
          return <Link key={href} href={href} aria-label={label} aria-current={on ? "page" : undefined} className={ic === "plus" ? "create" : ""}><I /></Link>; })}
      </GlassCard>
    </nav>
  );
}
