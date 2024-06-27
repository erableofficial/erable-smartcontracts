import * as React from "react";

type RewardOptionProps = {
  title: string;
  description: string;
};

const RewardOption: React.FC<RewardOptionProps> = ({ title, description }) => (
  <section className="flex flex-col grow p-6 mx-auto w-full font-semibold bg-white rounded-3xl border border-solid border-zinc-300 max-md:px-5 max-md:mt-8">
    <h2 className="flex gap-3.5 text-2xl text-neutral-700">
      {title}
      <a
        href="#"
        className="self-start pb-1.5 mt-1 text-base text-neutral-700 border-b-2 border-black border-solid"
      >
        En savoir plus
      </a>
    </h2>
    <p className="mt-8 text-lg font-medium text-neutral-700">{description}</p>
    <a
      href="#"
      className="justify-center self-start px-6 py-3 mt-8 text-base text-neutral-700 bg-surface-primary rounded-lg border-2 border-black border-solid max-md:px-5"
    >
      En savoir plus
    </a>
  </section>
);

const RewardSystem: React.FC = () => {
  const rewardOptions = [
    {
      title: "Staking",
      description:
        "Holding $ERA tokens offers a stake in erable's growth, with their value poised to increase through strategic buybacks and burns as the ecosystem expands.",
    },
    {
      title: "Airdrop",
      description:
        "Holding $ERA tokens offers a stake in erable's growth, with their value poised to increase through strategic buybacks and burns as the ecosystem expands.",
    },
    {
      title: "LP Farming",
      description:
        "Holding $ERA tokens offers a stake in erable's growth, with their value poised to increase through strategic buybacks and burns as the ecosystem expands.",
    },
  ];

  return (
    <div className="flex flex-col items-start self-stretch p-20 bg-white max-md:px-5">
      <h1 className="mt-2.5 ml-2.5 text-5xl font-semibold text-neutral-700 max-md:max-w-full max-md:text-4xl">
        Discover Our Reward Systems
      </h1>
      <h2 className="mt-2.5 ml-2.5 text-lg font-medium text-neutral-700 max-md:max-w-full">
        Choose one option and get rewards
      </h2>

      <main className="justify-between self-stretch mx-2.5 mt-10 max-md:max-w-full">
        <div className="flex gap-5 max-md:flex-col max-md:gap-0">
          {rewardOptions.map((option) => (
            <RewardOption
              key={option.title}
              title={option.title}
              description={option.description}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default RewardSystem;
