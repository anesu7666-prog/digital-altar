"use client";
import { useEffect, useRef } from "react";

interface Dot { x: number; y: number; alpha: number; size: number; }

export default function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dots = useRef<Dot[]>([]);
  const mouse = useRef({ x: -999, y: -999, moved: false });

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d", { alpha: true })!;

    let resizeTimer: ReturnType<typeof setTimeout>;
    function resize() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }, 150);
    }
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    window.addEventListener("resize", resize, { passive: true });

    function onMove(e: MouseEvent) {
      mouse.current = { x: e.clientX, y: e.clientY, moved: true };
    }
    window.addEventListener("mousemove", onMove, { passive: true });

    let raf: number;
    function tick() {
      raf = requestAnimationFrame(tick);
      if (mouse.current.moved) {
        dots.current.push({ x: mouse.current.x, y: mouse.current.y, alpha: 0.55, size: 7 });
        if (dots.current.length > 20) dots.current.shift();
        mouse.current.moved = false;
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      dots.current = dots.current.filter((d) => d.alpha > 0.01);
      for (const d of dots.current) {
        const grad = ctx.createRadialGradient(d.x, d.y, 0, d.x, d.y, d.size);
        grad.addColorStop(0, `rgba(251,191,36,${d.alpha})`);
        grad.addColorStop(1, `rgba(251,191,36,0)`);
        ctx.beginPath(); ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2);
        ctx.fillStyle = grad; ctx.fill();
        d.alpha *= 0.86; d.size *= 1.05;
      }
    }
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
      clearTimeout(resizeTimer);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-50" aria-hidden />;
}
