interface TooltipProps {
  message: string;
  children: React.ReactNode;
}

export default function Tooltip({ message, children }: TooltipProps) {
  return (
    <div className="group relative  overflow-visible flex">
      {children}
      <span className="absolute top-5 scale-0 transition-all rounded-xl group-hover:scale-100 break-words whitespace-normal justify-center p-3.5 text-base font-medium text-black bg-white  border border-solid shadow-sm border-stone-300 max-w-52 ">
        <p className=" min-w-48">{message}</p>
      </span>
    </div>
  );
}
