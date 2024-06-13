import React from "react";

type PartnerLogoProps = {
  src: string;
  alt: string;
};

const PartnerLogo: React.FC<PartnerLogoProps> = ({ src, alt }) => (
  <div className="flex justify-center items-center px-4 mx-auto bg-white border border-solid border-zinc-300 h-[111px] rounded-[128.351px] w-[111px] max-md:mt-7">
    <img
      loading="lazy"
      src={src}
      alt={alt}
      className="aspect-[2.94] w-[77px]"
    />
  </div>
);

const PartnerLogosRow: React.FC<{ logos: PartnerLogoProps[] }> = ({
  logos,
}) => (
  <div className="flex gap-5 max-md:flex-col max-md:gap-0">
    {logos.map((logo, index) => (
      <PartnerLogo key={index} {...logo} />
    ))}
  </div>
);

const OurPartners: React.FC = () => {
  const logos1 = [
    {
      src: "https://cdn.builder.io/api/v1/image/assets/TEMP/e61746cf41b06eb3206992d1352aa585a56c1de2fd82b9d2139666d2674801d4?apiKey=b5a3f3b9a2da4a44aeb72712ff03a4c3&",
      alt: "Partner Logo 1",
    },
    {
      src: "https://cdn.builder.io/api/v1/image/assets/TEMP/e61746cf41b06eb3206992d1352aa585a56c1de2fd82b9d2139666d2674801d4?apiKey=b5a3f3b9a2da4a44aeb72712ff03a4c3&",
      alt: "Partner Logo 2",
    },
    {
      src: "https://cdn.builder.io/api/v1/image/assets/TEMP/e61746cf41b06eb3206992d1352aa585a56c1de2fd82b9d2139666d2674801d4?apiKey=b5a3f3b9a2da4a44aeb72712ff03a4c3&",
      alt: "Partner Logo 3",
    },
    {
      src: "https://cdn.builder.io/api/v1/image/assets/TEMP/e61746cf41b06eb3206992d1352aa585a56c1de2fd82b9d2139666d2674801d4?apiKey=b5a3f3b9a2da4a44aeb72712ff03a4c3&",
      alt: "Partner Logo 4",
    },
  ];

  const logos2 = [
    {
      src: "https://cdn.builder.io/api/v1/image/assets/TEMP/53318760f437b50fefbe75b0e1046d2ec1f17e07ed8cfc775b10161eab7c3cf8?apiKey=b5a3f3b9a2da4a44aeb72712ff03a4c3&",
      alt: "Partner Logo 5",
    },
    {
      src: "https://cdn.builder.io/api/v1/image/assets/TEMP/53318760f437b50fefbe75b0e1046d2ec1f17e07ed8cfc775b10161eab7c3cf8?apiKey=b5a3f3b9a2da4a44aeb72712ff03a4c3&",
      alt: "Partner Logo 6",
    },
    {
      src: "https://cdn.builder.io/api/v1/image/assets/TEMP/53318760f437b50fefbe75b0e1046d2ec1f17e07ed8cfc775b10161eab7c3cf8?apiKey=b5a3f3b9a2da4a44aeb72712ff03a4c3&",
      alt: "Partner Logo 7",
    },
  ];

  const logos3 = [
    {
      src: "https://cdn.builder.io/api/v1/image/assets/TEMP/38174f3f175195b96992335aff3cc077d6ddf5001da6c125e6086e285895df23?apiKey=b5a3f3b9a2da4a44aeb72712ff03a4c3&",
      alt: "Partner Logo 8",
    },
    {
      src: "https://cdn.builder.io/api/v1/image/assets/TEMP/38174f3f175195b96992335aff3cc077d6ddf5001da6c125e6086e285895df23?apiKey=b5a3f3b9a2da4a44aeb72712ff03a4c3&",
      alt: "Partner Logo 9",
    },
    {
      src: "https://cdn.builder.io/api/v1/image/assets/TEMP/38174f3f175195b96992335aff3cc077d6ddf5001da6c125e6086e285895df23?apiKey=b5a3f3b9a2da4a44aeb72712ff03a4c3&",
      alt: "Partner Logo 10",
    },
    {
      src: "https://cdn.builder.io/api/v1/image/assets/TEMP/38174f3f175195b96992335aff3cc077d6ddf5001da6c125e6086e285895df23?apiKey=b5a3f3b9a2da4a44aeb72712ff03a4c3&",
      alt: "Partner Logo 11",
    },
  ];

  const logos4 = [
    {
      src: "https://cdn.builder.io/api/v1/image/assets/TEMP/b06d1161935d2f7cb55596fac7fbb12b2e22427e25a929bb88719a988feb79be?apiKey=b5a3f3b9a2da4a44aeb72712ff03a4c3&",
      alt: "Partner Logo 12",
    },
    {
      src: "https://cdn.builder.io/api/v1/image/assets/TEMP/b06d1161935d2f7cb55596fac7fbb12b2e22427e25a929bb88719a988feb79be?apiKey=b5a3f3b9a2da4a44aeb72712ff03a4c3&",
      alt: "Partner Logo 13",
    },
    {
      src: "https://cdn.builder.io/api/v1/image/assets/TEMP/b06d1161935d2f7cb55596fac7fbb12b2e22427e25a929bb88719a988feb79be?apiKey=b5a3f3b9a2da4a44aeb72712ff03a4c3&",
      alt: "Partner Logo 14",
    },
  ];

  return (
    <section className="flex gap-5 justify-between pr-20 bg-stone-50 max-md:flex-wrap max-md:pr-5">
      <div className="flex flex-col justify-center px-20 py-20 bg-surface-500 max-md:px-5 max-md:max-w-full">
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
        <div className="justify-center self-end px-2.5 text-5xl font-extrabold bg-surface-500 rounded-xl max-md:text-4xl">
          Our partners
        </div>
        <p className="mt-6 text-lg font-medium">
          Lorem ipsum dolor sit amet consectetur. Iaculis dictumst commodo massa
          gravida quam massa
        </p>
      </div>
    </section>
  );
};

export default OurPartners;
