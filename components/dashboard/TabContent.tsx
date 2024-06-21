import { Info } from "lucide-react";
import React from "react";
type Item = {
  type: string;
  startDate: string;
  amount: string;
  currentRewards: string;
  endDate: string;
  action: string;
  daysLeft?: string | null;
};

type TabContentProps = {
  Items: Item[];
};

const TabContent: React.FC<TabContentProps> = ({ Items }) => {
  return (
    <div className="flex flex-col self-stretch p-6 bg-white rounded-3xl border border-solid border-stone-300 max-md:px-5">
      <section className="flex gap-0 max-md:flex-wrap max-md:max-w-full">
        <div className="flex flex-col flex-1 items-start p-2.5 text-base font-medium whitespace-nowrap max-md:pr-5">
          <div className="flex items-center gap-1 pr-2.5 text-neutral-500">
            <div>Type</div>
            <Info width={15} height={15} color="#7C7C7C" />
          </div>
          {/* <div className="justify-center px-4 py-2 mt-5 text-black bg-yellow-200 border-2 border-black border-solid rounded-[38px]">
        Staking
      </div> */}
        </div>
        <div className="flex flex-col flex-1 items-start p-2.5 font-medium max-md:pr-5">
          <div className="flex gap-1 items-center px-0.5 text-base text-neutral-500">
            <div>Start Date</div>
            <Info width={15} height={15} color="#7C7C7C" />
          </div>
          {/* <div className="mt-8 text-lg text-black">JJ/MM/AAAA</div> */}
        </div>
        <div className="flex flex-col flex-1 items-start p-2.5 font-medium whitespace-nowrap max-md:pr-5">
          <div className="flex items-center gap-1 pr-2 text-base text-neutral-500">
            <div>Amount</div>
            <Info width={15} height={15} color="#7C7C7C" />
          </div>
          {/* <div className="mt-8 text-lg text-black">XXX,XXX.XXX</div> */}
        </div>
        <div className="flex flex-col flex-1 items-start p-2.5 font-medium max-md:pr-5">
          <div className="flex items-center gap-1 text-base text-neutral-500">
            <div>Current Rewards</div>
            <Info width={15} height={15} color="#7C7C7C" />
          </div>
          {/* <div className="mt-8 text-lg text-black">XXX,XXX.XXX</div> */}
        </div>
        <div className="flex flex-col flex-1 items-start p-2.5 font-medium max-md:pr-5">
          <div className="flex items-center gap-1 pr-1.5 text-base text-neutral-500">
            <div>End date</div>
            <Info width={15} height={15} color="#7C7C7C" />
          </div>
          {/* <div className="mt-8 text-lg text-black">JJ/MM/AAAA</div> */}
        </div>
        <div className="flex flex-col justify-between p-2.5 text-base">
          <div className="flex gap-1 pr-2.5 font-medium whitespace-nowrap text-neutral-500">
            <div>Action</div>
            <Info width={15} height={15} color="#7C7C7C" />
          </div>
          {/* <button className="justify-center px-5 py-3 mt-3 font-semibold text-black bg-white rounded-lg border-2 border-black border-solid">
        Unstake
      </button> */}
        </div>
      </section>
      <hr className="shrink-0 mt-5 h-px border border-solid bg-stone-300 border-stone-300 max-md:max-w-full" />
      {Items.map((item, index) => (
        <React.Fragment key={index}>
          <div className="flex gap-0 items-center mt-5 max-md:flex-wrap max-md:max-w-full">
            <div className="flex flex-col flex-1 justify-center items-start self-stretch p-2.5 my-auto text-base font-medium text-black whitespace-nowrap max-md:pr-5">
              <div className="justify-center px-4 py-2 bg-surface-500 border-2 border-black border-solid rounded-[38px]">
                {item.type}
              </div>
            </div>
            <div className="flex-1 justify-center items-start self-stretch p-2.5 my-auto text-lg font-medium whitespace-nowrap text-stone-300 max-md:pr-5">
              {item.startDate}
            </div>
            <div className="flex-1 justify-center items-start self-stretch p-2.5 my-auto text-lg font-medium whitespace-nowrap text-stone-300 max-md:pr-5">
              {item.amount}
            </div>
            <div className="flex-1 justify-center items-start self-stretch p-2.5 my-auto text-lg font-medium whitespace-nowrap text-stone-300 max-md:pr-5">
              {item.currentRewards}
            </div>
            <div className="flex-1 justify-center items-start self-stretch p-2.5 my-auto text-lg font-medium text-stone-300 max-md:pr-5">
              {item.endDate}
            </div>
            <div className="flex flex-col self-stretch px-2.5">
              {item.daysLeft && (
                <div className="flex gap-1 pr-1.5 text-sm text-neutral-400">
                  <div>{item.daysLeft}</div>
                  <Info width={15} height={15} color="#7C7C7C" />
                </div>
              )}
              <button
                className={`justify-center px-5 py-3 mt-2 text-base font-semibold whitespace-nowrap ${
                  item.action === "Claim" && item.daysLeft == null
                    ? "bg-surface-primary"
                    : "bg-white"
                } rounded-lg border-2 border-solid ${
                  item.daysLeft
                    ? "border-stone-300 text-stone-300"
                    : "border-black text-black"
                }`}
              >
                {item.action}
              </button>
            </div>
          </div>
          {index < Items.length - 1 && (
            <hr className="shrink-0 mt-5 h-px border border-solid bg-stone-300 border-stone-300 max-md:max-w-full" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default TabContent;
