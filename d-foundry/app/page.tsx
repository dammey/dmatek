import { AdireBand, DmatekBar } from "@dmatek/brand";
import HeroEngine from "@/components/HeroEngine";
import ProblemFix from "@/components/ProblemFix";
import Services from "@/components/Services";
import Process from "@/components/Process";
import RecentWork from "@/components/RecentWork";
import Products from "@/components/Products";
import ContactSection from "@/components/ContactSection";
import WhatsAppFab from "@/components/WhatsAppFab";
import { DMATEK_URL } from "@/lib/sites";

export default function Home() {
  return (
    <>
      <DmatekBar dmatekUrl={DMATEK_URL} />
      <HeroEngine />
      <ProblemFix />
      <Services />
      <Process />
      <RecentWork />
      <Products />
      <ContactSection />
      <AdireBand variant="footer" />
      <WhatsAppFab />
    </>
  );
}
