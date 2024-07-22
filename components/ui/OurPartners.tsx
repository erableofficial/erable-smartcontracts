import Image from "next/image";
import React from "react";

type PartnerLogoProps = {
  src: string;
  alt: string;
};

const PartnerLogo: React.FC<PartnerLogoProps> = ({ src, alt }) => (
  // <div className="flex justify-center items-center px-4 mx-auto bg-white border border-solid border-zinc-300 h-[6.938rem] rounded-full w-[6.938rem] max-lg:mt-7">
  //   <Image
  //     src={src}
  //     alt={alt}
  //     className="aspect-[2.94] w-[4.813rem]"
  //     width={77}
  //     height={26}
  //   />
  // </div>
  <div
    className="flex justify-center items-center px-4 mx-auto bg-white border border-solid border-zinc-300 rounded-full max-lg:mt-7 max-sm:mt-0"
    style={{
      width: "20vw",
      height: "20vw",
      maxWidth: "6.938rem",
      maxHeight: "6.938rem",
    }}
  >
    <Image
      src={src}
      alt={alt}
      width={77}
      height={26}
      className="max-w-full max-h-full" // Ensure the image scales within the container
      style={{ aspectRatio: "2.94" }} // Maintain aspect ratio
    />
  </div>
);

const PartnerLogosRow: React.FC<{ logos: PartnerLogoProps[] }> = ({
  logos,
}) => (
  <div className="flex gap-5 flex-row max-lg:gap-1">
    {logos.map((logo, index) => (
      <PartnerLogo key={index} {...logo} />
    ))}
  </div>
);

const OurPartners: React.FC = () => {
  const logos1 = [
    {
      src: "/images/fipto.png",
      alt: "Partner Logo 1",
    },
    {
      src: "/images/mintero.png",
      alt: "Partner Logo 2",
    },
    {
      src: "/images/inatba.png",
      alt: "Partner Logo 3",
    },
    {
      src: "/images/trusted-seed.png",
      alt: "Partner Logo 4",
    },
  ];

  const logos2 = [
    {
      src: "/images/orange-dao.png",
      alt: "Partner Logo 5",
    },
    {
      src: "/images/chainport.png",
      alt: "Partner Logo 6",
    },
    {
      src: "/images/landx.png",
      alt: "Partner Logo 7",
    },
  ];

  const logos3 = [
    {
      src: "/images/dieldfisher.png",
      alt: "Partner Logo 8",
    },
    {
      src: "/images/keenest.png",
      alt: "Partner Logo 9",
    },
    {
      src: "/images/d&a-partners.png",
      alt: "Partner Logo 10",
    },
    {
      src: "/images/partner-logo.png",
      alt: "Partner Logo 11",
    },
  ];

  // const logos4 = [
  //   {
  //     src: "/images/partner-logo.png",
  //     alt: "Partner Logo 12",
  //   },
  //   {
  //     src: "/images/partner-logo.png",
  //     alt: "Partner Logo 13",
  //   },
  //   {
  //     src: "/images/partner-logo.png",
  //     alt: "Partner Logo 14",
  //   },
  // ];

  return (
    <section className="flex gap-5 justify-between pr-20 bg-neutral-50 max-lg:flex-col-reverse max-lg:pr-0">
      <div className="flex flex-col justify-center px-20 py-20 bg-surface-500 max-lg:px-5 max-lg:w-full max-sm:py-8 max-sm:px-3 max-sm:gap-2">
        <div
          className="mx-2.5 max-lg:max-w-full"
          data-sal-delay="100"
          data-sal="slide-up"
          data-sal-duration="1000"
        >
          <PartnerLogosRow logos={logos1} />
        </div>
        <div
          className="flex gap-5 justify-between self-center mt-3.5 max-lg:w-[70%] max-sm:w-[80%] "
          data-sal-delay="200"
          data-sal="slide-up"
          data-sal-duration="1000"
        >
          {logos2.map((logo, index) => (
            <PartnerLogo key={index} {...logo} />
          ))}
        </div>
        <div
          className="mx-2.5 mt-3.5 max-lg:max-w-full"
          data-sal-delay="300"
          data-sal="slide-up"
          data-sal-duration="1000"
        >
          <PartnerLogosRow logos={logos3} />
        </div>
        {/* <div
          className="flex gap-5 justify-between self-center mt-3.5 max-lg:w-[70%] max-sm:w-[80%]"
          data-sal-delay="400"
          data-sal="slide-up"
          data-sal-duration="1000"
        >
          {logos4.map((logo, index) => (
            <PartnerLogo key={index} {...logo} />
          ))}
        </div> */}
      </div>
      <div
        className="flex flex-col my-auto text-neutral-700 max-lg:pt-10 max-lg:pb-5 max-lg:px-[15.5px]"
        data-sal-delay="100"
        data-sal="slide-up"
        data-sal-duration="1000"
      >
        <div className="flex max-lg:w-full max-lg:items-start lg:justify-end ">
          <div className=" w-fit justify-center self-end px-2.5 text-5xl font-friends font-extrabold bg-surface-500 rounded-xl max-lg:text-4xl leading-[4.641rem] ">
            Our Partners
          </div>
        </div>
        <p className="mt-6 self-end justify-center text-lg font-medium w-[55%] max-lg:w-full max-sm:text-base">
          Meet our amazing partners who help us drive toward financial
          innovations and sustainability.
        </p>
      </div>
    </section>
  );
};

export default OurPartners;
