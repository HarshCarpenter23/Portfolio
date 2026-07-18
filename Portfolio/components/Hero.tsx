"use client";

import dynamic from "next/dynamic";
import { identity, statusBoard } from "@/lib/content";
import { Chars, Reveal } from "./fx";
import { Container } from "./ui";

const FluidCanvas = dynamic(() => import("./FluidCanvas"), { ssr: false });

export function Hero() {
  return (
    <section
      aria-labelledby="thesis"
      className="relative flex min-h-svh flex-col overflow-clip"
    >
      {/* static gradient fallback; the shader paints over it once loaded */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(120%_90%_at_70%_10%,#141418_0%,#0a0a0b_55%,#060607_100%)]"
      />
      <FluidCanvas />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-carbon/80"
      />

      <Container className="relative z-10 flex flex-1 flex-col justify-center pb-10 pt-24 sm:pt-28">
        <Reveal delay={0.1} y={16}>
          <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.24em] text-ash sm:text-xs">
            <span className="pulse mr-3 inline-block size-2 rounded-full bg-signal align-middle" />
            Full stack developer — SDE @ Blockland India
          </p>
        </Reveal>
        <h1 id="thesis" className="display text-[clamp(2.2rem,4.8vw,4.4rem)]">
          <Chars text="I ship production" as="span" className="block" delay={0.15} />
          <Chars text="software — systems" as="span" className="block" delay={0.3} />
          <Chars
            text="businesses run on."
            as="span"
            className="block text-signal"
            delay={0.45}
          />
        </h1>
        <Reveal delay={0.7} y={20}>
          <p className="mt-8 max-w-[52ch] text-lg leading-relaxed text-ash">
            {identity.sub}
          </p>
        </Reveal>
      </Container>

      <Reveal delay={0.9} y={0} className="relative z-10">
        <div className="marquee border-t border-line bg-carbon/60 py-4">
          <div className="marquee-track">
            {[0, 1].map((dup) => (
              <div
                key={dup}
                aria-hidden={dup === 1}
                className="flex shrink-0 items-center"
              >
                {statusBoard.map((row) => (
                  <span
                    key={row.name}
                    className="flex items-center gap-5 pr-10 font-mono text-xs uppercase tracking-[0.2em] text-ash"
                  >
                    <span aria-hidden="true" className="text-signal">
                      ✦
                    </span>
                    <span className="text-bone">{row.name}</span>
                    <span>{row.metric}</span>
                    <span className="text-ash/50">{row.domain}</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      <div
        aria-hidden="true"
        className="absolute bottom-24 right-6 z-10 hidden flex-col items-center gap-3 lg:flex"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-ash">
          Scroll
        </span>
        <span className="scroll-hint block h-14 w-px bg-signal" />
      </div>
    </section>
  );
}
