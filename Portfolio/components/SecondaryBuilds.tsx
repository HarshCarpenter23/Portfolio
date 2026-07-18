"use client";

import { secondaryBuilds } from "@/lib/content";
import { Reveal, ScrambleLink } from "./fx";
import { Container, Kicker } from "./ui";

export function SecondaryBuilds() {
  return (
    <section aria-label="Other builds" className="pt-24 sm:pt-32">
      <Container>
        <Kicker label="Also on the record" note="Smaller builds" />
        <ul className="mt-4">
          {secondaryBuilds.map((b, i) => (
            <li key={b.name}>
              <Reveal delay={i * 0.05} y={20}>
                <div className="group grid gap-x-8 gap-y-1 border-b border-line py-5 transition-transform duration-300 hover:translate-x-2 sm:grid-cols-[210px_1fr_max-content] sm:items-baseline">
                  <span className="font-mono text-sm font-semibold uppercase tracking-wide transition-colors group-hover:text-signal">
                    {b.name}
                  </span>
                  <span className="text-[15px] text-ash">{b.line}</span>
                  {b.href ? (
                    <ScrambleLink
                      href={b.href}
                      className="font-mono text-xs uppercase tracking-[0.16em] text-signal hover:underline"
                    >
                      {`${b.domain} ↗`}
                    </ScrambleLink>
                  ) : null}
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
