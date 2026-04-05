"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRoom, RoomMode } from "./RoomProvider";

const ROOMS: Record<RoomMode, { icon: string; label: string }> = {
  light:  { icon: "☀️", label: "Light Room"  },
  dark:   { icon: "🔥", label: "Dark Room"   },
  glass:  { icon: "🪟", label: "Glass Room"  },
  aurora: { icon: "🌌", label: "Aurora Room" },
};

export default function RoomToggle() {
  const { room, cycle } = useRoom();
  const current = ROOMS[room];
  return (
    <motion.button onClick={cycle} whileTap={{ scale: 0.92 }}
      className="fixed top-4 left-4 z-50 flex items-center gap-2 px-3 h-10 rounded-full border border-white/25 bg-white/15 backdrop-blur-xl text-sm shadow-sm hover:bg-white/30 transition-all"
      aria-label="Switch room"
    >
      <AnimatePresence mode="wait">
        <motion.span key={room} initial={{ opacity: 0, rotate: -20, scale: 0.6 }} animate={{ opacity: 1, rotate: 0, scale: 1 }} exit={{ opacity: 0, rotate: 20, scale: 0.6 }} transition={{ duration: 0.25 }}>
          {current.icon}
        </motion.span>
      </AnimatePresence>
      <AnimatePresence mode="wait">
        <motion.span key={room + "-label"} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 6 }} transition={{ duration: 0.2 }}
          className="text-xs font-medium text-stone-600 tracking-wide"
        >{current.label}</motion.span>
      </AnimatePresence>
    </motion.button>
  );
}
