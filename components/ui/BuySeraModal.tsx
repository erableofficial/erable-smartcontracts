import * as React from "react";
import { ArrowUpRight, Info, Ticket, X } from "lucide-react";
import InfoText from "./InfoText";

interface BuySeraModalProps {
  toggleBuyEraModal: boolean;
  setToggleBuyEraModal: (value: boolean) => void;
}

const BuySeraModal: React.FC<BuySeraModalProps> = ({
  toggleBuyEraModal,
  setToggleBuyEraModal,
}) => {
  if (!toggleBuyEraModal) return null;
  const closeModal = () => {
    setToggleBuyEraModal(false);
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
            onClick={() => setToggleBuyEraModal(false)}
          />
        </div>
        <div className="flex justify-center items-center px-4 border border-solid bg-zinc-50 border-stone-300 h-[67px] rounded-[55.833px] w-[67px]">
          <Ticket size={32} width={35} height={35} />
        </div>
        <h1 className="mt-10 text-3xl font-semibold mb-8 text-black">
          Buy $ERA
        </h1>
        <InfoText
          bgColor="bg-orange-200"
          Icon={<Info height={17} width={17} color="#000000" />}
          text="You will be redirected to uniswap"
        />
        <p className="self-stretch mt-4 text-base font-medium text-left text-black max-md:max-w-full">
          Blabla secure, pk acheter là-bas Lorem ipsum dolor sit amet
          consectetur. Ornare ut at viverra magna platea arcu.
        </p>
        <div className="flex gap-2.5 justify-left mt-10 text-base font-semibold text-black">
          <button className="secondary-button-sm">See tutorial</button>
          <button className="primary-button-sm">
            <>
              <span className="my-auto">Buy $ERA</span>
              <ArrowUpRight width={24} height={24} size={32} color="#000000" />
            </>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuySeraModal;
