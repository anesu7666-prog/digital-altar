"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const WHISPERS: Record<string, string[]> = {
  candle_lit: ["Your light joins the others.", "Someone, somewhere, sees your flame.", "The altar is brighter now."],
  candle_out: ["Even extinguished flames leave warmth.", "The light lives on in those who saw it."],
  thought_released: ["It is gone now. You are lighter.", "The void received it. You are free.", "Released. Breathe."],
  heart_shared: ["Your words will find who needs them.", "Someone will read this and feel less alone."],
  wish_released: ["Your wish is in the sky now.", "The universe heard that."],
  gratitude_dropped: ["Gratitude is a form of prayer.", "The jar holds your light."],
  bell_struck: ["The tone carries further than you know.", "Every soul here heard that."],
  grief_released: ["Their name is held here now.", "You are not carrying this alone."],
};

let whisperCallback: ((type: string) => void) | null = null;
export function triggerWhisper(type: string) { whisperCallback?.(type); }

export default function AltarWhisper() {
  const [message, setMessage] = useState<string | null>(null);
  const [key, setKey] = useState(0);
  useEffect(() => {
    whisperCallback = (type: string) => {
      const pool = WHISPERS[type]; if (!pool) return;
      setMessage(pool[Math.floor(Math.random() * pool.length)]);
      setKey((k) => k + 1);
    };
    return () => { whisperCallback = null; };
  }, []);
  return (
    <AnimatePresence>
      {message && (
        <motion.div key={key} initial={{ opacity: 0, y: 8, filter: "blur(4px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.8 }}
          onAnimationComplete={() => setTimeout(() => setMessage(null), 3500)}
          className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 pointer-events-none text-center px-6"
        >
          <p className="text-sm italic text-stone-500 tracking-wide">✦ {message} ✦</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
