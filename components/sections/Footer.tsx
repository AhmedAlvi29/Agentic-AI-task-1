"use client";

import { ArrowUp } from "lucide-react";
import { site } from "@/lib/data";
import { scrollToId } from "@/lib/lenis";
import Magnetic from "@/components/ui/Magnetic";

export default function Footer() {
  const words = Array.from({ length: 6 }, () => site.name);

  return (
    <footer className="relative overflow-hidden border-t border-white/10 pb-8 pt-16">
      <div aria-hidden className="marquee overflow-hidden">
        <div className="marquee-track" style={{ "--d": "50s" } as React.CSSProperties}>
          {[...words, ...words].map((w, i) => (
            <span
              key={i}
              className={`mr-10 whitespace-nowrap font-display text-[clamp(4rem,14vw,12rem)] font-black uppercase leading-none ${
                i % 2 ? "text-gradient" : "text-frost"
              }`}
            >
              {w}
            </span>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-14 flex max-w-7xl flex-col items-center justify-between gap-6 px-5 text-sm text-white/55 sm:flex-row sm:px-8">
        <p>
          © {new Date().getFullYear()} {site.name}. Built with Next.js, Three.js and GSAP.
        </p>
        <Magnetic strength={0.3}>
          <button
            type="button"
            onClick={() => scrollToId("top")}
            className="glass inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-semibold text-white transition-colors hover:border-white/40"
          >
            Back to top <ArrowUp size={16} />
          </button>
        </Magnetic>
      </div>
    </footer>
  );
}
