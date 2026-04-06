"use client";
import { useEffect, useRef } from "react";
import { useRoom } from "./RoomProvider";

export default function SacredGeometry() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { room } = useRoom();

  useEffect(() => {
    const canvas = canvasRef.current!; const ctx = canvas.getContext("2d")!;
    let W = window.innerWidth, H = window.innerHeight;
    canvas.width = W; canvas.height = H;
    function resize() { W = window.innerWidth; H = window.innerHeight; canvas.width = W; canvas.height = H; }
    window.addEventListener("resize", resize);
    const colors: Record<string, string> = { light: "rgba(120,100,180,", dark: "rgba(251,146,60,", glass: "rgba(167,139,250,", aurora: "rgba(52,211,153," };
    let angle = 0, breathe = 0, raf: number;

    function drawFlowerOfLife(cx: number, cy: number, r: number, alpha: number) {
      const col = colors[room] ?? colors.light;
      ctx.strokeStyle = `${col}${alpha})`; ctx.lineWidth = 0.5;
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
      for (let i = 0; i < 6; i++) {
        const a = (i * Math.PI) / 3;
        ctx.beginPath(); ctx.arc(cx + Math.cos(a) * r, cy + Math.sin(a) * r, r, 0, Math.PI * 2); ctx.stroke();
      }
      const pts: [number, number][] = [[cx, cy]];
      for (let i = 0; i < 6; i++) { const a = (i * Math.PI) / 3; pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]); }
      ctx.strokeStyle = `${col}${alpha * 0.4})`;
      for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
        ctx.beginPath(); ctx.moveTo(pts[i][0], pts[i][1]); ctx.lineTo(pts[j][0], pts[j][1]); ctx.stroke();
      }
    }

    function tick() {
      ctx.clearRect(0, 0, W, H); angle += 0.0004; breathe += 0.006;
      const pulse = 1 + Math.sin(breathe) * 0.04;
      const cx = W / 2, cy = H / 2, baseR = Math.min(W, H) * 0.12 * pulse;
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(angle); ctx.translate(-cx, -cy);
      drawFlowerOfLife(cx, cy, baseR, 0.08); drawFlowerOfLife(cx, cy, baseR * 0.5, 0.05);
      ctx.strokeStyle = `${colors[room] ?? colors.light}0.04)`; ctx.lineWidth = 0.5;
      ctx.beginPath(); ctx.arc(cx, cy, baseR * 2.6, 0, Math.PI * 2); ctx.stroke();
      ctx.restore();
      raf = requestAnimationFrame(tick);
    }
    tick();
    return () => { window.removeEventListener("resize", resize); cancelAnimationFrame(raf); };
  }, [room]);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none -z-10" aria-hidden />;
}
