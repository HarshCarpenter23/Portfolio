import type { Metadata, Viewport } from "next";
import { Archivo, IBM_Plex_Mono, Instrument_Sans } from "next/font/google";
import Cursor from "@/components/Cursor";
import Providers from "@/components/Providers";
import { identity, SITE_URL } from "@/lib/content";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  axes: ["wdth"],
  display: "swap",
});

const instrument = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Harsh Carpenter — Full Stack Developer",
  description:
    "I ship production software — multi-tenant hospital SaaS, a 1,500-candidate real-time exam platform, and AI systems real businesses run on. SDE at Blockland India.",
  openGraph: {
    title: "Harsh Carpenter — Full Stack Developer",
    description: identity.thesis,
    url: SITE_URL,
    siteName: "Harsh Carpenter",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Harsh Carpenter — Full Stack Developer",
    description: identity.thesis,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0b",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${instrument.variable} ${plexMono.variable}`}
    >
      <body>
        <Providers>{children}</Providers>
        <Cursor />
      </body>
    </html>
  );
}
