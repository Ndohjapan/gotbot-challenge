import PlusCircle from "../../assets/dashboard/plus-circe.svg";

interface AddButtonProps {
  onClick?: () => void;
  text: string;
}

export default function AddButton({ onClick, text }: AddButtonProps) {
  return (
    <div
      className="flex flex-row items-center gap-2 cursor-pointer rounded-md hover:bg-gray-100 p-4"
      onClick={() => {
        onClick && onClick();
      }}
    >
      <img src={PlusCircle} alt="plus-cirlce" />
      <p className="font-nunito text-[14px] text-[#2B6C57]">{text}</p>
    </div>
  );
}
