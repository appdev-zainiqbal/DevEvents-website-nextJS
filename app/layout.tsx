import type { Metadata } from "next";
import { Schibsted_Grotesk, Martian_Mono } from "next/font/google";
import "./globals.css";
import LightRays from "@/components/LightRays";
import NavBar from "@/components/Header";

const schibstedGrotesk = Schibsted_Grotesk({
  variable: "--font-schibsted-grotesk",
  subsets: ["latin"],
});

const martianMono = Martian_Mono({
  variable: "--font-martian-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DevEvent",
  description: "The DevEvent is Hub for every evebt you must hot meeiss)99",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${schibstedGrotesk.variable} ${martianMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <NavBar />
        <div style={{ width: "100%", height: "600px", position: "absolute" }}>
          <LightRays
            className="absolute inset-0 top-0 z-[-1] min-h-screen"
            raysOrigin="top-center-offset"
            raysColor="#5dfeca"
            raysSpeed={0.3}
            lightSpread={0.9}
            rayLength={1.2}
            followMouse={true}
            mouseInfluence={0.1}
            noiseAmount={0.0}
            distortion={0.05}
          />
        </div>
        <main>{children}</main>
      </body>
    </html>
  );
}
