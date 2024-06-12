import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import * as React from "react";

interface WalletButtonProps {
  text: string;
}

const WalletButton: React.FC<WalletButtonProps> = ({ text }) => (
  <div className="flex flex-col justify-center self-stretch font-semibold tracking-wide bg-white leading-[122%] text-stone-900">
    <button className="justify-center px-7 py-4 rounded-xl border-solid bg-emerald-200 bg-opacity-0 border-[3px] border-stone-900 max-md:px-5">
      {text}
    </button>
  </div>
);

interface UtilityLinkProps {
  text: string;
  src: string;
  alt: string;
}

const UtilityLink: React.FC<UtilityLinkProps> = ({ text, src, alt }) => (
  <div className="flex gap-1.5 justify-center self-stretch my-auto whitespace-nowrap">
    <span>{text}</span>
    <img
      loading="lazy"
      src={src}
      alt={alt}
      className="shrink-0 my-auto w-4 aspect-square"
    />
  </div>
);

interface ActionButtonProps {
  text: string;
  src: string;
}

const ActionButton: React.FC<ActionButtonProps> = ({ text, src }) => (
  <div className="flex flex-col justify-center px-4 py-2 bg-surface-500 border-2 border-black border-solid rounded-[38px]">
    <div className="flex gap-0.5 justify-center">
      <span>{text}</span>
      <img
        loading="lazy"
        src={src}
        alt=""
        className="shrink-0 my-auto aspect-square w-[15px]"
      />
    </div>
  </div>
);

const Header: React.FC = () => {
  return (
    <header className="flex justify-center items-center w-full ">
      <section className="flex gap-5 justify-between px-6 py-4 mt-12 font-medium text-black rounded-3xl border-black border-solid bg-zinc-50 border-[3px] max-md:flex-wrap max-md:px-5">
        <div className="flex gap-5 justify-between my-auto text-base">
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/75d008d0ba1b431510ffcaf6b09b412fa142e994cba8277647b901257553c122?apiKey=b5a3f3b9a2da4a44aeb72712ff03a4c3&"
            alt="Main Image"
            className="shrink-0 my-auto aspect-[4] w-[81px]"
          />
          <ActionButton
            text="Bridge $CLAP"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/3ff6a6d030ca971d8b06034e245e502f800ded283d362d27fd227b2952e37117?apiKey=b5a3f3b9a2da4a44aeb72712ff03a4c3&"
          />
          <ActionButton
            text="Buy $ERA"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/3ff6a6d030ca971d8b06034e245e502f800ded283d362d27fd227b2952e37117?apiKey=b5a3f3b9a2da4a44aeb72712ff03a4c3&"
          />
        </div>
        <nav className="flex gap-5 justify-between items-center text-lg max-md:flex-wrap">
          <UtilityLink
            text="Utilities"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/66580f2efd3aaf8a29e184b72f1547e6178934dd4dfcb469d1671bf4f5b7e5b7?apiKey=b5a3f3b9a2da4a44aeb72712ff03a4c3&"
            alt="Utilities Icon"
          />
          <UtilityLink
            text="Docs"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/66580f2efd3aaf8a29e184b72f1547e6178934dd4dfcb469d1671bf4f5b7e5b7?apiKey=b5a3f3b9a2da4a44aeb72712ff03a4c3&"
            alt="Docs Icon"
          />
          <p className="self-stretch my-auto">Dashboard</p>
          <WalletButton text="Connect wallet" />
        </nav>
      </section>
    </header>
  );
};

export default Header;
