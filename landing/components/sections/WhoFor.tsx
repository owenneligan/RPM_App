const forYouIf = [
  "You run a services, professional, or B2B business",
  "You have a team — at least three people who rely on you to make the decisions",
  "Revenue between £500k–£5m — you've proven the model. Now you need the infrastructure",
  "You've tried solving this with a new hire, a consultant's deck, or a new process tool — and the problem is still there",
  "You're ready to work on the business. Not just in it",
];

const notForYouIf = [
  "You need a marketing agency or a sales team",
  "You're pre-revenue or still finding product-market fit",
  "You want someone to run your operations for you",
];

export default function WhoFor() {
  return (
    <section className="section-navy py-24 md:py-28 relative overflow-hidden">
      {/* Decorative element */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-gold-500/20 to-transparent"
        aria-hidden
      />

      <div className="max-w-content mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

          {/* Left — who it's for */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span className="w-6 h-px bg-gold-500/60" />
              <p className="text-xs font-semibold tracking-widest uppercase text-gold-500 font-sans">
                This is built for you if
              </p>
            </div>

            <h2
              className="font-sans font-semibold text-offwhite mb-8"
              style={{ fontSize: "clamp(1.6rem, 2.5vw, 2.25rem)", lineHeight: "1.15", letterSpacing: "-0.02em" }}
            >
              Five things that tell us
              <br />we&rsquo;re talking to the right founder.
            </h2>

            <ul className="space-y-5">
              {forYouIf.map((item, i) => (
                <li key={i} className="check-item">
                  <span className="check-icon" aria-hidden>
                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                      <path d="M1.5 4L3.5 6L6.5 2" stroke="#C4953A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span className="text-offwhite/80 text-sm leading-relaxed font-sans">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right — who it's not for (honest signal = trust) */}
          <div className="lg:pl-8 lg:border-l lg:border-white/5">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-6 h-px bg-muted/30" />
              <p className="text-xs font-semibold tracking-widest uppercase text-muted/60 font-sans">
                Not the right fit if
              </p>
            </div>

            <ul className="space-y-4 mb-10">
              {notForYouIf.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-4 h-4 mt-0.5 rounded-full border border-muted/20 bg-white/3 flex items-center justify-center">
                    <span className="block w-1.5 h-px bg-muted/50" />
                  </span>
                  <span className="text-muted text-sm leading-relaxed font-sans">{item}</span>
                </li>
              ))}
            </ul>

            {/* Honest statement box */}
            <div className="rounded-xl border border-white/5 bg-white/3 p-6">
              <p className="text-sm text-offwhite/70 leading-relaxed font-sans">
                If you&rsquo;re not sure whether this applies to your situation, submit the free diagnostic anyway.
                The honest answer — whether it&rsquo;s a fit or not — will be in your inbox within 48 hours.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
