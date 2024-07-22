import React from "react";
import { IAirdropCycleInfo } from "../../../lib/types";

interface IAirdropCycleInfoProps {
  cycle: IAirdropCycleInfo;
}

const AirdropCycleInfo: React.FC<IAirdropCycleInfoProps> = ({ cycle }) => {
  return (
    <div
      className="card mb-5 flex justify-around items-center  
  border-2 border-primary bg-surface-500 p-5  rounded-lg shadow-lg"
    >
      <div className="space-y-4 flex flex-col">
        <div className="flex items-center gap-2 text-xl font-medium font-friends">
          <p className=" capitalize ">merkleRoot:</p>
          <p>{cycle.merkleRoot}</p>
        </div>
        <div className="flex items-center gap-2 text-xl font-medium font-friends">
          <p className=" capitalize ">isActive:</p>
          <p>{cycle.isActive.toString()}</p>
        </div>
      </div>
    </div>
  );
};

export default AirdropCycleInfo;

{
  /* AirdropCycleInfo.tsx */
}
