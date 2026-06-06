const credentials = [
  "MBA Qualified",
  "Lean Six Sigma Black Belt",
  "Senior Financial Services Leadership",
  "Commercial Strategy",
  "AI-Enabled Transformation",
];

const testimonials = [
  {
    quote:
      "Owen reframed how we thought about our commercial model entirely. Three months in, we have a pipeline that works, a team that owns their numbers, and a clear 18-month plan. I'm no longer in every sales conversation.",
    author: "Founder, B2B services",
    detail: "£2.3m revenue · Services sector",
  },
  {
    quote:
      "I knew what needed to change but couldn't see how to do it without breaking what was working. Owen built the operating model around us. It just runs now.",
    author: "MD, professional services firm",
    detail: "£1.1m revenue · 12-person team",
  },
];

export default function Credibility() {
  return (
    <section className="section-navy py-24 md:py-32 relative overflow-hidden">
      <div className="max-w-content mx-auto px-6 md:px-12">

        {/* Social proof FIRST (Hormozi's point) */}
        <div className="mb-20">
          <div className="flex items-center gap-3 mb-10">
            <span className="w-6 h-px bg-gold-500/60" />
            <p className="text-xs font-semibold tracking-widest uppercase text-gold-500 font-sans">
              {/* PLACEHOLDER — replace with real client results before launch */}
              Client Results
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="relative p-8 rounded-2xl border border-white/5 bg-white/2"
              >
                {/* Large decorative quote mark */}
                <div
                  className="absolute top-4 right-6 font-display text-gold-500/8 leading-none select-none"
                  style={{ fontSize: "6rem" }}
                  aria-hidden
                >
                  &ldquo;
                </div>

                {/* PLACEHOLDER badge */}
                <span className="inline-block mb-5 text-[10px] font-sans font-semibold uppercase tracking-widest text-muted/40 border border-muted/15 rounded px-2 py-0.5">
                  Illustrative placeholder
                </span>

                <blockquote className="text-offwhite/80 text-sm leading-relaxed font-sans mb-6 relative z-10">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <div>
                  <p className="text-offwhite/60 text-xs font-sans font-medium">{t.author}</p>
                  <p className="text-muted/50 text-xs font-sans">{t.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <hr className="gold-rule mb-20" />

        {/* About — transformation led, not CV led */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">

          {/* Photo placeholder — prominent */}
          <div>
            <div
              className="w-full aspect-[4/5] rounded-2xl border border-white/8 bg-navy-800 flex flex-col items-center justify-center text-center p-8 mb-6"
              style={{ maxWidth: "340px" }}
            >
              <div className="w-16 h-16 rounded-full border-2 border-gold-500/30 bg-gold-500/5 flex items-center justify-center mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gold-500/40">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                </svg>
              </div>
              <p className="text-muted/50 text-xs font-sans">
                Photo: Owen Neligan
              </p>
              <p className="text-muted/30 text-xs font-sans mt-1">
                Add headshot before launch
              </p>
            </div>

            {/* Credential pills */}
            <div className="flex flex-wrap gap-2">
              {credentials.map((c) => (
                <span
                  key={c}
                  className="text-xs px-3 py-1.5 rounded-full border border-gold-500/20 bg-gold-500/5 text-offwhite/70 font-sans"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>

          {/* Bio — transformation first */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span className="w-6 h-px bg-gold-500/60" />
              <p className="text-xs font-semibold tracking-widest uppercase text-gold-500 font-sans">
                About
              </p>
            </div>

            <h2
              className="font-sans font-semibold text-offwhite mb-6"
              style={{ fontSize: "clamp(1.5rem, 2.5vw, 2rem)", lineHeight: "1.2", letterSpacing: "-0.015em" }}
            >
              Commercial rigour, without the corporate overhead.
            </h2>

            <div className="space-y-4 text-muted text-sm leading-relaxed font-sans mb-8">
              <p>
                In 90 days, I help founder-led businesses go from decision-bottleneck to commercially self-sustaining.
                Not by adding overhead — by installing the operating architecture that most businesses at this stage are missing.
              </p>
              <p>
                My background spans commercial strategy, operational redesign, and AI-enabled efficiency.
                MBA-qualified. Lean Six Sigma Black Belt. Fifteen years working in environments where revenue and margin were existential problems, not academic ones.
              </p>
              <p>
                I work exclusively with founder-led businesses between £500k and £5m. That&rsquo;s a deliberate choice —
                it&rsquo;s the stage where most commercial potential is either captured or permanently lost, and where structured infrastructure pays back fastest.
              </p>
            </div>

            <a
              href="https://linkedin.com/in/owenneligan"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-gold-500 hover:text-gold-400 transition-colors duration-200 font-sans font-medium"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect x="2" y="9" width="4" height="12" />
                <circle cx="4" cy="4" r="2" />
              </svg>
              Owen Neligan on LinkedIn →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
