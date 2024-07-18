import * as React from "react";
import Image from "next/image";
import {
  Bookmark,
  Copy,
  Gift,
  Globe,
  Sparkle,
  TrendingUp,
  Users,
  Map,
  Link,
  Bell,
} from "lucide-react";

type FeatureBlockProps = {
  title: string;
  text: string;
  icon?: React.ReactNode;
};

type RoadmapSectionProps = {
  period: string;
  features: { title: string; text: string; icon?: React.ReactNode }[];
};

const FeatureBlock: React.FC<FeatureBlockProps> = ({ title, text, icon }) => (
  <div className="flex flex-col p-6 mt-5 w-full bg-white rounded-2xl border border-solid border-zinc-300 max-md:px-5 md:min-h-48">
    <div className="flex gap-5 justify-between w-full">
      <div className="flex gap-2.5 text-xl font-bold">
        {icon}
        <div className="font-semibold">{title}</div>
      </div>
      {/* <div className="justify-center self-start px-2.5 py-1 text-xs font-medium whitespace-nowrap bg-surface-500 border border-black border-solid rounded-[38px]">
        tech
      </div> */}
    </div>
    <p className="mt-6 text-lg font-medium max-sm:mt-5  whitespace-normal">
      {text}
    </p>
  </div>
);

const RoadmapSection: React.FC<RoadmapSectionProps> = ({
  period,
  features,
}) => (
  <section className="col-span-12 md:col-span-6 lg:col-span-3 lg:min-w-[300px]">
    <div className="flex flex-col grow text-neutral-700 max-md:mt-6 h-full">
      <div className="justify-center sm:border sm:border-neutral-200 text-center px-5 py-1.5 text-2xl font-semibold text-neutral-700 bg-surface-500 rounded-lg max-sm:w-fit max-sm:py-[2px] max-sm:px-2">
        {period}
      </div>
      {features.map((feature, index) => (
        <FeatureBlock
          key={index}
          title={feature.title}
          text={feature.text}
          icon={feature.icon}
        />
      ))}
    </div>
  </section>
);

const Roadmap: React.FC = () => {
  const roadmapData = [
    {
      period: "Q2 2024",
      features: [
        {
          title: "Our Web2 Position",
          text: "Accelerate on the revenue-based finance vertical by acquiring a web2 platform.",
          icon: <TrendingUp width={24} height={24} />,
        },
        {
          title: "Scaling Operations",
          text: "Sign 20 new impact projects to be funded by the end of the year.",
          icon: <Copy width={24} height={24} />,
        },
      ],
    },
    {
      period: "Q3 2024",
      features: [
        {
          title: "Token Bridge",
          text: "Seamlessly bridge $CLAP tokens from Cardano to Polygon. Users get $ERA tokens on Polygon.",
          icon: <Globe width={24} height={24} />,
        },
        {
          title: "First Utilities",
          text: "Launch of several rewards programs: Staking, Farming, Engage2Earn, and Governance.",
          icon: <Gift width={24} height={24} />,
        },
      ],
    },
    {
      period: "Q4 2024",
      features: [
        {
          title: "Web3 Project Funding",
          text: "Initiate pilots of revenue-sharing fundings for Web3-native projects and infrastructures.",
          icon: <Sparkle width={24} height={24} />,
        },
        {
          title: "Community Structuration",
          text: "Implement community processes to collaborate on our financial innovations.",
          icon: <Users width={24} height={24} />,
        },
      ],
    },
    {
      period: "S1 2025",
      features: [
        {
          title: "CeX Listing",
          text: "List $ERA on Centralized Exchanges (CeX) to boost accessibility and liquidity.",
          icon: <Bookmark width={24} height={24} />,
        },
        {
          title: "WE DO GOOD v2",
          text: "Launch the upgraded royalty-financing platform, offering enhanced features and improved user experience.",
          icon: <Map width={24} height={24} />,
        },
      ],
    },
    {
      period: "S2 2025",
      features: [
        {
          title: "$ERA Integration",
          text: "Implement $ERA interactions on our platform to onboard all our stakeholders and fuel our business model.",
          icon: <Link width={24} height={24} />,
        },
        {
          title: "Launch of era°fund",
          text: "Introduce a new financial vehicle to expand our funding capabilities for impactful projects.",
          icon: <Bell width={24} height={24} />,
        },
      ],
    },
  ];
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const wrap = container.querySelector("ul")!.parentNode as HTMLElement;
    let containerWidth = 0;
    let scrollWidth = 0;
    let posFromLeft = 0;
    let animated: NodeJS.Timeout | null = null;

    const onMouseEnter = (e: MouseEvent) => {
      containerWidth = wrap.clientWidth;
      scrollWidth = wrap.scrollWidth;
      const padding = 0.2 * containerWidth;
      posFromLeft = wrap.getBoundingClientRect().left;
      let stripePos = e.pageX - padding - posFromLeft;
      let pos = stripePos / (containerWidth - padding * 2);
      let scrollPos = (scrollWidth - containerWidth) * pos;

      wrap.style.scrollBehavior = "smooth";

      if (scrollPos < 0) scrollPos = 0;
      if (scrollPos > scrollWidth - containerWidth)
        scrollPos = scrollWidth - containerWidth;

      wrap.scrollLeft = scrollPos;
      container.style.setProperty(
        "--scrollWidth",
        (containerWidth / scrollWidth) * 100 + "%"
      );
      container.style.setProperty(
        "--scrollLleft",
        (scrollPos / scrollWidth) * 100 + "%"
      );

      if (animated) clearTimeout(animated);
      animated = setTimeout(() => {
        animated = null;
        wrap.style.scrollBehavior = "auto";
      }, 200);
    };

    const onMouseMove = (e: MouseEvent) => {
      if (animated) return;
      const padding = 0.2 * containerWidth;
      let stripePos = e.pageX - padding - posFromLeft;
      if (stripePos < 0) stripePos = 0;
      let pos = stripePos / (containerWidth - padding * 2);
      let scrollPos = (scrollWidth - containerWidth) * pos;

      wrap.scrollLeft = scrollPos;
      if (scrollPos < scrollWidth - containerWidth)
        container.style.setProperty(
          "--scrollLleft",
          (scrollPos / scrollWidth) * 100 + "%"
        );

      const prevMore = wrap.scrollLeft > 0;
      const nextMore = scrollWidth - containerWidth - wrap.scrollLeft > 5;
      container.setAttribute(
        "data-at",
        (prevMore ? "left " : " ") + (nextMore ? "right" : "")
      );
    };

    container.addEventListener("mouseenter", onMouseEnter);
    container.addEventListener("mousemove", onMouseMove);

    return () => {
      container.removeEventListener("mouseenter", onMouseEnter);
      container.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return (
    <div className="flex flex-col self-stretch p-20 bg-neutral-50 max-md:px-5 max-sm:py-10">
      <div className="justify-center self-start font-friends px-2.5 ml-2.5 text-5xl font-extrabold text-neutral-700 whitespace-nowrap bg-surface-500 rounded-xl max-md:text-4xl">
        Roadmap
      </div>
      <hr className="shrink-0 mt-10 max-w-full h-px border bg-neutral-300 w-full mx-auto max-sm:mt-5" />
      <div className="justify-center px-9 mx-2.5 mt-10 max-md:px-5 max-md:max-w-full max-sm:mt-4 max-sm:mx-0 max-sm:px-0">
        <div
          ref={containerRef}
          className="carousel relative min-h-[466px] max-lg:hidden"
        >
          <div className="wrap">
            <ul className=" flex gap-5">
              {roadmapData.map((section, index) => (
                <li key={index}>
                  <RoadmapSection
                    period={section.period}
                    features={section.features}
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-5 max-md:grid-cols-1 lg:hidden">
          {roadmapData.map((section, index) => (
            <RoadmapSection
              key={index}
              period={section.period}
              features={section.features}
            />
          ))}
        </div>
      </div>
      <div className="flex justify-center items-center px-16 mx-2.5 mt-14 text-lg font-semibold tracking-wide leading-5 text-stone-900 max-md:px-5 max-md:mt-10 max-md:max-w-full">
        <div className="flex gap-5 max-md:flex-wrap">
          <button
            className="primary-button"
            onClick={() =>
              window.open(
                "https://uploads-ssl.webflow.com/65169eb6a44aa82a08547c89/669675e95bf23d046b0d2995_erable%C2%B0_whitepaper_v2.0_July24.pdf",
                "_blank"
              )
            }
          >
            Read Whitepaper
          </button>
        </div>
      </div>
    </div>
  );
};

export default Roadmap;
