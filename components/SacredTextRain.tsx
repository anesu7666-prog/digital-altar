"use client";
import { useEffect, useRef } from "react";

const PHRASES = ["السلام عليكم","שָׁלוֹם","ॐ शान्तिः","Pax","Amani","和平","평화","Baraka","Shanti","Mir","Paix","نور","אהבה","प्रेम","Amor","Upendo","الرحمة","חסד","करुणा","Ase","Namaste","Amen","آمين","אמן","तथास्तु"];

export default function SacredTextRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d", { alpha: true })!;
    let W = window.innerWidth, H = window.innerHeight;
    canvas.width = W; canvas.height = H;

    // Pre-compute all drops
    const drops = Array.from({ length: 12 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      speed: 0.12 + Math.random() * 0.18,
      phrase: PHRASES[Math.floor(Math.random() * PHRASES.length)],
      alpha: 0.025 + Math.random() * 0.04,
      size: 10 + Math.random() * 6,
    }));

    let resizeTimer: ReturnType<typeof setTimeout>;
    function resize() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        W = window.innerWidth; H = window.innerHeight;
        canvas.width = W; canvas.height = H;
      }, 150);
    }
    window.addEventListener("resize", resize, { passive: true });

    let raf: number;
    let last = 0;
    const INTERVAL = 1000 / 20; // 20fps — text rain doesn't need more

    function tick(now: number) {
      raf = requestAnimationFrame(tick);
      if (now - last < INTERVAL) return;
      last = now;
      ctx.clearRect(0, 0, W, H);
      for (const d of drops) {
        ctx.font = `${d.size}px serif`;
        ctx.fillStyle = `rgba(100,80,120,${d.alpha})`;
        ctx.fillText(d.phrase, d.x, d.y);
        d.y += d.speed;
        if (d.y > H + 40) {
          d.y = -40;
          d.x = Math.random() * W;
          d.phrase = PHRASES[Math.floor(Math.random() * PHRASES.length)];
        }
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
