import Image from "next/image";
import React from "react";
import BuySeraModal from "./BuySeraModal";
import BridgeProcessModal from "./BridgeProcessModal";

const HeroSection = () => {
  const [toggleBuyEraModal, setToggleBuyEraModal] = React.useState(false);
  const [toggleBridgeProcessModal, setToggleBridgeProcessModal] =
    React.useState(false);

  return (
    <>
      <section className="flex flex-col items-center mt-20 px-20 max-md:px-5 max-md:mt-5">
        <BuySeraModal
          toggleBuyEraModal={toggleBuyEraModal}
          setToggleBuyEraModal={setToggleBuyEraModal}
        />
        <BridgeProcessModal
          toggleBridgeProcessModal={toggleBridgeProcessModal}
          setToggleBridgeProcessModal={setToggleBridgeProcessModal}
        />
        <div className="text-8xl font-extrabold tracking-tighter text-center text-neutral-700 leading-[6.938rem] max-md:max-w-full max-md:text-4xl max-md:leading-[3.438rem]">
          <span
            className="font-bold leading-[6.938rem] "
            data-sal-delay="100"
            data-sal="slide-up"
            data-sal-duration="1000"
          >
            &lt;
          </span>
          <span
            className="leading-[6.938rem] font-friends tracking-[-1.8px]"
            data-sal-delay="100"
            data-sal="slide-up"
            data-sal-duration="1000"
            // data-sal-easing="easeOutQuad"
          >
            Onchain
          </span>
          <span
            className="font-bold leading-[6.938rem]"
            data-sal-delay="100"
            data-sal="slide-up"
            data-sal-duration="1000"
            data-sal-easing="easeOutQuad"
          >
            &gt;
          </span>
        </div>
        <h1
          className="justify-center px-5 mt-5 text-[5.625rem] font-extrabold tracking-[-1.8px] text-center text-neutral-700 bg-surface-500 rounded-2xl leading-[6.75rem] max-md:max-w-full max-md:text-4xl font-friends "
          data-sal-delay="200"
          data-sal="slide-up"
          data-sal-duration="1000"
        >
          Impact Investing
        </h1>
        <p
          className="self-stretch mt-10 mr-2.5 ml-3 text-lg font-medium text-center text-neutral-700 max-md:max-w-full"
          data-sal-delay="300"
          data-sal="slide-up"
          data-sal-duration="1000"
        >
          erable° is a powerhouse for next-gen investment products! <br />{" "}
          <br />
          Our mission? Transforming finance for positive impact in both Web2 and
          Web3. <br />
          Supported by a community and its utility token $ERA.
        </p>
        <div className="flex justify-center items-center self-stretch px-16 mt-10 mr-2.5 ml-3 max-md:px-5 max-md:max-w-full font-friends">
          <div
            className="flex gap-5"
            data-sal-delay="400"
            data-sal="slide-up"
            data-sal-duration="1000"
          >
            <button
              className="justify-center self-start px-7 py-4 text-lg font-semibold text-neutral-700 bg-surface-primary rounded-xl border-black border-solid border-[3px] max-md:px-5 primary-button"
              onClick={() => setToggleBuyEraModal(true)}
            >
              Buy $ERA
            </button>
            <div className="flex flex-col">
              <button
                className="flex flex-col justify-center text-lg font-semibold text-neutral-700 "
                onClick={() => setToggleBridgeProcessModal(true)}
              >
                <span className="secondary-button justify-center px-7 py-4 bg-white rounded-xl border-black border-solid border-[3px] max-md:px-5">
                  Bridge $CLAP
                </span>
              </button>
              <p className="mt-3 text-sm font-medium text-neutral-700">
                *only for CLAP investors
              </p>
            </div>
          </div>
        </div>
        <figure
          className="flex flex-col z-[-1] justify-center px-6 pt-6 mt-10 max-w-full bg-surface-500 rounded-tl-3xl  rounded-tr-3xl w-[68.5%] max-md:px-5"
          data-sal-delay="400"
          data-sal="slide-up"
          data-sal-duration="1000"
        >
          <Image
            src="/images/image 2838.png"
            className="w-full  aspect-[2.5] max-md:max-w-full"
            alt="Descriptive text about the image"
            width={2560}
            height={1029}
          />
        </figure>
      </section>
    </>
  );
};

export default HeroSection;
