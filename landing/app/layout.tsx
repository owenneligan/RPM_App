import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Owen Neligan — Scale Without the Chaos",
  description:
    "Owen Neligan helps founder-led businesses install the commercial operating system they need to scale intelligently — using strategy, AI-enabled efficiency, and disciplined execution.",
  openGraph: {
    title: "Owen Neligan — Scale Without the Chaos",
    description:
      "Get the free Founder's Commercial Operating System Audit. Find exactly where your business is leaking growth.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <body className="bg-navy-900 text-offwhite antialiased">{children}</body>
    </html>
  );
}
