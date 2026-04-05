"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";

const VOICE_FREQS=[130.81,155.56,185.00,196.00,220.00,246.94,261.63,293.66];

export default function ChoirOfVoices(){
  const[count,setCount]=useState(1);
  const[singing,setSinging]=useState(false);
  const ctxRef=useRef<AudioContext|null>(null);
  const voicesRef=useRef<{osc:OscillatorNode;gain:GainNode}[]>([]);

  useEffect(()=>{
    const ch=supabase.channel("choir:presence",{config:{presence:{key:crypto.randomUUID()}}});
    ch.on("presence",{event:"sync"},()=>{setCount(Object.keys(ch.presenceState()).length);})
      .subscribe(async(s)=>{if(s==="SUBSCRIBED")await ch.track({at:Date.now()});});
    return()=>{supabase.removeChannel(ch);};
  },[]);

  useEffect(()=>{
    const shouldSing=count>=5;
    if(shouldSing&&!singing){
      if(!ctxRef.current)ctxRef.current=new AudioContext();
      const ctx=ctxRef.current;const numVoices=Math.min(count,VOICE_FREQS.length);
      voicesRef.current.forEach(({osc,gain})=>{gain.gain.setTargetAtTime(0,ctx.currentTime,0.5);setTimeout(()=>{try{osc.stop();}catch{}},1000);});
      voicesRef.current=[];
      for(let i=0;i<numVoices;i++){
        const osc=ctx.createOscillator(),gain=ctx.createGain(),vibrato=ctx.createOscillator(),vibratoGain=ctx.createGain();
        osc.type="sine";osc.frequency.value=VOICE_FREQS[i];
        vibrato.frequency.value=5+Math.random()*2;vibratoGain.gain.value=2;
        vibrato.connect(vibratoGain);vibratoGain.connect(osc.frequency);
        gain.gain.setValueAtTime(0,ctx.currentTime);gain.gain.linearRampToValueAtTime(0.04/numVoices,ctx.currentTime+2);
        osc.connect(gain);gain.connect(ctx.destination);osc.start();vibrato.start();
        voicesRef.current.push({osc,gain});
      }
      setSinging(true);
    }
    if(!shouldSing&&singing){
      const ctx=ctxRef.current;
      if(ctx){voicesRef.current.forEach(({osc,gain})=>{gain.gain.setTargetAtTime(0,ctx.currentTime,1);setTimeout(()=>{try{osc.stop();}catch{}},3000);});voicesRef.current=[];}
      setSinging(false);
    }
  },[count,singing]);

  useEffect(()=>()=>{voicesRef.current.forEach(({osc})=>{try{osc.stop();}catch{}});ctxRef.current?.close();},[]);

  if(count<5)return null;
  return(
    <AnimatePresence>
      <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0}} transition={{duration:1.5}} className="flex flex-col items-center gap-2 text-center">
        <motion.div animate={{scale:[1,1.04,1],opacity:[0.5,0.8,0.5]}} transition={{duration:3,repeat:Infinity}} className="text-2xl">🎶</motion.div>
        <p className="text-xs text-stone-400 italic">{count} souls are here. The altar is singing.</p>
      </motion.div>
    </AnimatePresence>
  );
}
