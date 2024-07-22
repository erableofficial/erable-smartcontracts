import Link from "next/link";

type CustomToastProps = {
  title: string;
  message?: string;
  error?: boolean;
};

const CustomToast = ({ title, message, error }: CustomToastProps) => {
  return (
    <>
      <div className="text-xl font-bold text-black ">{title}</div>
      <div className="self-center text-base font-medium">{message}</div>
      {error && (
        <a
          href="mailto:token@erable.com"
          className="text-base font-medium text-blue-500 underline"
        >
          Contact support
        </a>
      )}
    </>
  );
};

export default CustomToast;
