import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Background from "@/components/Background";
import Cursor from "@/components/Cursor";
import ScrollProgress from "@/components/ScrollProgress";
import AnimatedFavicon from "@/components/AnimatedFavicon";

export const metadata: Metadata = {
  title: "ZxDelt",
  description: "Game dev & creative projects portfolio."
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
