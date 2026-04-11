import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Background from "@/components/Background";
import Cursor from "@/components/Cursor";
import ScrollProgress from "@/components/ScrollProgress";

export const metadata: Metadata = {
  title: "Portfolio — Neon",
  description: "Game dev & creative projects portfolio."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-display antialiased">
        <Background />
        <ScrollProgress />
        <Cursor />
        <Navbar />
        {children}
      </body>
    </html>
  );
}
