import { useEffect, useState } from "react";
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
import { toast } from "react-toastify";

export default function UpdateStakeDurationForm() {
  const [stakeDuration, setStakeDuration] = useState(0);
  const account = useAccount();
  const { writeContract, data: hash, error, isPending } = useWriteContract();

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
    if (error) {
      toast.error("Something went wrong.");
      console.error(error);
    }
  }, [error]);

  // hash
  useEffect(() => {
    if (hash) {
      console.info("Transaction Hash: ", hash);
      toast.info("Waiting for confirmation...", {
        autoClose: 1000,
      });
    }
  }, [hash]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStakeDuration(Number(event.target.value));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Handle form submission here
   
    writeContract({
      address: contractAddress,
      abi: contractABI,
      functionName: "updateStakingDuration",
      args: [stakeDuration.toString()],
    });
  
  };

  return (
    <div className="flex items-center justify-center my-8 bg-surface-primary py-4 rounded-xl max-w-[60%] mx-auto ">
      <div className="min-w-[60%] mx-auto">
        <h2 className="capitalize text-2xl tracking-wide font-friends font-bold text-gray-800 text-center pb-4  ">
          Update stake duration Form
        </h2>
        <form
          className="gap-5 items-center flex flex-col space-y-2  "
          onSubmit={handleSubmit}
        >
          <div className="w-full ">
            <label
              className="text-xl tracking-wide font-friends font-medium"
              htmlFor="stakeDuration"
            >
              Duration(sec) :
            </label>
            <input
              type="number"
              name="stakeDuration"
              id="stakeDuration"
              placeholder="100"
              className="p-3 ml-2 border rounded w-[60%] "
              value={stakeDuration}
              onChange={handleChange}
            />
          </div>

          <button
            disabled={isPending}
            type="submit"
            className="secondary-button"
          >
            {isPending ? "Confirming..." : "Update"}
          </button>

          {/* {error && <p>Error: {error.message}</p>} */}
          {/* {hash && <p>Hash: {hash}</p>} */}
        </form>
      </div>
    </div>
  );
}

{
  /* <form
      className="flex items-center justify-center gap-6 my-8"
      onSubmit={handleSubmit}
    >
      <label className="text-xl font-medium">
        Stake Duration (days):
        <input
          type="number"
          name="stakeDuration"
          value={stakeDuration}
          onChange={handleChange}
          className="p-4 ml-2 border rounded"
        />
      </label>
      <button className="secondary-button" type="submit">
        Update
      </button>
    </form> */
}
