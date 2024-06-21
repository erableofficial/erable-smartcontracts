import { Minus, Plus } from "lucide-react";
import Link from "next/link";
import React from "react";

type OfficialLinksProps = {};

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
  return (
    <div className="flex flex-col justify-center px-6 py-4 mt-6 w-full bg-white rounded-2xl border border-solid border-stone-300 max-w-[1259px] max-md:px-5 max-md:max-w-full">
      <div className="flex flex-col  justify-between max-md:flex-wrap max-md:max-w-full">
        <div className="flex justify-between">
          <div className="my-auto text-2xl font-semibold text-black max-md:max-w-full">
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
          <div className="mt-4 text-sm text-gray-700">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </div>

          <div className="self-start pb-1.5 mt-6 text-lg font-semibold text-black ">
            <Link
              href=""
              className="pb-1.5 mt-6 text-lg font-semibold text-black border-b-2 border-black"
            >
              Read more
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfficialLinks;
