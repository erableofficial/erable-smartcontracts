import { useReadContract } from "wagmi";
import {
  airdropContractABI,
  airdropContractAddress,
} from "../../../lib/blockchain-config";
import AirdropCycleInfo from "./AirdropCycleInfo";
import { IAirdropCycleInfo } from "../../../lib/types";

export default function AirdropCycles() {
  const { data, error: airdropCyclesError } = useReadContract({
    abi: airdropContractABI,
    address: airdropContractAddress,
    functionName: "getAllAirdropCycles",
    args: [],
  });


  const airdropCycles = data as IAirdropCycleInfo[];

  return (
    <div>
      <h2 className="mt-8 text-3xl text-center">All Airdrop Cycles </h2>
      <div className="flex items-center justify-around flex-wrap w-full gap-5  bg-surface-primary pt-10 rounded-lg my-8">
        {airdropCycles?.map((cycle, index) => (
          <AirdropCycleInfo key={index} cycle={cycle} />
        ))}
      </div>
    </div>
  );
}
