import { ConnectButton } from "@rainbow-me/rainbowkit";
import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";

import {
  Header,
  Community,
  Roadmap,
  OurTeam,
  OurPartners,
  Faq,
  Footer,
  HowItWorks,
  OurLiveUtil,
  EraUtil,
  HeroSection,
} from "../components/landing-page";

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
