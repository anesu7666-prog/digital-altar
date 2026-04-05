"use client";

import { useCallback, useRef, useState } from "react";
import { motion } from "framer-motion";

export default function SoundToggle() {
  const [on, setOn] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const nodesRef = useRef<{ source: AudioBufferSourceNode; gain: GainNode } | null>(null);

  const buildNoise = useCallback((ctx: AudioContext) => {
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    const source = ctx.createBufferSource();
    source.buffer = buffer; source.loop = true;
    const bandpass = ctx.createBiquadFilter();
    bandpass.type = "bandpass"; bandpass.frequency.value = 800; bandpass.Q.value = 0.5;
    const lowpass = ctx.createBiquadFilter();
    lowpass.type = "lowpass"; lowpass.frequency.value = 1200;
    const gain = ctx.createGain(); gain.gain.value = 0;
    source.connect(bandpass); bandpass.connect(lowpass); lowpass.connect(gain); gain.connect(ctx.destination);
    source.start();
    return { source, gain };
  }, []);

  function toggle() {
    if (!on) {
      const ctx = new AudioContext(); ctxRef.current = ctx;
      const nodes = buildNoise(ctx); nodesRef.current = nodes;
      nodes.gain.gain.setTargetAtTime(0.08, ctx.currentTime, 0.5);
      setOn(true);
    } else {
      const ctx = ctxRef.current!; const nodes = nodesRef.current!;
      nodes.gain.gain.setTargetAtTime(0, ctx.currentTime, 0.4);
      setTimeout(() => { nodes.source.stop(); ctx.close(); ctxRef.current = null; nodesRef.current = null; }, 1500);
      setOn(false);
    }
  }

  return (
    <motion.button onClick={toggle} whileTap={{ scale: 0.92 }}
      className="fixed top-4 right-4 z-40 w-10 h-10 rounded-full border border-white/25 bg-white/15 backdrop-blur-xl flex items-center justify-center text-lg shadow-sm hover:bg-white/30 transition-all"
      aria-label={on ? "Mute" : "Play ambient sound"}
    >
      {on ? "🔥" : "🔇"}
    </motion.button>
  );
}
