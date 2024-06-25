type CustomToastProps = {
  title: string;
  message?: string;
};

const CustomToast = ({ title, message }: CustomToastProps) => {
  return (
    <>
      <div className="text-xl font-bold text-black ">{title}</div>
      <div className="self-center text-base font-medium">{message}</div>
    </>
  );
};

export default CustomToast;
