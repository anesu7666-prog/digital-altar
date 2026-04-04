import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Digital Altar",
  description: "A digital altar",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
