import Reveal from "@/components/Reveal";

const PILLARS = [
  {
    num: "I",
    title: "Commercial Rhythm.",
    body: "Pipeline discipline, decision frameworks and an operating cadence that make weeks predictable. The business stops running on urgency and starts compounding.",
  },
  {
    num: "II",
    title: "Sales Consistency.",
    body: "A system that generates, qualifies and converts revenue independent of any one person. Including the founder. Especially the founder.",
  },
  {
    num: "III",
    title: "AI-Enabled Efficiency.",
    body: "A structured audit of where manual overhead lives — and working automation, built and handed over, not a tools list in an appendix.",
  },
  {
    num: "IV",
    title: "Strategic Execution.",
    body: "A 90-day operating rhythm with KPIs, owned numbers and review cadences that turn the plan from a document into a discipline.",
  },
];

export default function System() {
  return (
    <section style={{ background: "#1F2225" }} className="py-24 md:py-32">
      <div className="max-w-content mx-auto px-6 md:px-12">

        <Reveal>
          <p className="eyebrow mb-5">THE SYSTEM</p>
          <h2
            className="font-display font-semibold text-parchment"
            style={{ fontSize: "clamp(1.875rem,3vw,2.75rem)", lineHeight: 1.1, marginBottom: "3.5rem" }}
          >
            What gets installed.
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 md:gap-12">
          {PILLARS.map((p, i) => (
            <Reveal key={p.num} delay={i * 60}>
              <div className="flex items-start gap-5">
                <span
                  className="font-display font-semibold flex-shrink-0"
                  style={{ fontSize: "2rem", lineHeight: 1, color: "#B9893E", opacity: 0.4, minWidth: "2.5rem" }}
                  aria-hidden="true"
                >
                  {p.num}
                </span>
                <div>
                  <h3
                    className="font-display font-semibold text-parchment"
                    style={{ fontSize: "1.1875rem", lineHeight: 1.2, marginBottom: "0.625rem" }}
                  >
                    {p.title}
                  </h3>
                  <p style={{ fontSize: "0.9375rem", lineHeight: 1.65, color: "#8D9296" }}>
                    {p.body}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
