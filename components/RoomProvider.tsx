"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type RoomMode = "light" | "dark" | "glass" | "aurora";

const RoomContext = createContext<{ room: RoomMode; setRoom: (r: RoomMode) => void; cycle: () => void; }>
  ({ room: "light", setRoom: () => {}, cycle: () => {} });

export function useRoom() { return useContext(RoomContext); }
export function useDarkRoom() { const { room } = useRoom(); return { darkRoom: room === "dark" }; }

const ORDER: RoomMode[] = ["light", "dark", "glass", "aurora"];

export default function RoomProvider({ children }: { children: React.ReactNode }) {
  const [room, setRoom] = useState<RoomMode>("light");

  useEffect(() => { if (window.matchMedia("(prefers-color-scheme: dark)").matches) setRoom("dark"); }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("dark-room", "glass-room", "aurora-room");
    if (room === "dark")   root.classList.add("dark-room");
    if (room === "glass")  root.classList.add("glass-room");
    if (room === "aurora") root.classList.add("aurora-room");
  }, [room]);

  function cycle() { setRoom((r) => ORDER[(ORDER.indexOf(r) + 1) % ORDER.length]); }

  return <RoomContext.Provider value={{ room, setRoom, cycle }}>{children}</RoomContext.Provider>;
}
