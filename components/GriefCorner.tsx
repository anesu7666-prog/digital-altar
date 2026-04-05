"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";

interface GriefEntry{id:number;name:string;created_at:string;}

export default function GriefCorner() {
  const [name,setName]=useState("");
  const [entries,setEntries]=useState<GriefEntry[]>([]);
  const [floating,setFloating]=useState<{id:number;name:string}[]>([]);
  const inputRef=useRef<HTMLInputElement>(null);

  useEffect(()=>{
    supabase.from("grief").select("id,name,created_at").order("created_at",{ascending:false}).limit(20)
      .then(({data})=>{if(data)setEntries(data as GriefEntry[]);});
    const ch=supabase.channel("grief:live")
      .on("postgres_changes",{event:"INSERT",schema:"public",table:"grief"},(payload)=>{
        const row=payload.new as GriefEntry;
        setEntries((prev)=>[row,...prev.slice(0,19)]);
        addFloat(row.id,row.name);
      }).subscribe();
    return ()=>{supabase.removeChannel(ch);};
  },[]);

  function addFloat(id:number,name:string){
    setFloating((prev)=>[...prev,{id,name}]);
    setTimeout(()=>setFloating((prev)=>prev.filter((f)=>f.id!==id)),5000);
  }

  async function handleSubmit(e:React.FormEvent){
    e.preventDefault();const trimmed=name.trim();if(!trimmed)return;
    const{data}=await supabase.from("grief").insert({name:trimmed}).select().single();
    if(data)addFloat(data.id,data.name);
    setName("");
  }

  return (
    <div className="relative rounded-3xl border border-white/10 p-8 overflow-hidden" style={{background:"linear-gradient(to bottom, rgba(15,10,20,0.6), rgba(8,5,12,0.8))"}}>
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <AnimatePresence>
          {floating.map((f)=>(
            <motion.p key={f.id} initial={{opacity:0.7,y:"80%",x:`${20+Math.random()*60}%`,filter:"blur(0px)"}} animate={{opacity:0,y:"-10%",filter:"blur(3px)"}} exit={{opacity:0}} transition={{duration:4.5,ease:"easeOut"}}
              className="absolute text-sm text-white/50 italic font-light tracking-widest"
            >{f.name}</motion.p>
          ))}
        </AnimatePresence>
      </div>
      <div className="relative z-10 flex flex-col gap-5">
        <div className="text-center">
          <p className="text-[10px] tracking-[0.3em] uppercase text-white/30 mb-2">A quiet corner</p>
          <h2 className="text-lg font-light text-white/70 tracking-wide">Who are you holding today?</h2>
          <p className="text-sm text-white/40 mt-1 leading-relaxed">Write their name. Let it rise.</p>
        </div>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input ref={inputRef} value={name} onChange={(e)=>setName(e.target.value)} placeholder="A name…" maxLength={60}
            className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 placeholder:text-white/25 focus:outline-none focus:border-white/20 backdrop-blur-sm"
          />
          <motion.button type="submit" disabled={!name.trim()} whileTap={{scale:0.96}}
            className="px-4 py-2 rounded-xl border border-white/15 text-sm text-white/50 hover:bg-white/15 disabled:opacity-30 transition-all"
          >Release</motion.button>
        </form>
        {entries.length>0&&(
          <div className="flex flex-wrap gap-2 justify-center mt-2">
            {entries.slice(0,8).map((e)=>(<span key={e.id} className="text-[11px] text-white/25 italic">{e.name}</span>))}
            {entries.length>8&&<span className="text-[11px] text-white/15">+{entries.length-8} more</span>}
          </div>
        )}
      </div>
    </div>
  );
}
