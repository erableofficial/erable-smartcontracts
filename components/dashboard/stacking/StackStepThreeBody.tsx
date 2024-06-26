import { Check, Info, Sparkles, TriangleAlert } from "lucide-react";
import Link from "next/link";
import * as React from "react";

type StackStepThreeBodyProps = {
  amount: number;
};

const StackStepThreeBody: React.FC<StackStepThreeBodyProps> = ({
  amount
}) => {
  return (
    <div className=" mt-14 mx-auto flex flex-col items-center p-10 bg-white rounded-3xl border border-solid border-stone-300 max-w-[977px] max-md:px-5">
      <div className="flex justify-center items-center px-3 bg-yellow-200 h-[45px] rounded-[37.5px] w-[45px]">
        <Sparkles width={24} height={24} color="#000000" />
      </div>
      <h1 className="mt-6 text-5xl font-semibold text-neutral-700">
        {amount} $ERA staked
      </h1>
      <p className="mt-6 text-lg font-medium text-center text-neutral-700 max-w-[572px] max-md:max-w-full">
        Lorem ipsum dolor sit amet consectetur. Sed consectetur erat feugiat
        felis pharetra mauris neque id
      </p>

      <div className="flex gap-5 justify-center mt-10 text-lg font-semibold text-neutral-700">
        <button className="secondary-button">Join our community</button>
        <Link className="primary-button" href={"/dashboard"}>
          View my staking
        </Link>
      </div>
    </div>
  );
};

export default StackStepThreeBody;
