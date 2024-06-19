import Image from "next/image";
import Link from "next/link";
import { ChevronDown, ArrowUpRight, Menu } from "lucide-react";
import ConnectWalletButton from "./connectWalletButton";

export default function Header() {
  return (
    <header className="container sticky top-0 z-50 py-4 pb-20 mx-auto mt-12 max-sm:mt-1">
      <div className="flex justify-between max-w-[1295px] mx-auto  flex-wrap items-center text-black border-[3px] rounded-2xl border-black border-solid bg-zinc-50 px-4 py-3">
        <div className="flex items-center justify-around gap-4 max-sm:hidden">
          <Link href="/" className="w-[40%] h-auto">
            <Image src="/images/logo.svg" alt="logo" width={100} height={100} />
          </Link>
          <button className="md:hidden bg-surface-500 py-1.5 px-3 rounded-full border-2 border-black border-solid">
            <Menu />
          </button>
          <button className="bg-surface-500 py-1.5 px-3 rounded-full border-2 border-black border-solid hidden md:flex items-center gap-0.5 ">
            <span className="text-base font-medium text-left text-nowrap ">
              Bridge $CLAP
            </span>
            <ArrowUpRight />
          </button>
          <button className="bg-surface-500 py-1.5 px-3 rounded-full border-2 border-black border-solid hidden md:flex items-center gap-0.5">
            <span className="text-base font-medium text-left text-nowrap ">
              Buy $ERA
            </span>
            <ArrowUpRight />
          </button>
        </div>
        <nav>
          <ul className="flex-wrap items-center justify-around hidden gap-2 space-x-4 md:flex">
            <li>
              <button className="flex items-center gap-0.5 justify-center">
                <span className="text-lg font-medium ">Utilities</span>
                <ChevronDown />
              </button>
            </li>
            <li>
              <button className="flex items-center gap-0.5 justify-center">
                <span className="text-lg font-medium ">Docs</span>
                <ChevronDown />
              </button>
            </li>
            <li>
              <Link className="text-lg font-medium " href="/dashboard">
                Dashboard
              </Link>
            </li>
            <li>
              <ConnectWalletButton
                text="Connect Wallet"
                className="font-semibold text-lg text-primary tracking-[2%] border-[2.5px] border-black border-solid px-4 py-2 rounded-xl max-md:px-5"
              />
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
