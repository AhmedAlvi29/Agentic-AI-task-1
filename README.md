# Ahmed Raza — 3D Developer Portfolio

Next.js (App Router) · TypeScript · Tailwind CSS v4 · Three.js / React Three Fiber / Drei / Postprocessing · GSAP + ScrollTrigger · Motion · Lenis · React Hook Form

## Run

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

## Edit your content

Everything lives in **`lib/data.ts`**: name, role, email, social links, skills, projects, timeline, services.
Search for `TODO` — those values are placeholders (email, social URLs, project demo/GitHub links, years of experience).

- **Project screenshots:** drop an image in `public/projects/` and set `image: "/projects/name.png"` on the project. Without it, a generated preview is shown.
- **Colours / type:** `app/globals.css` (`@theme` block).

## Contact form

`POST /api/contact` validates the message, rate-limits, and forwards it as JSON to `CONTACT_WEBHOOK_URL`
(n8n webhook, Formspree, Make, Zapier, …). Copy `.env.example` to `.env.local` and set it.
If it isn't set, the form falls back to opening the visitor's email app with the message filled in.

## Structure

```
app/            layout, page, contact API, robots, sitemap, 404, icon
components/
  Providers.tsx     Lenis smooth scroll + intro-curtain "ready" state
  sections/         Hero, About, Skills, Projects, Experience, Services, Contact, Footer
  three/            HeroCanvas (lazy, WebGL-checked) + HeroScene (R3F)
  ui/               Nav, Button, Magnetic, TiltCard, RevealText, CursorGlow, ScrollProgress, ...
hooks/          hydration-safe media-query hooks (reduced motion, mobile, coarse pointer)
lib/            data.ts, gsap.ts, lenis.ts
```

## Performance and accessibility notes

- The 3D scene is dynamically imported on the client, paused when off-screen, lighter on mobile (fewer objects, no bloom, lower DPR) and drops resolution automatically if the frame rate falls.
- `prefers-reduced-motion`: no intro curtain, no smooth scroll, no scroll animations, static 3D frame.
- Custom cursor and tilt effects are disabled on touch devices.
