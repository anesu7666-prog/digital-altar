"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";

interface Prayer {
  id: number;
  name: string;
  message: string;
  created_at: string;
  is_prayer: boolean;
  answered: boolean;
  hearts: number;
}

export default function AnsweredPrayers() {
  const [prayers, setPrayers] = useState<Prayer[]>([]);
  const [answered, setAnswered] = useState<Prayer[]>([]);
  const [marking, setMarking] = useState<number | null>(null);

  useEffect(() => {
    supabase
      .from("feedback")
      .select("id, name, message, created_at, is_prayer, answered, hearts")
      .eq("is_prayer", true)
      .order("answered", { ascending: true })
      .order("created_at", { ascending: false })
      .limit(20)
      .then(({ data }: { data: Prayer[] | null }) => {
        if (!data) return;
        setPrayers(data.filter((r) => !r.answered));
        setAnswered(data.filter((r) => r.answered));
      });

    const ch = supabase
      .channel("prayers:live")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "feedback" },
        (payload: { new: Prayer }) => {
          const row = payload.new;
          if (!row.is_prayer) return;
          if (row.answered) {
            setPrayers((prev) => prev.filter((p) => p.id !== row.id));
            setAnswered((prev) => [row, ...prev]);
          }
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(ch); };
  }, []);

  async function markAnswered(prayer: Prayer) {
    setMarking(prayer.id);
    await supabase.from("feedback").update({ answered: true }).eq("id", prayer.id);
    setMarking(null);
  }

  if (prayers.length === 0 && answered.length === 0) return null;

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-lg font-semibold text-stone-700 tracking-wide">
          Prayer Chain
        </h2>
        <p className="text-sm text-stone-500 mt-1">
          Hold these with you. Mark one received when it shifts.
        </p>
      </div>

      {prayers.length > 0 && (
        <div className="flex flex-col gap-2">
          <AnimatePresence>
            {prayers.map((p) => (
              <motion.div
                key={p.id}
                layout
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="rounded-xl border border-amber-200/30 bg-amber-50/10 px-4 py-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <p className="text-xs font-medium text-stone-600 mb-1">🙏 {p.name}</p>
                    <p className="text-sm text-stone-500 leading-relaxed">{p.message}</p>
                  </div>
                  <motion.button
                    onClick={() => markAnswered(p)}
                    disabled={marking === p.id}
                    whileTap={{ scale: 0.9 }}
                    className="shrink-0 text-[10px] tracking-widest uppercase px-2 py-1 rounded-full border border-amber-300/30 bg-amber-50/20 text-amber-700/60 hover:bg-amber-100/40 transition-all disabled:opacity-40"
                  >
                    Received
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {answered.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-[10px] tracking-widest uppercase text-amber-500/60 text-center">
            ✦ Received ✦
          </p>
          <AnimatePresence>
            {answered.slice(0, 5).map((p) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-xl px-4 py-3"
                style={{
                  background: "linear-gradient(135deg, rgba(251,191,36,0.12), rgba(245,158,11,0.06))",
                  border: "1px solid rgba(251,191,36,0.25)",
                  boxShadow: "0 0 20px rgba(251,191,36,0.08)",
                }}
              >
                <p className="text-xs font-medium text-amber-700/70 mb-1">✨ {p.name}</p>
                <p className="text-sm text-stone-500 leading-relaxed">{p.message}</p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
