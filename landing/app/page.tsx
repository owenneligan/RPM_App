import Nav from "@/components/sections/Nav";
import Hero from "@/components/sections/Hero";
import Pain from "@/components/sections/Pain";
import ValueProp from "@/components/sections/ValueProp";
import WhoFor from "@/components/sections/WhoFor";
import System from "@/components/sections/System";
import Method from "@/components/sections/Method";
import About from "@/components/sections/About";
import FoundingClients from "@/components/sections/FoundingClients";
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
        <ValueProp />
        <WhoFor />
        <System />
        <Method />
        <About />
        <FoundingClients />
        <Diagnostic />
        <Cta />
      </main>
      <Footer />
    </>
  );
}
