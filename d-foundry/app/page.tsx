import Hero from "@/components/Hero";
import ProblemFix from "@/components/ProblemFix";
import Services from "@/components/Services";
import Process from "@/components/Process";
import RecentWork from "@/components/RecentWork";
import Products from "@/components/Products";
import ContactSection from "@/components/ContactSection";

export default function Home() {
  return (
    <>
      <Hero />
      <ProblemFix />
      <Services />
      <Process />
      <RecentWork />
      <Products />
      <ContactSection />
    </>
  );
}
