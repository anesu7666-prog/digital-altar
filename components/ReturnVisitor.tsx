"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ReturnVisitor() {
  const [message, setMessage] = useState<string | null>(null);
  useEffect(() => {
    const last = localStorage.getItem("altar-last-visit");
    localStorage.setItem("altar-last-visit", new Date().toISOString());
    if (!last) return;
    const days = Math.floor((Date.now() - new Date(last).getTime()) / 86400000);
    const hours = Math.floor((Date.now() - new Date(last).getTime()) / 3600000);
    let msg = "";
    if (hours < 1) msg = "You just left. The altar kept the light on.";
    else if (hours < 24) msg = "You came back today. Something brought you here again.";
    else if (days === 1) msg = "You were here yesterday. Welcome back.";
    else if (days < 7) msg = `${days} days since your last visit. The altar remembers you.`;
    else msg = `It has been ${days} days. The altar has been waiting.`;
    setMessage(msg);
    setTimeout(() => setMessage(null), 5000);
  }, []);
  return (
    <AnimatePresence>
      {message && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.8 }}
          className="fixed top-16 left-1/2 -translate-x-1/2 z-50 pointer-events-none px-6 py-2 rounded-full border border-white/20 bg-white/15 backdrop-blur-xl"
        >
          <p className="text-xs text-stone-500 italic tracking-wide whitespace-nowrap">{message}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
