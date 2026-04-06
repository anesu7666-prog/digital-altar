"use client";
import { useEffect, useRef } from "react";

interface Ember {
  x: number; y: number; size: number; speed: number;
  drift: number; alpha: number; alphaDir: number; hue: number;
}

export default function FloatingParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d", { alpha: true })!;
    let W = window.innerWidth, H = window.innerHeight;
    canvas.width = W; canvas.height = H;

    // Pre-compute all random values
    const COUNT = Math.min(25, Math.floor(W / 50));
    const embers: Ember[] = Array.from({ length: COUNT }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      size: Math.random() * 2.5 + 0.8,
      speed: Math.random() * 0.5 + 0.15,
      drift: (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.4 + 0.05,
      alphaDir: Math.random() > 0.5 ? 1 : -1,
      hue: Math.random() * 40 + 20,
    }));

    // Debounced resize
    let resizeTimer: ReturnType<typeof setTimeout>;
    function resize() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        W = window.innerWidth; H = window.innerHeight;
        canvas.width = W; canvas.height = H;
      }, 150);
    }
    window.addEventListener("resize", resize, { passive: true });

    // 30fps throttle
    let raf: number;
    let last = 0;
    const FPS = 30;
    const INTERVAL = 1000 / FPS;

    function tick(now: number) {
      raf = requestAnimationFrame(tick);
      if (now - last < INTERVAL) return;
      last = now;

      ctx.clearRect(0, 0, W, H);
      for (const e of embers) {
        e.y -= e.speed;
        e.x += e.drift;
        e.alpha += e.alphaDir * 0.008;
        if (e.alpha > 0.5 || e.alpha < 0.05) e.alphaDir *= -1;
        if (e.y < -10) { e.y = H + 10; e.x = Math.random() * W; }
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${e.hue},90%,70%,${e.alpha})`;
        ctx.fill();
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
