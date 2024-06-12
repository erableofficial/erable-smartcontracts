import * as React from "react";

type FAQItemProps = {
  question: string;
  iconSrc: string;
};

const FAQItem: React.FC<FAQItemProps> = ({ question, iconSrc }) => (
  <div className="flex flex-col justify-center px-6 py-4 mt-6 bg-white rounded-2xl border border-solid border-stone-300 max-md:px-5 max-md:max-w-full">
    <div className="flex gap-5 justify-between max-md:flex-wrap">
      <div className="my-auto text-xl font-bold text-stone-900 max-md:max-w-full">
        {question}
      </div>
      <div className="flex justify-center items-center p-3 bg-yellow-200 border border-solid border-zinc-300 h-[45px] rounded-[37.5px] w-[45px]">
        <img
          loading="lazy"
          src={iconSrc}
          alt=""
          className="w-6 aspect-square"
        />
      </div>
    </div>
  </div>
);

const Faq: React.FC = () => {
  const faqItems = [
    {
      question: "Lorem ipsum dolor sit amet consectetu or sit?",
      iconSrc:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/18bdfa4ccac9a7e2391b413c015364fa50969bdc2fdb074580a4e820992d0c23?apiKey=b5a3f3b9a2da4a44aeb72712ff03a4c3&",
    },
    {
      question: "Lorem ipsum dolor sit amet consectetu or sit?",
      iconSrc:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/18bdfa4ccac9a7e2391b413c015364fa50969bdc2fdb074580a4e820992d0c23?apiKey=b5a3f3b9a2da4a44aeb72712ff03a4c3&",
    },
    {
      question: "Lorem ipsum dolor sit amet consectetu or sit?",
      iconSrc:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/18bdfa4ccac9a7e2391b413c015364fa50969bdc2fdb074580a4e820992d0c23?apiKey=b5a3f3b9a2da4a44aeb72712ff03a4c3&",
    },
    {
      question: "Lorem ipsum dolor sit amet consectetu or sit?",
      iconSrc:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/18bdfa4ccac9a7e2391b413c015364fa50969bdc2fdb074580a4e820992d0c23?apiKey=b5a3f3b9a2da4a44aeb72712ff03a4c3&",
    },
  ];

  return (
    <section className="self-stretch p-[90px]">
      <div className="flex gap-5 max-md:flex-col max-md:gap-0">
        <div className="flex flex-col w-6/12 max-md:ml-0 max-md:w-full">
          <div className="flex flex-col px-5 text-5xl font-extrabold text-black leading-[52.8px] max-md:mt-10 max-md:text-4xl">
            <h1 className="max-md:text-4xl">
              Frequently
              <div className="justify-center px-2.5 py-2 mt-3 bg-yellow-200 rounded-xl max-md:text-4xl">
                Asked Questions:
              </div>
            </h1>
            <nav className="flex gap-5 justify-center mt-14 text-lg font-semibold tracking-wide leading-5 text-stone-900 max-md:mt-10">
              <a
                href="#"
                className="justify-center px-7 py-4 bg-emerald-200 rounded-xl border-solid border-[3px] border-stone-900 max-md:px-5"
              >
                Read Whitepaper
              </a>
              <a
                href="#"
                className="justify-center px-7 py-4 rounded-xl border-solid bg-emerald-200 bg-opacity-0 border-[3px] border-stone-900 max-md:px-5"
              >
                Get help
              </a>
            </nav>
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
