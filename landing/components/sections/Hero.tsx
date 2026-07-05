import LeadCaptureForm from "@/components/LeadCaptureForm";

export default function Hero() {
  return (
    <section className="section-navy dot-grid relative min-h-screen flex flex-col justify-center overflow-hidden pt-16">
      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 50% -5%, rgba(196,149,58,0.09) 0%, transparent 65%)",
        }}
      />

      <div className="relative z-10 max-w-content mx-auto px-6 md:px-12 py-20 md:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left column — copy */}
          <div>
            {/* Eyebrow */}
            <div className="mb-7 animate-fade-up">
              <span className="inline-flex items-center gap-2.5 text-xs font-semibold tracking-widest uppercase text-gold-500">
                <span className="w-6 h-px bg-gold-500/60" />
                Commercial Advisory
              </span>
            </div>

            {/* Headline — Cormorant for the BIG moment */}
            <h1
              className="font-display font-semibold text-offwhite leading-none mb-6 animate-fade-up-1"
              style={{ fontSize: "clamp(2.75rem, 5.5vw, 5rem)", letterSpacing: "-0.025em", lineHeight: "1.03" }}
            >
              Your Business Has Outgrown
              <br />
              <span className="text-gold-gradient">the Way You Run It.</span>
            </h1>

            {/* Sub — shorter, sharper */}
            <p className="text-muted text-lg leading-relaxed mb-10 max-w-md animate-fade-up-2">
              We install the commercial operating systems that let founder-led businesses scale intelligently — without the founder becoming the bottleneck in every room.
            </p>

            {/* Hero form */}
            <div className="animate-fade-up-3">
              <LeadCaptureForm variant="hero" />
            </div>

            {/* Trust strip */}
            <div className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-2 animate-fade-up-3">
              {["MBA Qualified", "Lean Six Sigma Black Belt", "Commercial Strategy"].map((c, i) => (
                <span key={i} className="flex items-center gap-2 text-xs text-muted/60 uppercase tracking-widest">
                  {i > 0 && <span className="text-gold-500/30">·</span>}
                  {c}
                </span>
              ))}
            </div>
          </div>

          {/* Right column — the one big disarming line */}
          <div className="hidden lg:flex flex-col justify-center pl-8 border-l border-white/5">
            <p
              className="pull-quote text-offwhite/70"
              style={{ fontSize: "clamp(1.6rem, 2.2vw, 2.1rem)" }}
            >
              &ldquo;Most businesses at this stage don&rsquo;t need another strategy.
              <br /><br />
              They need their existing strategy to actually run.&rdquo;
            </p>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 opacity-25">
        <div className="w-px h-10 bg-gradient-to-b from-gold-500 to-transparent" />
      </div>
    </section>
  );
}
