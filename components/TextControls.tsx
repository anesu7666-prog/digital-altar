"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SIZES = [{ label: "S", value: "14px" }, { label: "M", value: "16px" }, { label: "L", value: "19px" }, { label: "XL", value: "22px" }];
const COLOURS = [
  { label: "Stone", value: "#57534e" }, { label: "Slate", value: "#475569" },
  { label: "Indigo", value: "#4338ca" }, { label: "Rose", value: "#9f1239" },
  { label: "Forest", value: "#166534" }, { label: "Night", value: "#1c1917" },
];

export default function TextControls() {
  const [open, setOpen] = useState(false);
  const [size, setSize] = useState("16px");
  const [colour, setColour] = useState("#57534e");

  function applySize(v: string) { setSize(v); document.documentElement.style.setProperty("--text-size", v); }
  function applyColour(v: string) { setColour(v); document.documentElement.style.setProperty("--text-colour", v); }

  return (
    <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end gap-2">
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, scale: 0.9, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 8 }} transition={{ duration: 0.2 }}
            className="rounded-2xl border border-white/25 bg-white/20 backdrop-blur-2xl shadow-lg p-4 flex flex-col gap-4 w-48"
          >
            <div>
              <p className="text-[10px] uppercase tracking-widest text-stone-400 mb-2">Text size</p>
              <div className="flex gap-1.5">
                {SIZES.map((s) => (
                  <button key={s.value} onClick={() => applySize(s.value)}
                    className={["flex-1 py-1 rounded-lg text-xs font-medium transition-all", size === s.value ? "bg-white/50 text-stone-700 shadow-inner" : "bg-white/15 text-stone-500 hover:bg-white/30"].join(" ")}
                  >{s.label}</button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-stone-400 mb-2">Text colour</p>
              <div className="grid grid-cols-3 gap-1.5">
                {COLOURS.map((c) => (
                  <button key={c.value} onClick={() => applyColour(c.value)} title={c.label}
                    className={["h-7 rounded-lg transition-all border-2", colour === c.value ? "border-white scale-110 shadow" : "border-transparent hover:scale-105"].join(" ")}
                    style={{ backgroundColor: c.value }} aria-label={c.label}
                  />
                ))}
              </div>
            </div>
            <button onClick={() => { applySize("16px"); applyColour("#57534e"); }} className="text-[10px] uppercase tracking-widest text-stone-400 hover:text-stone-600 transition-colors text-center">Reset</button>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button onClick={() => setOpen((v) => !v)} whileTap={{ scale: 0.92 }}
        className="w-10 h-10 rounded-full border border-white/25 bg-white/15 backdrop-blur-xl flex items-center justify-center text-sm shadow-sm hover:bg-white/30 transition-all"
        aria-label="Text settings"
      >Aa</motion.button>
    </div>
  );
}
