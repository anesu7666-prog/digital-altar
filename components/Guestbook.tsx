"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";

interface FeedbackRow {
  id: number;
  name: string;
  message: string;
  created_at: string;
}

const MOODS = ["🌸", "🌊", "🔥", "🌙", "💧", "🌿", "✨", "🕊️"];

export default function Guestbook() {
  const [entries, setEntries] = useState<FeedbackRow[]>([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [mood, setMood] = useState(MOODS[0]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const feedRef = useRef<HTMLDivElement>(null);

  // ── Load initial entries ──────────────────────────────────────────────────
  useEffect(() => {
    supabase
      .from("feedback")
      .select("id, name, message, created_at")
      .order("created_at", { ascending: false })
      .limit(20)
      .then(({ data }) => {
        if (data) setEntries(data as FeedbackRow[]);
      });

    // Realtime: prepend new entries as they arrive
    const channel = supabase
      .channel("feedback:live")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "feedback" },
        (payload) => {
          setEntries((prev) => [payload.new as FeedbackRow, ...prev]);
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  // ── Submit ────────────────────────────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimName = name.trim() || "Anonymous";
    const trimMsg = message.trim();
    if (!trimMsg) return;

    setSubmitting(true);
    await supabase.from("feedback").insert({
      name: `${mood} ${trimName}`,
      message: trimMsg,
    });
    setSubmitting(false);
    setSubmitted(true);
    setName("");
    setMessage("");
    setTimeout(() => setSubmitted(false), 3000);
  }

  function timeAgo(iso: string) {
    const diff = Date.now() - new Date(iso).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1) return "just now";
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-lg font-semibold text-stone-700 tracking-wide">
          How is your heart?
        </h2>
        <p className="text-sm text-stone-500 mt-1">
          Leave a word. Someone will feel it.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        {/* Mood picker */}
        <div className="flex gap-2 flex-wrap">
          {MOODS.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMood(m)}
              className={[
                "w-9 h-9 rounded-full text-lg transition-all",
                mood === m
                  ? "bg-white/40 shadow-inner scale-110 border border-white/40"
                  : "bg-white/10 hover:bg-white/25",
              ].join(" ")}
            >
              {m}
            </button>
          ))}
        </div>

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name (optional)"
          maxLength={40}
          className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm text-stone-600 placeholder:text-stone-400 focus:outline-none focus:border-white/40 backdrop-blur-sm transition-colors"
        />

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Share what's in your heart…"
          maxLength={280}
          rows={3}
          className="w-full resize-none rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm text-stone-600 placeholder:text-stone-400 focus:outline-none focus:border-white/40 backdrop-blur-sm transition-colors"
        />

        <div className="flex items-center justify-between">
          <span className="text-xs text-stone-400">{message.length}/280</span>
          <motion.button
            type="submit"
            disabled={!message.trim() || submitting}
            whileTap={{ scale: 0.97 }}
            className="px-5 py-2 rounded-full text-sm font-medium tracking-wide border border-white/25 bg-white/20 backdrop-blur-sm text-stone-600 hover:bg-white/35 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            {submitting ? "Sending…" : submitted ? "Received ✦" : "Offer"}
          </motion.button>
        </div>
      </form>

      {/* Live feed */}
      {entries.length > 0 && (
        <div
          ref={feedRef}
          className="flex flex-col gap-2 max-h-56 overflow-y-auto pr-1 scrollbar-thin"
        >
          <AnimatePresence initial={false}>
            {entries.map((e) => (
              <motion.div
                key={e.id}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
                className="rounded-xl border border-white/15 bg-white/10 px-4 py-3"
              >
                <div className="flex items-baseline justify-between gap-2 mb-1">
                  <span className="text-xs font-semibold text-stone-600 truncate">
                    {e.name}
                  </span>
                  <span className="text-[10px] text-stone-400 shrink-0">
                    {timeAgo(e.created_at)}
                  </span>
                </div>
                <p className="text-sm text-stone-500 leading-relaxed">{e.message}</p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
