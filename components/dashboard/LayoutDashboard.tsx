import React from "react";
import HeaderDashboard from "./HeaderDashboard";
import RewardSystem from "./RewardSystem";
import Footer from "../ui/Footer";
import FaqDashboard from "./FaqDashboard";

type LayoutDashboardProps = {
  children: React.ReactNode;
};

const LayoutDashboard = ({ children }: LayoutDashboardProps) => {
  return (
    <>
      <HeaderDashboard />
      {children}
      <RewardSystem />
      <FaqDashboard />
      <Footer />
    </>
  );
};

export default LayoutDashboard;
