export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-navy-900 border-t border-white/5">
      <div className="max-w-content mx-auto px-6 md:px-12 py-12">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8 mb-10">

          {/* Brand */}
          <div>
            <p className="font-display font-semibold text-offwhite text-xl mb-1">
              Cadence Consulting
            </p>
            <p className="text-xs text-muted font-sans uppercase tracking-widest">
              Commercial Advisory
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-col sm:flex-row gap-8 text-sm font-sans">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted/50 mb-3">Connect</p>
              <ul className="space-y-2">
                <li>
                  <a
                    href="https://linkedin.com/in/owenneligan"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted hover:text-gold-400 transition-colors duration-200 flex items-center gap-2"
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                      <rect x="2" y="9" width="4" height="12" />
                      <circle cx="4" cy="4" r="2" />
                    </svg>
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:[your@email.com]"
                    className="text-muted hover:text-gold-400 transition-colors duration-200"
                  >
                    [your@email.com]
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <hr className="gold-rule mb-6" />

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-muted/50 font-sans">
          <p>© {year} Cadence Consulting. All rights reserved.</p>
          <p className="max-w-xs leading-relaxed text-right">
            Your details are stored securely and never sold. You&rsquo;ll only hear from us when it&rsquo;s relevant.
          </p>
        </div>
      </div>
    </footer>
  );
}
