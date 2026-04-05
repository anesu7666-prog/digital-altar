"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";

function ringBowl(ctx: AudioContext) {
  const freqs=[220,440,660,880,1320],gains=[0.5,0.3,0.15,0.08,0.04];
  freqs.forEach((freq,i)=>{
    const osc=ctx.createOscillator(),gain=ctx.createGain(),now=ctx.currentTime;
    osc.type="sine";osc.frequency.setValueAtTime(freq,now);osc.frequency.linearRampToValueAtTime(freq*0.998,now+8);
    gain.gain.setValueAtTime(0,now);gain.gain.linearRampToValueAtTime(gains[i],now+0.02);gain.gain.exponentialRampToValueAtTime(0.001,now+8);
    osc.connect(gain);gain.connect(ctx.destination);osc.start();osc.stop(now+8.1);
  });
}

export default function PrayerBell() {
  const [ringing,setRinging]=useState(false);
  const [ripples,setRipples]=useState(0);
  const [lastRinger,setLastRinger]=useState<string|null>(null);
  const audioCtx=useRef<AudioContext|null>(null);
  const cooldown=useRef(false);

  useEffect(()=>{
    const ch=supabase.channel("prayer:bell")
      .on("broadcast",{event:"ring"},(payload)=>{setLastRinger(payload.payload?.name??"Someone");triggerRing();})
      .subscribe();
    return ()=>{supabase.removeChannel(ch);};
  },[]);

  function triggerRing(){
    if(ringing)return;
    setRinging(true);setRipples((r)=>r+1);
    if(!audioCtx.current)audioCtx.current=new AudioContext();
    ringBowl(audioCtx.current);
    setTimeout(()=>setRinging(false),8000);
  }

  async function strike(){
    if(cooldown.current||ringing)return;
    cooldown.current=true;setTimeout(()=>{cooldown.current=false;},10000);
    triggerRing();
    await supabase.channel("prayer:bell").send({type:"broadcast",event:"ring",payload:{name:"A visitor"}});
  }

  return (
    <div className="flex flex-col items-center gap-5">
      <div>
        <h2 className="text-lg font-semibold text-stone-700 tracking-wide text-center">Prayer Bell</h2>
        <p className="text-sm text-stone-500 text-center mt-1">Strike the bowl. Everyone here will hear it.</p>
      </div>
      <div className="relative flex items-center justify-center w-32 h-32">
        {ringing&&Array.from({length:4}).map((_,i)=>(
          <motion.div key={`${ripples}-${i}`} className="absolute rounded-full border border-amber-300/40"
            initial={{width:48,height:48,opacity:0.8}} animate={{width:160,height:160,opacity:0}} transition={{duration:3,delay:i*0.7,ease:"easeOut"}}
          />
        ))}
        <motion.button onClick={strike} whileTap={{scale:0.94}} animate={ringing?{scale:[1,1.04,1]}:{}} transition={{duration:0.3}}
          className="relative z-10 w-16 h-10 cursor-pointer focus:outline-none" aria-label="Strike the prayer bell"
          style={{background:"linear-gradient(to bottom, #d4a843, #b8860b, #8b6914)",borderRadius:"0 0 50% 50% / 0 0 100% 100%",boxShadow:ringing?"0 0 30px 10px rgba(212,168,67,0.5), 0 4px 12px rgba(0,0,0,0.3)":"0 4px 12px rgba(0,0,0,0.2)",transition:"box-shadow 0.5s ease"}}
        >
          <div className="absolute top-1 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full opacity-40" style={{background:"linear-gradient(to right, transparent, #fde68a, transparent)"}}/>
        </motion.button>
        <div className="absolute bottom-0 w-20 h-2 rounded-full bg-stone-300/40"/>
      </div>
      <AnimatePresence>
        {ringing&&lastRinger&&(
          <motion.p initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0}} transition={{duration:0.5}} className="text-xs text-stone-400 italic text-center">
            {lastRinger} struck the bell. Listen.
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
