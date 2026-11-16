import { NextResponse } from "next/server";

export const runtime = "nodejs";

type Payload = {
  name?: unknown;
  email?: unknown;
  subject?: unknown;
  message?: unknown;
  website?: unknown; // honeypot
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Very small in-memory rate limit (per server instance). Use a shared store in production.
const hits = new Map<string, number[]>();
const WINDOW_MS = 60_000;
const MAX_HITS = 4;

function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_HITS;
}

const str = (v: unknown, max: number) =>
  typeof v === "string" ? v.trim().slice(0, max) : "";

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (limited(ip)) {
    return NextResponse.json(
      { ok: false, error: "Too many messages. Please wait a minute and try again." },
      { status: 429 },
    );
  }

  let body: Payload;
  try {
    body = (await req.json()) as Payload;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  // Bots fill the hidden field; pretend success so they move on.
  if (str(body.website, 100)) return NextResponse.json({ ok: true });

  const name = str(body.name, 100);
  const email = str(body.email, 200);
  const subject = str(body.subject, 150);
  const message = str(body.message, 5000);

  if (name.length < 2) return NextResponse.json({ ok: false, error: "Please enter your name." }, { status: 400 });
  if (!EMAIL_RE.test(email)) return NextResponse.json({ ok: false, error: "Please enter a valid email." }, { status: 400 });
  if (message.length < 10) return NextResponse.json({ ok: false, error: "Your message is too short." }, { status: 400 });

  const webhook = process.env.CONTACT_WEBHOOK_URL;
  if (!webhook) {
    // Not configured: tell the client so it can fall back to the visitor's email app.
    return NextResponse.json(
      { ok: false, error: "Delivery isn't configured on the server yet.", fallback: true },
      { status: 503 },
    );
  }

  try {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        name,
        email,
        subject,
        message,
        receivedAt: new Date().toISOString(),
        source: "portfolio-contact-form",
      }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact] delivery failed", err);
    return NextResponse.json(
      { ok: false, error: "Couldn't send your message. Please try again or email me directly." },
      { status: 502 },
    );
  }
}
