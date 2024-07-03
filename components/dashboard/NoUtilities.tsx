import { Info } from "lucide-react";
import React from "react";
import { useRouter } from "next/router";

const NoUtilities = () => {
  const Router = useRouter();
  return (
    <>
      {/* <div className="flex gap-5 justify-between mt-6 w-full font-medium max-md:flex-wrap max-md:max-w-full">
        <div className="flex gap-1.5 px-2.5 py-1 my-auto text-lg text-neutral-700 bg-surface-500 rounded">
          <div className="flex items center h-full">
            <Info width={24} height={24} />
          </div>
          <p className="flex items-center">You don’t have any utilities yet</p>
        </div>
        <div className="justify-center px-4 py-2 text-base text-neutral-700 bg-white border-2 border-black border-solid rounded-[38px]">
          APY : xx / Program duration : 1 an
        </div>
      </div> */}

      <div className="flex justify-center items-center px-16  text-lg text-neutral-700 max-md:px-5 max-md:max-w-full">
        <div className="flex gap-5 justify-between max-md:flex-wrap">
          <div className="flex gap-2.5 justify-center">
            <div className=" flex justify-center items-center px-[18px] py-[11px] font-semibold whitespace-nowrap bg-surface-500 border border-solid border-neutral-700 h-[44px] rounded-[38.095px] w-[44px]">
              1
            </div>
            <p className="my-auto font-medium">Buy $ERA on uniswap.org</p>
          </div>
          <div className="flex gap-2.5 justify-center">
            <div className=" flex justify-center items-center px-[18px] py-[11px] font-semibold whitespace-nowrap bg-surface-500 border border-solid border-neutral-700 h-[44px] rounded-[38.095px] w-[44px]">
              2
            </div>
            <p className="my-auto font-medium">Choose an utility</p>
          </div>
          <div className="flex gap-2.5 justify-center">
            <div className="flex justify-center items-center px-[18px] py-[11px] font-semibold whitespace-nowrap bg-surface-500 border border-solid border-neutral-700 h-[44px] rounded-[38.095px] w-[44px]">
              3
            </div>
            <p className="my-auto font-medium">Get rewards</p>
          </div>
        </div>
      </div>
      <div className="flex justify-center">
        <main className="flex flex-col mt-8 justify-center p-6 rounded-3xl border border-solid bg-stone-50 border-stone-300 max-w-[404px]">
          <div className="flex gap-1.5 pl-[9px] pr-[7px] py-1 text-lg font-medium text-black bg-orange-100 rounded">
            <div className="flex items-center">
              <Info width={17} height={17} />
            </div>
            <p>You have not joined a rewards program yet</p>
          </div>
          <section>
            <div className="flex gap-1.5 justify-between mt-6 whitespace-nowrap">
              <div className="text-xl font-bold text-black">Staking</div>
              <span className="justify-center self-start px-2.5 py-1 text-xs font-medium text-black bg-white border border-black border-solid rounded-[38px]">
                Recommended
              </span>
            </div>
            <div className="flex gap-2 justify-between mt-2 text-base font-medium text-black">
              <p>APR: xx</p>
              <p>Program duration: 1 year</p>
            </div>
          </section>
          <button
            className=" primary-button-sm justify-center self-start px-5 py-3 mt-6 text-base font-semibold   "
            onClick={() => Router.push("/dashboard/stacking")}
          >
            Start staking
          </button>
        </main>
      </div>
    </>
  );
};

export default NoUtilities;
