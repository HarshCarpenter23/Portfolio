"use client";

import { useScramble } from "./fx";
import { Container } from "./ui";

const nav = [
  ["Work", "#work"],
  ["Experience", "#experience"],
  ["Contact", "#contact"],
] as const;

export function Header() {
  const scramble = useScramble();
  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-gradient-to-b from-carbon from-30% via-carbon/85 to-transparent">
      <Container className="flex h-16 items-center justify-between">
        <a
          href="#top"
          className="whitespace-nowrap font-mono text-[13px] font-semibold uppercase tracking-[0.18em]"
        >
          <span className="sm:hidden" aria-hidden="true">
            H—C
          </span>
          <span className="sr-only sm:not-sr-only">Harsh Carpenter</span>
        </a>
        <nav aria-label="Site">
          <ul className="flex items-center gap-5 sm:gap-8">
            {nav.map(([label, href]) => (
              <li key={href}>
                <a
                  href={href}
                  onPointerEnter={(e) => scramble(e.currentTarget)}
                  className="font-mono text-xs uppercase tracking-[0.18em] text-ash transition-colors hover:text-signal"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </header>
  );
}
