import Image from "next/image";
import Link from "next/link";
import { ChevronDown, ArrowUpRight, Menu, X } from "lucide-react";
import ConnectWalletButton from "./connectWalletButton";
import React, { useEffect } from "react";
import BuySeraModal from "./BuySeraModal";
import BridgeProcessModal from "./BridgeProcessModal";

export default function Header() {
  const [toggleBuyEraModal, setToggleBuyEraModal] = React.useState(false);
  const [toggleBridgeProcessModal, setToggleBridgeProcessModal] =
    React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };
  React.useEffect(() => {
    if (contentRef.current) {
      contentRef.current.style.maxHeight = isOpen
        ? `${contentRef.current.scrollHeight}px`
        : "0";
    }
  }, [isOpen]);
  useEffect(() => {
    console.log("isOpen", isOpen);
  }, [isOpen]);
  const utilities = [
    { text: "Staking", link: "/dashboard?tab=Staking#utilities" },
    { text: "LP Farming", link: "/dashboard?tab=Farming#utilities" },
    { text: "Engage to Earn", link: "/dashboard?tab=Airdrop#utilities" },
  ];
  const docs = [
    {
      text: "How to stake",
      link: "https://medium.com/@erableofficial/staking-program-everything-you-need-to-know-a821e2a7e2af",
    },
    {
      text: "How to LP",
      link: "https://medium.com/@erableofficial/lp-farming-program-everything-you-need-to-know-079d1162f8ac",
    },
    {
      text: "White paper",
      link: "https://www.erable.com/ressources/whitepaper",
    },
  ];
  return (
    <header className="sticky top-0 z-50 py-4 mt-12 max-sm:mt-1  px-20 max-md:px-5">
      <BuySeraModal
        toggleBuyEraModal={toggleBuyEraModal}
        setToggleBuyEraModal={setToggleBuyEraModal}
      />
      <BridgeProcessModal
        toggleBridgeProcessModal={toggleBridgeProcessModal}
        setToggleBridgeProcessModal={setToggleBridgeProcessModal}
      />
      <div className="flex justify-between min-h-[86px]  mx-auto  flex-wrap items-center text-neutral-700 border-[3px] rounded-2xl border-black border-solid bg-zinc-50 px-4 py-3 ">
        <div className="flex items-center justify-around gap-4 max-lg:w-full max-lg:justify-between">
          <Link href="/" className="w-[40%] h-auto">
            <Image src="/images/logo.svg" alt="logo" width={100} height={100} />
          </Link>
          <button
            className="lg:hidden bg-surface-500 py-[10.5px] px-[10.5px] rounded-full border-2 border-black border-solid"
            onClick={toggleOpen}
          >
            {isOpen ? (
              <X width={25} height={24} strokeWidth={2.67} />
            ) : (
              <Menu width={25} height={24} strokeWidth={2.67} />
            )}
          </button>
          {/* <div
            ref={contentRef}
            className="overflow-hidden transition-max-height duration-500 ease-in-out"
            style={{ maxHeight: "0" }}
          >
            zezeazeze
          </div> */}
          <button
            className="bg-surface-500 py-1.5 px-3 rounded-full border-2 font-medium hover:font-bold border-black border-solid hidden lg:flex items-center gap-0.5 "
            onClick={() => setToggleBridgeProcessModal(true)}
          >
            <span className="text-base  text-left text-nowrap ">
              Bridge $CLAP
            </span>
            <ArrowUpRight />
          </button>
          <button
            className="bg-surface-500 py-1.5 px-3 rounded-full  font-medium hover:font-bold border-2 border-black border-solid hidden lg:flex items-center gap-0.5"
            onClick={() => setToggleBuyEraModal(true)}
          >
            <span className="text-base  text-left text-nowrap ">Buy $ERA</span>
            <ArrowUpRight />
          </button>
        </div>
        <nav>
          <ul className="hidden lg:flex flex-wrap items-center justify-around gap-2 space-x-4">
            <li className="min-w-[80px] hover-effect">
              <button className="flex items-center gap-0.5 justify-center">
                <span className="font-medium text-lg">Utilities</span>
                <ChevronDown className="icon-chevron-down" />
              </button>
              <div
                className={`dropdown-content border-solid z-20 border-[1px] border-neutral-200 p-3 w-max bg-white shadow-md rounded-lg mt-3 top-4 absolute min-w-[200px]`}
              >
                <Link href="/dashboard?tab=Staking#utilities">
                  <div className="flex gap-4  transition duration-300 ease-in-out hover:bg-surface-500 rounded-lg py-3 px-[10px] cursor-pointer ">
                    Staking
                  </div>
                </Link>
                <Link href="/dashboard?tab=Farming#utilities">
                  <div className="flex gap-4  transition duration-300 ease-in-out hover:bg-surface-500 rounded-lg py-3 px-[10px] cursor-pointer ">
                    LP Farming
                  </div>
                </Link>
                <Link href="/dashboard?tab=Airdrop#utilities">
                  <div className="flex gap-4  transition duration-300 ease-in-out hover:bg-surface-500 rounded-lg py-3 px-[10px] cursor-pointer ">
                    Engage to Earn
                  </div>
                </Link>
              </div>
            </li>
            <li className="min-w-[70px] hover-effect">
              <button className="flex items-center gap-0.5 justify-center">
                <span className="font-medium text-lg hover:font-semibold ">
                  Docs
                </span>
                <ChevronDown className="icon-chevron-down" />
              </button>
              <div
                className={`dropdown-content border-solid z-20 border-[1px] border-neutral-200 p-3 w-max bg-white shadow-md rounded-lg mt-3 top-4 absolute min-w-[200px]`}
              >
                <Link
                  href="https://medium.com/@erableofficial/staking-program-everything-you-need-to-know-a821e2a7e2af"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="flex gap-4 justify-between transition duration-300 ease-in-out hover:bg-surface-500 rounded-lg py-3 px-[10px] cursor-pointer  ">
                    <span> How to stake</span>
                    <ArrowUpRight width={24} height={24} strokeWidth={1.5} />
                  </div>
                </Link>
                <Link
                  href="https://medium.com/@erableofficial/lp-farming-program-everything-you-need-to-know-079d1162f8ac"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="flex gap-4 justify-between transition duration-300 ease-in-out hover:bg-surface-500 rounded-lg py-3 px-[10px] cursor-pointer ">
                    <span> How to LP Farm</span>
                    <ArrowUpRight width={24} height={24} strokeWidth={1.5} />
                  </div>
                </Link>
                <Link
                  href="https://www.erable.com/ressources/whitepaper"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="flex gap-4 justify-between transition duration-300 ease-in-out hover:bg-surface-500 rounded-lg py-3 px-[10px] cursor-pointer ">
                    <span> Whitepaper</span>
                    <ArrowUpRight width={24} height={24} strokeWidth={1.5} />
                  </div>
                </Link>
              </div>
            </li>
            <li className="min-w-[94px]">
              <Link
                className="text-lg font-medium hover:font-semibold"
                href="/dashboard"
              >
                Dashboard
              </Link>
            </li>
            <li>
              <ConnectWalletButton
                text="Connect Wallet"
                className="secondary-button-sm font-semibold text-lg text-primary tracking-[2%] border-[2.5px] border-black border-solid px-4 py-2 rounded-xl max-lg:px-5"
              />
            </li>
          </ul>
        </nav>
        <div
          ref={contentRef}
          className="overflow-hidden transition-max-height duration-500 ease-in-out w-full lg:hidden"
          style={{ maxHeight: "0" }}
        >
          <div className="flex flex-col justify-center self-stretch text-base font-medium text-black w-full">
            <hr className="shrink-0 my-5 h-px border border-solid bg-stone-300 border-stone-300 max-md:max-w-full" />
            <button
              className="items-center hover:font-bold flex justify-center px-2.5 py-1.5 w-fit text-sm bg-surface-500 border-2 border-black border-solid rounded-[38px]"
              onClick={() => setToggleBridgeProcessModal(true)}
            >
              <span className="text-sm  text-left text-nowrap ">
                Bridge $CLAP
              </span>
              <ArrowUpRight />
            </button>
            <button
              className="items-center hover:font-bold flex justify-center px-2.5 py-1.5 w-fit text-sm bg-surface-500 border-2 border-black border-solid rounded-[38px] mt-4"
              onClick={() => setToggleBuyEraModal(true)}
            >
              <span className="text-sm  text-left text-nowrap ">Buy $ERA</span>
              <ArrowUpRight />
            </button>
            <hr className="shrink-0 my-5 h-px border border-solid bg-stone-300 border-stone-300 max-md:max-w-full" />
            <div className="w-full text-lg font-semibold">Utilities:</div>
            <ul>
              {utilities.map((item, index) => (
                <li className="mt-2.5 w-full" key={index}>
                  <Link href={item.link}>{item.text}</Link>
                </li>
              ))}
            </ul>
            <div className="mt-5 w-full text-lg font-semibold">Docs:</div>
            <ul>
              {docs.map((item, index) => (
                <li className="mt-2.5 w-full" key={index}>
                  <Link
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item.text}
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              className="mt-5 w-full text-lg font-semibold cursor-pointer"
              href="/dashboard"
            >
              Dashboard
            </Link>
            <hr className="shrink-0 my-5 h-px border border-solid bg-stone-300 border-stone-300 max-md:max-w-full" />
            <div className="flex justify-center w-full pb-1 ">
              <ConnectWalletButton
                text="Connect Wallet"
                className="secondary-button-sm font-semibold text-lg text-primary tracking-[2%] border-[2.5px] border-black border-solid px-4 py-2 rounded-xl max-lg:px-5"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
