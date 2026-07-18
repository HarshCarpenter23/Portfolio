"use client";

import gsap from "gsap";
import { useEffect, useRef, type ReactNode } from "react";
import { caseEntries } from "@/lib/content";
import { Chars, Counter, Reveal, ScrambleLink } from "./fx";
import { reduced } from "./Providers";
import { Container, Kicker } from "./ui";

/* Metrics panel that tilts in 3D toward the cursor. */
function Tilt({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced()) return;
    gsap.set(el, { transformPerspective: 900 });
    const rx = gsap.quickTo(el, "rotationX", { duration: 0.6, ease: "power3.out" });
    const ry = gsap.quickTo(el, "rotationY", { duration: 0.6, ease: "power3.out" });
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      ry(((e.clientX - r.left) / r.width - 0.5) * 10);
      rx(-((e.clientY - r.top) / r.height - 0.5) * 10);
    };
    const leave = () => {
      rx(0);
      ry(0);
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <div ref={ref} className="will-change-transform">
      {children}
    </div>
  );
}

/* Huge ghost title drifting behind each entry, scrubbed by scroll. */
function Ghost({ text }: { text: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced()) return;
    const tween = gsap.fromTo(
      el,
      { xPercent: 4 },
      {
        xPercent: -10,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
      }
    );
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="ghost display pointer-events-none absolute -top-4 left-0 select-none whitespace-nowrap text-[clamp(5rem,16vw,13rem)]"
    >
      {text}
    </div>
  );
}

export function Work() {
  return (
    <section id="work" aria-label="Selected work" className="relative scroll-mt-24">
      <Container>
        <Kicker label="Selected work" note="Outcomes, not demos" />
      </Container>
      {caseEntries.map((entry) => (
        <article key={entry.id} className="relative overflow-clip border-b border-line">
          <Ghost text={entry.title} />
          <Container className="relative grid gap-x-16 gap-y-10 py-24 sm:py-32 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <div className="mb-6 flex flex-wrap items-center gap-4 font-mono text-[11px] uppercase tracking-[0.16em]">
                <span className="border border-signal px-2.5 py-1 font-medium text-signal">
                  {entry.status}
                </span>
                <ScrambleLink
                  href={entry.href}
                  className="text-ash underline decoration-line underline-offset-4 transition-colors hover:text-signal hover:decoration-signal"
                >
                  {`${entry.domain} ↗`}
                </ScrambleLink>
              </div>
              <Chars
                text={entry.title}
                as="h3"
                trigger
                className="display block text-[clamp(2rem,5.5vw,4rem)]"
              />
              <Reveal delay={0.08}>
                <p className="mt-5 max-w-[30ch] text-xl font-medium leading-snug sm:text-2xl">
                  {entry.summary}
                </p>
              </Reveal>
              <Reveal delay={0.14}>
                <p className="mt-5 max-w-[58ch] leading-relaxed text-ash">
                  {entry.detail}
                </p>
              </Reveal>
              <Reveal delay={0.2}>
                <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.16em] text-ash/60">
                  {entry.stack.join(" · ")}
                </p>
              </Reveal>
            </div>
            <div className="lg:col-span-5 lg:self-center">
              <Reveal delay={0.15}>
                <Tilt>
                  <dl className="border border-line bg-onyx">
                    {entry.metrics.map((m) => (
                      <div
                        key={m.label}
                        className="border-b border-line p-6 last:border-b-0"
                      >
                        <dd className="display text-3xl text-bone sm:text-4xl">
                          <Counter value={m.value} />
                        </dd>
                        <dt className="mt-2 font-mono text-[11px] uppercase leading-relaxed tracking-[0.14em] text-ash">
                          {m.label}
                        </dt>
                      </div>
                    ))}
                  </dl>
                </Tilt>
              </Reveal>
            </div>
          </Container>
        </article>
      ))}
    </section>
  );
}
