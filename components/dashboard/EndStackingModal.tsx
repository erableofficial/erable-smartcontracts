import { Cake, X } from "lucide-react";
import * as React from "react";
import { useStakingContractData } from "../../context/stakingContractData";
import { approximateTime } from "../../lib/utils";
import { TabItem } from "../../lib/types";
import { formatEther } from "viem";

type EndStackingModalProps = {
  toggleEndStackingModal: boolean;
  setToggleEndStackingModal: (value: boolean) => void;
  stakeId: number;
  handleClaim: (stakeId: number) => void;
  stake: TabItem;
  stakingAPR: number;
};

type StakingInfoProps = {
  label: string;
  value: string;
};

const StakingInfo: React.FC<StakingInfoProps> = ({ label, value }) => (
  <div className="flex justify-between mt-5">
    <div>{label}</div>
    <div>{value}</div>
  </div>
);

const EndStackingModal: React.FC<EndStackingModalProps> = ({
  toggleEndStackingModal,
  setToggleEndStackingModal,
  stakeId,
  handleClaim,
  stake,
  stakingAPR,
}) => {
  const { stakingContractData } = useStakingContractData();
  if (!toggleEndStackingModal) return null;
  const closeModal = () => setToggleEndStackingModal(false);
  const stopPropagation = (event: React.MouseEvent) => {
    event.stopPropagation();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-40 z-[100] flex justify-center items-center"
      onClick={closeModal}
    >
      <div
        className="flex flex-col p-10 bg-white rounded-3xl border border-solid border-stone-300 max-w-[800px] max-h-[95vh] overflow-y-auto max-md:px-5"
        onClick={stopPropagation}
      >
        <div className="flex justify-end">
          <X
            size={32}
            width={14}
            height={14}
            color="#989898"
            cursor={"pointer"}
            onClick={closeModal}
          />
        </div>
        <div className="flex gap-3.5 self-start mt-3 max-md:flex-wrap">
          <div className="flex justify-center items-center p-[10.5px] bg-surface-500 h-[45px] rounded-[37.5px] w-[45px]">
            <Cake width={25} height={25} strokeWidth={2.67} />
          </div>
          <div className="my-auto text-[32px] font-semibold text-black">
            End of your staking program
          </div>
        </div>
        <div className="flex flex-col gap-[10px]">
          <div className="self-start mt-10 text-xl font-bold text-black">
            Total claimable
          </div>
          <p className="self-start  text-[32px] font-semibold text-black">
            {stake.currentRewards
              ? formatEther(stake.currentRewards + stake.amount)
              : formatEther(stake.amount)}{" "}
            $ERA
          </p>
        </div>
        <hr className="shrink-0 mt-6 mb-6 h-px border border-solid  border-neutral-300 max-md:max-w-full" />
        <div>
          <div className="text-xl font-bold text-black max-md:max-w-full">
            Staking key informations
          </div>
          <div className="flex justify-between mt-6 text-lg font-medium text-black max-md:flex-wrap max-md:max-w-full">
            <div className="flex flex-col w-full">
              <div className="flex justify-between">
                <div>Initial Staking</div>
                <div>{formatEther(stake.amount)} $ERA</div>
              </div>
              <StakingInfo label="Total APR" value={stakingAPR.toFixed(2)} />
              <StakingInfo
                label="Duration"
                value={approximateTime(
                  stake.unstakeRequested
                    ? (new Date(Number(stake.requestUnstakeTime)).getTime() -
                        stake.startTime) /
                        1000
                    : (stake.endTime - stake.startTime) / 1000
                )}
              />
              <StakingInfo
                label="Start Date"
                value={new Date(stake.startTime).toLocaleDateString()}
              />
              <StakingInfo
                label="End Date"
                value={
                  stake.action === "Claim"
                    ? new Date(
                        Number(stake.requestUnstakeTime)
                      ).toLocaleDateString()
                    : new Date(stake.endTime).toLocaleDateString()
                }
              />
            </div>
          </div>
        </div>
        <p className="mt-6 text-base font-medium text-neutral-600 max-md:max-w-full">
          You can now claim your tokens. Click on the claim button to initiate
          the transaction.
          <br />
          The process can take a few minutes.
        </p>
        <button
          className="primary-button-sm justify-center self-start px-5 py-3 mt-10 text-base font-semibold "
          onClick={() => {
            handleClaim(stakeId);
          }}
        >
          Claim my tokens
        </button>
      </div>
    </div>
  );
};

export default EndStackingModal;
