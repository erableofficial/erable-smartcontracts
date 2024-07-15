import Head from "next/head";
import Dashboard from "../../components/dashboard/Dashboard";
import LayoutDashboard from "../../components/dashboard/LayoutDashboard";
import type { NextPageWithLayout } from "../_app";
import type { ReactElement } from "react";

const DashboardPage: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>ERA Token Dashboard - Manage Your ERA Utilities</title>
        <meta
          name="title"
          content="ERA Token Dashboard - Manage Your ERA Utilities"
        />
        <meta
          name="description"
          content="Access the ERA token dashboard by erable°. Manage your $ERA wallet, participate in staking, LP farming, and discover rewards. Join our mission of sustainable and impactful investing."
        />
        <meta
          name="keywords"
          content="ERA token, Erable°, impact investing, blockchain, dApp dashboard, staking, LP farming, $ERA wallet, rewards, sustainable finance, CLAP investors, decentralized finance"
        />
      </Head>

      <Dashboard />
    </>
  );
};

DashboardPage.getLayout = function getLayout(page: ReactElement) {
  return <LayoutDashboard>{page}</LayoutDashboard>;
};

export default DashboardPage;
