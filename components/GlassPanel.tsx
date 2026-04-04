"use client";

import { motion } from "framer-motion";

interface GlassPanelProps {
  children?: React.ReactNode;
  className?: string;
}

export default function GlassPanel({ children, className = "" }: GlassPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={[
        "rounded-3xl",
        "border border-white/25",
        "bg-white/15",
        "backdrop-blur-2xl",
        "shadow-[0_8px_40px_rgba(0,0,0,0.10)]",
        "p-8",
        className,
      ].join(" ")}
    >
      {children}
    </motion.div>
  );
}
