


import {
    useReadContract,
    useSendTransaction,
    useWriteContract,
    useWaitForTransactionReceipt,
    useAccount,
  } from "wagmi";
  import {
    contractABI,
    contractAddress,
    stakingTokenABI,
    stakingTokenAddress,
  } from "../../lib/blockchain-config";
  import { parseEther } from "viem";
  
  export default function ClaimButton({ stakeId }: { stakeId: number }) {
    const account = useAccount();
    const {
      writeContract,
      data: hash,
      error: writeError,
      isPending,
    } = useWriteContract();
  
    const { isLoading: isConfirming, isSuccess: isConfirmed } =
      useWaitForTransactionReceipt({
        hash,
      });
  
    const handleClaim = async (stakeId: number) => {
      writeContract({
        abi: contractABI,
        address: contractAddress,
        functionName: "claim",
        args: [stakeId],
      });
    };
    return (
      <div>
        <button
          disabled={isPending}
          onClick={() => {
            handleClaim(stakeId);
            console.log("Claiming");
          }}
          className="primary-button"
        >
          {isPending ? "Confirming..." : "Claim"}
        </button>
        {writeError && <p>Error: {writeError.message}</p>}
        {hash && <p>Hash: {hash}</p>}
        {isConfirming && <div>Waiting for confirmation...</div>}
        {isConfirmed && <div>Transaction confirmed.</div>}
      </div>
    );
  }
  