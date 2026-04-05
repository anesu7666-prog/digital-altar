"use client";

import { useEffect, useState } from "react";

function getGreeting(hour: number): { text: string; sub: string } {
  if (hour >= 5 && hour < 9)   return { text: "Good morning.",  sub: "The altar is quiet. The day is new." };
  if (hour >= 9 && hour < 12)  return { text: "Good morning.",  sub: "May this hour bring you clarity." };
  if (hour >= 12 && hour < 17) return { text: "Good afternoon.", sub: "Pause. Breathe. You are here." };
  if (hour >= 17 && hour < 20) return { text: "Good evening.",  sub: "The day is softening. So can you." };
  if (hour >= 20 && hour < 23) return { text: "Good evening.",  sub: "Rest is coming. You have done enough." };
  return { text: "It is late.", sub: "Someone is always awake here. You are not alone." };
}

export default function TimeGreeting() {
  const [greeting, setGreeting] = useState<{ text: string; sub: string } | null>(null);
  useEffect(() => { setGreeting(getGreeting(new Date().getHours())); }, []);
  if (!greeting) return null;
  return (
    <div className="text-center">
      <p className="text-2xl font-semibold text-stone-700 tracking-tight">{greeting.text}</p>
      <p className="text-sm text-stone-500 mt-1 italic">{greeting.sub}</p>
    </div>
  );
}
