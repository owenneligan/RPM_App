import type { Metadata } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400"],
  variable: "--font-jost",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://mainspringadvisory.co.uk";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Mainspring Advisory — Commercial Operating Systems for Founder-Led Businesses",
  description:
    "Mainspring installs the sales systems, accountability frameworks, automation and operating rhythm that let £500k–£5m founder-led businesses grow without the founder in every room. Start with the free 48-hour diagnostic.",
  openGraph: {
    title: "Mainspring Advisory — Commercial Operating Systems for Founder-Led Businesses",
    description:
      "Mainspring installs the sales systems, accountability frameworks, automation and operating rhythm that let £500k–£5m founder-led businesses grow without the founder in every room. Start with the free 48-hour diagnostic.",
    url: siteUrl,
    siteName: "Mainspring Advisory",
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mainspring Advisory — Commercial Operating Systems for Founder-Led Businesses",
    description:
      "Mainspring installs the sales systems, accountability frameworks, automation and operating rhythm that let £500k–£5m founder-led businesses grow without the founder in every room. Start with the free 48-hour diagnostic.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: { canonical: siteUrl },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${jost.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ProfessionalService",
              name: "Mainspring Advisory",
              url: siteUrl,
              description:
                "Commercial operating systems for founder-led businesses between £500k and £5m. Based in Yorkshire, UK.",
              areaServed: "GB",
              founder: {
                "@type": "Person",
                name: "Owen Neligan",
                url: "https://linkedin.com/in/owenneligan",
                jobTitle: "Founder",
                alumniOf: ["MBA", "Lean Six Sigma Black Belt"],
              },
              knowsAbout: [
                "Commercial Strategy",
                "Sales Systems",
                "Operational Efficiency",
                "AI-Enabled Transformation",
                "Founder-Led Business Growth",
              ],
            }),
          }}
        />
      </head>
      <body style={{ background: "#16181A", color: "#EFE7D8" }}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
