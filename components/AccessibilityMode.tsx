"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function AccessibilityMode(){
  const[open,setOpen]=useState(false);
  const[highContrast,setHighContrast]=useState(false);
  const[reducedMotion,setReducedMotion]=useState(false);
  const[largeText,setLargeText]=useState(false);

  useEffect(()=>{const root=document.documentElement;highContrast?root.classList.add("high-contrast"):root.classList.remove("high-contrast");},[highContrast]);
  useEffect(()=>{const root=document.documentElement;reducedMotion?root.classList.add("reduced-motion"):root.classList.remove("reduced-motion");},[reducedMotion]);
  useEffect(()=>{document.documentElement.style.setProperty("--text-size",largeText?"20px":"16px");},[largeText]);

  const options=[
    {label:"High contrast",state:highContrast,set:setHighContrast,icon:"◑"},
    {label:"Reduce motion",state:reducedMotion,set:setReducedMotion,icon:"⏸"},
    {label:"Large text",state:largeText,set:setLargeText,icon:"A+"},
  ];

  return(
    <div className="fixed bottom-16 right-4 z-40 flex flex-col items-end gap-2">
      <AnimatePresence>
        {open&&(
          <motion.div initial={{opacity:0,scale:0.9,y:8}} animate={{opacity:1,scale:1,y:0}} exit={{opacity:0,scale:0.9,y:8}} transition={{duration:0.2}}
            className="rounded-2xl border border-white/25 bg-white/20 backdrop-blur-2xl shadow-lg p-3 flex flex-col gap-2 w-44"
          >
            {options.map((o)=>(
              <button key={o.label} onClick={()=>o.set((v)=>!v)}
                className={["flex items-center gap-2 px-3 py-2 rounded-xl text-xs transition-all",o.state?"bg-white/40 text-stone-700 font-medium":"bg-white/10 text-stone-500 hover:bg-white/20"].join(" ")}
              >
                <span className="w-5 text-center font-mono">{o.icon}</span>{o.label}
                {o.state&&<span className="ml-auto text-emerald-500">✓</span>}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button onClick={()=>setOpen((v)=>!v)} whileTap={{scale:0.92}}
        className="w-10 h-10 rounded-full border border-white/25 bg-white/15 backdrop-blur-xl flex items-center justify-center text-sm shadow-sm hover:bg-white/30 transition-all"
        aria-label="Accessibility options"
      >♿</motion.button>
    </div>
  );
}
