import React from "react";
import LpFarmingModal from "./LpFarmingModal";
import { TriangleAlert } from "lucide-react";

type NoFarmingUtilitiesProps = {
  myBalance: BigInt;
  setToggleBuyEraModal: (value: boolean) => void;
};

const NoFarmingUtilities: React.FC<NoFarmingUtilitiesProps> = ({
  myBalance,
  setToggleBuyEraModal,
}) => {
  const [toggleLpFarmingModal, setToggleLpFarmingModal] =
    React.useState<boolean>(false);
  return (
    <>
      <LpFarmingModal
        setToggleLpFarmingModal={setToggleLpFarmingModal}
        toggleLpFarmingModal={toggleLpFarmingModal}
      />
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
          <div className="mt-8 p-6 rounded-3xl border border-solid bg-stone-50 border-stone-300 ">
            <button
              className="primary-button-sm tracking-wide text-neutral-700 px-6 py-3 text-base font-semibold font-NeueHaas capitalize"
              onClick={() => setToggleLpFarmingModal(true)}
            >
              Start LP Farming
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default NoFarmingUtilities;
