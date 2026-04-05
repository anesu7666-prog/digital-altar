"use client";
import { motion } from "framer-motion";
export default function LivingTitle({ text }: { text: string }) {
  return (
    <span className="inline-flex flex-wrap justify-center" aria-label={text}>
      {text.split("").map((char, i) => (
        <motion.span key={i} animate={{ y: [0, -3, 0, 2, 0], opacity: [1, 0.85, 1, 0.9, 1] }}
          transition={{ duration: 4 + i * 0.15, repeat: Infinity, ease: "easeInOut", delay: i * 0.12 }}
          className="inline-block" style={{ whiteSpace: char === " " ? "pre" : "normal" }}
        >{char}</motion.span>
      ))}
    </span>
  );
}
