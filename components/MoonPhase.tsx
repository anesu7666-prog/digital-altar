"use client";

import { useEffect, useState } from "react";

interface MoonData { emoji: string; name: string; reflection: string; illumination: number; }

function getMoonPhase(): MoonData {
  const known = new Date("2000-01-06T18:14:00Z").getTime();
  const synodicMonth = 29.53058867 * 24 * 60 * 60 * 1000;
  const fraction = ((Date.now() - known) % synodicMonth) / synodicMonth;
  const illumination = Math.round(50 * (1 - Math.cos(2 * Math.PI * fraction)));
  const phases = [
    { max: 0.033, emoji: "🌑", name: "New Moon",        reflection: "A time for new beginnings. Set your intentions." },
    { max: 0.133, emoji: "🌒", name: "Waxing Crescent", reflection: "Seeds are planted. Nurture what you wish to grow." },
    { max: 0.233, emoji: "🌓", name: "First Quarter",   reflection: "Take action. Push through resistance." },
    { max: 0.383, emoji: "🌔", name: "Waxing Gibbous",  reflection: "Refine and adjust. You are almost there." },
    { max: 0.533, emoji: "🌕", name: "Full Moon",       reflection: "Illuminate what is hidden. Release and celebrate." },
    { max: 0.633, emoji: "🌖", name: "Waning Gibbous",  reflection: "Share your wisdom. Give gratitude." },
    { max: 0.733, emoji: "🌗", name: "Last Quarter",    reflection: "Let go of what no longer serves you." },
    { max: 0.883, emoji: "🌘", name: "Waning Crescent", reflection: "Rest. Surrender. Prepare for renewal." },
    { max: 1.0,   emoji: "🌑", name: "New Moon",        reflection: "A time for new beginnings. Set your intentions." },
  ];
  const p = phases.find((p) => fraction <= p.max) ?? phases[0];
  return { ...p, illumination };
}

export default function MoonPhase() {
  const [moon, setMoon] = useState<MoonData | null>(null);
  useEffect(() => { setMoon(getMoonPhase()); }, []);
  if (!moon) return null;
  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <span className="text-5xl" role="img" aria-label={moon.name}>{moon.emoji}</span>
      <div>
        <p className="text-sm font-semibold text-stone-700 tracking-wide">{moon.name}</p>
        <p className="text-xs text-stone-400 mt-0.5">{moon.illumination}% illuminated</p>
      </div>
      <p className="text-sm text-stone-500 italic max-w-xs leading-relaxed">&ldquo;{moon.reflection}&rdquo;</p>
    </div>
  );
}
