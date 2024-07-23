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
import WhiteListSection from "../../components/test/whiteListSection";
import AddToWhiteListForm from "../../components/test/addToWhiteListForm";
import CreateAirdropCycle from "../../components/test/aridrop/CreateAirdropCycle";
import CreateAirdropCycleFromJson from "../../components/test/aridrop/CreateAirdropCycleFromJson";
import AirdropCycles from "../../components/test/aridrop/AirdropCycles";
import Header from "../../components/ui/Header";

export default function TestPage() {
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
        <h1 className="text-3xl font-medium text-center my-5">Admin Page</h1>
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

        <div className="flex gap-3">
          <h1>Staking Duration : </h1>

          {stakedDuration
            ? stakedDuration.toString() + "  secondes"
            : "0 secondes"}
          {stakedDurationError && <p>Error: {stakedDurationError.message}</p>}
        </div>
        <div className="flex gap-3">
          <h1>CoolDown Period : </h1>

          {coolDownPeriod
            ? coolDownPeriod.toString() + "  secondes"
            : "0 secondes"}
          {coolDownPeriodError && <p>Error: {coolDownPeriodError.message}</p>}
        </div>

        {!account.address && (
          <div className=" flex items-center justify-center  p-2 mt-4">
            <h1 className=" text-3xl font-medium py-4 text-center capitalize text-primary">
              Please connect your admin wallet
            </h1>
          </div>
        )}

        {account.address && account.address !== owner && (
          <div className="text-5xl uppercase text-center font-medium my-10">
            You are not the owner
          </div>
        )}

        {account.address === owner && (
          <>
            <div>
              <h2 className="text-3xl text-center"> Owner Actions </h2>
              <ApproveAddressForm />
              <StakeControlSection />
              <WhiteListSection />
              <AddToWhiteListForm />
              <DepositRewardPoolForm />
              <WidthdrawTokensForm />
              <TransferTokensForm />
              <UpdateStakeDurationForm />
            </div>
            <div>
              <h2 className="text-3xl text-center"> Airdrop Owner Actions </h2>
              <CreateAirdropCycleFromJson />
            </div>
          </>
        )}
      </div>
    </>
  );
}
