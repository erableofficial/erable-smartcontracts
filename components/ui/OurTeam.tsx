import Image from "next/image";
import React from "react";

interface MemberCardProps {
  imgSrc: string;
  imgAlt: string;
  title: string;
  tag: string;
  description: string;
  contact: string;
  bgYellow: boolean;
}

const MemberCard: React.FC<MemberCardProps> = ({
  imgSrc,
  imgAlt,
  title,
  tag,
  description,
  contact,
  bgYellow,
}) => (
  <div className="flex flex-col grow mx-auto w-full bg-white rounded-[1.875rem] max-md:mt-6">
    {bgYellow ? (
      <div className="border border-solid border-neutral-400 bg-surface-500 rounded-2xl w-full h-full flex items-center justify-center">
        <Image
          src={imgSrc}
          alt={imgAlt}
          className="w-1/2 aspect-[1.1]  rounded-2xl"
          width={300}
          height={300}
        />
      </div>
    ) : (
      <Image
        src={imgSrc}
        alt={imgAlt}
        className="w-full border border-solid aspect-[1.1] border-neutral-400 rounded-2xl"
        width={300}
        height={300}
      />
    )}
    <div className="flex gap-2 justify-between mt-6 text-black whitespace-nowrap">
      <div className="text-2xl font-semibold">{title}</div>
      <div className="justify-center px-2.5 py-1 my-auto text-xs font-medium bg-surface-500 border border-black border-solid rounded-[2.375rem]">
        {tag}
      </div>
    </div>
    <div className="mt-3 text-base font-medium text-black">{description}</div>
    <div className="flex gap-3 justify-center mt-6">
      <div className="flex flex-col justify-center">
        <div className="shrink-0 rounded-full border border-solid bg-zinc-300 border-neutral-500 h-[1.875rem] stroke-[0.769px] w-[1.875rem]" />
      </div>
      <div className="my-auto text-lg font-medium text-black">{contact}</div>
    </div>
  </div>
);

const members = [
  {
    imgSrc: "/images/logo.svg",
    imgAlt: "Image of Team Member 1",
    title: "erable.com",
    tag: "tech",
    description:
      "Massa gravida quam massa gravida quam massa gravida quam massa",
    contact: "Personne à contacter + contact",
    bgYellow: true,
  },
  {
    imgSrc: "/images/placeholder.png",
    imgAlt: "Image of Team Member 2",
    title: "erable.com",
    tag: "tech",
    description:
      "Massa gravida quam massa gravida quam massa gravida quam massa",
    contact: "Personne à contacter + contact",
    bgYellow: false,
  },
  {
    imgSrc: "/images/placeholder.png",
    imgAlt: "Image of Team Member 3",
    title: "erable.com",
    tag: "tech",
    description:
      "Massa gravida quam massa gravida quam massa gravida quam massa",
    contact: "Personne à contacter + contact",
    bgYellow: false,
  },
  {
    imgSrc: "/images/placeholder.png",
    imgAlt: "Image of Team Member 4",
    title: "erable.com",
    tag: "tech",
    description:
      "Massa gravida quam massa gravida quam massa gravida quam massa",
    contact: "Personne à contacter + contact",
    bgYellow: false,
  },
];

const OurTeam: React.FC = () => (
  <section className="flex flex-col justify-center p-20 bg-white max-md:px-5">
    <div className="self-start px-2.5 mt-2.5 ml-2.5 text-5xl font-extrabold leading-[4.254rem] text-black bg-surface-500 rounded-xl">
      Our team
    </div>
    <div className="mx-2.5 mt-12 max-md:mt-10 max-md:max-w-full">
      <div className="flex gap-5 max-md:flex-col max-md:gap-0">
        {members.map((member) => (
          <div
            key={member.imgSrc}
            className="flex flex-col w-3/12 max-md:w-full"
          >
            <MemberCard
              imgSrc={member.imgSrc}
              imgAlt={member.imgAlt}
              title={member.title}
              tag={member.tag}
              description={member.description}
              contact={member.contact}
              bgYellow={member.bgYellow}
            />
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default OurTeam;
