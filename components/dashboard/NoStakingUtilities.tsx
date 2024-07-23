import { Info, TriangleAlert } from "lucide-react";
import Link from "next/link";
import React from "react";
import { useStakingContractData } from "../../context/stakingContractData";
import { formatEther } from "viem";
import { approximateTime } from "../../lib/utils";

type NoStakingUtilitiesProps = {
  myBalance: BigInt;
  setToggleBuyEraModal: (value: boolean) => void;
};

const NoStakingUtilities: React.FC<NoStakingUtilitiesProps> = ({
  myBalance,
  setToggleBuyEraModal,
}) => {
  const { stakingContractData } = useStakingContractData();

  return (
    <>
      <div className="flex justify-center items-center px-16 font-NeueHaas  text-lg text-neutral-700 max-md:px-5 max-md:max-w-full">
        <div className="flex gap-5 justify-between max-md:flex-wrap">
          <div className="flex gap-2.5 justify-center">
            <div className=" flex justify-center items-center px-[18px] py-[11px] font-semibold whitespace-nowrap bg-surface-500 border border-solid border-neutral-700 h-[44px] rounded-[38.095px] w-[44px]">
              1
            </div>
            <p className="my-auto font-medium capitalize">Set Up Staking</p>
          </div>
          <div className="flex gap-2.5 justify-center">
            <div className=" flex justify-center items-center px-[18px] py-[11px] font-semibold whitespace-nowrap bg-surface-500 border border-solid border-neutral-700 h-[44px] rounded-[38.095px] w-[44px]">
              2
            </div>
            <p className="my-auto font-medium capitalize">Transfer Funds</p>
          </div>
          <div className="flex gap-2.5 justify-center">
            <div className="flex justify-center items-center px-[18px] py-[11px] font-semibold whitespace-nowrap bg-surface-500 border border-solid border-neutral-700 h-[44px] rounded-[38.095px] w-[44px]">
              3
            </div>
            <p className="my-auto font-medium capitalize">Confirmation</p>
          </div>
        </div>
      </div>
      <div className="flex justify-center">
        {myBalance == BigInt(0) ? (
          <div className="flex flex-col items-center">
            <div className="flex gap-1.5 px-2.5 items-center py-1 my-10 text-base font-medium text-neutral-700 bg-danger-200 rounded w-fit">
              <TriangleAlert width={17} height={17} />
              <p>You don’t have enough $ERA, buy more on uniswap </p>
            </div>
            <button
              className="primary-button-sm font-semibold w-fit justify-center px-6 py-3 text-base text-neutral-700 bg-surface-primary rounded-lg border-2 border-black border-solid max-md:px-5"
              onClick={() => setToggleBuyEraModal(true)}
            >
              Buy $ERA
            </button>
          </div>
        ) : (
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
                <p>APR: 11.52%</p>
                <p>
                  Program duration:{" "}
                  {stakingContractData?.stakingDuration
                    ? approximateTime(
                        Number(stakingContractData?.stakingDuration)
                      )
                    : "0 year"}
                </p>
              </div>
            </section>
            <Link
              href="/dashboard/staking"
              className="primary-button-sm justify-center self-start px-5 py-3 mt-6 text-base font-semibold   "
            >
              Start staking
            </Link>
          </main>
        )}
      </div>
    </>
  );
};

export default NoStakingUtilities;
