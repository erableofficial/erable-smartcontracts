import React from "react";

type RewardOptionProps = {
  title: string;
  description: string;
  steps: string[];
};

const RewardOption: React.FC<RewardOptionProps> = ({
  title,
  description,
  steps,
}) => (
  <article className="flex flex-col grow p-6 w-full text-lg font-semibold text-black bg-white rounded-3xl border border-gray-200 border-solid max-md:px-5 max-md:mt-8">
    <h3 className="text-2xl text-black">{title}</h3>
    <div className="flex flex-col h-full justify-between">
      <p className="mt-10 font-medium">{description}</p>
      <ul
        className="mt-6"
        style={{ listStyleType: "disc", marginLeft: "15px" }}
      >
        {steps.map((step, index) => (
          <li key={index} className={index > 0 ? "mt-1.5" : ""}>
            {step}
          </li>
        ))}
      </ul>
    </div>
    <a
      href="#"
      className="self-start pb-1.5 mt-10 text-black border-b-2 border-black border-solid"
    >
      View tuto
    </a>
  </article>
);

const RewardSystem: React.FC = () => {
  const rewardSystems: RewardOptionProps[] = [
    {
      title: "Staking",
      description:
        "Show your commitment to our ecosystem by staking $ERA tokens and earn rewards.",
      steps: ["Hold $ERA", "Lock your $ERA in the contract", "Earn rewards"],
    },
    {
      title: "Engage to Earn",
      description:
        "Contribute to our community and get rewarded with $ERA tokens. Your active participation is highly valued.",
      steps: [
        "Join our Discord",
        "Engage within the community",
        "Earn rewards",
      ],
    },
    {
      title: "LP Farming",
      description:
        "Earn $ERA by providing liquidity to our $ERA pool on Uniswap and locking it into our farming contract.",
      steps: [
        "Provide liquidity on Uniswap",
        "Lock your liquidity in the contract",
        "Earn rewards",
      ],
    },
  ];

  return (
    <div className="flex justify-center">
      <div className="flex flex-col items-start self-stretch py-20 max-w-[1260px] bg-white max-md:px-5">
        <div className="mt-2.5 ml-2.5 text-5xl font-extrabold text-black max-md:max-w-full max-md:text-4xl font-friends">
          Discover
        </div>
        <span className="justify-center px-2.5 mt-3 ml-2.5 text-5xl font-extrabold text-black bg-surface-500 rounded-md max-md:max-w-full max-md:text-4xl font-friends">
          Our Reward Systems
        </span>
        <section className="justify-between self-stretch mx-2.5 mt-10 max-md:max-w-full">
          <div className="flex gap-5 max-lg:flex-col max-md:gap-0">
            {rewardSystems.map((system, index) => (
              <div
                key={index}
                className="flex flex-col w-[33%] max-md:ml-0 max-lg:w-full"
              >
                <RewardOption {...system} />
              </div>
            ))}
          </div>
        </section>
        <button className="primary-button-sm justify-center px-7 py-4 mt-10 ml-2.5 text-lg font-semibold  max-md:px-5">
          Learn more
        </button>
      </div>
    </div>
  );
};

export default RewardSystem;
