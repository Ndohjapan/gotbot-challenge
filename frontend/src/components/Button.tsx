import { ReactNode } from "react";
import { BeatLoader } from "react-spinners";

interface ButtonProps {
  children: ReactNode;
  inverted?: boolean;
  bgColor?: string;
  textColor?: string;
  alternateFont?: "nunito";
  onClick?: () => void;
  loading?: boolean;
  width?: string;
  height?: string;
}

export default function Button({
  children,
  inverted = false,
  bgColor,
  textColor,
  alternateFont,
  onClick,
  width,
  height,
  loading = false,
}: ButtonProps) {
  const txtColor = textColor ? textColor : inverted ? "text-primary" : "text-white";
  const w = `w-[${width}]`;
  const h = `h-[${height}]`;

  return (
    <div
      className={`${width ? w : "min-w-[150px]"} max-w-[100%] ${
        height ? h : "h-[60px]"
      }  px-[30px] ${
        height ? "py-[8px]" : "py-[14px]"
      } bg-primary cursor-pointer rounded-md flex justify-center items-center border-[1.5px] border-primary ${
        inverted && "bg-transparent"
      } ${bgColor && bgColor} ${txtColor} ${alternateFont && "font-nunito"} `}
      onClick={() => {
        if (loading) return;
        onClick?.();
      }}
      aria-disabled={loading}
    >
      {!loading && children}
      {loading && <BeatLoader color="white" loading={loading} />}
    </div>
  );
}
