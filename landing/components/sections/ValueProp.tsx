const pillars = [
  {
    n: "I",
    title: "Commercial Rhythm",
    body: "Pipeline discipline, decision frameworks, and operating cadence that create week-on-week predictability. The business stops running on urgency and starts compounding.",
    tags: ["Revenue architecture", "Pipeline discipline", "Decision frameworks"],
  },
  {
    n: "II",
    title: "AI-Enabled Efficiency",
    body: "A structured audit of where manual overhead exists across your operations and sales process — and a clear plan for which tools automate it, in what order, at what cost.",
    tags: ["Automation roadmap", "Operational AI", "Cost redeployment"],
  },
  {
    n: "III",
    title: "Sales Consistency",
    body: "A system that generates, qualifies, and converts revenue independent of any one person. Including you. Especially you.",
    tags: ["Sales infrastructure", "Pipeline independence", "Conversion systems"],
  },
  {
    n: "IV",
    title: "Strategic Execution",
    body: "A 90-day operating rhythm — with KPIs, accountability structures, and review cadences — that turns the plan from a document into a discipline.",
    tags: ["90-day cycles", "KPI frameworks", "Accountability design"],
  },
];

export default function ValueProp() {
  return (
    <section className="section-cream py-24 md:py-32 relative overflow-hidden">
      <div className="max-w-content mx-auto px-6 md:px-12">

        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16 lg:mb-20">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span className="w-6 h-px bg-gold-500/50" />
              <p className="text-xs font-semibold tracking-widest uppercase text-gold-500 font-sans">
                The Solution
              </p>
            </div>
            <h2
              className="font-sans font-semibold text-navy-900"
              style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)", lineHeight: "1.15", letterSpacing: "-0.02em" }}
            >
              The Commercial Operating System
            </h2>
          </div>
          <div className="lg:pt-16">
            <p className="text-cream-muted font-sans leading-relaxed" style={{ fontSize: "1.0625rem" }}>
              Not a strategy deck. A functioning set of systems — installed and operating inside your business.
              Built around how you actually work, not how a framework says you should.
            </p>
          </div>
        </div>

        {/* Pillars — alternating layout, not uniform cards */}
        <div className="space-y-0 divide-y divide-navy-900/8">
          {pillars.map((p, i) => (
            <div
              key={i}
              className={`py-10 md:py-12 grid grid-cols-1 md:grid-cols-[4rem_1fr_1fr] gap-4 md:gap-10 items-start ${
                i % 2 === 1 ? "md:grid-cols-[4rem_1fr_1fr]" : ""
              }`}
            >
              {/* Roman numeral accent */}
              <div className="hidden md:flex items-start pt-1">
                <span
                  className="font-display font-semibold text-gold-500/25"
                  style={{ fontSize: "2.5rem", lineHeight: "1", letterSpacing: "-0.02em" }}
                  aria-hidden
                >
                  {p.n}
                </span>
              </div>

              {/* Title + tags */}
              <div>
                <h3
                  className="font-sans font-semibold text-navy-900 mb-4"
                  style={{ fontSize: "1.25rem", lineHeight: "1.2" }}
                >
                  {p.title}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {p.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2.5 py-1 rounded-full border border-navy-900/12 text-cream-muted font-sans"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="md:pl-6 md:border-l md:border-navy-900/8">
                <p className="text-cream-muted text-sm leading-relaxed font-sans">{p.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
