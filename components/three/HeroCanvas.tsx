"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useIsMobile, usePrefersReducedMotion } from "@/hooks/useMediaQuery";

// Three.js + R3F are heavy: load them only on the client, after first paint.
const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

export default function HeroCanvas() {
  const wrap = useRef<HTMLDivElement>(null);
  const [supported, setSupported] = useState(false);
  const [inView, setInView] = useState(true);
  const mobile = useIsMobile();
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    setSupported(hasWebGL());
  }, []);

  // Pause rendering when the hero scrolls out of view.
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), {
      threshold: 0,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrap} aria-hidden className="pointer-events-none absolute inset-0">
      {supported && <HeroScene active={inView} mobile={mobile} reduced={reduced} />}
    </div>
  );
}
