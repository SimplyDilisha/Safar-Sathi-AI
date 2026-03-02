import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import PopularDestinations from "@/components/PopularDestinations";
import FeaturesSection from "@/components/FeaturesSection";
import Footer from "@/components/Footer";
import { PageTransition } from "@/components/PageTransition";

const Index = () => {
  return (
    <PageTransition>
      <div className="min-h-screen bg-background transition-colors duration-300">
        <Navbar />
        <HeroSection />
        <PopularDestinations />
        <FeaturesSection />
        <Footer />
      </div>
    </PageTransition>
  );
};

export default Index;
