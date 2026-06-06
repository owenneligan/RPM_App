const steps = [
  {
    number: "01",
    name: "Diagnose",
    description:
      "Map your commercial operating model across seven dimensions. Identify exactly where growth is leaking — in sales, operations, pricing, execution, AI readiness, team structure, and strategy.",
    duration: "Week 1–2",
  },
  {
    number: "02",
    name: "Design",
    description:
      "Build the operating architecture your business needs to scale. Every component designed around how your business actually functions — not how a framework says it should.",
    duration: "Week 2–4",
  },
  {
    number: "03",
    name: "Deploy",
    description:
      "Implement the systems, AI enablement, process design, and accountability frameworks. Working infrastructure — not recommendations that sit in a folder.",
    duration: "Week 4–10",
  },
  {
    number: "04",
    name: "Drive",
    description:
      "Install the cadence, KPIs, and execution rhythm that keeps the system running. Then hand it over. The goal is a business that operates without you at the centre of every decision.",
    duration: "Week 10–12",
  },
];

export default function Method() {
  return (
    <section className="section-navy py-24 md:py-32 relative overflow-hidden" id="method">
      {/* Decorative large background number */}
      <div
        className="absolute right-[-2vw] top-1/2 -translate-y-1/2 deco-number pointer-events-none select-none"
        style={{ fontSize: "28vw" }}
        aria-hidden
      >
        4D
      </div>

      <div className="relative z-10 max-w-content mx-auto px-6 md:px-12">
        <div className="flex items-center gap-3 mb-6">
          <span className="w-6 h-px bg-gold-500/60" />
          <p className="text-xs font-semibold tracking-widest uppercase text-gold-500 font-sans">
            The Framework
          </p>
        </div>

        <h2
          className="font-sans font-semibold text-offwhite mb-4"
          style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)", lineHeight: "1.15", letterSpacing: "-0.02em" }}
        >
          How It Works
        </h2>
        <p className="text-muted font-sans mb-16 max-w-md" style={{ fontSize: "1.0625rem" }}>
          A four-stage method for building commercial operating systems inside founder-led businesses. Typically 90 days end-to-end.
        </p>

        {/* Steps */}
        <div className="space-y-0 divide-y divide-white/5">
          {steps.map((step, i) => (
            <div
              key={i}
              className="group py-8 md:py-10 grid grid-cols-1 md:grid-cols-[7rem_1fr_auto] gap-4 md:gap-10 items-start"
            >
              {/* Giant step number */}
              <div className="flex items-baseline gap-3">
                <span
                  className="font-display font-semibold text-gold-500/20 group-hover:text-gold-500/35 transition-colors duration-300 leading-none"
                  style={{ fontSize: "4rem", letterSpacing: "-0.04em" }}
                  aria-hidden
                >
                  {step.number}
                </span>
              </div>

              {/* Content */}
              <div>
                <h3
                  className="font-sans font-semibold text-offwhite mb-2"
                  style={{ fontSize: "1.2rem" }}
                >
                  {step.name}
                </h3>
                <p className="text-muted text-sm leading-relaxed font-sans max-w-lg">
                  {step.description}
                </p>
              </div>

              {/* Duration */}
              <div className="flex md:justify-end">
                <span className="text-xs text-muted/50 font-sans uppercase tracking-widest whitespace-nowrap mt-1">
                  {step.duration}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
