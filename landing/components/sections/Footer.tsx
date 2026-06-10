import Link from "next/link";
import MainspringMark from "@/components/MainspringMark";

const CONTACT_EMAIL = process.env.CONTACT_EMAIL ?? "hello@mainspringadvisory.co.uk";

export default function Footer() {
  return (
    <footer style={{ background: "#1F2225", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
      <div className="max-w-content mx-auto px-6 md:px-12 py-12 md:py-16">

        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8 mb-10">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <MainspringMark color="#B9893E" className="h-6 w-auto" />
              <span className="flex flex-col leading-none">
                <span
                  className="font-display font-semibold text-parchment"
                  style={{ fontSize: "0.9375rem", letterSpacing: "0.1em" }}
                >
                  MAINSPRING
                </span>
                <span className="eyebrow" style={{ fontSize: "0.5rem", marginTop: "1px" }}>
                  ADVISORY
                </span>
              </span>
            </div>
            <p style={{ fontSize: "0.8125rem", color: "#8D9296", marginTop: "0.25rem" }}>
              Built in Yorkshire. Working anywhere.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-10" style={{ fontSize: "0.875rem" }}>
            <a
              href="https://linkedin.com/in/owenneligan"
              target="_blank"
              rel="noopener noreferrer"
              className="brass-link"
              style={{ color: "#8D9296" }}
            >
              LinkedIn
            </a>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="brass-link"
              style={{ color: "#8D9296" }}
            >
              {CONTACT_EMAIL}
            </a>
            <Link
              href="/privacy"
              className="brass-link"
              style={{ color: "#8D9296" }}
            >
              Privacy
            </Link>
          </div>
        </div>

        <div
          style={{ height: "1px", background: "rgba(255,255,255,0.05)", marginBottom: "1.5rem" }}
          role="separator"
        />

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p style={{ fontSize: "0.75rem", color: "#8D9296" }}>
            © 2026 Mainspring Advisory Ltd
          </p>
          <p style={{ fontSize: "0.75rem", color: "rgba(141,146,150,0.6)", maxWidth: "42ch", textAlign: "right" }}>
            No cookies, no trackers, no spam. Your details are handled under UK data protection law.
          </p>
        </div>
      </div>
    </footer>
  );
}
