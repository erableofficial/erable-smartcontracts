import { Info } from "lucide-react";

export default function NoAirdropUtilities() {
  return (
    <div className="flex items-center justify-center">
      <div className="p-6 rounded-3xl border border-solid bg-stone-50 border-stone-300 ">
        <div className="bg-[#FFEDD5] py-1 px-[9px] rounded flex jitems-center gap-2">
          <Info className="w-5 h-5" />
          <p className="font-NeueHaas font-medium text-lg leading-[21.6px] text-neutral-700 ">
            You have not received any airdrop yet
          </p>
        </div>
      </div>
    </div>
  );
}
