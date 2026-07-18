import { existsSync } from "node:fs";
import { join } from "node:path";
import { Contact } from "@/components/Contact";
import { Experience } from "@/components/Experience";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Record } from "@/components/Record";
import { SecondaryBuilds } from "@/components/SecondaryBuilds";
import { Work } from "@/components/Work";

const hasPortrait = existsSync(join(process.cwd(), "public", "portrait.jpg"));

export default function Home() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[110] focus:bg-signal focus:px-4 focus:py-2 focus:font-mono focus:text-sm focus:text-carbon"
      >
        Skip to content
      </a>
      <span id="top" aria-hidden="true" />
      <Header />
      <main id="main">
        <Hero />
        <Work />
        <SecondaryBuilds />
        <Experience />
        <Record />
        <Contact hasPortrait={hasPortrait} />
      </main>
      <Footer />
    </>
  );
}
