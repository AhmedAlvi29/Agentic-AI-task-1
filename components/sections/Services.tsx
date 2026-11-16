"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { services } from "@/lib/data";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";
import SectionHeading from "@/components/ui/SectionHeading";
import TiltCard from "@/components/ui/TiltCard";
import Button from "@/components/ui/Button";

export default function Services() {
  const root = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const ctx = gsap.context(() => {
      gsap.from(".service", {
        opacity: 0,
        y: 90,
        rotateX: -20,
        scale: 0.92,
        transformPerspective: 900,
        duration: 1,
        ease: "power3.out",
        stagger: { each: 0.1, from: "start" },
        scrollTrigger: { trigger: ".service-grid", start: "top 80%", once: true },
      });
    }, root);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      id="services"
      ref={root}
      aria-labelledby="services-title"
      className="relative px-5 py-28 sm:px-8 md:py-40"
    >
      <div className="mx-auto max-w-7xl">
        <h2 id="services-title" className="sr-only">
          Services
        </h2>
        <SectionHeading
          title="How I can help."
          intro="Pick one service or combine several. Each project starts with a conversation about the problem."
        />

        <ul className="service-grid mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-6" style={{ perspective: 1000 }}>
          {services.map((s) => {
            const Icon = s.icon;
            return (
              <li key={s.title} className={`service ${s.span}`}>
                <TiltCard glow={`${s.colors[0]}55`} className="group glass edge relative overflow-hidden rounded-[2rem] p-7 sm:p-9">
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full opacity-60 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
                    style={{ background: `linear-gradient(135deg, ${s.colors[0]}, ${s.colors[1]})` }}
                  />
                  <div className="relative flex h-full flex-col" style={{ transform: "translateZ(30px)" }}>
                    <div
                      className="relative mb-8 grid h-16 w-16 place-items-center rounded-2xl"
                      style={{
                        background: `linear-gradient(135deg, ${s.colors[0]}, ${s.colors[1]})`,
                        boxShadow: `0 14px 40px -10px ${s.colors[0]}`,
                      }}
                    >
                      <span
                        aria-hidden
                        className="icon-pulse absolute inset-0 rounded-2xl border-2"
                        style={{ borderColor: s.colors[0], opacity: 0 }}
                      />
                      <Icon size={28} className={`${s.anim} text-ink`} />
                    </div>
                    <h3 className="text-2xl font-black leading-tight sm:text-[1.7rem]">{s.title}</h3>
                    <p className="mt-3 max-w-md text-white/70">{s.text}</p>
                  </div>
                </TiltCard>
              </li>
            );
          })}
        </ul>

        <div className="mt-14 flex justify-center">
          <Button href="#contact">Start a project</Button>
        </div>
      </div>
    </section>
  );
}
