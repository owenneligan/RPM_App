import type { Metadata } from "next";
import Link from "next/link";
import MainspringMark from "@/components/MainspringMark";

const CONTACT_EMAIL = process.env.CONTACT_EMAIL ?? "hello@mainspringadvisory.co.uk";

export const metadata: Metadata = {
  title: "Privacy Notice — Mainspring Advisory",
  description: "How Mainspring Advisory collects, uses and protects your personal information under UK GDPR.",
  robots: { index: false },
};

export default function Privacy() {
  return (
    <div style={{ background: "#16181A", minHeight: "100vh" }}>
      {/* Minimal nav */}
      <header style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", padding: "1.25rem 1.5rem" }}>
        <Link href="/" className="flex items-center gap-3" aria-label="Return to Mainspring Advisory">
          <MainspringMark color="#B9893E" className="h-6 w-auto" />
          <span className="font-display font-semibold text-parchment" style={{ fontSize: "0.9375rem", letterSpacing: "0.1em" }}>
            MAINSPRING ADVISORY
          </span>
        </Link>
      </header>

      <main className="max-w-content mx-auto px-6 md:px-12 py-16 md:py-24" style={{ maxWidth: "52rem" }}>
        <p className="eyebrow mb-5">LEGAL</p>
        <h1
          className="font-display font-semibold text-parchment"
          style={{ fontSize: "clamp(2rem,3vw,2.75rem)", lineHeight: 1.1, marginBottom: "2.5rem" }}
        >
          Privacy Notice
        </h1>

        <div className="space-y-8" style={{ fontSize: "0.9375rem", lineHeight: 1.75, color: "#8D9296" }}>

          <section>
            <h2 className="font-display font-semibold text-parchment" style={{ fontSize: "1.25rem", marginBottom: "0.75rem" }}>
              Who we are
            </h2>
            <p>
              Mainspring Advisory Ltd (&ldquo;Mainspring&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;) is a commercial consultancy based in Yorkshire, UK. We are the data controller for the personal information described in this notice. We operate under UK data protection law, including UK GDPR and the Data Protection Act 2018.
            </p>
          </section>

          <section>
            <h2 className="font-display font-semibold text-parchment" style={{ fontSize: "1.25rem", marginBottom: "0.75rem" }}>
              What we collect
            </h2>
            <p>When you submit the free diagnostic on this site, we collect:</p>
            <ul className="mt-3 space-y-1.5 list-none">
              {[
                "First name (required)",
                "Email address (required)",
                "Company name (optional)",
                "Annual revenue band (optional)",
                "Biggest growth bottleneck (optional)",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span style={{ color: "#B9893E", marginTop: "0.35rem", flexShrink: 0 }}>—</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4">
              We do not use cookies, tracking pixels or any third-party analytics scripts. Vercel Analytics, which powers our basic usage data, is privacy-friendly and does not use cookies.
            </p>
          </section>

          <section>
            <h2 className="font-display font-semibold text-parchment" style={{ fontSize: "1.25rem", marginBottom: "0.75rem" }}>
              Why we collect it and our lawful basis
            </h2>
            <p>
              We collect your contact details to deliver the Founder&rsquo;s Commercial Operating System Diagnostic — the specific service you requested. Our lawful basis is <strong style={{ color: "#EFE7D8" }}>consent</strong>: by submitting the form, you consent to us using your details for this purpose.
            </p>
            <p className="mt-3">
              With your consent, we may also occasionally send insights relevant to founder-led business growth. You can withdraw consent at any time by emailing{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: "#B9893E" }}>{CONTACT_EMAIL}</a>.
            </p>
          </section>

          <section>
            <h2 className="font-display font-semibold text-parchment" style={{ fontSize: "1.25rem", marginBottom: "0.75rem" }}>
              Where your data is stored
            </h2>
            <p>
              Your details are stored securely with Supabase, a cloud database provider that complies with UK GDPR. Data is encrypted in transit and at rest. We do not sell or share your personal information with third parties for marketing purposes.
            </p>
          </section>

          <section>
            <h2 className="font-display font-semibold text-parchment" style={{ fontSize: "1.25rem", marginBottom: "0.75rem" }}>
              How long we keep it
            </h2>
            <p>
              We retain your details for as long as necessary to provide the diagnostic and any follow-up communication you request. If you ask us to delete your data, we will do so promptly — see below.
            </p>
          </section>

          <section>
            <h2 className="font-display font-semibold text-parchment" style={{ fontSize: "1.25rem", marginBottom: "0.75rem" }}>
              Your rights
            </h2>
            <p>Under UK GDPR you have the right to:</p>
            <ul className="mt-3 space-y-1.5 list-none">
              {[
                "Access the personal data we hold about you",
                "Correct inaccurate data",
                "Request erasure of your data",
                "Withdraw consent at any time",
                "Lodge a complaint with the ICO (ico.org.uk)",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span style={{ color: "#B9893E", marginTop: "0.35rem", flexShrink: 0 }}>—</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4">
              To exercise any of these rights, email{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: "#B9893E" }}>{CONTACT_EMAIL}</a>. We will respond within 30 days.
            </p>
          </section>

          <section>
            <h2 className="font-display font-semibold text-parchment" style={{ fontSize: "1.25rem", marginBottom: "0.75rem" }}>
              Changes to this notice
            </h2>
            <p>
              We may update this notice occasionally. The current version is always at{" "}
              <Link href="/privacy" style={{ color: "#B9893E" }}>mainspringadvisory.co.uk/privacy</Link>.
            </p>
          </section>

          <p style={{ fontSize: "0.8125rem", color: "rgba(141,146,150,0.6)", paddingTop: "1rem", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            Last updated: June 2026
          </p>
        </div>
      </main>
    </div>
  );
}
