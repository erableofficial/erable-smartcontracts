export default function Loading({
  className,
  fullScreenLoading,
}: {
  className?: string;
  fullScreenLoading?: boolean;
}) {
  if (fullScreenLoading) {
    return (
      <div className="h-screen w-full flex justify-center items-center">
        <div
          className={`
                w-24 h-24 border-4 border-t-surface-primary border-r-surborder-t-surface-primary border-b-purple border-l-purple rounded-full animate-spin
                ${className}
                `}
        ></div>
      </div>
    );
  } else {
    return (
      <div
        className={`
            w-16 h-16 border-4 border-t-surface-primary border-r-surface-primary rounded-full animate-spin
            ${className}
            `}
      ></div>
    );
  }
}

{
  /* <div className="h-screen w-full flex justify-center items-center">
<div className="w-20 h-20 border-4 border-t-surface-primary border-r-surborder-t-surface-primary border-b-purple border-l-purple rounded-full animate-spin"></div>
</div> */
}
