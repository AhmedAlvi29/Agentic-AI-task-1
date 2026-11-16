"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, CheckCircle2, Loader2, Mail, Send } from "lucide-react";
import { FaLinkedinIn } from "react-icons/fa";
import { SiFiverr, SiGithub, SiInstagram, SiX } from "react-icons/si";
import { gsap } from "@/lib/gsap";
import { site, socials } from "@/lib/data";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";
import RevealText from "@/components/ui/RevealText";
import Magnetic from "@/components/ui/Magnetic";

type FormValues = {
  name: string;
  email: string;
  subject: string;
  message: string;
  website: string; // honeypot, must stay empty
};

type Status =
  | { state: "idle" }
  | { state: "sending" }
  | { state: "sent" }
  | { state: "fallback" }
  | { state: "error"; message: string };

const links = [
  { label: "GitHub", href: socials.github, icon: SiGithub, color: "#ffffff" },
  { label: "LinkedIn", href: socials.linkedin, icon: FaLinkedinIn, color: "#3b82f6" },
  { label: "Fiverr", href: socials.fiverr, icon: SiFiverr, color: "#8dff5a" },
  { label: "X", href: socials.x, icon: SiX, color: "#22d3ee" },
  { label: "Instagram", href: socials.instagram, icon: SiInstagram, color: "#ff3d9a" },
];

const fieldBase =
  "peer w-full rounded-2xl border border-white/12 bg-white/[0.04] px-5 pb-3 pt-6 text-white outline-none transition-[border-color,box-shadow,background-color] duration-300 placeholder-transparent focus:border-cyan focus:bg-white/[0.07] focus:shadow-[0_0_0_4px_rgba(34,211,238,0.15)] aria-[invalid=true]:border-pink aria-[invalid=true]:shadow-[0_0_0_4px_rgba(255,61,154,0.15)]";
const labelBase =
  "pointer-events-none absolute left-5 top-2 text-xs text-white/55 transition-all duration-200 peer-placeholder-shown:top-[1.15rem] peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-xs peer-focus:text-cyan";

export default function Contact() {
  const root = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();
  const [status, setStatus] = useState<Status>({ state: "idle" });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    mode: "onTouched",
    defaultValues: { name: "", email: "", subject: "", message: "", website: "" },
  });

  useEffect(() => {
    if (reduced) return;
    const ctx = gsap.context(() => {
      gsap.from(".contact-in", {
        opacity: 0,
        y: 70,
        duration: 1,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: { trigger: ".contact-body", start: "top 80%", once: true },
      });
      gsap.to(".contact-ring", {
        rotate: 180,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
      });
    }, root);
    return () => ctx.revert();
  }, [reduced]);

  const onSubmit = async (values: FormValues) => {
    setStatus({ state: "sending" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string; fallback?: boolean };

      if (res.ok && data.ok) {
        setStatus({ state: "sent" });
        reset();
        return;
      }

      if (data.fallback) {
        // Server has no delivery endpoint configured: hand off to the visitor's email app.
        const subject = encodeURIComponent(values.subject || `Message from ${values.name}`);
        const body = encodeURIComponent(`${values.message}\n\n— ${values.name} (${values.email})`);
        window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
        setStatus({ state: "fallback" });
        return;
      }

      setStatus({ state: "error", message: data.error ?? "Something went wrong. Please try again." });
    } catch {
      setStatus({ state: "error", message: "Network error. Check your connection and try again." });
    }
  };

  const sending = status.state === "sending";

  return (
    <section
      id="contact"
      ref={root}
      aria-labelledby="contact-title"
      className="relative overflow-hidden px-5 py-28 sm:px-8 md:py-40"
    >
      <div
        aria-hidden
        className="contact-ring pointer-events-none absolute -right-[22vmax] top-1/2 h-[56vmax] w-[56vmax] -translate-y-1/2 rounded-full opacity-30 blur-3xl [background:conic-gradient(from_0deg,#8b5cf6,#22d3ee,#8dff5a,#ff8a3d,#ff3d9a,#8b5cf6)]"
      />

      <div className="relative mx-auto max-w-7xl">
        <RevealText
          text="Have an Idea? Let's Build Something Extraordinary."
          as="h2"
          className="max-w-5xl text-[clamp(2.1rem,6vw,5.2rem)] font-black"
          wordClassName=""
        />
        <span id="contact-title" className="sr-only">
          Contact
        </span>

        <div className="contact-body mt-16 grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div className="space-y-10">
            <div className="contact-in">
              <p className="text-white/60">Email</p>
              <Magnetic strength={0.15}>
                <a
                  href={`mailto:${site.email}`}
                  className="group mt-2 flex items-center gap-3 font-display text-[clamp(1.2rem,2.6vw,1.9rem)] font-bold break-all"
                >
                  <Mail className="shrink-0 text-cyan" />
                  <span className="bg-gradient-to-r from-cyan to-pink bg-[length:0%_2px] bg-bottom bg-no-repeat transition-[background-size] duration-500 group-hover:bg-[length:100%_2px]">
                    {site.email}
                  </span>
                </a>
              </Magnetic>
            </div>

            <div className="contact-in">
              <p className="text-white/60">Find me online</p>
              <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {links.map((l) => {
                  const Icon = l.icon;
                  return (
                    <li key={l.label}>
                      <a
                        href={l.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${l.label} (opens in a new tab)`}
                        className="glass group flex items-center justify-between rounded-2xl px-5 py-4 transition-all duration-300 hover:-translate-y-1 hover:border-white/35"
                      >
                        <span className="flex items-center gap-3 font-semibold">
                          <Icon size={20} style={{ color: l.color }} />
                          {l.label}
                        </span>
                        <ArrowUpRight
                          size={18}
                          className="text-white/40 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white"
                        />
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="contact-in glass edge relative rounded-[2rem] p-6 sm:p-9"
            aria-label="Contact form"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="relative">
                <input
                  id="c-name"
                  type="text"
                  autoComplete="name"
                  placeholder=" "
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? "c-name-err" : undefined}
                  className={fieldBase}
                  {...register("name", {
                    required: "Please enter your name.",
                    minLength: { value: 2, message: "Your name is too short." },
                  })}
                />
                <label htmlFor="c-name" className={labelBase}>
                  Your name
                </label>
                {errors.name && (
                  <p id="c-name-err" role="alert" className="mt-1.5 text-sm text-pink">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="relative">
                <input
                  id="c-email"
                  type="email"
                  autoComplete="email"
                  placeholder=" "
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "c-email-err" : undefined}
                  className={fieldBase}
                  {...register("email", {
                    required: "Please enter your email.",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
                      message: "That doesn't look like a valid email.",
                    },
                  })}
                />
                <label htmlFor="c-email" className={labelBase}>
                  Email address
                </label>
                {errors.email && (
                  <p id="c-email-err" role="alert" className="mt-1.5 text-sm text-pink">
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>

            <div className="relative mt-5">
              <input
                id="c-subject"
                type="text"
                placeholder=" "
                className={fieldBase}
                {...register("subject", { maxLength: { value: 150, message: "Keep the subject under 150 characters." } })}
              />
              <label htmlFor="c-subject" className={labelBase}>
                What's it about? (optional)
              </label>
            </div>

            <div className="relative mt-5">
              <textarea
                id="c-message"
                rows={6}
                placeholder=" "
                aria-invalid={!!errors.message}
                aria-describedby={errors.message ? "c-message-err" : undefined}
                className={`${fieldBase} resize-y`}
                {...register("message", {
                  required: "Tell me a little about your idea.",
                  minLength: { value: 10, message: "Please write at least 10 characters." },
                  maxLength: { value: 5000, message: "Please keep it under 5000 characters." },
                })}
              />
              <label htmlFor="c-message" className={labelBase}>
                Your message
              </label>
              {errors.message && (
                <p id="c-message-err" role="alert" className="mt-1.5 text-sm text-pink">
                  {errors.message.message}
                </p>
              )}
            </div>

            {/* honeypot: hidden from people and assistive tech */}
            <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
              <label htmlFor="c-website">Leave this field empty</label>
              <input id="c-website" type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-4">
              <Magnetic strength={0.2}>
                <button
                  type="submit"
                  disabled={sending}
                  className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-full bg-gradient-to-r from-pink via-violet to-electric px-8 py-4 font-semibold text-white shadow-[0_10px_40px_-8px_rgba(255,61,154,0.65)] transition-shadow duration-300 hover:shadow-[0_14px_60px_-6px_rgba(139,92,246,0.9)] disabled:cursor-wait disabled:opacity-70"
                >
                  {sending ? (
                    <>
                      <Loader2 size={18} className="animate-spin" /> Sending…
                    </>
                  ) : (
                    <>
                      Send message
                      <Send size={18} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </Magnetic>

              <div aria-live="polite" className="min-h-6 text-sm">
                <AnimatePresence mode="wait">
                  {status.state === "sent" && (
                    <motion.p
                      key="sent"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2 text-lime"
                    >
                      <CheckCircle2 size={18} /> Message sent. I&apos;ll reply soon.
                    </motion.p>
                  )}
                  {status.state === "fallback" && (
                    <motion.p
                      key="fb"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-cyan"
                    >
                      Opening your email app with the message filled in.
                    </motion.p>
                  )}
                  {status.state === "error" && (
                    <motion.p
                      key="err"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-pink"
                      role="alert"
                    >
                      {status.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
