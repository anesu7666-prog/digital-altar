"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PHASES = [
  { label: "Breathe in", duration: 4, scale: 1.6, color: "#a5f3fc" },
  { label: "Hold",       duration: 7, scale: 1.6, color: "#c4b5fd" },
  { label: "Release",    duration: 8, scale: 1.0, color: "#fde68a" },
];

export default function BreathingGuide() {
  const [active, setActive] = useState(false);
  const [phase, setPhase] = useState(0);
  const [seconds, setSeconds] = useState(PHASES[0].duration);
  const current = PHASES[phase];

  useEffect(() => {
    if (!active) return;
    setSeconds(PHASES[phase].duration);
    const interval = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) { setPhase((p) => (p + 1) % PHASES.length); return PHASES[(phase + 1) % PHASES.length].duration; }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [active, phase]);

  return (
    <div className="flex flex-col items-center gap-6">
      <div>
        <h2 className="text-lg font-semibold text-stone-700 tracking-wide text-center">Breathe</h2>
        <p className="text-sm text-stone-500 text-center mt-1">4 · 7 · 8 breathing — calms the nervous system.</p>
      </div>
      <div className="relative flex items-center justify-center w-48 h-48">
        {[1, 0.75, 0.5].map((s, i) => (
          <motion.div key={i} animate={active ? { scale: current.scale * s, opacity: 0.25 + i * 0.1 } : { scale: s, opacity: 0.1 }}
            transition={{ duration: current.duration, ease: "easeInOut" }}
            className="absolute inset-0 rounded-full" style={{ backgroundColor: current.color }}
          />
        ))}
        <div className="relative z-10 flex flex-col items-center">
          <AnimatePresence mode="wait">
            <motion.p key={active ? current.label : "start"} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.3 }}
              className="text-stone-600 font-medium text-sm tracking-wide"
            >{active ? current.label : "Ready"}</motion.p>
          </AnimatePresence>
          {active && <span className="text-2xl font-semibold text-stone-700 mt-1">{seconds}</span>}
        </div>
      </div>
      <motion.button onClick={() => { setActive((v) => !v); setPhase(0); setSeconds(PHASES[0].duration); }} whileTap={{ scale: 0.96 }}
        className="px-6 py-2 rounded-full border border-white/25 bg-white/20 backdrop-blur-sm text-sm font-medium text-stone-600 hover:bg-white/35 transition-all"
      >{active ? "Stop" : "Begin"}</motion.button>
    </div>
  );
}
