"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useIsCoarsePointer, usePrefersReducedMotion } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  className?: string;
  /** Max tilt in degrees. */
  max?: number;
  /** Colour of the cursor spotlight on the surface. */
  glow?: string;
  scale?: number;
};

/**
 * 3D tilt that follows the pointer, with a spotlight that tracks the cursor.
 * Direct children can use `translate-z-*` style transforms (preserve-3d is on).
 */
export default function TiltCard({
  children,
  className,
  max = 10,
  glow = "rgba(139,92,246,0.35)",
  scale = 1.02,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const coarse = useIsCoarsePointer();
  const reduced = usePrefersReducedMotion();
  const off = coarse || reduced;

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const spring = { stiffness: 220, damping: 20, mass: 0.5 };
  const sx = useSpring(px, spring);
  const sy = useSpring(py, spring);
  const rotateY = useTransform(sx, [0, 1], [-max, max]);
  const rotateX = useTransform(sy, [0, 1], [max, -max]);
  const s = useSpring(1, spring);

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || off) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    px.set(x);
    py.set(y);
    el.style.setProperty("--mx", `${x * 100}%`);
    el.style.setProperty("--my", `${y * 100}%`);
  };
  const onEnter = () => !off && s.set(scale);
  const onLeave = () => {
    px.set(0.5);
    py.set(0.5);
    s.set(1);
  };

  return (
    <div style={{ perspective: 1100 }} className="h-full">
      <motion.div
        ref={ref}
        onPointerMove={onMove}
        onPointerEnter={onEnter}
        onPointerLeave={onLeave}
        style={
          off
            ? ({ "--glow": glow } as React.CSSProperties)
            : ({
                rotateX,
                rotateY,
                scale: s,
                transformStyle: "preserve-3d",
                "--glow": glow,
              } as unknown as React.CSSProperties)
        }
        className={cn("spotlight h-full will-change-transform", className)}
      >
        {children}
      </motion.div>
    </div>
  );
}
