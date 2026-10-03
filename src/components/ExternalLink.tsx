import type { AnchorHTMLAttributes } from "react";

// Every external link opens in a new tab, without handing the opener or the referrer to it.
export function ExternalLink(props: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
  return <a {...props} target="_blank" rel="noopener noreferrer" />;
}
