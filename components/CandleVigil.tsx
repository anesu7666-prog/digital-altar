"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";

const VIGIL_PRAYERS=["For every soul carrying something too heavy to name.","For the ones who cried alone this week.","For those who almost didn't make it.","For the grieving, the lost, and the searching.","For peace in places where there is none."];
function isVigilTime(){const now=new Date();return now.getUTCDay()===5&&now.getUTCHours()===20&&now.getUTCMinutes()<30;}

export default function CandleVigil(){
  const[vigil,setVigil]=useState(false);
  const[prayer,setPrayer]=useState("");
  const[present,setPresent]=useState(1);

  useEffect(()=>{
    function check(){
      const on=isVigilTime();setVigil(on);
      if(on){
        setPrayer(VIGIL_PRAYERS[Math.floor(Date.now()/(7*86400000))%VIGIL_PRAYERS.length]);
        ["candle-1","candle-2","candle-3"].forEach((id)=>{supabase.from("candles").upsert({id,lit:true,color:"#f97316",dedication:"Vigil"},{onConflict:"id"});});
      }
    }
    check();const t=setInterval(check,30000);return()=>clearInterval(t);
  },[]);

  useEffect(()=>{
    if(!vigil)return;
    const ch=supabase.channel("vigil:presence",{config:{presence:{key:crypto.randomUUID()}}});
    ch.on("presence",{event:"sync"},()=>{setPresent(Object.keys(ch.presenceState()).length);})
      .subscribe(async(s)=>{if(s==="SUBSCRIBED")await ch.track({at:Date.now()});});
    return()=>{supabase.removeChannel(ch);};
  },[vigil]);

  return(
    <AnimatePresence>
      {vigil&&(
        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0}} transition={{duration:1.5}}
          className="w-full rounded-3xl border border-amber-200/30 p-6 text-center"
          style={{background:"linear-gradient(135deg, rgba(251,191,36,0.08), rgba(249,115,22,0.05))"}}
        >
          <motion.p animate={{opacity:[0.5,1,0.5]}} transition={{duration:3,repeat:Infinity}} className="text-[10px] tracking-[0.4em] uppercase text-amber-600/60 mb-3">✦ Friday Vigil · 8pm UTC ✦</motion.p>
          <p className="text-base font-light text-stone-700 italic leading-relaxed mb-3">&ldquo;{prayer}&rdquo;</p>
          <p className="text-xs text-stone-400">{present} {present===1?"soul is":"souls are"} holding vigil with you.</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
