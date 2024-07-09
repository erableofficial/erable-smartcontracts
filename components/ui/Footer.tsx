import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";
import LpFarmingModal from "../dashboard/LpFarmingModal";

type SolutionItemProps = {
  text: string;
  soon?: boolean;
  onClick?: () => void;
};

const SolutionItem: React.FC<SolutionItemProps> = ({ text, soon, onClick }) => (
  <div
    className="flex gap-2.5 mt-4 whitespace-nowrap cursor-pointer"
    onClick={onClick}
  >
    <div
      className={`text-base tracking-tight leading-5 text-stone-900 ${
        soon ? "flex items-center" : ""
      }`}
    >
      {text}
    </div>
    {soon && (
      <div className="justify-center px-2.5 py-1 text-xs text-black bg-white border border-black border-solid rounded-[38px]">
        soon
      </div>
    )}
  </div>
);

type SocialMediaItemProps = {
  name: string;
};

const SocialMediaItem: React.FC<SocialMediaItemProps> = ({ name }) => (
  <div className="flex gap-4 justify-between mt-4 whitespace-nowrap cursor-pointer">
    <div>{name}</div>
    <ArrowUpRight width={15} height={15} />
  </div>
);

const Footer: React.FC = () => {
  const [toggleLpFarmingModal, setToggleLpFarmingModal] =
    React.useState<boolean>(false);

  const solutionItems = [
    { text: "Staking" },
    { text: "LP Farming", onClick: () => setToggleLpFarmingModal(true) },
    { text: "Airdrop" },
    { text: "Governance", soon: true },
  ];

  const resourceItems = [
    "How to stake",
    "How to LP Farm",
    "Whitepaper",
    "Contact us",
  ];

  const socialMediaItems = [
    "Discord",
    "Twitter",
    "Medium",
    "Youtube",
    "Newsletter",
  ];

  return (
    <div className="flex flex-col pt-16 bg-surface-500 max-sm:pt-6">
      <LpFarmingModal
        setToggleLpFarmingModal={setToggleLpFarmingModal}
        toggleLpFarmingModal={toggleLpFarmingModal}
      />
      <div className="flex gap-5 justify-between px-20 w-full flex-wrap max-md:px-5 max-md:max-w-full">
        <div className="flex flex-col py-0.5 min-w-[233px]">
          <Image
            src="/images/erable footer.svg"
            alt=""
            className="aspect-[4] w-[106px]"
            width={106}
            height={19}
          />
          <div className="mt-7 text-[26px] font-semibold tracking-wide leading-8 text-stone-900 max-sm:text-xl max-sm:mt-6">
            Enable a new era of
            <br /> impact investing
          </div>
          <p className="mt-14 text-sm leading-5 text-stone-900 max-md:mt-10 max-sm:mt-4">
            ©{new Date().getFullYear()} Erable. All rights reserved
          </p>
        </div>
        <div className="max-md:w-full">
          <div className="flex gap-[70px]  max-md:gap-0  max-sm:flex-wrap">
            <section className="flex flex-col w-[41%] max-md:ml-0 max-md:w-[50%]">
              <div className="flex flex-col grow font-medium max-md:mt-10">
                <div className="text-xl font-semibold tracking-tight  text-stone-900">
                  $ERA Utilities
                </div>
                {solutionItems.map((item, index) => (
                  <SolutionItem
                    key={index}
                    text={item.text}
                    soon={item.soon}
                    onClick={item.onClick}
                  />
                ))}
              </div>
            </section>
            <section className="flex flex-col ml-5 w-[31%] max-md:ml-0 max-md:w-[50%]">
              <div className="flex flex-col grow text-base font-medium tracking-tight leading-5 text-stone-900 max-md:mt-10">
                <div className="text-xl font-semibold tracking-tight leading-7">
                  Resources
                </div>
                {resourceItems.map((item, index) => (
                  <div key={index} className="mt-4 cursor-pointer">
                    {item}
                  </div>
                ))}
              </div>
            </section>
            <section className="flex flex-col ml-5 w-[29%] max-md:ml-0 max-sm:w-full max-md:w-[34%]">
              <div className="flex flex-col grow self-stretch pb-20 text-base font-medium tracking-tight leading-5 text-stone-900 max-md:mt-10 w-max max-sm:w-full max-sm:pb-10">
                <div className="text-xl font-semibold tracking-tight leading-7">
                  Social Media
                </div>
                <div className="flex flex-col max-sm:flex-row max-sm:justify-between max-sm:flex-wrap">
                  {socialMediaItems.map((item, index) => (
                    <SocialMediaItem key={index} name={item} />
                  ))}
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
      <Image
        src="/images/big erable footer.svg"
        alt="erable"
        className="mt-7 w-full max-md:max-w-full max-sm:mt-0"
        width={1290}
        height={258}
      />
    </div>
  );
};

export default Footer;
