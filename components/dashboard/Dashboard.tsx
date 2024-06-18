import React, { useState } from "react";
import { useAccount } from "wagmi";
import ConnectWalletModal from "./ConnectWalletModal";
import Image from "next/image";

interface DashboardProps {}

const StatBlock: React.FC<{ title: string; value: string }> = ({
  title,
  value,
}) => (
  <div className="flex justify-between gap-4 mt-2 text-black max-md:mr-1">
    <div className="text-lg font-medium">{title}</div>
    <div className="text-xl font-bold">{value}</div>
  </div>
);

const Dashboard: React.FC<DashboardProps> = () => {
  const [selected, setSelected] = useState<string>("All");
  const { isConnected } = useAccount();

  const buttons: string[] = ["All", "Staking", "Your Farming", "Your airdrop"];

  const handleTabClick = (label: string) => {
    setSelected(label);
  };

  const getButtonClass = (label: string): string => {
    return label === selected
      ? "justify-center self-stretch px-4 py-2 font-semibold whitespace-nowrap bg-yellow-200 border-2 border-black border-solid rounded-[38px]"
      : "self-stretch my-auto";
  };

  return (
    <div className="relative">
      {!isConnected && <ConnectWalletModal />}

      <div
        className={`flex flex-col items-center ${
          isConnected ? "" : "blur-lg"
        }  `}
      >
        <div className="self-stretch justify-between w-full px-20 max-md:px-5 max-md:max-w-full">
          <div className="flex gap-5 max-md:flex-col max-md:gap-0">
            <section className="flex flex-col w-[33%] max-md:ml-0 max-md:w-full">
              <div className="flex flex-col self-stretch justify-between w-full p-6 mx-auto bg-white border border-solid grow rounded-3xl border-stone-300 max-md:px-5 max-md:mt-6">
                <div className="flex justify-between gap-2 font-semibold">
                  <div className="my-auto text-2xl text-black">
                    $Era available :
                  </div>
                  <button className="justify-center px-6 py-3 text-base text-black border-2 border-black border-solid rounded-lg bg-emerald-200 max-md:px-5">
                    Buy $ERA
                  </button>
                </div>
                <div className="flex gap-0.5 self-start mt-9 text-black">
                  <div className="text-4xl font-semibold">0.0</div>
                  <div className="self-start mt-5 text-lg font-medium">
                    {" "}
                    = 0,1 centime{" "}
                  </div>
                </div>
                <div className="justify-center self-start px-2.5 py-1 mt-4 text-xs font-medium text-black bg-yellow-200 border border-black border-solid rounded-[38px]">
                  1 $ERA = price
                </div>
                <div className="flex justify-between gap-2 text-base mt-9">
                  <div className="my-auto font-medium text-black">
                    *If you are a clap investor
                  </div>
                  <a
                    href="#"
                    className="pb-1.5 font-semibold text-black whitespace-nowrap border-b-2 border-black border-solid"
                  >
                    Bridge
                  </a>
                </div>
              </div>
            </section>
            <section className="flex flex-col ml-5 w-[33%] max-md:ml-0 max-md:w-full">
              <div className="flex flex-col self-stretch justify-between w-full p-6 mx-auto bg-white border border-solid grow rounded-3xl border-stone-300 max-md:px-5 max-md:mt-6">
                <div className="flex justify-between gap-5 font-semibold">
                  <div className="my-auto text-2xl text-black">
                    Your rewards :
                  </div>
                  <button className="justify-center px-6 py-3 text-base text-black bg-white border-2 border-black border-solid rounded-lg max-md:px-5">
                    View history
                  </button>
                </div>
                <div className="flex justify-between gap-1 mt-8">
                  <div className="text-lg font-medium text-black">
                    Total LP: xx
                  </div>
                  <div className="pb-1.5 text-base font-semibold text-black whitespace-nowrap border-b-2 border-black border-solid">
                    Start
                  </div>
                </div>
                <div className="text-xs font-medium text-neutral-500">
                  Last rewards 22/02/2024
                </div>
                <div className="flex gap-1 justify-between mt-3.5">
                  <div className="text-lg font-medium text-black">
                    Total Staking: xx
                  </div>
                  <div className="pb-1.5 text-base font-semibold text-black whitespace-nowrap border-b-2 border-black border-solid">
                    Start
                  </div>
                </div>
                <div className="text-xs font-medium text-neutral-500">
                  Last rewards 22/02/2024
                </div>
                <div className="flex gap-1 justify-between mt-3.5">
                  <div className="text-lg font-medium text-black">
                    Total Airdrop: xx
                  </div>
                  <div className="pb-1.5 text-base font-semibold text-black whitespace-nowrap border-b-2 border-black border-solid">
                    Start
                  </div>
                </div>
                <div className="text-xs font-medium text-neutral-500">
                  Last rewards 22/02/2024
                </div>
              </div>
            </section>
            <section className="flex flex-col ml-5 w-[33%] max-md:ml-0 max-md:w-full">
              <div className="flex flex-col w-full p-6 mx-auto bg-white border border-solid grow rounded-3xl border-stone-300 max-md:px-5 max-md:mt-6">
                <div className="flex justify-between gap-5 font-semibold">
                  <div className="my-auto text-2xl text-black">
                    $ERA statistiques
                  </div>
                  <button className="justify-center px-6 py-3 text-base text-black bg-white border-2 border-black border-solid rounded-lg whitespace-nowrap max-md:px-5">
                    Whitepaper
                  </button>
                </div>
                <StatBlock title="Marketcap" value="xx" />
                <StatBlock title="Volume" value="xx" />
                <StatBlock title="Circulating supply" value="xx" />
                <StatBlock title="Total supply" value="xx" />
                <StatBlock title="Fully diluted market cap" value="xx" />
              </div>
            </section>
          </div>
        </div>

        <section className="flex flex-col justify-center px-6 py-4 mt-6 w-full bg-white rounded-2xl border border-solid border-stone-300 max-w-[1259px] max-md:px-5 max-md:max-w-full">
          <div className="flex justify-between gap-5 max-md:flex-wrap max-md:max-w-full">
            <h2 className="my-auto text-2xl font-semibold text-black max-md:max-w-full">
              Official link
            </h2>
            <div className="flex justify-center items-center p-3 bg-yellow-200 border border-solid border-zinc-300 h-[45px] rounded-[37.5px] w-[45px]">
              <Image
                loading="lazy"
                src="/images/arrow down.svg"
                alt="Official Link Icon"
                width={24}
                height={24}
                className="w-6 aspect-square"
              />
            </div>
          </div>
        </section>

        <section className="flex flex-col p-6 mt-6 w-full bg-white rounded-3xl border border-solid border-stone-300 max-w-[1260px] max-md:px-5 max-md:max-w-full">
          <div className="flex flex-col justify-center pb-3.5 border-b border-solid border-stone-300 max-md:max-w-full">
            <div className="flex justify-between w-full gap-5 max-md:flex-wrap max-md:max-w-full">
              <nav className="flex items-center justify-between gap-5 my-auto text-lg font-medium text-black">
                {buttons.map((label) => (
                  <button
                    key={label}
                    className={getButtonClass(label)}
                    onClick={() => handleTabClick(label)}
                  >
                    {label}
                  </button>
                ))}
              </nav>
              <button className="justify-center px-6 py-3 text-base font-semibold text-black border-2 border-black border-solid rounded-lg bg-emerald-200 max-md:px-5">
                New to $ERA
              </button>
            </div>
          </div>

          {selected === "All" && (
            <>
              <div className="flex justify-between w-full gap-5 mt-6 font-medium max-md:flex-wrap max-md:max-w-full">
                <div className="flex gap-1.5 px-2.5 py-1 my-auto text-lg text-black bg-yellow-200 rounded">
                  <Image
                    loading="lazy"
                    src="/images/info.svg"
                    alt="Utilities Icon"
                    width={24}
                    height={24}
                    className="shrink-0 my-auto aspect-square w-[17px]"
                  />
                  <p>You don’t have any utilities yet</p>
                </div>
                <div className="justify-center px-4 py-2 text-base text-black bg-white border-2 border-black border-solid rounded-[38px]">
                  APY : xx / Program duration : 1 an
                </div>
              </div>

              <div className="flex items-center justify-center px-16 mt-6 text-lg text-black max-md:px-5 max-md:max-w-full">
                <div className="flex justify-between gap-5 max-md:flex-wrap">
                  <div className="flex gap-2.5 justify-center">
                    <div className=" flex justify-center items-center px-3.5 py-2 font-semibold whitespace-nowrap bg-yellow-200 border border-solid border-stone-300 h-[33px] rounded-[38.095px] w-[33px]">
                      1
                    </div>
                    <p className="my-auto font-medium">
                      Buy $ERA on uniswap.org
                    </p>
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

              <button className="justify-center self-center px-7 py-4 mt-6 text-lg font-semibold text-black bg-emerald-200 rounded-xl border-black border-solid border-[3px] max-md:px-5">
                Discover our staking opportunity
              </button>
            </>
          )}
          {selected === "Staking" && (
            <h2 className="mt-6 text-center">Staking</h2>
          )}

          {selected === "Your Farming" && (
            <h2 className="mt-6 text-center">Your Farming</h2>
          )}

          {selected === "Your airdrop" && (
            <h2 className="mt-6 text-center">Your airdrop</h2>
          )}
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
