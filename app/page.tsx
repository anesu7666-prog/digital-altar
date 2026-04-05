import GlassPanel from "@/components/GlassPanel";
import Candle from "@/components/Candle";
import VoidBox from "@/components/VoidBox";
import Guestbook from "@/components/Guestbook";
import Footer from "@/components/Footer";
import FloatingParticles from "@/components/FloatingParticles";
import CursorTrail from "@/components/CursorTrail";
import SoundToggle from "@/components/SoundToggle";
import TextControls from "@/components/TextControls";
import VisitorCounter from "@/components/VisitorCounter";
import BreathingGuide from "@/components/BreathingGuide";
import MoonPhase from "@/components/MoonPhase";
import DailyIntention from "@/components/DailyIntention";
import WishLantern from "@/components/WishLantern";
import CandleWall from "@/components/CandleWall";
import GratitudeJar from "@/components/GratitudeJar";
import TimeGreeting from "@/components/TimeGreeting";
import RippleBackground from "@/components/RippleBackground";
import DarkRoomFire from "@/components/DarkRoomFire";
import GlassBirdRoom from "@/components/GlassBirdRoom";
import AuroraRoom from "@/components/AuroraRoom";
import RoomToggle from "@/components/RoomToggle";
import EntranceVeil from "@/components/EntranceVeil";
import SacredGeometry from "@/components/SacredGeometry";
import HeartbeatPulse from "@/components/HeartbeatPulse";
import LivingTitle from "@/components/LivingTitle";
import LivePresence from "@/components/LivePresence";
import SilenceMode from "@/components/SilenceMode";
import PrayerBell from "@/components/PrayerBell";
import GriefCorner from "@/components/GriefCorner";
import AltarWhisper from "@/components/AltarWhisper";
import SacredHours from "@/components/SacredHours";
import AnsweredPrayers from "@/components/AnsweredPrayers";
import PersonalisedSky from "@/components/PersonalisedSky";
import SoundscapeBuilder from "@/components/SoundscapeBuilder";
import FrequencyHealing from "@/components/FrequencyHealing";
import LetterToFuture from "@/components/LetterToFuture";
import ReturnVisitor from "@/components/ReturnVisitor";
import CollectiveIntention from "@/components/CollectiveIntention";
import CandleVigil from "@/components/CandleVigil";
import MemoryCapsule from "@/components/MemoryCapsule";
import SacredTextRain from "@/components/SacredTextRain";
import ChoirOfVoices from "@/components/ChoirOfVoices";
import HealingJournal from "@/components/HealingJournal";
import AccessibilityMode from "@/components/AccessibilityMode";
import SacredPortal from "@/components/SacredPortal";
import CreateAltarRoom from "@/components/CreateAltarRoom";

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

export default function Home() {
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

        <GlassPanel className="w-full">
          <VisitorCounter />
        </GlassPanel>

        <Divider label="Collective Intention" />
        <GlassPanel className="w-full">
          <CollectiveIntention />
        </GlassPanel>

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

        <GlassPanel className="w-full">
          <CandleWall />
        </GlassPanel>

        <Divider label="Prayer Bell" />
        <GlassPanel className="w-full">
          <PrayerBell />
        </GlassPanel>

        <Divider label="Wish Lanterns" />
        <GlassPanel className="w-full">
          <WishLantern />
        </GlassPanel>

        <Divider label="Soundscape" />
        <GlassPanel className="w-full">
          <SoundscapeBuilder />
        </GlassPanel>

        <Divider label="Frequency Healing" />
        <GlassPanel className="w-full">
          <FrequencyHealing />
        </GlassPanel>

        <Divider label="Breathe" />
        <GlassPanel className="w-full">
          <BreathingGuide />
        </GlassPanel>

        <Divider label="The Void" />
        <GlassPanel className="w-full">
          <VoidBox />
        </GlassPanel>

        <Divider label="Healing Journal" />
        <GlassPanel className="w-full">
          <HealingJournal />
        </GlassPanel>

        <Divider label="Letter to the Future" />
        <GlassPanel className="w-full">
          <LetterToFuture />
        </GlassPanel>

        <Divider label="Gratitude" />
        <GlassPanel className="w-full">
          <GratitudeJar />
        </GlassPanel>

        <Divider label="Grief" />
        <GriefCorner />

        <Divider label="Memory Capsule" />
        <GlassPanel className="w-full">
          <MemoryCapsule />
        </GlassPanel>

        <Divider label="How is your heart?" />
        <GlassPanel className="w-full">
          <Guestbook />
        </GlassPanel>

        <Divider label="Prayer Chain" />
        <GlassPanel className="w-full">
          <AnsweredPrayers />
        </GlassPanel>

        <Divider label="Personal Altar Rooms" />
        <GlassPanel className="w-full">
          <CreateAltarRoom />
        </GlassPanel>

      </main>

      <Footer />
    </>
  );
}
