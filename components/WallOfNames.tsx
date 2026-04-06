"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";

interface NameEntry { id: number; name: string; }

export default function WallOfNames() {
  const [open, setOpen] = useState(false);
  const [names, setNames] = useState<NameEntry[]>([]);

  useEffect(() => {
    if (!open) return;
    supabase.from("grief").select("id, name").order("created_at", { ascending: false }).limit(80)
      .then(({ data }) => { if (data) setNames(data as NameEntry[]); });
    const ch = supabase.channel("wall:grief")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "grief" }, (p) => setNames((prev) => [p.new as NameEntry, ...prev]))
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [open]);

  return (
    <>
      <button onClick={() => setOpen(true)} className="text-[10px] tracking-[0.3em] uppercase text-stone-400 hover:text-stone-600 transition-colors">✦ Wall of Names</button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.5 }} className="fixed inset-0 z-[90] overflow-hidden" style={{ background: "#030208" }}>
            <button onClick={() => setOpen(false)} className="fixed top-6 right-6 z-10 text-[10px] tracking-widest uppercase text-white/20 hover:text-white/50 transition-colors">Leave</button>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 0.2 }} transition={{ delay: 1 }} className="fixed top-6 left-1/2 -translate-x-1/2 text-[10px] tracking-[0.4em] uppercase text-white/20 z-10">Those we hold</motion.p>
            <div className="absolute inset-0">
              {names.map((n, i) => (
                <motion.p key={n.id} initial={{ opacity: 0 }} animate={{ opacity: [0, 0.45, 0.3, 0.45], y: [0, -8, 0] }}
                  transition={{ opacity: { duration: 3, delay: i * 0.08 }, y: { duration: 6 + Math.random() * 4, repeat: Infinity, ease: "easeInOut", delay: Math.random() * 3 } }}
                  className="absolute text-sm font-light italic text-white/40"
                  style={{ left: `${5 + (i % 8) * 12}%`, top: `${8 + Math.floor(i / 8) * 11}%`, fontSize: `${11 + Math.random() * 4}px` }}
                >{n.name}</motion.p>
              ))}
            </div>
            {names.length === 0 && <p className="absolute inset-0 flex items-center justify-center text-sm text-white/20 italic">No names yet. Be the first to hold someone here.</p>}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
