import * as React from "react";

interface SectionContentProps {
  title: string;
  description: string;
  profilePics: string[];
}

const profilePics = [
  "/images/avatars/1.png",
  "/images/avatars/2.png",
  "/images/avatars/3.png",
];

const SectionContent: React.FC<SectionContentProps> = ({
  title,
  description,
  profilePics,
}) => {
  return (
    <section className="col-span-12 sm:col-span-6 lg:col-span-4 p-6 bg-white rounded-[20px] cursor-pointer border border-solid border-primary flex flex-col justify-between">
      <div className="flex gap-0 justify-between">
        {/* <div> */}
        <div className="flex-1 text-3xl font-semibold text-neutral-700">
          {title}
        </div>

        <div className="flex flex-row justify-center items-center">
          {profilePics.map((pic, index) => (
            <div
              key={index}
              className={`rounded-full h-[2.438rem] w-[2.438rem] flex justify-center items-center border border-solid border-neutral-500 ${
                index > 0 ? "-ml-4" : ""
              } z-${30 - index * 10}`}
              style={{
                backgroundImage: `url(${pic})`,
                backgroundSize: "cover",
              }}
            ></div>
          ))}
        </div>
      </div>
      <p className="text-lg font-medium text-neutral-700 mt-16">
        {description}
      </p>
      {/* </div> */}
    </section>
  );
};

const Community: React.FC = () => {
  return (
    <section className="flex justify-center items-center px-16 py-20 bg-white max-md:px-5">
      <div className="flex flex-col mt-2.5 w-full max-w-[1038px] max-md:max-w-full">
        <h1 className="flex justify-center self-center px-2.5 text-5xl font-extrabold text-neutral-700 bg-surface-500 rounded-xl max-md:max-w-full max-md:text-4xl leading-[4.641rem]">
          Join Our Community
        </h1>
        <div className="mt-14 flex flex-col max-md:mt-10 max-md:max-w-full">
          <div className="grid grid-cols-12 gap-5 w-full">
            <div className="col-span-12 sm:col-span-6 lg:col-span-4">
              <div className="p-6 bg-surface-500 rounded-[20px] cursor-pointer border border-solid border-zinc-300">
                <p className="text-lg font-medium text-neutral-700">
                  erable° is redefining sustainability and impact investing by
                  leveraging blockchain technology to build a comprehensive
                  ecosystem of contributors and investors aimed at systemic
                  change. We are committed to creating a participatory
                  investment landscape where all contributions are valued and
                  governance is shared, supported by our DAO and token
                  mechanism.
                </p>
              </div>
            </div>
            <SectionContent
              title="Impact Investors"
              description="Join a community focused on sustainable investments. Collaborate on projects that align with your values and investment goals."
              profilePics={profilePics}
            />
            <SectionContent
              title="Impact Entrepreneurs"
              description="Join a network of innovators tackling global challenges. Share your ideas, get support, and scale your impact-driven projects."
              profilePics={profilePics}
            />
            {/* </div>
        </div>
        <div className="mt-6 bg-stone-50 flex flex-col max-md:max-w-full">
          <div className="grid grid-cols-12 gap-5 w-full"> */}
            <SectionContent
              title="Impact Partners"
              description="Whether you're an organization or individual, your partnership helps drive meaningful change and supports our mission."
              profilePics={profilePics}
            />
            <SectionContent
              title="Community Supporters"
              description="Engage with our community, participate in discussions, provide feedback, and help shape the future of sustainable impact investing."
              profilePics={profilePics}
            />
            <SectionContent
              title="Financial Partners"
              description="Collaborate with us to offer your impact financial products and expertise, fostering a sustainable financial ecosystem."
              profilePics={profilePics}
            />
          </div>
        </div>
        <div className="flex gap-5 justify-center self-center mt-14 text-lg font-semibold tracking-wide leading-5 text-stone-900 max-md:mt-10">
          <button className="primary-button ">Join Us on Discord</button>
          {/* <button className="secondary-button">Our Community Manifesto</button> */}
        </div>
      </div>
    </section>
  );
};

export default Community;
