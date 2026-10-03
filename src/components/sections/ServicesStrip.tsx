import type { Dictionary } from "@/lib/i18n";

// Buy / Trade / Wholesale, each with its sublabel. Three columns from 800px, stacked below.
export function ServicesStrip({ dict, className = "" }: { dict: Dictionary; className?: string }) {
  return (
    <ul data-reveal className={`grid grid-cols-1 border-y border-line min-[800px]:grid-cols-3 ${className}`}>
      {dict.home.sell.features.map((feature) => (
        <li
          key={feature.title}
          className="border-b border-line p-4 text-center last:border-0 min-[800px]:border-b-0 min-[800px]:border-r min-[800px]:last:border-r-0"
        >
          <strong className="block font-display text-[1.25rem] font-medium">{feature.title}</strong>
          <small className="text-[.83rem] uppercase tracking-[.08em]">{feature.note}</small>
        </li>
      ))}
    </ul>
  );
}
