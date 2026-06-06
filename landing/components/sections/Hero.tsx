import LeadCaptureForm from "@/components/LeadCaptureForm";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center dot-grid overflow-hidden">
      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(196,149,58,0.07) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-content mx-auto px-6 md:px-12 py-24 md:py-32">
        {/* Pre-headline badge */}
        <div className="mb-8 animate-fade-up">
          <span className="inline-flex items-center gap-2 border border-gold-500/30 bg-gold-500/5 rounded-full px-4 py-1.5 text-xs font-semibold tracking-widest uppercase text-gold-400">
            Commercial Strategy · Systems · AI-Enabled Growth
          </span>
        </div>

        {/* Headline */}
        <h1
          className="font-display font-semibold text-offwhite leading-tight mb-6 animate-fade-up-delay-1"
          style={{ fontSize: "clamp(2.75rem, 6vw, 5.5rem)", letterSpacing: "-0.02em" }}
        >
          Your Business Is Growing.
          <br />
          <span className="text-gold-gradient">Your Systems Aren&apos;t.</span>
        </h1>

        {/* Subheadline */}
        <p
          className="text-muted leading-relaxed mb-10 max-w-2xl animate-fade-up-delay-2"
          style={{ fontSize: "clamp(1rem, 2vw, 1.2rem)" }}
        >
          Most founder-led businesses hit £1m–£5m and stall — not from lack of
          ambition, but because the operating model was never built to scale. Owen
          Neligan installs the commercial infrastructure your business needs to grow
          without you being the bottleneck in every room.
        </p>

        {/* CTA form */}
        <div className="max-w-2xl animate-fade-up-delay-3">
          <LeadCaptureForm variant="hero" />
        </div>

        {/* Trust strip */}
        <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 animate-fade-up-delay-3">
          <span className="text-xs text-muted/70 uppercase tracking-widest">
            MBA
          </span>
          <span className="text-gold-500/40 text-xs">·</span>
          <span className="text-xs text-muted/70 uppercase tracking-widest">
            Lean Six Sigma Black Belt
          </span>
          <span className="text-gold-500/40 text-xs">·</span>
          <span className="text-xs text-muted/70 uppercase tracking-widest">
            Senior Financial Services Leadership
          </span>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 opacity-30">
          <span className="text-xs text-muted uppercase tracking-widest">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-gold-500 to-transparent" />
        </div>
      </div>
    </section>
  );
}
