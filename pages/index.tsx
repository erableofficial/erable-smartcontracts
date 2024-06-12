import { ConnectButton } from "@rainbow-me/rainbowkit";
import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import Header from "../components/ui/header";
import Community from "../components/ui/Community";
import Roadmap from "../components/ui/Roadmap";
import OurTeam from "../components/ui/OurTeam";
import OurPartners from "../components/ui/OurPartners";
import Faq from "../components/ui/Faq";
import Footer from "../components/ui/Footer";
import HowItWorks from "../components/ui/HowItWorks";
import OurLiveUtil from "../components/ui/OurLiveUtil";
import EraUtil from "../components/ui/EraUtil";
import HeroSection from "../components/ui/HeroSection";

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
