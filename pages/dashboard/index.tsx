import type { NextPage } from "next";
import Faq from "../../components/ui/Faq";
import Footer from "../../components/ui/Footer";
import Header from "../../components/ui/Header";
import Dashboard from "../../components/dashboard/Dashboard";
import RewardSystem from "../../components/dashboard/RewardSystem";
import HeaderDashboard from "../../components/dashboard/HeaderDashboard";

const DashboardPage: NextPage = () => {
  return (
    <>
      <HeaderDashboard />
      <Dashboard />
      <RewardSystem />
      <Faq />
      <Footer />
    </>
  );
};

export default DashboardPage;
