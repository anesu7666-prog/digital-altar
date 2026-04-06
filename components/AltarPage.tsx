"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import GlassPanel from "@/components/GlassPanel";
import EntranceVeil   from "@/components/EntranceVeil";
import LivingTitle    from "@/components/LivingTitle";
import HeartbeatPulse from "@/components/HeartbeatPulse";
import TimeGreeting   from "@/components/TimeGreeting";
import DailyIntention from "@/components/DailyIntention";
import MoonPhase      from "@/components/MoonPhase";
import RoomToggle     from "@/components/RoomToggle";

const FloatingParticles   = dynamic(() => import("@/components/FloatingParticles"),   { ssr: false });
const CursorTrail         = dynamic(() => import("@/components/CursorTrail"),         { ssr: false });
const RippleBackground    = dynamic(() => import("@/components/RippleBackground"),    { ssr: false });
const SacredGeometry      = dynamic(() => import("@/components/SacredGeometry"),      { ssr: false });
const SacredTextRain      = dynamic(() => import("@/components/SacredTextRain"),      { ssr: false });
const GlassBirdRoom       = dynamic(() => import("@/components/GlassBirdRoom"),       { ssr: false });
const AuroraRoom          = dynamic(() => import("@/components/AuroraRoom"),          { ssr: false });
const DarkRoomFire        = dynamic(() => import("@/components/DarkRoomFire"),        { ssr: false });
const PersonalisedSky     = dynamic(() => import("@/components/PersonalisedSky"),     { ssr: false });
const SoundToggle         = dynamic(() => import("@/components/SoundToggle"),         { ssr: false });
const TextControls        = dynamic(() => import("@/components/TextControls"),        { ssr: false });
const SilenceMode         = dynamic(() => import("@/components/SilenceMode"),         { ssr: false });
const AccessibilityMode   = dynamic(() => import("@/components/AccessibilityMode"),   { ssr: false });
const AltarWhisper        = dynamic(() => import("@/components/AltarWhisper"),        { ssr: false });
const ReturnVisitor       = dynamic(() => import("@/components/ReturnVisitor"),       { ssr: false });
const SacredHours         = dynamic(() => import("@/components/SacredHours"),         { ssr: false });
const LivePresence        = dynamic(() => import("@/components/LivePresence"),        { ssr: false });
const ChoirOfVoices       = dynamic(() => import("@/components/ChoirOfVoices"),       { ssr: false });
const SacredPortal        = dynamic(() => import("@/components/SacredPortal"),        { ssr: false });
const VisitorCounter      = dynamic(() => import("@/components/VisitorCounter"),      { ssr: false });
const CandleVigil         = dynamic(() => import("@/components/CandleVigil"),         { ssr: false });
const CollectiveIntention = dynamic(() => import("@/components/CollectiveIntention"), { ssr: false });
const Candle              = dynamic(() => import("@/components/Candle"),              { ssr: false });
const CandleWall          = dynamic(() => import("@/components/CandleWall"),          { ssr: false });
const PrayerBell          = dynamic(() => import("@/components/PrayerBell"),          { ssr: false });
const WishLantern         = dynamic(() => import("@/components/WishLantern"),         { ssr: false });
const SoundscapeBuilder   = dynamic(() => import("@/components/SoundscapeBuilder"),   { ssr: false });
const FrequencyHealing    = dynamic(() => import("@/components/FrequencyHealing"),    { ssr: false });
const BreathingGuide      = dynamic(() => import("@/components/BreathingGuide"),      { ssr: false });
const VoidBox             = dynamic(() => import("@/components/VoidBox"),             { ssr: false });
const HealingJournal      = dynamic(() => import("@/components/HealingJournal"),      { ssr: false });
const LetterToFuture      = dynamic(() => import("@/components/LetterToFuture"),      { ssr: false });
const GratitudeJar        = dynamic(() => import("@/components/GratitudeJar"),        { ssr: false });
const GriefCorner         = dynamic(() => import("@/components/GriefCorner"),         { ssr: false });
const MemoryCapsule       = dynamic(() => import("@/components/MemoryCapsule"),       { ssr: false });
const Guestbook           = dynamic(() => import("@/components/Guestbook"),           { ssr: false });
const AnsweredPrayers     = dynamic(() => import("@/components/AnsweredPrayers"),     { ssr: false });
const CreateAltarRoom     = dynamic(() => import("@/components/CreateAltarRoom"),     { ssr: false });
const Footer              = dynamic(() => import("@/components/Footer"),              { ssr: false });

function AmbientOrbs() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden>
      <div className="absolute -top-32 -left-32 w-[520px] h-[520px] rounded-full opacity-40 blur-3xl"
        style={{ background: "radial-gradient(circle, #fde68a, #fca5a5, transparent 70%)" }} />
      <div className="absolute -top-20 -right-20 w-[420px] h-[420px] rounded-full opacity-35 blur-3xl"
        style={{ background: "radial-gradient(circle, #c4b5fd, #93c5fd, transparent 70%)" }} />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full opacity-30 blur-3xl"
        style={{ background: "radial-gradient(circle, #a5f3fc, #d9f99d, transparent 70%)" }} />
    </div>
  );
}

function Divider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-4 w-full">
      <div className="flex-1 h-px bg-white/30" />
      <span className="text-[10px] tracking-[0.3em] uppercase text-stone-400 shrink-0">{label}</span>
      <div className="flex-1 h-px bg-white/30" />
    </div>
  );
}

export default function AltarPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#F0F0F2" }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 rounded-full border-2 border-stone-300 border-t-stone-600 animate-spin" />
          <p className="text-xs text-stone-400 tracking-widest uppercase">Loading altar…</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <EntranceVeil />
      <SacredHours />
      <ReturnVisitor />
      <PersonalisedSky />
      <AmbientOrbs />
      <SacredGeometry />
      <SacredTextRain />
      <FloatingParticles />
      <CursorTrail />
      <RippleBackground />
      <GlassBirdRoom />
      <AuroraRoom />
      <SoundToggle />
      <TextControls />
      <RoomToggle />
      <SilenceMode />
      <AccessibilityMode />
      <AltarWhisper />

      <main className="flex flex-col items-center gap-12 px-4 py-16 max-w-xl mx-auto w-full">
        <DarkRoomFire />
        <CandleVigil />

        <HeartbeatPulse className="text-center flex flex-col gap-3 pt-4">
          <p className="text-[11px] tracking-[0.4em] uppercase text-stone-400">Welcome</p>
          <h1 className="text-5xl font-light text-stone-700 tracking-tight leading-tight">
            <LivingTitle text="Digital Altar" />
          </h1>
          <TimeGreeting />
          <LivePresence />
          <ChoirOfVoices />
        </HeartbeatPulse>

        <SacredPortal />

        <GlassPanel className="w-full">
          <div className="flex flex-col gap-6">
            <DailyIntention />
            <div className="h-px bg-white/20" />
            <MoonPhase />
          </div>
        </GlassPanel>

        <GlassPanel className="w-full"><VisitorCounter /></GlassPanel>

        <Divider label="Collective Intention" />
        <GlassPanel className="w-full"><CollectiveIntention /></GlassPanel>

        <Divider label="Light a Candle" />
        <GlassPanel className="w-full candle-section">
          <p className="text-center text-xs text-stone-400 tracking-widest uppercase mb-6">
            Click to light · Prism to colour · Tap to dedicate
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

        <GlassPanel className="w-full"><CandleWall /></GlassPanel>

        <Divider label="Prayer Bell" />
        <GlassPanel className="w-full"><PrayerBell /></GlassPanel>

        <Divider label="Wish Lanterns" />
        <GlassPanel className="w-full"><WishLantern /></GlassPanel>

        <Divider label="Soundscape" />
        <GlassPanel className="w-full"><SoundscapeBuilder /></GlassPanel>

        <Divider label="Frequency Healing" />
        <GlassPanel className="w-full"><FrequencyHealing /></GlassPanel>

        <Divider label="Breathe" />
        <GlassPanel className="w-full"><BreathingGuide /></GlassPanel>

        <Divider label="The Void" />
        <GlassPanel className="w-full"><VoidBox /></GlassPanel>

        <Divider label="Healing Journal" />
        <GlassPanel className="w-full"><HealingJournal /></GlassPanel>

        <Divider label="Letter to the Future" />
        <GlassPanel className="w-full"><LetterToFuture /></GlassPanel>

        <Divider label="Gratitude" />
        <GlassPanel className="w-full"><GratitudeJar /></GlassPanel>

        <Divider label="Grief" />
        <GriefCorner />

        <Divider label="Memory Capsule" />
        <GlassPanel className="w-full"><MemoryCapsule /></GlassPanel>

        <Divider label="How is your heart?" />
        <GlassPanel className="w-full"><Guestbook /></GlassPanel>

        <Divider label="Prayer Chain" />
        <GlassPanel className="w-full"><AnsweredPrayers /></GlassPanel>

        <Divider label="Personal Altar Rooms" />
        <GlassPanel className="w-full"><CreateAltarRoom /></GlassPanel>
      </main>

      <Footer />
    </>
  );
}
