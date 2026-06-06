import LeadCaptureForm from "@/components/LeadCaptureForm";

export default function Cta() {
  return (
    <section className="py-24 md:py-32 bg-navy-800/40 relative overflow-hidden">
      {/* Subtle gold glow from below */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 100%, rgba(196,149,58,0.06) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-content mx-auto px-6 md:px-12 text-center">
        {/* Section label */}
        <p className="text-xs font-semibold tracking-widest uppercase text-gold-500 mb-5">
          Take the First Step
        </p>

        {/* Heading */}
        <h2
          className="font-display font-semibold text-offwhite leading-tight mb-5 mx-auto"
          style={{
            fontSize: "clamp(2rem, 4vw, 3.5rem)",
            letterSpacing: "-0.015em",
            maxWidth: "720px",
          }}
        >
          Find Out Where Your Business Is Leaking Growth
        </h2>

        <p
          className="text-muted mb-4 mx-auto leading-relaxed"
          style={{ fontSize: "1.0625rem", maxWidth: "520px" }}
        >
          Take the free audit. It takes three minutes and gives you a clear picture of
          where to focus first.
        </p>

        {/* Urgency / scarcity — Sutherland */}
        <p className="text-gold-500/70 text-sm italic mb-10">
          Owen works with a small number of businesses at a time. If you&apos;re serious
          about building a scalable commercial model, this is where it starts.
        </p>

        {/* CTA form — centered */}
        <div className="flex justify-center">
          <LeadCaptureForm variant="cta" />
        </div>
      </div>
    </section>
  );
}
