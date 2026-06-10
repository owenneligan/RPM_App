"use client";

import { useState } from "react";

type Variant = "hero" | "diagnostic" | "cta";

interface Props {
  variant?: Variant;
}

type Status = "idle" | "submitting" | "success" | "duplicate" | "error";

interface FormState {
  first_name: string;
  email: string;
  company_name: string;
  revenue_band: string;
  biggest_bottleneck: string;
  website: string; // honeypot
}

const REVENUE_BANDS = [
  "Under £500k",
  "£500k–£1m",
  "£1m–£2.5m",
  "£2.5m–£5m",
  "Over £5m",
];

const BOTTLENECKS = [
  "Sales inconsistency",
  "Operational drag",
  "Founder dependency",
  "Team accountability",
  "Strategy-to-execution gap",
  "AI & automation",
  "Pricing & margin",
  "Other",
];

const CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "hello@mainspringadvisory.co.uk";

function tallyUrl(email: string, firstName: string): string {
  const base = process.env.NEXT_PUBLIC_TALLY_URL ?? "https://tally.so/r/PLACEHOLDER";
  const params = new URLSearchParams({ email, name: firstName });
  return `${base}?${params.toString()}`;
}

export default function LeadCaptureForm({ variant = "diagnostic" }: Props) {
  const [status, setStatus] = useState<Status>("idle");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState<FormState>({
    first_name: "",
    email: "",
    company_name: "",
    revenue_band: "",
    biggest_bottleneck: "",
    website: "",
  });

  function update(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  }

  function validate(): Record<string, string> {
    const errs: Record<string, string> = {};
    if (!form.first_name.trim() || form.first_name.trim().length < 2)
      errs.first_name = "Please enter your first name.";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = "Please enter a valid email address.";
    return errs;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const errs = validate();
    if (Object.keys(errs).length) {
      setFieldErrors(errs);
      return;
    }

    setStatus("submitting");
    setFieldErrors({});

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: form.first_name,
          email: form.email.toLowerCase(),
          company_name: form.company_name || undefined,
          revenue_band: form.revenue_band || undefined,
          biggest_bottleneck: form.biggest_bottleneck || undefined,
          source_section: variant === "diagnostic" ? "diagnostic" : variant === "hero" ? "hero" : "cta",
          website: form.website,
        }),
      });

      const data = (await res.json()) as { ok?: boolean; error?: string; fields?: Record<string, string> };

      if (data.ok) { setStatus("success"); return; }
      if (data.error === "duplicate") { setStatus("duplicate"); return; }
      if (data.error === "validation" && data.fields) {
        setFieldErrors(data.fields);
        setStatus("idle");
        return;
      }
      setStatus("error");
    } catch {
      setStatus("error");
    }
  }

  // ── Success state ──────────────────────────────────────────────────────────
  if (status === "success" || status === "duplicate") {
    const isDuplicate = status === "duplicate";
    return (
      <div className="space-y-5">
        <p className="font-display font-semibold text-parchment" style={{ fontSize: "clamp(1.5rem,2.5vw,2rem)" }}>
          {isDuplicate ? "You’re already on the list." : "You’re in."}
        </p>
        <p className="text-steel" style={{ fontSize: "0.9375rem", lineHeight: 1.65 }}>
          {isDuplicate
            ? "You’re already on the list — if you haven’t completed the questionnaire yet, here it is:"
            : "One more step — the diagnostic itself takes twelve minutes. Answer honestly, not aspirationally:"}
        </p>
        <a
          href={tallyUrl(form.email, form.first_name)}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-brass"
        >
          BEGIN THE DIAGNOSTIC &rarr;
        </a>
        <p className="text-steel" style={{ fontSize: "0.8125rem" }}>
          Your scored audit lands within 48 hours of completing it. — Owen
        </p>
      </div>
    );
  }

  const busy = status === "submitting";

  // ── Hero variant ───────────────────────────────────────────────────────────
  if (variant === "hero") {
    return (
      <form onSubmit={handleSubmit} noValidate className="w-full space-y-3">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex-1">
            <input
              type="text"
              placeholder="First name"
              value={form.first_name}
              onChange={(e) => update("first_name", e.target.value)}
              className={`field-input ${fieldErrors.first_name ? "field-error" : ""}`}
              autoComplete="given-name"
              disabled={busy}
              aria-label="First name"
            />
            {fieldErrors.first_name && (
              <p className="mt-1 text-xs" style={{ color: "#e05555" }}>{fieldErrors.first_name}</p>
            )}
          </div>
          <div className="flex-[1.4]">
            <input
              type="email"
              placeholder="Your email address"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              className={`field-input ${fieldErrors.email ? "field-error" : ""}`}
              autoComplete="email"
              disabled={busy}
              aria-label="Email address"
            />
            {fieldErrors.email && (
              <p className="mt-1 text-xs" style={{ color: "#e05555" }}>{fieldErrors.email}</p>
            )}
          </div>
          <button type="submit" disabled={busy} className="btn-brass shrink-0">
            {busy ? "Sending…" : "GET THE FREE DIAGNOSTIC →"}
          </button>
        </div>
        <input type="text" name="website" value={form.website} onChange={(e) => update("website", e.target.value)}
          tabIndex={-1} aria-hidden="true" className="sr-only" autoComplete="off" />
        {status === "error" && (
          <p className="text-xs" style={{ color: "#e05555" }}>
            Something went wrong — try again, or email{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="brass-link">{CONTACT_EMAIL}</a>{" "}
            and the diagnostic will be sorted manually.
          </p>
        )}
      </form>
    );
  }

  // ── CTA variant ────────────────────────────────────────────────────────────
  if (variant === "cta") {
    return (
      <form onSubmit={handleSubmit} noValidate className="w-full space-y-3 max-w-xl">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex-1">
            <input
              type="text"
              placeholder="First name"
              value={form.first_name}
              onChange={(e) => update("first_name", e.target.value)}
              className={`field-input ${fieldErrors.first_name ? "field-error" : ""}`}
              autoComplete="given-name"
              disabled={busy}
              aria-label="First name"
            />
          </div>
          <div className="flex-[1.4]">
            <input
              type="email"
              placeholder="Email address"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              className={`field-input ${fieldErrors.email ? "field-error" : ""}`}
              autoComplete="email"
              disabled={busy}
              aria-label="Email address"
            />
          </div>
          <button type="submit" disabled={busy} className="btn-brass shrink-0">
            {busy ? "Sending…" : "GET THE FREE DIAGNOSTIC →"}
          </button>
        </div>
        {(fieldErrors.first_name || fieldErrors.email) && (
          <p className="text-xs" style={{ color: "#e05555" }}>
            {fieldErrors.first_name || fieldErrors.email}
          </p>
        )}
        <input type="text" name="website" value={form.website} onChange={(e) => update("website", e.target.value)}
          tabIndex={-1} aria-hidden="true" className="sr-only" autoComplete="off" />
        {status === "error" && (
          <p className="text-xs" style={{ color: "#e05555" }}>
            Something went wrong — try again, or email{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="brass-link">{CONTACT_EMAIL}</a>{" "}
            and the diagnostic will be sorted manually.
          </p>
        )}
      </form>
    );
  }

  // ── Diagnostic (full) variant ──────────────────────────────────────────────
  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block mb-1.5" style={{ fontSize: "0.8125rem", color: "#8D9296" }}>
            First name <span style={{ color: "#B9893E" }}>*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Sarah"
            value={form.first_name}
            onChange={(e) => update("first_name", e.target.value)}
            className={`field-input ${fieldErrors.first_name ? "field-error" : ""}`}
            autoComplete="given-name"
            disabled={busy}
          />
          {fieldErrors.first_name && (
            <p className="mt-1 text-xs" style={{ color: "#e05555" }}>{fieldErrors.first_name}</p>
          )}
        </div>
        <div>
          <label className="block mb-1.5" style={{ fontSize: "0.8125rem", color: "#8D9296" }}>
            Email address <span style={{ color: "#B9893E" }}>*</span>
          </label>
          <input
            type="email"
            placeholder="you@yourcompany.com"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            className={`field-input ${fieldErrors.email ? "field-error" : ""}`}
            autoComplete="email"
            disabled={busy}
          />
          {fieldErrors.email && (
            <p className="mt-1 text-xs" style={{ color: "#e05555" }}>{fieldErrors.email}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block mb-1.5" style={{ fontSize: "0.8125rem", color: "#8D9296" }}>
          Company name <span style={{ fontSize: "0.75rem", color: "#8D9296" }}>(optional)</span>
        </label>
        <input
          type="text"
          placeholder="e.g. Apex Consulting Ltd"
          value={form.company_name}
          onChange={(e) => update("company_name", e.target.value)}
          className="field-input"
          autoComplete="organization"
          disabled={busy}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block mb-1.5" style={{ fontSize: "0.8125rem", color: "#8D9296" }}>
            Annual revenue <span style={{ fontSize: "0.75rem", color: "#8D9296" }}>(optional)</span>
          </label>
          <select
            value={form.revenue_band}
            onChange={(e) => update("revenue_band", e.target.value)}
            className="field-input appearance-none cursor-pointer"
            disabled={busy}
            aria-label="Annual revenue band"
          >
            <option value="" disabled>Select a range</option>
            {REVENUE_BANDS.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
        <div>
          <label className="block mb-1.5" style={{ fontSize: "0.8125rem", color: "#8D9296" }}>
            Biggest growth bottleneck <span style={{ fontSize: "0.75rem", color: "#8D9296" }}>(optional)</span>
          </label>
          <select
            value={form.biggest_bottleneck}
            onChange={(e) => update("biggest_bottleneck", e.target.value)}
            className="field-input appearance-none cursor-pointer"
            disabled={busy}
            aria-label="Biggest growth bottleneck"
          >
            <option value="" disabled>Select one</option>
            {BOTTLENECKS.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
      </div>

      {/* Honeypot */}
      <input type="text" name="website" value={form.website} onChange={(e) => update("website", e.target.value)}
        tabIndex={-1} aria-hidden="true" className="sr-only" autoComplete="off" />

      <button type="submit" disabled={busy} className="btn-brass w-full" style={{ padding: "1rem 2rem", fontSize: "0.8125rem" }}>
        {busy ? "Sending…" : "START THE DIAGNOSTIC →"}
      </button>

      {status === "error" && (
        <p className="text-sm text-center" style={{ color: "#e05555" }}>
          Something went wrong — try again, or email{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="brass-link">{CONTACT_EMAIL}</a>{" "}
          and the diagnostic will be sorted manually.
        </p>
      )}

      <p className="text-center" style={{ fontSize: "0.8125rem", color: "#8D9296", lineHeight: 1.65 }}>
        Step one takes thirty seconds. The diagnostic itself takes twelve minutes.
      </p>
    </form>
  );
}
