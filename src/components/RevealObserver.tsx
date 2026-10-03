"use client";

import { useEffect } from "react";

// Pairs with MOTION_SCRIPT and the [data-reveal] rules in globals.css: marks each [data-reveal]
// element revealed once it enters the viewport. Without JS, or with reduced motion, html.motion is
// never set and everything is simply visible.
export const MOTION_SCRIPT =
  "if('IntersectionObserver' in window&&matchMedia('(prefers-reduced-motion: no-preference)').matches)document.documentElement.classList.add('motion')";

export function RevealObserver() {
  useEffect(() => {
    const root = document.documentElement;
    if (!root.classList.contains("motion")) return;
    const reveal = (el: Element) => el.classList.add("is-revealed");
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            reveal(entry.target);
            observer.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    document.querySelectorAll("[data-reveal]:not(.is-revealed)").forEach((el) => observer.observe(el));
    // Never leave content hidden if motion is switched off mid-visit.
    const reduce = matchMedia("(prefers-reduced-motion: reduce)");
    const onReduce = () => {
      if (!reduce.matches) return;
      root.classList.remove("motion");
      observer.disconnect();
    };
    reduce.addEventListener("change", onReduce);
    return () => {
      observer.disconnect();
      reduce.removeEventListener("change", onReduce);
    };
  }, []);
  return null;
}
