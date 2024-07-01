import * as React from "react";
import ConnectWalletButton from "../ui/connectWalletButton";
import { LoaderCircle, TriangleAlert } from "lucide-react";
import InfoText from "../ui/InfoText";

const ConnectWalletModal: React.FC = () => {
  return (
    <div className="flex flex-col items-center px-10 py-10 bg-white rounded-3xl border border-solid border-stone-300 max-w-[650px] max-md:px-5 absolute top-[50%] left-[50%] transform translate-x-[-50%] translate-y-[-50%] z-[49] max-md:w-full">
      <div className="flex justify-center items-center px-4">
        <LoaderCircle width={43} height={43} className="animate-spin" />
      </div>
      <h1 className="mt-10 text-3xl font-semibold text-neutral-700">
        Connect wallet
      </h1>
      {/* <p className="justify-center self-stretch px-2.5 py-1 mt-5 text-lg font-medium text-neutral-700 bg-surface-500 rounded max-md:max-w-full">
        Please connect your wallet to access to your dashboard
      </p> */}
      <div className="py-10">
        <InfoText
          bgColor="bg-danger-200"
          text="Please connect your wallet to access to your dashboard"
          Icon={<TriangleAlert width={17} height={17} />}
        />
      </div>

      <ConnectWalletButton
        text="Connect your wallet"
        className=" primary-button-sm text-base font-semibold"
      />
    </div>
  );
};

export default ConnectWalletModal;
