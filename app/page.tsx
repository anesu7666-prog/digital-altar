import GlassPanel from "@/components/GlassPanel";
import Candle from "@/components/Candle";
import VoidBox from "@/components/VoidBox";
import Guestbook from "@/components/Guestbook";
import Footer from "@/components/Footer";

// ─── Ambient background blobs (pure CSS, no JS) ───────────────────────────────
function AmbientOrbs() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden>
      {/* top-left warm */}
      <div
        className="absolute -top-32 -left-32 w-[520px] h-[520px] rounded-full opacity-40 blur-3xl"
        style={{ background: "radial-gradient(circle, #fde68a, #fca5a5, transparent 70%)" }}
      />
      {/* top-right cool */}
      <div
        className="absolute -top-20 -right-20 w-[420px] h-[420px] rounded-full opacity-35 blur-3xl"
        style={{ background: "radial-gradient(circle, #c4b5fd, #93c5fd, transparent 70%)" }}
      />
      {/* bottom center */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full opacity-30 blur-3xl"
        style={{ background: "radial-gradient(circle, #a5f3fc, #d9f99d, transparent 70%)" }}
      />
    </div>
  );
}

// ─── Section label ─────────────────────────────────────────────────────────────
function SectionDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-4 w-full max-w-xl mx-auto px-4">
      <div className="flex-1 h-px bg-white/30" />
      <span className="text-[10px] tracking-[0.25em] uppercase text-stone-400">{label}</span>
      <div className="flex-1 h-px bg-white/30" />
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <>
      <AmbientOrbs />

      <main className="flex flex-col items-center gap-10 px-4 py-16 max-w-xl mx-auto w-full">

        {/* ── Hero ── */}
        <div className="text-center pt-4">
          <p className="text-[11px] tracking-[0.3em] uppercase text-stone-400 mb-3">
            Welcome
          </p>
          <h1 className="text-4xl font-semibold text-stone-700 tracking-tight leading-tight">
            Digital Altar
          </h1>
          <p className="mt-3 text-stone-500 text-sm leading-relaxed max-w-xs mx-auto">
            A quiet space to light a candle, release what weighs on you,
            and leave a word for those who come after.
          </p>
        </div>

        {/* ── Candles ── */}
        <SectionDivider label="Light a Candle" />

        <GlassPanel className="w-full">
          <p className="text-center text-xs text-stone-400 tracking-widest uppercase mb-6">
            Click to light · Prism to colour
          </p>
          <div className="flex items-end justify-center gap-10">
            <Candle id="candle-1" />
            <Candle id="candle-2" />
            <Candle id="candle-3" />
          </div>
          <p className="text-center text-[10px] text-stone-400 mt-6">
            Every flame is visible to all who visit.
          </p>
        </GlassPanel>

        {/* ── Void ── */}
        <SectionDivider label="The Void" />

        <GlassPanel className="w-full">
          <VoidBox />
        </GlassPanel>

        {/* ── Guestbook ── */}
        <SectionDivider label="Guestbook" />

        <GlassPanel className="w-full">
          <Guestbook />
        </GlassPanel>

      </main>

      <Footer />
    </>
  );
}
