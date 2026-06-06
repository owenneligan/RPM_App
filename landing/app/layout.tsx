import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "[COMPANY NAME] — Commercial Operating Systems for Founder-Led Businesses",
  description:
    "We help founder-led businesses between £500k–£5m install the commercial infrastructure they need to scale intelligently — without the founder becoming the bottleneck.",
  openGraph: {
    title: "[COMPANY NAME]",
    description:
      "Get the free Founder's Commercial OS Audit — a personal diagnostic of where your business is leaking growth.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <body className="bg-navy-900 text-offwhite antialiased font-sans">{children}</body>
    </html>
  );
}
