import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSupabase } from "@/lib/supabase";

// In-memory rate limiter: max 5 requests per IP per 60 s.
// NOTE: this resets on cold starts and is per-instance only — not suitable for
// multi-region or serverless deployments with many instances. Good enough for
// a low-traffic lead-capture page; replace with Redis/Upstash if you scale.
const rateLimitMap = new Map<string, { count: number; reset: number }>();
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 60_000;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.reset) {
    rateLimitMap.set(ip, { count: 1, reset: now + RATE_WINDOW_MS });
    return false;
  }
  if (entry.count >= RATE_LIMIT) return true;
  entry.count++;
  return false;
}

const LeadSchema = z.object({
  first_name: z.string().trim().min(2, "Please enter your first name.").max(100),
  email: z.string().trim().email("Please enter a valid email address.").toLowerCase(),
  company_name: z.string().trim().max(200).optional(),
  revenue_band: z
    .enum(["Under £500k", "£500k–£1m", "£1m–£2.5m", "£2.5m–£5m", "Over £5m"])
    .optional(),
  biggest_bottleneck: z
    .enum([
      "Sales inconsistency",
      "Operational drag",
      "Founder dependency",
      "Team accountability",
      "Strategy-to-execution gap",
      "AI & automation",
      "Pricing & margin",
      "Other",
    ])
    .optional(),
  source_section: z.enum(["hero", "diagnostic", "cta"]).optional(),
  website: z.string().optional(), // honeypot
});

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "server" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "validation" }, { status: 400 });
  }

  const parsed = LeadSchema.safeParse(body);
  if (!parsed.success) {
    const fields: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "_");
      if (!fields[key]) fields[key] = issue.message;
    }
    return NextResponse.json({ error: "validation", fields }, { status: 400 });
  }

  const { website, first_name, email, company_name, revenue_band, biggest_bottleneck, source_section } =
    parsed.data;

  // Honeypot — bots fill this; real users leave it blank
  if (website && website.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  let supabase;
  try {
    supabase = getSupabase();
  } catch (err) {
    console.warn("Supabase not configured:", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "server" }, { status: 500 });
  }

  const { error } = await supabase.from("leads").insert({
    first_name,
    email,
    company_name: company_name || null,
    revenue_band: revenue_band || null,
    biggest_bottleneck: biggest_bottleneck || null,
    source_section: source_section || null,
  });

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ error: "duplicate" }, { status: 409 });
    }
    console.error("Supabase insert error:", error.message);
    return NextResponse.json({ error: "server" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
