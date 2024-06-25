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
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import CustomToast from "../dashboard/CustomToast";
import { Check, Info } from "lucide-react";

export default function ApproveAddressForm() {
  const [amount, setAmount] = useState(0);

  const { writeContract, data: hash, error, isPending } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  useEffect(() => {
    if (isConfirmed) {
      setAmount(100);
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    writeContract({
      abi: stakingTokenABI,
      address: stakingTokenAddress,
      functionName: "approve",
      args: [contractAddress, parseEther(amount.toString())],
    });
  };

  return (
    <div className="flex items-center justify-center my-8 bg-surface-primary py-4 rounded-xl max-w-[60%] mx-auto ">
      <div className="min-w-[60%] mx-auto">
        <h2 className="text-2xl tracking-wide font-friends font-bold text-gray-800 text-center pb-4  ">
          Approve ST Tokens Form
        </h2>
        <form
          className="gap-5 items-center flex flex-col space-y-2  "
          onSubmit={handleSubmit}
        >
          <div className="w-full">
            <label
              className="text-xl tracking-wide font-friends font-medium"
              htmlFor="amount"
            >
              Amount :
            </label>
            <input
              type="number"
              name="amount"
              id="amount"
              placeholder="100"
              className="p-3 ml-2 border rounded w-[70%] "
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
            />
          </div>

          <button
            disabled={isPending}
            type="submit"
            className="secondary-button"
          >
            {isPending ? "Confirming..." : "Approve ST Tokens"}
          </button>

          {/* {error && <p>Error: {error.message}</p>} */}
          {/* {hash && <p>Hash: {hash}</p>} */}
        </form>
      </div>
    </div>
  );
}
