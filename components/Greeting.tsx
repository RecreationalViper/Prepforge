"use client";
import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
export default function Greeting() {
  const s = useStore();
  const [h, setH] = useState<number | null>(null);
  useEffect(() => setH(new Date().getHours()), []);
  const part = h === null ? "Good day" : h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
  const name = s.prefs.name ? `, ${s.prefs.name.split(" ")[0]}` : "";
  return (
    <div style={{ padding: "4px 2px 2px" }}>
      <h1>{part}{name}.</h1>
      <p className="muted" style={{ margin: "6px 0 0" }}>Taste first. Make it effortless.</p>
    </div>
  );
}
