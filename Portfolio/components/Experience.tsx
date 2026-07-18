"use client";

import gsap from "gsap";
import { useEffect, useRef } from "react";
import { experience } from "@/lib/content";
import { Reveal } from "./fx";
import { reduced } from "./Providers";
import { Container, Kicker } from "./ui";

export function Experience() {
  const lineRef = useRef<HTMLSpanElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const line = lineRef.current;
    const list = listRef.current;
    if (!line || !list || reduced()) return;
    const tween = gsap.fromTo(
      line,
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: "none",
        transformOrigin: "top",
        scrollTrigger: {
          trigger: list,
          start: "top 75%",
          end: "bottom 55%",
          scrub: true,
        },
      }
    );
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <section id="experience" aria-label="Experience" className="scroll-mt-24 pt-24 sm:pt-32">
      <Container>
        <Kicker label="Experience" note="2023 — present" />
        <ul ref={listRef} className="relative mt-10 sm:pl-10">
          <span
            aria-hidden="true"
            className="absolute left-0 top-2 hidden h-full w-px bg-line sm:block"
          />
          <span
            ref={lineRef}
            aria-hidden="true"
            className="absolute left-0 top-2 hidden h-full w-px bg-signal sm:block"
          />
          {experience.map((e, i) => (
            <li key={e.org} className="relative pb-14 last:pb-0">
              <Reveal delay={i * 0.06}>
                <span
                  aria-hidden="true"
                  className="absolute -left-10 top-2 hidden size-2 -translate-x-1/2 bg-signal sm:block"
                  style={{ left: "-2.5rem" }}
                />
                <p className="tnum font-mono text-xs uppercase tracking-[0.16em] text-signal">
                  {e.period}
                </p>
                <h3 className="display mt-3 text-xl sm:text-2xl">
                  {e.role} <span className="text-ash">· {e.org}</span>
                </h3>
                <p className="mt-3 max-w-[62ch] leading-relaxed text-ash">
                  {e.line}
                </p>
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
