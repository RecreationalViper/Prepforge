"use client";
import { useState } from "react";
import { toggleSave, useStore } from "@/lib/store";
import { Icon } from "./Icons";
export default function SaveButton({ id, style }: { id: string; style?: React.CSSProperties }) {
  const s = useStore();
  const on = s.saves.includes(id);
  const [pop, setPop] = useState(false);
  return (
    <button type="button" className={`save-btn ${on ? "on" : ""} ${pop ? "pop" : ""}`} style={style} aria-pressed={on} aria-label={on ? "Remove from saves" : "Save recipe"}
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleSave(id); setPop(true); setTimeout(() => setPop(false), 380); }}>
      <Icon.bookmark />
    </button>
  );
}
