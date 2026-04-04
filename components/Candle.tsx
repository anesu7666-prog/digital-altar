"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";

// ─── Types ────────────────────────────────────────────────────────────────────

interface CandleState {
  id: string;
  lit: boolean;
  color: string;
}

// ─── Flame ────────────────────────────────────────────────────────────────────

function Flame({ color }: { color: string }) {
  return (
    <AnimatePresence>
      <motion.div
        key="flame"
        initial={{ scaleY: 0, opacity: 0 }}
        animate={{ scaleY: [1, 1.08, 0.95, 1], opacity: 1 }}
        exit={{ scaleY: 0, opacity: 0 }}
        transition={{ duration: 0.4, scaleY: { repeat: Infinity, duration: 1.2, ease: "easeInOut" } }}
        style={{ originY: "bottom" }}
        className="absolute -top-6 left-1/2 -translate-x-1/2 w-4 h-6 rounded-full"
      >
        {/* outer glow */}
        <div
          className="absolute inset-0 rounded-full blur-md opacity-80"
          style={{ backgroundColor: color }}
        />
        {/* inner bright core */}
        <div className="absolute inset-[3px] rounded-full bg-white/80 blur-[2px]" />
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Candle ───────────────────────────────────────────────────────────────────

export default function Candle({ id }: { id: string }) {
  const [lit, setLit] = useState(false);
  const [color, setColor] = useState("#f97316");
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  // ── Supabase: load initial state + subscribe to changes ──────────────────

  useEffect(() => {
    // Fetch persisted state for this candle
    supabase
      .from("candles")
      .select("lit, color")
      .eq("id", id)
      .single()
      .then(({ data }) => {
        if (data) {
          setLit(data.lit);
          setColor(data.color);
        }
      });

    // Subscribe to realtime updates for this candle
    const channel = supabase
      .channel(`candle:${id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "candles", filter: `id=eq.${id}` },
        (payload) => {
          const row = payload.new as CandleState;
          setLit(row.lit);
          setColor(row.color);
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [id]);

  // ── Helpers ──────────────────────────────────────────────────────────────

  async function persist(nextLit: boolean, nextColor: string) {
    await supabase
      .from("candles")
      .upsert({ id, lit: nextLit, color: nextColor }, { onConflict: "id" });
  }

  function toggleLit() {
    const next = !lit;
    setLit(next);
    persist(next, color);
  }

  function handleColorChange(e: React.ChangeEvent<HTMLInputElement>) {
    const next = e.target.value;
    setColor(next);
    persist(lit, next);
  }

  // Close picker on outside click
  useEffect(() => {
    function onOutside(e: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setShowPicker(false);
      }
    }
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, []);

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col items-center gap-3 select-none">
      {/* Candle body */}
      <div className="relative flex flex-col items-center">
        {lit && <Flame color={color} />}

        <motion.button
          onClick={toggleLit}
          whileTap={{ scale: 0.95 }}
          className="relative w-10 h-24 rounded-sm cursor-pointer focus:outline-none"
          style={{
            background: "linear-gradient(to right, #e5e0d8, #f5f0e8, #e5e0d8)",
            boxShadow: lit
              ? `0 0 24px 8px ${color}99, 0 0 60px 20px ${color}44`
              : "0 2px 8px rgba(0,0,0,0.15)",
            transition: "box-shadow 0.4s ease",
          }}
          aria-label={lit ? "Extinguish candle" : "Light candle"}
        >
          {/* wax drip texture */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-1 h-4 bg-white/40 rounded-full" />
          {/* wick */}
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-[2px] h-3 bg-stone-700 rounded-full" />
        </motion.button>
      </div>

      {/* Prism button + color picker */}
      <div className="relative" ref={pickerRef}>
        <button
          onClick={() => setShowPicker((v) => !v)}
          className="text-[10px] font-medium tracking-widest uppercase px-2 py-1 rounded-full border border-white/30 bg-white/20 backdrop-blur-sm text-stone-600 hover:bg-white/40 transition-colors"
          aria-label="Open color picker"
        >
          Prism
        </button>

        <AnimatePresence>
          {showPicker && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: -4 }}
              transition={{ duration: 0.18 }}
              className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 p-2 rounded-xl border border-white/20 bg-white/20 backdrop-blur-xl shadow-lg"
            >
              <span className="text-[9px] uppercase tracking-widest text-stone-500">Glow</span>
              <input
                type="color"
                value={color}
                onChange={handleColorChange}
                className="w-8 h-8 rounded-full cursor-pointer border-0 bg-transparent p-0"
                aria-label="Choose glow color"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
