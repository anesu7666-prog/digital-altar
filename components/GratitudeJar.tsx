"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";

interface Gratitude { id: number; content: string; created_at: string; }

export default function GratitudeJar() {
  const [gratitudes, setGratitudes] = useState<Gratitude[]>([]);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [overflow, setOverflow] = useState(false);
  const MAX = 20;

  useEffect(() => {
    supabase.from("gratitudes").select("id, content, created_at").order("created_at", { ascending: false }).limit(MAX)
      .then(({ data }) => { if (data) setGratitudes(data as Gratitude[]); });
    const ch = supabase.channel("gratitudes:live")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "gratitudes" }, (payload) => {
        setGratitudes((prev) => {
          const next = [payload.new as Gratitude, ...prev].slice(0, MAX);
          if (next.length >= MAX) { setOverflow(true); setTimeout(() => setOverflow(false), 2000); }
          return next;
        });
      }).subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  async function drop() {
    const trimmed = text.trim();
    if (!trimmed || submitting) return;
    setSubmitting(true);
    await supabase.from("gratitudes").insert({ content: trimmed });
    setText(""); setSubmitting(false);
  }

  const fillPct = Math.min(100, (gratitudes.length / MAX) * 100);

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-lg font-semibold text-stone-700 tracking-wide">Gratitude Jar</h2>
        <p className="text-sm text-stone-500 mt-1">Drop something you are grateful for. Watch the jar fill.</p>
      </div>
      <div className="flex justify-center">
        <div className="relative w-28 h-40">
          <div className="absolute inset-0 rounded-b-3xl rounded-t-lg border-2 border-white/30 bg-white/5 backdrop-blur-sm overflow-hidden">
            <motion.div animate={{ height: `${fillPct}%` }} transition={{ duration: 0.8, ease: "easeOut" }}
              className="absolute bottom-0 left-0 right-0" style={{ background: "linear-gradient(to top, #fde68a88, #fca5a544)" }}
            />
            <AnimatePresence>
              {overflow && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 flex items-center justify-center text-2xl">✨</motion.div>}
            </AnimatePresence>
            {gratitudes.slice(0, 8).map((g, i) => (
              <motion.div key={g.id} animate={{ y: [0, -4, 0], opacity: [0.6, 1, 0.6] }} transition={{ duration: 2 + i * 0.3, repeat: Infinity, delay: i * 0.2 }}
                className="absolute w-2 h-2 rounded-full bg-amber-300/70" style={{ left: `${15 + (i % 4) * 20}%`, bottom: `${10 + Math.floor(i / 4) * 25}%` }} title={g.content}
              />
            ))}
          </div>
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-16 h-4 rounded-t-lg border-2 border-white/30 bg-white/10" />
          <p className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-stone-400 whitespace-nowrap">{gratitudes.length}/{MAX} gratitudes</p>
        </div>
      </div>
      {gratitudes.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {gratitudes.slice(0, 6).map((g) => (
            <span key={g.id} className="text-xs px-2 py-1 rounded-full border border-amber-200/40 bg-amber-50/20 text-stone-500">
              {g.content.length > 30 ? g.content.slice(0, 30) + "…" : g.content}
            </span>
          ))}
        </div>
      )}
      <div className="flex gap-2">
        <input value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && drop()}
          placeholder="I am grateful for…" maxLength={100}
          className="flex-1 rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm text-stone-600 placeholder:text-stone-400 focus:outline-none focus:border-white/40 backdrop-blur-sm"
        />
        <motion.button onClick={drop} disabled={!text.trim() || submitting} whileTap={{ scale: 0.96 }}
          className="px-4 py-2 rounded-xl border border-white/25 bg-white/20 text-sm font-medium text-stone-600 hover:bg-white/35 disabled:opacity-40 transition-all"
        >Drop</motion.button>
      </div>
    </div>
  );
}
