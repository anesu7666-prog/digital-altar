"use client";

import { useState, useEffect } from "react";
import AltarPage from "@/components/AltarPage";

export default function Home() {
  const [isClient, setIsClient] = useState(false);

  // This ensures the component only renders after the browser is ready
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    // This prevents the "This page couldn't load" error during the initial handshake
    return (
      <div style={{ background: "#000", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
        Loading Altar...
      </div>
    );
  }

  return <AltarPage />;
}