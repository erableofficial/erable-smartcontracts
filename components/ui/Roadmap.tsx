import Image from "next/image";
import * as React from "react";


type FeatureBlockProps = {
  title: string;
  text: string;
};

type RoadmapSectionProps = {
  period: string;
  features: { title: string; text: string }[];
};

const FeatureBlock: React.FC<FeatureBlockProps> = ({ title, text }) => (
  <div className="flex flex-col w-full p-6 mt-5 bg-white border border-solid rounded-2xl border-zinc-300 max-md:px-5">
    <div className="flex justify-between w-full gap-5">
      <div className="flex gap-2.5 text-xl font-bold">
        <Image
          src="/images/mail.svg"
          alt=""
          className="w-6 shrink-0 aspect-square"
        />
        <div>{title}</div>
      </div>
      <div className="justify-center self-start px-2.5 py-1 text-xs font-medium whitespace-nowrap bg-surface-500 border border-black border-solid rounded-[2.375rem]">
        tech
      </div>
    </div>
    <div className="mt-6 text-lg font-medium">{text}</div>
  </div>
);

const RoadmapSection: React.FC<RoadmapSectionProps> = ({
  period,
  features,
}) => (
  <div  className="col-span-12 md:col-span-6 lg:col-span-3">
    <div className="flex flex-col text-black grow max-md:mt-6">
      <h2 className="justify-center px-5 py-1.5 text-2xl font-semibold text-black bg-surface-500 rounded-lg">
        {period}
      </h2>
      {features.map((feature, index) => (
        <FeatureBlock key={index} title={feature.title} text={feature.text} />
      ))}
    </div>
  </div>
);

const Roadmap: React.FC = () => {
  const roadmapData = [
    {
      period: "S2 2024",
      features: [
        {
          title: "Feature 1",
          text: "Earn rewards by locking $ERA tokens in a secure contract, showing your",
        },
        {
          title: "Feature 2",
          text: "Earn rewards by locking $ERA tokens in a secure contract, showing your commitment to",
        },
      ],
    },
    {
      period: "S1 2025",
      features: [
        {
          title: "Feature 1",
          text: "Earn rewards by locking $ERA tokens in a secure contract, showing your",
        },
        {
          title: "Feature 2",
          text: "Earn rewards by locking $ERA tokens in a secure contract, showing your commitment to",
        },
      ],
    },
    {
      period: "S2 2025",
      features: [
        {
          title: "Feature 1",
          text: "Earn rewards by locking $ERA tokens in a secure contract, showing your",
        },
        {
          title: "Feature 2",
          text: "Earn rewards by locking $ERA tokens in a secure contract, showing your commitment to",
        },
      ],
    },
    {
      period: "S1 2026",
      features: [
        {
          title: "Feature 1",
          text: "Earn rewards by locking $ERA tokens in a secure contract, showing your",
        },
        {
          title: "Feature 2",
          text: "Earn rewards by locking $ERA tokens in a secure contract, showing your commitment to",
        },
      ],
    },
  ];

  return (
    <div className="flex flex-col self-stretch p-20 bg-stone-50 max-md:px-5">
      <div className="justify-center self-start px-2.5 ml-2.5 text-5xl font-extrabold text-black whitespace-nowrap bg-surface-500 rounded-xl max-md:text-4xl">
        Roadmap
      </div>
      <hr className="shrink-0 mx-2.5 mt-10 max-w-full h-px border border-solid bg-neutral-300 border-neutral-300 w-[1263px]" />
      <div className="justify-center px-9 mx-2.5 mt-10 max-md:px-5 max-md:max-w-full">
        <div className="grid grid-cols-12 gap-5 max-md:grid-cols-1">
          {roadmapData.map((section, index) => (
            <RoadmapSection
              key={index}
              period={section.period}
              features={section.features}
            />
          ))}
        </div>
      </div>
      <div className="flex justify-center items-center px-16 mx-2.5 mt-14 text-lg font-semibold tracking-wide leading-5 text-primary max-md:px-5 max-md:mt-10 max-md:max-w-full">
        <div className="flex gap-5 max-md:flex-wrap">
          <button className="justify-center px-7 py-4 bg-surface-primary rounded-xl border-solid border-[3px] border-primary max-md:px-5 primary-button">
            Read Whitepaper
          </button>
          <button className="justify-center px-7 py-4 rounded-xl border-solid bg-surface-primary bg-opacity-0 border-[3px] border-primary max-md:px-5 secondary-button">
            Our Community Manifesto
          </button>
        </div>
      </div>
    </div>
  );
};

export default Roadmap;
