import Image from "next/image";
import Link from "next/link";
import * as React from "react";
import BuySeraModal from "./BuySeraModal";

type Step = {
  stepNumber: number;
  title: string;
  description: string;
};

const steps: Step[] = [
  {
    stepNumber: 1,
    title: "Learn about Erable° and our token $ERA",
    description:
      "Discover the mission behind Erable° and understand how our $ERA token works. Hyperlink Whitepaper",
  },
  {
    stepNumber: 2,
    title: "Buy $ERA on Uniswap",
    description:
      "Purchase $ERA tokens on Uniswap to join our community. Start your journey with $ERA and gain access to exclusive features and benefits.",
  },
  {
    stepNumber: 3,
    title: "Discover our utilities and choose one",
    description:
      "Explore the various utilities available within our ecosystem. Choose the one that best fits your interests and needs to maximize your engagement and rewards.",
  },
  {
    stepNumber: 4,
    title: "Get rewards",
    description:
      "Earn rewards by participating in our ecosystem. The more you engage and use our utilities, the more benefits and tokens you can accumulate.",
  },
];

const StepItem: React.FC<Step> = ({ stepNumber, title, description }) => (
  <>
    <div className="flex items-start gap-4 mt-8 max-md:flex-wrap">
      <div className="flex justify-center items-center px-5 py-2.5 text-lg font-semibold text-neutral-700 whitespace-nowrap bg-surface-500 border border-solid border-neutral-300 h-[2.688rem] rounded-full w-[2.688rem]">
        {stepNumber}
      </div>
      <div className="flex flex-col flex-1 justify-center text-neutral-700 max-md:max-w-full">
        <div className="text-2xl font-semibold max-md:max-w-full">{title}</div>
        <div className="mt-1 text-sm font-medium max-md:max-w-full">
          {description}
        </div>
      </div>
    </div>
    <div className="shrink-0 mt-8 h-px border border-solid bg-neutral-200 border-neutral-200 max-md:max-w-full" />
  </>
);

const HowItWorks = () => {
  const [toggleBuyEraModal, setToggleBuyEraModal] = React.useState(false);
  return (
    <section className="self-stretch p-20 bg-stone-50 max-md:px-5">
      <BuySeraModal
        toggleBuyEraModal={toggleBuyEraModal}
        setToggleBuyEraModal={setToggleBuyEraModal}
      />
      <div className="flex gap-5 max-md:flex-col max-md:gap-0">
        <div className="flex flex-col w-6/12 max-md:ml-0 max-md:w-full">
          <div className="flex flex-col mt-2.5 max-md:mt-10 max-md:max-w-full">
            <div className="flex gap-5 justify-between max-md:flex-wrap max-md:max-w-full">
              <h1 className="justify-center px-2.5 text-5xl font-extrabold text-neutral-700 bg-surface-500 rounded-xl max-md:text-4xl leading-[4.641rem]">
                How it Works
              </h1>
              <div className="flex flex-col justify-center px-0.5 py-2 my-auto text-lg font-semibold tracking-wide leading-5 text-primary">
                <Link
                  href={"/"}
                  className="justify-center py-1 border-b-2 border-solid border-primary"
                >
                  I’m a CLAP investor
                </Link>
              </div>
            </div>
            {steps.map((step) => (
              <StepItem
                key={step.stepNumber}
                stepNumber={step.stepNumber}
                title={step.title}
                description={step.description}
              />
            ))}
            <div className="flex justify-center self-start gap-5 mt-14 text-lg font-semibold tracking-wide leading-5 text-primary max-md:mt-10">
              <button
                className="px-7 py-4 bg-surface-primary rounded-xl border-solid border-[3px] border-primary max-md:px-5 primary-button"
                onClick={() => setToggleBuyEraModal(true)}
              >
                Buy $ERA
              </button>
              <Link
                href={"/dashboard"}
                className="px-7 py-4 rounded-xl border-solid  border-[3px] border-primary max-md:px-5 secondary-button "
              >
                Open dashboard
              </Link>
            </div>
          </div>
        </div>
        <div className="flex flex-col ml-5 w-6/12 max-md:ml-0 max-md:w-full">
          <Image
            src="/images/placeholder.png"
            alt=""
            className="self-stretch mt-2.5 w-full aspect-[0.84] max-md:mt-10 max-md:max-w-full"
            width={300}
            height={253}
          />
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
