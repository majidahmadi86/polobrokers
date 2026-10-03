import type { ReactNode } from "react";

// Inner page header band: optional small caps label in gold text, the H1, then optional content.
export function PageHeader({ label, title, children }: { label?: string; title: ReactNode; children?: ReactNode }) {
  return (
    <section className="bg-warm px-[7vw] pb-[60px] pt-[70px] min-[800px]:px-[8vw] min-[800px]:pb-[70px] min-[800px]:pt-[90px]">
      {label && (
        <p data-reveal className="mb-[15px] font-body text-kicker uppercase tracking-kicker text-gold-text">
          {label}
        </p>
      )}
      <h1 data-reveal className="max-w-[1100px]">
        {title}
      </h1>
      {children}
    </section>
  );
}
