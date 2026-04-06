"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";

export default function CreateAltarRoom(){
  const[open,setOpen]=useState(false);
  const[name,setName]=useState("");
  const[description,setDescription]=useState("");
  const[creating,setCreating]=useState(false);
  const[url,setUrl]=useState<string|null>(null);
  const[copied,setCopied]=useState(false);

  function toSlug(s:string){return s.toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");}

  async function create(){
    const trimName=name.trim();if(!trimName||creating)return;
    setCreating(true);
    const slug=`${toSlug(trimName)}-${Date.now().toString(36)}`;
    await supabase.from("altar_rooms").insert({slug,name:trimName,description:description.trim()});
    const base = "https://digital-altar-tau.vercel.app";
    setUrl(`${base}/altar/${slug}`); setCreating(false);
  }

  function copy(){if(!url)return;navigator.clipboard.writeText(url);setCopied(true);setTimeout(()=>setCopied(false),2500);}

  return(
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-stone-700 tracking-wide">Personal Altar Rooms</h2>
          <p className="text-sm text-stone-500 mt-0.5">Create a room for someone. Share the link.</p>
        </div>
        <button onClick={()=>setOpen((v)=>!v)} className="text-[10px] tracking-widest uppercase px-3 py-1.5 rounded-full border border-white/20 bg-white/10 text-stone-400 hover:bg-white/20 transition-all">{open?"Close":"Create"}</button>
      </div>
      <AnimatePresence>
        {open&&(
          <motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:"auto"}} exit={{opacity:0,height:0}} className="overflow-hidden">
            {url?(
              <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} className="flex flex-col gap-3 py-2">
                <p className="text-sm text-stone-600 font-medium text-center">✦ Your altar room is ready</p>
                <div className="flex gap-2">
                  <input readOnly value={url} className="flex-1 rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-xs text-stone-500 focus:outline-none"/>
                  <motion.button onClick={copy} whileTap={{scale:0.96}} className="px-3 py-2 rounded-xl border border-white/25 bg-white/20 text-xs text-stone-600 hover:bg-white/35 transition-all">{copied?"Copied ✦":"Copy"}</motion.button>
                </div>
                <a href={url} target="_blank" rel="noopener noreferrer" className="text-center text-[10px] tracking-widest uppercase text-stone-400 hover:text-stone-600 transition-colors">Open room →</a>
                <button onClick={()=>{setUrl(null);setName("");setDescription("");}} className="text-center text-[10px] tracking-widest uppercase text-stone-300 hover:text-stone-500 transition-colors">Create another</button>
              </motion.div>
            ):(
              <div className="flex flex-col gap-3 py-2">
                <input value={name} onChange={(e)=>setName(e.target.value)} placeholder="Room name — e.g. Mama's Room" maxLength={60}
                  className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm text-stone-600 placeholder:text-stone-400 focus:outline-none focus:border-white/40 backdrop-blur-sm"
                />
                <textarea value={description} onChange={(e)=>setDescription(e.target.value)} placeholder="A short description (optional)" maxLength={200} rows={2}
                  className="w-full resize-none rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm text-stone-600 placeholder:text-stone-400 focus:outline-none focus:border-white/40 backdrop-blur-sm"
                />
                <motion.button onClick={create} disabled={!name.trim()||creating} whileTap={{scale:0.97}}
                  className="self-end px-5 py-2 rounded-full border border-white/25 bg-white/20 text-sm font-medium text-stone-600 hover:bg-white/35 disabled:opacity-40 transition-all"
                >{creating?"Creating…":"Create Room"}</motion.button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
