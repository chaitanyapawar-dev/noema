import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Sora } from "next/font/google";
import "./globals.css";
import Grainient from "@/components/backgrounds/Grainient";
import QueryProvider from "@/components/app/QueryProvider";
import { BRAND } from "@/lib/branding";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const sora = Sora({ subsets: ["latin"], variable: "--font-display", display: "swap", weight: ["400", "500", "600", "700"] });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  title: {
    default: `${BRAND.name} – ${BRAND.tagline}`,
    template: `%s | ${BRAND.name}`,
  },
  description: BRAND.subtitle,
  keywords: [
    "AI knowledge base",
    "second brain",
    "multimodal AI",
    "semantic search",
    "Instagram Reels",
    "local AI",
    "ChromaDB",
    "vector search",
  ],
  authors: [{ name: BRAND.name, url: BRAND.github }],
  creator: BRAND.name,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://github.com/chaitanyapawar-dev/noema",
    siteName: BRAND.name,
    title: `${BRAND.name} – ${BRAND.tagline}`,
    description: BRAND.subtitle,
  },
  twitter: {
    card: "summary_large_image",
    title: `${BRAND.name} – ${BRAND.tagline}`,
    description: BRAND.subtitle,
    creator: "@noema_ai",
  },
  robots: {
    index: true,
    follow: true,
  },
  manifest: "/manifest.json",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} ${sora.variable} ${jetbrains.variable} font-sans relative min-h-screen`}>
        {/* Global animated neural background — persists across all routes */}
        <div className="fixed inset-0 -z-50">
          <Grainient
            color1="#5B8CFF"
            color2="#7C3AED"
            color3="#030714"
            timeSpeed={0.12}
            warpStrength={0.4}
            warpFrequency={2.5}
            warpSpeed={0.4}
            warpAmplitude={20}
            grainAmount={0.08}
            blendSoftness={0.25}
            saturation={1.2}
            contrast={1.1}
            zoom={1.1}
          />
        </div>
        <QueryProvider>
          <div className="relative z-10">{children}</div>
        </QueryProvider>
      </body>
    </html>
  );
}

