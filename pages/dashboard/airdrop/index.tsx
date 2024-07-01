import LayoutDashboard from "../../../components/dashboard/LayoutDashboard";
import Stacking from "../../../components/dashboard/stacking/Stacking";
import type { NextPageWithLayout } from "../../_app";
import type { ReactElement } from "react";

const AirdropPage: NextPageWithLayout = () => {
  return (
    <>
      <div className=" relative flex pb-20 pt-20 bg-neutral-50 flex-col px-20 max-md:px-5 max-md:pt-7">
        <div className="text-5xl capitalize text-center font-semibold text-neutral-700 max-md:max-w-full max-md:text-4xl">
          Claim your airdrop
        </div>
      </div>
    </>
  );
};

AirdropPage.getLayout = function getLayout(page: ReactElement) {
  return <LayoutDashboard>{page}</LayoutDashboard>;
};

export default AirdropPage;
