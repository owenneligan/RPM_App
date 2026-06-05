import LeadCaptureForm from "@/components/LeadCaptureForm";

const auditAreas = [
  "Strategy clarity",
  "Sales pipeline",
  "Operational efficiency",
  "Pricing & margin",
  "AI readiness",
  "Team accountability",
  "Execution rhythm",
];

export default function Diagnostic() {
  return (
    <section className="py-24 md:py-32 bg-navy-800/40" id="audit">
      <div className="max-w-content mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Left: value proposition */}
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-gold-500 mb-5">
              Free Diagnostic
            </p>

            <h2
              className="font-display font-semibold text-offwhite leading-tight mb-5"
              style={{ fontSize: "clamp(2rem, 3.5vw, 3rem)", letterSpacing: "-0.015em" }}
            >
              The Founder&apos;s Commercial Operating System Audit
            </h2>

            <p className="text-muted mb-6 leading-relaxed" style={{ fontSize: "1.0625rem" }}>
              A structured diagnostic that maps exactly where your business is leaking growth.
            </p>

            <p className="text-muted/80 text-sm leading-relaxed mb-8">
              Covering strategy, sales, operations, pricing, AI readiness, and execution
              discipline — this audit gives you a clear view of what&apos;s working, what isn&apos;t,
              and what to fix first.
            </p>

            {/* Audit areas checklist */}
            <div className="mb-8">
              <p className="text-xs font-semibold tracking-widest uppercase text-muted mb-4">
                The audit covers
              </p>
              <ul className="space-y-2.5">
                {auditAreas.map((area) => (
                  <li key={area} className="flex items-center gap-3 text-sm text-offwhite/80">
                    <span className="flex-shrink-0 w-4 h-4 rounded-full border border-gold-500/50 bg-gold-500/10 flex items-center justify-center">
                      <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                        <path
                          d="M1.5 4L3.5 6L6.5 2"
                          stroke="#C4953A"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    {area}
                  </li>
                ))}
              </ul>
            </div>

            {/* Value anchor — Hormozi */}
            <div className="rounded-xl border border-gold-500/25 bg-gold-500/5 p-5">
              <div className="flex items-start gap-3">
                <div className="shrink-0 mt-0.5 text-gold-500">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-offwhite font-medium mb-1">
                    Most consultants charge £1,500–£3,000 for a diagnostic like this.
                  </p>
                  <p className="text-xs text-muted leading-relaxed">
                    We give it free to the right founders, because the conversation it starts is
                    worth more than the fee. No sales call required — unless you want one.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: form card */}
          <div className="rounded-2xl border border-white/5 bg-navy-800/80 p-8 md:p-10 shadow-2xl">
            <h3 className="font-display text-xl font-semibold text-offwhite mb-1">
              Get Your Free Audit
            </h3>
            <p className="text-muted text-sm mb-7">
              Reviewed personally by Owen. Delivered within 48 hours.
            </p>
            <LeadCaptureForm variant="full" />
          </div>
        </div>
      </div>
    </section>
  );
}
