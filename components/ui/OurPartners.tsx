import Image from "next/image";
import React from "react";

type PartnerLogoProps = {
  src: string;
  alt: string;
};

const PartnerLogo: React.FC<PartnerLogoProps> = ({ src, alt }) => (
  <div className="flex justify-center items-center px-4 mx-auto bg-white border border-solid border-zinc-300 h-[6.938rem] rounded-full w-[6.938rem] max-md:mt-7">
    <Image
      src={src}
      alt={alt}
      className="aspect-[2.94] w-[4.813rem]"
      width={77}
      height={26}
    />
  </div>
);

const PartnerLogosRow: React.FC<{ logos: PartnerLogoProps[] }> = ({
  logos,
}) => (
  <div className="flex gap-5 flex-row flex-wrap max-md:gap-0">
    {logos.map((logo, index) => (
      <PartnerLogo key={index} {...logo} />
    ))}
  </div>
);

const OurPartners: React.FC = () => {
  const logos1 = [
    {
      src: "/images/partner-logo.png",
      alt: "Partner Logo 1",
    },
    {
      src: "/images/partner-logo.png",
      alt: "Partner Logo 2",
    },
    {
      src: "/images/partner-logo.png",
      alt: "Partner Logo 3",
    },
    {
      src: "/images/partner-logo.png",
      alt: "Partner Logo 4",
    },
  ];

  const logos2 = [
    {
      src: "/images/partner-logo.png",
      alt: "Partner Logo 5",
    },
    {
      src: "/images/partner-logo.png",
      alt: "Partner Logo 6",
    },
    {
      src: "/images/partner-logo.png",
      alt: "Partner Logo 7",
    },
  ];

  const logos3 = [
    {
      src: "/images/partner-logo.png",
      alt: "Partner Logo 8",
    },
    {
      src: "/images/partner-logo.png",
      alt: "Partner Logo 9",
    },
    {
      src: "/images/partner-logo.png",
      alt: "Partner Logo 10",
    },
    {
      src: "/images/partner-logo.png",
      alt: "Partner Logo 11",
    },
  ];

  const logos4 = [
    {
      src: "/images/partner-logo.png",
      alt: "Partner Logo 12",
    },
    {
      src: "/images/partner-logo.png",
      alt: "Partner Logo 13",
    },
    {
      src: "/images/partner-logo.png",
      alt: "Partner Logo 14",
    },
  ];

  return (
    <section className="flex gap-5 justify-between pr-20 bg-stone-50 max-md:flex-wrap max-md:pr-0">
      <div className="flex flex-col justify-center px-20 py-20 bg-surface-500 max-md:px-5 max-md:w-full">
        <div className="mx-2.5 max-md:max-w-full">
          <PartnerLogosRow logos={logos1} />
        </div>
        <div className="flex gap-5 justify-between self-center mt-3.5">
          {logos2.map((logo, index) => (
            <PartnerLogo key={index} {...logo} />
          ))}
        </div>
        <div className="mx-2.5 mt-3.5 max-md:max-w-full">
          <PartnerLogosRow logos={logos3} />
        </div>
        <div className="flex gap-5 justify-between self-center mt-3.5">
          {logos4.map((logo, index) => (
            <PartnerLogo key={index} {...logo} />
          ))}
        </div>
      </div>
      <div className="flex flex-col my-auto text-black">
        <div className="justify-center self-end px-2.5 text-5xl font-extrabold bg-surface-500 rounded-xl max-md:text-4xl leading-[4.641rem]">
          Our partners
        </div>
        <p className="mt-6 self-end justify-center text-lg font-medium w-[55%]">
          Lorem ipsum dolor sit amet consectetur. Iaculis dictumst commodo massa
          gravida quam massa
        </p>
      </div>
    </section>
  );
};

export default OurPartners;
