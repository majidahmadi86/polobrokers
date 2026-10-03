import type { ReactNode } from "react";

// A titled block of running text for /legal and /privacy: display serif heading, readable measure.
export function ProseSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section data-reveal className="mt-12 first:mt-0">
      <h2 className="mb-4 font-display text-[clamp(1.6rem,2.6vw,2.1rem)] font-medium leading-tight">{title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

/** The page body wrapper: generous spacing, about 68 characters per line. */
export function ProseBody({ children }: { children: ReactNode }) {
  return <div className="max-w-[68ch] px-[7vw] py-[70px] min-[800px]:px-[8vw] min-[800px]:py-[90px] min-[800px]:box-content">{children}</div>;
}
