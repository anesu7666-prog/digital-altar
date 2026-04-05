"use client";

import { useEffect, useRef } from "react";

interface Ember {
  x: number; y: number; size: number; speed: number;
  drift: number; alpha: number; hue: number;
}

function randomEmber(W: number, H: number): Ember {
  return {
    x: Math.random() * W, y: H + Math.random() * 100,
    size: Math.random() * 3 + 1, speed: Math.random() * 0.6 + 0.2,
    drift: (Math.random() - 0.5) * 0.4, alpha: Math.random() * 0.5 + 0.1,
    hue: Math.random() * 40 + 20,
  };
}

export default function FloatingParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let W = window.innerWidth, H = window.innerHeight;
    canvas.width = W; canvas.height = H;

    function resize() { W = window.innerWidth; H = window.innerHeight; canvas.width = W; canvas.height = H; }
    window.addEventListener("resize", resize);

    const embers: Ember[] = Array.from({ length: Math.min(60, Math.floor(W / 20)) }, () => {
      const e = randomEmber(W, H); e.y = Math.random() * H; return e;
    });

    let raf: number;
    function tick() {
      ctx.clearRect(0, 0, W, H);
      for (const e of embers) {
        e.y -= e.speed; e.x += e.drift;
        e.alpha += (Math.random() - 0.5) * 0.02;
        e.alpha = Math.max(0.05, Math.min(0.55, e.alpha));
        if (e.y < -10) Object.assign(e, randomEmber(W, H));
        ctx.beginPath(); ctx.arc(e.x, e.y, e.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${e.hue}, 90%, 70%, ${e.alpha})`; ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    }
    tick();
    return () => { window.removeEventListener("resize", resize); cancelAnimationFrame(raf); };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none -z-10" aria-hidden />;
}
