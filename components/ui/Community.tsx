import * as React from "react";

interface SectionContentProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const SectionContent: React.FC<SectionContentProps> = ({
  title,
  description,
  icon,
}) => {
  return (
    <section className="flex flex-col w-full justify-between p-6 mx-auto bg-white rounded-xl border border-solid border-stone-300 max-md:px-5 max-md:mt-6">
      <div className="flex gap-0 justify-between">
        <h2 className="flex-1 text-3xl font-semibold text-black">{title}</h2>
        <div className="flex flex-col justify-center items-center px-5 rounded-full border border-solid bg-zinc-300 border-neutral-500 h-[39px] w-[39px]">
          {icon}
        </div>
      </div>
      <p className="mt-9 text-lg font-medium text-black max-md:mt-10">
        {description}
      </p>
    </section>
  );
};

const iconPlaceholder = (
  <div className="shrink-0 rounded-full border border-solid bg-zinc-300 border-neutral-500 h-[39px] stroke-[1px] w-[39px]" />
);

export default function Community() {
  return (
    <main className="flex justify-center items-center px-16 py-20 bg-white max-md:px-5">
      <div className="flex flex-col mt-2.5 w-full max-w-[1038px] max-md:max-w-full">
        <header className="flex justify-center self-center px-2.5 text-5xl font-extrabold text-black bg-yellow-200 rounded-xl max-md:max-w-full max-md:text-4xl">
          Join Our Community
        </header>
        <section className="mt-14 flex flex-col max-md:mt-10 max-md:max-w-full">
          <div className="flex gap-5 max-md:flex-col max-md:gap-0 w-full">
            <section className="flex flex-col w-full  max-md:ml-0 max-md:w-full">
              <p className="justify-center items-center px-6 w-full text-lg font-semibold text-black bg-yellow-200 rounded-xl border border-solid aspect-square border-zinc-300 max-md:px-5 max-md:mt-6">
                erable° is redefining sustainability and impact investing by
                leveraging blockchain technology to build a comprehensive
                ecosystem of contributors and investors aimed at systemic
                change. We are committed to creating a participatory investment
                landscape where all contributions are valued and governance is
                shared, supported by our DAO and token mechanism.
              </p>
            </section>
            <SectionContent
              title="Impact Investors"
              description="Join a community of like-minded impact investors committed to driving systemic change through sustainable investments. Collaborate and contribute to projects that align with your values and investment goals."
              icon={iconPlaceholder}
            />
            <SectionContent
              title="Impact Entrepreneurs"
              description="Become part of a network of impact entrepreneurs who are creating innovative solutions to global challenges. Share your vision, gain support, and leverage our ecosystem to scale your impact-driven projects."
              icon={iconPlaceholder}
            />
          </div>
        </section>
        <section className="mt-6 bg-stone-50 flex flex-col max-md:max-w-full">
          <div className="flex gap-5 max-md:flex-col max-md:gap-0 w-full">
            <SectionContent
              title="Impact Support Partnership"
              description="Partner with us to support impactful initiatives and contribute to a sustainable future. Whether you're an organization or individual, your partnership helps drive meaningful change and supports our mission."
              icon={iconPlaceholder}
            />
            <SectionContent
              title="Community Supporters"
              description="Engage with our community as a supporter or member of the general public. Participate in discussions, provide feedback, and help shape the future of sustainable impact investing."
              icon={iconPlaceholder}
            />
            <SectionContent
              title="Financial Product Providers"
              description="Collaborate with us as a provider of impact financial products. Offer your expertise and products to our community, and help create a diverse and inclusive financial ecosystem that prioritizes sustainability and impact."
              icon={iconPlaceholder}
            />
          </div>
        </section>
        <section className="flex gap-5 justify-center self-center mt-14 text-lg font-semibold tracking-wide leading-5 text-stone-900 max-md:mt-10">
          <button className="justify-center px-7 py-4 bg-emerald-200 rounded-xl border-solid border-[3px] border-stone-900 max-md:px-5">
            Join now
          </button>
          <button className="justify-center px-7 py-4 rounded-xl border-solid bg-emerald-200 bg-opacity-0 border-[3px] border-stone-900 max-md:px-5">
            Our Community Manifesto
          </button>
        </section>
      </div>
    </main>
  );
}
