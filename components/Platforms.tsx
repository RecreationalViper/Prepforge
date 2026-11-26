"use client";
import { PLATFORMS, type Recipe } from "@/data/recipes";
// The 7 short-video platforms. Live ones open the post (deep link via the app if installed); missing ones are greyed "coming soon".
export default function Platforms({ r, small = false }: { r: Recipe; small?: boolean }) {
  return (
    <div className="platforms" aria-label="Watch it made">
      {PLATFORMS.map((p) => {
        const url = r.videos?.[p.id];
        const size = small ? 28 : 40;
        return url
          ? <a key={p.id} className="pf" href={url} target="_blank" rel="noopener" title={p.name} style={{ width: size, height: size }} onClick={(e) => e.stopPropagation()}>{p.short}</a>
          : <span key={p.id} className="pf off" title={`${p.name}: coming soon`} style={{ width: size, height: size }} onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>{p.short}</span>;
      })}
    </div>
  );
}
