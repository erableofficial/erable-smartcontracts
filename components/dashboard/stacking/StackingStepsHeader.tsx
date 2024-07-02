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
      className={`justify-center flex items-center px-[18px] py-[11px] w-11 h-11 font-semibold whitespace-nowrap ${
        isActive
          ? "bg-surface-500 border-black text-neutral-700"
          : "bg-white border-stone-300"
      } border border-solid rounded-[50px]`}
    >
      {number}
    </div>
    <div
      className={`my-auto ${
        isActive
          ? "font-semibold text-neutral-700"
          : "font-medium text-neutral-400"
      }`}
    >
      {text}
    </div>
  </div>
);

const StackingStepsHeader: React.FC<StackingStepsHeaderProps> = ({ steps }) => {
  return (
    <>
      <div className="text-5xl text-center font-semibold text-neutral-700 max-md:max-w-full max-md:text-4xl">
        {steps.filter((step) => step.isActive)[0].title}
      </div>
      <div className="flex gap-3.5 justify-between pl-20 mx-2.5 max-w-full font-semibold w-[1260px] max-md:flex-wrap max-md:pl-5">
        <div className="pb-1.5 my-auto text-lg text-neutral-700 border-b-2 border-black border-solid">
          View tuto
        </div>
      </div>
      <section className="flex justify-center items-center px-16 mx-2.5 mt-3.5 text-lg text-neutral-400 max-md:px-5 max-md:max-w-full">
        <div className="flex gap-5 justify-between max-md:flex-wrap">
          {steps.map((step, index) => (
            <Step key={index} {...step} />
          ))}
        </div>
      </section>
    </>
  );
};

export default StackingStepsHeader;
