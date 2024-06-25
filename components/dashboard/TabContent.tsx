import { Info } from "lucide-react";
import React from "react";
import { TabItem } from "../../lib/types";
import StakeItem from "./StakeItem";
import WithdrawTokenCdModal from "./WithdrawTokenCdModal";
import Tooltip from "./Tooltip";

type TabContentProps = {
  Items: TabItem[];
};

const TabContent: React.FC<TabContentProps> = ({ Items }) => {
  const [toggleWithdrawTokenCdModalModal, setToggleWithdrawTokenCdModalModal] =
    React.useState(false);
  const handleActionClick = (
    action: string,
    daysLeft: string | null | undefined
  ) => {
    if (action === "Claim" && daysLeft == null) {
      setToggleWithdrawTokenCdModalModal(true);
    }
  };
  return (
    <div className="flex flex-col self-stretch p-6 bg-white rounded-3xl border border-solid border-stone-300 max-md:px-5">
      <WithdrawTokenCdModal
        toggleWithdrawTokenCdModalModal={toggleWithdrawTokenCdModalModal}
        setToggleWithdrawTokenCdModalModal={setToggleWithdrawTokenCdModalModal}
      />
      <section className="flex gap-0 max-md:flex-wrap max-md:max-w-full">
        <div className="flex flex-col flex-1 items-start p-2.5 text-base font-medium whitespace-nowrap max-md:pr-5">
          <div className="flex items-center gap-1 pr-2.5 text-neutral-500">
            <div>Type</div>
            <Tooltip message="The kind of reward program being performed (e.g., Staking, LP Farming, Earn).">
              <Info width={15} height={15} color="#7C7C7C" cursor={"pointer"} />
            </Tooltip>
          </div>
          {/* <div className="justify-center px-4 py-2 mt-5 text-neutral-700 bg-yellow-200 border-2 border-black border-solid rounded-[38px]">
        Staking
      </div> */}
        </div>
        <div className="flex flex-col flex-1 items-start p-2.5 font-medium max-md:pr-5">
          <div className="flex gap-1 items-center px-0.5 text-base text-neutral-500">
            <div>Start Date</div>
            <Tooltip message="The date on which the reward program started.">
              <Info width={15} height={15} color="#7C7C7C" cursor={"pointer"} />
            </Tooltip>
          </div>
          {/* <div className="mt-8 text-lg text-neutral-700">JJ/MM/AAAA</div> */}
        </div>
        <div className="flex flex-col flex-1 items-start p-2.5 font-medium whitespace-nowrap max-md:pr-5">
          <div className="flex items-center gap-1 pr-2 text-base text-neutral-500">
            <div>Amount</div>
            <Tooltip message="The total quantity of $ERA involved in the reward program.">
              <Info width={15} height={15} color="#7C7C7C" cursor={"pointer"} />
            </Tooltip>
          </div>
          {/* <div className="mt-8 text-lg text-neutral-700">XXX,XXX.XXX</div> */}
        </div>
        <div className="flex flex-col flex-1 items-start p-2.5 font-medium max-md:pr-5">
          <div className="flex items-center gap-1 text-base text-neutral-500">
            <div>Current Rewards</div>
            <Tooltip message="The rewards accumulated so far from the program.">
              <Info width={15} height={15} color="#7C7C7C" cursor={"pointer"} />
            </Tooltip>
          </div>
          {/* <div className="mt-8 text-lg text-neutral-700">XXX,XXX.XXX</div> */}
        </div>
        <div className="flex flex-col flex-1 items-start p-2.5 font-medium max-md:pr-5">
          <div className="flex items-center gap-1 pr-1.5 text-base text-neutral-500">
            <div>End date</div>
            <Tooltip message="The date on which the reward program is scheduled to conclude.">
              <Info width={15} height={15} color="#7C7C7C" cursor={"pointer"} />
            </Tooltip>
          </div>
          {/* <div className="mt-8 text-lg text-neutral-700">JJ/MM/AAAA</div> */}
        </div>
        <div className="flex flex-col justify-between p-2.5 text-base">
          <div className="flex items-center gap-1 pr-2.5 font-medium whitespace-nowrap text-neutral-500">
            <div>Action</div>
            <Tooltip message="The option available for managing the reward program (e.g., Unstake to claim rewards).">
              <Info width={15} height={15} color="#7C7C7C" cursor={"pointer"} />
            </Tooltip>
          </div>
          {/* <button className="justify-center px-5 py-3 mt-3 font-semibold text-neutral-700 bg-white rounded-lg border-2 border-black border-solid">
        Unstake
      </button> */}
        </div>
      </section>
      <hr className="shrink-0 mt-5 h-px border border-solid bg-stone-300 border-stone-300 max-md:max-w-full" />
      {Items.map((item, index) => (
        <StakeItem
          key={index}
          index={index}
          stake={item}
          itemsCounter={Items.length - 1}
        />
      ))}
    </div>
  );
};

export default TabContent;
