import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center px-6 text-center">
      <div>
        <p className="text-white/60">Error 404</p>
        <h1 className="mt-2 text-[clamp(3rem,12vw,9rem)] font-black text-gradient">Lost in space</h1>
        <p className="mx-auto mt-4 max-w-md text-white/70">
          This page doesn&apos;t exist. Head back to the portfolio.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex rounded-full bg-white px-7 py-3.5 font-semibold text-ink transition-colors hover:bg-cyan"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}
