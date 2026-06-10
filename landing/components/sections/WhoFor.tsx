import Reveal from "@/components/Reveal";

const FOR_YOU = [
  "you run a services, professional or B2B business",
  "you have a team of at least three who rely on you for decisions",
  "revenue is £500k–£5m — the model is proven, the infrastructure isn't",
  "you've already tried a new hire, a consultant's deck or a new tool, and the problem is still here",
  "you're ready to work on the business, not just in it.",
];

const NOT_FOR_YOU = [
  "you need a marketing agency or a sales team",
  "you're pre-revenue or still finding product-market fit",
  "you want someone to run operations for you.",
];

export default function WhoFor() {
  return (
    <section style={{ background: "#EFE7D8" }} className="py-24 md:py-32">
      <div className="max-w-content mx-auto px-6 md:px-12">
        <Reveal>
          <p className="eyebrow mb-5" style={{ color: "#B9893E" }}>WHO IT'S FOR</p>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">

          {/* Built for you */}
          <Reveal>
            <h2
              className="font-display font-semibold"
              style={{ fontSize: "clamp(1.625rem,2.5vw,2.25rem)", lineHeight: 1.15, color: "#2A2C2E", marginBottom: "1.5rem" }}
            >
              Built for you if:
            </h2>
            <ul className="space-y-3">
              {FOR_YOU.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span
                    className="flex-shrink-0 mt-1.5 w-1 h-1 rounded-full"
                    style={{ background: "#B9893E", minWidth: "4px", minHeight: "4px" }}
                    aria-hidden="true"
                  />
                  <span style={{ fontSize: "0.9375rem", lineHeight: 1.65, color: "#5A5248" }}>{item}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          {/* Not for you */}
          <Reveal delay={80}>
            <h2
              className="font-display font-semibold"
              style={{ fontSize: "clamp(1.625rem,2.5vw,2.25rem)", lineHeight: 1.15, color: "#2A2C2E", marginBottom: "1.5rem" }}
            >
              Not the right fit if:
            </h2>
            <ul className="space-y-3 mb-8">
              {NOT_FOR_YOU.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span
                    className="flex-shrink-0 mt-1.5 w-1 h-1 rounded-full"
                    style={{ background: "rgba(90,82,72,0.3)", minWidth: "4px", minHeight: "4px" }}
                    aria-hidden="true"
                  />
                  <span style={{ fontSize: "0.9375rem", lineHeight: 1.65, color: "#8D9296" }}>{item}</span>
                </li>
              ))}
            </ul>

            <div className="honest-box">
              <p style={{ fontSize: "0.9375rem", lineHeight: 1.65, color: "#5A5248" }}>
                Not sure which side you're on? Submit the diagnostic anyway. The honest answer — fit or not — will be in your inbox within 48 hours.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
