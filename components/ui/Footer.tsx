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
        icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/3ff6a6d030ca971d8b06034e245e502f800ded283d362d27fd227b2952e37117?apiKey=b5a3f3b9a2da4a44aeb72712ff03a4c3&",
      },
      {
        text: "Twitter",
        icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/3ff6a6d030ca971d8b06034e245e502f800ded283d362d27fd227b2952e37117?apiKey=b5a3f3b9a2da4a44aeb72712ff03a4c3&",
      },
    ],
  },
];

const SolutionList: React.FC<{ solution: SolutionItem }> = ({ solution }) => (
  <section className="flex flex-col w-[41%] max-md:ml-0 max-md:w-full pt-16 pb-0 px-20">
    <h2 className="text-xl font-semibold tracking-tight leading-8 text-stone-900">
      {solution.title}
    </h2>
    <ul className="flex flex-col grow font-medium max-md:mt-10">
      {solution.items.map((item, index) => (
        <li key={index} className="flex gap-2.5 mt-4 justify-between">
          <span className="text-base tracking-tight leading-5 text-stone-900">
            {item.text}
          </span>
          {item.icon && (
            <img
              loading="lazy"
              src={item.icon}
              alt=""
              className="w-6 aspect-square"
            />
          )}

          {item.note && (
            <span className="justify-center px-2.5 py-1 text-xs text-black bg-white border border-black border-solid rounded-[38px]">
              {item.note}
              {/* <img
                loading="lazy"
                src={item.note}
                alt=""
                className="w-6 aspect-square"
              /> */}
            </span>
          )}
        </li>
      ))}
    </ul>
  </section>
);

const Footer: React.FC = () => (
  <div className="flex flex-col pt-16 pl-2.5 bg-yellow-200 rounded-3xl">
    <div className="flex gap-5 justify-between self-center w-full max-w-[1290px] max-md:flex-wrap max-md:max-w-full">
      <header className="flex flex-col py-0.5">
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/0e4fb0cb77e1a95ab4b8acb09af484421bced8a5929b7c24dc1c1e4f1bfb1221?apiKey=b5a3f3b9a2da4a44aeb72712ff03a4c3&"
          alt=""
          className="aspect-[4] w-[76px]"
        />
        <h1 className="mt-7 text-2xl font-semibold tracking-wide leading-8 text-stone-900">
          Your gateway to impact investment
        </h1>
        <footer className="mt-14 text-sm leading-5 text-stone-900 max-md:mt-10">
          ©{new Date().getFullYear()} Erable. All rights reserved
        </footer>
      </header>
      <div className="max-md:max-w-full">
        <div className="flex gap-5 max-md:flex-col max-md:gap-0">
          {solutions.map((solution) => (
            <SolutionList key={solution.title} solution={solution} />
          ))}
        </div>
      </div>
    </div>
    <img
      loading="lazy"
      src="https://cdn.builder.io/api/v1/image/assets/TEMP/8aa76a3665d09e63dc68874b671175506e0c9acec52d5211fc77f8ff1ae4d35e?apiKey=b5a3f3b9a2da4a44aeb72712ff03a4c3&"
      alt=""
      className="mt-7 w-full aspect-[5] max-md:max-w-full"
    />
  </div>
);

export default Footer;
