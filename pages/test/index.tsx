import {
  useReadContract,
  useSendTransaction,
  useWriteContract,
  useWaitForTransactionReceipt,
  useAccount,
} from "wagmi";
import Header from "../../components/ui/Header";
import {
  contractABI,
  contractAddress,
  stakingTokenABI,
  stakingTokenAddress,
} from "../../lib/blockchain-config";
import { formatEther, parseEther } from "viem";
import StakeButton from "../../components/test/stakeButton";

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

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

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
          <h1>
            Owner Balance :
            {ownerBalance
              ? formatEther(BigInt(ownerBalance.toString())) + " ST"
              : "0 ST"}
          </h1>
          {ownerBalanceError && <p>Error: {ownerBalanceError.message}</p>}
        </div>

        {account.address !== owner ? (
          <div>
            <h1>
              My Balance :{" "}
              {myBalance
                ? formatEther(BigInt(myBalance.toString())) + " ST"
                : "0 ST"}
            </h1>
            {myBalanceError && <p>Error: {myBalanceError.message}</p>}
          </div>
        ) : (
          <div>
            <h1 className="text-3xl font-medium text-center uppercase text-primary">
              You are the owner
            </h1>
          </div>
        )}

        <div>
          <h1>
            Staked Tokens : {}
          </h1>
        </div>

        <div className="flex items-center justify-center gap-2 mt-10">
          <div>
            <button
              disabled={isPending}
              onClick={() => {
                handleTransferTokenToAddr(
                  50,
                  "0x1556A67c507840c20BD981105B8C461C618aC3CA"
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

          <StakeButton />
        </div>
      </div>
    </>
  );
}
