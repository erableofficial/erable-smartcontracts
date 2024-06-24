import * as React from "react";
import Image from "next/image";
import ConnectWalletButton from "../ui/connectWalletButton";

const ConnectWalletModal: React.FC = () => {
  return (
    <div className="flex flex-col items-center px-10 pt-6 pb-10 bg-white rounded-3xl border border-solid border-stone-300 max-w-[515px] max-md:px-5 absolute top-[50%] left-[50%] transform translate-x-[-50%] translate-y-[-50%] z-[49] max-md:w-full">
      <Image
        src="/images/close.svg"
        alt=""
        width={14}
        height={14}
        className="self-end w-3.5 aspect-square"
      />
      <div className="flex justify-center items-center px-4 bg-surface-500 h-[4.19rem] rounded-[3.49rem] w-[4.19rem]">
        <Image
          src="/images/credit-card.svg"
          alt=""
          width={67}
          height={67}
          className="w-full aspect-square"
        />
      </div>
      <h1 className="mt-10 text-3xl font-semibold text-neutral-700">
        Open Dashboard
      </h1>
      <p className="justify-center self-stretch px-2.5 py-1 mt-5 text-lg font-medium text-neutral-700 bg-surface-500 rounded max-md:max-w-full">
        Please connect your wallet to access to your dashboard
      </p>
      <ConnectWalletButton
        text="Connect your wallet"
        className="justify-center px-5 py-3 mt-10 text-base font-semibold text-neutral-700 bg-emerald-200 rounded-lg border-2 border-black border-solid"
      />
    </div>
  );
};

export default ConnectWalletModal;
