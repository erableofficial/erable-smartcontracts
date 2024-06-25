import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";

interface SolutionItem {
  title: string;
  items: { text: string; note?: string; icon?: string }[];
}

const solutions: SolutionItem[] = [
  {
    title: "Solution",
    items: [
      { text: "Staking" },
      { text: "LP Farming" },
      { text: "Airdrop" },
      { text: "Gouvernance", note: "soon" },
    ],
  },
  {
    title: "Ressources",
    items: [
      { text: "How to stake" },
      { text: "How to LP Farm" },
      { text: "Whitepaper" },
      { text: "Contact us" },
    ],
  },
  {
    title: "Social medias",
    items: [
      {
        text: "Discord",
        icon: "arrow up right",
      },
      {
        text: "Twitter",
        icon: "arrow up right",
      },
    ],
  },
];

const SolutionList: React.FC<{ solution: SolutionItem }> = ({ solution }) => (
  <div
    className={`flex flex-col w-[41%] max-md:ml-0 max-md:w-full pt-16 pb-0 ${
      solution.title === "Social medias" ? "px-5" : "px-20"
    }`}
  >
    <h2 className="text-xl font-semibold tracking-tight leading-8 text-primary">
      {solution.title}
    </h2>
    <ul className="flex flex-col grow font-medium max-md:mt-10">
      {solution.items.map((item, index) => (
        <li key={index} className="mt-4 ">
          <Link className="flex gap-2.5 justify-between" href="#">
            <span className="text-base tracking-tight leading-5 text-primary">
              {item.text}
            </span>
            {item.icon && <ArrowUpRight />}

            {item.note && (
              <span className="justify-center px-2.5 py-1 text-xs text-neutral-700 bg-white border border-black border-solid rounded-[38px]">
                {item.note}
              </span>
            )}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

const Footer: React.FC = () => (
  <footer className="flex flex-col pt-16 pl-2.5 bg-surface-500 rounded-3xl">
    <div className="flex gap-5 justify-between self-center w-full max-w-[87%] max-md:flex-wrap max-md:max-w-full">
      <div className="flex flex-col py-0.5 max-w-[20%]  max-sm:max-w-[99%]">
        <Image
          src="/images/erable footer.svg"
          alt=""
          className="aspect-[4] w-[76px]"
          width={76}
          height={76}
        />
        <h1 className="mt-7 text-2xl font-semibold tracking-wide leading-8 text-primary">
          Your gateway to impact investment
        </h1>
        <div className="mt-14 text-sm leading-5 text-primary max-md:mt-10">
          ©{new Date().getFullYear()} Erable. All rights reserved
        </div>
      </div>
      <div className="max-md:max-w-full">
        <div className="flex gap-5 max-md:flex-col max-md:gap-0">
          {solutions.map((solution) => (
            <SolutionList key={solution.title} solution={solution} />
          ))}
        </div>
      </div>
    </div>
    <Image
      src="/images/big erable footer.svg"
      alt="erable"
      className="mt-7 w-full max-md:max-w-full"
      width={1290}
      height={258}
    />
  </footer>
);

export default Footer;
