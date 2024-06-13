import Image from "next/image";
import Link from "next/link";
import * as React from "react";

type FAQItemProps = {
  question: string;
  iconSrc: string;
};

const FAQItem: React.FC<FAQItemProps> = ({ question, iconSrc }) => (
  <div className="flex flex-col justify-center px-6 py-4 mt-6 bg-white rounded-2xl border border-solid border-stone-300 max-md:px-5 max-md:max-w-full">
    <div className="flex gap-5 justify-between max-md:flex-wrap">
      <div className="my-auto text-xl font-bold text-primary max-md:max-w-full">
        {question}
      </div>
      <button className="flex justify-center items-center p-3 bg-surface-500 border border-solid border-zinc-300 h-[2.813rem] rounded-[2.344rem] w-[2.813rem]">
        <Image
          src={iconSrc}
          alt=""
          className="w-6 aspect-square"
          width={24}
          height={24}
        />
      </button>
    </div>
  </div>
);

const Faq: React.FC = () => {
  const faqItems = [
    {
      question: "Lorem ipsum dolor sit amet consectetu or sit?",
      iconSrc: "/images/plus.svg",
    },
    {
      question: "Lorem ipsum dolor sit amet consectetu or sit?",
      iconSrc: "/images/plus.svg",
    },
    {
      question: "Lorem ipsum dolor sit amet consectetu or sit?",
      iconSrc: "/images/plus.svg",
    },
    {
      question: "Lorem ipsum dolor sit amet consectetu or sit?",
      iconSrc: "/images/plus.svg",
    },
  ];

  return (
    <section className="self-stretch p-[90px]">
      <div className="flex gap-5 max-md:flex-col max-md:gap-0">
        <div className="flex flex-col w-6/12 max-md:ml-0 max-md:w-full">
          <div className="flex flex-col px-5 text-5xl font-extrabold text-black leading-[3.3rem] max-md:mt-10 max-md:text-4xl">
            <h1 className="max-md:text-4xl">
              Frequently
              <div className="justify-center px-2.5 py-2 mt-3 bg-surface-500 rounded-xl max-md:text-4xl">
                Asked Questions:
              </div>
            </h1>
            <div className="flex gap-5 justify-center mt-14 text-lg font-semibold tracking-wide leading-5 text-primary max-md:mt-10">
              <Link
                href="#"
                className="justify-center px-7 py-4 bg-surface-primary rounded-xl border-solid border-[3px] border-primary max-md:px-5 primary-button"
              >
                Read Whitepaper
              </Link>
              <Link
                href="#"
                className="justify-center px-7 py-4 rounded-xl border-solid bg-surface-primary bg-opacity-0 border-[3px] border-primary max-md:px-5 secondary-button "
              >
                Get help
              </Link>
            </div>
          </div>
        </div>
        <div className="flex flex-col ml-5 w-6/12 max-md:ml-0 max-md:w-full">
          <div className="flex flex-col grow max-md:mt-10 max-md:max-w-full">
            {faqItems.map((item, index) => (
              <FAQItem
                key={index}
                question={item.question}
                iconSrc={item.iconSrc}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Faq;
