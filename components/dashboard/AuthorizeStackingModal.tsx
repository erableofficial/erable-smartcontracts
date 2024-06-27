import { Info, LoaderCircle } from "lucide-react";
import React from "react";
import { Address } from "viem";

type SignLoadingModalProps = {
  handleApprove: () => void;
  toggleAuthorizeStackingModal: boolean;
  setToggleAuthorizeStackingModal: (value: boolean) => void;
  isConfirmed: boolean;
  isConfirming: boolean;
  hash: Address | undefined;
};

type InfoBoxProps = {
  text: string;
  bgColor: string;
};

export const InfoBox: React.FC<InfoBoxProps> = ({ text, bgColor }) => (
  <div className={`flex gap-1.5 px-2.5 py-1 font-medium ${bgColor} rounded`}>
    <div>
      <Info width={17} height={17} color="#000000" />
    </div>
    <div>{text}</div>
  </div>
);

const AuthorizeStackingModal: React.FC<SignLoadingModalProps> = ({
  handleApprove,
  toggleAuthorizeStackingModal,
  setToggleAuthorizeStackingModal,
  isConfirmed,
  isConfirming,
  hash,
}) => {
  if (!toggleAuthorizeStackingModal) return null;
  const closeModal = () => {
    setToggleAuthorizeStackingModal(false);
  };

  const stopPropagation = (event: React.MouseEvent) => {
    event.stopPropagation();
  };
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-40 z-[100] flex justify-center items-center"
      onClick={closeModal}
    >
      <div
        className="mt-14 mx-auto  flex flex-col items-center p-10 text-lg font-semibold text-neutral-700 bg-white rounded-3xl border border-solid border-stone-300 max-w-[650px] max-md:px-5"
        onClick={stopPropagation}
      >
        {isConfirming && (
          <LoaderCircle width={43} height={43} className="animate-spin" />
        )}
        <h1 className="mt-10 mb-10 text-3xl">Authorize Staking Contract</h1>
        <InfoBox
          text="Authorize this staking contract to securely manage your tokens. By approving, you enable the contract to enroll your tokens in the staking program, allowing you to earn rewards. This is just a permission step and no funds will be moved yet. "
          bgColor="bg-surface-500"
        />
        {isConfirming && (
          <p className="self-stretch mt-5 font-medium text-center max-md:max-w-full">
            Please wait a moment. This can take a few minutes.
          </p>
        )}
        <div className="flex gap-2.5 justify-center mt-10 text-base text-neutral-700">
          <button className="secondary-button-sm">Need Help?</button>
          <button className="primary-button-sm" onClick={handleApprove}>
            Approve
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthorizeStackingModal;
