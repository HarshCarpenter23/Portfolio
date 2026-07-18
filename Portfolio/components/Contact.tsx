"use client";

import { identity } from "@/lib/content";
import { Chars, Magnetic, Reveal, ScrambleLink } from "./fx";
import { Container, Kicker } from "./ui";

export function Contact({ hasPortrait = false }: { hasPortrait?: boolean }) {
  return (
    <section id="contact" aria-label="Contact" className="scroll-mt-24 pt-24 sm:pt-32">
      <Container>
        <Kicker label="Contact" note="Replies within a day" />
        <div className="grid items-end gap-x-16 gap-y-12 pb-24 pt-14 sm:pb-32 sm:pt-20 lg:grid-cols-[1fr_auto]">
          <div>
            <h2 className="display text-[clamp(2.2rem,6.5vw,5rem)]">
              <Chars text="Hiring someone" as="span" className="block" trigger />
              <Chars text="who ships?" as="span" className="block text-signal" trigger delay={0.1} />
            </h2>
            <Reveal delay={0.25}>
              <Magnetic className="mt-12">
                <a
                  href={`mailto:${identity.email}`}
                  className="inline-block border border-line px-6 py-5 font-mono text-sm transition-colors duration-300 hover:border-signal hover:text-signal sm:px-10 sm:py-7 sm:text-xl"
                >
                  {identity.email}
                </a>
              </Magnetic>
            </Reveal>
            <Reveal delay={0.35}>
              <div className="mt-10 flex flex-wrap gap-x-10 gap-y-3 font-mono text-xs uppercase tracking-[0.2em]">
                <ScrambleLink
                  href={identity.github}
                  className="text-ash transition-colors hover:text-signal"
                >
                  GitHub ↗
                </ScrambleLink>
                <ScrambleLink
                  href={identity.linkedin}
                  className="text-ash transition-colors hover:text-signal"
                >
                  LinkedIn ↗
                </ScrambleLink>
              </div>
            </Reveal>
          </div>
          {hasPortrait ? (
            <Reveal delay={0.2} className="justify-self-start lg:justify-self-end">
              <figure className="w-60 border border-line bg-onyx sm:w-72">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/portrait.jpg"
                  alt={`Portrait of ${identity.name}`}
                  className="w-full grayscale contrast-110 transition-[filter] duration-500 hover:grayscale-0"
                />
                <figcaption className="border-t border-line px-3 py-2.5 font-mono text-[10px] uppercase tracking-[0.2em] text-ash">
                  {identity.name} — {identity.role}
                </figcaption>
              </figure>
            </Reveal>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
