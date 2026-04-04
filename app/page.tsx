<<<<<<< HEAD
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
=======
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            To get started, edit the page.tsx file.
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Looking for a starting point or more instructions? Head over to{" "}
            <a
              href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className="font-medium text-zinc-950 dark:text-zinc-50"
            >
              Templates
            </a>{" "}
            or the{" "}
            <a
              href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className="font-medium text-zinc-950 dark:text-zinc-50"
            >
              Learning
            </a>{" "}
            center.
          </p>
        </div>
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <a
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={16}
              height={16}
            />
            Deploy Now
          </a>
          <a
            className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </a>
        </div>
      </main>
    </div>
>>>>>>> a9c1eea (Initial commit from Create Next App)
  );
}
