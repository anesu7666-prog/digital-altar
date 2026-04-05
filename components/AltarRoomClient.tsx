"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import GlassPanel from "./GlassPanel";
import Candle from "./Candle";
import VoidBox from "./VoidBox";
import Guestbook from "./Guestbook";
import FloatingParticles from "./FloatingParticles";
import CursorTrail from "./CursorTrail";
import PersonalisedSky from "./PersonalisedSky";
import SacredGeometry from "./SacredGeometry";

interface RoomData{slug:string;name:string;description:string;created_at:string;}

export default function AltarRoomClient({slug}:{slug:string}){
  const[room,setRoom]=useState<RoomData|null>(null);
  const[loading,setLoading]=useState(true);
  const[copied,setCopied]=useState(false);
  const name=decodeURIComponent(slug).replace(/-/g," ");

  useEffect(()=>{
    supabase.from("altar_rooms").select("slug,name,description,created_at").eq("slug",slug).single()
      .then(({data})=>{setRoom(data as RoomData|null);setLoading(false);});
  },[slug]);

  function share(){navigator.clipboard.writeText(window.location.href);setCopied(true);setTimeout(()=>setCopied(false),2500);}

  if(loading)return(<div className="min-h-screen flex items-center justify-center"><p className="text-stone-400 text-sm italic animate-pulse">Opening the altar…</p></div>);

  return(
    <>
      <PersonalisedSky/>
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-[520px] h-[520px] rounded-full opacity-35 blur-3xl" style={{background:"radial-gradient(circle, #fde68a, #fca5a5, transparent 70%)"}}/>
        <div className="absolute -top-20 -right-20 w-[420px] h-[420px] rounded-full opacity-30 blur-3xl" style={{background:"radial-gradient(circle, #c4b5fd, #93c5fd, transparent 70%)"}}/>
      </div>
      <SacredGeometry/><FloatingParticles/><CursorTrail/>
      <main className="flex flex-col items-center gap-10 px-4 py-16 max-w-xl mx-auto w-full">
        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.8}} className="text-center flex flex-col gap-3">
          <p className="text-[10px] tracking-[0.4em] uppercase text-stone-400">A personal altar</p>
          <h1 className="text-4xl font-light text-stone-700 tracking-tight capitalize">{room?.name??name}</h1>
          {room?.description&&<p className="text-sm text-stone-500 italic max-w-xs mx-auto leading-relaxed">{room.description}</p>}
          <div className="flex items-center justify-center gap-3 mt-2">
            <a href="/" className="text-[10px] tracking-widest uppercase text-stone-400 hover:text-stone-600 transition-colors">← Main Altar</a>
            <span className="text-stone-300">·</span>
            <button onClick={share} className="text-[10px] tracking-widest uppercase text-stone-400 hover:text-stone-600 transition-colors">{copied?"Copied ✦":"Share this room"}</button>
          </div>
        </motion.div>
        <GlassPanel className="w-full">
          <p className="text-center text-xs text-stone-400 tracking-widest uppercase mb-6">Light a candle in this room</p>
          <div className="flex items-end justify-center gap-10">
            <Candle id={`${slug}-candle-1`}/><Candle id={`${slug}-candle-2`}/><Candle id={`${slug}-candle-3`}/>
          </div>
        </GlassPanel>
        <GlassPanel className="w-full"><VoidBox/></GlassPanel>
        <GlassPanel className="w-full"><Guestbook/></GlassPanel>
      </main>
    </>
  );
}
