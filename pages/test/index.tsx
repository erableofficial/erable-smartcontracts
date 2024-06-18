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
import ApproveAddressButton from "../../components/test/approveAddressButton";
import AddToWaitlistButton from "../../components/test/addToWaitlistButton";
import DisableWhiteListButton from "../../components/test/disableWhiteListButton";
import UpdateStakeDurationForm from "../../components/test/updateStakeDurationForm";
import UnstackButton from "../../components/test/unstackButton";
import DepositRewardPoolButton from "../../components/test/depositRewardPoolButton";

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

  const { data: stakedTokens, error: stakedTokensError } = useReadContract({
    abi: contractABI,
    address: contractAddress,
    functionName: "getTotalStakedForUser",
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
            Staked Tokens :{" "}
            {stakedTokens
              ? formatEther(BigInt(stakedTokens.toString())) + " ST"
              : "0 ST"}
          </h1>
        </div>

        {account.address === owner && (
          <>
            <h2 className="text-3xl text-center"> Owner Actions </h2>
            <div className="flex items-center justify-center gap-2 mt-10">
              <div>
                <button
                  disabled={isPending}
                  onClick={() => {
                    handleTransferTokenToAddr(
                      10,
                      "0xf97184f71561ca97113329c4FbCb1079c869D702"
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
              <DepositRewardPoolButton />
              <AddToWaitlistButton />
              <DisableWhiteListButton />
            </div>

            <div>
              <UpdateStakeDurationForm />
            </div>
          </>
        )}

        <h2 className="mt-8 text-3xl text-center">Users Actions</h2>

        <div className="flex items-center justify-center gap-2 mt-10">
          <ApproveAddressButton />
          <StakeButton />
          <UnstackButton />
        </div>
      </div>
    </>
  );
}
