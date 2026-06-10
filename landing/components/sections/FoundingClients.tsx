import Reveal from "@/components/Reveal";

export default function FoundingClients() {
  return (
    <section style={{ background: "#16181A", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" }} className="py-14 md:py-16">
      <div className="max-w-content mx-auto px-6 md:px-12">
        <Reveal>
          <p
            className="text-center"
            style={{ fontSize: "clamp(0.9375rem,1.2vw,1.0625rem)", lineHeight: 1.75, color: "#8D9296", maxWidth: "55ch", margin: "0 auto" }}
          >
            Mainspring is taking three founding clients in 2026 — at a founding rate, in exchange for documented results. If the diagnostic shows a fit, you'll be told plainly. If it doesn't, you'll be told that too.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
