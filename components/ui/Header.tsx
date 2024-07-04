import Image from "next/image";
import Link from "next/link";
import { ChevronDown, ArrowUpRight, Menu } from "lucide-react";
import ConnectWalletButton from "./connectWalletButton";
import React from "react";
// import OffCanvas from "./off-canvas";

export default function Header() {
  // const [isOpen, setIsOpen] = React.useState(false);
  return (
    <header className="container  py-4 mx-auto mt-12 max-sm:mt-1 sticky top-0 z-50">
      <div className="flex justify-between max-w-[1295px] mx-auto  flex-wrap items-center text-neutral-700 border-[3px] rounded-2xl border-black border-solid bg-zinc-50 px-4 py-3 max-lg:mx-3">
        <div className="flex items-center justify-around gap-4 max-lg:w-full max-lg:justify-between">
          <Link href="/" className="w-[40%] h-auto">
            <Image src="/images/logo.svg" alt="logo" width={100} height={100} />
          </Link>
          <button
            className="lg:hidden bg-surface-500 py-[10.5px] px-[10.5px] rounded-full border-2 border-black border-solid"
            // onClick={() => setIsOpen(true)}
          >
            <Menu width={25} height={24} strokeWidth={2.67} />
          </button>
          <button className="bg-surface-500 py-1.5 px-3 rounded-full border-2 font-medium hover:font-bold border-black border-solid hidden lg:flex items-center gap-0.5 ">
            <span className="text-base  text-left text-nowrap ">
              Bridge $CLAP
            </span>
            <ArrowUpRight />
          </button>
          <button className="bg-surface-500 py-1.5 px-3 rounded-full  font-medium hover:font-bold border-2 border-black border-solid hidden lg:flex items-center gap-0.5">
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
                className={`dropdown-content border-solid z-20 border-[1px] border-neutral-200 p-3 w-max bg-white shadow-md rounded-lg mt-3 top-4 absolute`}
              >
                <div className="transition duration-300 ease-in-out hover:bg-surface-500 rounded-lg py-3 px-[10px] cursor-pointer ">
                  Staking
                </div>
                <div className="transition duration-300 ease-in-out hover:bg-surface-500 rounded-lg py-3 px-[10px] cursor-pointer ">
                  LP Farming
                </div>
                <div className="transition duration-300 ease-in-out hover:bg-surface-500 rounded-lg py-3 px-[10px] cursor-pointer ">
                  Airdrop
                </div>
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
                className={`dropdown-content border-solid z-20 border-[1px] border-neutral-200 p-3 w-max bg-white shadow-md rounded-lg mt-3 top-4 absolute`}
              >
                <Link href="/">
                  <div className="transition duration-300 ease-in-out hover:bg-surface-500 rounded-lg py-3 px-[10px] cursor-pointer  ">
                    How to stake
                  </div>
                </Link>
                <div className="transition duration-300 ease-in-out hover:bg-surface-500 rounded-lg py-3 px-[10px] cursor-pointer ">
                  How to LP Farm
                </div>
                <div className="transition duration-300 ease-in-out hover:bg-surface-500 rounded-lg py-3 px-[10px] cursor-pointer ">
                  Whitepaper
                </div>
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
      </div>
      {/* <OffCanvas isOpen={isOpen} setIsOpen={setIsOpen} /> */}
    </header>
  );
}
