import { Info } from "lucide-react";
import React from "react";

const NoUtilities = () => {
  return (
    <>
      <div className="flex gap-5 justify-between mt-6 w-full font-medium max-md:flex-wrap max-md:max-w-full">
        <div className="flex gap-1.5 px-2.5 py-1 my-auto text-lg text-neutral-700 bg-yellow-200 rounded">
          <Info width={24} height={24} />
          <p>You don’t have any utilities yet</p>
        </div>
        <div className="justify-center px-4 py-2 text-base text-neutral-700 bg-white border-2 border-black border-solid rounded-[38px]">
          APY : xx / Program duration : 1 an
        </div>
      </div>

      <div className="flex justify-center items-center px-16 mt-6 text-lg text-neutral-700 max-md:px-5 max-md:max-w-full">
        <div className="flex gap-5 justify-between max-md:flex-wrap">
          <div className="flex gap-2.5 justify-center">
            <div className=" flex justify-center items-center px-3.5 py-2 font-semibold whitespace-nowrap bg-yellow-200 border border-solid border-stone-300 h-[33px] rounded-[38.095px] w-[33px]">
              1
            </div>
            <p className="my-auto font-medium">Buy $ERA on uniswap.org</p>
          </div>
          <div className="flex gap-2.5 justify-center">
            <div className=" flex justify-center items-center px-3.5 py-2 font-semibold whitespace-nowrap bg-yellow-200 border border-solid border-stone-300 h-[33px] rounded-[38.095px] w-[33px]">
              2
            </div>
            <p className="my-auto font-medium">Choose an utility</p>
          </div>
          <div className="flex gap-2.5 justify-center">
            <div className="flex justify-center items-center px-3.5 py-2 font-semibold whitespace-nowrap bg-yellow-200 border border-solid border-stone-300 h-[33px] rounded-[38.095px] w-[33px]">
              3
            </div>
            <p className="my-auto font-medium">Get rewards</p>
          </div>
        </div>
      </div>

      <button className="justify-center self-center px-7 py-4 mt-6 text-lg font-semibold text-neutral-700 bg-emerald-200 rounded-xl border-black border-solid border-[3px] max-md:px-5">
        Discover our staking opportunity
      </button>
    </>
  );
};

export default NoUtilities;
