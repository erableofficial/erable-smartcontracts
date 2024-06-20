import React from "react";

interface InfoTextProps {
  bgColor: string;
  Icon: React.ReactNode;
  text: string;
}

const InfoText: React.FC<InfoTextProps> = ({ bgColor, Icon, text }) => {
  return (
    <div
      className={`flex gap-1.5 px-2.5 items-center py-1 text-lg font-medium text-black ${bgColor} rounded w-fit`}
    >
      {Icon}
      <p>{text}</p>
    </div>
  );
};

export default InfoText;
