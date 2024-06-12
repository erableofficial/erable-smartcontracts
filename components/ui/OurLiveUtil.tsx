import Image from "next/image";
import Link from "next/link";
import * as React from "react";

interface UtilityCardProps {
  title: string;
  description: string;
  imageUrl: string;
  index: number; // Add index prop
  activeIndex: number; // Add activeIndex prop
}

const UtilityCard: React.FC<UtilityCardProps> = ({
  title,
  description,
  imageUrl,
  index, // Add index prop
  activeIndex, // Add activeIndex prop
}) => (
  <div
    className={`flex flex-col p-6 ${
      index === activeIndex ? "bg-surface-500" : "bg-white"
    } rounded-2xl border border-solid border-stone-300 min-w-[45%] max-md:px-5`}
  >
    <div className="flex gap-5 justify-between font-semibold">
      <h3 className="text-2xl text-black">{title}</h3>
      <Link
        href={"/learn-more"}
        className="pb-1.5 my-auto text-base text-black border-b-2 border-black border-solid"
      >
        Learn more
      </Link>
    </div>
    <p className="mt-6 text-lg font-medium text-neutral-500">{description}</p>
    <Image
      src={imageUrl}
      alt={`${title} illustration`}
      className="mt-16 w-full aspect-[1.15] max-md:mt-10"
      width={300}
      height={345}
    />
  </div>
);

const IconButton: React.FC<{
  src: string;
  alt: string;
  bgClass: string;
  onClick: () => void; // Add onClick prop
}> = ({
  src,
  alt,
  bgClass,
  onClick, // Add onClick prop
}) => (
  <button
    onClick={onClick}
    className={`flex justify-center items-center p-3.5 ${bgClass} h-[57px] rounded-[47.25px] w-[57px]  `}
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
  const utilityCardsData = [
    {
      title: "Staking",
      description:
        "Earn rewards by locking $ERA tokens in a secure contract, showing your commitment to the ecosystem.",
      imageUrl: "/images/placeholder.png",
    },
    {
      title: "LP Farming",
      description:
        "Provide liquidity to the $ERA pool on Uniswap and lock it into our farming contract to earn $ERA.",
      imageUrl: "/images/placeholder.png",
    },
    {
      title: "Earn",
      description:
        "Contribute actively in our growing community to earn $ERA tokens. Your contributions are valued and recognized.",
      imageUrl: "/images/placeholder.png",
    },
    {
      title: "Earn",
      description:
        "Contribute actively in our growing community to earn $ERA tokens. Your contributions are valued and recognized.",
      imageUrl: "/images/placeholder.png",
    },
    // Add more cards as needed
  ];

  // State to keep track of the active card index
  const [activeCardIndex, setActiveCardIndex] = React.useState(0);

  const scrollContainerRef = React.useRef<HTMLDivElement>(null); // Reference to the scroll container

  // Function to scroll to the active card
  const scrollToActiveCard = () => {
    if (!scrollContainerRef.current) return;

    const cardWidth = 300; // Width of each card, adjust based on your design
    const gap = 20; // Gap between cards, adjust based on your design
    const scrollPosition = (cardWidth + gap) * activeCardIndex;

    scrollContainerRef.current.scrollTo({
      left: scrollPosition,
      behavior: "smooth",
    });
  };

  // Update the active card index and then scroll to it
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

  // Effect to scroll to the active card whenever it changes
  React.useEffect(() => {
    scrollToActiveCard();
  }, [activeCardIndex]);

  return (
    <section className="overflow-hidden flex justify-center items-center px-16 py-20 bg-white max-md:pl-5">
      <div className="mt-2.5 w-full max-w-[1350px] max-md:max-w-full">
        <div className="flex gap-5 max-md:flex-col max-md:gap-0">
          <div className="flex flex-col w-[32%] max-md:ml-0 max-md:w-full">
            <div className="flex flex-col grow justify-between self-stretch max-md:mt-10">
              <h2 className="justify-center px-2.5 text-5xl font-extrabold text-black bg-surface-500 rounded-xl max-md:text-4xl">
                Our Live Utilities
              </h2>
              <p className="mt-10 text-lg font-medium text-black">
                Explore our live utilities and engage with our token to unlock
                the full experience.
              </p>
              <Link
                href={"/dashboard"}
                className="justify-center self-start px-7 py-4 mt-10 text-lg font-semibold tracking-wide leading-5 bg-primary rounded-xl border-solid border-[3px] border-stone-900 text-stone-900 max-md:px-5"
              >
                Open dashboard
              </Link>
              <div className="flex gap-5 justify-between mt-52 w-full max-md:mt-10">
                <span className="my-auto text-2xl leading-6 text-black">
                  {activeCardIndex + 1}/{utilityCardsData.length}
                </span>
                <div className="flex gap-2.5">
                  <IconButton
                    src="/images/move-left.svg"
                    alt="Utility 1"
                    bgClass="bg-zinc-100"
                    onClick={handleMoveLeft}
                  />
                  <IconButton
                    src="/images/move-right.svg"
                    alt="Utility 2"
                    bgClass="bg-surface-500"
                    onClick={handleMoveRight}
                  />
                </div>
              </div>
            </div>
          </div>
          <div
            ref={scrollContainerRef}
            className="hide-scrollbar overflow-auto flex flex-col ml-5 w-[69%] max-md:ml-0 max-md:w-full"
          >
            <div className="flex grow gap-5 justify-between max-md:flex-wrap max-md:mt-10 max-md:max-w-full ">
              {/* Render only the active card */}
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
        </div>
      </div>
    </section>
  );
};

export default OurLiveUtil;
