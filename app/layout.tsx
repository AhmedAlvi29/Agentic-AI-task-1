import type { Metadata, Viewport } from "next";
import "@fontsource/unbounded/700.css";
import "@fontsource/unbounded/900.css";
import "@fontsource-variable/figtree";
import "./globals.css";
import { site, socials } from "@/lib/data";
import Providers from "@/components/Providers";
import Aurora from "@/components/ui/Aurora";
import CursorGlow from "@/components/ui/CursorGlow";
import ScrollProgress from "@/components/ui/ScrollProgress";
import Nav from "@/components/ui/Nav";

export const viewport: Viewport = {
  themeColor: "#06050d",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.role}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  keywords: [
    "Full Stack Developer",
    "AI Engineer",
    "Next.js",
    "React",
    "Node.js",
    "AI agents",
    "Portfolio",
  ],
  authors: [{ name: site.name }],
  creator: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    title: `${site.name} — ${site.role}`,
    description: site.description,
    siteName: `${site.name} Portfolio`,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.role}`,
    description: site.description,
  },
  robots: { index: true, follow: true },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  jobTitle: site.role,
  url: site.url,
  sameAs: [socials.github, socials.linkedin, socials.fiverr],
  knowsAbout: ["Web development", "Next.js", "Artificial intelligence", "AI agents"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="noise">
      <body>
        <noscript>
          <style>{`.preloader{display:none!important}`}</style>
        </noscript>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <a
          href="#about"
          className="sr-only z-[110] rounded-full bg-white px-4 py-2 font-semibold text-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Skip to content
        </a>
        <Providers>
          <Aurora />
          <ScrollProgress />
          <CursorGlow />
          <Nav />
          {children}
        </Providers>
      </body>
    </html>
  );
}
