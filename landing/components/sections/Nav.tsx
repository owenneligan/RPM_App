"use client";

import Link from "next/link";
import MainspringMark from "@/components/MainspringMark";

export default function Nav() {
  function scrollToDiagnostic(e: React.MouseEvent) {
    e.preventDefault();
    document.getElementById("diagnostic")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        background: "rgba(22,24,26,0.95)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
      }}
    >
      <nav
        className="max-w-content mx-auto px-6 md:px-12 flex items-center justify-between"
        style={{ height: "64px" }}
        aria-label="Primary navigation"
      >
        {/* Wordmark */}
        <Link href="/" className="flex items-center gap-3" aria-label="Mainspring Advisory home">
          <MainspringMark color="#B9893E" className="h-7 w-auto flex-shrink-0" />
          <span className="flex flex-col leading-none select-none">
            <span
              className="font-display font-semibold text-parchment"
              style={{ fontSize: "1.0625rem", letterSpacing: "0.12em" }}
            >
              MAINSPRING
            </span>
            <span className="eyebrow" style={{ fontSize: "0.5625rem", marginTop: "1px" }}>
              ADVISORY
            </span>
          </span>
        </Link>

        {/* CTA */}
        <a
          href="#diagnostic"
          onClick={scrollToDiagnostic}
          className="btn-brass hidden sm:inline-flex"
          style={{ padding: "0.625rem 1.25rem", fontSize: "0.6875rem" }}
        >
          GET THE FREE DIAGNOSTIC
        </a>
        <a
          href="#diagnostic"
          onClick={scrollToDiagnostic}
          className="btn-brass sm:hidden"
          style={{ padding: "0.625rem 1rem", fontSize: "0.625rem" }}
        >
          FREE DIAGNOSTIC
        </a>
      </nav>
    </header>
  );
}
