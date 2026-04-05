"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";

interface Lantern { id: number; wish: string; color: string; created_at: string; }
const COLORS = ["#fde68a", "#fca5a5", "#c4b5fd", "#86efac", "#93c5fd", "#fdba74"];

export default function WishLantern() {
  const [wish, setWish] = useState("");
  const [lanterns, setLanterns] = useState<Lantern[]>([]);
  const [launching, setLaunching] = useState(false);
  const [launched, setLaunched] = useState<Lantern | null>(null);

  useEffect(() => {
    supabase.from("wishes").select("id, wish, color, created_at").order("created_at", { ascending: false }).limit(12)
      .then(({ data }) => { if (data) setLanterns(data as Lantern[]); });
    const ch = supabase.channel("wishes:live")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "wishes" },
        (payload) => setLanterns((prev) => [payload.new as Lantern, ...prev.slice(0, 11)]))
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  async function launch() {
    const trimmed = wish.trim();
    if (!trimmed || launching) return;
    setLaunching(true);
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    const { data } = await supabase.from("wishes").insert({ wish: trimmed, color }).select().single();
    if (data) setLaunched(data as Lantern);
    setWish(""); setLaunching(false);
    setTimeout(() => setLaunched(null), 3000);
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-lg font-semibold text-stone-700 tracking-wide">Wish Lanterns</h2>
        <p className="text-sm text-stone-500 mt-1">Write a wish. Release it into the sky.</p>
      </div>
      <div className="relative w-full h-40 rounded-2xl overflow-hidden border border-white/20 bg-white/5">
        <AnimatePresence>
          {launched && (
            <motion.div key="launching" initial={{ y: 120, opacity: 1, scale: 0.8 }} animate={{ y: -20, opacity: 0, scale: 1.2 }} exit={{ opacity: 0 }} transition={{ duration: 2.5, ease: "easeOut" }}
              className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 pointer-events-none"
            >
              <div className="w-8 h-10 rounded-t-full rounded-b-sm border-2 flex items-center justify-center text-xs"
                style={{ borderColor: launched.color, backgroundColor: `${launched.color}33`, boxShadow: `0 0 16px 4px ${launched.color}66` }}>🕯️</div>
              <p className="text-[10px] text-stone-500 max-w-[120px] text-center truncate">{launched.wish}</p>
            </motion.div>
          )}
        </AnimatePresence>
        {lanterns.map((l, i) => (
          <motion.div key={l.id} initial={{ opacity: 0 }} animate={{ opacity: [0.4, 0.7, 0.4], y: [0, -6, 0] }}
            transition={{ duration: 3 + i * 0.4, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
            className="absolute flex flex-col items-center gap-0.5" style={{ left: `${8 + (i % 6) * 16}%`, top: `${10 + Math.floor(i / 6) * 45}%` }} title={l.wish}
          >
            <div className="w-5 h-6 rounded-t-full rounded-b-sm border flex items-center justify-center text-[8px]"
              style={{ borderColor: l.color, backgroundColor: `${l.color}22`, boxShadow: `0 0 8px 2px ${l.color}44` }}>✦</div>
          </motion.div>
        ))}
        {lanterns.length === 0 && <p className="absolute inset-0 flex items-center justify-center text-xs text-stone-400 italic">The sky awaits your first wish…</p>}
      </div>
      <div className="flex gap-2">
        <input value={wish} onChange={(e) => setWish(e.target.value)} onKeyDown={(e) => e.key === "Enter" && launch()}
          placeholder="Make a wish…" maxLength={80}
          className="flex-1 rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm text-stone-600 placeholder:text-stone-400 focus:outline-none focus:border-white/40 backdrop-blur-sm"
        />
        <motion.button onClick={launch} disabled={!wish.trim() || launching} whileTap={{ scale: 0.96 }}
          className="px-4 py-2 rounded-xl border border-white/25 bg-white/20 text-sm font-medium text-stone-600 hover:bg-white/35 disabled:opacity-40 transition-all"
        >{launching ? "✦" : "Release"}</motion.button>
      </div>
    </div>
  );
}
