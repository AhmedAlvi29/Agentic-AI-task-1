"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";

type Props = {
  text: string;
  as?: "h1" | "h2" | "h3" | "p";
  className?: string;
  /** Classes applied to each word (e.g. for outline / gradient treatments). */
  wordClassName?: string;
  stagger?: number;
};

/**
 * Splits text into words that rise out of a mask when scrolled into view.
 * The full string stays available to screen readers via aria-label.
 */
export default function RevealText({
  text,
  as: Tag = "h2",
  className,
  wordClassName,
  stagger = 0.06,
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    const ctx = gsap.context(() => {
      gsap.from(".rt-word", {
        yPercent: 115,
        rotate: 4,
        duration: 1,
        ease: "power4.out",
        stagger,
        scrollTrigger: { trigger: el, start: "top 85%", once: true },
      });
    }, el);
    return () => ctx.revert();
  }, [reduced, stagger]);

  const words = text.split(" ");

  return (
    <Tag
      ref={ref as React.RefObject<never>}
      aria-label={text}
      className={className}
    >
      {words.map((w, i) => (
        <span
          key={i}
          aria-hidden
          className="mr-[0.25em] -mb-[0.1em] inline-block overflow-hidden pb-[0.1em] align-top"
        >
          <span className={cn("rt-word inline-block origin-left", wordClassName)}>{w}</span>
        </span>
      ))}
    </Tag>
  );
}
