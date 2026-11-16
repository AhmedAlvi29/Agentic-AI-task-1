import Image from "next/image";
import type { Project } from "@/lib/data";

/**
 * Generated placeholder "screenshot". Replace by setting `image` on a project in lib/data.ts.
 * Purely decorative, so it is hidden from assistive tech (the card text carries the meaning).
 */
export default function ProjectPreview({ project }: { project: Project }) {
  const [a, b] = project.colors;

  return (
    <div
      className="relative aspect-[16/11] w-full overflow-hidden rounded-2xl border border-white/15 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)]"
      style={{ background: `linear-gradient(135deg, ${a}, ${b})` }}
    >
      {project.image ? (
        <Image
          src={project.image}
          alt={`${project.title} screenshot`}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
        />
      ) : (
        <div aria-hidden className="absolute inset-3 flex flex-col overflow-hidden rounded-xl bg-ink/80 backdrop-blur-md sm:inset-5">
          {/* browser chrome */}
          <div className="flex items-center gap-2 border-b border-white/10 px-3 py-2">
            <span className="h-2.5 w-2.5 rounded-full bg-pink" />
            <span className="h-2.5 w-2.5 rounded-full bg-orange" />
            <span className="h-2.5 w-2.5 rounded-full bg-lime" />
            <span className="ml-3 h-4 flex-1 rounded-full bg-white/10" />
          </div>
          <div className="relative flex-1 p-3 sm:p-4">
            {project.layout === "dashboard" && <Dashboard a={a} b={b} />}
            {project.layout === "social" && <Social a={a} b={b} />}
            {project.layout === "health" && <Health a={a} b={b} />}
            {project.layout === "table" && <Table a={a} b={b} />}
          </div>
        </div>
      )}
    </div>
  );
}

type P = { a: string; b: string };

function Dashboard({ a, b }: P) {
  return (
    <div className="grid h-full grid-cols-[2.2rem_1fr] gap-3">
      <div className="flex flex-col gap-2">
        {[a, b, "#ffffff22", "#ffffff22", "#ffffff22"].map((c, i) => (
          <span key={i} className="h-7 rounded-lg" style={{ background: c }} />
        ))}
      </div>
      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-3 gap-2">
          {[a, b, "#ff3d9a"].map((c, i) => (
            <div key={i} className="rounded-lg bg-white/[0.06] p-2">
              <span className="block h-1.5 w-8 rounded bg-white/30" />
              <span className="mt-2 block h-3 w-12 rounded" style={{ background: c }} />
            </div>
          ))}
        </div>
        <div className="relative flex-1 rounded-lg bg-white/[0.05] p-2">
          <svg viewBox="0 0 200 70" className="h-full w-full" preserveAspectRatio="none">
            <defs>
              <linearGradient id="pv-d" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0" stopColor={a} stopOpacity=".55" />
                <stop offset="1" stopColor={a} stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d="M0 55 C20 40 30 60 55 38 S95 20 120 32 S165 8 200 14 V70 H0Z" fill="url(#pv-d)" />
            <path d="M0 55 C20 40 30 60 55 38 S95 20 120 32 S165 8 200 14" fill="none" stroke={b} strokeWidth="2" />
          </svg>
        </div>
        <div className="flex h-9 items-end gap-1.5">
          {[40, 70, 55, 90, 60, 80, 45, 95, 65, 75].map((h, i) => (
            <span key={i} className="flex-1 rounded-t" style={{ height: `${h}%`, background: i % 2 ? a : b }} />
          ))}
        </div>
      </div>
    </div>
  );
}

function Social({ a, b }: P) {
  return (
    <div className="grid h-full grid-cols-[1fr_5rem] gap-3">
      <div className="flex flex-col gap-3">
        {[0, 1].map((i) => (
          <div key={i} className="flex-1 rounded-lg bg-white/[0.06] p-2.5">
            <div className="flex items-center gap-2">
              <span className="h-6 w-6 rounded-full" style={{ background: i ? a : b }} />
              <span className="h-2 w-16 rounded bg-white/40" />
            </div>
            <span className="mt-2 block h-1.5 w-full rounded bg-white/20" />
            <span className="mt-1.5 block h-1.5 w-2/3 rounded bg-white/20" />
            {i === 0 && <span className="mt-2 block h-12 rounded-md" style={{ background: `linear-gradient(90deg, ${a}66, ${b}66)` }} />}
          </div>
        ))}
      </div>
      <div className="flex flex-col items-center gap-2">
        {[a, b, a, b].map((c, i) => (
          <span key={i} className="h-9 w-9 rounded-full ring-2 ring-white/20" style={{ background: c }} />
        ))}
      </div>
    </div>
  );
}

function Health({ a, b }: P) {
  return (
    <div className="grid h-full grid-cols-3 grid-rows-[1fr_auto] gap-3">
      <div className="col-span-2 rounded-lg bg-white/[0.06] p-2">
        <svg viewBox="0 0 200 60" className="h-full w-full" preserveAspectRatio="none">
          <polyline
            points="0,34 30,34 40,12 52,52 64,34 100,34 112,8 124,54 136,34 200,34"
            fill="none"
            stroke={a}
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div className="grid place-items-center rounded-lg bg-white/[0.06]">
        <svg viewBox="0 0 36 36" className="h-14 w-14 -rotate-90">
          <circle cx="18" cy="18" r="14" fill="none" stroke="#ffffff22" strokeWidth="4" />
          <circle cx="18" cy="18" r="14" fill="none" stroke={b} strokeWidth="4" strokeDasharray="62 88" strokeLinecap="round" />
        </svg>
      </div>
      {[a, b, "#ff8a3d"].map((c, i) => (
        <div key={i} className="flex items-center gap-2 rounded-lg bg-white/[0.06] p-2">
          <span className="h-6 w-6 rounded-md" style={{ background: c }} />
          <span className="h-1.5 flex-1 rounded bg-white/30" />
        </div>
      ))}
    </div>
  );
}

function Table({ a, b }: P) {
  return (
    <div className="flex h-full flex-col gap-2">
      <div className="grid grid-cols-[1.5rem_1fr_3rem_3rem] gap-2 px-1">
        <span />
        {[0, 1, 2].map((i) => (
          <span key={i} className="h-1.5 rounded bg-white/30" />
        ))}
      </div>
      {[a, b, "#ff3d9a", a, b].map((c, i) => (
        <div key={i} className="grid grid-cols-[1.5rem_1fr_3rem_3rem] items-center gap-2 rounded-lg bg-white/[0.06] px-2 py-1.5">
          <span className="h-5 w-5 rounded-full" style={{ background: c }} />
          <span className="h-1.5 w-3/4 rounded bg-white/25" />
          <span className="h-1.5 rounded bg-white/15" />
          <span className="h-3.5 rounded-full" style={{ background: i % 2 ? `${a}99` : `${b}99` }} />
        </div>
      ))}
    </div>
  );
}
