import Reveal from "@/components/Reveal";

const COLS = [
  {
    heading: "Capacity.",
    body: "Right now, growth is capped by your calendar. A commercial operating system breaks that link: the business generates, qualifies and delivers without routing every decision through you.",
  },
  {
    heading: "Freedom.",
    body: "When did you last take two fully offline weeks? If the honest answer makes you wince, the business owns you — not the other way round. We build toward a simple test: switch the founder off, and watch the system hold.",
  },
  {
    heading: "Enterprise value.",
    body: "A founder-dependent business is nearly unsellable, whatever the revenue says. Systems, documented processes and a pipeline that runs without you are what acquirers actually pay for. Every component we install is balance-sheet value, not consultancy theatre.",
  },
];

export default function ValueProp() {
  return (
    <section style={{ background: "#16181A" }} className="py-24 md:py-32">
      <div className="max-w-content mx-auto px-6 md:px-12">

        <Reveal>
          <p className="eyebrow mb-5">WHAT THIS REALLY COSTS</p>
          <h2
            className="font-display font-semibold text-parchment"
            style={{ fontSize: "clamp(1.875rem,3vw,2.75rem)", lineHeight: 1.1, marginBottom: "3.5rem", maxWidth: "28em" }}
          >
            This isn't about efficiency. It's about what your business is worth — to a buyer, and to you.
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
          {COLS.map((col, i) => (
            <Reveal key={col.heading} delay={i * 80}>
              <span className="brass-rule" aria-hidden="true" />
              <h3
                className="font-display font-semibold text-parchment"
                style={{ fontSize: "1.375rem", lineHeight: 1.2, marginBottom: "0.875rem" }}
              >
                {col.heading}
              </h3>
              <p style={{ fontSize: "0.9375rem", lineHeight: 1.65, color: "#8D9296" }}>
                {col.body}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
