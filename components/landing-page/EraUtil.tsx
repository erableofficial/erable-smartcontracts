import * as React from "react";

interface CardProps {
  imageSrc: string;
  title: string;
  description: string;
}

const Card: React.FC<CardProps> = ({ imageSrc, title, description }) => (
  <article className="flex flex-col w-[33%] max-md:ml-0 max-md:w-full">
    <div className="flex flex-col grow p-6 w-full bg-white rounded-3xl border border-solid border-zinc-300 max-md:px-5 max-md:mt-10">
      <div className="flex justify-center items-center px-3 bg-surface-500 h-[45px] rounded-[37.5px] w-[45px]">
        <img
          loading="lazy"
          src={imageSrc}
          alt=""
          className="w-full aspect-square"
        />
      </div>
      <h3 className="mt-3.5 text-2xl font-semibold text-black">{title}</h3>
      <p className="mt-8 text-lg font-medium text-black">{description}</p>
    </div>
  </article>
);

const EraUtil: React.FC = () => (
  <div className="flex flex-col justify-center py-20 bg-stone-50">
    <section className="flex flex-col justify-center items-center px-20 mt-2.5 w-full rounded-3xl max-md:px-5 max-md:max-w-full">
      <h1 className="justify-center px-2.5 text-5xl font-extrabold text-black bg-surface-500 rounded-lg max-md:text-4xl">
        $ERA utilities
      </h1>
      <p className="mt-10 text-lg font-medium text-center text-black w-[1013px] max-md:max-w-full">
        $ERA embodies our commitment to fair value redistribution across Erable°
        and its brands. By holding and using $ERA, you are directly
        participating in and benefiting from the value we create together,
        fostering a collaborative and inclusive financial ecosystem.
      </p>
      <div className="justify-between self-stretch py-4 mx-2.5 mt-10 max-md:max-w-full">
        <div className="flex gap-5 max-md:flex-col max-md:gap-0">
          <Card
            imageSrc="https://cdn.builder.io/api/v1/image/assets/TEMP/940395528fb1f3bb2fefa530402327e5de7252c14248039e9117466fabee19fa?apiKey=b5a3f3b9a2da4a44aeb72712ff03a4c3&"
            title="Access Services"
            description="Hold $ERA to unlock all our products & services, whether you're an investor, project, or partner."
          />
          <Card
            imageSrc="https://cdn.builder.io/api/v1/image/assets/TEMP/95d7133bd871dc0e4673208a909eb03aaa9acf5a20a00543c55b0be2e7a4a2a6?apiKey=b5a3f3b9a2da4a44aeb72712ff03a4c3&"
            title="Earn $ERA"
            description="Get rewarded for ecosystem growth through contributions, LP farming, staking, and platform perks."
          />
          <Card
            imageSrc="https://cdn.builder.io/api/v1/image/assets/TEMP/e9c18b426d4ac42a5cc229cfa4b01f7681723135c7640905d54859b5a2f24356?apiKey=b5a3f3b9a2da4a44aeb72712ff03a4c3&"
            title="Govern with $ERA"
            description="Have a say in our strategic directions and supported projects, ensuring we stay true to our shared values."
          />
        </div>
      </div>
      <div className="flex gap-5 justify-center mt-10 text-lg font-semibold tracking-wide leading-5 text-stone-900">
        <button className="justify-center px-7 py-4 bg-emerald-200 rounded-xl border-solid border-[3px] border-stone-900 max-md:px-5">
          Buy $ERA
        </button>
        <button className="justify-center px-7 py-4 rounded-xl border-solid bg-emerald-200 bg-opacity-0 border-[3px] border-stone-900 max-md:px-5">
          Read the Whitepaper
        </button>
      </div>
    </section>
  </div>
);

export default EraUtil;
