"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SacredHours() {
  const [sacred, setSacred] = useState(false);
  useEffect(() => {
    function check() { setSacred(new Date().getHours() === 3); }
    check(); const t = setInterval(check, 60000); return () => clearInterval(t);
  }, []);
  useEffect(() => {
    const root = document.documentElement;
    sacred ? root.classList.add("sacred-hours") : root.classList.remove("sacred-hours");
    return () => root.classList.remove("sacred-hours");
  }, [sacred]);
  return (
    <AnimatePresence>
      {sacred && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 3 }}
          className="fixed inset-0 z-20 pointer-events-none" style={{ background: "radial-gradient(ellipse at center, rgba(30,0,60,0.4) 0%, transparent 70%)" }}
        >
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2, duration: 2 }} className="absolute top-1/4 left-1/2 -translate-x-1/2 text-center px-8">
            <p className="text-[10px] tracking-[0.4em] uppercase text-purple-300/50 mb-3">3 o&apos;clock</p>
            <p className="text-lg font-light text-white/40 italic leading-relaxed max-w-xs">&ldquo;The veil is thin at this hour.&rdquo;</p>
            <p className="text-xs text-white/25 mt-3 tracking-widest">You are one of the few awake.</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
