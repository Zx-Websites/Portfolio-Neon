import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Background from "@/components/Background";
import Cursor from "@/components/Cursor";
import ScrollProgress from "@/components/ScrollProgress";
import AnimatedFavicon from "@/components/AnimatedFavicon";

export const metadata: Metadata = {
  metadataBase: new URL("https://zxportfolio.vercel.app"),
  title: "ZxDelt — Jayant Bodse",
  description: "Game dev & creative projects portfolio.",
  openGraph: {
    title: "ZxDelt — Jayant Bodse",
    description: "Solo dev shipping experimental games and tools.",
    url: "https://zxportfolio.vercel.app",
    siteName: "ZxDelt"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-display antialiased">
        <AnimatedFavicon />
        <Background />
        <ScrollProgress />
        <Cursor />
        <Navbar />
        {children}
      </body>
    </html>
  );
}
