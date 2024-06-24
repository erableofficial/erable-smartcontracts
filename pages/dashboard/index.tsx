import Dashboard from "../../components/dashboard/Dashboard";
import LayoutDashboard from "../../components/dashboard/LayoutDashboard";
import type { NextPageWithLayout } from "../_app";
import type { ReactElement } from "react";

const DashboardPage: NextPageWithLayout = () => {
  return (
    <>
      <Dashboard />
    </>
  );
};

DashboardPage.getLayout = function getLayout(page: ReactElement) {
  return <LayoutDashboard>{page}</LayoutDashboard>;
};

export default DashboardPage;
