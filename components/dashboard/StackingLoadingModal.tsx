import { Info, LoaderCircle } from "lucide-react";
import React from "react";

type InfoBoxProps = {
  text: string;
};
type StackingLoadingModalProps = {
  toggleStackingLoadingModal: boolean;
};

const InfoBox: React.FC<InfoBoxProps> = ({ text }) => (
  <div className="flex gap-1.5 px-2.5 py-1 font-medium bg-orange-100 rounded">
    <Info width={17} height={17} color="#000000" />
    <div>{text}</div>
  </div>
);

const StackingLoadingModal: React.FC<StackingLoadingModalProps> = ({
  toggleStackingLoadingModal,
}) => {
  if (!toggleStackingLoadingModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-[100] flex justify-center items-center">
      <div className=" mt-14 mx-auto flex flex-col items-center p-10 text-lg font-semibold text-neutral-700 bg-white rounded-3xl border border-solid border-stone-300 max-w-[650px] max-md:px-5">
        <LoaderCircle width={43} height={43} className="animate-spin" />
        <h1 className="mt-10 text-3xl font-NeueHaas">Staking in Progress</h1>
        <p className="font-NeueHaas self-stretch mt-5 font-medium text-center max-md:max-w-full">
          Please wait a moment. This can take a few minutes.
        </p>
      </div>
    </div>
  );
};

export default StackingLoadingModal;
