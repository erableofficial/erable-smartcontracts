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
  airdropContractABI,
  airdropContractAddress,
  contractABI,
  contractAddress,
  stakingTokenABI,
  stakingTokenAddress,
} from "../../lib/blockchain-config";
import { IRedisAirdop, StakeInfo, TabItem } from "../../lib/types";
import NoUtilities from "./NoStakingUtilities";
import {
  getTotalStaked,
  getTotalStakedForUser,
  getUserBalance,
  getUserHasClaimedAirdrop,
  getUserStakes,
} from "../../lib/utils";
import CardsSection from "./CardsSection";
import { useStakingContractData } from "../../context/stakingContractData";
import EndStackingModal from "./EndStackingModal";
import { parseEther } from "viem";
import { useCurrentUser } from "../../context/currentUser";
import { useAirdropCycles } from "../../context/airdropCycles";
import { readContract } from "@wagmi/core";
import { config } from "../../lib/wagmi/config";
import Loading from "../ui/loading";
import NoFarmingUtilities from "./NoFarmingUtilities";
import NoAirdropUtilities from "./NoAirdropUtilities";
import NoStakingUtilities from "./NoStakingUtilities";
import LpFarmingModal from "./LpFarmingModal";

interface DashboardProps {}

const Dashboard: React.FC<DashboardProps> = () => {
  const { currentUser, setCurrentUser } = useCurrentUser();
  const { stakingContractData, setStakingContractData } =
    useStakingContractData();
  const { airdropCycles, setAirdropCycles } = useAirdropCycles();
  const [selected, setSelected] = useState<string>("All");
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [isDropdownOpen2, setIsDropdownOpen2] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const dropdownRef2 = useRef<HTMLDivElement | null>(null);
  const toggleButtonRef = useRef<HTMLButtonElement | null>(null);
  const toggleButtonRef2 = useRef<HTMLButtonElement | null>(null);
  const [toggleBuyEraModal, setToggleBuyEraModal] =
    React.useState<boolean>(false);
  const [toggleLpFarmingModal, setToggleLpFarmingModal] =
    React.useState<boolean>(false);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const toggleDropdown2 = () => setIsDropdownOpen2(!isDropdownOpen2);
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
  const [tabLoading, setTabLoading] = useState<boolean>(true);

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
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef2.current &&
        !dropdownRef2.current.contains(event.target as Node) &&
        toggleButtonRef2.current &&
        !toggleButtonRef2.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen2(false);
      }
    };

    if (isDropdownOpen2) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen2]);

  const {
    isConnected,
    address: currentAddress,
    chain,
    connector,
  } = useAccount();

  const {
    data: airdropCyclesFromBlockchain,
    error: airdropCyclesFromBlockchainError,
  } = useReadContract({
    abi: airdropContractABI,
    address: airdropContractAddress,
    functionName: "getAllAirdropCycles",
  });

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

  useEffect(() => {
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

    async function getUserAirdrops() {
      // get all airdrops for the user
      const airdrops = await fetch("/api/airdrop/getAll");

      const airdropsData = await airdrops.json();
      console.log("Airdrops Data : ", airdropsData);

      setAirdropCycles(airdropsData.data);

      const userAirdrops = await airdropsData.data.filter(
        (airdrop: IRedisAirdop) => airdrop.address === currentAddress
      );

      const items: TabItem[] = await Promise.all(
        userAirdrops.map(async (airdrop: IRedisAirdop, index: number) => {
          const isClaimed = await getUserHasClaimedAirdrop(
            airdrop.cycle,
            currentAddress
          );

          return {
            type: "Airdrop",
            id: index,
            startTime: airdrop.created_at
              ? new Date(airdrop.created_at).toLocaleDateString()
              : "--",
            amount: BigInt(airdrop.amount),
            endTime: "--",
            action: isClaimed ? "Claimed" : "Claim",
            airdropCycleIndex: Number(airdrop.cycle),
          };
        })
      );

      setAirdropItems(items);
    }

    if (currentAddress) {
      setCurrentUser({
        ...currentUser,
        address: currentAddress,
        chain: chain,
        connector: connector,
      });

      if (stakingDuration) {
        setTabLoading(true);
        updateUserStakes();
        updateUserBalnce();
        updateUserStaked();
        updateUserTotalStaked();
      }

      // airdrop functions
      if (airdropCyclesFromBlockchain) {
        getUserAirdrops();
      }
    }

    // claeinning after unmount useEffect
    return () => {
      setAllItems([]);
      setFarmingItems([]);
      setStakingItems([]);
      setAirdropItems([]);
    };
  }, [
    currentAddress,
    stakingDuration,
    airdropCyclesFromBlockchain,
    transactionSuccess,
  ]);

  useEffect(() => {
    if (stakingItems.length > 0 && airdropItems.length > 0) {
      const allItems = [...stakingItems, ...airdropItems];
      setAllItems(allItems);
      setTabLoading(false);
    } else if (stakingItems.length > 0) {
      setAllItems(stakingItems);
      setTabLoading(false);
    } else if (airdropItems.length > 0) {
      setAllItems(airdropItems);
      setTabLoading(false);
    }
  }, [stakingItems, airdropItems]);

  // console.log("StakingContractData: ", stakingContractData);

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
      ? "justify-center self-stretch px-4 py-2 font-semibold whitespace-nowrap bg-surface-500 border-2 border-black border-solid rounded-[38px] max-sm:text-sm max-sm:font-bold"
      : "self-stretch my-auto max-sm:text-base";
  };

  return (
    <>
      <style>
        {`
      .overflow-x-auto::-webkit-scrollbar {
        background-color: #F9F9F9;
        border-radius: 80px;
        border: 1px solid #BDBDBD;        
      }

      .overflow-x-auto::-webkit-scrollbar-thumb {
        background-color: #FFFBA0;
        height: 11px;
        border-radius: 80px;
        border: 1px solid #000000;
      }
    `}
      </style>
      <div className="relative lg:pb-28 bg-neutral-50">
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
          <LpFarmingModal
            setToggleLpFarmingModal={setToggleLpFarmingModal}
            toggleLpFarmingModal={toggleLpFarmingModal}
          />

          <CardsSection
            userStakingBalance={userStakingBalance}
            userFarmingBalance={BigInt(0)}
            totalStaked={totalStaked}
            myBalance={myBalance}
            setToggleBuyEraModal={setToggleBuyEraModal}
          />

          <OfficialLinks />

          <div className="w-full  flex justify-center">
            <div className=" overflow-x-auto w-full max-[1281px]:px-5 pb-5">
              <section className="flex flex-col p-6 mt-6 w-full bg-white rounded-3xl border border-solid border-stone-300 max-w-[1260px] max-md:px-5 max-md:max-w-full min-w-[970px] mx-auto">
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
                    <div className="flex gap-4 pl-20 text-base font-semibold text-neutral-700 max-md:flex-wrap max-lg:hidden">
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
                            <ChevronDown
                              height={24}
                              width={24}
                              color="#1F1F1F"
                            />
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
                            <div
                              className="transition duration-300 ease-in-out hover:bg-success-200 rounded-lg py-3 px-[10px] cursor-pointer "
                              onClick={() => setToggleLpFarmingModal(true)}
                            >
                              LP Farming
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {tabLoading && (
                  <div className="flex justify-center items-center py-5">
                    <Loading />
                  </div>
                )}

                {selected === "All" && !tabLoading && (
                  <>
                    {allItems?.length === 0 ? (
                      <NoUtilities
                        myBalance={myBalance}
                        setToggleBuyEraModal={setToggleBuyEraModal}
                      />
                    ) : (
                      <TabContent
                        setTransactionSuccess={setTransactionSuccess}
                        Items={allItems}
                      />
                    )}
                  </>
                )}
                {selected === "Staking" && !tabLoading && (
                  <>
                    {stakingItems?.length === 0 ? (
                      <NoStakingUtilities
                        myBalance={myBalance}
                        setToggleBuyEraModal={setToggleBuyEraModal}
                      />
                    ) : (
                      <TabContent
                        setTransactionSuccess={setTransactionSuccess}
                        Items={stakingItems}
                      />
                    )}
                  </>
                )}

                {selected === "Your Farming" && !tabLoading && (
                  <>
                    {farmingItems?.length === 0 ? (
                      <NoFarmingUtilities />
                    ) : (
                      <TabContent
                        setTransactionSuccess={setTransactionSuccess}
                        Items={farmingItems}
                      />
                    )}
                  </>
                )}

                {selected === "Airdrop" && !tabLoading && (
                  <>
                    {airdropItems?.length === 0 ? (
                      <NoAirdropUtilities />
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
        </div>
        <div className="flex gap-4 pl-5 py-10 text-base font-semibold text-neutral-700 max-md:flex-wrap lg:hidden">
          <button className=" secondary-button-sm  justify-center px-5 py-3 bg-white rounded-lg border-2 border-black border-solid">
            Help ?
          </button>
          <div>
            <button
              className="primary-button-sm flex gap-0.5 px-5 py-3 bg-surface-primary rounded-lg border-[1px] border-black border-solid"
              onClick={toggleDropdown2}
              ref={toggleButtonRef2}
            >
              <span className="my-auto">Start a new program</span>
              {isDropdownOpen2 ? (
                <ChevronUp height={24} width={24} color="#1F1F1F" />
              ) : (
                <ChevronDown height={24} width={24} color="#1F1F1F" />
              )}
            </button>
            {isDropdownOpen2 && isConnected && (
              <div
                ref={dropdownRef2}
                className={`dropdown-content border-solid z-20 border-2 border-neutral-200 p-3 w-[214px] bg-white shadow-md rounded-lg mt-3 absolute font-medium`}
              >
                {/* Dropdown items here */}
                <Link href="/dashboard/stacking">
                  <div className="transition duration-300 ease-in-out hover:bg-success-200 rounded-lg py-3 px-[10px] cursor-pointer  ">
                    Staking
                  </div>
                </Link>
                <div
                  className="transition duration-300 ease-in-out hover:bg-success-200 rounded-lg py-3 px-[10px] cursor-pointer "
                  onClick={() => setToggleLpFarmingModal(true)}
                >
                  LP Farming
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
