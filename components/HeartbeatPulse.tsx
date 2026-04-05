"use client";
import { motion } from "framer-motion";
export default function HeartbeatPulse({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div className={className} animate={{ scale: [1, 1.008, 1, 1.004, 1] }} transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 3.8, ease: "easeInOut" }}>
      {children}
    </motion.div>
  );
}
