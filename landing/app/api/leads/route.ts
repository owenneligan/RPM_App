import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

const VALID_REVENUE_BANDS = [
  "Under £500k",
  "£500k–£1m",
  "£1m–£2.5m",
  "£2.5m–£5m",
  "Over £5m",
];

const VALID_BOTTLENECKS = [
  "Sales inconsistency",
  "Operational drag",
  "Founder dependency",
  "Team accountability",
  "Strategy-to-execution gap",
  "AI & automation",
  "Pricing and margin",
  "Other",
];

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "validation", fields: { _: "Invalid request body" } },
      { status: 400 }
    );
  }

  // Honeypot — bots fill hidden fields, legitimate users don't
  if (body.website && String(body.website).trim() !== "") {
    return NextResponse.json({ success: true });
  }

  const firstName = typeof body.first_name === "string" ? body.first_name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const companyName = typeof body.company_name === "string" ? body.company_name.trim().slice(0, 200) : null;
  const revenueBand = typeof body.revenue_band === "string" && VALID_REVENUE_BANDS.includes(body.revenue_band)
    ? body.revenue_band
    : null;
  const biggestBottleneck =
    typeof body.biggest_bottleneck === "string" && VALID_BOTTLENECKS.includes(body.biggest_bottleneck)
      ? body.biggest_bottleneck
      : null;

  // Validate required fields
  const fieldErrors: Record<string, string> = {};
  if (!firstName) fieldErrors.first_name = "Please enter your first name.";
  if (firstName.length > 100) fieldErrors.first_name = "Name is too long.";
  if (!email) fieldErrors.email = "Please enter your email address.";
  else if (!isValidEmail(email)) fieldErrors.email = "Please enter a valid email address.";

  if (Object.keys(fieldErrors).length > 0) {
    return NextResponse.json(
      { success: false, error: "validation", fields: fieldErrors },
      { status: 400 }
    );
  }

  // Duplicate check
  const supabase = getSupabase();
  const { data: existing, error: selectError } = await supabase
    .from("leads")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (selectError) {
    console.error("Supabase select error:", selectError.message);
    return NextResponse.json({ success: false, error: "server" }, { status: 500 });
  }

  if (existing) {
    return NextResponse.json(
      {
        success: false,
        error: "duplicate",
        message: "You're already on the list — we'll be in touch.",
      },
      { status: 409 }
    );
  }

  // Insert lead
  const { error: insertError } = await supabase.from("leads").insert({
    first_name: firstName,
    email,
    company_name: companyName || null,
    revenue_band: revenueBand,
    biggest_bottleneck: biggestBottleneck,
    source_page: "landing",
  });

  if (insertError) {
    // Catch race-condition duplicates via unique index violation
    if (insertError.code === "23505") {
      return NextResponse.json(
        {
          success: false,
          error: "duplicate",
          message: "You're already on the list — we'll be in touch.",
        },
        { status: 409 }
      );
    }
    console.error("Supabase insert error:", insertError.message);
    return NextResponse.json({ success: false, error: "server" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
