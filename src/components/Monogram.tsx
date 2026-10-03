// The PB monogram, built as in the prototype from type, not an image.
//   box:   the header mark. A square with a 1px border, PB centred at about half the box height
//          (prototype: 42px box, 1.3rem bold letters).
//   plain: the hero mark. Playfair 500 at line-height .75, tracking -.16em so P and B touch,
//          with .16em right padding to put the pair back on centre.
// Colour follows currentColor, so the same mark works on ivory and on green.

type MonogramProps = {
  /** box: side of the square. plain: font size. A number is px; a string is any CSS length. */
  size: number | string;
  variant?: "box" | "plain";
  className?: string;
};

export function Monogram({ size, variant = "box", className = "" }: MonogramProps) {
  if (variant === "plain") {
    return (
      <span
        aria-hidden="true"
        className={`inline-block text-center font-display font-medium ${className}`}
        style={{ fontSize: size, lineHeight: 0.75, letterSpacing: "-0.16em", paddingRight: "0.16em" }}
      >
        PB
      </span>
    );
  }
  return (
    <span
      aria-hidden="true"
      className={`inline-grid shrink-0 place-items-center border border-current font-display font-semibold ${className}`}
      style={{
        width: size,
        height: size,
        fontSize: typeof size === "number" ? Math.round(size * 0.495) : `calc(${size} * 0.495)`,
      }}
    >
      PB
    </span>
  );
}
