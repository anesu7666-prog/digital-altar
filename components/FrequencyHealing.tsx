"use client";
import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TONES=[
  {hz:174,label:"Foundation",desc:"Pain relief · Security",color:"#86efac"},
  {hz:285,label:"Restoration",desc:"Tissue healing · Renewal",color:"#6ee7b7"},
  {hz:396,label:"Liberation",desc:"Release guilt · Fear into peace",color:"#93c5fd"},
  {hz:432,label:"Grounding",desc:"Natural harmony · Earth frequency",color:"#a5f3fc"},
  {hz:528,label:"Transformation",desc:"DNA repair · Miracle tone",color:"#fde68a"},
  {hz:639,label:"Connection",desc:"Relationships · Heart opening",color:"#fca5a5"},
  {hz:741,label:"Expression",desc:"Clarity · Intuition · Truth",color:"#c4b5fd"},
  {hz:852,label:"Awakening",desc:"Spiritual order · Third eye",color:"#f0abfc"},
  {hz:963,label:"Divine",desc:"Crown activation · Oneness",color:"#fef3c7"},
];

export default function FrequencyHealing(){
  const[playing,setPlaying]=useState<number|null>(null);
  const ctxRef=useRef<AudioContext|null>(null);
  const nodesRef=useRef<{osc:OscillatorNode;gain:GainNode}|null>(null);

  function play(hz:number){
    if(!ctxRef.current)ctxRef.current=new AudioContext();
    const ctx=ctxRef.current;
    if(nodesRef.current){nodesRef.current.gain.gain.setTargetAtTime(0,ctx.currentTime,0.3);const old=nodesRef.current;setTimeout(()=>{try{old.osc.stop();}catch{}},500);}
    if(playing===hz){setPlaying(null);nodesRef.current=null;return;}
    const osc=ctx.createOscillator(),gain=ctx.createGain();
    osc.type="sine";osc.frequency.value=hz;
    gain.gain.setValueAtTime(0,ctx.currentTime);gain.gain.linearRampToValueAtTime(0.08,ctx.currentTime+0.5);
    osc.connect(gain);gain.connect(ctx.destination);osc.start();
    nodesRef.current={osc,gain};setPlaying(hz);
  }

  return(
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-lg font-semibold text-stone-700 tracking-wide">Frequency Healing</h2>
        <p className="text-sm text-stone-500 mt-1">Tap a frequency. Let it resonate.</p>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {TONES.map((t)=>(
          <motion.button key={t.hz} onClick={()=>play(t.hz)} whileTap={{scale:0.95}}
            className={["relative rounded-2xl p-3 text-left border transition-all overflow-hidden",playing===t.hz?"border-white/40 bg-white/25 shadow-lg":"border-white/15 bg-white/8 hover:bg-white/15"].join(" ")}
          >
            {playing===t.hz&&<motion.div className="absolute inset-0 rounded-2xl" animate={{opacity:[0.15,0.3,0.15]}} transition={{duration:2,repeat:Infinity}} style={{background:`radial-gradient(circle, ${t.color}44, transparent)`}}/>}
            <p className="text-[10px] font-semibold text-stone-600 relative z-10">{t.hz}Hz</p>
            <p className="text-[9px] text-stone-500 mt-0.5 relative z-10">{t.label}</p>
            <AnimatePresence>
              {playing===t.hz&&<motion.p initial={{opacity:0,height:0}} animate={{opacity:1,height:"auto"}} exit={{opacity:0,height:0}} className="text-[8px] text-stone-400 mt-1 leading-tight relative z-10">{t.desc}</motion.p>}
            </AnimatePresence>
          </motion.button>
        ))}
      </div>
      {playing&&<p className="text-center text-xs text-stone-400 italic">{playing}Hz is playing · Tap again to stop</p>}
    </div>
  );
}
