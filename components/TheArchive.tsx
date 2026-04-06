"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";

interface ArchiveEntry { id: number; content: string; type: "thought" | "wish" | "grief"; }

export default function TheArchive() {
  const [open, setOpen] = useState(false);
  const [entries, setEntries] = useState<ArchiveEntry[]>([]);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    const [thoughts, wishes, grief] = await Promise.all([
      supabase.from("thoughts").select("id, content").order("created_at", { ascending: false }).limit(40),
      supabase.from("wishes").select("id, wish").order("created_at", { ascending: false }).limit(40),
      supabase.from("grief").select("id, name").order("created_at", { ascending: false }).limit(40),
    ]);
    const all: ArchiveEntry[] = [
      ...(thoughts.data ?? []).map((r) => ({ id: r.id, content: r.content, type: "thought" as const })),
      ...(wishes.data ?? []).map((r) => ({ id: r.id + 10000, content: r.wish, type: "wish" as const })),
      ...(grief.data ?? []).map((r) => ({ id: r.id + 20000, content: r.name, type: "grief" as const })),
    ].sort(() => Math.random() - 0.5);
    setEntries(all); setLoading(false);
  }

  useEffect(() => { if (open) load(); }, [open]);

  const typeColor = { thought: "rgba(120,113,108,0.55)", wish: "rgba(251,191,36,0.55)", grief: "rgba(167,139,250,0.55)" };

  return (
    <>
      <button onClick={() => setOpen(true)} className="text-[10px] tracking-[0.3em] uppercase text-stone-400 hover:text-stone-600 transition-colors">✦ Open the Archive</button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1 }} className="fixed inset-0 z-[90] overflow-auto" style={{ background: "radial-gradient(ellipse at center, #0a0612 0%, #000 100%)" }}>
            <button onClick={() => setOpen(false)} className="fixed top-6 right-6 text-[10px] tracking-widest uppercase text-white/30 hover:text-white/60 transition-colors z-10">Close</button>
            <div className="min-h-screen flex flex-col items-center justify-start px-8 py-20">
              <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 0.4, y: 0 }} transition={{ delay: 0.5 }} className="text-[10px] tracking-[0.4em] uppercase text-white/40 mb-4">The Archive</motion.p>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 0.25 }} transition={{ delay: 0.8 }} className="text-xs text-white/30 mb-16 text-center max-w-xs">
                Every thought released. Every wish made. Every name held.<br />
                <span className="text-amber-300/40">gold</span> · wishes &nbsp;<span className="text-purple-300/40">violet</span> · grief &nbsp;<span className="text-stone-400/40">stone</span> · thoughts
              </motion.p>
              {loading ? <p className="text-white/20 text-sm italic animate-pulse">Gathering…</p> : (
                <div className="flex flex-wrap justify-center gap-x-8 gap-y-5 max-w-3xl">
                  {entries.map((e, i) => (
                    <motion.p key={e.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02, duration: 0.6 }}
                      className="text-sm italic font-light text-center" style={{ color: typeColor[e.type] }}
                    >{e.content}</motion.p>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
