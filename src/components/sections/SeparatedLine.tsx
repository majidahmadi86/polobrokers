import { Fragment } from "react";

// A " · " separated list set as one line that wraps cleanly: each item keeps its trailing separator
// on the same line (nowrap), and the space between items stays outside so lines break only there.
export function SeparatedLine({ text, className = "" }: { text: string; className?: string }) {
  const items = text.split(" · ");
  return (
    <p data-reveal className={className}>
      {items.map((item, i) => (
        <Fragment key={item}>
          <span className="whitespace-nowrap">{i < items.length - 1 ? `${item} ·` : item}</span>
          {i < items.length - 1 && " "}
        </Fragment>
      ))}
    </p>
  );
}
