import { Plus, Minus } from "lucide-react";
import Link from "next/link";
import * as React from "react";

const faqItems = [
  {
    question: "What is erable°?",
    answer: (
      <>
        <div className="font-medium text-lg">
          <p>
            erable° is an
            <span className="font-semibold">impact investment fintech</span>
            and financial innovation lab dedicated to creating transformative
            financial products that drive social and environmental change.
          </p>
          <p className="mt-7">
            At the intersection of impact, technology, and collaboration, we
            believe the challenge isn't finding the funds but redirecting them
            toward<span className="font-semibold"> impactful projects.</span>{" "}
            Traditional views on charity and profitability hinder this flow. We
            advocate for
            <span className="font-semibold">
              new financial products and profitability avenues,
            </span>
            leveraging technologies like blockchain as key enablers.
          </p>
          <p className="mt-7">
            $ERA token:
            <br /> We achieve this through our vibrant community, powered by our
            utility token $ERA, which fuels
            <span className="font-semibold">
              our ecosystem and aligns the interests of all stakeholders towards
              a common goal of impactful change.
            </span>
          </p>
        </div>
      </>
    ),
    link: "#",
  },
  {
    question: "What is the $ERA token?",
    answer: (
      <>
        <div className="font-medium text-lg">
          <p>
            $ERA is the utility token at the heart of the erable° business
            model. Here’s what it brings to the table:
          </p>
          <ul style={{ listStyleType: "disc", marginLeft: "20px" }}>
            <li className="mt-7">
              <span className="font-semibold">Access Services:</span> Hold $ERA
              to unlock all our products & services, whether you're an investor,
              project, or partner.
            </li>
            <li className="mt-7">
              <span className="font-semibold">Earn $ERA:</span> Get rewarded for
              ecosystem growth through contributions, LP farming, staking, and
              platform perks.
            </li>
            <li className="mt-7">
              <span className="font-semibold">Govern with $ERA:</span> Have a
              say in our strategic directions and supported projects, ensuring
              we stay true to our shared values.
            </li>
          </ul>
          <p className="mt-7">
            $ERA embodies our commitment to fair value redistribution across
            erable° and its brands.
          </p>
        </div>
      </>
    ),
    link: "#",
  },
  {
    question: "Where to get $ERA?",
    answer: (
      <>
        <div className="font-medium text-lg">
          <p>
            You can{" "}
            <span className="font-semibold">
              acquire $ERA on Uniswap, a leading decentralized exchange{" "}
            </span>
            (DeX) known for its ease of use and robust security features.
          </p>
          <p className="mt-7">
            Steps to Acquire $ERA:
            <ol style={{ listStyleType: "decimal", marginLeft: "20px" }}>
              <li>Set Up a Wallet (full list here)</li>
              <li>Connect to Uniswap</li>
              <li>Find $ERA</li>
              <li>Swap $USDC for $ERA</li>
              <li>View $ERA in Your Wallet</li>
            </ol>
          </p>
        </div>
      </>
    ),
    link: "#",
  },
  {
    question: "How to bridge as a $CLAP holder?",
    answer:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    link: "#",
  },
];

type FAQItemProps = {
  question: string;
  answer: React.ReactNode;
  link?: string;
};

const FAQItem: React.FC<FAQItemProps> = ({ question, answer, link }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  React.useEffect(() => {
    if (contentRef.current) {
      contentRef.current.style.maxHeight = isOpen
        ? `${contentRef.current.scrollHeight}px`
        : "0";
    }
  }, [isOpen]);

  return (
    <div
      className="flex flex-col justify-center px-6 py-4 mt-6 bg-white rounded-2xl border border-solid border-stone-300 max-lg:px-5 max-lg:max-w-full cursor-pointer"
      onClick={toggleOpen}
    >
      <div className="flex gap-5 justify-between  items-center">
        <div className="my-auto text-xl font-bold text-primary max-lg:max-w-full max-sm:text-lg">
          {question}
        </div>
        <div
          className={` cursor-pointer flex justify-center items-center p-3 ${
            isOpen ? "bg-surface-500" : ""
          }  border border-solid border-zinc-300 h-[45px] rounded-[37.5px] w-[45px]`}
          onClick={toggleOpen}
        >
          {isOpen ? <Minus /> : <Plus />}
        </div>
      </div>
      <div
        ref={contentRef}
        className="overflow-hidden transition-max-height duration-500 ease-in-out"
        style={{ maxHeight: "0" }}
      >
        <div className="mt-6 text-sm text-gray-700">{answer}</div>
        {link && (
          <div className="self-start pb-1.5 mt-6 text-lg font-semibold text-neutral-700 ">
            <Link
              href={link}
              className="pb-1.5 mt-6 text-lg font-semibold text-neutral-700 border-b-2 border-black"
            >
              {question === "Where to get $ERA?"
                ? "View tutorial"
                : "Read more"}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

const Faq: React.FC = () => {
  return (
    <section className="self-stretch p-[90px] max-lg:px-5 max-sm:py-10 ">
      <div className="flex gap-5 max-lg:flex-col max-lg:gap-0">
        <div className="flex flex-col w-6/12 max-lg:ml-0 max-lg:w-full">
          <div className="flex flex-col px-5 text-5xl font-extrabold text-neutral-700 leading-[3.3rem] max-lg:mt-10 max-lg:text-4xl max-sm:mt-0 max-sm:px-0 max-sm:w-max">
            <h1 className="max-lg:text-4xl">
              Frequently
              <div className="justify-center font-friends w-fit px-2.5 py-2 mt-3 bg-surface-500 rounded-xl max-lg:text-4xl max-sm:w-min">
                <span className="flex font-friends ">Asked Questions</span>
              </div>
            </h1>
            <div className="flex gap-5 mt-14 text-lg font-semibold tracking-wide leading-5 text-primary max-lg:mt-10 max-lg:hidden justify-start">
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
        <div className="flex flex-col ml-5 w-6/12  max-lg:w-[90%] max-lg:mx-auto max-md:w-full max-lg:pb-8 ">
          <div className="flex flex-col grow max-lg:mt-10 max-lg:max-w-full">
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
        <div className="flex gap-5 justify-center mt-2 text-lg font-semibold tracking-wide leading-5 text-primary  lg:hidden">
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
    </section>
  );
};

export default Faq;
