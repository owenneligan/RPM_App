import Hero from "@/components/sections/Hero";
import Pain from "@/components/sections/Pain";
import ValueProp from "@/components/sections/ValueProp";
import Diagnostic from "@/components/sections/Diagnostic";
import Credibility from "@/components/sections/Credibility";
import Method from "@/components/sections/Method";
import Cta from "@/components/sections/Cta";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <main>
      <Hero />
      <Pain />
      <ValueProp />
      <Method />
      <Diagnostic />
      <Credibility />
      <Cta />
      <Footer />
    </main>
  );
}
