import { Minus, Plus } from "lucide-react";
import Link from "next/link";
import React from "react";

interface LinkSectionProps {
  title: string;
  links: Array<{ label: string; url: string }>;
}

const LinkSection: React.FC<LinkSectionProps> = ({ title, links }) => (
  <section>
    <div className="text-lg font-bold tracking-wide leading-7 text-stone-900">
      {title}
    </div>
    <ul style={{ listStyleType: "disc", marginLeft: "20px" }}>
      {links.map((link, index) => (
        <li key={index}>
          <a
            href={link.url === "NO LINK" ? "# " : link.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {link.label}
          </a>
        </li>
      ))}
    </ul>
  </section>
);

interface OfficialLinksProps {}

const OfficialLinks: React.FC<OfficialLinksProps> = ({}) => {
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

  const linkSections = [
    {
      title: "",
      links: [
        { label: "Website", url: "https://www.erable.com/" },
        { label: "Whitepaper", url: "NO LINK" },
        { label: "Github", url: "NO LINK" },
      ],
    },
    {
      title: "$ERA INFOS",
      links: [
        { label: "ERC20 contract on PolygonScan", url: "NO LINK" },
        { label: "$ERA on CoinMarketCap", url: "NO LINK" },
        { label: "$ERA on CoinGecko", url: "NO LINK" },
      ],
    },
    {
      title: "IMPACT FUNDING PLATFORMS",
      links: [
        { label: "era°app", url: "https://app.erable.com/" },
        { label: "WE DO GOOD", url: "https://wedogood.co/" },
        { label: "Keenest", url: "https://www.keenest.co/" },
      ],
    },
    {
      title: "SOCIAL MEDIA",
      links: [
        { label: "Discord", url: "PLACEHOLDER" },
        { label: "Twitter", url: "https://twitter.com/erableofficial" },
        { label: "LinkedIn", url: "https://www.linkedin.com/company/erable/" },
        { label: "YouTube", url: "https://www.youtube.com/@erableofficial" },
        { label: "Medium", url: "https://erableofficial.medium.com/" },
        { label: "Newsletter", url: "https://urlz.fr/o1BO" },
      ],
    },
  ];
  return (
    <div className="max-md:px-5 w-full flex justify-center">
      <div
        className="flex flex-col cursor-pointer justify-center px-6 py-4 mt-6 w-full bg-white rounded-2xl border border-solid border-stone-300 max-w-[1259px] max-md:px-5 max-md:max-w-full"
        onClick={toggleOpen}
      >
        <div className="flex flex-col  justify-between max-md:flex-wrap max-md:max-w-full">
          <div className="flex justify-between">
            <div className="my-auto text-2xl font-semibold text-neutral-700 max-md:max-w-full">
              Official links
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
            <main className="mt-6 max-md:max-w-full">
              {linkSections.map((section, index) => (
                <LinkSection
                  key={index}
                  title={section.title}
                  links={section.links}
                />
              ))}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfficialLinks;
