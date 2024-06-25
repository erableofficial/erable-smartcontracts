import React from "react";
import HeaderDashboard from "./HeaderDashboard";
import RewardSystem from "./RewardSystem";
import Faq from "../ui/Faq";
import Footer from "../ui/Footer";

type LayoutDashboardProps = {
  children: React.ReactNode;
};

const LayoutDashboard = ({ children }: LayoutDashboardProps) => {
  return (
    <>
      <HeaderDashboard />
      {children}
      <RewardSystem />
      <Faq />
      <Footer />
    </>
  );
};

export default LayoutDashboard;
