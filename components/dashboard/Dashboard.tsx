import React, { useState, useRef, useEffect } from "react";
import { useAccount, useReadContract } from "wagmi";
import ConnectWalletModal from "./ConnectWalletModal";
import {
  ArrowUpRight,
  ChevronDown,
  ChevronUp,
  TriangleAlert,
} from "lucide-react";
import BuySeraModal from "../ui/BuySeraModal";
import OfficialLinks from "./OfficialLinks";
import TabContent from "./TabContent";
import Link from "next/link";
import {
  contractABI,
  contractAddress,
  stakingTokenABI,
  stakingTokenAddress,
} from "../../lib/blockchain-config";
import { StakeInfo, TabItem } from "../../lib/types";
import NoUtilities from "./NoUtilities";
import {
  getTotalStaked,
  getTotalStakedForUser,
  getUserBalance,
  getUserStakes,
} from "../../lib/utils";
import CardsSection from "./CardsSection";
import { useStakingContractData } from "../../context/stakingContractData";
import EndStackingModal from "./EndStackingModal";

interface DashboardProps {}

const Dashboard: React.FC<DashboardProps> = () => {
  const { stakingContractData, setStakingContractData } =
    useStakingContractData();
  const [selected, setSelected] = useState<string>("All");
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const toggleButtonRef = useRef<HTMLButtonElement | null>(null);
  const [toggleBuyEraModal, setToggleBuyEraModal] =
    React.useState<boolean>(false);
  const [toggleEndStackingModal, setToggleEndStackingModal] =
    useState<boolean>(true);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const [allItems, setAllItems] = useState<Array<TabItem>>([]);
  const [farmingItems, setFarmingItems] = useState<Array<TabItem>>([]);
  const [airdropItems, setAirdropItems] = useState<Array<TabItem>>([]);
  const [stakingItems, setStakingItems] = useState<Array<TabItem>>([]);
  const [transactionSuccess, setTransactionSuccess] = useState<boolean>(false);
  const [myBalance, setMyBalance] = useState<bigint>(BigInt(0));

  const [totalStaked, setTotalStaked] = useState<bigint>(BigInt(0));
  const [userStakingBalance, setUserStakingBalance] = React.useState<bigint>(
    BigInt(0)
  );
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        toggleButtonRef.current &&
        !toggleButtonRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const { isConnected, address: currentAddress } = useAccount();

  const { data: stakingDuration, error: stakingDurationError } =
    useReadContract({
      abi: contractABI,
      address: contractAddress,
      functionName: "stakingDuration",
      args: [],
    });

  const {
    data: yieldConstant,
    error: yieldConstantError,
    isLoading: yieldConstantLoading,
  } = useReadContract({
    abi: contractABI,
    address: contractAddress,
    functionName: "yieldConstant",
  });

  const {
    data: monthlyIncreasePercentage,
    error: monthlyIncreasePercentageError,
    isLoading: monthlyIncreasePercentageLoading,
  } = useReadContract({
    abi: contractABI,
    address: contractAddress,
    functionName: "monthlyIncreasePercentage",
  });

  // startingSlashingPoint
  const { data: startingSlashingPoint } = useReadContract({
    abi: contractABI,
    address: contractAddress,
    functionName: "startingSlashingPoint",
  });

  const { data: coolDownPeriod, error: coolDownPeriodError } = useReadContract({
    abi: contractABI,
    address: contractAddress,
    functionName: "cooldownPeriod",
    args: [],
  });

  useEffect(() => {
    if (
      totalStaked &&
      stakingDuration &&
      coolDownPeriod &&
      yieldConstant &&
      monthlyIncreasePercentage &&
      startingSlashingPoint
    ) {
      setStakingContractData({
        ...stakingContractData,
        stakingDuration: stakingDuration as bigint,
        cooldownPeriod: coolDownPeriod as bigint,
        totalStaked: totalStaked as bigint,
        yieldConstant: yieldConstant as bigint,
        monthlyIncreasePercentage: monthlyIncreasePercentage as bigint,
        startingSlashingPoint: startingSlashingPoint as bigint,
      });
    }
  }, [
    stakingDuration,
    coolDownPeriod,
    totalStaked,
    yieldConstant,
    monthlyIncreasePercentage,
    startingSlashingPoint,
  ]);

  React.useEffect(() => {
    async function updateUserStakes() {
      const stakes = await getUserStakes(currentAddress);
      console.log("All Stakes  : ", stakes);
      const items: TabItem[] = stakes?.map((stake, index) => {
        const { amount, startTime, requestUnstakeTime, unstakeRequested } =
          stake;

        const daysLeft =
          Number(requestUnstakeTime) +
          Number(coolDownPeriod) -
          Math.floor(new Date().getTime() / 1000);

        return {
          type: "Staking",
          id: index,
          startTime: Number(startTime) * 1000,
          amount: amount,
          currentRewards: "xxx",
          endTime: (Number(startTime) + Number(stakingDuration)) * 1000,
          requestUnstakeTime: requestUnstakeTime.toString(),
          unstakeRequested: unstakeRequested,
          action: unstakeRequested ? "Claim" : "Unstake",
          daysLeft: daysLeft > 0 ? `${daysLeft} secondes left` : null,
        };
      });

      // remove stakes that has amount === 0
      const filteredItems = items.filter((item) => item.amount !== BigInt(0));

      setStakingItems(filteredItems);
      setAllItems(filteredItems);
      console.log("Staking Items from inside: ", filteredItems);

      setTransactionSuccess(false);
    }
    async function updateUserBalnce() {
      const balance = await getUserBalance(currentAddress);
      setMyBalance(balance);
    }
    async function updateUserStaked() {
      const totalStaked = await getTotalStaked();
      setTotalStaked(totalStaked);
    }
    async function updateUserTotalStaked() {
      const userStakingBalance = await getTotalStakedForUser(currentAddress);
      setUserStakingBalance(userStakingBalance);
    }

    if (currentAddress && stakingDuration) {
      updateUserStakes();
      updateUserBalnce();
      updateUserStaked();
      updateUserTotalStaked();
    }
  }, [currentAddress, stakingDuration, transactionSuccess]);

  console.log("StakingContractData: ", stakingContractData);

  const buttons = [
    { name: "All", qt: allItems?.length },
    { name: "Staking", qt: stakingItems?.length },
    { name: "Your Farming", qt: farmingItems?.length },
    { name: "Airdrop", qt: airdropItems?.length },
  ];

  const handleTabClick = (label: string) => {
    setSelected(label);
  };

  const getButtonClass = (label: string): string => {
    return label === selected
      ? "justify-center self-stretch px-4 py-2 font-semibold whitespace-nowrap bg-surface-500 border-2 border-black border-solid rounded-[38px]"
      : "self-stretch my-auto";
  };

  return (
    <div className="relative pb-28 bg-neutral-50">
      {!isConnected && <ConnectWalletModal />}

      <div
        className={`flex flex-col items-center ${
          isConnected ? "" : " blur pointer-events-none"
        }  `}
      >
        <BuySeraModal
          toggleBuyEraModal={toggleBuyEraModal}
          setToggleBuyEraModal={setToggleBuyEraModal}
        />
        <EndStackingModal
          toggleEndStackingModal={toggleEndStackingModal}
          setToggleEndStackingModal={setToggleEndStackingModal}
        />
        <CardsSection
          userStakingBalance={userStakingBalance}
          totalStaked={totalStaked}
          myBalance={myBalance}
          setToggleBuyEraModal={setToggleBuyEraModal}
        />

        <OfficialLinks />
        <section className="flex flex-col p-6 mt-6 w-full bg-white rounded-3xl border border-solid border-stone-300 max-w-[1260px] max-md:px-5 max-md:max-w-full">
          <div className="flex flex-col justify-center mb-6 pb-3.5 border-b border-solid border-stone-300 max-md:max-w-full">
            <div className="flex gap-5 justify-between w-full max-md:flex-wrap max-md:max-w-full">
              <nav className="flex gap-5 justify-between items-center my-auto text-lg font-medium text-neutral-700">
                {buttons.map((label) => (
                  <button
                    key={label.name}
                    className={getButtonClass(label.name)}
                    onClick={() => {
                      handleTabClick(label.name);
                      console.log("selected", label.name);
                    }}
                  >
                    {label.name} ({label.qt})
                  </button>
                ))}
              </nav>
              <div className="flex gap-4 pl-20 text-base font-semibold text-neutral-700 max-md:flex-wrap">
                <button className=" secondary-button-sm  justify-center px-5 py-3 bg-white rounded-lg border-2 border-black border-solid">
                  Help ?
                </button>
                <div>
                  <button
                    className="primary-button-sm flex gap-0.5 px-5 py-3 bg-surface-primary rounded-lg border-[1px] border-black border-solid"
                    onClick={toggleDropdown}
                    ref={toggleButtonRef}
                  >
                    <span className="my-auto">Start a new program</span>
                    {isDropdownOpen ? (
                      <ChevronUp height={24} width={24} color="#1F1F1F" />
                    ) : (
                      <ChevronDown height={24} width={24} color="#1F1F1F" />
                    )}
                  </button>
                  {isDropdownOpen && (
                    <div
                      ref={dropdownRef}
                      className={`dropdown-content border-solid z-20 border-2 border-neutral-200 p-3 w-[214px] bg-white shadow-md rounded-lg mt-3 absolute font-medium`}
                    >
                      {/* Dropdown items here */}
                      <Link href="/dashboard/stacking">
                        <div className="transition duration-300 ease-in-out hover:bg-success-200 rounded-lg py-3 px-[10px] cursor-pointer  ">
                          Staking
                        </div>
                      </Link>
                      <div className="transition duration-300 ease-in-out hover:bg-success-200 rounded-lg py-3 px-[10px] cursor-pointer ">
                        LP Farming
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {selected === "All" && (
            <>
              {allItems?.length === 0 ? (
                <NoUtilities />
              ) : (
                <TabContent
                  setTransactionSuccess={setTransactionSuccess}
                  Items={allItems}
                />
              )}
            </>
          )}
          {selected === "Staking" && (
            <>
              {stakingItems?.length === 0 ? (
                <NoUtilities />
              ) : (
                <TabContent
                  setTransactionSuccess={setTransactionSuccess}
                  Items={stakingItems}
                />
              )}
            </>
          )}

          {selected === "Your Farming" && (
            <>
              {farmingItems?.length === 0 ? (
                <NoUtilities />
              ) : (
                <TabContent
                  setTransactionSuccess={setTransactionSuccess}
                  Items={farmingItems}
                />
              )}
            </>
          )}

          {selected === "Airdrop" && (
            <>
              {airdropItems?.length === 0 ? (
                <NoUtilities />
              ) : (
                <TabContent
                  setTransactionSuccess={setTransactionSuccess}
                  Items={airdropItems}
                />
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
