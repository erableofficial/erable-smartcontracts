import Dashboard from "../../../components/dashboard/Dashboard";
import HeaderDashboard from "../../../components/dashboard/HeaderDashboard";
import RewardSystem from "../../../components/dashboard/RewardSystem";
import Stacking from "../../../components/dashboard/Stacking";
import Faq from "../../../components/ui/Faq";
import Footer from "../../../components/ui/Footer";
import type { NextPage } from "next";

const StackingPage: NextPage = () => {
  return (
    <>
      <HeaderDashboard />
      <Stacking />
      <RewardSystem />
      <Faq />
      <Footer />
    </>
  );
};

export default StackingPage;
