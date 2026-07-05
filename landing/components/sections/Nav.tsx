"use client";
import { useEffect, useState } from "react";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ${
        scrolled
          ? "bg-navy-900/96 backdrop-blur-md border-b border-white/5 shadow-2xl"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-content mx-auto px-6 md:px-12 h-16 flex items-center justify-between">
        <div className="flex items-baseline gap-3">
          <span className="font-display font-semibold text-offwhite text-lg tracking-wide">
            Cadence Consulting
          </span>
          <span className="hidden sm:block text-muted/60 text-xs uppercase tracking-widest font-sans">
            Commercial Advisory
          </span>
        </div>
        <a
          href="#audit"
          className="text-sm font-semibold font-sans bg-gold-500 hover:bg-gold-400 text-navy-900 px-5 py-2 rounded-lg transition-colors duration-200"
        >
          Free Audit
        </a>
      </div>
    </header>
  );
}
