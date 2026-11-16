"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { gsap } from "@/lib/gsap";
import { site } from "@/lib/data";
import { scrollToId } from "@/lib/lenis";
import { useReady } from "@/components/Providers";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";
import HeroCanvas from "@/components/three/HeroCanvas";
import Button from "@/components/ui/Button";

// Display treatment per headline line: solid, frosted glass, gradient.
const LINE_STYLES = [
  "text-white",
  "text-frost",
  "text-gradient",
  "text-frost",
  "text-white",
];

function RotatingRole({ reduced }: { reduced: boolean }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (reduced) return;
    const t = setInterval(() => setI((n) => (n + 1) % site.rotatingRoles.length), 2600);
    return () => clearInterval(t);
  }, [reduced]);

  return (
    <p className="flex flex-wrap items-baseline gap-x-2 text-base text-white/60 sm:text-lg">
      <span>Right now I&apos;m building</span>
      <span className="relative inline-flex h-[1.5em] overflow-hidden align-bottom">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={i}
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            exit={{ y: "-100%", opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="whitespace-nowrap font-semibold text-gradient"
          >
            {site.rotatingRoles[i]}
          </motion.span>
        </AnimatePresence>
      </span>
    </p>
  );
}

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const ready = useReady();
  const reduced = usePrefersReducedMotion();

  // Hide intro elements up front (the preloader still covers the page).
  useEffect(() => {
    if (reduced) return;
    const ctx = gsap.context(() => {
      gsap.set(".h-line", { yPercent: 115, rotate: 3 });
      gsap.set("[data-hero]", { opacity: 0, y: 28 });
    }, root);
    return () => ctx.revert();
  }, [reduced]);

  // Play the entrance once the curtain lifts.
  useEffect(() => {
    if (reduced || !ready) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
      tl.to(".h-line", { yPercent: 0, rotate: 0, duration: 0.8, stagger: 0.06 })
        .to("[data-hero]", { opacity: 1, y: 0, duration: 0.6, stagger: 0.06 }, "-=0.6");

      // Content drifts away as the hero scrolls out.
      gsap.to(content.current, {
        yPercent: -10,
        opacity: 0.15,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }, root);
    return () => ctx.revert();
  }, [ready, reduced]);

  return (
    <section
      id="top"
      ref={root}
      aria-labelledby="hero-title"
      className="relative flex min-h-[100svh] items-center overflow-hidden"
    >
      <HeroCanvas />

      <div
        ref={content}
        className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-28 pt-32 sm:px-8 md:pt-28"
      >
        <div
          data-hero
          className="glass mb-8 inline-flex items-center gap-3 rounded-full py-2 pl-3 pr-5 text-sm"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inset-0 rounded-full bg-lime [animation:pulse-ring_1.8s_ease-out_infinite]" />
            <span className="relative h-2.5 w-2.5 rounded-full bg-lime" />
          </span>
          <span className="font-semibold">{site.name}</span>
          <span className="hidden text-white/60 sm:inline">{site.role}</span>
        </div>

        <h1
          id="hero-title"
          aria-label="Building Digital Experiences Beyond Imagination."
          className="max-w-[16ch] text-[clamp(2.1rem,6.4vw,6rem)] font-black uppercase leading-[0.98]"
        >
          {site.headline.map((line, i) => (
            <span key={line} aria-hidden className="mask-line">
              <span className={`h-line inline-block origin-left ${LINE_STYLES[i % LINE_STYLES.length]}`}>
                {line}
              </span>
            </span>
          ))}
        </h1>

        <p data-hero className="mt-8 max-w-xl text-lg text-white/75 sm:text-xl">
          {site.subheadline}
        </p>

        <div data-hero className="mt-5">
          <RotatingRole reduced={reduced} />
        </div>

        <div data-hero className="mt-10 flex flex-wrap items-center gap-4">
          <Button href="#projects">Explore My Work</Button>
          <Button href="#contact" variant="ghost">
            Let&apos;s Talk
          </Button>
        </div>
      </div>

      <button
        type="button"
        data-hero
        onClick={() => scrollToId("about")}
        aria-label="Scroll to the about section"
        className="absolute bottom-7 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-xs text-white/60 transition-colors hover:text-white"
      >
        <span>Scroll</span>
        <span className="relative block h-10 w-6 overflow-hidden rounded-full border border-white/30">
          <span className="absolute left-1/2 top-0 h-2 w-1 -translate-x-1/2 rounded-full bg-cyan [animation:scroll-cue_1.8s_ease-in-out_infinite]" />
        </span>
      </button>
    </section>
  );
}
