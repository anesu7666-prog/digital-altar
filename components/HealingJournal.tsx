"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Entry{id:string;text:string;date:string;}
const KEY="altar-journal";
function load():Entry[]{try{return JSON.parse(localStorage.getItem(KEY)??"[]");}catch{return[];}}
function save(e:Entry[]){localStorage.setItem(KEY,JSON.stringify(e));}

export default function HealingJournal(){
  const[entries,setEntries]=useState<Entry[]>([]);
  const[text,setText]=useState("");
  const[open,setOpen]=useState(false);
  const[viewing,setViewing]=useState(false);

  useEffect(()=>{setEntries(load());},[]);

  function addEntry(){
    const trimmed=text.trim();if(!trimmed)return;
    const next:Entry[]=[{id:crypto.randomUUID(),text:trimmed,date:new Date().toISOString()},...entries];
    setEntries(next);save(next);setText("");
  }

  function deleteEntry(id:string){const next=entries.filter((e)=>e.id!==id);setEntries(next);save(next);}

  return(
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-stone-700 tracking-wide">Healing Journal</h2>
          <p className="text-sm text-stone-500 mt-0.5">Private. Never sent anywhere. Only yours.</p>
        </div>
        <div className="flex gap-2">
          {entries.length>0&&<button onClick={()=>setViewing((v)=>!v)} className="text-[10px] tracking-widest uppercase px-2 py-1 rounded-full border border-white/20 bg-white/10 text-stone-400 hover:bg-white/20 transition-all">{viewing?"Hide":`${entries.length} entries`}</button>}
          <button onClick={()=>setOpen((v)=>!v)} className="text-[10px] tracking-widest uppercase px-2 py-1 rounded-full border border-white/20 bg-white/10 text-stone-400 hover:bg-white/20 transition-all">{open?"Close":"Write"}</button>
        </div>
      </div>
      <AnimatePresence>
        {open&&(
          <motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:"auto"}} exit={{opacity:0,height:0}} className="flex flex-col gap-2 overflow-hidden">
            <textarea value={text} onChange={(e)=>setText(e.target.value)} placeholder="What is alive in you today…" rows={4}
              className="w-full resize-none rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-stone-600 placeholder:text-stone-400 focus:outline-none focus:border-white/40 backdrop-blur-sm"
              style={{boxShadow:text?"0 0 20px rgba(167,139,250,0.08)":"none",transition:"box-shadow 0.4s ease"}}
            />
            <div className="flex justify-between items-center">
              <p className="text-[10px] text-stone-400">🔒 Stored only on this device</p>
              <motion.button onClick={addEntry} disabled={!text.trim()} whileTap={{scale:0.97}}
                className="px-4 py-1.5 rounded-full border border-white/25 bg-white/20 text-sm text-stone-600 hover:bg-white/35 disabled:opacity-40 transition-all"
              >Save</motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {viewing&&(
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="flex flex-col gap-2 max-h-72 overflow-y-auto scrollbar-thin">
            {entries.map((e)=>(
              <motion.div key={e.id} layout initial={{opacity:0,y:-6}} animate={{opacity:1,y:0}} exit={{opacity:0}} className="rounded-xl border border-white/15 bg-white/8 px-4 py-3 group">
                <div className="flex justify-between items-start gap-2 mb-1">
                  <p className="text-[10px] text-stone-400">{new Date(e.date).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}</p>
                  <button onClick={()=>deleteEntry(e.id)} className="text-[10px] text-stone-300 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-all">✕</button>
                </div>
                <p className="text-sm text-stone-500 leading-relaxed whitespace-pre-wrap">{e.text}</p>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
