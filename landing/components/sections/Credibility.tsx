const credentials = [
  "MBA Qualified",
  "Lean Six Sigma Black Belt",
  "Senior Insurance & Financial Services Leadership",
  "Strategy · Operations · Commercial Growth",
  "AI-Enabled Transformation",
  "Cross-functional Change Leadership",
];

const testimonials = [
  {
    quote:
      "Owen reframed how we thought about our commercial model entirely. Three months in, we have a pipeline that works, a team that owns their numbers, and a clear 18-month plan. I'm no longer in every sales conversation.",
    author: "Founder, B2B services business",
    detail: "£2.3m revenue",
  },
  {
    quote:
      "I knew what needed to change but couldn't see how to do it without breaking what was working. Owen built the operating model around us. It just runs now.",
    author: "MD, professional services firm",
    detail: "£1.1m revenue",
  },
];

export default function Credibility() {
  return (
    <section className="py-24 md:py-32 bg-navy-900">
      <div className="max-w-content mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left: about + credentials */}
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-gold-500 mb-5">
              About Owen
            </p>

            <h2
              className="font-display font-semibold text-offwhite leading-tight mb-6"
              style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)", letterSpacing: "-0.015em" }}
            >
              Commercial rigour, without the corporate overhead.
            </h2>

            <div className="space-y-4 text-sm text-muted leading-relaxed mb-8">
              <p>
                I work exclusively with founder-led businesses turning between £500k and £5m.
                That&apos;s a deliberate choice — it&apos;s the stage where most commercial potential is
                either captured or permanently lost, and where structured infrastructure pays
                back fastest.
              </p>
              <p>
                My background spans commercial strategy, operational redesign, and AI-enabled
                efficiency. I hold an MBA and a Lean Six Sigma Black Belt, but what I bring to
                client engagements isn&apos;t theory — it&apos;s a structured method for building the
                commercial architecture that most growing businesses lack.
              </p>
              <p>
                I don&apos;t believe in change for change&apos;s sake. I believe in the smallest
                structural interventions that produce the largest commercial results.
              </p>
            </div>

            {/* Credential badges */}
            <div className="flex flex-wrap gap-2 mb-8">
              {credentials.map((cred) => (
                <span
                  key={cred}
                  className="text-xs px-3 py-1.5 rounded-full border border-gold-500/25 bg-gold-500/5 text-offwhite/80"
                >
                  {cred}
                </span>
              ))}
            </div>

            {/* LinkedIn */}
            <a
              href="https://linkedin.com/in/owenneligan"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-gold-500 hover:text-gold-400 transition-colors duration-200 font-medium"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect x="2" y="9" width="4" height="12" />
                <circle cx="4" cy="4" r="2" />
              </svg>
              Connect on LinkedIn →
            </a>
          </div>

          {/* Right: testimonials */}
          <div className="space-y-6">
            <p className="text-xs font-semibold tracking-widest uppercase text-muted mb-2">
              {/* PLACEHOLDER — replace with real testimonials before launch */}
              Client Results
            </p>
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="rounded-xl border border-white/5 bg-navy-800/60 p-7 hover:border-gold-500/15 transition-all duration-300"
              >
                {/* PLACEHOLDER */}
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <svg key={j} width="12" height="12" viewBox="0 0 12 12" fill="#C4953A">
                      <path d="M6 1l1.3 2.6 2.9.4-2.1 2 .5 2.9L6 7.5 3.4 8.9l.5-2.9-2.1-2 2.9-.4z" />
                    </svg>
                  ))}
                </div>
                <blockquote className="text-offwhite/85 text-sm leading-relaxed italic mb-5">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <div>
                  <p className="text-offwhite/70 text-xs font-medium">{t.author}</p>
                  <p className="text-muted text-xs">{t.detail}</p>
                </div>
              </div>
            ))}

            {/* Placeholder notice — visible in development */}
            <p className="text-xs text-muted/40 text-center">
              ↑ Illustrative testimonials — replace with real client quotes before launch
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
