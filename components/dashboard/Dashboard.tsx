import React, { useState } from "react";
import { useAccount } from "wagmi";
import ConnectWalletModal from "./ConnectWalletModal";
import { ChevronDown, ChevronUp, Info, Minus, Plus } from "lucide-react";
import Link from "next/link";
import BuySeraModal from "../ui/BuySeraModal";

interface DashboardProps {}

const StatBlock: React.FC<{ title: string; value: string }> = ({
  title,
  value,
}) => (
  <div className="flex gap-4 justify-between mt-2 text-black max-md:mr-1">
    <div className="text-lg font-medium text-neutral-500">{title}</div>
    <div className=" text-[16px] font-medium ">{value}</div>
  </div>
);

const allItems = [
  {
    type: "Staking",
    startDate: "JJ/MM/AAAA",
    amount: "XXX,XXX.XXX",
    currentRewards: "XXX,XXX.XXX",
    endDate: "JJ/MM/AAAA",
    action: "Claim",
  },
  {
    type: "Staking",
    startDate: "JJ/MM/AAAA",
    amount: "XXX,XXX.XXX",
    currentRewards: "XXX,XXX.XXX",
    endDate: "JJ/MM/AAAA",
    action: "Claim",
    daysLeft: "7 days left",
  },
  {
    type: "LP Farming",
    startDate: "JJ/MM/AAAA",
    amount: "XXX,XXX.XXX",
    currentRewards: "XXX,XXX.XXX",
    endDate: "JJ/MM/AAAA",
    action: "Unstake",
    daysLeft: null,
  },
  {
    type: "Airdrop",
    startDate: "JJ/MM/AAAA",
    amount: "XXX,XXX.XXX",
    currentRewards: "XXX,XXX.XXX",
    endDate: "JJ/MM/AAAA",
    action: "Unstake",
    daysLeft: null,
  },
];

const stakingItems = [
  {
    type: "Staking",
    startDate: "JJ/MM/AAAA",
    amount: "XXX,XXX.XXX",
    currentRewards: "XXX,XXX.XXX",
    endDate: "JJ/MM/AAAA",
    action: "Claim",
  },
  {
    type: "Staking",
    startDate: "JJ/MM/AAAA",
    amount: "XXX,XXX.XXX",
    currentRewards: "XXX,XXX.XXX",
    endDate: "JJ/MM/AAAA",
    action: "Claim",
    daysLeft: "7 days left",
  },
];

const farmingItems = [
  {
    type: "LP Farming",
    startDate: "JJ/MM/AAAA",
    amount: "XXX,XXX.XXX",
    currentRewards: "XXX,XXX.XXX",
    endDate: "JJ/MM/AAAA",
    action: "Unstake",
    daysLeft: null,
  },
];

const airdropItems = [
  {
    type: "Airdrop",
    startDate: "JJ/MM/AAAA",
    amount: "XXX,XXX.XXX",
    currentRewards: "XXX,XXX.XXX",
    endDate: "JJ/MM/AAAA",
    action: "Unstake",
    daysLeft: null,
  },
];

const Dashboard: React.FC<DashboardProps> = () => {
  const [selected, setSelected] = useState<string>("All");
  const [isOpen, setIsOpen] = React.useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [toggleBuyEraModal, setToggleBuyEraModal] = React.useState(false);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  // This useEffect ensures that updates to isOpen appropriately adjust maxHeight
  React.useEffect(() => {
    if (contentRef.current) {
      contentRef.current.style.maxHeight = isOpen
        ? `${contentRef.current.scrollHeight}px`
        : "0";
    }
  }, [isOpen]);
  const { isConnected } = useAccount();

  const buttons = [
    { name: "All", qt: allItems.length },
    { name: "Staking", qt: stakingItems.length },
    { name: "Your Farming", qt: farmingItems.length },
    { name: "Airdrop", qt: airdropItems.length },
  ];

  const handleTabClick = (label: string) => {
    setSelected(label);
  };

  const getButtonClass = (label: string): string => {
    return label === selected
      ? "justify-center self-stretch px-4 py-2 font-semibold whitespace-nowrap bg-surface-500 border-2 border-black border-solid rounded-[38px]"
      : "self-stretch my-auto";
  };

  return (
    <div className="relative pb-28 bg-neutral-50">
      {!isConnected && <ConnectWalletModal />}

      <div
        className={`flex flex-col items-center ${isConnected ? "" : " blur"}  `}
      >
        <BuySeraModal
          toggleBuyEraModal={toggleBuyEraModal}
          setToggleBuyEraModal={setToggleBuyEraModal}
        />
        <div className="justify-between self-stretch px-32 mt-14 w-full max-md:px-5 max-md:max-w-full">
          <div className="flex gap-5 max-md:flex-col max-md:gap-0">
            <section className="flex flex-col w-[33%] max-md:ml-0 max-md:w-full">
              <div className="flex flex-col grow justify-between self-stretch p-6 mx-auto w-full bg-white rounded-3xl border border-solid border-stone-300 max-md:px-5 max-md:mt-6">
                <div className="flex gap-2 justify-between font-semibold">
                  <div className="my-auto text-2xl text-black">
                    My $ERA Wallet
                  </div>
                  <button
                    className="primary-button-sm  justify-center px-6 py-3 text-base text-black bg-emerald-200 rounded-lg border-2 border-black border-solid max-md:px-5"
                    onClick={() => setToggleBuyEraModal(true)}
                  >
                    Buy $ERA
                  </button>
                </div>
                <div className="flex gap-0.5 self-start  text-black">
                  <div className="text-4xl font-semibold">0.0</div>
                  <div className="self-start h-full flex items-center text-lg font-medium">
                    = 0,1 centime
                  </div>
                </div>
                <div className="justify-center self-start px-2.5 py-1 mt-4 text-xs font-medium text-black bg-surface-500 border border-black border-solid rounded-[38px]">
                  1 $ERA = price
                </div>
                <div className="flex gap-2 justify-between  text-base">
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
              <div className="flex flex-col grow justify-between self-stretch p-6 mx-auto w-full bg-white rounded-3xl border border-solid border-stone-300 max-md:px-5 max-md:mt-6">
                <div className="flex gap-5 justify-between font-semibold">
                  <div className="flex w-full gap-5 justify-between self-stretch font-semibold max-w-[356px]">
                    <div className="text-2xl text-black">Total Rewards</div>
                    <div className="self-start pb-1.5 text-lg text-black whitespace-nowrap border-b-2 border-black border-solid">
                      View history
                    </div>
                  </div>
                </div>
                <div className="flex gap-1 justify-between mt-8">
                  <div className="text-lg font-semibold text-black">
                    Staking
                  </div>
                  <span className="justify-center px-2.5 py-1.5 text-sm font-medium text-black bg-surface-500 border-2 border-black border-solid rounded-[38px]">
                    100,870 $ERA
                  </span>
                </div>
                <div className=" text-base mt-1 flex justify-between font-medium text-neutral-500">
                  Total staked <span>2,000,870 $ERA</span>
                </div>

                <div className="flex gap-1 justify-between mt-8">
                  <div className="text-lg font-semibold text-black">
                    LP Farming
                  </div>
                  <span className="justify-center px-2.5 py-1.5 text-sm font-medium text-black bg-surface-500 border-2 border-black border-solid rounded-[38px]">
                    200,870 $ERA
                  </span>
                </div>
                <div className=" text-base mt-1 flex justify-between font-medium text-neutral-500">
                  Total liquidity provided <span>200,870 $ERA</span>
                </div>
              </div>
            </section>
            <section className="flex flex-col ml-5 w-[33%] max-md:ml-0 max-md:w-full">
              <div className="flex flex-col justify-between grow p-6 mx-auto w-full bg-white rounded-3xl border border-solid border-stone-300 max-md:px-5 max-md:mt-6">
                <div className="flex gap-5 justify-between font-semibold">
                  <div className="flex w-full gap-5 justify-between self-stretch font-semibold max-w-[356px]">
                    <div className="text-2xl text-black">$ERA stats</div>
                    <div className="self-start pb-1.5 text-lg text-black whitespace-nowrap border-b-2 border-black border-solid">
                      Whitepaper
                    </div>
                  </div>
                </div>
                <div>
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

        <section className="flex flex-col justify-center px-6 py-4 mt-6 w-full bg-white rounded-2xl border border-solid border-stone-300 max-w-[1259px] max-md:px-5 max-md:max-w-full">
          <div className="flex flex-col  justify-between max-md:flex-wrap max-md:max-w-full">
            <div className="flex justify-between">
              <h2 className="my-auto text-2xl font-semibold text-black max-md:max-w-full">
                Official link
              </h2>
              <div
                className={` cursor-pointer flex justify-center items-center p-3 ${
                  isOpen ? "bg-surface-500" : ""
                }  border border-solid border-zinc-300 h-[45px] rounded-[37.5px] w-[45px]`}
                onClick={toggleOpen}
              >
                {isOpen ? <Minus /> : <Plus />}
              </div>
            </div>
            <div
              ref={contentRef}
              className="overflow-hidden transition-max-height duration-500 ease-in-out"
              style={{ maxHeight: "0" }}
            >
              <div className="mt-4 text-sm text-gray-700">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                sunt in culpa qui officia deserunt mollit anim id est laborum.
              </div>

              <div className="self-start pb-1.5 mt-6 text-lg font-semibold text-black ">
                <Link
                  href=""
                  className="pb-1.5 mt-6 text-lg font-semibold text-black border-b-2 border-black"
                >
                  Read more
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="flex flex-col p-6 mt-6 w-full bg-white rounded-3xl border border-solid border-stone-300 max-w-[1260px] max-md:px-5 max-md:max-w-full">
          <div className="flex flex-col justify-center mb-6 pb-3.5 border-b border-solid border-stone-300 max-md:max-w-full">
            <div className="flex gap-5 justify-between w-full max-md:flex-wrap max-md:max-w-full">
              <nav className="flex gap-5 justify-between items-center my-auto text-lg font-medium text-black">
                {buttons.map((label) => (
                  <button
                    key={label.name}
                    className={getButtonClass(label.name)}
                    onClick={() => {
                      handleTabClick(label.name);
                      console.log("selected", label.name);
                    }}
                  >
                    {label.name} ({label.qt})
                  </button>
                ))}
              </nav>
              <div className="flex gap-4 pl-20 text-base font-semibold text-black max-md:flex-wrap">
                <button className=" secondary-button-sm  justify-center px-5 py-3 bg-white rounded-lg border-2 border-black border-solid">
                  Help ?
                </button>
                <div>
                  <button
                    className="primary-button-sm flex gap-0.5 px-5 py-3 bg-emerald-200 rounded-lg border-[1px] border-black border-solid"
                    onClick={toggleDropdown}
                  >
                    <span className="my-auto">Start a new program</span>
                    {isDropdownOpen ? (
                      <ChevronUp height={24} width={24} color="#1F1F1F" />
                    ) : (
                      <ChevronDown height={24} width={24} color="#1F1F1F" />
                    )}
                  </button>
                  {isDropdownOpen && (
                    <div
                      className={`dropdown-content border-solid border-2 border-neutral-200 p-3 w-[214px] bg-white shadow-md rounded-lg mt-3 absolute`}
                    >
                      {/* Dropdown items here */}
                      <div className="transition duration-300 ease-in-out hover:bg-success-200 rounded-lg py-3 px-[10px] cursor-pointer  ">
                        Staking
                      </div>
                      <div className="transition duration-300 ease-in-out hover:bg-success-200 rounded-lg py-3 px-[10px] cursor-pointer ">
                        LP Farming
                      </div>
                      <div className="transition duration-300 ease-in-out hover:bg-success-200 rounded-lg py-3 px-[10px] cursor-pointer ">
                        Airdrop
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {selected === "All" && (
            <>
              <main className="flex flex-col self-stretch p-6 bg-white rounded-3xl border border-solid border-stone-300 max-md:px-5">
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
                {allItems.map((item, index) => (
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
                    {index < allItems.length - 1 && (
                      <hr className="shrink-0 mt-5 h-px border border-solid bg-stone-300 border-stone-300 max-md:max-w-full" />
                    )}
                  </React.Fragment>
                ))}
              </main>
              {/* <div className="flex gap-5 justify-between mt-6 w-full font-medium max-md:flex-wrap max-md:max-w-full">
                <div className="flex gap-1.5 px-2.5 py-1 my-auto text-lg text-black bg-yellow-200 rounded">
                  <Info width={24} height={24} />
                  <p>You don’t have any utilities yet</p>
                </div>
                <div className="justify-center px-4 py-2 text-base text-black bg-white border-2 border-black border-solid rounded-[38px]">
                  APY : xx / Program duration : 1 an
                </div>
              </div>

              <div className="flex justify-center items-center px-16 mt-6 text-lg text-black max-md:px-5 max-md:max-w-full">
                <div className="flex gap-5 justify-between max-md:flex-wrap">
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
              </button> */}
            </>
          )}
          {selected === "Staking" && (
            <main className="flex flex-col self-stretch p-6 bg-white rounded-3xl border border-solid border-stone-300 max-md:px-5">
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
              {stakingItems.map((item, index) => (
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
                      {item?.daysLeft && (
                        <div className="flex gap-1 pr-1.5 text-sm text-neutral-400">
                          <div>{item?.daysLeft}</div>
                          <Info width={15} height={15} color="#7C7C7C" />
                        </div>
                      )}
                      <button
                        className={`justify-center px-5 py-3 mt-2 text-base font-semibold whitespace-nowrap ${
                          item.action === "Claim" && item.daysLeft == null
                            ? "bg-surface-primary"
                            : "bg-white"
                        } rounded-lg border-2 border-solid 
                           
                          ${
                            item?.daysLeft
                              ? "border-stone-300 text-stone-300"
                              : "border-black text-black"
                          }`}
                      >
                        {item.action}
                      </button>
                    </div>
                  </div>
                  {index < stakingItems.length - 1 && (
                    <hr className="shrink-0 mt-5 h-px border border-solid bg-stone-300 border-stone-300 max-md:max-w-full" />
                  )}
                </React.Fragment>
              ))}
            </main>
          )}

          {selected === "Your Farming" && (
            <main className="flex flex-col self-stretch p-6 bg-white rounded-3xl border border-solid border-stone-300 max-md:px-5">
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
              {farmingItems.map((item, index) => (
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
                  {index < farmingItems.length - 1 && (
                    <hr className="shrink-0 mt-5 h-px border border-solid bg-stone-300 border-stone-300 max-md:max-w-full" />
                  )}
                </React.Fragment>
              ))}
            </main>
          )}

          {selected === "Airdrop" && (
            <main className="flex flex-col self-stretch p-6 bg-white rounded-3xl border border-solid border-stone-300 max-md:px-5">
              <section className="flex gap-0 max-md:flex-wrap max-md:max-w-full">
                <div className="flex flex-col flex-1 items-start p-2.5 text-base font-medium whitespace-nowrap max-md:pr-5">
                  <div className="flex gap-1 pr-2.5 text-neutral-500">
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
              {airdropItems.map((item, index) => (
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
                        }
                            
                            `}
                      >
                        {item.action}
                      </button>
                    </div>
                  </div>
                  {index < airdropItems.length - 1 && (
                    <hr className="shrink-0 mt-5 h-px border border-solid bg-stone-300 border-stone-300 max-md:max-w-full" />
                  )}
                </React.Fragment>
              ))}
            </main>
          )}
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
