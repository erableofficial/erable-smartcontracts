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
import { useEffect } from "react";
import sal, { Options } from "sal.js";
import { useRouter } from "next/router";

const Home: NextPage = () => {
  const router = useRouter();

  useEffect(() => {
    const options: Options = { threshold: 0.1, once: true, root: null };
    sal(options);
  }, [router.asPath]);

  useEffect(() => {
    sal();
  }, []);
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
