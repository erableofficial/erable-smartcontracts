import * as React from "react";
import { ArrowUpRight, Info, SlidersVertical, X } from "lucide-react";

interface LpFarmingModalProps {
  toggleLpFarmingModal: boolean;
  setToggleLpFarmingModal: (value: boolean) => void;
}

const LpFarmingModal: React.FC<LpFarmingModalProps> = ({
  toggleLpFarmingModal,
  setToggleLpFarmingModal,
}) => {
  if (!toggleLpFarmingModal) return null;
  const closeModal = () => {
    setToggleLpFarmingModal(false);
  };

  const stopPropagation = (event: React.MouseEvent) => {
    event.stopPropagation();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-40 z-[100] flex justify-center items-center"
      onClick={closeModal}
    >
      <div
        className="flex flex-col items-left px-10 pt-10 pb-10 bg-white rounded-[20px] border border-solid border-stone-300 max-w-[800px] max-md:px-5 absolute"
        onClick={stopPropagation}
      >
        <div className="flex justify-end">
          <X
            size={32}
            width={14}
            height={14}
            color="#989898"
            cursor={"pointer"}
            onClick={() => setToggleLpFarmingModal(false)}
          />
        </div>
        <div className=" flex items-center justify-between mt-3 text-3xl font-semibold mb-10 text-neutral-700">
          <div className="flex gap-3 items-center">
            <span className="flex justify-center items-center px-3  bg-surface-500 h-[45px] rounded-[37.5px] w-[45px]">
              <SlidersVertical size={32} width={24} height={24} />
            </span>
            LP Farming
          </div>
        </div>
        <div className="flex flex-row self-stretch p-5 mb-6 bg-white rounded-xl border-2 border-solid border-stone-300 max-w-[720px]">
          <div className="flex gap-3.5 max-md:flex-wrap">
            <div className="flex justify-center mr-3 items-center p-2 bg-surface-500 h-[35px] rounded-[29.167px] w-[35px]">
              <Info height={17} width={17} color="#000000" />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex-1 my-auto text-xl font-bold text-neutral-700 max-md:max-w-full">
              Provide Liquidity on Uniswap to Start Earning Daily Rewards in
              $ERA
            </div>
            <div className="self-start text-base font-medium text-neutral-700 max-md:max-w-full">
              To participate in the program and earn rewards with your $ERA
              tokens, follow these steps:
              <br />
              <ol style={{ listStyleType: "decimal", marginLeft: "20px" }}>
                <li className="font-bold">
                  Provide Liquidity on Uniswap:
                  <span className="font-medium">
                    {" "}
                    Add liquidity to the $ERA pool on Uniswap (click here)
                  </span>
                </li>
                <li className="font-bold">
                  Head over to Merkl:
                  <span className="font-medium">
                    {" "}
                    Visit Merkl to claim your daily distributed rewards (click
                    here)
                  </span>
                </li>
              </ol>
            </div>
          </div>
        </div>
        <p className="self-stretch text-base font-medium text-left text-neutral-600 max-md:max-w-full">
          Click on Start to go to Uniswap and provide liquidity.
          <br />
          This secure process allows you to participate in the LP Farming
          program and earn rewards with your $ERA tokens. For more information
          or assistance, please read the tutorial.
        </p>

        <div className="flex gap-2.5 justify-left mt-10 text-base font-semibold text-neutral-700">
          <button className="secondary-button-sm">Read tutorial</button>
          <button className="primary-button-sm">
            <>
              <span className="my-auto">Start providing liquidity</span>
              <ArrowUpRight width={24} height={24} size={32} color="#000000" />
            </>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LpFarmingModal;
