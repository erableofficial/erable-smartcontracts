import type { NextPage } from "next";
import Community from "../components/ui/Community";
import EraUtil from "../components/ui/EraUtil";
import Faq from "../components/ui/Faq";
import Footer from "../components/ui/Footer";
import Header from "../components/ui/Header";
import HeroSection from "../components/ui/HeroSection";
import OurLiveUtil from "../components/ui/OurLiveUtil";
import Roadmap from "../components/ui/Roadmap";
import OurTeam from "../components/ui/OurTeam";
import OurPartners from "../components/ui/OurPartners";
import HowItWorks from "../components/ui/HowItWorks";

const Home: NextPage = () => {
  return (
    <>
      <Header />
      <HeroSection />
      <EraUtil />
      <OurLiveUtil />
      <HowItWorks />
      <Community />
      <Roadmap />
      <OurTeam />
      <OurPartners />
      <Faq />
      <Footer />
    </>
  );
};

export default Home;
