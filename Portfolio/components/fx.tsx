"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  useCallback,
  useEffect,
  useRef,
  type ElementType,
  type ReactNode,
} from "react";
import { reduced } from "./Providers";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* Splits text into per-character spans and cascades them in.
   Server-renders the full text, so no-JS visitors and crawlers see everything. */
export function Chars({
  text,
  as: Tag = "span",
  className = "",
  delay = 0,
  trigger = false,
}: {
  text: string;
  as?: ElementType;
  className?: string;
  delay?: number;
  trigger?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced()) return;
    const chars = el.querySelectorAll<HTMLElement>(".char");
    const tween = gsap.from(chars, {
      yPercent: 110,
      duration: 0.9,
      ease: "power4.out",
      stagger: 0.022,
      delay,
      scrollTrigger: trigger
        ? { trigger: el, start: "top 88%", once: true }
        : undefined,
    });
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [delay, trigger]);

  return (
    <Tag ref={ref} className={className} aria-label={text}>
      {text.split(" ").map((word, w, arr) => (
        <span key={w} aria-hidden="true">
          <span className="char-line !inline-block">
            {word.split("").map((c, i) => (
              <span key={i} className="char">
                {c}
              </span>
            ))}
          </span>
          {w < arr.length - 1 ? " " : null}
        </span>
      ))}
    </Tag>
  );
}

/* Fade-and-rise on scroll into view. */
export function Reveal({
  children,
  className = "",
  delay = 0,
  y = 32,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced()) return;
    const tween = gsap.from(el, {
      y,
      autoAlpha: 0,
      duration: 1,
      ease: "power3.out",
      delay,
      scrollTrigger: { trigger: el, start: "top 88%", once: true },
    });
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [delay, y]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/* Animates "1,500+" / "99.9%" / "+40%" from zero when scrolled into view.
   SSR renders the final value. */
export function Counter({
  value,
  className = "",
}: {
  value: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced()) return;
    const match = value.match(/^([^0-9]*)([\d,.]+)(.*)$/);
    if (!match) return;
    const [, prefix, num, suffix] = match;
    const target = parseFloat(num.replace(/,/g, ""));
    const decimals = num.includes(".") ? num.split(".")[1].length : 0;
    const grouped = num.includes(",");
    const state = { n: 0 };
    const tween = gsap.to(state, {
      n: target,
      duration: 1.6,
      ease: "power2.out",
      scrollTrigger: { trigger: el, start: "top 90%", once: true },
      onUpdate: () => {
        const v = state.n.toLocaleString("en-IN", {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
          useGrouping: grouped,
        });
        el.textContent = `${prefix}${v}${suffix}`;
      },
    });
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [value]);

  return (
    <span ref={ref} className={`tnum ${className}`}>
      {value}
    </span>
  );
}

const GLYPHS = "!<>-_\\/[]{}—=+*^?#$%&";

/* Scrambles the label with random glyphs on hover, resolving left to right. */
export function useScramble() {
  const frame = useRef(0);

  return useCallback((el: HTMLElement) => {
    if (reduced()) return;
    const original = el.dataset.text ?? el.textContent ?? "";
    el.dataset.text = original;
    cancelAnimationFrame(frame.current);
    const start = performance.now();
    const dur = 520;
    const step = (now: number) => {
      const t = Math.min((now - start) / dur, 1);
      const settled = Math.floor(t * original.length);
      el.textContent =
        original.slice(0, settled) +
        original
          .slice(settled)
          .split("")
          .map((c) =>
            c === " " ? c : GLYPHS[(Math.random() * GLYPHS.length) | 0]
          )
          .join("");
      if (t < 1) frame.current = requestAnimationFrame(step);
      else el.textContent = original;
    };
    frame.current = requestAnimationFrame(step);
  }, []);
}

export function ScrambleLink({
  href,
  children,
  className = "",
  external = true,
}: {
  href: string;
  children: string;
  className?: string;
  external?: boolean;
}) {
  const scramble = useScramble();
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={className}
      onPointerEnter={(e) => scramble(e.currentTarget)}
    >
      {children}
    </a>
  );
}

/* Pulls the element toward the cursor while hovered, springs back on leave. */
export function Magnetic({
  children,
  className = "",
  strength = 0.35,
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced()) return;
    const xTo = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3.out" });
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * strength);
      yTo((e.clientY - (r.top + r.height / 2)) * strength);
    };
    const leave = () => {
      xTo(0);
      yTo(0);
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, [strength]);

  return (
    <div ref={ref} className={`inline-block ${className}`}>
      {children}
    </div>
  );
}
