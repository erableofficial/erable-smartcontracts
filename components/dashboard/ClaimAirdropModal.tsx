import * as React from "react";
import { Gift, Sparkles, X } from "lucide-react";
import { TabItem } from "../../lib/types";

interface ClaimAirdropModalProps {
  toggleClaimAirdropModal: boolean;
  setToggleClaimAirdropModal: (value: boolean) => void;
  handleClaimAirdrop: () => void;
  airdrop: TabItem;
}

const ClaimAirdropModal: React.FC<ClaimAirdropModalProps> = ({
  toggleClaimAirdropModal,
  setToggleClaimAirdropModal,
  handleClaimAirdrop,
  airdrop,
}) => {
  if (!toggleClaimAirdropModal) return null;
  const closeModal = () => {
    setToggleClaimAirdropModal(false);
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
        className="flex flex-col items-left px-10 pt-10 pb-10 bg-white rounded-[20px] border border-solid border-stone-300 max-w-[800px] max-md:px-5 absolute max-[849px]:mx-5"
        onClick={stopPropagation}
      >
        <div className="flex justify-end">
          <X
            size={32}
            width={14}
            height={14}
            color="#989898"
            cursor={"pointer"}
            onClick={() => setToggleClaimAirdropModal(false)}
          />
        </div>
        <div className=" flex items-center justify-between mt-3 text-3xl font-semibold mb-10 text-neutral-700">
          <div className="flex gap-3 items-center">
            <span className="flex justify-center items-center px-3  bg-surface-500 h-[45px] rounded-[37.5px] w-[45px]">
              <Gift size={32} width={24} height={24} />
            </span>
            Claim your $ERA
          </div>
        </div>
        <div className="flex flex-row self-stretch p-5 mb-6 bg-white rounded-xl border-2 border-solid border-stone-300 max-w-[720px]">
          <div className="flex gap-3.5 max-md:flex-wrap">
            <div className="flex justify-center mr-3 items-center p-2 bg-surface-500 h-[35px] rounded-[29.167px] w-[35px]">
              <Sparkles height={17} width={17} color="#000000" />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex-1 my-auto text-xl font-bold text-neutral-700 max-md:max-w-full">
              {Number(airdrop.amount)} $ERA earned
            </div>
            <div className="self-start text-base font-medium text-neutral-700 max-md:max-w-full">
              Congratulations! You have successfully earned $ERA by contributing
              to our community.
              <br /> Active participation is greatly appreciated, helps us to
              animate the community and pushes us to improve day by day. Thank
              you very much!
            </div>
          </div>
        </div>
        <p className="self-stretch text-base font-medium text-left text-neutral-600 max-md:max-w-full">
          You can now claim your tokens. Click on the claim button to initiate
          the transaction. <br />
          The process can take a few minutes.
        </p>

        <div className="flex gap-2.5 justify-left mt-10 text-base font-semibold text-neutral-700">
          <button className="secondary-button-sm">Read tutorial</button>
          <button onClick={handleClaimAirdrop} className="primary-button-sm">
            Claim my airdrop
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClaimAirdropModal;
