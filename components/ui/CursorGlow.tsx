"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useIsCoarsePointer, usePrefersReducedMotion } from "@/hooks/useMediaQuery";

/** Soft colour glow plus a small ring that follow the pointer on desktop. */
export default function CursorGlow() {
  const glow = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const coarse = useIsCoarsePointer();
  const reduced = usePrefersReducedMotion();
  const disabled = coarse || reduced;

  useEffect(() => {
    if (disabled || !glow.current || !ring.current) return;

    const gx = gsap.quickTo(glow.current, "x", { duration: 0.8, ease: "power3.out" });
    const gy = gsap.quickTo(glow.current, "y", { duration: 0.8, ease: "power3.out" });
    const rx = gsap.quickTo(ring.current, "x", { duration: 0.22, ease: "power3.out" });
    const ry = gsap.quickTo(ring.current, "y", { duration: 0.22, ease: "power3.out" });
    const ringEl = ring.current;

    const move = (e: PointerEvent) => {
      gx(e.clientX);
      gy(e.clientY);
      rx(e.clientX);
      ry(e.clientY);
    };
    const over = (e: PointerEvent) => {
      const t = e.target as HTMLElement | null;
      const interactive = !!t?.closest("a, button, input, textarea, [data-cursor]");
      gsap.to(ringEl, {
        scale: interactive ? 2.2 : 1,
        borderColor: interactive ? "rgba(255,61,154,0.9)" : "rgba(255,255,255,0.5)",
        duration: 0.3,
        overwrite: "auto",
      });
    };

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
    };
  }, [disabled]);

  if (disabled) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[55] hidden md:block">
      <div
        ref={glow}
        className="absolute left-0 top-0 -ml-[260px] -mt-[260px] h-[520px] w-[520px] rounded-full opacity-60 mix-blend-screen"
        style={{
          background:
            "radial-gradient(circle, rgba(139,92,246,0.28) 0%, rgba(34,211,238,0.10) 40%, transparent 70%)",
        }}
      />
      <div
        ref={ring}
        className="absolute left-0 top-0 -ml-3 -mt-3 h-6 w-6 rounded-full border border-white/50"
      />
    </div>
  );
}
