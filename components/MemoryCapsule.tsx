"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";

interface Word{id:number;word:string;moon_cycle:number;}
function getMoonCycle(){return Math.floor((Date.now()-new Date("2000-01-06T18:14:00Z").getTime())/(29.53058867*24*60*60*1000));}

export default function MemoryCapsule(){
  const[words,setWords]=useState<Word[]>([]);
  const[input,setInput]=useState("");
  const[contributed,setContributed]=useState(false);
  const[published,setPublished]=useState<Word[]>([]);
  const cycle=getMoonCycle();

  useEffect(()=>{
    supabase.from("poem_words").select("id,word,moon_cycle").eq("moon_cycle",cycle).order("created_at")
      .then(({data})=>{if(data)setWords(data as Word[]);});
    supabase.from("poem_words").select("id,word,moon_cycle").eq("moon_cycle",cycle-1).order("created_at")
      .then(({data})=>{if(data)setPublished(data as Word[]);});
    const ch=supabase.channel("poem:live")
      .on("postgres_changes",{event:"INSERT",schema:"public",table:"poem_words"},(p)=>{
        const w=p.new as Word;if(w.moon_cycle===cycle)setWords((prev)=>[...prev,w]);
      }).subscribe();
    if(localStorage.getItem(`altar-poem-${cycle}`))setContributed(true);
    return()=>{supabase.removeChannel(ch);};
  },[cycle]);

  async function contribute(){
    const trimmed=input.trim().split(/\s+/)[0];if(!trimmed||contributed)return;
    await supabase.from("poem_words").insert({word:trimmed,moon_cycle:cycle});
    localStorage.setItem(`altar-poem-${cycle}`,"1");setContributed(true);setInput("");
  }

  return(
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-lg font-semibold text-stone-700 tracking-wide">Memory Capsule</h2>
        <p className="text-sm text-stone-500 mt-1">One word. Every visitor. Published at the new moon.</p>
      </div>
      {words.length>0&&(
        <div className="rounded-2xl border border-white/15 bg-white/8 p-4">
          <p className="text-[10px] tracking-widest uppercase text-stone-400 mb-3">This moon&apos;s poem · {words.length} words so far</p>
          <p className="text-sm text-stone-600 leading-loose italic">{words.map((w)=>w.word).join(" ")}</p>
        </div>
      )}
      {!contributed?(
        <div className="flex gap-2">
          <input value={input} onChange={(e)=>setInput(e.target.value.split(/\s+/)[0]??"")} onKeyDown={(e)=>e.key==="Enter"&&contribute()} placeholder="One word…" maxLength={30}
            className="flex-1 rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm text-stone-600 placeholder:text-stone-400 focus:outline-none focus:border-white/40 backdrop-blur-sm"
          />
          <motion.button onClick={contribute} disabled={!input.trim()} whileTap={{scale:0.96}}
            className="px-4 py-2 rounded-xl border border-white/25 bg-white/20 text-sm font-medium text-stone-600 hover:bg-white/35 disabled:opacity-40 transition-all"
          >Add</motion.button>
        </div>
      ):(
        <p className="text-xs text-stone-400 italic text-center">Your word is in the poem. Return at the new moon.</p>
      )}
      <AnimatePresence>
        {published.length>0&&(
          <motion.div initial={{opacity:0}} animate={{opacity:1}} className="rounded-2xl border border-amber-200/20 p-4" style={{background:"linear-gradient(135deg, rgba(254,243,199,0.1), transparent)"}}>
            <p className="text-[10px] tracking-widest uppercase text-amber-600/50 mb-3">Last moon&apos;s poem</p>
            <p className="text-sm text-stone-500 leading-loose italic">{published.map((w)=>w.word).join(" ")}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
