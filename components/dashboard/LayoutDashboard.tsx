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
    <div className="bg-neutral-50">
      <HeaderDashboard />
      {children}
      <RewardSystem />
      <FaqDashboard />
      <Footer />
    </div>
  );
};

export default LayoutDashboard;
