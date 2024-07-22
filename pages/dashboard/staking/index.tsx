import LayoutDashboard from "../../../components/dashboard/LayoutDashboard";
import Stacking from "../../../components/dashboard/stacking/Stacking";
import type { NextPageWithLayout } from "../../_app";
import type { ReactElement } from "react";

const StackingPage: NextPageWithLayout = () => {
  return (
    <>
      <Stacking />
    </>
  );
};

StackingPage.getLayout = function getLayout(page: ReactElement) {
  return <LayoutDashboard>{page}</LayoutDashboard>;
};

export default StackingPage;
