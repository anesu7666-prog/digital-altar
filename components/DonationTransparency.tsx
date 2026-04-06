"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";

const MONTHLY_GOAL = 15;

export default function DonationTransparency() {
  const [total, setTotal] = useState<number | null>(null);

  useEffect(() => {
    supabase.from("donations").select("amount")
      .then(({ data }) => { if (data) setTotal(data.reduce((acc, r) => acc + (r.amount ?? 0), 0)); });
  }, []);

  if (total === null) return null;
  const pct = Math.min(100, (total / MONTHLY_GOAL) * 100);
  const covered = total >= MONTHLY_GOAL;

  return (
    <div className="flex flex-col gap-3">
      <p className="text-[10px] tracking-[0.3em] uppercase text-stone-400 text-center">Transparency</p>
      <div className="flex flex-col gap-2">
        <div className="flex justify-between text-xs text-stone-400">
          <span>${total.toFixed(2)} donated this month</span>
          <span>${MONTHLY_GOAL} monthly hosting</span>
        </div>
        <div className="h-1.5 rounded-full bg-white/20 overflow-hidden">
          <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1.2, ease: "easeOut" }}
            className="h-full rounded-full" style={{ background: covered ? "linear-gradient(to right, #86efac, #34d399)" : "linear-gradient(to right, #fde68a, #f97316)" }}
          />
        </div>
        <p className="text-[10px] text-stone-400 text-center">
          {covered ? "✦ Hosting covered this month. Thank you." : `$${(MONTHLY_GOAL - total).toFixed(2)} still needed to keep the altar lit.`}
        </p>
      </div>
    </div>
  );
}
