"use client";
import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRoom } from "./RoomProvider";

export default function AuroraRoom() {
  const { room } = useRoom();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (room !== "aurora") return;
    const canvas = canvasRef.current!; const ctx = canvas.getContext("2d")!;
    let W = window.innerWidth, H = window.innerHeight;
    canvas.width = W; canvas.height = H;
    function resize() { W=window.innerWidth;H=window.innerHeight;canvas.width=W;canvas.height=H; }
    window.addEventListener("resize", resize);
    const curtains = [
      {hue:150,speed:0.0008,amp:0.18,freq:2.1,phase:0,yBase:0.25},
      {hue:160,speed:0.0012,amp:0.14,freq:3.3,phase:1.2,yBase:0.32},
      {hue:270,speed:0.0006,amp:0.12,freq:1.8,phase:2.4,yBase:0.20},
      {hue:180,speed:0.0010,amp:0.16,freq:2.7,phase:0.8,yBase:0.28},
      {hue:290,speed:0.0009,amp:0.10,freq:4.1,phase:3.1,yBase:0.22},
    ];
    let t = 0, raf: number;
    function drawCurtain(c: typeof curtains[0]) {
      const points: [number,number][] = [];
      for (let i=0;i<=120;i++) { const x=(i/120)*W,wave=Math.sin(i/120*Math.PI*c.freq+t*c.speed*1000+c.phase),y=(c.yBase+wave*c.amp)*H; points.push([x,y]); }
      for (let i=0;i<points.length-1;i++) {
        const [x1,y1]=points[i],[x2,y2]=points[i+1],curtainH=H*0.35;
        const grad=ctx.createLinearGradient(x1,y1,x1,y1+curtainH);
        grad.addColorStop(0,`hsla(${c.hue},80%,65%,0)`);grad.addColorStop(0.2,`hsla(${c.hue},90%,70%,0.18)`);grad.addColorStop(0.5,`hsla(${c.hue},85%,60%,0.12)`);grad.addColorStop(1,`hsla(${c.hue},70%,50%,0)`);
        ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.lineTo(x2,y2+curtainH);ctx.lineTo(x1,y1+curtainH);ctx.closePath();ctx.fillStyle=grad;ctx.fill();
      }
    }
    function tick() {
      t++; ctx.fillStyle="rgba(2,4,18,0.22)"; ctx.fillRect(0,0,W,H);
      if(t%3===0){for(let i=0;i<3;i++){ctx.beginPath();ctx.arc(Math.random()*W,Math.random()*H*0.6,Math.random()*1.2,0,Math.PI*2);ctx.fillStyle=`rgba(255,255,255,${Math.random()*0.4})`;ctx.fill();}}
      curtains.forEach(drawCurtain);
      const hGrad=ctx.createLinearGradient(0,H*0.55,0,H);hGrad.addColorStop(0,"rgba(0,20,10,0)");hGrad.addColorStop(1,"rgba(0,8,4,0.6)");ctx.fillStyle=hGrad;ctx.fillRect(0,H*0.55,W,H*0.45);
      raf=requestAnimationFrame(tick);
    }
    tick();
    return () => { window.removeEventListener("resize",resize); cancelAnimationFrame(raf); };
  }, [room]);

  return (
    <AnimatePresence>
      {room==="aurora"&&(
        <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:2}} className="fixed inset-0 z-0 pointer-events-none">
          <canvas ref={canvasRef} className="w-full h-full" aria-hidden />
          <motion.p initial={{opacity:0}} animate={{opacity:0.3}} transition={{delay:2}} className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] tracking-[0.3em] uppercase text-emerald-200/60 pointer-events-none">
            Aurora · The sky is alive tonight
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
