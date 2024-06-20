import * as React from "react";
import { ArrowUpRight, Database, Info, X } from "lucide-react";
import InfoText from "./InfoText";

interface BridgeProcessModal {
  toggleBridgeProcessModal: boolean;
  setToggleBridgeProcessModal: (value: boolean) => void;
}

const BridgeProcessModal: React.FC<BridgeProcessModal> = ({
  toggleBridgeProcessModal,
  setToggleBridgeProcessModal,
}) => {
  if (!toggleBridgeProcessModal) return null;
  const closeModal = () => {
    setToggleBridgeProcessModal(false);
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
        className="flex flex-col items-left px-10 pt-6 pb-10 bg-white rounded-[20px] border border-solid border-stone-300 max-w-[650px] max-md:px-5 absolute"
        onClick={stopPropagation}
      >
        <div className="flex justify-end">
          <X
            size={32}
            width={14}
            height={14}
            color="#989898"
            cursor={"pointer"}
            onClick={() => setToggleBridgeProcessModal(false)}
          />
        </div>
        <div className="flex justify-center items-center px-4 border border-solid bg-zinc-50 border-stone-300 h-[67px] rounded-[55.833px] w-[67px]">
          <Database size={32} width={35} height={35} />
        </div>
        <div className=" flex gap-3 mt-10 text-3xl font-semibold mb-8 text-black">
          Bridge Your Tokens
          <span className="justify-center flex items-center text-center px-2.5 py-1.5 text-sm font-medium text-black bg-surface-500 border-2 border-black border-solid rounded-[38px]">
            $CLAP holders only
          </span>
        </div>
        <p className="self-stretch mb-4 text-lg font-medium text-left text-black max-md:max-w-full">
          This secure process enables you to transfer your tokens between the
          Cardano and the Polygon blockchains. For more information or
          assistance, please read the tutorial.
        </p>
        <InfoText
          bgColor="bg-orange-200"
          Icon={<Info height={17} width={17} color="#000000" />}
          text="To bridge your $CLAP tokens, follow the instructions provided on our partner's website"
        />

        <div className="flex gap-2.5 justify-left mt-10 text-base font-semibold text-black">
          <button className="secondary-button-sm">See tutorial</button>
          <button className="primary-button-sm">
            <>
              <span className="my-auto">Bridge my $CLAP</span>
              <ArrowUpRight width={24} height={24} size={32} color="#000000" />
            </>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BridgeProcessModal;
