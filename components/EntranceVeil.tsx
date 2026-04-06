"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Phase =
  | "connecting"
  | "authenticating"
  | "tuning"
  | "ready"
  | "lines"
  | "done"
  | "hidden";

const CONNECT_STEPS = [
  { text: "Connecting to the altar…",     duration: 900  },
  { text: "Authenticating your presence…", duration: 1100 },
  { text: "Tuning to sacred frequencies…", duration: 900  },
  { text: "The altar is ready.",           duration: 800  },
];

const LINES = [
  "You found this place.",
  "That means something.",
  "Welcome.",
];

export default function EntranceVeil() {
  const [phase, setPhase] = useState<Phase>("connecting");
  const [stepIndex, setStepIndex] = useState(0);
  const [lineIndex, setLineIndex] = useState(-1);
  const [visible, setVisible] = useState(true);

  // Stable star positions — computed once
  const stars = useMemo(() =>
    Array.from({ length: 50 }, (_, i) => ({
      id: i,
      w: Math.random() * 2 + 0.5,
      left: Math.random() * 100,
      top: Math.random() * 100,
      dur: 2 + Math.random() * 3,
      delay: Math.random() * 2,
    })), []);

  useEffect(() => {
    // Skip on return visits
    if (sessionStorage.getItem("altar-entered")) {
      setVisible(false);
      return;
    }

    let elapsed = 0;
    const timers: ReturnType<typeof setTimeout>[] = [];

    // Step through connection messages
    CONNECT_STEPS.forEach((step, i) => {
      timers.push(setTimeout(() => setStepIndex(i), elapsed));
      elapsed += step.duration;
    });

    // Transition to lines phase
    timers.push(setTimeout(() => setPhase("lines"), elapsed));
    elapsed += 400;

    // Show lines one by one
    LINES.forEach((_, i) => {
      timers.push(setTimeout(() => setLineIndex(i), elapsed + i * 1300));
    });
    elapsed += LINES.length * 1300 + 600;

    // Fade out
    timers.push(setTimeout(() => setPhase("done"), elapsed));
    timers.push(setTimeout(() => {
      setVisible(false);
      sessionStorage.setItem("altar-entered", "1");
    }, elapsed + 1400));

    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.6, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden"
          style={{ background: "radial-gradient(ellipse at center, #1a0f2e 0%, #0a0612 60%, #000 100%)" }}
        >
          {/* Stars */}
          {stars.map((s) => (
            <motion.div
              key={s.id}
              className="absolute rounded-full bg-white pointer-events-none"
              style={{ width: s.w, height: s.w, left: `${s.left}%`, top: `${s.top}%` }}
              animate={{ opacity: [0.1, 0.7, 0.1] }}
              transition={{ duration: s.dur, repeat: Infinity, delay: s.delay }}
            />
          ))}

          {/* Sacred circle rings */}
          {[120, 200, 300].map((size, i) => (
            <motion.div
              key={size}
              className="absolute rounded-full border border-white/10 pointer-events-none"
              style={{ width: size, height: size }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 0.15, scale: 1 }}
              transition={{ duration: 1.2, delay: i * 0.2 }}
            />
          ))}

          {/* Connection phase */}
          <AnimatePresence mode="wait">
            {phase === "connecting" && (
              <motion.div
                key="connecting"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -20, filter: "blur(8px)" }}
                transition={{ duration: 0.5 }}
                className="relative z-10 flex flex-col items-center gap-8"
              >
                {/* Pulsing orb */}
                <div className="relative w-16 h-16 flex items-center justify-center">
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{ background: "radial-gradient(circle, #c4b5fd, #7c3aed, transparent)" }}
                    animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.8, 0.4] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <motion.div
                    className="absolute inset-2 rounded-full border border-purple-400/40"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  />
                  <span className="relative z-10 text-xl">✦</span>
                </div>

                {/* Step text */}
                <div className="flex flex-col items-center gap-3">
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={stepIndex}
                      initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
                      transition={{ duration: 0.4 }}
                      className="text-sm text-white/60 tracking-widest font-light"
                    >
                      {CONNECT_STEPS[stepIndex].text}
                    </motion.p>
                  </AnimatePresence>

                  {/* Progress dots */}
                  <div className="flex gap-2">
                    {CONNECT_STEPS.map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-1 h-1 rounded-full"
                        animate={{ backgroundColor: i <= stepIndex ? "#c4b5fd" : "#ffffff22" }}
                        transition={{ duration: 0.3 }}
                      />
                    ))}
                  </div>

                  {/* Typing indicator */}
                  <div className="flex gap-1 mt-1">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-1 h-1 rounded-full bg-white/30"
                        animate={{ opacity: [0.2, 1, 0.2], y: [0, -3, 0] }}
                        transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Sacred lines phase */}
            {phase === "lines" && (
              <motion.div
                key="lines"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="relative z-10 flex flex-col items-center gap-5 text-center px-8"
              >
                {LINES.map((line, i) => (
                  <AnimatePresence key={i}>
                    {lineIndex >= i && (
                      <motion.p
                        initial={{ opacity: 0, y: 16, filter: "blur(10px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className={[
                          "font-light tracking-[0.15em]",
                          i === 2 ? "text-3xl text-white/90 mt-2" : "text-lg text-white/55",
                        ].join(" ")}
                      >
                        {line}
                      </motion.p>
                    )}
                  </AnimatePresence>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Skip button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.25 }}
            transition={{ delay: 2.5 }}
            onClick={() => { setVisible(false); sessionStorage.setItem("altar-entered", "1"); }}
            className="absolute bottom-8 text-[10px] tracking-[0.3em] uppercase text-white/40 hover:text-white/70 transition-colors"
          >
            Enter now
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
