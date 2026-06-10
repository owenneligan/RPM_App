import LeadCaptureForm from "@/components/LeadCaptureForm";
import Reveal from "@/components/Reveal";

const DELIVERABLES = [
  "Your score across seven commercial dimensions",
  "The single constraint capping everything else, named plainly",
  "Where you're leaking margin, quantified",
  "Where AI and automation genuinely apply to your business — including one fix you can make without us",
  "What to address first, and what can honestly wait",
];

const DIMENSIONS = [
  "Strategy clarity",
  "Sales pipeline",
  "Operational efficiency",
  "Pricing & margin",
  "AI readiness",
  "Team accountability",
  "Execution rhythm",
];

export default function Diagnostic() {
  return (
    <section style={{ background: "#EFE7D8" }} className="py-24 md:py-32" id="diagnostic">
      <div className="max-w-content mx-auto px-6 md:px-12">
        <Reveal>
          <p className="eyebrow mb-5" style={{ color: "#B9893E" }}>FREE DIAGNOSTIC</p>
          <h2
            className="font-display font-semibold"
            style={{ fontSize: "clamp(1.875rem,3vw,2.75rem)", lineHeight: 1.1, color: "#2A2C2E", marginBottom: "3rem" }}
          >
            Find out where your business is leaking growth.
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-10 lg:gap-16 items-start">

          {/* Left — what you receive */}
          <Reveal>
            <p style={{ fontSize: "1rem", lineHeight: 1.75, color: "#5A5248", marginBottom: "1.75rem" }}>
              The Founder's Commercial Operating System Diagnostic. Free, reviewed personally — never automated — and in your inbox within 48 hours:
            </p>

            <ul className="space-y-3 mb-8">
              {DELIVERABLES.map((d) => (
                <li key={d} className="flex items-start gap-3">
                  <span
                    className="flex-shrink-0 mt-2"
                    style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#B9893E", minWidth: "5px", minHeight: "5px" }}
                    aria-hidden="true"
                  />
                  <span style={{ fontSize: "0.9375rem", lineHeight: 1.65, color: "#5A5248" }}>{d}</span>
                </li>
              ))}
            </ul>

            {/* 7 dimensions */}
            <p className="eyebrow mb-3" style={{ color: "#B9893E", fontSize: "0.5625rem" }}>SEVEN DIMENSIONS</p>
            <div className="flex flex-wrap gap-2 mb-8">
              {DIMENSIONS.map((d) => (
                <span
                  key={d}
                  style={{
                    fontSize: "0.75rem",
                    padding: "0.3rem 0.7rem",
                    border: "1px solid rgba(42,44,46,0.2)",
                    borderRadius: "2px",
                    color: "#5A5248",
                  }}
                >
                  {d}
                </span>
              ))}
            </div>

            {/* Risk reversal */}
            <div className="honest-box">
              <p style={{ fontSize: "0.9375rem", lineHeight: 1.65, color: "#5A5248" }}>
                There is no pitch on the other end of this. If your business is already well-structured somewhere, the diagnostic will say so — plainly. Not every business is a fit for this approach, and you'll get the honest answer either way.
              </p>
            </div>
          </Reveal>

          {/* Right — form card */}
          <Reveal delay={100}>
            <div
              style={{ background: "#16181A", borderRadius: "2px", padding: "2.5rem", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <LeadCaptureForm variant="diagnostic" />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
