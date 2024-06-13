import Image from "next/image";
import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ children, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="justify-center self-start px-7 py-4 text-lg font-semibold text-black bg-surface-primary rounded-xl border-black border-solid border-[3px] max-md:px-5"
    >
      {children}
    </button>
  );
};

interface CardProps {
  text: string;
  subtext?: string;
}

const Card: React.FC<CardProps> = ({ text, subtext }) => {
  return (
    <div className="flex flex-col">
      <button className="flex flex-col justify-center text-lg font-semibold text-black bg-white">
        <span className="justify-center px-7 py-4 bg-white rounded-xl border-black border-solid border-[3px] max-md:px-5">
          {text}
        </span>
      </button>
      {subtext && (
        <p className="mt-3 text-sm font-medium text-black">{subtext}</p>
      )}
    </div>
  );
};

const HeroSection: React.FC = () => (
  <section className="flex flex-col items-center px-20 max-md:px-5">
    <div className="text-8xl font-extrabold tracking-tighter text-center text-black leading-[6.938rem] max-md:max-w-full max-md:text-4xl max-md:leading-[3.438rem]">
      <span className="font-bold leading-[6.938rem]">&lt;</span>
      <span className="leading-[6.938rem]">Onchain</span>
      <span className="font-bold leading-[6.938rem]">&gt;</span>
    </div>
    <h1 className="justify-center px-5 mt-5 text-[5.625rem] font-extrabold tracking-tighter text-center text-black bg-surface-500 rounded-2xl leading-[6.75rem] max-md:max-w-full max-md:text-4xl font-friends ">
      Impact Investing
    </h1>
    <p className="self-stretch mt-10 mr-2.5 ml-3 text-lg font-medium font-friends text-center text-black max-md:max-w-full">
      erable° is a powerhouse for next-gen investment products! <br /> <br />
      Our mission? Transforming finance for positive impact in both Web2 and
      Web3. <br />
      Supported by a community and its utility token $ERA.
    </p>
    <div className="flex justify-center items-center self-stretch px-16 mt-10 mr-2.5 ml-3 max-md:px-5 max-md:max-w-full font-friends">
      <div className="flex gap-5">
        <Button>Buy $ERA</Button>
        <Card text="Bridge $CLAP" subtext="*only for CLAP investors" />
      </div>
    </div>
    <figure className="flex flex-col justify-center px-6 pt-6 mt-10 max-w-full bg-surface-500 rounded-3xl w-[68.5%] max-md:px-5">
      <Image
        src="/images/card-img.svg"
        className="w-full border-t-2 border-black border-solid aspect-[4.55] border-x-2 max-md:max-w-full"
        alt="Descriptive text about the image"
        width={894}
        height={196}
      />
    </figure>
  </section>
);

export default HeroSection;
