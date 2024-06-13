import React from "react";

interface MemberCardProps {
  imgSrc: string;
  imgAlt: string;
  title: string;
  tag: string;
  description: string;
  contact: string;
}

const MemberCard: React.FC<MemberCardProps> = ({
  imgSrc,
  imgAlt,
  title,
  tag,
  description,
  contact,
}) => (
  <article className="flex flex-col grow mx-auto w-full bg-white rounded-[30px] max-md:mt-6">
    <img
      loading="lazy"
      src={imgSrc}
      alt={imgAlt}
      className="w-full border border-solid rounded-2xl aspect-[1.1] border-neutral-400"
    />
    <div className="flex gap-2 justify-between mt-6 text-black whitespace-nowrap">
      <div className="text-2xl font-semibold">{title}</div>
      <div className="justify-center px-2.5 py-1 my-auto text-xs font-medium bg-yellow-200 border border-black border-solid rounded-[38px]">
        {tag}
      </div>
    </div>
    <div className="mt-3 text-base font-medium text-black">{description}</div>
    <div className="flex gap-3 justify-center mt-6">
      <div className="flex flex-col justify-center">
        <div className="shrink-0 rounded-full border border-solid bg-zinc-300 border-neutral-500 h-[30px] stroke-[0.769px] w-[30px]" />
      </div>
      <div className="my-auto text-lg font-medium text-black">{contact}</div>
    </div>
  </article>
);

const members = [
  {
    imgSrc:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/000ceee645afbaefb8bf1d3d255c59ac1d179dceae11bcc99bbbcaec02341f03?apiKey=b5a3f3b9a2da4a44aeb72712ff03a4c3&",
    imgAlt: "Image of Team Member 1",
    title: "erable.com",
    tag: "tech",
    description:
      "Massa gravida quam massa gravida quam massa gravida quam massa",
    contact: "Personne à contacter + contact",
  },
  {
    imgSrc:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/40c216e33f013067e9a692d6268ba82c438f66dca96bd86b8c8a7dbf97e8511d?apiKey=b5a3f3b9a2da4a44aeb72712ff03a4c3&",
    imgAlt: "Image of Team Member 2",
    title: "erable.com",
    tag: "tech",
    description:
      "Massa gravida quam massa gravida quam massa gravida quam massa",
    contact: "Personne à contacter + contact",
  },
  {
    imgSrc:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/e62ef85913914bcf91655d1960ce48433e6f5171545286787bbb3bcc6aa53ba3?apiKey=b5a3f3b9a2da4a44aeb72712ff03a4c3&",
    imgAlt: "Image of Team Member 3",
    title: "erable.com",
    tag: "tech",
    description:
      "Massa gravida quam massa gravida quam massa gravida quam massa",
    contact: "Personne à contacter + contact",
  },
  {
    imgSrc:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/2d178d797158227ba11ea5a5b6363a0627a21818bde9532523d60669d10b8fac?apiKey=b5a3f3b9a2da4a44aeb72712ff03a4c3&",
    imgAlt: "Image of Team Member 4",
    title: "erable.com",
    tag: "tech",
    description:
      "Massa gravida quam massa gravida quam massa gravida quam massa",
    contact: "Personne à contacter + contact",
  },
];

const OurTeam: React.FC = () => (
  <div className="flex flex-col justify-center p-20 bg-white max-md:px-5">
    <header className="self-start px-2.5 mt-2.5 ml-2.5 text-5xl font-extrabold text-black bg-yellow-200 rounded-xl">
      Our team
    </header>
    <section className="mx-2.5 mt-12 max-md:mt-10 max-md:max-w-full">
      <div className="flex gap-5 max-md:flex-col max-md:gap-0">
        {members.map((member) => (
          <div
            key={member.imgSrc}
            className="flex flex-col w-3/12 max-md:w-full"
          >
            <MemberCard
              imgSrc={member.imgSrc}
              imgAlt={member.imgAlt}
              title={member.title}
              tag={member.tag}
              description={member.description}
              contact={member.contact}
            />
          </div>
        ))}
      </div>
    </section>
  </div>
);

export default OurTeam;
