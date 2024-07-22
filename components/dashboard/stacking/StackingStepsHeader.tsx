import Link from "next/link";
import React from "react";

type step = {
  title: string;
  number: string;
  text: string;
  isActive: boolean;
};

type StackingStepsHeaderProps = {
  steps: step[];
};

type StepProps = {
  number: string;
  title: string;
  text: string;
  isActive: boolean;
};

const Step: React.FC<StepProps> = ({ number, text, isActive }) => (
  <div className="flex gap-2.5 justify-center">
    <div
      className={`justify-center flex items-center px-[18px] py-[11px] w-11 h-11 font-semibold whitespace-nowrap max-sm:w-7 max-sm:h-7 max-sm:px-[11.4px] max-sm:py-[7px] ${
        isActive
          ? "bg-surface-500 border-black text-neutral-700"
          : "bg-white border-stone-300"
      } border border-solid rounded-[50px] max-sm:text-[12.4px]`}
    >
      {number}
    </div>
    <div
      className={`my-auto ${
        isActive
          ? "font-semibold text-neutral-700 max-sm:text-base"
          : "font-medium text-neutral-400 max-sm:text-base"
      }`}
    >
      {text}
    </div>
  </div>
);

const StackingStepsHeader: React.FC<StackingStepsHeaderProps> = ({ steps }) => {
  return (
    <>
      <div className="flex w-full justify-center">
        <div className="text-5xl flex justify-between font-semibold text-neutral-700 w-full max-w-[1260px] max-md:text-4xl flex-wrap max-sm:justify-center max-sm:flex-col max-sm:items-center">
          <div></div>
          {steps.filter((step) => step.isActive)[0].title}
          <div className="flex items-center justify-between cursor-pointer   ">
            <div className=" my-auto text-lg text-neutral-700 border-b-2 border-black border-solid font-semibold">
              <Link
                href="https://medium.com/@erableofficial/staking-program-everything-you-need-to-know-a821e2a7e2af"
                target="_blank"
                rel="noopener noreferrer"
              >
                View tuto
              </Link>
            </div>
          </div>
        </div>
      </div>

      <section className="flex justify-center max-sm:justify-start items-center px-16 mx-2.5 mt-3.5 text-lg text-neutral-400 max-md:px-5 max-md:max-w-full max-sm:px-0 max-sm:mx-0 max-sm:mt-8">
        <div className="flex gap-5 justify-between max-md:flex-wrap max-sm:flex-col max-sm:items-start ">
          {steps.map((step, index) => (
            <Step key={index} {...step} />
          ))}
        </div>
      </section>
    </>
  );
};

export default StackingStepsHeader;
