"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";
import { site } from "@/lib/data";

/**
 * Intro curtain: counts to 100, then wipes upward to reveal the page.
 * Skipped entirely when the visitor prefers reduced motion.
 */
export default function Preloader({ onDone }: { onDone: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const counter = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const [gone, setGone] = useState(false);
  const reduced = usePrefersReducedMotion();
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    if (reduced) {
      doneRef.current();
      setGone(true);
      return;
    }

    const state = { n: 0 };
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      tl.to(state, {
        n: 100,
        duration: 1.5,
        ease: "power2.inOut",
        onUpdate: () => {
          if (counter.current)
            counter.current.textContent = String(Math.round(state.n)).padStart(3, "0");
        },
      })
        .to(bar.current, { scaleX: 1, duration: 1.5, ease: "power2.inOut" }, 0)
        .to(".pre-word", { yPercent: -110, duration: 0.5, ease: "power3.in", stagger: 0.04 })
        .add(() => doneRef.current())
        .to(root.current, {
          yPercent: -100,
          duration: 0.95,
          ease: "power4.inOut",
        }, "<0.05")
        .add(() => setGone(true));
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  if (gone) return null;

  const words = site.name.split(" ");

  return (
    <div
      ref={root}
      className="preloader fixed inset-0 z-[100] flex flex-col justify-between overflow-hidden bg-ink p-6 sm:p-10"
      role="status"
      aria-label="Loading portfolio"
    >
      <div className="blob -left-20 top-1/4 h-[40vmax] w-[40vmax] bg-violet/60" />
      <div className="blob -right-20 bottom-0 h-[34vmax] w-[34vmax] bg-pink/40" style={{ animationDelay: "-8s" }} />

      <div className="relative flex items-center justify-between text-sm text-white/60">
        <span>Portfolio</span>
        <span>Loading</span>
      </div>

      <div className="relative">
        <h1 className="font-display text-[clamp(2.4rem,11vw,9rem)] font-black uppercase leading-[0.95]">
          {words.map((w) => (
            <span key={w} className="mask-line">
              <span className="pre-word inline-block">{w}</span>
            </span>
          ))}
        </h1>
      </div>

      <div className="relative">
        <div className="mb-4 flex items-end justify-between">
          <span className="text-sm text-white/60">{site.role}</span>
          <span
            ref={counter}
            className="font-display text-[clamp(2rem,6vw,4.5rem)] font-bold tabular-nums"
          >
            000
          </span>
        </div>
        <div className="h-[3px] w-full overflow-hidden rounded-full bg-white/10">
          <div
            ref={bar}
            className="h-full origin-left scale-x-0 bg-gradient-to-r from-cyan via-violet to-pink"
          />
        </div>
      </div>
    </div>
  );
}
