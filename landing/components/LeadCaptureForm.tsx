"use client";

import { useState, useRef } from "react";

type Variant = "hero" | "full" | "cta";

interface Props {
  variant?: Variant;
}

type FormStatus = "idle" | "submitting" | "success" | "duplicate" | "error";

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
  "Pricing and margin",
  "Other",
];

export default function LeadCaptureForm({ variant = "full" }: Props) {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState<FormState>({
    first_name: "",
    email: "",
    company_name: "",
    revenue_band: "",
    biggest_bottleneck: "",
    website: "",
  });

  const formRef = useRef<HTMLFormElement>(null);

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setFieldErrors({});

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: form.first_name,
          email: form.email,
          company_name: form.company_name || undefined,
          revenue_band: form.revenue_band || undefined,
          biggest_bottleneck: form.biggest_bottleneck || undefined,
          website: form.website,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setStatus("success");
        return;
      }

      if (data.error === "duplicate") {
        setStatus("duplicate");
        return;
      }

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

  if (status === "success") {
    return (
      <div className="rounded-xl border border-gold-500/30 bg-gold-500/5 p-8 text-center">
        <div className="mb-3 text-2xl">✓</div>
        <p className="font-display text-xl text-gold-400">You&apos;re on the list.</p>
        <p className="mt-2 text-muted text-sm leading-relaxed">
          Expect a personal email from Owen shortly — with your audit and next steps.
        </p>
      </div>
    );
  }

  if (status === "duplicate") {
    return (
      <div className="rounded-xl border border-gold-500/20 bg-navy-800/60 p-8 text-center">
        <p className="font-display text-xl text-offwhite">You&apos;re already on the list.</p>
        <p className="mt-2 text-muted text-sm">We&apos;ll be in touch — watch your inbox.</p>
      </div>
    );
  }

  const isSubmitting = status === "submitting";

  if (variant === "hero") {
    return (
      <form onSubmit={handleSubmit} className="w-full space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <input
              type="text"
              placeholder="First name"
              value={form.first_name}
              onChange={(e) => update("first_name", e.target.value)}
              className={`form-input ${fieldErrors.first_name ? "error" : ""}`}
              autoComplete="given-name"
              disabled={isSubmitting}
            />
            {fieldErrors.first_name && (
              <p className="mt-1 text-xs text-red-400">{fieldErrors.first_name}</p>
            )}
          </div>
          <div className="flex-[1.5]">
            <input
              type="email"
              placeholder="Your email address"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              className={`form-input ${fieldErrors.email ? "error" : ""}`}
              autoComplete="email"
              disabled={isSubmitting}
            />
            {fieldErrors.email && (
              <p className="mt-1 text-xs text-red-400">{fieldErrors.email}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="shrink-0 rounded-lg bg-gold-500 hover:bg-gold-400 text-navy-900 font-semibold px-6 py-3 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {isSubmitting ? "Sending…" : "Get Your Free Audit →"}
          </button>
        </div>
        {/* Honeypot — hidden from real users */}
        <input
          type="text"
          name="website"
          value={form.website}
          onChange={(e) => update("website", e.target.value)}
          tabIndex={-1}
          aria-hidden="true"
          className="opacity-0 absolute -left-[9999px] h-0 w-0"
          autoComplete="off"
        />
        {status === "error" && (
          <p className="text-xs text-red-400">
            Something went wrong — please try again or email{" "}
            <span className="underline">[your@email.com]</span>.
          </p>
        )}
      </form>
    );
  }

  if (variant === "cta") {
    return (
      <form onSubmit={handleSubmit} className="w-full space-y-3 max-w-lg">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="First name"
            value={form.first_name}
            onChange={(e) => update("first_name", e.target.value)}
            className={`form-input flex-1 ${fieldErrors.first_name ? "error" : ""}`}
            autoComplete="given-name"
            disabled={isSubmitting}
          />
          <input
            type="email"
            placeholder="Email address"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            className={`form-input flex-[1.5] ${fieldErrors.email ? "error" : ""}`}
            autoComplete="email"
            disabled={isSubmitting}
          />
        </div>
        {(fieldErrors.first_name || fieldErrors.email) && (
          <div className="space-y-1">
            {fieldErrors.first_name && (
              <p className="text-xs text-red-400">{fieldErrors.first_name}</p>
            )}
            {fieldErrors.email && (
              <p className="text-xs text-red-400">{fieldErrors.email}</p>
            )}
          </div>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-gold-500 hover:bg-gold-400 text-navy-900 font-semibold px-6 py-4 text-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Sending…" : "Get the Free Audit →"}
        </button>
        {/* Honeypot */}
        <input
          type="text"
          name="website"
          value={form.website}
          onChange={(e) => update("website", e.target.value)}
          tabIndex={-1}
          aria-hidden="true"
          className="opacity-0 absolute -left-[9999px] h-0 w-0"
          autoComplete="off"
        />
        {status === "error" && (
          <p className="text-xs text-red-400 text-center">
            Something went wrong — please try again.
          </p>
        )}
        <p className="text-xs text-muted text-center leading-relaxed">
          By submitting your details, you agree to receive occasional insights from Owen
          Neligan. No spam. Unsubscribe any time.
        </p>
      </form>
    );
  }

  // Full variant (Diagnostic section)
  return (
    <form onSubmit={handleSubmit} ref={formRef} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-offwhite/80 mb-1.5">
            First name <span className="text-gold-500">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Sarah"
            value={form.first_name}
            onChange={(e) => update("first_name", e.target.value)}
            className={`form-input ${fieldErrors.first_name ? "error" : ""}`}
            autoComplete="given-name"
            disabled={isSubmitting}
          />
          {fieldErrors.first_name && (
            <p className="mt-1 text-xs text-red-400">{fieldErrors.first_name}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-offwhite/80 mb-1.5">
            Email address <span className="text-gold-500">*</span>
          </label>
          <input
            type="email"
            placeholder="you@yourcompany.com"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            className={`form-input ${fieldErrors.email ? "error" : ""}`}
            autoComplete="email"
            disabled={isSubmitting}
          />
          {fieldErrors.email && (
            <p className="mt-1 text-xs text-red-400">{fieldErrors.email}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-offwhite/80 mb-1.5">
          Company name{" "}
          <span className="text-muted font-normal text-xs">(optional)</span>
        </label>
        <input
          type="text"
          placeholder="e.g. Apex Consulting Ltd"
          value={form.company_name}
          onChange={(e) => update("company_name", e.target.value)}
          className="form-input"
          autoComplete="organization"
          disabled={isSubmitting}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-offwhite/80 mb-1.5">
            Annual revenue{" "}
            <span className="text-muted font-normal text-xs">(optional)</span>
          </label>
          <select
            value={form.revenue_band}
            onChange={(e) => update("revenue_band", e.target.value)}
            className="form-input appearance-none cursor-pointer"
            disabled={isSubmitting}
          >
            <option value="" disabled>
              Select a range
            </option>
            {REVENUE_BANDS.map((band) => (
              <option key={band} value={band}>
                {band}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-offwhite/80 mb-1.5">
            Biggest growth bottleneck{" "}
            <span className="text-muted font-normal text-xs">(optional)</span>
          </label>
          <select
            value={form.biggest_bottleneck}
            onChange={(e) => update("biggest_bottleneck", e.target.value)}
            className="form-input appearance-none cursor-pointer"
            disabled={isSubmitting}
          >
            <option value="" disabled>
              Select one
            </option>
            {BOTTLENECKS.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Honeypot — hidden from real users */}
      <input
        type="text"
        name="website"
        value={form.website}
        onChange={(e) => update("website", e.target.value)}
        tabIndex={-1}
        aria-hidden="true"
        className="opacity-0 absolute -left-[9999px] h-0 w-0"
        autoComplete="off"
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-gold-500 hover:bg-gold-400 text-navy-900 font-semibold px-6 py-4 text-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
      >
        {isSubmitting ? "Sending…" : "Send Me the Audit →"}
      </button>

      {status === "error" && (
        <p className="text-sm text-red-400 text-center">
          Something went wrong — please try again or email{" "}
          <span className="underline">[your@email.com]</span>.
        </p>
      )}

      <p className="text-xs text-muted text-center leading-relaxed">
        By submitting your details, you agree to receive occasional insights from Owen
        Neligan. No spam. Unsubscribe any time. Your details are handled in accordance
        with UK data protection law.
      </p>
    </form>
  );
}
