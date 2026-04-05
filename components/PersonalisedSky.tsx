"use client";
import { useEffect, useState } from "react";

function getSkyGradient(h: number, m: number): string {
  const t = h + m / 60;
  if (t >= 5 && t < 6.5)  return "radial-gradient(ellipse at 30% 60%, #fde68a 0%, #fca5a5 25%, #c4b5fd 60%, #1e1b4b 100%)";
  if (t >= 6.5 && t < 9)  return "radial-gradient(ellipse at 40% 40%, #fef3c7 0%, #fde68a 30%, #fca5a5 60%, #e0e7ff 100%)";
  if (t >= 9 && t < 16)   return "radial-gradient(ellipse at 50% 20%, #e0f2fe 0%, #bae6fd 30%, #c4b5fd 70%, #f0f0f2 100%)";
  if (t >= 16 && t < 18)  return "radial-gradient(ellipse at 60% 50%, #fbbf24 0%, #f97316 25%, #ec4899 55%, #7c3aed 100%)";
  if (t >= 18 && t < 20)  return "radial-gradient(ellipse at 50% 60%, #fca5a5 0%, #c4b5fd 35%, #4c1d95 70%, #0f0a1e 100%)";
  if (t >= 20 && t < 22)  return "radial-gradient(ellipse at 50% 40%, #4c1d95 0%, #1e1b4b 50%, #0a0612 100%)";
  return "radial-gradient(ellipse at 50% 30%, #1e1b4b 0%, #0f0a1e 50%, #000 100%)";
}

export default function PersonalisedSky() {
  const [gradient, setGradient] = useState("");
  useEffect(() => {
    function update() { const now = new Date(); setGradient(getSkyGradient(now.getHours(), now.getMinutes())); }
    update(); const t = setInterval(update, 60000); return () => clearInterval(t);
  }, []);
  if (!gradient) return null;
  return <div className="fixed inset-0 -z-20 pointer-events-none transition-all duration-[120000ms]" style={{ background: gradient, opacity: 0.35 }} aria-hidden />;
}
