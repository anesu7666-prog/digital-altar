"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SilenceMode() {
  const [silent, setSilent] = useState(false);
  useEffect(() => {
    const root = document.documentElement;
    silent ? root.classList.add("silence-mode") : root.classList.remove("silence-mode");
    return () => root.classList.remove("silence-mode");
  }, [silent]);
  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") setSilent(false); }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  return (
    <>
      <motion.button onClick={() => setSilent((v) => !v)} whileTap={{ scale: 0.92 }}
        className="fixed top-16 right-4 z-40 w-10 h-10 rounded-full border border-white/25 bg-white/15 backdrop-blur-xl flex items-center justify-center text-base shadow-sm hover:bg-white/30 transition-all"
        aria-label="Toggle silence mode"
      >{silent ? "👁" : "🤫"}</motion.button>
      <AnimatePresence>
        {silent && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.8 }}
            className="fixed inset-0 z-30 pointer-events-none" style={{ background: "radial-gradient(ellipse at center, #0a0705 0%, #000 100%)" }}
          />
        )}
      </AnimatePresence>
    </>
  );
}
