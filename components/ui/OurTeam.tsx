import Image from "next/image";
import React from "react";

interface MemberCardProps {
  imgSrc: string;
  imgAlt: string;
  title: string;
  tag: string;
  description: string;
  bgYellow: boolean;
  bgColor: string;
}

const MemberCard: React.FC<MemberCardProps> = ({
  imgSrc,
  imgAlt,
  title,
  tag,
  description,
  bgYellow,
  bgColor,
}) => (
  <div className="flex flex-col grow mx-auto w-full bg-white rounded-[1.875rem] max-md:mt-6">
    <div
      className={`${bgColor} border border-solid border-neutral-400 rounded-2xl w-full h-full flex items-center justify-center max-sm:h-[271px]`}
    >
      <Image
        src={imgSrc}
        alt={imgAlt}
        className="w-full border border-solid aspect-[1.1] object-none border-neutral-400 rounded-2xl"
        width={300}
        height={300}
      />
    </div>

    <div className="flex gap-2 justify-between mt-6 text-neutral-700 whitespace-nowrap">
      <div className="text-2xl font-semibold">{title}</div>
      <div className="justify-center px-2.5 py-1 my-auto text-xs font-medium bg-surface-500 border border-black border-solid rounded-[2.375rem]">
        {tag}
      </div>
    </div>
    <div className="mt-3 text-base font-medium text-neutral-700">
      {description}
    </div>
  </div>
);

const members = [
  {
    imgSrc: "/images/erable-logo.png",
    imgAlt: "Image of Team Member 1",
    title: "erable°",
    tag: "business & product",
    description:
      "Erable° is a fintech lab that uses traditional finance and blockchain to support social and environmental progress.",
    bgYellow: true,
    bgColor: "bg-surface-500",
  },
  {
    imgSrc: "/images/darblockchain-logo.png",
    imgAlt: "Image of Team Member 2",
    title: "Dar Blockchain",
    tag: "tech",
    description:
      "Dar Blockchain is an innovative web 3.0 hub that supports actively developing decentralized solutions.",
    bgYellow: false,
    bgColor: "bg-black",
  },
  {
    imgSrc: "/images/smartchain-logo.png",
    imgAlt: "Image of Team Member 3",
    title: "Smartchain",
    tag: "finance",
    description:
      "Smartchain is a 360° web 3.0 expertise cabinet. They have been the historic partner of erable° since its inception.",
    bgYellow: false,
    bgColor: "white",
  },
];

const OurTeam: React.FC = () => (
  <section className="flex flex-col justify-center p-20 bg-white max-md:px-5 max-sm:py-10">
    <div className="self-start px-2.5  ml-2.5 font-friends text-5xl font-extrabold leading-[4.254rem] text-neutral-700 bg-surface-500 rounded-xl max-sm:text-4xl">
      Our Team
    </div>
    <div className="mx-2.5 mt-12 max-md:mt-10 max-md:max-w-full max-sm:mx-0 max-sm:mt-4">
      <div className="flex gap-5 max-md:flex-col max-md:gap-0">
        {members.map((member) => (
          <div
            key={member.imgSrc}
            className="flex flex-col w-1/3 max-md:w-full"
          >
            <MemberCard
              imgSrc={member.imgSrc}
              imgAlt={member.imgAlt}
              title={member.title}
              tag={member.tag}
              description={member.description}
              bgYellow={member.bgYellow}
              bgColor={member.bgColor}
            />
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default OurTeam;
