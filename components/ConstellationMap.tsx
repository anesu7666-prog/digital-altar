"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";

interface Star { id: number; wish: string; color: string; x: number; y: number; size: number; twinkle: number; }

function hashToPos(id: number, W: number, H: number) {
  const a = Math.sin(id * 127.1) * 43758.5453;
  const b = Math.sin(id * 311.7) * 43758.5453;
  return { x: ((a - Math.floor(a)) * 0.88 + 0.06) * W, y: ((b - Math.floor(b)) * 0.85 + 0.08) * H };
}

export default function ConstellationMap() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stars, setStars] = useState<Star[]>([]);
  const [hovered, setHovered] = useState<Star | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    supabase.from("wishes").select("id, wish, color").order("created_at")
      .then(({ data }) => {
        if (!data) return;
        const canvas = canvasRef.current; if (!canvas) return;
        const W = canvas.offsetWidth, H = canvas.offsetHeight;
        setStars(data.map((r) => ({ id: r.id, wish: r.wish, color: r.color, ...hashToPos(r.id, W, H), size: 1.5 + Math.random() * 2.5, twinkle: Math.random() * Math.PI * 2 })));
      });
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const canvas = canvasRef.current!; const ctx = canvas.getContext("2d")!;
    let t = 0, raf: number;
    function resize() { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; }
    resize(); window.addEventListener("resize", resize);
    function tick() {
      t += 0.02; ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const s of stars) {
        const alpha = 0.4 + Math.sin(s.twinkle + t) * 0.3;
        const glow = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.size * 3);
        glow.addColorStop(0, `${s.color}${Math.round(alpha * 255).toString(16).padStart(2, "0")}`);
        glow.addColorStop(1, "transparent");
        ctx.beginPath(); ctx.arc(s.x, s.y, s.size * 3, 0, Math.PI * 2); ctx.fillStyle = glow; ctx.fill();
        ctx.beginPath(); ctx.arc(s.x, s.y, s.size * 0.6, 0, Math.PI * 2); ctx.fillStyle = `rgba(255,255,255,${alpha * 0.9})`; ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    }
    tick();
    return () => { window.removeEventListener("resize", resize); cancelAnimationFrame(raf); };
  }, [open, stars]);

  function onMouseMove(e: React.MouseEvent<HTMLCanvasElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const mx = e.clientX - rect.left, my = e.clientY - rect.top;
    setHovered(stars.find((s) => Math.hypot(s.x - mx, s.y - my) < 16) ?? null);
  }

  return (
    <>
      <button onClick={() => setOpen(true)} className="text-[10px] tracking-[0.3em] uppercase text-stone-400 hover:text-stone-600 transition-colors">✦ Constellation Map</button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.2 }} className="fixed inset-0 z-[90]" style={{ background: "#020108" }}>
            <button onClick={() => setOpen(false)} className="fixed top-6 right-6 z-10 text-[10px] tracking-widest uppercase text-white/20 hover:text-white/50 transition-colors">Close</button>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 0.25 }} transition={{ delay: 1 }} className="fixed top-6 left-1/2 -translate-x-1/2 text-[10px] tracking-[0.4em] uppercase text-white/25 z-10">Every star is a wish · Hover to read</motion.p>
            <canvas ref={canvasRef} className="w-full h-full cursor-crosshair" onMouseMove={onMouseMove} onMouseLeave={() => setHovered(null)} />
            <AnimatePresence>
              {hovered && (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="fixed bottom-12 left-1/2 -translate-x-1/2 px-5 py-3 rounded-2xl border border-white/10 bg-black/60 backdrop-blur-xl text-center max-w-xs">
                  <p className="text-sm italic text-white/70">&ldquo;{hovered.wish}&rdquo;</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
