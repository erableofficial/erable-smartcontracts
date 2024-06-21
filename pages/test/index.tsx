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
import StakeInfo from "../../components/test/stakeInfo";
import DepositRewardPoolForm from "../../components/test/depositRewardPoolForm";
import WidthdrawTokensForm from "../../components/test/widthdrawTokensForm";
import ApproveAddressForm from "../../components/test/approveAddressForm";
import TransferTokensForm from "../../components/test/transferTokensForm";
import StakeForm from "../../components/test/stakeForm";
import StakeControlSection from "../../components/test/StakeControlSection";

export default function TestPage() {
  // getting current address from metamask using rainbowkit
  const account = useAccount();

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

  const { data: userStakesCounter, error: userStakesCounterError } =
    useReadContract({
      abi: contractABI,
      address: contractAddress,
      functionName: "userStakeCounter",
      args: [account.address],
    });

  const { data: stakedDuration, error: stakedDurationError } = useReadContract({
    abi: contractABI,
    address: contractAddress,
    functionName: "stakingDuration",
    args: [],
  });

  const { data: coolDownPeriod, error: coolDownPeriodError } = useReadContract({
    abi: contractABI,
    address: contractAddress,
    functionName: "cooldownPeriod",
    args: [],
  });

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

        {account.address === owner ? (
          <div>
            <h1 className="text-3xl font-medium text-center uppercase text-primary">
              You are the owner
            </h1>
          </div>
        ) : account.address ? (
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
          <div className=" flex items-center justify-center  p-2 mt-4">
            <h1 className=" text-3xl font-medium py-4 text-center capitalize text-primary">
              Please connect your wallet to see your balance
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

        <div className="flex gap-3">
          <h1>Staked Duration : </h1>

          {stakedDuration
            ? stakedDuration.toString() + "  secondes"
            : "0 secondes"}
          {stakedDurationError && <p>Error: {stakedDurationError.message}</p>}
        </div>

        {account.address && (
          <div>
            <h1>
              Last User Stake ID :
              {userStakesCounter ? userStakesCounter.toString() : "0"}
            </h1>
            {userStakesCounterError && (
              <p>Error: {userStakesCounterError.message}</p>
            )}
          </div>
        )}

        {account.address === owner && (
          <>
            <div>
              <StakeControlSection />
            </div>
            <div>
              <h2 className="text-3xl text-center"> Owner Actions </h2>

              <DepositRewardPoolForm />
              <WidthdrawTokensForm />
              <TransferTokensForm />
              <UpdateStakeDurationForm />
            </div>
          </>
        )}

        <h2 className="mt-8 text-3xl text-center">Users Actions</h2>

        <ApproveAddressForm />
        <StakeForm />

        {account.address && (
          <div>
            <h2 className="mt-8 text-3xl text-center">User Stakes </h2>

            <div className="flex items-center justify-around flex-wrap w-full gap-5  bg-surface-primary pt-10 rounded-lg my-8 ">
              {Number(userStakesCounter?.toString()) > 0 &&
                Array.from(
                  { length: Number(userStakesCounter?.toString()) },
                  (_, i) => i
                ).map((i) => {
                  return (
                    <StakeInfo
                      stakeId={i}
                      cooldownPeriod={coolDownPeriod?.toString()}
                      key={i.toString()}
                    />
                  );
                })}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
