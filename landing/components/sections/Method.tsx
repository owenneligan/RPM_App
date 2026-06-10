import Reveal from "@/components/Reveal";

const STAGES = [
  {
    num: "01",
    name: "Diagnose",
    period: "Weeks 1–2",
    body: "We verify, in the room and in the numbers, exactly where growth is leaking — and name the one constraint capping everything else.",
  },
  {
    num: "02",
    name: "Design",
    period: "Weeks 2–4",
    body: "The operating blueprint, built around how your business actually works. Every component has a named owner before anything gets built.",
  },
  {
    num: "03",
    name: "Deploy",
    period: "Weeks 4–10",
    body: "Systems installed and running live: scorecard, pipeline, decision rights, automation built with your team watching. Week ten, we switch you off for three days and measure what holds.",
  },
  {
    num: "04",
    name: "Drive",
    period: "Weeks 10–12",
    body: "Your team runs the rhythm; we coach from the back of the room. Then a full handover. The goal was never dependence on us either.",
  },
];

export default function Method() {
  return (
    <section style={{ background: "#1F2225" }} className="py-24 md:py-32 relative overflow-hidden">
      {/* Ghosted 4D background element */}
      <div
        className="absolute right-[-4vw] top-1/2 -translate-y-1/2 font-display font-semibold select-none pointer-events-none"
        style={{ fontSize: "clamp(14rem,28vw,32rem)", lineHeight: 1, color: "rgba(185,137,62,0.04)", letterSpacing: "-0.04em" }}
        aria-hidden="true"
      >
        4D
      </div>

      <div className="relative z-10 max-w-content mx-auto px-6 md:px-12">
        <Reveal>
          <p className="eyebrow mb-5">THE METHOD</p>
          <h2
            className="font-display font-semibold text-parchment"
            style={{ fontSize: "clamp(1.875rem,3vw,2.75rem)", lineHeight: 1.1, marginBottom: "3.5rem" }}
          >
            Ninety days. Four stages. Then it's yours.
          </h2>
        </Reveal>

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          {STAGES.map((s, i) => (
            <Reveal
              key={s.num}
              delay={i * 50}
              className="py-8 md:py-10 grid grid-cols-1 md:grid-cols-[6rem_1fr_auto] gap-3 md:gap-10 items-baseline"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" } as React.CSSProperties}
            >
              <span
                className="font-display font-semibold"
                style={{ fontSize: "2.75rem", lineHeight: 1, color: "rgba(185,137,62,0.25)" }}
                aria-hidden="true"
              >
                {s.num}
              </span>
              <div>
                <h3
                  className="font-display font-semibold text-parchment"
                  style={{ fontSize: "1.1875rem", marginBottom: "0.5rem" }}
                >
                  {s.name}
                </h3>
                <p style={{ fontSize: "0.9375rem", lineHeight: 1.65, color: "#8D9296", maxWidth: "52ch" }}>
                  {s.body}
                </p>
              </div>
              <span className="eyebrow text-right whitespace-nowrap" style={{ opacity: 0.6, fontSize: "0.625rem" }}>
                {s.period}
              </span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
