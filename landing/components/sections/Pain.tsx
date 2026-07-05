const painPoints = [
  {
    n: "01",
    title: "You're still the best salesperson in the building.",
    body: "That's not a strength — it's a single point of failure. The moment you stop selling, the pipeline stops. Every holiday costs you pipeline. Every day you're in delivery, you're not in growth.",
  },
  {
    n: "02",
    title: "Revenue is growing. Margin isn't following.",
    body: "You're discounting to win clients and over-delivering to keep them. Your pricing model was built for when you needed the business. It wasn't redesigned when you no longer did.",
  },
  {
    n: "03",
    title: "Your team knows what to do. Just not what to do first.",
    body: "Accountability breaks down not because of poor attitude but because priorities shift weekly and ownership is assumed rather than assigned. Capable people — unclear system.",
  },
  {
    n: "04",
    title: "AI has come up in every meeting for three months.",
    body: "You still don't have a clear plan for where it applies, who owns it, or what to build first. Every week without a plan is operational overhead you're choosing to keep paying.",
  },
  {
    n: "05",
    title: "The 90-day plan exists. No one is running it.",
    body: "It felt aligned for about ten days. Then Monday arrived and the business ran on urgency again. Strategy is not the problem. Execution infrastructure is.",
  },
  {
    n: "06",
    title: "You've hired to solve the bottleneck before.",
    body: "The bottleneck moved. Because the bottleneck was never the headcount — it was the absence of a system for those people to operate within.",
  },
];

export default function Pain() {
  return (
    <section className="section-cream py-24 md:py-32 relative overflow-hidden">
      {/* Decorative background text */}
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 deco-number select-none pointer-events-none leading-none"
        style={{ fontSize: "22vw", opacity: 0.035, color: "#0D1B0F" }}
        aria-hidden
      >
        ?
      </div>

      <div className="relative z-10 max-w-content mx-auto px-6 md:px-12">
        {/* Section label */}
        <div className="flex items-center gap-3 mb-6">
          <span className="w-6 h-px bg-gold-500/50" />
          <p className="text-xs font-semibold tracking-widest uppercase text-gold-500 font-sans">
            Sound familiar?
          </p>
        </div>

        {/* Heading — Inter, not Cormorant */}
        <h2
          className="font-sans font-semibold text-navy-900 mb-4 max-w-xl"
          style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)", lineHeight: "1.15", letterSpacing: "-0.02em" }}
        >
          If you&rsquo;re honest with yourself, you already know the problem.
        </h2>
        <p className="text-cream-muted mb-14 max-w-lg font-sans" style={{ fontSize: "1.0625rem" }}>
          These aren&rsquo;t signs of a bad business. They&rsquo;re signs of a business that has outgrown its operating model.
        </p>

        {/* Pain points — numbered editorial list, not cards */}
        <div className="space-y-0 divide-y divide-navy-900/8">
          {painPoints.map((p) => (
            <div key={p.n} className="group py-7 md:py-8 grid grid-cols-1 md:grid-cols-[5rem_1fr] gap-2 md:gap-8 items-start">
              {/* Number */}
              <span
                className="font-display font-semibold text-gold-500/30 leading-none hidden md:block"
                style={{ fontSize: "3.5rem", letterSpacing: "-0.03em" }}
                aria-hidden
              >
                {p.n}
              </span>

              <div>
                <h3 className="font-sans font-semibold text-navy-900 text-base md:text-lg mb-2 leading-snug group-hover:text-navy-700 transition-colors">
                  {p.title}
                </h3>
                <p className="font-sans text-cream-muted text-sm leading-relaxed max-w-2xl">
                  {p.body}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Full-width pull quote — the disarming moment */}
        <div className="mt-16 pt-12 border-t border-navy-900/10">
          <p
            className="pull-quote text-navy-900/75 max-w-3xl"
            style={{ fontSize: "clamp(1.5rem, 2.8vw, 2.25rem)" }}
          >
            &ldquo;The bottleneck is almost never effort. It&rsquo;s almost always architecture.&rdquo;
          </p>
          <p className="mt-4 text-sm text-cream-muted font-sans">— Owen Neligan, Founder</p>
        </div>
      </div>
    </section>
  );
}
