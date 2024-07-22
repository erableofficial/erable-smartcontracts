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
  className: string;
  width: number;
  height: number;
}

const MemberCard: React.FC<MemberCardProps> = ({
  imgSrc,
  imgAlt,
  title,
  tag,
  description,
  bgYellow,
  bgColor,
  className,
  width,
  height,
}) => (
  <div className="flex flex-col grow mx-auto w-full bg-white  max-md:mt-6">
    <div
      className={`${bgColor} self-stretch shrink-0   border border-solid h-[271px] border-neutral-400 rounded-2xl w-full  flex items-center justify-center max-sm:h-[271px]`}
    >
      <Image
        src={imgSrc}
        alt={imgAlt}
        className={className}
        // layout="responsive"
        width={width}
        height={height}
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
    imgSrc: "/images/erable-logo2.png",
    imgAlt: "Image of Team Member 1",
    title: "erable°",
    tag: "business & product",
    description:
      "Erable° is a fintech lab that uses traditional finance and blockchain to support social and environmental progress.",
    bgYellow: true,
    bgColor: "bg-surface-500",
    className: "w-[158px] h-[40px]",
    width: 158,
    height: 40,
  },
  {
    imgSrc: "/images/dar blockchain logo7.png",
    imgAlt: "Image of Team Member 2",
    title: "Dar Blockchain",
    tag: "tech",
    description:
      "Dar Blockchain is an innovative web 3.0 hub that supports actively developing decentralized solutions.",
    bgYellow: false,
    bgColor: "bg-black",
    className: "w-[159px] h-[63.6px]",
    width: 159,
    height: 63.6,
  },
  {
    imgSrc: "/images/smartchain-logo2.png",
    imgAlt: "Image of Team Member 3",
    title: "Smartchain",
    tag: "finance",
    description:
      "Smartchain is a 360° web 3.0 expertise cabinet. They have been the historic partner of erable° since its inception.",
    bgYellow: false,
    bgColor: "white",
    className: "w-[217.4px] h-[40px]",
    width: 217.4,
    height: 40,
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
              className={member.className}
              width={member.width}
              height={member.height}
            />
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default OurTeam;
