import type { ReactNode } from "react";

export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-[1200px] px-5 sm:px-8 ${className}`}>
      {children}
    </div>
  );
}

export function Kicker({ label, note }: { label: string; note?: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-t border-line pt-4 font-mono text-xs uppercase tracking-[0.22em] text-ash">
      <h2 className="flex items-center gap-3">
        <span aria-hidden="true" className="inline-block size-2 bg-signal" />
        {label}
      </h2>
      {note ? <p className="text-right text-ash/60">{note}</p> : null}
    </div>
  );
}

export function ExternalLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {children}
    </a>
  );
}
