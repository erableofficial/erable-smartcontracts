import Image from "next/image";
import Link from "next/link";
import * as React from "react";

interface UtilityCardProps {
  title: string;
  description: string;
  imageUrl: string;
  index: number;
  activeIndex: number;
  btnText: string;
  link: string;
}

const IconButton: React.FC<{
  src: string;
  alt: string;
  width: string;
  height: string;
  padding?: string;
  onClick: () => void;
}> = ({ src, alt, onClick, width, height, padding }) => (
  <button
    onClick={onClick}
    className={`flex justify-center items-center  hover:bg-surface-500 bg-zinc-100   rounded-[47.25px]`}
    style={{ width: width, height: height, padding: padding }}
  >
    <Image
      src={src}
      alt={alt}
      className="aspect-square w-[30px]"
      width={30}
      height={30}
    />
  </button>
);

const OurLiveUtil: React.FC = () => {
  const cardRef = React.useRef<HTMLDivElement>(null);
  const UtilityCard: React.FC<UtilityCardProps> = ({
    title,
    description,
    imageUrl,
    index,
    activeIndex,
    btnText,
    link,
  }) => (
    <div
      ref={cardRef}
      className={`flex flex-col p-6 ${
        index === activeIndex ? "bg-surface-500" : "bg-white"
      } rounded-2xl border border-solid border-stone-300  max-xl:min-w-full min-w-[45%]  max-md:px-5`}
    >
      <div className="flex gap-5 justify-between font-semibold">
        <h3 className="text-2xl text-neutral-700 max-sm:text-xl">{title}</h3>
        {link === "no link" ? (
          <p
            className={`${
              index === activeIndex ? "bg-surface-300 font-semibold" : "bg-surface-500"
            }  py-1.5 px-2.5 font-NeueHaas text-sm font-medium rounded-full text-neutral-700 border-[1.5px] border-black border-solid max-sm:text-base max-sm:border max-sm:font-medium max-sm:p-0.5`}
          >
            Coming soon
          </p>
        ) : (
          <Link
            href={link}
            className="pb-1.5 cursor-pointer my-auto font-medium font-NeueHaas text-base text-neutral-700 border-b-2 border-black border-solid max-sm:text-base max-sm:border-b-[1px] max-sm:font-medium max-sm:pb-0"
          >
            {btnText}
          </Link>
        )}
      </div>
      <p className="mt-6 text-lg font-medium text-neutral-500 max-sm:mt-5 max-sm:text-base">
        {description}
      </p>
      <Image
        src={imageUrl}
        alt={`${title} illustration`}
        className="mt-16 w-full h-full aspect-[1.15] object-fill max-md:mt-10"
        width={400}
        height={345}
      />
    </div>
  );
  const utilityCardsData = [
    {
      title: "Staking",
      description:
        "Earn rewards by locking $ERA tokens in a secure contract, showing your commitment to the ecosystem.",
      imageUrl: "/images/live-utils-staking.png",
      btnText: "Learn more",
      link: "/",
    },
    {
      title: "LP Farming",
      description:
        "Provide liquidity to the $ERA pool on Uniswap and lock it into our farming contract to earn $ERA.",
      imageUrl: "/images/live-utils-farming.png",
      btnText: "Learn more",
      link: "/",
    },
    {
      title: "Engage to Earn",
      description:
        "Contribute actively in our growing community to earn $ERA tokens. Your contributions are valued and recognized.",
      imageUrl: "/images/live-utils-earn.png",
      btnText: "How to stake LP",
      link: "/",
    },
    {
      title: "Governance",
      description:
        "Hold $ERA tokens and vote on key decisions including project funding, strategic directions, and community proposals. ",
      imageUrl: "/images/live-utils-governance.png",
      btnText: "Coming soon",
      link: "no link",
    },
  ];

  const [activeCardIndex, setActiveCardIndex] = React.useState(0);

  const scrollContainerRef = React.useRef<HTMLDivElement>(null); // Reference to the scroll container

  const scrollToActiveCard = () => {
    if (!scrollContainerRef.current || !cardRef.current) return;

    const gap = 20;
    const cardWidth = cardRef.current.offsetWidth;
    const totalGapWidth = gap * activeCardIndex;
    const scrollPosition = cardWidth * activeCardIndex + totalGapWidth;

    scrollContainerRef.current.scrollTo({
      left: scrollPosition,
      behavior: "smooth",
    });
  };

  const handleMoveLeft = () => {
    setActiveCardIndex((prevIndex) =>
      prevIndex === 0 ? utilityCardsData.length - 1 : prevIndex - 1
    );
  };

  const handleMoveRight = () => {
    setActiveCardIndex((prevIndex) =>
      prevIndex === utilityCardsData.length - 1 ? 0 : prevIndex + 1
    );
  };

  React.useEffect(() => {
    scrollToActiveCard();
  }, [activeCardIndex]);

  return (
    <section className="overflow-hidden flex justify-center items-center px-16 py-20 bg-white max-md:p-3 max-sm:pb-10">
      <div className="mt-2.5 w-full max-w-[98%] max-md:max-w-full">
        <div className="flex gap-5 max-md:flex-col max-md:gap-0">
          <div className="flex flex-col w-[32%] max-md:ml-0 max-md:w-full">
            <div className="flex flex-col grow justify-between self-stretch max-md:mt-10 max-sm:mt-[18px]">
              <h1 className="justify-center px-2.5 text-5xl leading-[4.641rem] w-fit font-extrabold text-neutral-700 bg-surface-500 rounded-xl max-md:text-4xl max-xl:w-min max-md:w-fit">
                Our Live Utilities
              </h1>
              <p className="mt-10 text-lg font-medium text-neutral-700 max-sm:mt-6 max-sm:text-base">
                Explore our live utilities and engage with our token to unlock
                the full experience.
              </p>
              <Link
                href={"/dashboard"}
                className="justify-center self-start px-7 py-4 mt-10 text-lg font-semibold tracking-wide leading-5 bg-surface-primary rounded-xl border-solid border-[3px] border-primary text-primary max-md:px-5 primary-button max-sm:p-3 max-sm:mt-6"
              >
                Open dashboard
              </Link>
              <div className="flex gap-5 justify-between mt-52 w-full max-md:mt-10 max-sm:hidden">
                <span className="my-auto text-2xl leading-6 text-neutral-700">
                  {activeCardIndex + 1}/{utilityCardsData.length}
                </span>
                <div className="flex gap-2.5">
                  <IconButton
                    width={"57px"}
                    height={"57px"}
                    padding={"14px"}
                    src="/images/move-left.svg"
                    alt="Utility 1"
                    onClick={handleMoveLeft}
                  />
                  <IconButton
                    width={"57px"}
                    height={"57px"}
                    padding={"14px"}
                    src="/images/move-right.svg"
                    alt="Utility 2"
                    onClick={handleMoveRight}
                  />
                </div>
              </div>
            </div>
          </div>
          <div
            ref={scrollContainerRef}
            className="hide-scrollbar overflow-auto max-sm:p-1 flex flex-col ml-5 w-[69%] max-md:ml-0 max-md:w-full max-sm:flex-col-reverse"
          >
            <div className="flex grow gap-5 justify-between  max-md:mt-10 max-md:max-w-full ">
              {utilityCardsData.map((card, index) => (
                <UtilityCard
                  key={index}
                  {...card}
                  index={index}
                  activeIndex={activeCardIndex}
                />
              ))}
            </div>
          </div>
          <div className="flex gap-5 justify-between mt-52 w-full max-md:mt-10 sm:hidden max-sm:mt-6">
            <span className="my-auto text-2xl leading-6 text-neutral-700 max-sm:text-base">
              {activeCardIndex + 1}/{utilityCardsData.length}
            </span>
            <div className="flex gap-2.5">
              <IconButton
                width={"34px"}
                height={"34px"}
                padding={"8px"}
                src="/images/move-left.svg"
                alt="Utility 1"
                onClick={handleMoveLeft}
              />
              <IconButton
                width={"34px"}
                height={"34px"}
                padding={"8px"}
                src="/images/move-right.svg"
                alt="Utility 2"
                onClick={handleMoveRight}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurLiveUtil;
