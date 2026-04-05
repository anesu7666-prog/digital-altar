"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface Layer{id:string;label:string;emoji:string;volume:number;active:boolean;}
const DEFAULTS:Layer[]=[
  {id:"rain",label:"Rain",emoji:"🌧️",volume:0.5,active:false},
  {id:"fire",label:"Fire",emoji:"🔥",volume:0.4,active:false},
  {id:"bells",label:"Bells",emoji:"🔔",volume:0.3,active:false},
  {id:"wind",label:"Wind",emoji:"🌬️",volume:0.3,active:false},
  {id:"ocean",label:"Ocean",emoji:"🌊",volume:0.4,active:false},
];

function makeNoise(ctx:AudioContext,vol:number,type:"rain"|"fire"|"wind"|"ocean"){
  const buf=ctx.createBuffer(1,ctx.sampleRate*2,ctx.sampleRate);
  const d=buf.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;
  const src=ctx.createBufferSource();src.buffer=buf;src.loop=true;
  const filter=ctx.createBiquadFilter();
  if(type==="rain"){filter.type="highpass";filter.frequency.value=2000;}
  else if(type==="fire"){filter.type="bandpass";filter.frequency.value=600;filter.Q.value=0.4;}
  else if(type==="wind"){filter.type="lowpass";filter.frequency.value=400;}
  else{filter.type="lowpass";filter.frequency.value=800;}
  const gain=ctx.createGain();gain.gain.value=vol*0.15;
  src.connect(filter);filter.connect(gain);gain.connect(ctx.destination);src.start();
  return{src,gain};
}

type AudioNode={src:AudioBufferSourceNode|null;gain:GainNode;interval?:ReturnType<typeof setInterval>};

export default function SoundscapeBuilder(){
  const[layers,setLayers]=useState<Layer[]>(()=>{
    if(typeof window==="undefined")return DEFAULTS;
    try{const s=localStorage.getItem("altar-soundscape");return s?JSON.parse(s):DEFAULTS;}catch{return DEFAULTS;}
  });
  const[open,setOpen]=useState(false);
  const ctxRef=useRef<AudioContext|null>(null);
  const nodesRef=useRef<Record<string,AudioNode>>({});

  const getCtx=useCallback(()=>{if(!ctxRef.current)ctxRef.current=new AudioContext();return ctxRef.current;},[]);

  function startLayer(id:string,vol:number){
    const ctx=getCtx();stopLayer(id);
    let node:AudioNode;
    if(id==="bells"){
      const gain=ctx.createGain();gain.gain.value=0;gain.connect(ctx.destination);
      function ring(){const osc=ctx.createOscillator(),g=ctx.createGain();osc.frequency.value=880+Math.random()*440;g.gain.setValueAtTime(vol*0.15,ctx.currentTime);g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+3);osc.connect(g);g.connect(ctx.destination);osc.start();osc.stop(ctx.currentTime+3);}
      ring();const interval=setInterval(ring,4000+Math.random()*6000);
      node={src:null,gain,interval};
    }else{const n=makeNoise(ctx,vol,id as "rain"|"fire"|"wind"|"ocean");node={src:n.src,gain:n.gain};}
    nodesRef.current[id]=node;
  }

  function stopLayer(id:string){
    const node=nodesRef.current[id];if(!node)return;
    try{node.src?.stop();}catch{}
    if(node.interval)clearInterval(node.interval);
    delete nodesRef.current[id];
  }

  function toggleLayer(id:string){
    setLayers((prev)=>{
      const next=prev.map((l)=>l.id===id?{...l,active:!l.active}:l);
      const layer=next.find((l)=>l.id===id)!;
      if(layer.active)startLayer(id,layer.volume);else stopLayer(id);
      localStorage.setItem("altar-soundscape",JSON.stringify(next));
      return next;
    });
  }

  function setVolume(id:string,vol:number){
    setLayers((prev)=>{
      const next=prev.map((l)=>l.id===id?{...l,volume:vol}:l);
      const node=nodesRef.current[id];
      if(node)node.gain.gain.setTargetAtTime(vol*0.15,getCtx().currentTime,0.1);
      localStorage.setItem("altar-soundscape",JSON.stringify(next));
      return next;
    });
  }

  useEffect(()=>{
    layers.forEach((l)=>{if(l.active)startLayer(l.id,l.volume);});
    return()=>{Object.keys(nodesRef.current).forEach(stopLayer);ctxRef.current?.close();};
  },[]);

  const anyActive=layers.some((l)=>l.active);

  return(
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-stone-700 tracking-wide">Soundscape</h2>
          <p className="text-sm text-stone-500 mt-0.5">Layer your own ambient world.</p>
        </div>
        <button onClick={()=>setOpen((v)=>!v)} className={["text-[10px] tracking-widest uppercase px-3 py-1.5 rounded-full border transition-all",anyActive?"border-emerald-300/40 bg-emerald-50/20 text-emerald-700":"border-white/20 bg-white/10 text-stone-400"].join(" ")}>
          {anyActive?"Playing ♪":"Open"}
        </button>
      </div>
      {(open||anyActive)&&(
        <motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:"auto"}} className="flex flex-col gap-3">
          {layers.map((l)=>(
            <div key={l.id} className="flex items-center gap-3">
              <button onClick={()=>toggleLayer(l.id)} className={["w-10 h-10 rounded-full text-lg transition-all border",l.active?"bg-white/40 border-white/40 scale-110 shadow":"bg-white/10 border-white/15 hover:bg-white/20"].join(" ")}>{l.emoji}</button>
              <span className="text-xs text-stone-500 w-12">{l.label}</span>
              <input type="range" min={0} max={1} step={0.01} value={l.volume} onChange={(e)=>setVolume(l.id,parseFloat(e.target.value))} disabled={!l.active} className="flex-1 accent-stone-400 disabled:opacity-30"/>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
