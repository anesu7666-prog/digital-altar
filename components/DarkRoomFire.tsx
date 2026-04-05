"use client";
import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDarkRoom } from "./RoomProvider";

function EmberCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current!; const ctx = canvas.getContext("2d")!;
    canvas.width = 320; canvas.height = 320;
    interface Ember { x: number; y: number; vx: number; vy: number; alpha: number; size: number; hue: number; }
    const embers: Ember[] = Array.from({ length: 40 }, () => spawn());
    function spawn(): Ember { return { x: 140 + (Math.random() - 0.5) * 40, y: 220 + Math.random() * 20, vx: (Math.random() - 0.5) * 1.2, vy: -(Math.random() * 2 + 0.5), alpha: Math.random() * 0.8 + 0.2, size: Math.random() * 2.5 + 0.5, hue: Math.random() * 40 + 10 }; }
    let raf: number;
    function tick() {
      ctx.clearRect(0, 0, 320, 320);
      for (let i = 0; i < embers.length; i++) {
        const e = embers[i]; e.x += e.vx; e.y += e.vy; e.vy -= 0.02; e.alpha -= 0.008;
        if (e.alpha <= 0 || e.y < 0) { embers[i] = spawn(); continue; }
        ctx.beginPath(); ctx.arc(e.x, e.y, e.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${e.hue}, 100%, 65%, ${e.alpha})`; ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    }
    tick();
    return () => cancelAnimationFrame(raf);
  }, []);
  return <canvas ref={ref} className="absolute inset-0 pointer-events-none" style={{ width: 320, height: 320 }} />;
}

function FlameLayer({ color, w, h, delay, blur }: { color: string; w: number; h: number; delay: number; blur: number }) {
  return (
    <motion.div animate={{ scaleY: [1, 1.12, 0.92, 1.08, 1], scaleX: [1, 0.95, 1.05, 0.97, 1], rotate: [-1, 1, -1.5, 0.5, -1] }}
      transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay }}
      style={{ width: w, height: h, background: `radial-gradient(ellipse at 50% 80%, ${color}, transparent 70%)`, filter: `blur(${blur}px)`, originY: "bottom", borderRadius: "50% 50% 30% 30%" }}
      className="absolute bottom-0 left-1/2 -translate-x-1/2"
    />
  );
}

export default function DarkRoomFire() {
  const { darkRoom } = useDarkRoom();
  return (
    <AnimatePresence>
      {darkRoom && (
        <motion.div initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.6 }} transition={{ duration: 0.8, ease: "easeOut" }} className="flex flex-col items-center gap-2">
          <motion.div animate={{ opacity: [0.18, 0.28, 0.18], scale: [1, 1.06, 1] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute rounded-full pointer-events-none" style={{ width: 500, height: 500, background: "radial-gradient(circle, #f97316 0%, #fbbf24 20%, transparent 70%)", filter: "blur(40px)", transform: "translateY(60px)" }}
          />
          <div className="relative" style={{ width: 320, height: 320 }}>
            <EmberCanvas />
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2" style={{ width: 120, height: 160 }}>
              <FlameLayer color="#7c2d12" w={120} h={160} delay={0} blur={12} />
              <FlameLayer color="#c2410c" w={90} h={130} delay={0.2} blur={8} />
              <FlameLayer color="#ea580c" w={70} h={110} delay={0.1} blur={6} />
              <FlameLayer color="#fb923c" w={50} h={90} delay={0.3} blur={4} />
              <FlameLayer color="#fbbf24" w={30} h={70} delay={0.15} blur={3} />
              <FlameLayer color="#fef08a" w={14} h={50} delay={0.05} blur={2} />
            </div>
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-1">
              <div className="w-24 h-5 rounded-full bg-stone-800 shadow-inner" style={{ transform: "rotate(-8deg)" }} />
              <div className="w-20 h-5 rounded-full bg-stone-700 shadow-inner" style={{ transform: "rotate(8deg) translateY(2px)" }} />
            </div>
            <motion.div animate={{ opacity: [0.4, 0.65, 0.4] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-8 left-1/2 -translate-x-1/2 rounded-full" style={{ width: 140, height: 20, background: "#f97316", filter: "blur(12px)" }}
            />
          </div>
          <p className="text-xs text-amber-300/60 tracking-widest uppercase mt-2">You are not alone in the dark</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
