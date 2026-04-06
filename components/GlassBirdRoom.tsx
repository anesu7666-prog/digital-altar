"use client";
import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRoom } from "./RoomProvider";

interface Bird { x: number; y: number; vx: number; vy: number; hue: number; size: number; trail: { x: number; y: number }[]; wingPhase: number; wingSpeed: number; chirpCooldown: number; }

function createBird(W: number, H: number): Bird {
  const angle = Math.random() * Math.PI * 2; const speed = 1.2 + Math.random() * 1.4;
  return { x: Math.random() * W, y: Math.random() * H, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, hue: Math.random() * 360, size: 6 + Math.random() * 8, trail: [], wingPhase: Math.random() * Math.PI * 2, wingSpeed: 0.08 + Math.random() * 0.06, chirpCooldown: 0 };
}

function drawBird(ctx: CanvasRenderingContext2D, b: Bird, t: number) {
  const angle = Math.atan2(b.vy, b.vx); const wing = Math.sin(b.wingPhase + t * b.wingSpeed) * b.size * 0.9;
  ctx.save(); ctx.translate(b.x, b.y); ctx.rotate(angle);
  const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, b.size * 2);
  grad.addColorStop(0, `hsla(${b.hue},100%,95%,0.85)`); grad.addColorStop(0.4, `hsla(${b.hue+40},100%,80%,0.45)`); grad.addColorStop(1, `hsla(${b.hue+80},100%,70%,0.0)`);
  for (const sign of [-1, 1] as const) {
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(-b.size*0.6, wing*sign, -b.size*1.6, wing*0.3*sign); ctx.quadraticCurveTo(-b.size*0.8, 0, 0, 0); ctx.fillStyle = grad; ctx.fill();
  }
  ctx.beginPath(); ctx.ellipse(0, 0, b.size*0.9, b.size*0.18, 0, 0, Math.PI*2); ctx.fillStyle = `hsla(${b.hue+20},100%,98%,0.6)`; ctx.fill();
  ctx.beginPath(); ctx.ellipse(-b.size*0.2, -b.size*0.05, b.size*0.3, b.size*0.06, -0.3, 0, Math.PI*2); ctx.fillStyle = "rgba(255,255,255,0.9)"; ctx.fill();
  ctx.restore();
}

function limit(vx: number, vy: number, max: number): [number, number] { const mag = Math.sqrt(vx*vx+vy*vy); return mag > max ? [vx/mag*max, vy/mag*max] : [vx, vy]; }

function steer(birds: Bird[], b: Bird, mx: number, my: number, scatter: {x:number;y:number}|null) {
  let ax=0,ay=0,cx=0,cy=0,sx=0,sy=0,ac=0,cc=0;
  for (const o of birds) {
    if (o===b) continue; const dx=o.x-b.x,dy=o.y-b.y,d=Math.sqrt(dx*dx+dy*dy);
    if (d<80) { if(d<28){sx-=dx/d;sy-=dy/d;} ax+=o.vx;ay+=o.vy;ac++; cx+=o.x;cy+=o.y;cc++; }
  }
  let [fx,fy]:[number,number]=[0,0]; if(ac)[fx,fy]=limit(ax/ac-b.vx,ay/ac-b.vy,0.04);
  let [cfx,cfy]:[number,number]=[0,0]; if(cc)[cfx,cfy]=limit(cx/cc-b.x,cy/cc-b.y,0.032);
  const [sfx,sfy]=limit(sx,sy,0.06);
  const cdx=b.x-mx,cdy=b.y-my,cd=Math.sqrt(cdx*cdx+cdy*cdy);
  let [avx,avy]:[number,number]=[0,0]; if(cd<120)[avx,avy]=limit(cdx/cd,cdy/cd,0.12);
  let [scx,scy]:[number,number]=[0,0];
  if(scatter){const sdx=b.x-scatter.x,sdy=b.y-scatter.y,sd=Math.sqrt(sdx*sdx+sdy*sdy);if(sd<200)[scx,scy]=limit(sdx/(sd+1),sdy/(sd+1),0.48);}
  b.vx+=fx+cfx+sfx*1.2+avx+scx; b.vy+=fy+cfy+sfy*1.2+avy+scy;
  [b.vx,b.vy]=limit(b.vx,b.vy,2.8+(scatter?4:0));
}

function chirp(ctx: AudioContext) {
  const osc=ctx.createOscillator(),gain=ctx.createGain();
  osc.connect(gain);gain.connect(ctx.destination);
  osc.frequency.setValueAtTime(1200+Math.random()*800,ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(400,ctx.currentTime+0.12);
  gain.gain.setValueAtTime(0.04,ctx.currentTime);gain.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+0.15);
  osc.start();osc.stop(ctx.currentTime+0.15);
}

export default function GlassBirdRoom() {
  const { room } = useRoom();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -999, y: -999 });
  const scatter = useRef<{x:number;y:number}|null>(null);
  const audioCtx = useRef<AudioContext|null>(null);

  useEffect(() => {
    if (room !== "glass") return;
    const canvas = canvasRef.current!; const ctx = canvas.getContext("2d")!;
    let W = window.innerWidth, H = window.innerHeight;
    canvas.width = W; canvas.height = H;
    const birds: Bird[] = Array.from({ length: 28 }, () => createBird(W, H));
    let t = 0;
    function resize() { W=window.innerWidth;H=window.innerHeight;canvas.width=W;canvas.height=H; }
    window.addEventListener("resize", resize);
    function onMove(e: MouseEvent) { mouse.current={x:e.clientX,y:e.clientY}; }
    window.addEventListener("mousemove", onMove);
    function onClick(e: MouseEvent) {
      scatter.current={x:e.clientX,y:e.clientY}; setTimeout(()=>{scatter.current=null;},300);
      if(!audioCtx.current)audioCtx.current=new AudioContext(); chirp(audioCtx.current);
    }
    window.addEventListener("click", onClick);
    let raf: number;
    function tick() {
      ctx.fillStyle="rgba(8,6,18,0.18)"; ctx.fillRect(0,0,W,H); t++;
      for (const b of birds) {
        steer(birds,b,mouse.current.x,mouse.current.y,scatter.current);
        b.x+=b.vx;b.y+=b.vy;b.hue=(b.hue+0.3)%360;
        if(b.x<-20)b.x=W+20;if(b.x>W+20)b.x=-20;if(b.y<-20)b.y=H+20;if(b.y>H+20)b.y=-20;
        b.chirpCooldown=Math.max(0,b.chirpCooldown-1);
        const dx=b.x-mouse.current.x,dy=b.y-mouse.current.y;
        if(Math.sqrt(dx*dx+dy*dy)<40&&b.chirpCooldown===0){if(!audioCtx.current)audioCtx.current=new AudioContext();chirp(audioCtx.current);b.chirpCooldown=120;}
        b.trail.push({x:b.x,y:b.y}); if(b.trail.length>20)b.trail.shift();
        for(let i=0;i<b.trail.length;i++){const tp=b.trail[i],prog=i/b.trail.length;ctx.beginPath();ctx.arc(tp.x,tp.y,b.size*0.18*prog,0,Math.PI*2);ctx.fillStyle=`hsla(${b.hue+i*4},100%,80%,${0.35*prog*0.6})`;ctx.fill();}
        drawBird(ctx,b,t);
        for(let r=0;r<3;r++){ctx.beginPath();ctx.arc(b.x+(Math.random()-0.5)*b.size*3,b.y+(Math.random()-0.5)*b.size*3,Math.random()*1.5,0,Math.PI*2);ctx.fillStyle=`hsla(${b.hue+r*60},100%,90%,${Math.random()*0.4})`;ctx.fill();}
      }
      raf=requestAnimationFrame(tick);
    }
    tick();
    return () => { window.removeEventListener("resize",resize);window.removeEventListener("mousemove",onMove);window.removeEventListener("click",onClick);cancelAnimationFrame(raf);audioCtx.current?.close();audioCtx.current=null; };
  }, [room]);

  return (
    <AnimatePresence>
      {room==="glass"&&(
        <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:1.2}} className="fixed inset-0 z-0 pointer-events-none">
          <canvas ref={canvasRef} className="w-full h-full" aria-hidden />
          <motion.p initial={{opacity:0,y:10}} animate={{opacity:0.4,y:0}} transition={{delay:1.5,duration:1}} className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] tracking-[0.3em] uppercase text-indigo-200 pointer-events-none">
            Move your cursor · Click to scatter · The birds will sing
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
