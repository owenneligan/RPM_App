export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-navy-900 border-t border-white/5">
      <div className="max-w-content mx-auto px-6 md:px-12 py-12">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
          {/* Brand */}
          <div className="max-w-xs">
            <p className="font-display text-xl font-semibold text-offwhite mb-2">
              Owen Neligan
            </p>
            <p className="text-xs text-muted leading-relaxed">
              Commercial Operating Systems for founder-led businesses ready to scale
              intelligently.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-col sm:flex-row gap-8 text-sm">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-3">
                Connect
              </p>
              <ul className="space-y-2">
                <li>
                  <a
                    href="https://linkedin.com/in/owenneligan"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted hover:text-gold-400 transition-colors duration-200 flex items-center gap-2"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
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

            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-3">
                Legal
              </p>
              <ul className="space-y-2 text-muted text-sm">
                <li>Privacy Policy</li>
                <li>Terms of Use</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/5 mt-10 pt-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-muted/60">
            <p>© {year} Owen Neligan. All rights reserved.</p>
            <p className="max-w-sm leading-relaxed">
              Your details are stored securely and never sold to third parties. You&apos;ll
              only receive relevant insights. Unsubscribe any time.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
