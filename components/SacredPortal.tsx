"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Candle from "./Candle";
import VoidBox from "./VoidBox";

export default function SacredPortal(){
  const[inside,setInside]=useState(false);
  return(
    <>
      <div className="flex flex-col items-center gap-3">
        <motion.button onClick={()=>setInside(true)} whileHover={{scale:1.04}} whileTap={{scale:0.96}} className="relative w-24 h-24 rounded-full focus:outline-none" aria-label="Enter the sacred portal">
          {[1,0.75,0.5].map((s,i)=>(
            <motion.div key={i} className="absolute inset-0 rounded-full border border-white/20"
              animate={{scale:[s,s*1.06,s],opacity:[0.3,0.6,0.3]}} transition={{duration:3+i,repeat:Infinity,ease:"easeInOut",delay:i*0.8}}
            />
          ))}
          <motion.div animate={{opacity:[0.4,0.7,0.4]}} transition={{duration:4,repeat:Infinity}} className="absolute inset-4 rounded-full"
            style={{background:"radial-gradient(circle, rgba(167,139,250,0.3), rgba(251,191,36,0.15), transparent)"}}
          />
          <span className="relative z-10 text-2xl">✦</span>
        </motion.button>
        <p className="text-[10px] tracking-[0.3em] uppercase text-stone-400">Enter the portal</p>
      </div>
      <AnimatePresence>
        {inside&&(
          <motion.div initial={{opacity:0,scale:1.1}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:0.95}} transition={{duration:1.2}}
            className="fixed inset-0 z-[80] flex flex-col items-center justify-start overflow-y-auto"
            style={{background:"radial-gradient(ellipse at center, #0d0a14 0%, #050308 100%)"}}
          >
            {Array.from({length:80}).map((_,i)=>(
              <motion.div key={i} className="fixed rounded-full bg-white"
                style={{width:Math.random()*2+0.5,height:Math.random()*2+0.5,left:`${Math.random()*100}%`,top:`${Math.random()*100}%`}}
                animate={{opacity:[0.1,0.6,0.1]}} transition={{duration:2+Math.random()*4,repeat:Infinity,delay:Math.random()*3}}
              />
            ))}
            <button onClick={()=>setInside(false)} className="fixed top-6 right-6 z-10 text-[10px] tracking-widest uppercase text-white/25 hover:text-white/60 transition-colors">Return</button>
            <div className="flex flex-col items-center gap-12 px-6 py-20 max-w-md w-full relative z-10">
              <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.6}} className="text-center">
                <p className="text-[10px] tracking-[0.4em] uppercase text-white/30 mb-3">The inner sanctuary</p>
                <p className="text-sm text-white/40 italic leading-relaxed">Only light. Only silence. Only you.</p>
              </motion.div>
              <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:1}} className="flex items-end justify-center gap-12">
                <Candle id="portal-candle-1"/><Candle id="portal-candle-2"/><Candle id="portal-candle-3"/>
              </motion.div>
              <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:1.4}} className="w-full rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
                <VoidBox/>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
