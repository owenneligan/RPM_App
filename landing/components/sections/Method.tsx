const steps = [
  {
    number: "01",
    name: "Diagnose",
    description:
      "Map your commercial operating model. Find exactly where growth is leaking — across strategy, sales, operations, pricing, AI readiness, and execution discipline.",
  },
  {
    number: "02",
    name: "Design",
    description:
      "Build the operating architecture your business needs to scale intelligently. A model designed around how your business actually works, not a generic framework.",
  },
  {
    number: "03",
    name: "Deploy",
    description:
      "Implement systems, AI enablement, process design, and accountability frameworks. Practical, embedded, and operational — not left in a slide deck.",
  },
  {
    number: "04",
    name: "Drive",
    description:
      "Install the cadence, KPIs, and execution rhythm that keeps it working without you. The business runs. You lead.",
  },
];

export default function Method() {
  return (
    <section className="py-24 md:py-32 bg-navy-900" id="method">
      <div className="max-w-content mx-auto px-6 md:px-12">
        {/* Section label */}
        <p className="text-xs font-semibold tracking-widest uppercase text-gold-500 mb-5">
          The Framework
        </p>

        {/* Heading */}
        <h2
          className="font-display font-semibold text-offwhite leading-tight mb-4"
          style={{ fontSize: "clamp(2rem, 4vw, 3.25rem)", letterSpacing: "-0.015em" }}
        >
          How It Works
        </h2>
        <p className="text-muted mb-16 max-w-xl" style={{ fontSize: "1.0625rem" }}>
          A proven four-stage framework for installing a commercial operating system in
          a founder-led business.
        </p>

        {/* Steps — horizontal desktop, vertical mobile */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-0 md:gap-8">
          {steps.map((step, i) => (
            <div key={i} className="relative">
              {/* Connector line between steps on desktop */}
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-7 left-[calc(100%_+_1rem)] w-[calc(2rem_-_2px)] h-px bg-gold-500/20" />
              )}

              {/* Mobile connector */}
              {i < steps.length - 1 && (
                <div className="md:hidden absolute left-7 top-14 w-px h-[calc(100%_-_3.5rem)] bg-gold-500/15" />
              )}

              <div className="flex md:flex-col gap-5 md:gap-0 pb-10 md:pb-0">
                {/* Number badge */}
                <div className="shrink-0 w-14 h-14 rounded-full border border-gold-500/30 bg-gold-500/5 flex items-center justify-center">
                  <span className="font-display font-semibold text-gold-500 text-lg">
                    {step.number}
                  </span>
                </div>

                <div className="md:mt-6">
                  <h3 className="text-offwhite font-semibold text-xl mb-2 font-display">
                    {step.name}
                  </h3>
                  <p className="text-muted text-sm leading-relaxed">{step.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
