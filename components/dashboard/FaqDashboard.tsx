import { Plus, Minus } from "lucide-react";
import Link from "next/link";
import * as React from "react";

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
        <div className="my-auto text-xl font-semibold text-black max-lg:max-w-full max-sm:text-lg">
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
          <div className="self-start mt-6 text-lg font-semibold text-neutral-700 ">
            <Link
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 text-lg font-semibold font-NeueHaas text-neutral-700 border-b-2 border-black"
            >
              Learn More
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
      question: "What is erable°?",
      answer: (
        <>
          <div className="font-medium font-NeueHaas text-primary text-lg">
            <p>
              erable° is an impact{" "}
              <span className="font-semibold">
                investment fintech and financial
              </span>{" "}
              innovation lab dedicated to creating transformative financial
              products that drive social and environmental change.
            </p>
            <p className="mt-7">
              At the intersection of impact, technology, and collaboration, we
              believe the challenge isn&apos;t finding the funds but{" "}
              <span className="font-semibold">
                redirecting them toward impactful projects.
              </span>{" "}
              Traditional views on charity and profitability hinder this flow.
              We advocate for{" "}
              <span className="font-semibold">new financial products</span> and
              profitability avenues, leveraging technologies like blockchain as
              key enablers.
            </p>
            <ul className="ml-5 list-disc">
              <li className="mt-3">
                <span className="font-semibold">
                  Core Activity: Impact Crowdfunding Platform (Web2 + Web3)
                </span>
                Our emphasis is on revenue-based models in Europe. These link
                repayments to a project&apos;s revenue, aligning investor
                interests with business success.
              </li>
              <li className="mt-5">
                Other Notable Activities Collaborating with corporations to
                explore innovative financing methods, and launching an impact
                investment fund (≈ 18 months)
              </li>
            </ul>
            <p className="mt-7">
              We achieve this through our vibrant community, powered by our
              utility token $ERA, which fuels our ecosystem and aligns the
              interests of all stakeholders towards a common goal of impactful
              change.
            </p>
          </div>
        </>
      ),
      link: "https://www.erable.com/",
    },
    {
      question: "What is the $ERA token?",
      answer: (
        <>
          <div className="font-medium font-NeueHaas text-primary text-lg">
            <p>
              $ERA is{" "}
              <span className="font-semibold">
                the utility token at the heart of the erable°
              </span>{" "}
              business model. Here’s what it brings to the table:
            </p>
            <ul className="list-disc ml-5">
              <li className="mt-7">
                <span className="font-semibold">Access Services:</span> Hold
                $ERA to unlock all our products & services, whether you&apos;re
                an investor, project, or partner.
              </li>
              <li className="mt-7">
                <span className="font-semibold">Earn $ERA:</span> Get rewarded
                for ecosystem growth through contributions, LP farming, staking,
                and platform perks.
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
      link: "https://www.erable.com/ressources/whitepaper",
    },
    {
      question: "Where to get $ERA?",
      answer: (
        <>
          <div className="font-medium font-NeueHaas text-primary text-lg">
            <p>
              You can acquire $ERA on Uniswap, a leading decentralized exchange
              (DeX) known for its ease of use and robust security features.
            </p>
            <p className="mt-7">Steps to Acquire $ERA:</p>
            <ul className="list-decimal ml-6">
              <li>Set Up a Wallet (full list here)</li>
              <li>Connect to Uniswap</li>
              <li>Find $ERA</li>
              <li>Swap $USDC for $ERA</li>
              <li>View $ERA in Your Wallet</li>
            </ul>
          </div>
        </>
      ),
      link: "https://medium.com/@erableofficial/buy-era-on-uniswap-everything-you-need-to-know-0e73f335edbe",
    },
    {
      question: "How to bridge as a $CLAP holder?",
      answer: (
        <>
          <div className="font-medium font-NeueHaas text-primary text-lg">
            <p>
              The $CLAP token bridge allows holders to bridge their $CLAP tokens
              from the Cardano blockchain to the Polygon blockchain.
            </p>
            <p className="mt-7">
              The bridge is opened with our partner Chainport, a fully-audited
              bridging platform specializing in altcoins. The Chainport bridge
              already supported the bridging of Cardano Native Tokens such as
              $COPI, $NMKR or $MELD.
            </p>
            <p className="mt-7">
              To{" "}
              <span className="font-semibold">
                bridge your $CLAP tokens to Polygon, you must go to the
                Chainport
              </span>{" "}
              application and follow the process. To do this, you&apos;ll need
              your wallets:
            </p>
            <ul style={{ listStyleType: "disc", marginLeft: "20px" }}>
              <li className="mt-7">
                <span className="font-semibold">Cardano: a Nami wallet</span>
                (Chainport&apos;s only Cardano wallet today) holding your $CLAP
                tokens.
              </li>
              <li>
                <span className="font-semibold">
                  Polygon: a compatible EVM wallet{" "}
                </span>{" "}
                (full list here)
              </li>
            </ul>
            <p className="mt-7">
              The whole process{" "}
              <span className="font-semibold">takes at most 4 minutes</span>,
              including transaction times. You&apos;ll need to pay the Cardano
              transaction fee and the Chainport platform fee of 0.3% of the
              total $CLAP you wish to bridge.
            </p>
            <p className="mt-7">
              Example: $100,000CLAP to bridge with 0.3% fee $99,700CLAP on
              Polygon These fees will be more than covered by the incentives
              offered to early $CLAP holders.
            </p>
          </div>
        </>
      ),
      link: "https://medium.com/@erableofficial/bridge-your-clap-on-cardano-to-era-on-polygon-everything-you-need-to-know-9a51be37fcb2",
    },
  ];

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
                href="https://www.erable.com/ressources/whitepaper"
                target="_blank"
                rel="noreferrer"
                className="justify-center px-7 py-4 bg-surface-primary rounded-xl border-solid border-[3px] border-primary max-md:px-5 primary-button"
              >
                Read Whitepaper
              </Link>
              <Link
                href="https://discord.gg/erabledeg-897392916081831966"
                target="_blank"
                rel="noopener noreferrer"
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
