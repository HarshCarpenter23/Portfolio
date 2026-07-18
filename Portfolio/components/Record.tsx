"use client";

import { recognition, tools } from "@/lib/content";
import { Reveal } from "./fx";
import { Container, Kicker } from "./ui";

export function Record() {
  return (
    <section aria-label="Recognition and tools" className="pt-24 sm:pt-32">
      <Container>
        <div className="grid gap-x-16 gap-y-14 lg:grid-cols-2">
          <div>
            <Kicker label="Recognition" />
            <ul className="mt-2">
              {recognition.map((r, i) => (
                <li key={r.title} className="border-b border-line py-6">
                  <Reveal delay={i * 0.07}>
                    <h3 className="font-mono text-sm font-semibold uppercase tracking-wide">
                      {r.title}
                    </h3>
                    <p className="mt-2 max-w-[52ch] text-[15px] leading-relaxed text-ash">
                      {r.detail}
                    </p>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <Kicker label="Tools I ship with" />
            <div className="mt-8 flex flex-col gap-8">
              {tools.map((t, i) => (
                <Reveal key={t.group} delay={i * 0.07}>
                  <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-ash/60">
                    {t.group}
                  </h3>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {t.items.map((item) => (
                      <li key={item}>
                        <span className="inline-block border border-line px-3 py-1.5 font-mono text-xs uppercase tracking-wide text-ash transition-colors duration-300 hover:border-signal hover:text-signal">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
