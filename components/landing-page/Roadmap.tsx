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
  <div className="flex flex-col p-6 mt-5 w-full bg-white rounded-2xl border border-solid border-zinc-300 max-md:px-5">
    <div className="flex gap-5 justify-between w-full">
      <div className="flex gap-2.5 text-xl font-bold">
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/d29a4cd431ff1d6a341bc5e473b71b892a56e00ba7ce8c08fe2b71633ce821f6?apiKey=b5a3f3b9a2da4a44aeb72712ff03a4c3&"
          alt=""
          className="shrink-0 w-6 aspect-square"
        />
        <div>{title}</div>
      </div>
      <div className="justify-center self-start px-2.5 py-1 text-xs font-medium whitespace-nowrap bg-surface-500 border border-black border-solid rounded-[38px]">
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
  <section className="flex flex-col w-3/12 max-md:ml-0 max-md:w-full">
    <header className="flex flex-col grow text-black max-md:mt-6">
      <h2 className="justify-center px-5 py-1.5 text-2xl font-semibold text-black bg-surface-500 rounded-lg">
        {period}
      </h2>
      {features.map((feature, index) => (
        <FeatureBlock key={index} title={feature.title} text={feature.text} />
      ))}
    </header>
  </section>
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
      <header className="justify-center self-start px-2.5 ml-2.5 text-5xl font-extrabold text-black whitespace-nowrap bg-surface-500 rounded-xl max-md:text-4xl">
        Roadmap
      </header>
      <hr className="shrink-0 mx-2.5 mt-10 max-w-full h-px border border-solid bg-neutral-300 border-neutral-300 w-[1263px]" />
      <main className="justify-center px-9 mx-2.5 mt-10 max-md:px-5 max-md:max-w-full">
        <div className="flex gap-5 max-md:flex-col max-md:gap-0">
          {roadmapData.map((section, index) => (
            <RoadmapSection
              key={index}
              period={section.period}
              features={section.features}
            />
          ))}
        </div>
      </main>
      <nav className="flex justify-center items-center px-16 mx-2.5 mt-14 text-lg font-semibold tracking-wide leading-5 text-stone-900 max-md:px-5 max-md:mt-10 max-md:max-w-full">
        <div className="flex gap-5 max-md:flex-wrap">
          <button className="primary-button">Read Whitepaper</button>
          <button className="secondary-button">Our Community Manifesto</button>
        </div>
      </nav>
    </div>
  );
};

export default Roadmap;
