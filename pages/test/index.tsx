import { useReadContract } from "wagmi";
import Header from "../../components/ui/Header";
import {
  contractABI,
  contractAddress,
  stakingTokenABI,
  stakingTokenAddress,
} from "../../lib/blockchain-config";

export default function TestPage() {
  const { data: owner, error } = useReadContract({
    abi: contractABI,
    address: contractAddress,
    functionName: "owner",
  });

  console.log("Owner: ", owner);
  console.log("Error: ", error);

  return (
    <>
      <Header />
      <div className="container mx-auto">
        <h1>Test Page</h1>
        <h1>Owner : {owner?.toString()}</h1>
        {error && <p>Error: {error.message}</p>}
      </div>
    </>
  );
}
