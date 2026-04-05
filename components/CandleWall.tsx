"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";

interface CandleRow { id: string; lit: boolean; color: string; dedication: string; }

export default function CandleWall() {
  const [candles, setCandles] = useState<CandleRow[]>([]);

  useEffect(() => {
    supabase.from("candles").select("id, lit, color, dedication").order("id")
      .then(({ data }) => { if (data) setCandles(data as CandleRow[]); });
    const ch = supabase.channel("candle-wall")
      .on("postgres_changes", { event: "*", schema: "public", table: "candles" }, (payload) => {
        setCandles((prev) => {
          const updated = prev.map((c) => c.id === (payload.new as CandleRow).id ? (payload.new as CandleRow) : c);
          if (!prev.find((c) => c.id === (payload.new as CandleRow).id)) updated.push(payload.new as CandleRow);
          return updated;
        });
      }).subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  const lit = candles.filter((c) => c.lit);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-baseline justify-between">
        <h2 className="text-lg font-semibold text-stone-700 tracking-wide">Candle Wall</h2>
        <span className="text-xs text-stone-400 tracking-widest">{lit.length} flame{lit.length !== 1 ? "s" : ""} burning</span>
      </div>
      <p className="text-sm text-stone-500">Every candle lit by every visitor, together.</p>
      {lit.length === 0 ? (
        <p className="text-center text-sm text-stone-400 italic py-6">No candles are lit right now. Be the first.</p>
      ) : (
        <div className="grid grid-cols-6 gap-3">
          <AnimatePresence>
            {lit.map((c) => (
              <motion.div key={c.id} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }} transition={{ duration: 0.4 }}
                className="flex flex-col items-center gap-1" title={c.dedication || c.id}
              >
                <motion.div animate={{ scaleY: [1, 1.15, 0.9, 1] }} transition={{ duration: 1.2 + Math.random(), repeat: Infinity, ease: "easeInOut" }}
                  className="w-2 h-3 rounded-full blur-[1px]" style={{ backgroundColor: c.color, boxShadow: `0 0 6px 2px ${c.color}88` }}
                />
                <div className="w-3 h-8 rounded-sm" style={{ background: "linear-gradient(to right, #e5e0d8, #f5f0e8, #e5e0d8)", boxShadow: `0 0 8px 3px ${c.color}55` }} />
                {c.dedication && <p className="text-[8px] text-stone-400 truncate w-10 text-center">{c.dedication}</p>}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
