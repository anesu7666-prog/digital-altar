"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";

const TheArchive         = dynamic(() => import("./TheArchive"),         { ssr: false });
const WallOfNames        = dynamic(() => import("./WallOfNames"),        { ssr: false });
const ConstellationMap   = dynamic(() => import("./ConstellationMap"),   { ssr: false });
const DonationTransparency = dynamic(() => import("./DonationTransparency"), { ssr: false });

export default function Footer() {
  const [copied, setCopied] = useState(false);

  function share() {
    const url = window.location.href;
    if (navigator.share) { navigator.share({ title: "Digital Altar", text: "A quiet space for reflection.", url }); }
    else { navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 2500); }
  }

  return (
    <footer className="w-full flex flex-col items-center gap-8 py-12 px-4 text-center max-w-xl mx-auto">
      {/* About */}
      <div className="rounded-3xl border border-white/20 bg-white/10 backdrop-blur-xl p-6 w-full">
        <p className="text-xs tracking-widest uppercase text-stone-400 mb-3">About this space</p>
        <p className="text-sm text-stone-500 leading-relaxed">
          Digital Altar was built as a free, sacred space for anyone who needs a moment of stillness.
          Light a candle for someone you love, release what weighs on you, or simply leave a word
          for the stranger who comes after you. You are not alone here.
        </p>
        <p className="text-xs text-stone-400 mt-3">
          Created with love by <span className="text-stone-600 font-medium">Anesu Emmanuel</span>
        </p>
      </div>

      {/* Sacred links */}
      <div className="flex flex-wrap items-center justify-center gap-6">
        <TheArchive />
        <WallOfNames />
        <ConstellationMap />
      </div>

      {/* Donation transparency */}
      <div className="w-full rounded-2xl border border-white/15 bg-white/8 p-4">
        <DonationTransparency />
      </div>

      {/* Share */}
      <div className="flex flex-col items-center gap-2">
        <p className="text-xs text-stone-400 tracking-wide">Know someone who needs this?</p>
        <motion.button onClick={share} whileTap={{ scale: 0.96 }}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-white/25 bg-white/15 backdrop-blur-sm text-sm font-medium text-stone-600 hover:bg-white/30 transition-all"
        >
          <span>🔗</span>
          <AnimatePresence mode="wait">
            <motion.span key={copied ? "c" : "s"} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.2 }}>
              {copied ? "Link copied ✦" : "Send this altar to someone"}
            </motion.span>
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Offering */}
      <div className="flex flex-col items-center gap-2">
        <p className="text-xs text-stone-400 tracking-widest uppercase">This altar is free, always.</p>
        <a href="https://www.paypal.me/AnesuEmmanuel44" target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-white/25 bg-white/15 backdrop-blur-sm text-sm font-medium text-stone-600 hover:bg-white/30 transition-all"
        >
          <span>🕯️</span><span>Leave an Offering</span>
        </a>
      </div>

      <p className="text-[10px] text-stone-400">Digital Altar · A non-profit space for reflection</p>
    </footer>
  );
}
