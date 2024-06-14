import { useReadContract, useSendTransaction, useWriteContract } from "wagmi";
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
    data: writeData,
    error: writeError,
    isSuccess: isWriteSucess,
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

  const handleTransferTokenToContract = async (
    amount: number,
    toAddr: string
  ) => {
    // called only by the owner
    if (account.address !== owner) {
      alert("You are not the owner");
      return;
    }
    console.log("Transfering tokens to contract...");
    // transfer tokens to contract
    const tx = writeContract({
      abi: stakingTokenABI,
      address: stakingTokenAddress,
      functionName: "transfer",
      args: [toAddr, parseEther(amount.toString())],
    });

    console.log("Transaction sent: ", tx);

    // check for transaction success
    if (isWriteSucess) {
      console.log("Transaction successful");
      console.log("Transaction data: ", writeData);
    } else {
      console.log("Transaction failed: ", writeError);
    }
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

        <div className="mt-10 flex justify-center items-center gap-2">
          <button
            onClick={() => {
              handleTransferTokenToContract(
                10,
                "0x3f1c319e566b30e1d4ea31f7ad0a75a331e4ed9a"
              );
            }}
            className="primary-button"
          >
            Transfer 10 tokens to addr2
          </button>
        </div>
      </div>
    </>
  );
}
