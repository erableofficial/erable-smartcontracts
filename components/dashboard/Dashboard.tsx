import React, { useState, useRef, useEffect } from "react";
import { useAccount, useReadContract } from "wagmi";
import ConnectWalletModal from "./ConnectWalletModal";
import { ChevronDown, ChevronUp } from "lucide-react";
import BuySeraModal from "../ui/BuySeraModal";
import OfficialLinks from "./OfficialLinks";
import TabContent from "./TabContent";
import Link from "next/link";
import {
  airdropContractABI,
  airdropContractAddress,
  contractABI,
  contractAddress,
} from "../../lib/blockchain-config";
import { IRedisAirdop, TabItem } from "../../lib/types";
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
import { formatEther } from "viem";
import { useCurrentUser } from "../../context/currentUser";
import { useAirdropCycles } from "../../context/airdropCycles";
import Loading from "../ui/loading";
import NoFarmingUtilities from "./NoFarmingUtilities";
import NoAirdropUtilities from "./NoAirdropUtilities";
import NoStakingUtilities from "./NoStakingUtilities";
import LpFarmingModal from "./LpFarmingModal";
import { useRouter } from "next/router";

interface DashboardProps {}

const Dashboard: React.FC<DashboardProps> = () => {
  const Router = useRouter();
  const { currentUser, setCurrentUser } = useCurrentUser();
  const { stakingContractData, setStakingContractData } =
    useStakingContractData();
  const { airdropCycles, setAirdropCycles } = useAirdropCycles();
  const queryTab = Router.query.tab as string;
  const [selected, setSelected] = useState<string>(queryTab || "All");
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
  const [isFarmingLoading, setIsFarmingLoading] = useState<boolean>(true);
  const [isStakingLoading, setIsStakingLoading] = useState<boolean>(true);
  const [isAirdropLoading, setIsAirdropLoading] = useState<boolean>(true);
  const [isFarmingFetchingError, setIsFarmingFetchingError] =
    useState<boolean>(false);
  const [stakingAPR, setStakingAPR] = useState<number>(0);

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
  useEffect(() => {
    if (Router.query.tab) {
      setSelected(Router.query.tab as string);
    }
  }, [Router.query]);

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

  const { data: totalPendingRewards, error: totalPendingRewardsError } =
    useReadContract({
      abi: contractABI,
      address: contractAddress,
      functionName: "totalPendingRewards",
    });

  async function getUserFarmings() {
    setIsFarmingFetchingError(false);

    const userAddr = process.env.NEXT_PUBLIC_FARMING_USER_TEST_ADDRESS;
    const rewardTokenAddr = process.env.NEXT_PUBLIC_LCD_TOKEN_ADDRESS;
    const apiUrl = `${process.env.NEXT_PUBLIC_MERKL_API}/userRewards?user=${userAddr}&chainId=137&rewardToken=${rewardTokenAddr}&proof=true`;

    const response = await fetch(apiUrl);

    if (!response.ok) {
      console.error("Error fetching user farmings from Merkl API");
      setIsFarmingLoading(false);
      setIsFarmingFetchingError(true);
      return;
    }

    const data = await response.json();

    const { reasons } = data[rewardTokenAddr as string];

    // convert reasons to array
    const farmings = Object.keys(data[rewardTokenAddr as string].reasons).map(
      (key) => {
        return {
          rewardTokenAddr: rewardTokenAddr,
          accumulated: data[rewardTokenAddr as string].reasons[key].accumulated,
          unclaimed: data[rewardTokenAddr as string].reasons[key].unclaimed,
          reason: key,
          proof: data[rewardTokenAddr as string].proof,
        };
      }
    );

    const items: TabItem[] = farmings.map((farming, index) => {
      return {
        type: "LP Farming",
        id: index,
        startTime: 0,
        amount:
          BigInt(farming.unclaimed) > 0
            ? BigInt(farming.unclaimed)
            : BigInt(farming.accumulated),
        endTime: 0,
        action: BigInt(farming.unclaimed) > 0 ? "Claim" : "Claimed",
        requestUnstakeTime: "",
        unstakeRequested: false,
      };
    });
    setFarmingItems(items);
    setIsFarmingLoading(false);
    setIsFarmingFetchingError(false);
  }

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
          requestUnstakeTime: (Number(requestUnstakeTime) * 1000).toString(),
          unstakeRequested: unstakeRequested,
          action: unstakeRequested ? "Claim" : "Unstake",
          daysLeft: daysLeft > 0 ? `${daysLeft} secondes left` : null,
        };
      });

      const filteredItems = items.filter((item) => item.amount !== BigInt(0));

      setStakingItems(filteredItems);
      setTransactionSuccess(false);
      setIsStakingLoading(false);
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
      setIsAirdropLoading(false);
    }

    if (currentAddress) {
      setCurrentUser({
        ...currentUser,
        address: currentAddress,
        chain: chain,
        connector: connector,
      });
      setIsFarmingFetchingError(false);
      getUserFarmings();

      getUserFarmings();

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
      setTabLoading(true);
    };
  }, [
    currentAddress,
    stakingDuration,
    airdropCyclesFromBlockchain,
    transactionSuccess,
  ]);

  useEffect(() => {
    // update all items
    setAllItems([...stakingItems, ...farmingItems, ...airdropItems]);
    setTabLoading(false);

    return () => {
      setAllItems([]);
      setTabLoading(true);
    };
  }, [stakingItems, airdropItems, farmingItems]);

  const buttons = [
    { name: "All", qt: allItems?.length },
    { name: "Staking", qt: stakingItems?.length },
    { name: "Farming", qt: farmingItems?.length },
    { name: "Engage to Earn", qt: airdropItems?.length },
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
                          }}
                        >
                          {label.name} ({label.qt})
                        </button>
                      ))}
                    </nav>
                    <div className="flex gap-4 pl-20 text-base font-semibold text-neutral-700 max-md:flex-wrap max-lg:hidden">
                      <button
                        className=" secondary-button-sm  justify-center px-5 py-3 bg-white rounded-lg border-2 border-black border-solid"
                        onClick={() =>
                          window.open(
                            "https://discord.gg/erabledeg-897392916081831966",
                            "_blank"
                          )
                        }
                      >
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
                            <Link href="/dashboard/staking">
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

                {selected === "All" ? (
                  <>
                    {!tabLoading &&
                    !isFarmingLoading &&
                    !isStakingLoading &&
                    !isAirdropLoading ? (
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
                            stakingAPR={stakingAPR}
                          />
                        )}
                      </>
                    ) : (
                      <div className="flex justify-center items-center py-5">
                        <Loading />
                      </div>
                    )}
                  </>
                ) : selected === "Staking" ? (
                  <>
                    {!isStakingLoading ? (
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
                            stakingAPR={stakingAPR}
                          />
                        )}
                      </>
                    ) : (
                      <div className="flex justify-center items-center py-5">
                        <Loading />
                      </div>
                    )}
                  </>
                ) : selected === "Farming" ? (
                  <>
                    {!isFarmingLoading ? (
                      <>
                        {isFarmingFetchingError &&
                        farmingItems?.length === 0 ? (
                          // <div className="flex flex-col items-center justify-center gap-2 py-5">
                          //   <TriangleAlert size={48} color="#F9A825" />
                          //   <p className="text-lg font-semibold text-neutral-700">
                          //     Error fetching your farmings
                          //   </p>
                          //   <button
                          //     className="primary-button-sm px-5 py-3"
                          //     onClick={() => {
                          //       setIsFarmingFetchingError(false);
                          //       getUserFarmings();
                          //     }}
                          //   >
                          //     Retry
                          //   </button>
                          // </div>
                          <NoFarmingUtilities
                            myBalance={myBalance}
                            setToggleBuyEraModal={setToggleBuyEraModal}
                          />
                        ) : farmingItems?.length === 0 ? (
                          <NoFarmingUtilities
                            myBalance={myBalance}
                            setToggleBuyEraModal={setToggleBuyEraModal}
                          />
                        ) : (
                          <TabContent
                            setTransactionSuccess={setTransactionSuccess}
                            Items={farmingItems}
                            stakingAPR={stakingAPR}
                          />
                        )}
                      </>
                    ) : (
                      <div className="flex justify-center items-center py-5">
                        <Loading />
                      </div>
                    )}
                  </>
                ) : selected === "Engage to Earn" ? (
                  <>
                    {!isAirdropLoading ? (
                      <>
                        {airdropItems?.length === 0 ? (
                          <NoAirdropUtilities />
                        ) : (
                          <TabContent
                            setTransactionSuccess={setTransactionSuccess}
                            Items={airdropItems}
                            stakingAPR={stakingAPR}
                          />
                        )}
                      </>
                    ) : (
                      <div className="flex justify-center items-center py-5">
                        <Loading />
                      </div>
                    )}
                  </>
                ) : null}
              </section>
            </div>
          </div>
        </div>
        {isConnected && (
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
                  <Link href="/dashboard/staking">
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
        )}
      </div>
    </>
  );
};

export default Dashboard;
