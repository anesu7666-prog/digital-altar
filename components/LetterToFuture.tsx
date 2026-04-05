"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";

const DELAYS=[{label:"30 days",days:30},{label:"90 days",days:90},{label:"6 months",days:180},{label:"1 year",days:365}];

export default function LetterToFuture(){
  const[letter,setLetter]=useState("");
  const[delay,setDelay]=useState(30);
  const[sending,setSending]=useState(false);
  const[sent,setSent]=useState(false);
  const[returned,setReturned]=useState<{content:string;written_at:string}|null>(null);

  useEffect(()=>{
    const token=localStorage.getItem("altar-letter-token");
    const due=localStorage.getItem("altar-letter-due");
    if(!token||!due)return;
    if(new Date()>=new Date(due)){
      supabase.from("letters").select("content,created_at").eq("token",token).single()
        .then(({data})=>{if(data){setReturned({content:data.content,written_at:data.created_at});localStorage.removeItem("altar-letter-token");localStorage.removeItem("altar-letter-due");}});
    }
  },[]);

  async function send(){
    const trimmed=letter.trim();if(!trimmed||sending)return;
    setSending(true);
    const token=crypto.randomUUID();
    const deliverAt=new Date();deliverAt.setDate(deliverAt.getDate()+delay);
    await supabase.from("letters").insert({content:trimmed,token,deliver_at:deliverAt.toISOString()});
    localStorage.setItem("altar-letter-token",token);localStorage.setItem("altar-letter-due",deliverAt.toISOString());
    setSending(false);setSent(true);setLetter("");
  }

  if(returned)return(
    <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="flex flex-col gap-4">
      <div className="text-center">
        <p className="text-[10px] tracking-[0.3em] uppercase text-amber-500/60 mb-2">A letter from your past self</p>
        <p className="text-xs text-stone-400">Written on {new Date(returned.written_at).toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"})}</p>
      </div>
      <div className="rounded-2xl border border-amber-200/30 p-6" style={{background:"linear-gradient(135deg, rgba(254,243,199,0.15), rgba(251,191,36,0.05))"}}>
        <p className="text-sm text-stone-600 leading-relaxed italic whitespace-pre-wrap">{returned.content}</p>
      </div>
      <button onClick={()=>setReturned(null)} className="self-center text-[10px] tracking-widest uppercase text-stone-400 hover:text-stone-600 transition-colors">Close</button>
    </motion.div>
  );

  return(
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-lg font-semibold text-stone-700 tracking-wide">Letter to the Future</h2>
        <p className="text-sm text-stone-500 mt-1">Write to your future self. Return when it is ready.</p>
      </div>
      <AnimatePresence mode="wait">
        {sent?(
          <motion.div key="sent" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} className="text-center py-6">
            <p className="text-2xl mb-3">✉️</p>
            <p className="text-sm text-stone-600 font-medium">Your letter is sealed.</p>
            <p className="text-xs text-stone-400 mt-1">Come back in {delay} days. The altar will remember.</p>
            <button onClick={()=>setSent(false)} className="mt-4 text-[10px] tracking-widest uppercase text-stone-400 hover:text-stone-600 transition-colors">Write another</button>
          </motion.div>
        ):(
          <motion.div key="form" className="flex flex-col gap-3">
            <textarea value={letter} onChange={(e)=>setLetter(e.target.value)} placeholder="Dear future me…" rows={5} maxLength={1000}
              className="w-full resize-none rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-stone-600 placeholder:text-stone-400 focus:outline-none focus:border-white/40 backdrop-blur-sm"
            />
            <div className="flex gap-2 flex-wrap">
              {DELAYS.map((d)=>(
                <button key={d.days} onClick={()=>setDelay(d.days)}
                  className={["text-[10px] tracking-widest uppercase px-3 py-1.5 rounded-full border transition-all",delay===d.days?"border-stone-400 bg-stone-100/30 text-stone-600":"border-white/15 bg-white/8 text-stone-400 hover:bg-white/15"].join(" ")}
                >{d.label}</button>
              ))}
            </div>
            <motion.button onClick={send} disabled={!letter.trim()||sending} whileTap={{scale:0.97}}
              className="self-end px-5 py-2 rounded-full border border-white/25 bg-white/20 text-sm font-medium text-stone-600 hover:bg-white/35 disabled:opacity-40 transition-all"
            >{sending?"Sealing…":"Seal & Send"}</motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
