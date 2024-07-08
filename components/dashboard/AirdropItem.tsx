import React, { useEffect } from "react";
import { TabItem } from "../../lib/types";
import { Check, Info, TriangleAlert } from "lucide-react";
import {
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import {
  airdropContractABI,
  airdropContractAddress,
  contractABI,
  contractAddress,
} from "../../lib/blockchain-config";
import { toast } from "react-toastify";
import CustomToast from "./CustomToast";
import { encodePacked, formatEther, keccak256, parseEther } from "viem";
import WithdrawTokenCdModal from "./WithdrawTokenCdModal";
import Tooltip from "./Tooltip";
import { calculateTotalWithdraw } from "../../lib/utils";
import { useStakingContractData } from "../../context/stakingContractData";
import EndStackingModal from "./EndStackingModal";
import ClaimAirdropModal from "./ClaimAirdropModal";
import MerkleTree from "merkletreejs";
import { useAirdropCycles } from "../../context/airdropCycles";
import { useCurrentUser } from "../../context/currentUser";

interface AirdropItemProps {
  airdrop: TabItem;
  index: number;
  itemsCounter: number;
  setTransactionSuccess: React.Dispatch<React.SetStateAction<boolean>>;
}

const AirdropItem: React.FC<AirdropItemProps> = ({
  airdrop,
  index,
  itemsCounter,
  setTransactionSuccess,
}) => {
  const { currentUser, setCurrentUser } = useCurrentUser();
  const { airdropCycles, setAirdropCycles } = useAirdropCycles();
  const [toggleClaimAirdropModal, setToggleClaimAirdropModal] =
    React.useState<boolean>(false);
  const [itemId, setItemId] = React.useState<number>(0);
  const [currentRewards, setCurrentRewards] = React.useState<bigint>(BigInt(0));
  const { stakingContractData } = useStakingContractData();
  const {
    yieldConstant,
    monthlyIncreasePercentage,
    startingSlashingPoint,
    stakingDuration,
  } = stakingContractData;

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

  useEffect(() => {
    if (isConfirmed) {
      toast.success(
        <CustomToast
          title="Transaction confirmed."
          message="When you do something noble and beautiful and nobody noticed, do not be
        sad. For the sun every morning is a beautiful spectacle and yet most of
        the audience still sleeps."
        />,
        {
          theme: "colored",
          icon: <Check width={21} height={21} size={32} color="#21725E" />,
        }
      );
      setTransactionSuccess(true);
      setToggleClaimAirdropModal(false);
    }
  }, [isConfirmed]);

  // error
  useEffect(() => {
    if (writeError) {
      toast.error(
        <CustomToast
          title={writeError.name || "Something went wrong"}
          message={writeError.message}
        />,
        {
          // icon: <Info />,
          // autoClose: 5000000,
          theme: "colored",
          icon: (
            <TriangleAlert width={21} height={21} size={32} color="#B91C1C" />
          ),
        }
      );
      console.error(writeError);
    }
  }, [writeError]);

  // hash
  useEffect(() => {
    if (hash) {
      console.info("Transaction Hash: ", hash);
      toast.info(
        <CustomToast
          title="Waiting for confirmation..."
          message="When you do something noble and beautiful and nobody noticed, do not be
        sad. For the sun every morning is a beautiful spectacle and yet most of
        the audience still sleeps."
        />,
        {
          // icon: <Info />,
          // autoClose: 5000000,
          theme: "colored",
          icon: <Info width={21} height={21} size={32} color="#0000" />,
        }
      );
    }
  }, [hash]);

  const handleClaim = async () => {
    if (!currentUser.address) {
      toast.error("Please connect your wallet to claim airdrop.");
      return;
    }

    if (!airdrop.amount || typeof airdrop.airdropCycleIndex === undefined) {
      toast.error("Invalid airdrop data.");
      console.error("Invalid airdrop data.");
      console.log("Airdrop: ", airdrop);
      return;
    }

    // console.log("Airdrop from blockchain : ", airdropCyclesFromBlockchain);

    // get all airdrops from context that cycle === airdrop.airdropCycleIndex and remove cycle fiedl from them then create a merkle tree
    const airdrops = airdropCycles.filter(
      (airCycle: any) => Number(airCycle.cycle) === airdrop.airdropCycleIndex
    );

    console.log("airdrops: ", airdrops);
    // console.log("airdrops from blockchain: ", airdropCyclesFromBlockchain);

    const sortedAirdrops = airdrops.sort((a, b) => {
      if (a.address < b.address) return -1;
      if (a.address > b.address) return 1;
      return 0;
    });

    console.log("sorted airdrops: ", sortedAirdrops);

    const leaves = sortedAirdrops.map((aird) => {
      const amountWei = parseEther(Number(aird.amount).toString());

      return keccak256(
        encodePacked(["address", "uint256"], [aird.address, amountWei])
      );
    });

    console.log("leaves: ", leaves);

    const merkleTree = new MerkleTree(leaves, keccak256, { sortPairs: true });

    const root = merkleTree.getHexRoot();
    console.log("root: ", root);

    const amountWei = parseEther(Number(airdrop.amount).toString());

    const proof = merkleTree.getHexProof(
      keccak256(
        encodePacked(["address", "uint256"], [currentUser.address, amountWei])
      )
    );

    console.log("proof: ", proof);

    writeContract({
      abi: airdropContractABI,
      address: airdropContractAddress,
      functionName: "claimTokens",
      args: [BigInt(airdrop.airdropCycleIndex || 0), amountWei, proof],
    });
  };

  return (
    <React.Fragment>
      <ClaimAirdropModal
        toggleClaimAirdropModal={toggleClaimAirdropModal}
        setToggleClaimAirdropModal={setToggleClaimAirdropModal}
        handleClaimAirdrop={handleClaim}
        airdrop={airdrop}
      />
      <div className="flex gap-0 items-center mt-5 max-md:flex-wrap max-md:max-w-full max-sm:mt-4">
        <div className="flex flex-col flex-1 justify-center items-start self-stretch p-2.5 my-auto text-base font-medium text-black whitespace-nowrap max-md:pr-5">
          <div className="justify-center px-4 py-2 bg-surface-500 border-2 border-black border-solid rounded-[38px]">
            {airdrop.type}
          </div>
        </div>
        <div className="flex-1 justify-center items-start self-stretch p-2.5 my-auto text-lg font-medium whitespace-nowrap text-neutral-700 max-md:pr-5">
          {airdrop.startTime}
        </div>
        <div className="flex-1 justify-center items-start self-stretch p-2.5 my-auto text-lg font-medium whitespace-nowrap text-neutral-700 max-md:pr-5">
          {Number(airdrop.amount)}
        </div>
        <div className="flex-1 justify-center items-start self-stretch p-2.5 my-auto text-lg font-medium whitespace-nowrap text-neutral-700 max-md:pr-5 min-w-[222px]">
          --
        </div>
        <div className="flex-1 justify-center items-start self-stretch p-2.5 my-auto text-lg font-medium text-neutral-700 max-md:pr-5 max-w-[171px]">
          {airdrop.endTime}
        </div>
        <div className="flex flex-col self-stretch px-2.5 min-w-[150px]">
          <button
            disabled={airdrop.action === "Claimed"}
            onClick={() => {
              setToggleClaimAirdropModal(true);
            }}
            className={`justify-center px-5 py-3 mt-2 text-base font-semibold whitespace-nowrap rounded-lg border-2 border-solid ${
              airdrop.action === "Claimed"
                ? "border-stone-300 text-stone-300"
                : "bg-surface-primary border-black text-black"
            } `}
          >
            {airdrop.action}
          </button>
        </div>
      </div>
      {index < itemsCounter && (
        <hr className="shrink-0 mt-5 h-px border border-solid bg-stone-300 border-stone-300 max-md:max-w-full" />
      )}
    </React.Fragment>
  );
};

export default AirdropItem;
