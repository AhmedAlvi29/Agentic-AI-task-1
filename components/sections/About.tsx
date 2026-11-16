"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { pillars, projects, totalCertifications, totalSkills, yearsExperience } from "@/lib/data";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";
import SectionHeading from "@/components/ui/SectionHeading";
import TiltCard from "@/components/ui/TiltCard";
import CountUp from "@/components/ui/CountUp";

const stats = [
  { value: yearsExperience, suffix: "+", label: "Years building for the web" },
  { value: projects.length, suffix: "", label: "Featured projects" },
  { value: totalSkills, suffix: "+", label: "Technologies in the toolkit" },
  { value: totalCertifications, suffix: "", label: "Professional certifications" },
];

const SPANS = [
  "lg:col-span-4",
  "lg:col-span-2",
  "lg:col-span-3",
  "lg:col-span-3",
  "sm:col-span-2 lg:col-span-6",
];

/** Decorative floating 3D-ish shapes in CSS. */
function Floaters() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        data-speed="0.25"
        className="float-y absolute right-[6%] top-[8%] h-20 w-20 rounded-2xl bg-gradient-to-br from-pink to-orange opacity-80 shadow-[0_0_60px_rgba(255,61,154,0.5)]"
        style={{ "--r": "18deg", "--d": "8s" } as React.CSSProperties}
      />
      <div
        data-speed="0.5"
        className="float-y absolute left-[3%] top-[48%] h-14 w-14 rounded-full bg-gradient-to-br from-cyan to-electric opacity-80 shadow-[0_0_50px_rgba(34,211,238,0.5)]"
        style={{ "--d": "6s" } as React.CSSProperties}
      />
      <div
        data-speed="0.15"
        className="spin-slow absolute -right-10 bottom-[10%] h-44 w-44 rounded-full border-[14px] border-violet/50"
        style={{ "--d": "40s" } as React.CSSProperties}
      />
      <div
        data-speed="0.4"
        className="float-y absolute bottom-[3%] left-[40%] h-10 w-10 rotate-45 bg-lime/80 shadow-[0_0_40px_rgba(141,255,90,0.5)]"
        style={{ "--r": "45deg", "--d": "9s" } as React.CSSProperties}
      />
    </div>
  );
}

export default function About() {
  const root = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const ctx = gsap.context(() => {
      // Cards pop in with a slight 3D rotation, staggered.
      gsap.from(".pillar", {
        opacity: 0,
        y: 80,
        rotateX: -25,
        scale: 0.94,
        transformPerspective: 900,
        duration: 1,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: { trigger: ".pillars", start: "top 80%", once: true },
      });
      gsap.from(".stat", {
        opacity: 0,
        y: 40,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: { trigger: ".stats", start: "top 88%", once: true },
      });
      // Floating shapes drift at different speeds while scrolling.
      gsap.utils.toArray<HTMLElement>("[data-speed]").forEach((el) => {
        const speed = Number(el.dataset.speed);
        gsap.to(el, {
          yPercent: -120 * speed,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
        });
      });
    }, root);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      id="about"
      ref={root}
      aria-labelledby="about-title"
      className="relative px-5 py-28 sm:px-8 md:py-40"
    >
      <Floaters />
      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 id="about-title" className="sr-only">
              About me
            </h2>
            <SectionHeading title="Code that thinks. Interfaces that feel alive." size="md" />
            <p className="mt-8 max-w-md text-lg text-white/70">
              I&apos;m a developer who loves building modern web applications and intelligent AI solutions.
              I take an idea from rough concept to something fast, reliable and genuinely enjoyable to use.
            </p>
            <p className="mt-4 max-w-md text-white/60">
              Whether it&apos;s a product backend, an AI agent that handles real tasks, or a front end with
              motion and 3D, I care about the details people notice and the ones they only feel.
            </p>
          </div>

          <ul className="pillars grid content-start gap-5 sm:grid-cols-2 lg:col-span-7 lg:grid-cols-6" style={{ perspective: 1000 }}>
            {pillars.map((p, i) => {
              const Icon = p.icon;
              // asymmetric bento: 4+2, 3+3, 6 across a six-column grid
              const span = SPANS[i] ?? "lg:col-span-2";
              const wide = i === 0 || i === pillars.length - 1;
              return (
                <li key={p.title} className={`pillar ${span}`}>
                  <TiltCard
                    glow={`${p.color}55`}
                    className="glass edge rounded-3xl p-6"
                  >
                    <div
                      className="mb-5 grid h-12 w-12 place-items-center rounded-2xl"
                      style={{
                        background: `linear-gradient(135deg, ${p.color}, ${p.color}55)`,
                        boxShadow: `0 10px 30px -8px ${p.color}`,
                        transform: "translateZ(40px)",
                      }}
                    >
                      <Icon size={22} className="text-ink" />
                    </div>
                    <h3 className="text-lg font-bold leading-tight" style={{ transform: "translateZ(24px)" }}>
                      {p.title}
                    </h3>
                    <p className={`mt-2 text-[0.95rem] text-white/65 ${wide ? "max-w-sm" : ""}`}>{p.text}</p>
                  </TiltCard>
                </li>
              );
            })}
          </ul>
        </div>

        <dl className="stats mt-20 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="stat bg-ink/70 p-6 backdrop-blur-xl sm:p-8">
              <dd className="font-display text-[clamp(2.4rem,5vw,4rem)] font-black text-gradient">
                <CountUp to={s.value} suffix={s.suffix} />
              </dd>
              <dt className="mt-2 text-sm text-white/60">{s.label}</dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
