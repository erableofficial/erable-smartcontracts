import { TriangleAlert } from "lucide-react";

type ErrorBoxProps = {
  text: string;
  bgColor: string;
};

const ErrorBox: React.FC<ErrorBoxProps> = ({ text, bgColor }) => (
  <div
    className={`flex gap-1.5 px-2.5 py-1 font-medium ${bgColor} rounded font-NeueHaas text-lg leading-[21.6px] `}
  >
    <div>
      <TriangleAlert width={17} height={17} color="#000000" />
    </div>
    <div>{text}</div>
  </div>
);


export default ErrorBox;