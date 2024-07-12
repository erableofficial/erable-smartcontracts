import * as React from "react";
import { ArrowUpDown, ArrowUpRight, Info, X } from "lucide-react";

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
        className="flex flex-col items-left px-10 pt-10 pb-10 bg-white rounded-[20px] border border-solid border-stone-300 max-w-[800px] max-md:px-5 absolute max-[841px]:mx-5"
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
        <div className=" flex items-center justify-between mt-3 text-3xl font-semibold mb-10 text-neutral-700">
          <div className="flex gap-3 items-center">
            <span className="flex justify-center items-center px-3  bg-surface-500 h-[45px] rounded-[37.5px] w-[45px]">
              <ArrowUpDown size={32} width={24} height={24} />
            </span>
            Bridge Your Tokens
          </div>
          <span className="justify-center flex items-center text-center px-2.5 py-1.5 text-sm font-medium text-neutral-700 bg-surface-500 border-2 border-black border-solid rounded-[38px]">
            $CLAP holders only
          </span>
        </div>

        {/* <InfoText
          bgColor="bg-orange-200"
          Icon={<Info height={17} width={17} color="#000000" />}
          text="To bridge your $CLAP tokens, follow the instructions provided on our partner's website"
        /> */}
        <div className="flex flex-row self-stretch p-5 mb-6 bg-white rounded-xl border-2 border-solid border-stone-300 max-w-[720px]">
          <div className="flex gap-3.5 max-md:flex-wrap">
            <div className="flex justify-center mr-3 items-center p-2 bg-surface-500 h-[35px] rounded-[29.167px] w-[35px]">
              <Info height={17} width={17} color="#000000" />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex-1 my-auto text-xl font-bold text-neutral-700 max-md:max-w-full">
              Redirection to Chainport for the bridging process
            </div>
            <div className="self-start text-base font-medium text-neutral-700 max-md:max-w-full">
              To bridge your $CLAP tokens, you’ll need to follow the
              instructions provided by Chainport, our bridge partner. Click
              &quot;Bridge my $CLAP&quot; to start the process.
            </div>
          </div>
        </div>
        <p className="self-stretch text-base font-medium text-left text-neutral-600 max-md:max-w-full">
          This secure process enables you to transfer your tokens between the
          blockchains Cardano and Polygon. For more information or assistance,
          please read the tutorial.
        </p>

        <div className="flex gap-2.5 justify-left mt-10 text-base font-semibold text-neutral-700">
          <button className="secondary-button-sm">Read tutorial</button>
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
