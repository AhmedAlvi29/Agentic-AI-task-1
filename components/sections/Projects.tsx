"use client";

import { useEffect, useRef } from "react";
import { ExternalLink } from "lucide-react";
import { SiGithub } from "@/components/ui/Icons";
import { gsap } from "@/lib/gsap";
import { projects } from "@/lib/data";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";
import SectionHeading from "@/components/ui/SectionHeading";
import TiltCard from "@/components/ui/TiltCard";
import Button from "@/components/ui/Button";
import ProjectPreview from "@/components/ui/ProjectPreview";

export default function Projects() {
  const root = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const mm = gsap.matchMedia();
    const ctx = gsap.context(() => {
      // Sticky stack: each card shrinks and dims as the next one slides over it.
      mm.add("(min-width: 768px)", () => {
        const cards = gsap.utils.toArray<HTMLElement>(".project-card");
        cards.slice(0, -1).forEach((card, i) => {
          gsap.to(card.querySelector(".project-inner"), {
            scale: 0.92,
            filter: "brightness(0.55)",
            ease: "none",
            scrollTrigger: {
              trigger: cards[i + 1],
              start: "top 88%",
              end: "top 20%",
              scrub: true,
            },
          });
        });
      });

      gsap.from(".project-preview", {
        y: 60,
        rotateY: -12,
        opacity: 0,
        duration: 1.1,
        ease: "power3.out",
        stagger: 0.1,
        transformPerspective: 1000,
        scrollTrigger: { trigger: ".project-list", start: "top 75%", once: true },
      });
    }, root);
    return () => {
      mm.revert();
      ctx.revert();
    };
  }, [reduced]);

  return (
    <section
      id="projects"
      ref={root}
      aria-labelledby="projects-title"
      className="relative px-5 py-28 sm:px-8 md:py-40"
    >
      <div className="mx-auto max-w-7xl">
        <h2 id="projects-title" className="sr-only">
          Featured projects
        </h2>
        <SectionHeading
          title="Selected work."
          intro="A few products I've built, from AI platforms to business software."
        />

        <ul className="project-list mt-16 flex flex-col gap-10 md:gap-16">
          {projects.map((p, i) => (
            <li
              key={p.title}
              className="project-card md:sticky"
              style={{ top: `calc(6rem + ${i * 1.25}rem)` }}
            >
              <article
                className="project-inner glass edge relative overflow-hidden rounded-[2rem] p-5 will-change-transform sm:p-8 lg:p-10"
                style={{ "--edge-a": p.colors[0], "--edge-b": p.colors[1] } as React.CSSProperties}
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full blur-3xl"
                  style={{ background: `${p.colors[0]}33` }}
                />
                <div className="relative grid items-center gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
                  <div className={i % 2 ? "lg:order-2" : ""}>
                    <span
                      className="inline-block rounded-full px-3.5 py-1 text-sm font-semibold text-ink"
                      style={{ background: `linear-gradient(90deg, ${p.colors[0]}, ${p.colors[1]})` }}
                    >
                      {p.tag}
                    </span>
                    <h3 className="mt-5 text-[clamp(2rem,4.2vw,3.6rem)] font-black">{p.title}</h3>
                    <p className="mt-4 max-w-md text-white/70">{p.description}</p>

                    <ul className="mt-6 flex flex-wrap gap-2" aria-label={`${p.title} technology stack`}>
                      {p.stack.map((t) => (
                        <li
                          key={t}
                          className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-sm text-white/80"
                        >
                          {t}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-8 flex flex-wrap gap-3">
                      <Button href={p.live} external ariaLabel={`${p.title} live demo (opens in a new tab)`}>
                        Live Demo <ExternalLink size={17} />
                      </Button>
                      <Button
                        href={p.github}
                        external
                        variant="ghost"
                        ariaLabel={`${p.title} source code on GitHub (opens in a new tab)`}
                      >
                        <SiGithub size={17} /> GitHub
                      </Button>
                    </div>
                  </div>

                  <div className={`project-preview ${i % 2 ? "lg:order-1" : ""}`}>
                    <TiltCard max={8} scale={1.03} glow={`${p.colors[1]}55`} className="rounded-2xl">
                      <ProjectPreview project={p} />
                    </TiltCard>
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
