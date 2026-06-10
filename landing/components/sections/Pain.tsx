import Reveal from "@/components/Reveal";

const PAIN_POINTS = [
  {
    num: "I",
    title: "You're still the best salesperson in the building.",
    body: "That's not a strength — it's a single point of failure. When you stop selling, the pipeline stops. Every holiday costs you revenue. Every day you spend delivering is a day nobody is growing.",
  },
  {
    num: "II",
    title: "Revenue is growing. Margin isn't following.",
    body: "You're discounting to win work and over-delivering to keep it. Your pricing was built for when you needed the business. It was never redesigned for when the business needed you.",
  },
  {
    num: "III",
    title: "Your team knows what to do — just not what to do first.",
    body: "Accountability isn't breaking down because of attitude. It's breaking down because priorities shift weekly and ownership is assumed instead of assigned. Capable people. Unclear system.",
  },
  {
    num: "IV",
    title: "AI has come up in every meeting for three months.",
    body: "And there's still no plan for where it applies, who owns it, or what to build first. Every week without one is overhead you're choosing to keep paying.",
  },
  {
    num: "V",
    title: "The 90-day plan exists. Nobody is running it.",
    body: "It felt aligned for about ten days. Then Monday arrived and the business went back to running on urgency. Strategy was never the problem. Execution infrastructure is.",
  },
  {
    num: "VI",
    title: "You've hired to fix the bottleneck before.",
    body: "The bottleneck moved. Because it was never headcount — it was the absence of a system for those people to operate inside.",
  },
];

export default function Pain() {
  return (
    <section style={{ background: "#EFE7D8" }} className="py-24 md:py-32 overflow-hidden">
      <div className="max-w-content mx-auto px-6 md:px-12">

        <Reveal>
          <p className="eyebrow mb-5" style={{ color: "#B9893E" }}>PAIN POINTS</p>
          <h2
            className="font-display font-semibold"
            style={{ fontSize: "clamp(2rem,3.5vw,3rem)", lineHeight: 1.1, color: "#2A2C2E", marginBottom: "1rem" }}
          >
            If you're honest with yourself, you already know.
          </h2>
          <p style={{ fontSize: "1rem", lineHeight: 1.65, color: "#5A5248", marginBottom: "3.5rem", maxWidth: "52ch" }}>
            These aren't signs of a bad business. They're signs of a business that has outgrown its operating model.
          </p>
        </Reveal>

        <div style={{ borderTop: "1px solid rgba(42,44,46,0.1)" }}>
          {PAIN_POINTS.map((p, i) => (
            <Reveal
              key={p.num}
              delay={i * 40}
              className="py-8 md:py-9 grid grid-cols-1 md:grid-cols-[4rem_1fr] gap-2 md:gap-8 items-start"
              style={{ borderBottom: "1px solid rgba(42,44,46,0.1)" } as React.CSSProperties}
            >
              <span
                className="font-display font-semibold hidden md:block"
                style={{ fontSize: "2.5rem", lineHeight: 1, color: "#B9893E", opacity: 0.45 }}
                aria-hidden="true"
              >
                {p.num}
              </span>
              <div>
                <h3
                  className="font-display font-semibold"
                  style={{ fontSize: "1.125rem", lineHeight: 1.2, color: "#2A2C2E", marginBottom: "0.5rem" }}
                >
                  {p.title}
                </h3>
                <p style={{ fontSize: "0.9375rem", lineHeight: 1.65, color: "#5A5248" }}>
                  {p.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Closing pull quote */}
        <Reveal className="mt-16 pt-12" style={{ borderTop: "1px solid rgba(42,44,46,0.1)" } as React.CSSProperties}>
          <blockquote>
            <p
              className="pull-quote"
              style={{ fontSize: "clamp(1.5rem,2.5vw,2.125rem)", color: "#2A2C2E", opacity: 0.8, maxWidth: "36em" }}
            >
              &ldquo;The bottleneck is almost never effort. It's almost always architecture.&rdquo;
            </p>
            <footer className="mt-4" style={{ fontSize: "0.875rem", color: "#8D9296" }}>
              — Owen Neligan, Founder
            </footer>
          </blockquote>
        </Reveal>
      </div>
    </section>
  );
}
