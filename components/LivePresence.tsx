"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";

export default function LivePresence() {
  const [count, setCount] = useState(1);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const channel = supabase.channel("altar:presence", { config: { presence: { key: crypto.randomUUID() } } });
    channel.on("presence", { event: "sync" }, () => {
      setCount(Object.keys(channel.presenceState()).length);
      setPulse(true); setTimeout(() => setPulse(false), 600);
    }).subscribe(async (s) => { if (s === "SUBSCRIBED") await channel.track({ online_at: new Date().toISOString() }); });
    return () => { supabase.removeChannel(channel); };
  }, []);

  return (
    <motion.div animate={pulse ? { scale: [1, 1.06, 1] } : {}} transition={{ duration: 0.4 }} className="flex items-center justify-center gap-2">
      <div className="relative flex items-center justify-center">
        <span className="absolute w-3 h-3 rounded-full bg-emerald-400 opacity-40 animate-ping" />
        <span className="w-2 h-2 rounded-full bg-emerald-400" />
      </div>
      <AnimatePresence mode="wait">
        <motion.p key={count} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.3 }} className="text-sm text-stone-500 italic">
          {count === 1 ? "You are here alone. The altar holds you." : `${count} souls are here with you right now.`}
        </motion.p>
      </AnimatePresence>
    </motion.div>
  );
}
