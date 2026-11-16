"use client";

import { cn } from "@/lib/utils";
import { scrollToId } from "@/lib/lenis";
import Magnetic from "./Magnetic";

type Variant = "primary" | "ghost";

type Props = {
  children: React.ReactNode;
  /** `#section-id` scrolls smoothly; any other value is a normal link. */
  href?: string;
  variant?: Variant;
  className?: string;
  external?: boolean;
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: () => void;
  magnetic?: boolean;
  ariaLabel?: string;
};

const base =
  "group relative inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-[0.95rem] font-semibold transition-[box-shadow,background-color,border-color] duration-300 disabled:cursor-not-allowed disabled:opacity-60";

const variants: Record<Variant, string> = {
  primary:
    "bg-gradient-to-r from-pink via-violet to-electric text-white shadow-[0_0_0_1px_rgba(255,255,255,0.15)_inset,0_10px_40px_-8px_rgba(255,61,154,0.65)] hover:shadow-[0_0_0_1px_rgba(255,255,255,0.3)_inset,0_14px_60px_-6px_rgba(139,92,246,0.9)]",
  ghost:
    "glass text-white hover:border-white/40 hover:bg-white/10",
};

export default function Button({
  children,
  href,
  variant = "primary",
  className,
  external,
  type = "button",
  disabled,
  onClick,
  magnetic = true,
  ariaLabel,
}: Props) {
  const classes = cn(base, variants[variant], className);

  let node: React.ReactNode;
  if (href && href.startsWith("#")) {
    node = (
      <a
        href={href}
        aria-label={ariaLabel}
        className={classes}
        onClick={(e) => {
          e.preventDefault();
          scrollToId(href.slice(1));
          onClick?.();
        }}
      >
        {children}
      </a>
    );
  } else if (href) {
    node = (
      <a
        href={href}
        aria-label={ariaLabel}
        className={classes}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        onClick={onClick}
      >
        {children}
      </a>
    );
  } else {
    node = (
      <button type={type} disabled={disabled} onClick={onClick} aria-label={ariaLabel} className={classes}>
        {children}
      </button>
    );
  }

  return magnetic && !disabled ? <Magnetic strength={0.25}>{node}</Magnetic> : node;
}
