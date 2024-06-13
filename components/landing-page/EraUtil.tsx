import Image from "next/image";
import * as React from "react";

interface CardProps {
  imageSrc: string;
  title: string;
  description: string;
}

const Card: React.FC<CardProps> = ({ imageSrc, title, description }) => (
  <div className="flex flex-col w-[33%] max-md:ml-0 max-md:w-full">
    <div className="flex flex-col grow p-6 w-full bg-white rounded-3xl border border-solid border-zinc-300 max-md:px-5 max-md:mt-10">
      <div className="flex justify-center items-center px-3 bg-surface-500 h-[2.813rem] rounded-[2rem] w-[2.813rem]">
        <Image
          src={imageSrc}
          alt=""
          className="w-full aspect-square"
          width={45}
          height={45}
        />
      </div>
      <h3 className="mt-3.5 text-2xl font-semibold text-black">{title}</h3>
      <p className="mt-8 text-lg font-medium text-black">{description}</p>
    </div>
  </div>
);

const EraUtil: React.FC = () => (
  <section className="flex flex-col justify-center py-20 bg-stone-50">
    <div className="flex flex-col justify-center items-center px-20 mt-2.5 w-full rounded-3xl max-md:px-5 max-md:max-w-full">
      <h1 className="justify-center px-2.5 text-5xl font-extrabold text-black bg-surface-500 rounded-lg max-md:text-4xl">
        $ERA utilities
      </h1>
      <p className="mt-10 text-lg font-medium text-center text-black max-w-[79%] max-md:max-w-full">
        $ERA embodies our commitment to fair value redistribution across Erable°
        and its brands. By holding and using $ERA, you are directly
        participating in and benefiting from the value we create together,
        fostering a collaborative and inclusive financial ecosystem.
      </p>
      <div className="justify-between self-stretch py-4 mx-2.5 mt-10 max-md:max-w-full">
        <div className="flex gap-5 max-md:flex-col max-md:gap-0">
          <Card
            imageSrc="/images/external-link.svg"
            title="Access Services"
            description="Hold $ERA to unlock all our products & services, whether you're an investor, project, or partner."
          />
          <Card
            imageSrc="/images/money.svg"
            title="Earn $ERA"
            description="Get rewarded for ecosystem growth through contributions, LP farming, staking, and platform perks."
          />
          <Card
            imageSrc="/images/gps-loc.svg"
            title="Govern with $ERA"
            description="Have a say in our strategic directions and supported projects, ensuring we stay true to our shared values."
          />
        </div>
      </div>
      <div className="flex gap-5 justify-center mt-10 text-lg font-semibold tracking-wide leading-5 text-primary">
        <button className="primary-button">Buy $ERA</button>
        <button className="secondary-button">Read the Whitepaper</button>
      </div>
    </div>
  </section>
);

export default EraUtil;
