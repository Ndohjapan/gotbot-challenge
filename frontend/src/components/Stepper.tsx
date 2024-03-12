interface StepperProps {
  pagesLength: number;
  currrentPageIndex: number;
  pagesText: string[];
}

export default function Stepper({ pagesLength, pagesText, currrentPageIndex }: StepperProps) {
  const lastItemStyle = "relative flex items-center after:content-[''] after:width-full after:h-1";
  const itemStyle =
    "relative flex w-full items-center after:content-[''] after:w-full after:h-[2.3px] after:inline-block";

  return (
    <ul className="flex items-center w-[85%] ml-5">
      {Array.from({ length: pagesLength }).map((_, index) => {
        const pastPage = currrentPageIndex - 1 >= index;

        return (
          <li
            className={`${index === pagesLength - 1 ? lastItemStyle : itemStyle} ${
              pastPage ? "after:bg-primary" : "after:bg-[#EBEBEB]"
            }`}
            key={`step-item-${index}`}
          >
            <div
              className={`flex items-center justify-center rounded-full w-[30px] h-[30px] border-[2px] text-[14px] shrink-0 ${
                pastPage && "bg-primary"
              }
              ${currrentPageIndex === index || pastPage ? "border-primary" : "border-[#EBEBEB]"}
              `}
            >
              <p
                className={`font-nunito font-bold ${
                  currrentPageIndex === index ? "text-primary" : "text-[#EBEBEB]"
                }`}
              >
                {index + 1}
              </p>
            </div>

            <p
              className={`absolute font-nunito text-[12px] text-center -bottom-9 -left-10 min-w-[110px] ${
                currrentPageIndex === index || pastPage ? "text-primary" : "text-[#EBEBEB]"
              }`}
            >
              {pagesText[index]}
            </p>
          </li>
        );
      })}
    </ul>
  );
}
