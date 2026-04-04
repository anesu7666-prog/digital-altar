"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";

// ─── Particle engine ──────────────────────────────────────────────────────────

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  size: number;
  color: string;
}

function dissolve(canvas: HTMLCanvasElement, text: string, onDone: () => void) {
  const ctx = canvas.getContext("2d")!;
  const W = canvas.width;
  const H = canvas.height;

  // Render text to an offscreen canvas to sample pixel positions
  const off = document.createElement("canvas");
  off.width = W;
  off.height = H;
  const octx = off.getContext("2d")!;
  octx.fillStyle = "#78716c"; // stone-500
  octx.font = "14px sans-serif";
  octx.textAlign = "center";
  octx.textBaseline = "middle";

  // Wrap text manually
  const words = text.split(" ");
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (octx.measureText(test).width > W - 32) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);

  const lineH = 20;
  const startY = H / 2 - ((lines.length - 1) * lineH) / 2;
  lines.forEach((l, i) => octx.fillText(l, W / 2, startY + i * lineH));

  // Sample pixels
  const imgData = octx.getImageData(0, 0, W, H).data;
  const particles: Particle[] = [];
  for (let y = 0; y < H; y += 3) {
    for (let x = 0; x < W; x += 3) {
      const idx = (y * W + x) * 4;
      if (imgData[idx + 3] > 80) {
        particles.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 2.5,
          vy: -Math.random() * 2 - 0.5,
          alpha: 1,
          size: Math.random() * 2 + 1,
          color: `rgba(120,113,108,`,
        });
      }
    }
  }

  let frame = 0;
  function tick() {
    ctx.clearRect(0, 0, W, H);
    let alive = false;
    for (const p of particles) {
      if (p.alpha <= 0) continue;
      alive = true;
      p.x += p.vx;
      p.y += p.vy;
      p.vy -= 0.03;
      p.alpha -= 0.012;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `${p.color}${Math.max(0, p.alpha)})`;
      ctx.fill();
    }
    frame++;
    if (alive && frame < 300) {
      requestAnimationFrame(tick);
    } else {
      ctx.clearRect(0, 0, W, H);
      onDone();
    }
  }
  tick();
}

// ─── VoidBox ──────────────────────────────────────────────────────────────────

export default function VoidBox() {
  const [text, setText] = useState("");
  const [phase, setPhase] = useState<"idle" | "dissolving" | "done">("idle");
  const [count, setCount] = useState<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    supabase
      .from("thoughts")
      .select("id", { count: "exact", head: true })
      .then(({ count: c }) => setCount(c));
  }, []);

  const handleSubmit = useCallback(async () => {
    const trimmed = text.trim();
    if (!trimmed || phase !== "idle") return;

    await supabase.from("thoughts").insert({ content: trimmed });
    setCount((c) => (c ?? 0) + 1);
    setPhase("dissolving");

    if (canvasRef.current) {
      dissolve(canvasRef.current, trimmed, () => {
        setPhase("done");
        setText("");
        setTimeout(() => setPhase("idle"), 1200);
      });
    }
  }, [text, phase]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-baseline justify-between">
        <h2 className="text-lg font-semibold text-stone-700 tracking-wide">The Void</h2>
        {count !== null && (
          <span className="text-xs text-stone-400 tracking-widest">
            {count.toLocaleString()} thoughts released
          </span>
        )}
      </div>

      <p className="text-sm text-stone-500">
        Write what weighs on you. Release it.
      </p>

      {/* Text / canvas layer */}
      <div className="relative w-full h-36 rounded-2xl overflow-hidden border border-white/20 bg-white/10">
        <AnimatePresence>
          {phase === "idle" && (
            <motion.textarea
              ref={textareaRef}
              key="textarea"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSubmit();
              }}
              placeholder="Speak freely. This will dissolve."
              className="absolute inset-0 w-full h-full resize-none bg-transparent p-4 text-sm text-stone-600 placeholder:text-stone-400 focus:outline-none"
            />
          )}
        </AnimatePresence>

        <canvas
          ref={canvasRef}
          className="absolute inset-0 pointer-events-none"
          style={{
            width: "100%",
            height: "100%",
            display: phase === "dissolving" ? "block" : "none",
          }}
          width={480}
          height={144}
        />

        <AnimatePresence>
          {phase === "done" && (
            <motion.div
              key="done"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center text-sm text-stone-400 italic"
            >
              Released into the void.
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <motion.button
        onClick={handleSubmit}
        disabled={!text.trim() || phase !== "idle"}
        whileTap={{ scale: 0.97 }}
        className="self-end px-5 py-2 rounded-full text-sm font-medium tracking-wide border border-white/25 bg-white/20 backdrop-blur-sm text-stone-600 hover:bg-white/35 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
      >
        Release
      </motion.button>
    </div>
  );
}
