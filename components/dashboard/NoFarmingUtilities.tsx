import React from "react";
import Link from "next/link";

const NoFarmingUtilities = () => {
  return (
    <>
      <div className="flex justify-center items-center px-16  text-lg font-NeueHaas text-neutral-700 max-md:px-5 max-md:max-w-full">
        <div className="flex gap-5 justify-between max-md:flex-wrap">
          <div className="flex gap-2.5 justify-center">
            <div className=" flex justify-center items-center px-[18px] py-[11px] font-semibold whitespace-nowrap bg-surface-500 border border-solid border-neutral-700 h-[44px] rounded-[38.095px] w-[44px]">
              1
            </div>
            <p className="my-auto font-medium">Click On Start</p>
          </div>
          <div className="flex gap-2.5 justify-center">
            <div className=" flex justify-center items-center px-[18px] py-[11px] font-semibold whitespace-nowrap bg-surface-500 border border-solid border-neutral-700 h-[44px] rounded-[38.095px] w-[44px]">
              2
            </div>
            <p className="my-auto font-medium">Provide Liquidity</p>
          </div>
          <div className="flex gap-2.5 justify-center">
            <div className="flex justify-center items-center px-[18px] py-[11px] font-semibold whitespace-nowrap bg-surface-500 border border-solid border-neutral-700 h-[44px] rounded-[38.095px] w-[44px]">
              3
            </div>
            <p className="my-auto font-medium">Earn Rewards</p>
          </div>
        </div>
      </div>
      <div className="flex justify-center">
        <div className="mt-8 p-6 rounded-3xl border border-solid bg-stone-50 border-stone-300 ">
          <Link
            href={"/dashboard/farming"}
            className="primary-button-sm tracking-wide text-neutral-700 px-6 py-3 text-base font-semibold font-NeueHaas capitalize   "
          >
            Start LP Farming
          </Link>
        </div>
      </div>
    </>
  );
};

export default NoFarmingUtilities;
