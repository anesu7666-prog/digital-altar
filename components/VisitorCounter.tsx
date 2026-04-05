"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function VisitorCounter() {
  const [thoughts, setThoughts] = useState<number | null>(null);
  const [flames, setFlames] = useState<number | null>(null);
  const [hearts, setHearts] = useState<number | null>(null);

  useEffect(() => {
    async function load() {
      const [t, c, f] = await Promise.all([
        supabase.from("thoughts").select("id", { count: "exact", head: true }),
        supabase.from("candles").select("id", { count: "exact", head: true }).eq("lit", true),
        supabase.from("feedback").select("id", { count: "exact", head: true }),
      ]);
      setThoughts(t.count ?? 0); setFlames(c.count ?? 0); setHearts(f.count ?? 0);
    }
    load();
    const ch = supabase.channel("counter:candles")
      .on("postgres_changes", { event: "*", schema: "public", table: "candles" }, load)
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  const stats = [
    { label: "thoughts released", value: thoughts, icon: "🌀" },
    { label: "candles lit", value: flames, icon: "🕯️" },
    { label: "hearts shared", value: hearts, icon: "🤍" },
  ];

  return (
    <div className="flex items-center justify-center gap-6 flex-wrap">
      {stats.map((s) => (
        <div key={s.label} className="flex flex-col items-center gap-0.5">
          <span className="text-lg">{s.icon}</span>
          <span className="text-lg font-semibold text-stone-700">{s.value === null ? "—" : s.value.toLocaleString()}</span>
          <span className="text-[10px] tracking-widest uppercase text-stone-400">{s.label}</span>
        </div>
      ))}
    </div>
  );
}
