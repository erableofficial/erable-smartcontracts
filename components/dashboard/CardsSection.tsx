import { ArrowUpRight, TriangleAlert } from "lucide-react";
import React from "react";
import { formatEther } from "viem";
import BridgeProcessModal from "../ui/BridgeProcessModal";

type CardsSectionProps = {
  myBalance: BigInt;
  userStakingBalance: BigInt;
  userFarmingBalance: BigInt;
  totalStaked: BigInt;
  setToggleBuyEraModal: (value: boolean) => void;
};

const StatBlock: React.FC<{ title: string; value: string }> = ({
  title,
  value,
}) => (
  <div className="flex gap-4 justify-between mt-2 text-neutral-700 max-md:mr-1">
    <div className="text-base font-medium text-neutral-500">{title}</div>
    <div className=" text-base font-medium ">{value}</div>
  </div>
);

const CardsSection: React.FC<CardsSectionProps> = ({
  myBalance,
  userStakingBalance,
  userFarmingBalance,
  totalStaked,
  setToggleBuyEraModal,
}) => {
  const [toggleBridgeProcessModal, setToggleBridgeProcessModal] =
    React.useState(false);
  return (
    <>
      <div className="flex justify-center self-stretch  mt-14 w-full max-[1281px]:px-5 max-md:max-w-full max-sm:mt-4">
        <BridgeProcessModal
          toggleBridgeProcessModal={toggleBridgeProcessModal}
          setToggleBridgeProcessModal={setToggleBridgeProcessModal}
        />
        <div className="flex gap-6 max-w-[1259px] w-full max-md:flex-col max-md:gap-0">
          <section className="flex flex-col w-[33%] max-md:ml-0 max-md:w-full">
            <div className="flex flex-col grow justify-between self-stretch p-6 mx-auto w-full bg-white rounded-3xl border border-solid border-stone-300 max-md:px-5 max-md:mt-6">
              <div className="flex gap-2 justify-between font-semibold">
                <div className="my-auto text-2xl text-neutral-700">
                  My $ERA Wallet
                </div>
                <button
                  className="primary-button-sm  justify-center px-6 py-3 text-base text-neutral-700 bg-surface-primary rounded-lg border-2 border-black border-solid max-md:px-5"
                  onClick={() => setToggleBuyEraModal(true)}
                >
                  Buy $ERA
                </button>
              </div>
              <div className="flex flex-col">
                <div className={`${myBalance == BigInt(0) ? "flex" : ""} `}>
                  <div className="flex gap-0.5 self-start  text-neutral-700 mb-3">
                    <div className="text-4xl font-semibold">
                      {myBalance
                        ? Number(
                            formatEther(BigInt(myBalance.toString()))
                          ).toLocaleString()
                        : "0"}
                    </div>
                    <div className="flex items-center text-lg font-medium max-sm:text-sm">
                      $ERA = $1.50
                    </div>
                  </div>
                  <div className="flex items-center ml-1">
                    <div className="justify-center w-fit self-start px-2.5 py-[6px] text-sm font-medium text-neutral-700 bg-surface-500 border-[1.5px] border-black border-solid rounded-[38px] mt-1">
                      1 $ERA = price
                    </div>
                  </div>
                </div>
                {myBalance == BigInt(0) && (
                  <div className="flex gap-1.5 px-2.5 items-center py-1 text-base font-medium text-neutral-700 bg-danger-200 rounded w-fit">
                    <TriangleAlert width={17} height={17} />
                    <p>You don’t have $ERA</p>
                  </div>
                )}
              </div>

              <div className="flex gap-2 justify-between  text-base">
                <div className="my-auto font-medium text-neutral-700 max-sm:text-sm max-sm:mt-[14px]">
                  If you are a clap investor
                </div>
                <a
                  href="#"
                  className="flex gap-1 font-medium text-neutral-700 whitespace-nowrap border-b-[1px] border-black border-solid"
                  onClick={() => setToggleBridgeProcessModal(true)}
                >
                  Bridge
                  <div className="flex items-center">
                    <ArrowUpRight width={18} height={19} strokeWidth={1.5} />
                  </div>
                </a>
              </div>
            </div>
          </section>
          {userFarmingBalance == BigInt(0) &&
          userStakingBalance == BigInt(0) ? (
            <>
              <div className="flex flex-col ml-5 w-[33%] max-md:ml-0 max-md:w-full">
                <div className="flex flex-col grow justify-between self-stretch p-6 mx-auto w-full bg-white rounded-3xl border border-solid border-stone-300 max-md:px-5 max-md:mt-6">
                  <div className="flex gap-5 justify-between font-semibold">
                    <div className="flex w-full gap-5 justify-between self-stretch font-semibold">
                      <div className="text-2xl text-neutral-700">
                        Earn rewards
                      </div>
                      {/* <div className=" cursor-pointer self-start pb-1.5 text-lg text-neutral-700 whitespace-nowrap border-b-2 border-black border-solid">
                    View history
                  </div> */}
                    </div>
                  </div>
                  <div className="flex gap-1 justify-between mt-6 max-sm:mt-5">
                    <div className="text-lg font-semibold text-neutral-700 max-sm:text-base">
                      Staking
                    </div>
                    {/* <span className="justify-center px-2.5 py-1.5 text-sm font-medium text-neutral-700 bg-surface-500 border-2 border-black border-solid rounded-[38px]">
                  {userStakingBalance
                    ? formatEther(BigInt(userStakingBalance.toString()))
                    : "0"}{" "}
                  $ERA
                </span> */}
                  </div>
                  <div className=" text-base mt-1 flex justify-between font-medium text-neutral-500 max-sm:text-sm">
                    No rewards available
                    <span>
                      <a
                        href="#"
                        className="flex gap-1 font-medium text-neutral-700 whitespace-nowrap border-b-[1px] border-black border-solid"
                      >
                        Discover
                      </a>
                    </span>
                  </div>

                  <div className="shrink-0 my-[14px] h-[0.8px] border border-solid bg-neutral-200  max-md:max-w-full" />

                  <div className="flex gap-1 justify-between ">
                    <div className="text-lg font-semibold text-neutral-700 max-sm:text-base">
                      LP Farming
                    </div>
                    {/* <span className="justify-center px-2.5 py-1.5 text-sm font-medium text-neutral-700 bg-surface-500 border-2 border-black border-solid rounded-[38px]">
                      No rewards available
                    </span> */}
                  </div>
                  <div className=" text-base mt-1 flex justify-between font-medium text-neutral-500 max-sm:text-sm">
                    No rewards available
                    <span>
                      <a
                        href="#"
                        className="flex gap-1  font-medium text-neutral-700 whitespace-nowrap border-b-[1px] border-black border-solid"
                      >
                        Discover
                      </a>
                    </span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <section className="flex flex-col ml-5 w-[33%] max-md:ml-0 max-md:w-full">
              <div className="flex flex-col grow justify-between self-stretch p-6 mx-auto w-full bg-white rounded-3xl border border-solid border-stone-300 max-md:px-5 max-md:mt-6">
                <div className="flex gap-5 justify-between font-semibold">
                  <div className="flex w-full gap-5 justify-between self-stretch font-semibold">
                    <div className="text-2xl text-neutral-700">
                      Total Rewards
                    </div>
                    <div className=" cursor-pointer self-start  text-lg text-neutral-700 whitespace-nowrap border-b-2 border-black border-solid max-sm:text-base">
                      View history
                    </div>
                  </div>
                </div>
                <div className="flex gap-1 justify-between mt-6">
                  <div className="text-lg font-semibold text-neutral-700">
                    Staking
                  </div>
                  <span className="justify-center px-2.5 py-1.5 text-sm font-medium text-neutral-700 bg-surface-500 border-2 border-black border-solid rounded-[38px]">
                    {userStakingBalance
                      ? formatEther(BigInt(userStakingBalance.toString()))
                      : "0"}{" "}
                    $ERA
                  </span>
                </div>
                <div className=" text-base mt-1 flex justify-between font-medium text-neutral-500">
                  Total staked{" "}
                  <span>
                    {totalStaked
                      ? formatEther(BigInt(totalStaked.toString()))
                      : "0"}{" "}
                    $ERA
                  </span>
                </div>

                <div className="shrink-0 my-[14px] h-[0.8px] border border-solid bg-neutral-200  max-md:max-w-full" />

                <div className="flex gap-1 justify-between ">
                  <div className="text-lg font-semibold text-neutral-700">
                    LP Farming
                  </div>
                  <span className="justify-center px-2.5 py-1.5 text-sm font-medium text-neutral-700 bg-surface-500 border-2 border-black border-solid rounded-[38px]">
                    200,870 $ERA
                  </span>
                </div>
                <div className=" text-base mt-1 flex justify-between font-medium text-neutral-500">
                  Total liquidity provided <span>200,870 $ERA</span>
                </div>
              </div>
            </section>
          )}
          <section className="flex flex-col ml-5 w-[33%] max-md:ml-0 max-md:w-full">
            <div className="flex flex-col justify-between grow p-6 mx-auto w-full bg-white rounded-3xl border border-solid border-stone-300 max-md:px-5 max-md:mt-6">
              <div className="flex gap-5 justify-between font-semibold">
                <div className="flex w-full gap-5 justify-between self-stretch font-semibold">
                  <div className="text-2xl text-neutral-700">$ERA stats</div>
                  <div className=" cursor-pointer self-start text-lg text-neutral-700 whitespace-nowrap border-b-2 border-black border-solid max-sm:text-base">
                    Whitepaper
                  </div>
                </div>
              </div>
              <div className="flex flex-col h-full mt-6 justify-between max-sm:mt-5 ">
                <StatBlock title="Marketcap" value="$1,451,188" />
                {/* <StatBlock title="Volume" value="xx" /> */}
                <StatBlock title="Circulating supply" value="217,000,000" />
                <StatBlock title="Total supply" value="1,000,000,000" />
                <StatBlock
                  title="Fully diluted market cap"
                  value="$6,951,110"
                />
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default CardsSection;
