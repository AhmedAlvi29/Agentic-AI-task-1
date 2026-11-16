"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { timeline } from "@/lib/data";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";
import SectionHeading from "@/components/ui/SectionHeading";
import TiltCard from "@/components/ui/TiltCard";

export default function Experience() {
  const root = useRef<HTMLElement>(null);
  const list = useRef<HTMLOListElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const ctx = gsap.context(() => {
      // The glowing line draws itself as you scroll through the timeline.
      gsap.fromTo(
        ".tl-fill",
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: list.current,
            start: "top 65%",
            end: "bottom 65%",
            scrub: 0.5,
          },
        },
      );

      gsap.utils.toArray<HTMLElement>(".tl-item").forEach((item, i) => {
        const fromLeft = i % 2 === 0;
        const st = { trigger: item, start: "top 80%", once: true };
        gsap.from(item.querySelector(".tl-card"), {
          opacity: 0,
          x: window.innerWidth >= 768 ? (fromLeft ? -90 : 90) : 40,
          rotateY: window.innerWidth >= 768 ? (fromLeft ? 14 : -14) : 0,
          transformPerspective: 900,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: st,
        });
        gsap.from(item.querySelector(".tl-dot"), {
          scale: 0,
          duration: 0.6,
          ease: "back.out(3)",
          scrollTrigger: st,
        });
      });
    }, root);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      id="experience"
      ref={root}
      aria-labelledby="experience-title"
      className="relative px-5 py-28 sm:px-8 md:py-40"
    >
      <div className="mx-auto max-w-6xl">
        <h2 id="experience-title" className="sr-only">
          Experience and education
        </h2>
        <SectionHeading
          title="The road so far."
          intro="Hands-on experience, formal training and the certifications behind it."
          align="right"
        />

        <ol ref={list} className="relative mt-20 space-y-12 md:space-y-16">
          {/* track */}
          <div
            aria-hidden
            className="absolute bottom-0 left-[1.1rem] top-0 w-[3px] rounded-full bg-white/10 md:left-1/2 md:-translate-x-1/2"
          >
            <div className="tl-fill h-full origin-top rounded-full bg-gradient-to-b from-cyan via-violet to-pink shadow-[0_0_20px_rgba(139,92,246,0.9)]" />
          </div>

          {timeline.map((t, i) => {
            const left = i % 2 === 0;
            return (
              <li key={t.title} className="tl-item relative pl-12 md:grid md:grid-cols-2 md:gap-20 md:pl-0">
                <span
                  aria-hidden
                  className="tl-dot absolute left-[1.1rem] top-8 z-10 h-5 w-5 -translate-x-1/2 rounded-full border-[3px] border-ink md:left-1/2"
                  style={{ background: t.color, boxShadow: `0 0 0 6px ${t.color}33, 0 0 28px ${t.color}` }}
                />
                <div className={`tl-card ${left ? "md:col-start-1 md:text-right" : "md:col-start-2"}`}>
                  <TiltCard glow={`${t.color}44`} max={6} scale={1.015} className="glass edge rounded-3xl p-6 sm:p-7">
                    <div className={`flex flex-wrap items-center gap-2 ${left ? "md:justify-end" : ""}`}>
                      <span
                        className="rounded-full px-3 py-1 text-xs font-bold text-ink"
                        style={{ background: t.color }}
                      >
                        {t.kind}
                      </span>
                      {t.org && <span className="text-sm font-semibold text-white/80">{t.org}</span>}
                      {t.period && <span className="text-sm text-white/50">{t.period}</span>}
                    </div>
                    <h3 className="mt-4 text-xl font-black leading-tight sm:text-2xl">{t.title}</h3>
                    <p className={`mt-3 text-white/65 ${left ? "md:ml-auto" : ""} max-w-md`}>{t.text}</p>
                  </TiltCard>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
