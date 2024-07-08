import { Info, LoaderCircle, File } from "lucide-react";
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
    <p>{text}</p>
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
        <div className="mt-10 mb-10 text-3xl">Authorize Staking Contract</div>
        {/* <InfoBox
          text="Authorize this staking contract to securely manage your tokens. By approving, you enable the contract to enroll your tokens in the staking program, allowing you to earn rewards. This is just a permission step and no funds will be moved yet. "
          bgColor="bg-surface-500"
        /> */}
        <div className="p-5 flex border-[1.5px] border-warning-200 rounded-xl ">
          <div className="flex justify-center mr-3 items-center p-2 bg-warning-200 h-[35px] rounded-[29.167px] w-[35px]">
            <File width={19} height={20} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <div className="text-xl font-semibold">
              Authorize this staking contract
            </div>
            <p className="text-base font-medium">
              By approving, you enable the contract to enroll your tokens in the
              staking program, allowing you to earn rewards. <br />
              This is just a permission step and no funds will be moved yet.
            </p>
          </div>
        </div>

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
