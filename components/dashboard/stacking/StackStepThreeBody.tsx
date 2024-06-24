import { Info, Sparkles } from "lucide-react";
import Link from "next/link";
import * as React from "react";

type InfoItemProps = {
  label: string;
  value: string;
};

const InfoItem: React.FC<InfoItemProps> = ({ label, value }) => (
  <div className="flex flex-col self-stretch my-auto font-medium">
    <div className="flex gap-1 items-center text-base text-neutral-500">
      <div>{label}</div>
      <Info width={10} height={10} color="#7C7C7C" />
    </div>
    <div className="mt-6 text-lg text-black">{value}</div>
  </div>
);

const StackStepThreeBody: React.FC = () => {
  const infoItems: InfoItemProps[] = [
    { label: "Start Date", value: "JJ/MM/AAAA" },
    { label: "Amount", value: "XXX,XXX.XXX" },
    { label: "Current Rewards", value: "XXX,XXX.XXX" },
    { label: "End date", value: "JJ/MM/AAAA" },
  ];

  return (
    <div className=" mt-14 mx-auto flex flex-col items-center p-10 bg-white rounded-3xl border border-solid border-stone-300 max-w-[977px] max-md:px-5">
      <div className="flex justify-center items-center px-3 bg-yellow-200 h-[45px] rounded-[37.5px] w-[45px]">
        <Sparkles width={24} height={24} color="#000000" />
      </div>
      <h1 className="mt-6 text-5xl font-semibold text-black">
        10.000 $ERA staked
      </h1>
      <p className="mt-6 text-lg font-medium text-center text-black w-[572px] max-md:max-w-full">
        Lorem ipsum dolor sit amet consectetur. Sed consectetur erat feugiat
        felis pharetra mauris neque id
      </p>
      <section className="flex gap-5 justify-between items-center self-stretch px-4 py-2.5 mt-10 rounded-xl border border-solid bg-zinc-50 border-stone-300 max-md:flex-wrap max-md:pl-5 max-md:max-w-full">
        <div className="flex flex-col justify-between self-stretch my-auto text-base font-medium whitespace-nowrap">
          <div className="flex gap-1  pr-1.5 items-center text-neutral-500">
            <div>Type</div>
            <Info width={10} height={10} color="#7C7C7C" />
          </div>
          <div className="justify-center px-3 py-1.5 mt-3 text-black bg-yellow-200 rounded-3xl border border-black border-solid">
            Staking
          </div>
        </div>
        {infoItems.map((item, index) => (
          <InfoItem key={index} {...item} />
        ))}
        <div className="flex flex-col justify-between self-stretch p-2 text-base">
          <div className="flex gap-1 items-center  pr-1.5 font-medium whitespace-nowrap text-neutral-500">
            <div>Action</div>
            <Info width={10} height={10} color="#7C7C7C" />
          </div>
          <button className="justify-center px-3.5 py-2.5 mt-2 font-semibold text-black bg-white rounded-md border border-black border-solid">
            Unstake
          </button>
        </div>
      </section>
      <div className="flex gap-5 justify-center mt-10 text-lg font-semibold text-black">
        <button className="secondary-button">Join our community</button>
        <Link className="primary-button" href={"/dashboard"}>
          View my staking
        </Link>
      </div>
    </div>
  );
};

export default StackStepThreeBody;
