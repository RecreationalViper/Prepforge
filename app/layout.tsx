import type { Metadata, Viewport } from "next";
import { Syne, Fragment_Mono } from "next/font/google";
import "./globals.css";
import Effects from "@/components/Effects";
import TopBar from "@/components/TopBar";
import Dock from "@/components/Dock";

const syne = Syne({ subsets: ["latin"], weight: ["500", "700"], variable: "--font-syne", display: "swap" });
const mono = Fragment_Mono({ subsets: ["latin"], weight: "400", variable: "--font-mono", display: "swap" });
const base = process.env.NEXT_PUBLIC_BASE || "";

export const metadata: Metadata = {
  title: { default: "PrepForge · Taste first", template: "%s · PrepForge" },
  description: "A calm, editorial cooking network. Today's Table, saves, a smart grocery list and the stores near you. Make it effortless.",
  manifest: `${base}/manifest.webmanifest`,
  appleWebApp: { capable: true, title: "PrepForge", statusBarStyle: "black-translucent" },
  icons: { icon: `${base}/icon.svg`, apple: `${base}/icon.svg` }
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover", themeColor: "#030308" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${syne.variable} ${mono.variable}`}>
      <body>
        <Effects />
        <TopBar />
        <main className="shell">{children}</main>
        <Dock />
      </body>
    </html>
  );
}
