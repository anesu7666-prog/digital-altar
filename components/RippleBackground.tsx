"use client";

import { useEffect, useRef } from "react";

interface Ripple { x: number; y: number; r: number; alpha: number; }

export default function RippleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let W = window.innerWidth, H = window.innerHeight;
    const ripples: Ripple[] = [];

    function resize() { W = window.innerWidth; H = window.innerHeight; canvas.width = W; canvas.height = H; }
    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("click", (e: MouseEvent) => { ripples.push({ x: e.clientX, y: e.clientY, r: 0, alpha: 0.5 }); });

    let raf: number;
    function tick() {
      ctx.clearRect(0, 0, W, H);
      for (let i = ripples.length - 1; i >= 0; i--) {
        const rp = ripples[i]; rp.r += 3; rp.alpha -= 0.008;
        if (rp.alpha <= 0) { ripples.splice(i, 1); continue; }
        ctx.beginPath(); ctx.arc(rp.x, rp.y, rp.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(180,160,140,${rp.alpha})`; ctx.lineWidth = 1.5; ctx.stroke();
        ctx.beginPath(); ctx.arc(rp.x, rp.y, rp.r * 0.6, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(180,160,140,${rp.alpha * 0.5})`; ctx.lineWidth = 1; ctx.stroke();
      }
      raf = requestAnimationFrame(tick);
    }
    tick();
    return () => { window.removeEventListener("resize", resize); cancelAnimationFrame(raf); };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none -z-10" aria-hidden />;
}
