import Nav from "@/components/sections/Nav";
import Hero from "@/components/sections/Hero";
import Pain from "@/components/sections/Pain";
import WhoFor from "@/components/sections/WhoFor";
import ValueProp from "@/components/sections/ValueProp";
import Method from "@/components/sections/Method";
import Credibility from "@/components/sections/Credibility";
import Diagnostic from "@/components/sections/Diagnostic";
import Cta from "@/components/sections/Cta";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Pain />
        <WhoFor />
        <ValueProp />
        <Method />
        <Credibility />
        <Diagnostic />
        <Cta />
      </main>
      <Footer />
    </>
  );
}
