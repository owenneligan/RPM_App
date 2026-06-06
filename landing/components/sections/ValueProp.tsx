const pillars = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3v18h18" />
        <path d="M7 16l4-4 4 4 4-4" />
      </svg>
    ),
    title: "Commercial Rhythm",
    body: "Cadence, pipeline discipline, and decision frameworks that create predictability — so the business stops running on urgency and starts compounding.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
      </svg>
    ),
    title: "AI-Enabled Efficiency",
    body: "Identify, automate, and redeploy manual overhead across operations and sales. AI that actually works in your context — not a shiny tool with no plan.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
    title: "Sales Consistency",
    body: "Systems that generate and convert revenue whether you&apos;re selling or not. A pipeline that doesn&apos;t depend on any one person — including you.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
    title: "Strategic Execution",
    body: "Strategy that translates into daily action, clear ownership, and measurable outcomes. The plan that actually runs — every week, not just every quarter.",
  },
];

export default function ValueProp() {
  return (
    <section className="py-24 md:py-32 bg-navy-900">
      <div className="max-w-content mx-auto px-6 md:px-12">
        {/* Section label */}
        <p className="text-xs font-semibold tracking-widest uppercase text-gold-500 mb-5">
          The Solution
        </p>

        {/* Heading */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-16">
          <h2
            className="font-display font-semibold text-offwhite leading-tight max-w-2xl"
            style={{ fontSize: "clamp(2rem, 4vw, 3.25rem)", letterSpacing: "-0.015em" }}
          >
            Owen builds the Commercial Operating System your business needs to scale.
          </h2>
          <p className="text-muted max-w-sm text-sm leading-relaxed lg:text-right shrink-0">
            Not a deck of recommendations.
            <br />A working infrastructure — installed and operating in your business.
          </p>
        </div>

        {/* Pillars grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {pillars.map((pillar, i) => (
            <div
              key={i}
              className="rounded-xl border border-white/5 bg-navy-800/60 p-8 hover:border-gold-500/20 group transition-all duration-300"
            >
              <div className="text-gold-500 mb-5 group-hover:text-gold-400 transition-colors duration-200">
                {pillar.icon}
              </div>
              <h3 className="text-offwhite font-semibold text-lg mb-3">{pillar.title}</h3>
              <p className="text-muted text-sm leading-relaxed">{pillar.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
