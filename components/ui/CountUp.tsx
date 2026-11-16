"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";

type Props = { to: number; suffix?: string; className?: string };

/** Counts from 0 to `to` when scrolled into view. Final value is in the markup for SSR / reduced motion. */
export default function CountUp({ to, suffix = "", className }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    const state = { n: 0 };
    const tween = gsap.to(state, {
      n: to,
      duration: 1.8,
      ease: "power3.out",
      onUpdate: () => {
        el.textContent = `${Math.round(state.n)}${suffix}`;
      },
      scrollTrigger: { trigger: el, start: "top 90%", once: true },
    });
    el.textContent = `0${suffix}`;
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [to, suffix, reduced]);

  return (
    <span ref={ref} className={className}>
      {to}
      {suffix}
    </span>
  );
}
