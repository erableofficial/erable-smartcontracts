import React from "react";

type StackStepTwoBodyProps = {
  setSteps: React.Dispatch<
    React.SetStateAction<
      {
        number: string;
        title: string;
        text: string;
        isActive: boolean;
      }[]
    >
  >;
};

const StackStepTwoBody: React.FC<StackStepTwoBodyProps> = ({ setSteps }) => {
  const items = [
    { label: "Total APR:", value: "00" },
    { label: "Duration:", value: "1 year" },
    { label: "Start date:", value: "15th July 2024" },
    { label: "End date:", value: "15th July 2025" },
  ];
  const handleClick = () => {
    setSteps([
      {
        number: "1",
        title: "Stake your token : Informations",
        text: "Staking Informations",
        isActive: false,
      },
      { number: "2", title: "Send funds", text: "Send funds", isActive: false },
      {
        number: "3",
        title: "You staked sucessfully",
        text: "Confirmation",
        isActive: true,
      },
    ]);
  };
  return (
    <div>
      <div className="flex mx-auto flex-col p-10 mt-14 bg-white rounded-3xl border border-solid border-stone-300 max-w-[791px] max-md:px-5">
        <h1 className="text-3xl font-semibold text-black max-md:max-w-full">
          Confirm Staking by sending funds
        </h1>
        <h2 className="mt-10 text-xl font-bold text-black max-md:max-w-full">
          Your staking:
        </h2>
        <section className="flex gap-5 justify-between mt-2.5 max-md:flex-wrap max-md:max-w-full">
          <div className="text-3xl font-semibold text-black">10.000 $ERA</div>
          <div className="my-auto text-base font-medium text-neutral-500">
            =$250.000
          </div>
        </section>
        <hr className="shrink-0 mt-6 h-px border border-solid bg-neutral-300 border-neutral-300 max-md:max-w-full" />
        <h2 className="mt-6 text-xl font-bold text-black max-md:max-w-full">
          Staking key informations:
        </h2>
        <section className="flex gap-5 justify-between mt-6 text-lg font-medium text-black max-md:flex-wrap max-md:max-w-full">
          <div className="flex flex-col">
            {items.map((item, index) => (
              <div key={index} className={index > 0 ? "mt-5" : ""}>
                {item.label}
              </div>
            ))}
          </div>
          <div className="flex flex-col">
            {items.map((item, index) => (
              <div key={index} className={index > 0 ? "mt-5" : ""}>
                {item.value}
              </div>
            ))}
          </div>
        </section>
        <button
          className="justify-center self-center px-7 py-4 mt-10 text-lg font-semibold text-black bg-emerald-200 rounded-xl border-black border-solid border-[3px] max-md:px-5"
          onClick={handleClick}
        >
          Send funds
        </button>
      </div>
    </div>
  );
};

export default StackStepTwoBody;
