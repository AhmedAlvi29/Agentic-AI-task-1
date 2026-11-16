"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";
import { navLinks, site } from "@/lib/data";
import { scrollToId } from "@/lib/lenis";
import { useReady } from "@/components/Providers";
import Magnetic from "./Magnetic";

export default function Nav() {
  const ready = useReady();
  const [active, setActive] = useState<string>("");
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  // hide on scroll down, show on scroll up
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      if (Math.abs(y - last) > 8) {
        setHidden(y > last && y > 240);
        last = y;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // active section tracking
  useEffect(() => {
    const els = navLinks
      .map((l) => document.getElementById(l.id))
      .filter((e): e is HTMLElement => !!e);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // lock page scroll + Esc to close while the mobile menu is open
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.documentElement.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const go = (id: string) => {
    setOpen(false);
    // wait a tick so the overflow lock is released before scrolling
    setTimeout(() => scrollToId(id), 40);
  };

  const show = ready && !hidden;

  return (
    <>
      <motion.header
        initial={{ y: -120, opacity: 0 }}
        animate={{ y: show || open ? 0 : -120, opacity: ready ? 1 : 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4"
      >
        <nav
          aria-label="Primary"
          className={`glass-dark flex w-full max-w-5xl items-center justify-between rounded-full py-2 pl-5 pr-2 transition-shadow duration-500 ${
            scrolled ? "shadow-[0_20px_60px_-20px_rgba(139,92,246,0.6)]" : ""
          }`}
        >
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              scrollToId("top");
            }}
            className="flex items-center gap-2.5 font-display text-sm font-bold"
            aria-label={`${site.name} — back to top`}
          >
            <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-cyan via-violet to-pink text-[0.7rem] text-white">
              {site.name
                .split(" ")
                .map((w) => w[0])
                .join("")}
            </span>
            <span className="hidden sm:inline">{site.name}</span>
          </a>

          <ul className="hidden items-center gap-1 md:flex">
            {navLinks.map((l) => (
              <li key={l.id}>
                <a
                  href={`#${l.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    go(l.id);
                  }}
                  aria-current={active === l.id ? "true" : undefined}
                  className="relative block rounded-full px-4 py-2 text-sm text-white/70 transition-colors hover:text-white aria-[current=true]:text-white"
                >
                  {active === l.id && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 -z-10 rounded-full bg-white/10 ring-1 ring-white/15"
                      transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    />
                  )}
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <Magnetic strength={0.3} className="hidden md:inline-block">
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  go("contact");
                }}
                className="inline-flex rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-cyan"
              >
                Let&apos;s Talk
              </a>
            </Magnetic>
            <button
              type="button"
              className="grid h-10 w-10 place-items-center rounded-full bg-white/10 md:hidden"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((o) => !o)}
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ clipPath: "circle(0% at calc(100% - 40px) 40px)" }}
            animate={{ clipPath: "circle(150% at calc(100% - 40px) 40px)" }}
            exit={{ clipPath: "circle(0% at calc(100% - 40px) 40px)" }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-40 flex flex-col justify-center bg-ink/95 px-8 backdrop-blur-xl md:hidden"
          >
            <ul className="space-y-2">
              {navLinks.map((l, i) => (
                <motion.li
                  key={l.id}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.15 + i * 0.06, duration: 0.5 }}
                >
                  <a
                    href={`#${l.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      go(l.id);
                    }}
                    className="block font-display text-4xl font-bold"
                  >
                    {l.label}
                  </a>
                </motion.li>
              ))}
            </ul>
            <p className="mt-10 text-white/50">{site.email}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
