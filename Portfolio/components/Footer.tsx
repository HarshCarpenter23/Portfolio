import { identity } from "@/lib/content";
import { Container } from "./ui";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-line">
      <Container className="flex flex-col gap-2 py-6 font-mono text-[11px] uppercase tracking-[0.16em] text-ash sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {year} {identity.name}
        </p>
        <p>Hand-rolled WebGL · Next.js · No template involved</p>
      </Container>
    </footer>
  );
}
