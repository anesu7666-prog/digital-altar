import type { Metadata, Viewport } from "next";
import "./globals.css";
import RoomProvider from "@/components/RoomProvider";

export const metadata: Metadata = {
  title: "Digital Altar",
  description: "A free, sacred space for reflection, grief, and community. Light a candle. Release what weighs on you. You are not alone.",
  keywords: ["digital altar", "meditation", "grief", "candle", "reflection", "sacred space"],
  openGraph: {
    title: "Digital Altar",
    description: "A quiet space to light a candle, release what weighs on you, and leave a word for those who come after.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#F0F0F2",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://yuztdsjwpnhvqebryuiv.supabase.co" />
      </head>
      <body>
        <RoomProvider>
          {children}
        </RoomProvider>
      </body>
    </html>
  );
}
