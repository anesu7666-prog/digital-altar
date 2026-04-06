"use client";
import { useEffect, useState } from "react";

interface Props { text: string; className?: string; delay?: number; speed?: number; }

export default function WhisperText({ text, className = "", delay = 0, speed = 55 }: Props) {
  const [displayed, setDisplayed] = useState("");
  const [cursor, setCursor] = useState(true);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    const start = setTimeout(() => {
      const interval = setInterval(() => {
        i++; setDisplayed(text.slice(0, i));
        if (i >= text.length) { clearInterval(interval); setDone(true); }
      }, speed);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(start);
  }, [text, delay, speed]);

  useEffect(() => {
    if (done) { setTimeout(() => setCursor(false), 800); return; }
    const t = setInterval(() => setCursor((v) => !v), 530);
    return () => clearInterval(t);
  }, [done]);

  return (
    <span className={className}>
      {displayed}
      {!done && <span className="inline-block w-[2px] h-[1em] bg-current align-middle ml-[1px] transition-opacity duration-100" style={{ opacity: cursor ? 1 : 0 }} />}
    </span>
  );
}
