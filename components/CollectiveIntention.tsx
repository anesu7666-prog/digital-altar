"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";

const INTENTIONS=["Peace for every soul in pain right now.","Healing for those who cannot ask for it.","Courage for those standing at a threshold.","Rest for the exhausted.","Hope for those who have almost given up.","Love for those who feel invisible.","Clarity for those lost in the dark.","Strength for those carrying too much."];
function getTodayIntention(){return INTENTIONS[Math.floor(Date.now()/86400000)%INTENTIONS.length];}

export default function CollectiveIntention(){
  const[active,setActive]=useState(false);
  const[seconds,setSeconds]=useState(60);
  const[holding,setHolding]=useState(0);
  const[done,setDone]=useState(false);
  const intention=getTodayIntention();

  useEffect(()=>{
    if(!active)return;
    const ch=supabase.channel("intention:presence",{config:{presence:{key:crypto.randomUUID()}}});
    ch.on("presence",{event:"sync"},()=>{setHolding(Object.keys(ch.presenceState()).length);})
      .subscribe(async(s)=>{if(s==="SUBSCRIBED")await ch.track({at:Date.now()});});
    const timer=setInterval(()=>{
      setSeconds((s)=>{if(s<=1){clearInterval(timer);setDone(true);setActive(false);supabase.removeChannel(ch);return 0;}return s-1;});
    },1000);
    return()=>{clearInterval(timer);supabase.removeChannel(ch);};
  },[active]);

  function begin(){setSeconds(60);setDone(false);setActive(true);}

  return(
    <div className="flex flex-col gap-5 text-center">
      <div>
        <h2 className="text-lg font-semibold text-stone-700 tracking-wide">Collective Intention</h2>
        <p className="text-sm text-stone-500 mt-1">Once a day. 60 seconds. Together.</p>
      </div>
      <div className="rounded-2xl border border-white/20 bg-white/8 p-5">
        <p className="text-[10px] tracking-[0.3em] uppercase text-stone-400 mb-3">Today&apos;s intention</p>
        <p className="text-base font-light text-stone-700 italic leading-relaxed">&ldquo;{intention}&rdquo;</p>
      </div>
      <AnimatePresence mode="wait">
        {done?(
          <motion.div key="done" initial={{opacity:0}} animate={{opacity:1}} className="flex flex-col gap-2">
            <p className="text-2xl">✦</p>
            <p className="text-sm text-stone-600 font-medium">60 seconds of collective light.</p>
            <p className="text-xs text-stone-400">Thank you for holding this with others.</p>
          </motion.div>
        ):active?(
          <motion.div key="active" initial={{opacity:0}} animate={{opacity:1}} className="flex flex-col items-center gap-3">
            <motion.div animate={{scale:[1,1.08,1],opacity:[0.6,1,0.6]}} transition={{duration:2,repeat:Infinity}}
              className="w-24 h-24 rounded-full border-2 border-stone-300/40 flex items-center justify-center"
              style={{background:"radial-gradient(circle, rgba(167,139,250,0.15), transparent)"}}
            >
              <span className="text-3xl font-light text-stone-600">{seconds}</span>
            </motion.div>
            {holding>1&&<p className="text-xs text-stone-400 italic">{holding} people are holding this with you right now.</p>}
          </motion.div>
        ):(
          <motion.button key="start" onClick={begin} whileTap={{scale:0.96}}
            className="self-center px-6 py-2.5 rounded-full border border-white/25 bg-white/20 text-sm font-medium text-stone-600 hover:bg-white/35 transition-all"
          >Hold this intention</motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
