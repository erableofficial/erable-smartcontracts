import {
  useAccount,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { contractABI, contractAddress } from "../../lib/blockchain-config";
import { toast } from "react-toastify";
import { useEffect } from "react";

export default function WhiteListSection() {
  const account = useAccount();

  const { data: isWhiteListEnabled, error } = useReadContract({
    abi: contractABI,
    address: contractAddress,
    functionName: "whitelistEnabled",
    args: [],
  });

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
      toast.success("Transaction confirmed.");
    }
  }, [isConfirmed]);

  // error
  useEffect(() => {
    if (writeError) {
      toast.error("Something went wrong.");
      console.error(writeError);
    }
  }, [writeError]);

  // hash
  useEffect(() => {
    if (hash) {
      console.info("Transaction Hash: ", hash);
      toast.info("Waiting for confirmation...", {
        autoClose: 1000,
      });
    }
  }, [hash]);

  const handleEnableWhiteList = async () => {
    writeContract({
      abi: contractABI,
      address: contractAddress,
      functionName: "enableWhitelist",
      args: [],
    });
  };

  const handleDisableWhiteList = async () => {
    writeContract({
      abi: contractABI,
      address: contractAddress,
      functionName: "disableWhitelist",
      args: [],
    });
  };

  return (
    <div className="flex justify-center items-center bg-surface-primary max-w-[60%] mx-auto my-4 py-4 rounded-xl ">
      <div className="flex flex-col items-center">
        <h1 className="text-3xl text-center">WhiteListEnabling Control</h1>
        <div className="flex flex-col items-center py-4">
          <div className="flex justify-center gap-5 items-center">
            <p className="capitalize text-center text-gray-800 font-friends font-bold text-xl tracking-wide ">
              {isWhiteListEnabled
                ? "whiteList is enabled"
                : "whiteList is disabled"}
            </p>
          </div>
          <button
            onClick={
              isWhiteListEnabled
                ? handleDisableWhiteList
                : handleEnableWhiteList
            }
            className="secondary-button mt-4"
          >
            {isWhiteListEnabled ? "Disable" : "Enable"}
          </button>
        </div>
      </div>
    </div>
  );
}
