"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LINES = ["You found this place.", "That means something.", "Welcome."];

export default function EntranceVeil() {
  const [visible, setVisible] = useState(true);
  const [lineIndex, setLineIndex] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("altar-entered")) { setVisible(false); return; }
    const timers: ReturnType<typeof setTimeout>[] = [];
    LINES.forEach((_, i) => timers.push(setTimeout(() => setLineIndex(i), i * 1400)));
    timers.push(setTimeout(() => setDone(true), LINES.length * 1400 + 600));
    timers.push(setTimeout(() => { setVisible(false); sessionStorage.setItem("altar-entered", "1"); }, LINES.length * 1400 + 1800));
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.4, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
          style={{ background: "radial-gradient(ellipse at center, #1a0f2e 0%, #0a0612 60%, #000 100%)" }}
        >
          {Array.from({ length: 60 }).map((_, i) => (
            <motion.div key={i} className="absolute rounded-full bg-white"
              style={{ width: Math.random() * 2 + 1, height: Math.random() * 2 + 1, left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
              animate={{ opacity: [0.1, 0.8, 0.1] }} transition={{ duration: 2 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 2 }}
            />
          ))}
          <div className="relative z-10 flex flex-col items-center gap-4 text-center px-8">
            {LINES.map((line, i) => (
              <AnimatePresence key={i}>
                {lineIndex >= i && !done && (
                  <motion.p initial={{ opacity: 0, y: 12, filter: "blur(8px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.9 }}
                    className={["font-light tracking-[0.15em]", i === 2 ? "text-3xl text-white/90" : "text-lg text-white/60"].join(" ")}
                  >{line}</motion.p>
                )}
              </AnimatePresence>
            ))}
          </div>
          <motion.button initial={{ opacity: 0 }} animate={{ opacity: 0.3 }} transition={{ delay: 2 }}
            onClick={() => { setVisible(false); sessionStorage.setItem("altar-entered", "1"); }}
            className="absolute bottom-8 text-[10px] tracking-widest uppercase text-white/40 hover:text-white/70 transition-colors"
          >Enter now</motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
