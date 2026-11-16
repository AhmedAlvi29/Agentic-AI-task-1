"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { getLenis, setLenis } from "@/lib/lenis";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";
import Preloader from "@/components/ui/Preloader";

const ReadyContext = createContext(false);

/** `true` once the intro curtain has lifted. Hero animations wait for it. */
export const useReady = () => useContext(ReadyContext);

export default function Providers({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const reduced = usePrefersReducedMotion();
  const readyRef = useRef(false);

  // Smooth scrolling (Lenis) driven by the GSAP ticker so ScrollTrigger stays in sync.
  useEffect(() => {
    if (reduced) {
      ScrollTrigger.refresh();
      return;
    }

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    setLenis(lenis);
    if (!readyRef.current) lenis.stop();

    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      setLenis(null);
    };
  }, [reduced]);

  useEffect(() => {
    readyRef.current = ready;
    if (ready) {
      getLenis()?.start();
      requestAnimationFrame(() => ScrollTrigger.refresh());
    }
  }, [ready]);

  return (
    <ReadyContext value={ready}>
      <Preloader onDone={() => setReady(true)} />
      {children}
    </ReadyContext>
  );
}
