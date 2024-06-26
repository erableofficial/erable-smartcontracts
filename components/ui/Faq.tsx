import { Plus, Minus } from "lucide-react";
import Link from "next/link";
import * as React from "react";

type FAQItemProps = {
  question: string;
  answer: string;
  link?: string;
};

const FAQItem: React.FC<FAQItemProps> = ({ question, answer, link }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  // This useEffect ensures that updates to isOpen appropriately adjust maxHeight
  React.useEffect(() => {
    if (contentRef.current) {
      contentRef.current.style.maxHeight = isOpen
        ? `${contentRef.current.scrollHeight}px`
        : "0";
    }
  }, [isOpen]);

  return (
    <div className="flex flex-col justify-center px-6 py-4 mt-6 bg-white rounded-2xl border border-solid border-stone-300 max-md:px-5 max-md:max-w-full">
      <div className="flex gap-5 justify-between">
        <div className="my-auto text-xl font-bold text-primary max-md:max-w-full">
          {question}
        </div>
        <button
          className="flex justify-center items-center p-3 hover:bg-surface-500 border border-solid border-zinc-300 h-[2.813rem] rounded-[2.344rem] w-[2.813rem]"
          onClick={toggleOpen}
        >
          {isOpen ? <Minus /> : <Plus />}
        </button>
      </div>
      <div
        ref={contentRef}
        className="overflow-hidden transition-max-height duration-500 ease-in-out"
        style={{ maxHeight: "0" }}
      >
        <div className="mt-4 text-sm text-gray-700">{answer}</div>
        {link && (
          <div className="self-start pb-1.5 mt-6 text-lg font-semibold text-neutral-700 ">
            <Link
              href={link}
              className="pb-1.5 mt-6 text-lg font-semibold text-neutral-700 border-b-2 border-black"
            >
              Read more
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

const Faq: React.FC = () => {
  const faqItems = [
    {
      question: "Lorem ipsum dolor sit amet consectetu or sit?",
      answer:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      link: "#",
    },
    {
      question: "Lorem ipsum dolor sit amet consectetu or sit?",
      answer:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      link: "#",
    },
    {
      question: "Lorem ipsum dolor sit amet consectetu or sit?",
      answer:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      link: "#",
    },
    {
      question: "Lorem ipsum dolor sit amet consectetu or sit?",
      answer:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      link: "#",
    },
  ];

  return (
    <section className="self-stretch p-[90px] max-md:p-2 ">
      <div className="flex gap-5 max-md:flex-col max-md:gap-0">
        <div className="flex flex-col w-6/12 max-md:ml-0 max-md:w-full">
          <div className="flex flex-col px-5 text-5xl font-extrabold text-neutral-700 leading-[3.3rem] max-md:mt-10 max-md:text-4xl">
            <h1 className="max-md:text-4xl">
              Frequently
              <div className="justify-center font-friends w-fit px-2.5 py-2 mt-3 bg-surface-500 rounded-xl max-md:text-4xl">
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
                answer={item.answer}
                link={item.link}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Faq;
