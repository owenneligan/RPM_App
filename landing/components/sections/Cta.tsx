import LeadCaptureForm from "@/components/LeadCaptureForm";
import Reveal from "@/components/Reveal";

export default function Cta() {
  return (
    <section style={{ background: "#16181A" }} className="py-24 md:py-32 ring-texture overflow-hidden">
      <div className="relative z-10 max-w-content mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          <Reveal>
            <h2
              className="font-display font-semibold text-parchment"
              style={{ fontSize: "clamp(2.25rem,4vw,3.5rem)", lineHeight: 1.05, marginBottom: "1.5rem" }}
            >
              Wind it once. Let it run.
            </h2>
            <p style={{ fontSize: "1rem", lineHeight: 1.75, color: "#8D9296", maxWidth: "40ch" }}>
              Twelve minutes of honesty now. Forty-eight hours later, you'll know exactly what's holding your business back — and what to do about it.
            </p>
          </Reveal>

          <Reveal delay={80}>
            <LeadCaptureForm variant="cta" />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
