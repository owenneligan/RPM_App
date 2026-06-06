import LeadCaptureForm from "@/components/LeadCaptureForm";

const deliverables = [
  "A scored assessment across seven commercial dimensions",
  "The single biggest constraint on your growth, named clearly",
  "Where your business is leaking margin and why",
  "How AI and automation applies specifically to your context",
  "A prioritised list of what to address first — and what can wait",
];

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
    <section className="section-cream py-24 md:py-32" id="audit">
      <div className="max-w-content mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">

          {/* Left: value framing */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span className="w-6 h-px bg-gold-500/50" />
              <p className="text-xs font-semibold tracking-widest uppercase text-gold-500 font-sans">
                Free Diagnostic
              </p>
            </div>

            <h2
              className="font-sans font-semibold text-navy-900 mb-5"
              style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)", lineHeight: "1.15", letterSpacing: "-0.02em" }}
            >
              The Founder&rsquo;s Commercial Operating System Audit
            </h2>

            <p className="text-cream-muted font-sans leading-relaxed mb-8" style={{ fontSize: "1.0625rem" }}>
              A structured diagnostic of your commercial operating model — reviewed personally and delivered within 48 hours.
            </p>

            {/* What you actually get */}
            <div className="mb-8">
              <p className="text-xs font-semibold uppercase tracking-widest text-cream-muted font-sans mb-4">
                What you receive
              </p>
              <ul className="space-y-3">
                {deliverables.map((d, i) => (
                  <li key={i} className="check-item">
                    <span className="check-icon" aria-hidden>
                      <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                        <path d="M1.5 4L3.5 6L6.5 2" stroke="#C4953A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <span className="text-navy-900/80 text-sm leading-relaxed font-sans">{d}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Audit areas */}
            <div className="mb-8">
              <p className="text-xs font-semibold uppercase tracking-widest text-cream-muted font-sans mb-3">
                Covering 7 dimensions
              </p>
              <div className="flex flex-wrap gap-2">
                {auditAreas.map((a) => (
                  <span key={a} className="text-xs px-3 py-1.5 rounded-full border border-navy-900/12 text-cream-muted font-sans">
                    {a}
                  </span>
                ))}
              </div>
            </div>

            {/* Risk reversal — the honest promise */}
            <div className="rounded-xl border border-navy-900/10 bg-navy-900/4 p-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-navy-900/50 font-sans mb-2">
                What happens next
              </p>
              <p className="text-sm text-navy-900/70 font-sans leading-relaxed">
                There is no pitch on the other end of this. You&rsquo;ll receive the diagnostic within 48 hours.
                If it identifies opportunities worth discussing, you can decide whether to take it further.
                If your business is already well-structured in an area, I&rsquo;ll tell you that too.
              </p>
            </div>
          </div>

          {/* Right: form card on navy */}
          <div className="rounded-2xl bg-navy-900 p-8 md:p-10 shadow-2xl border border-white/5">
            <h3 className="font-sans font-semibold text-offwhite text-xl mb-1">
              Submit your details
            </h3>
            <p className="text-muted text-sm font-sans mb-7">
              Reviewed personally. Delivered within 48 hours.
            </p>
            <LeadCaptureForm variant="full" />
          </div>
        </div>
      </div>
    </section>
  );
}
