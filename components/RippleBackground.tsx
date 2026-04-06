"use client";
import { useEffect, useRef } from "react";

interface Ripple { x: number; y: number; r: number; alpha: number; }

export default function RippleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d", { alpha: true })!;
    let W = window.innerWidth, H = window.innerHeight;
    canvas.width = W; canvas.height = H;
    const ripples: Ripple[] = [];

    let resizeTimer: ReturnType<typeof setTimeout>;
    function resize() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        W = window.innerWidth; H = window.innerHeight;
        canvas.width = W; canvas.height = H;
      }, 150);
    }
    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("click", (e: MouseEvent) => {
      ripples.push({ x: e.clientX, y: e.clientY, r: 0, alpha: 0.45 });
      if (ripples.length > 6) ripples.shift();
    }, { passive: true });

    let raf: number;
    let last = 0;
    const INTERVAL = 1000 / 30;

    function tick(now: number) {
      raf = requestAnimationFrame(tick);
      if (now - last < INTERVAL) return;
      last = now;
      ctx.clearRect(0, 0, W, H);
      for (let i = ripples.length - 1; i >= 0; i--) {
        const rp = ripples[i];
        rp.r += 4; rp.alpha -= 0.01;
        if (rp.alpha <= 0) { ripples.splice(i, 1); continue; }
        ctx.beginPath(); ctx.arc(rp.x, rp.y, rp.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(180,160,140,${rp.alpha})`; ctx.lineWidth = 1.5; ctx.stroke();
        ctx.beginPath(); ctx.arc(rp.x, rp.y, rp.r * 0.55, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(180,160,140,${rp.alpha * 0.4})`; ctx.lineWidth = 1; ctx.stroke();
      }
    }
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(raf);
      clearTimeout(resizeTimer);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none -z-10" aria-hidden />;
}
