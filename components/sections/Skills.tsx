"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { skillGroups, type Skill } from "@/lib/data";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";
import SectionHeading from "@/components/ui/SectionHeading";
import TiltCard from "@/components/ui/TiltCard";

const allSkills: Array<Skill & { color: string }> = skillGroups.flatMap((g) =>
  g.skills.map((s) => ({ ...s, color: g.color })),
);

function MarqueeRow({ items, reverse }: { items: typeof allSkills; reverse?: boolean }) {
  // list is rendered twice so the -50% translate loops seamlessly
  const doubled = [...items, ...items];
  return (
    <div className="marquee overflow-hidden py-2 [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]">
      <ul
        className={`marquee-track ${reverse ? "rev" : ""} gap-4`}
        style={{ "--d": reverse ? "55s" : "45s" } as React.CSSProperties}
      >
        {doubled.map((s, i) => {
          const Icon = s.icon;
          return (
            <li
              key={`${s.name}-${i}`}
              aria-hidden={i >= items.length}
              className="glass mr-4 flex items-center gap-3 rounded-full py-3 pl-4 pr-6"
            >
              <Icon size={22} style={{ color: s.color }} />
              <span className="whitespace-nowrap font-semibold">{s.name}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default function Skills() {
  const root = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const ctx = gsap.context(() => {
      gsap.from(".skill-panel", {
        opacity: 0,
        y: 100,
        scale: 0.92,
        duration: 1.1,
        ease: "power3.out",
        stagger: 0.14,
        scrollTrigger: { trigger: ".skill-panels", start: "top 80%", once: true },
      });
      // each panel column drifts at its own speed for depth
      gsap.utils.toArray<HTMLElement>(".skill-panel-wrap").forEach((el, i) => {
        gsap.to(el, {
          y: (i % 2 === 0 ? -1 : 1) * 36,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.6 },
        });
      });
      gsap.from(".skill-chip", {
        opacity: 0,
        scale: 0.6,
        rotate: -12,
        duration: 0.6,
        ease: "back.out(2)",
        stagger: { each: 0.025, from: "random" },
        scrollTrigger: { trigger: ".skill-panels", start: "top 70%", once: true },
      });
    }, root);
    return () => ctx.revert();
  }, [reduced]);

  const half = Math.ceil(allSkills.length / 2);

  return (
    <section
      id="skills"
      ref={root}
      aria-labelledby="skills-title"
      className="relative overflow-hidden py-28 md:py-40"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <h2 id="skills-title" className="sr-only">
          Skills and technologies
        </h2>
        <SectionHeading
          title="A toolkit built for shipping."
          intro="From the first pixel to the production database, and the AI layer in between."
        />
      </div>

      <div className="mt-14 space-y-1" aria-hidden>
        <MarqueeRow items={allSkills.slice(0, half)} />
        <MarqueeRow items={allSkills.slice(half)} reverse />
      </div>

      <div className="skill-panels mx-auto mt-20 grid max-w-7xl gap-6 px-5 sm:px-8 md:grid-cols-2 lg:grid-cols-6">
        {skillGroups.map((g, i) => {
          const span = ["lg:col-span-3", "lg:col-span-3", "lg:col-span-2", "lg:col-span-2", "lg:col-span-2"][i];
          return (
            <div key={g.title} className={`skill-panel-wrap ${span} ${i === 4 ? "md:col-span-2" : ""}`}>
              <div className="skill-panel h-full">
                <TiltCard glow={`${g.color}40`} max={5} scale={1.01} className="glass edge rounded-[2rem] p-6 sm:p-8">
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full blur-3xl"
                    style={{ background: `${g.color}33` }}
                  />
                  <div className="relative">
                    <h3 className="text-2xl font-black" style={{ color: g.color }}>
                      {g.title}
                    </h3>
                    <p className="mt-1 text-sm text-white/60">{g.blurb}</p>
                    <ul className="mt-6 flex flex-wrap gap-3">
                      {g.skills.map((s) => {
                        const Icon = s.icon;
                        return (
                          <li
                            key={s.name}
                            className="skill-chip group flex items-center gap-2.5 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 transition-all duration-300 hover:-translate-y-1.5 hover:border-white/30 hover:bg-white/10"
                            style={{ ["--c" as string]: g.color }}
                          >
                            <Icon
                              size={20}
                              className="icon-bob transition-transform duration-300 group-hover:scale-125"
                              style={{ color: g.color, filter: `drop-shadow(0 0 8px ${g.color}99)` }}
                            />
                            <span className="text-sm font-semibold">{s.name}</span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </TiltCard>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
