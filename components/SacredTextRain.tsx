"use client";
import { useEffect, useRef } from "react";

const PHRASES = ["السلام عليكم","שָׁלוֹם","ॐ शान्तिः","Pax","Amani","和平","평화","Baraka","Shanti","Mir","Paix","نور","אהבה","प्रेम","Amor","Upendo","الرحمة","חסד","करुणा","Misericordia","Ase","Namaste","Amen","آمين","אמן","तथास्तु"];

export default function SacredTextRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current!; const ctx = canvas.getContext("2d")!;
    let W = window.innerWidth, H = window.innerHeight;
    canvas.width = W; canvas.height = H;
    function resize() { W = window.innerWidth; H = window.innerHeight; canvas.width = W; canvas.height = H; }
    window.addEventListener("resize", resize);
    const drops = Array.from({ length: 18 }, () => ({ x: Math.random() * W, y: Math.random() * H, speed: 0.15 + Math.random() * 0.25, phrase: PHRASES[Math.floor(Math.random() * PHRASES.length)], alpha: 0.03 + Math.random() * 0.06, size: 10 + Math.random() * 8 }));
    let raf: number;
    function tick() {
      ctx.clearRect(0, 0, W, H);
      for (const d of drops) {
        ctx.font = `${d.size}px serif`; ctx.fillStyle = `rgba(100,80,120,${d.alpha})`; ctx.fillText(d.phrase, d.x, d.y);
        d.y += d.speed;
        if (d.y > H + 40) { d.y = -40; d.x = Math.random() * W; d.phrase = PHRASES[Math.floor(Math.random() * PHRASES.length)]; }
      }
      raf = requestAnimationFrame(tick);
    }
    tick();
    return () => { window.removeEventListener("resize", resize); cancelAnimationFrame(raf); };
  }, []);
  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none -z-10" aria-hidden />;
}
