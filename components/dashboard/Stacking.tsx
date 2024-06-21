import { ArrowLeftRight, Info, TriangleAlert } from "lucide-react";
import React from "react";

type InfoCardProps = {
  title: string;
  description: string;
  value: string;
};

const InfoCard: React.FC<InfoCardProps> = ({ title, description, value }) => (
  <div className="flex flex-col grow justify-center p-6 mx-auto w-full font-semibold text-black bg-white rounded-xl border border-solid border-stone-300 max-md:px-5 max-md:mt-5">
    <div className="flex gap-1 pr-5 text-lg">
      <div>{title}</div>
      <Info width={15} height={15} color="#000000" />
    </div>
    <div className="mt-1 text-base font-medium text-neutral-500">
      {description}
    </div>
    <div className="mt-6 text-4xl">{value}</div>
  </div>
);

type StepProps = {
  number: string;
  text: string;
  isActive: boolean;
};

const Step: React.FC<StepProps> = ({ number, text, isActive }) => (
  <div className="flex gap-2.5 justify-center">
    <div
      className={`justify-center flex items-center px-5 py-3 w-11 h-11 font-semibold whitespace-nowrap ${
        isActive
          ? "bg-yellow-200 border-black text-black"
          : "bg-white border-stone-300"
      } border border-solid rounded-[50px]`}
    >
      {number}
    </div>
    <div
      className={`my-auto ${
        isActive ? "font-semibold text-black" : "font-medium text-neutral-400"
      }`}
    >
      {text}
    </div>
  </div>
);

const Stacking: React.FC = () => {
  const infoCards: InfoCardProps[] = [
    {
      title: "Current APY",
      description: "Lorem ipsum dolor sit amet coetur.",
      value: "xx",
    },
    {
      title: "Program duration",
      description: "Lorem ipsum dolor sit amet coetur.",
      value: "xx",
    },

    {
      title: "Start date",
      description: "Lorem ipsum dolor sit amet coetur.",
      value: "xx",
    },
    {
      title: "End date",
      description: "Lorem ipsum dolor sit amet coetur.",
      value: "xx",
    },
  ];

  const steps: StepProps[] = [
    { number: "1", text: "Staking Informations", isActive: true },
    { number: "2", text: "Send funds", isActive: false },
    { number: "3", text: "Confirmation", isActive: false },
  ];

  return (
    <main className="flex pb-20 pt-20 bg-neutral-50 flex-col px-20 max-md:px-5">
      <h1 className="text-5xl text-center text-black max-md:max-w-full max-md:text-4xl">
        Stake your token : Informations
      </h1>
      <nav className="flex gap-3.5 justify-between pl-20 mx-2.5 max-w-full font-semibold w-[1260px] max-md:flex-wrap max-md:pl-5">
        <div className="pb-1.5 my-auto text-lg text-black border-b-2 border-black border-solid">
          View tuto
        </div>
      </nav>
      <section className="flex justify-center items-center px-16 mx-2.5 mt-3.5 text-lg text-neutral-400 max-md:px-5 max-md:max-w-full">
        <div className="flex gap-5 justify-between max-md:flex-wrap">
          {steps.map((step, index) => (
            <Step key={index} {...step} />
          ))}
        </div>
      </section>
      <section className="mx-2.5 mt-14 max-md:mt-10 max-md:max-w-full">
        <div className="flex gap-5 max-md:flex-col max-md:gap-0">
          {infoCards.map((card, index) => (
            <div
              key={index}
              className="flex flex-col w-3/12 max-md:ml-0 max-md:w-full"
            >
              <InfoCard {...card} />
            </div>
          ))}
        </div>
      </section>
      <section className="flex flex-col p-6 mx-2.5 mt-5 bg-white rounded-3xl border border-solid border-stone-300 max-md:px-5 max-md:max-w-full">
        <div className="flex gap-5 justify-between font-medium text-black max-md:flex-wrap max-md:max-w-full">
          <div className="my-auto text-lg">
            Enter the amount you want to stake:{" "}
          </div>
          <div className="justify-center px-4 py-2 text-base bg-yellow-200 border-2 border-black border-solid rounded-[38px]">
            Total staked + rewards:{" "}
          </div>
        </div>
        <div className="flex gap-5 justify-between mt-6 w-full text-black whitespace-nowrap max-md:flex-wrap max-md:max-w-full">
          <div className="flex gap-1.5">
            <div className="text-5xl font-semibold">200.000</div>
            <div className="my-auto text-xl font-bold">$ERA</div>
          </div>

          <ArrowLeftRight width={32} height={32} color="#1F1F1F" />
          <div className="flex gap-1.5">
            <div className="text-5xl font-semibold">=200.000</div>
            <div className="my-auto text-xl font-bold">$ERA</div>
          </div>
        </div>
        <div className="flex gap-5 justify-between text-base font-medium whitespace-nowrap text-neutral-500 max-md:flex-wrap max-md:max-w-full">
          <div>=$250.000</div>
          <div>=$250.000</div>
        </div>
        <div className="flex gap-5 justify-between mt-6 w-full text-lg max-md:flex-wrap max-md:max-w-full">
          <div className="flex gap-3 pr-20 max-md:flex-wrap">
            <div className="my-auto font-medium text-black">
              You own : 400.000 $ERA
            </div>
            <div className="justify-center py-1 font-semibold text-black border-b-2 border-black border-solid">
              Stake Max
            </div>
          </div>
          <div className="my-auto font-medium text-black">
            1 year simulation
          </div>
        </div>
      </section>
      <aside className="flex flex-col p-5 mx-2.5 mt-5 bg-white rounded-xl border-2 border-orange-200 border-solid max-md:max-w-full">
        <div className="flex gap-3.5 max-md:flex-wrap">
          <div className="flex justify-center items-center p-2 bg-orange-200 h-[35px] rounded-[29.167px] w-[35px]">
            <TriangleAlert width={18} height={18} color="#000000" />
          </div>
          <h2 className="flex-1 my-auto text-xl font-bold text-black max-md:max-w-full">
            More infos about early unstaking{" "}
          </h2>
        </div>
        <p className="text-base font-medium text-black max-md:max-w-full">
          If you decide to unstake before the end of the period, you'll get a
          tax on your rewards. =&gt; derrière trouver comment bien expliquer
          slashing ici (en + de l'article qui expliquera ofc)
        </p>
      </aside>
      <button className="primary-button justify-center self-end px-7 py-4 mt-14 text-lg font-semibold text-black bg-emerald-200 rounded-xl border-black border-solid border-[3px] max-md:px-5 max-md:mt-10 max-md:mr-2.5">
        Approve 200.000 $ERA
      </button>
    </main>
  );
};

export default Stacking;
