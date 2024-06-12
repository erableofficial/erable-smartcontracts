import * as React from "react";

interface UtilityCardProps {
  title: string;
  description: string;
  imageUrl: string;
  bgColor: string;
}

const UtilityCard: React.FC<UtilityCardProps> = ({
  title,
  description,
  imageUrl,
  bgColor,
}) => (
  <div
    className={`flex flex-col p-6 ${bgColor} rounded-2xl border border-solid border-stone-300 max-md:px-5`}
  >
    <div className="flex gap-5 justify-between font-semibold">
      <h3 className="text-2xl text-black">{title}</h3>
      <button className="pb-1.5 my-auto text-base text-black border-b-2 border-black border-solid">
        Learn more
      </button>
    </div>
    <p className="mt-6 text-lg font-medium text-neutral-500">{description}</p>
    <img
      loading="lazy"
      src={imageUrl}
      alt={`${title} illustration`}
      className="mt-16 w-full aspect-[1.15] max-md:mt-10"
    />
  </div>
);

const IconButton: React.FC<{ src: string; alt: string; bgClass: string }> = ({
  src,
  alt,
  bgClass,
}) => (
  <div
    className={`flex justify-center items-center p-3.5 ${bgClass} h-[57px] rounded-[47.25px] w-[57px]`}
  >
    <img
      loading="lazy"
      src={src}
      alt={alt}
      className="aspect-square w-[30px]"
    />
  </div>
);

const OurLiveUtil: React.FC = () => (
  <div className="flex justify-center items-center px-16 py-20 bg-white max-md:pl-5">
    <div className="mt-2.5 w-full max-w-[1350px] max-md:max-w-full">
      <div className="flex gap-5 max-md:flex-col max-md:gap-0">
        <section className="flex flex-col w-[31%] max-md:ml-0 max-md:w-full">
          <div className="flex flex-col grow justify-between self-stretch max-md:mt-10">
            <h2 className="justify-center px-2.5 text-5xl font-extrabold text-black bg-surface-500 rounded-xl max-md:text-4xl">
              Our Live Utilities
            </h2>
            <p className="mt-10 text-lg font-medium text-black">
              Explore our live utilities and engage with our token to unlock the
              full experience.
            </p>
            <button className="justify-center self-start px-7 py-4 mt-10 text-lg font-semibold tracking-wide leading-5 bg-emerald-200 rounded-xl border-solid border-[3px] border-stone-900 text-stone-900 max-md:px-5">
              Open dashboard
            </button>
            <div className="flex gap-5 justify-between mt-52 w-full max-md:mt-10">
              <span className="my-auto text-2xl leading-6 text-black">1/4</span>
              <div className="flex gap-2.5">
                <IconButton
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/3f2a4ba08aedcd9c0ae133d9784c1df7a7136a18eef67bacf99a53eee8d4fa07?apiKey=b5a3f3b9a2da4a44aeb72712ff03a4c3&"
                  alt="Utility 1"
                  bgClass="bg-zinc-100"
                />
                <IconButton
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/0ca04a4a9feacce3f8fd2b86d923d8b97dd6f0a1265abc843025238cc147f918?apiKey=b5a3f3b9a2da4a44aeb72712ff03a4c3&"
                  alt="Utility 2"
                  bgClass="bg-surface-500"
                />
              </div>
            </div>
          </div>
        </section>
        <section className="flex flex-col ml-5 w-[69%] max-md:ml-0 max-md:w-full">
          <div className="flex grow gap-5 justify-between max-md:flex-wrap max-md:mt-10 max-md:max-w-full">
            <UtilityCard
              title="Staking"
              description="Earn rewards by locking $ERA tokens in a secure contract, showing your commitment to the ecosystem."
              imageUrl="https://cdn.builder.io/api/v1/image/assets/TEMP/54d6d76fa6832b644844ba43cb463ba4476a05831b8c2f0fb7293187d95f519d?apiKey=b5a3f3b9a2da4a44aeb72712ff03a4c3&"
              bgColor="bg-surface-500"
            />
            <UtilityCard
              title="LP Farming"
              description="Provide liquidity to the $ERA pool on Uniswap and lock it into our farming contract to earn $ERA."
              imageUrl="https://cdn.builder.io/api/v1/image/assets/TEMP/54d6d76fa6832b644844ba43cb463ba4476a05831b8c2f0fb7293187d95f519d?apiKey=b5a3f3b9a2da4a44aeb72712ff03a4c3&"
              bgColor="bg-white"
            />
            <section className="flex flex-col items-start p-6 bg-white rounded-2xl border border-solid border-stone-300">
              <h3 className="text-2xl font-semibold text-black">Earn</h3>
              <p className="mt-6 text-lg font-medium text-neutral-500">
                Contribute actively in our growing community to earn $ERA
                tokens. Your contributions are valued and recognized.
              </p>
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/bc40761046240c5f39835e426dbc32bf09a43315fc435d4151b43231acb47f7f?apiKey=b5a3f3b9a2da4a44aeb72712ff03a4c3&"
                alt="Earn illustration"
                className="mt-16 aspect-[0.22] w-[63px] max-md:mt-10"
              />
            </section>
          </div>
        </section>
      </div>
    </div>
  </div>
);

export default OurLiveUtil;
