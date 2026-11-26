"use client";
// Global motion: the specular highlight follows the finger/pointer, and the orbs drift at 0.3x scroll (parallax).
import { useEffect } from "react";
export default function Effects() {
  useEffect(() => {
    const root = document.documentElement;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        root.style.setProperty("--hx", ((e.clientX / innerWidth) * 100).toFixed(1));
        root.style.setProperty("--hy", ((e.clientY / innerHeight) * 100).toFixed(1));
      });
    };
    const onScroll = () => root.style.setProperty("--py", `${(-scrollY * 0.3).toFixed(0)}px`);
    addEventListener("pointermove", onMove, { passive: true });
    addEventListener("scroll", onScroll, { passive: true });
    return () => { removeEventListener("pointermove", onMove); removeEventListener("scroll", onScroll); };
  }, []);
  return (
    <div className="orbs" aria-hidden="true">
      <div className="orb violet" /><div className="orb magenta" /><div className="orb cyan" />
    </div>
  );
}
