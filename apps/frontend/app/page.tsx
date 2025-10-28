import Collaborate from "@/components/collaborate";
import HeroSection from "@/components/hero";
import CallToAction from "@/components/cto";
import Footer from "@/components/footer";

// stitching css package/style into this Next.js app
import "@repo/styles/global";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <Collaborate />
      <CallToAction />
      <Footer />
    </div>
  );
}
