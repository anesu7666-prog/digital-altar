"use client";

import { useEffect, useState } from "react";

const INTENTIONS = [
  "Let go of one thing that no longer serves you.",
  "Be gentle with yourself today.",
  "Notice three things you are grateful for.",
  "Breathe before you react.",
  "You are enough, exactly as you are.",
  "Rest is not laziness — it is sacred.",
  "Speak kindly to yourself today.",
  "One small act of love changes everything.",
  "You do not have to carry it all alone.",
  "Today, choose presence over perfection.",
  "Your feelings are valid. All of them.",
  "Forgive yourself for yesterday.",
  "Something beautiful is still possible.",
  "Slow down. The world can wait.",
  "You are allowed to take up space.",
  "Trust the process, even when it is unclear.",
  "Grief and joy can exist at the same time.",
  "You have survived every hard day so far.",
  "Let today be softer than yesterday.",
  "Your story is not over.",
  "Ask for help. It is a form of courage.",
  "Celebrate the small victories.",
  "You are worthy of the love you give others.",
  "Sit with the silence. It has something to say.",
  "Plant seeds of kindness wherever you go.",
  "It is okay to not be okay.",
  "Choose one thing to release today.",
  "Your presence is a gift to this world.",
  "Healing is not linear. Be patient.",
  "Today, do one thing that brings you joy.",
  "You are more resilient than you know.",
];

export default function DailyIntention() {
  const [intention, setIntention] = useState("");
  const [date, setDate] = useState("");
  useEffect(() => {
    const now = new Date();
    const day = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000);
    setIntention(INTENTIONS[day % INTENTIONS.length]);
    setDate(now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }));
  }, []);
  if (!intention) return null;
  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <p className="text-[10px] tracking-[0.25em] uppercase text-stone-400">{date}</p>
      <p className="text-[11px] tracking-widest uppercase text-stone-400">Today&apos;s Intention</p>
      <p className="text-base font-medium text-stone-700 leading-relaxed max-w-xs italic">&ldquo;{intention}&rdquo;</p>
    </div>
  );
}
