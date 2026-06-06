const painPoints = [
  {
    title: "You're still the best salesperson in your business.",
    body: "That's not a compliment — it means every deal depends on you. One holiday and the pipeline dries up.",
  },
  {
    title: "Revenue is growing. Margin is thin.",
    body: "You're doing more and keeping less. You suspect something structural is wrong, but you can't quite put your finger on it.",
  },
  {
    title: "Your team is capable. But execution is patchy.",
    body: "Accountability is vague, priorities shift, and things fall through the gaps — not because of bad people, but because the system isn't there.",
  },
  {
    title: "You've been thinking about AI for months.",
    body: "Every week there's a new tool. You still don't have a coherent plan for where it fits in your business — or who owns it.",
  },
  {
    title: "Strategy sessions feel good.",
    body: "Then Monday arrives and the 90-day plan sits in a folder. The business runs on urgency again. The pattern repeats.",
  },
  {
    title: "Growth feels like firefighting with extra steps.",
    body: "More revenue means more complexity, more decisions, more bottlenecks. The business is working hard — but it doesn't feel like it's compounding.",
  },
];

export default function Pain() {
  return (
    <section className="py-24 md:py-32 bg-navy-800/40">
      <div className="max-w-content mx-auto px-6 md:px-12">
        {/* Section label */}
        <p className="text-xs font-semibold tracking-widest uppercase text-gold-500 mb-5">
          Sound familiar?
        </p>

        {/* Heading */}
        <h2
          className="font-display font-semibold text-offwhite mb-4 leading-tight max-w-2xl"
          style={{ fontSize: "clamp(2rem, 4vw, 3.25rem)", letterSpacing: "-0.015em" }}
        >
          If you&apos;re honest with yourself, you already know the problem.
        </h2>

        <p className="text-muted mb-14 max-w-xl" style={{ fontSize: "1.0625rem" }}>
          These aren&apos;t signs that something is wrong with you or your business. They&apos;re
          signs that the operating model hasn&apos;t kept pace with the ambition.
        </p>

        {/* Pain cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {painPoints.map((point, i) => (
            <div
              key={i}
              className="rounded-xl border border-white/5 bg-navy-800/60 p-7 hover:border-gold-500/20 hover:bg-navy-700/40 transition-all duration-300"
            >
              {/* Gold accent number */}
              <div className="text-gold-500/30 font-display text-4xl font-semibold mb-4 leading-none select-none">
                {String(i + 1).padStart(2, "0")}
              </div>
              <h3 className="text-offwhite font-semibold text-base mb-2 leading-snug">
                {point.title}
              </h3>
              <p className="text-muted text-sm leading-relaxed">{point.body}</p>
            </div>
          ))}
        </div>

        {/* Pull quote */}
        <div className="mt-16 border-l-2 border-gold-500/40 pl-8 max-w-2xl">
          <blockquote
            className="font-display italic text-offwhite/80 leading-snug"
            style={{ fontSize: "clamp(1.4rem, 2.5vw, 1.875rem)" }}
          >
            &ldquo;The bottleneck is almost never effort. It&apos;s almost always architecture.&rdquo;
          </blockquote>
          <cite className="block mt-4 text-sm text-muted not-italic">
            — Owen Neligan
          </cite>
        </div>
      </div>
    </section>
  );
}
