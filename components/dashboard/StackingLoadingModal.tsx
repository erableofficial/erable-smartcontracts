import { Info, LoaderCircle } from "lucide-react";
import React from "react";

type ButtonProps = {
  children: React.ReactNode;
  variant: "primary" | "secondary";
  onClick?: () => void;
};

const Button: React.FC<ButtonProps> = ({ children, variant, onClick }) => (
  <button
    onClick={onClick}
    className={`px-5 py-3 rounded-lg border-2 border-black border-solid ${
      variant === "primary" ? "bg-emerald-200" : "bg-white"
    }`}
  >
    {children}
  </button>
);

type InfoBoxProps = {
  text: string;
};

const InfoBox: React.FC<InfoBoxProps> = ({ text }) => (
  <div className="flex gap-1.5 px-2.5 py-1 font-medium bg-orange-100 rounded">
    <Info width={17} height={17} color="#000000" />
    <div>{text}</div>
  </div>
);

const SignLoadingModal: React.FC = () => {
  return (
    <div className=" mt-14 mx-auto flex flex-col items-center p-10 text-lg font-semibold text-black bg-white rounded-3xl border border-solid border-stone-300 max-w-[650px] max-md:px-5">
      <LoaderCircle width={43} height={43} className="animate-spin" />
      <h1 className="mt-10 text-3xl">Staking en cours on polygon</h1>
      <InfoBox text="Please connect your wallet to sign the transaction" />
      <p className="self-stretch mt-5 font-medium text-center max-md:max-w-full">
        Please wait a moment. This can take a few minutes.
      </p>
      <section className="flex gap-2.5 justify-center mt-10 text-base text-black">
        <Button variant="secondary">Read tutorial</Button>
        <Button variant="primary">Bridge my $CLAP</Button>
      </section>
    </div>
  );
};

export default SignLoadingModal;
