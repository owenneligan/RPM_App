import LeadCaptureForm from "@/components/LeadCaptureForm";
import MainspringMark from "@/components/MainspringMark";

export default function Hero() {
  return (
    <section
      className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-16 ring-texture"
      style={{ background: "#16181A" }}
    >
      <div className="relative z-10 max-w-content mx-auto px-6 md:px-12 py-20 md:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left column */}
          <div>
            {/* Animated mark — hero only, draws once */}
            <div className="mb-8 hero-fade-0">
              <MainspringMark
                color="#B9893E"
                className="h-8 w-auto"
                drawAnimate
              />
            </div>

            {/* Eyebrow */}
            <p className="eyebrow mb-6 hero-fade-0" style={{ color: "#B9893E" }}>
              COMMERCIAL OPERATING SYSTEMS &nbsp;·&nbsp; FOUNDER-LED BUSINESSES &nbsp;·&nbsp; £500K–£5M
            </p>

            {/* H1 */}
            <h1
              className="font-display font-semibold text-parchment hero-fade-1"
              style={{
                fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
                lineHeight: 1.06,
                letterSpacing: "-0.02em",
                marginBottom: "1.5rem",
              }}
            >
              Your business has outgrown the way you run it.
            </h1>

            {/* Subhead */}
            <p
              className="hero-fade-2"
              style={{ fontSize: "clamp(1rem, 1.4vw, 1.0625rem)", lineHeight: 1.65, color: "#8D9296", marginBottom: "2.5rem", maxWidth: "44ch" }}
            >
              Mainspring installs the commercial operating system that lets a founder-led business grow without the founder in every room. Working infrastructure — sales, accountability, automation, rhythm — built in 90 days and handed back to you, running.
            </p>

            {/* Form */}
            <div className="hero-fade-3">
              <LeadCaptureForm variant="hero" />
            </div>

            {/* Microcopy */}
            <p className="hero-fade-3 mt-3" style={{ fontSize: "0.8125rem", color: "#8D9296" }}>
              Free. Scored personally. In your inbox within 48 hours. No pitch on the other end.
            </p>

            {/* Trust strip */}
            <div className="hero-fade-4 mt-8 flex flex-wrap gap-x-5 gap-y-1.5">
              {["MBA", "Lean Six Sigma Black Belt", "15 years in financial services leadership"].map((c) => (
                <span key={c} className="text-steel" style={{ fontSize: "0.75rem", letterSpacing: "0.04em" }}>
                  {c}
                </span>
              ))}
            </div>
          </div>

          {/* Right column — pull quote */}
          <div
            className="hidden lg:flex items-center"
            style={{ borderLeft: "1px solid rgba(255,255,255,0.06)", paddingLeft: "3rem" }}
          >
            <blockquote>
              <p
                className="pull-quote text-parchment"
                style={{ fontSize: "clamp(1.5rem, 2vw, 1.875rem)", opacity: 0.85 }}
              >
                &ldquo;A business that depends on its founder is a job. A business that runs on systems is an asset.&rdquo;
              </p>
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  );
}
