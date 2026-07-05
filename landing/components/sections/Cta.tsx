import LeadCaptureForm from "@/components/LeadCaptureForm";

export default function Cta() {
  return (
    <section className="section-navy py-24 md:py-32 relative overflow-hidden">
      {/* Background texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 110%, rgba(196,149,58,0.07) 0%, transparent 65%)",
        }}
      />

      <div className="relative z-10 max-w-content mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

          {/* Left: copy */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span className="w-6 h-px bg-gold-500/60" />
              <p className="text-xs font-semibold tracking-widest uppercase text-gold-500 font-sans">
                Take the first step
              </p>
            </div>

            <h2
              className="font-sans font-semibold text-offwhite mb-6"
              style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)", lineHeight: "1.15", letterSpacing: "-0.02em" }}
            >
              Find out where your business is leaking growth.
            </h2>

            <p className="text-muted font-sans leading-relaxed mb-8 max-w-sm" style={{ fontSize: "1.0625rem" }}>
              Takes three minutes. Delivers a personal diagnostic within 48 hours.
              No sales call follows unless you want one.
            </p>

            {/* Sutherland's honest scarcity */}
            <div className="border-l-2 border-gold-500/30 pl-5">
              <p className="text-sm text-offwhite/60 font-sans leading-relaxed italic">
                &ldquo;The diagnostic is reviewed personally. Not every business turns out to be a fit for this approach — and that&rsquo;s the honest answer you&rsquo;ll sometimes get. But you won&rsquo;t know unless you submit.&rdquo;
              </p>
            </div>
          </div>

          {/* Right: condensed form */}
          <div className="lg:pl-8">
            <LeadCaptureForm variant="cta" />
          </div>
        </div>
      </div>
    </section>
  );
}
