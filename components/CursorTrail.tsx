"use client";

import { useEffect, useRef } from "react";

interface Dot { x: number; y: number; alpha: number; size: number; }

export default function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dots = useRef<Dot[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
    resize();
    window.addEventListener("resize", resize);

    function onMove(e: MouseEvent) {
      dots.current.push({ x: e.clientX, y: e.clientY, alpha: 0.6, size: 8 });
      if (dots.current.length > 40) dots.current.shift();
    }
    window.addEventListener("mousemove", onMove);

    let raf: number;
    function tick() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      dots.current = dots.current.filter((d) => d.alpha > 0.01);
      for (const d of dots.current) {
        const grad = ctx.createRadialGradient(d.x, d.y, 0, d.x, d.y, d.size);
        grad.addColorStop(0, `rgba(251,191,36,${d.alpha})`);
        grad.addColorStop(1, `rgba(251,191,36,0)`);
        ctx.beginPath(); ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2);
        ctx.fillStyle = grad; ctx.fill();
        d.alpha *= 0.88; d.size *= 1.04;
      }
      raf = requestAnimationFrame(tick);
    }
    tick();
    return () => { window.removeEventListener("resize", resize); window.removeEventListener("mousemove", onMove); cancelAnimationFrame(raf); };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-50" aria-hidden />;
}
