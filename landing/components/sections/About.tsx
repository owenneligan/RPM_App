"use client";

import Image from "next/image";
import MainspringMark from "@/components/MainspringMark";
import Reveal from "@/components/Reveal";

const CRED_PILLS = [
  "15 Years FS Leadership",
  "Commercial Strategy",
  "AI-Enabled Transformation",
];

export default function About() {
  return (
    <section style={{ background: "#EFE7D8" }} className="py-24 md:py-32">
      <div className="max-w-content mx-auto px-6 md:px-12">

        <Reveal>
          <p className="eyebrow mb-5" style={{ color: "#B9893E" }}>ABOUT</p>
          <h2
            className="font-display font-semibold"
            style={{ fontSize: "clamp(1.875rem,3vw,2.75rem)", lineHeight: 1.1, color: "#2A2C2E", marginBottom: "3rem" }}
          >
            Commercial rigour, without the corporate overhead.
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-10 lg:gap-16 items-start">

          {/* Headshot / fallback panel */}
          <Reveal>
            <div
              className="relative overflow-hidden"
              style={{ aspectRatio: "4/5", background: "#2A2C2E", borderRadius: "2px" }}
            >
              <Image
                src="/owen.jpg"
                alt="Owen Neligan, Founder of Mainspring Advisory"
                fill
                sizes="(max-width: 1024px) 100vw, 33vw"
                className="object-cover"
              />
              {/* Watermark fallback — shown beneath photo or alone if no image */}
              <div
                className="absolute inset-0 flex items-center justify-center"
                aria-hidden="true"
                style={{ opacity: 0.08 }}
              >
                <MainspringMark color="#EFE7D8" className="w-3/4" />
              </div>
            </div>
          </Reveal>

          {/* Bio */}
          <Reveal delay={80}>
            <div className="space-y-5">
              <p style={{ fontSize: "1rem", lineHeight: 1.75, color: "#5A5248" }}>
                I'm Owen Neligan. I've spent fifteen years in financial services leadership — running commercial P&Ls in environments where revenue and margin were existential questions, not academic ones. MBA-qualified, Lean Six Sigma Black Belt, and obsessive about one thing: the difference between businesses that run on effort and businesses that run on architecture.
              </p>
              <p style={{ fontSize: "1rem", lineHeight: 1.75, color: "#5A5248" }}>
                Mainspring exists for founder-led businesses between £500k and £5m — the stage where commercial potential is either captured or permanently lost, and where the right infrastructure pays back fastest. I take a small number of clients, I build alongside your team, and I hand the system back running. The name is the promise: a mainspring is wound once, then powers the whole mechanism on its own.
              </p>
            </div>

            {/* Credential pills */}
            <div className="flex flex-wrap gap-2 mt-6">
              {CRED_PILLS.map((pill) => (
                <span key={pill} className="cred-pill">{pill}</span>
              ))}
            </div>

            {/* LinkedIn */}
            <div className="mt-6">
              <a
                href="https://linkedin.com/in/owenneligan"
                target="_blank"
                rel="noopener noreferrer"
                className="brass-link"
                style={{ fontSize: "0.875rem" }}
              >
                LinkedIn — Owen Neligan
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
