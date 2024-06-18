import {
  useReadContract,
  useSendTransaction,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import Header from "../../components/ui/Header";
import {
  contractABI,
  contractAddress,
  stakingTokenABI,
  stakingTokenAddress,
} from "../../lib/blockchain-config";
import { useAccount } from "wagmi";
import { parseEther } from "viem";

export default function TestPage() {
  // getting current address from metamask using rainbowkit
  const account = useAccount();
  const {
    writeContract,
    data: hash,
    error: writeError,
    isPending,
  } = useWriteContract();

  const { data: owner, error } = useReadContract({
    abi: contractABI,
    address: contractAddress,
    functionName: "owner",
  });

  const { data: ownerBalance, error: ownerBalanceError } = useReadContract({
    abi: stakingTokenABI,
    address: stakingTokenAddress,
    functionName: "balanceOf",
    args: [owner],
  });

  const { data: myBalance, error: myBalanceError } = useReadContract({
    abi: stakingTokenABI,
    address: stakingTokenAddress,
    functionName: "balanceOf",
    args: [account.address],
  });

  // total stacked tokens
  const { data: totalStackedTokens, error: totalStackedTokensError } =
    useReadContract({
      abi: contractABI,
      address: contractAddress,
      functionName: "totalStaked",
    });

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  const handleStakeTokens = async (amount: number) => {
    console.log("Stacking tokens...");
    // stack tokens
    writeContract({
      abi: contractABI,
      address: contractAddress,
      functionName: "stake",
      args: [parseEther(amount.toString())],
    });
  };

  const handleTransferTokenToAddr = async (amount: number, toAddr: string) => {
    // called only by the owner
    if (account.address !== owner) {
      alert("You are not the owner");
      return;
    }
    console.log("Transfering tokens to contract...");
    // transfer tokens to contract
    writeContract({
      abi: stakingTokenABI,
      address: stakingTokenAddress,
      functionName: "transfer",
      args: [toAddr, parseEther(amount.toString())],
    });
  };

  return (
    <>
      <Header />
      <div className="container mx-auto">
        <h1>Test Page</h1>
        <h1>Owner : {owner?.toString()}</h1>
        {error && <p>Error: {error.message}</p>}

        <div>
          <h1>Owner Balance : {ownerBalance?.toString()}</h1>
          {ownerBalanceError && <p>Error: {ownerBalanceError.message}</p>}
        </div>

        {account.address !== owner ? (
          <div>
            <h1>My Balance : {myBalance?.toString()}</h1>
            {myBalanceError && <p>Error: {myBalanceError.message}</p>}
          </div>
        ) : (
          <div>
            <h1 className="font-medium text-3xl uppercase text-primary text-center">
              You are the owner
            </h1>
          </div>
        )}

        <div>
          <h1>Total Stacked Tokens : {totalStackedTokens?.toString()}</h1>
          {totalStackedTokensError && (
            <p>Error: {totalStackedTokensError.message}</p>
          )}
        </div>
        <div>
          <div className="mt-10 flex justify-center items-center gap-2">
            <div>
              <button
                disabled={isPending}
                onClick={() => {
                  handleStakeTokens(1);
                }}
                className="primary-button"
              >
                {isPending ? "Confirming..." : "Stake 1 token"}
              </button>
              {writeError && <p>Error: {writeError.message}</p>}
              {hash && <p>Hash: {hash}</p>}
              {isConfirming && <div>Waiting for confirmation...</div>}
              {isConfirmed && <div>Transaction confirmed.</div>}
            </div>
          </div>
        </div>

        <div className="mt-10 flex justify-center items-center gap-2">
          <div>
            <button
              disabled={isPending}
              onClick={() => {
                handleTransferTokenToAddr(
                  10,
                  "0x3f1c319e566b30e1d4ea31f7ad0a75a331e4ed9a"
                );
              }}
              className="primary-button"
            >
              {isPending ? "Confirming..." : "Transfer 10 tokens to addr2"}
            </button>
            {writeError && <p>Error: {writeError.message}</p>}
            {hash && <p>Hash: {hash}</p>}
            {isConfirming && <div>Waiting for confirmation...</div>}
            {isConfirmed && <div>Transaction confirmed.</div>}
          </div>
        </div>
      </div>
    </>
  );
}
