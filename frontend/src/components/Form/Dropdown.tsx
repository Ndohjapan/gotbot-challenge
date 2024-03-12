import { useState } from "react";
import ArrowDown from "../../assets/arrow-down.svg";
import ArrowUp from "../../assets/arrow-up.svg";

interface DropdownProps {
  placeholder?: string;
  onSelect?: (name: string, value: string) => void;
  dropdownItems: string[];
  name?: string;
  value?: string;
  error?: string;
}

export default function Dropdown({
  placeholder,
  dropdownItems,
  name,
  error,
  value = "",
  onSelect,
}: DropdownProps) {
  const [visible, setVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(value);

  const handleClick = () => {
    setVisible((prev) => !prev);
  };

  const handleDropdownItemClick = (value: string) => {
    setSelectedItem(value);
    handleClick();

    if (onSelect) {
      if (!name) throw new Error("no name exists on field");
      onSelect(name, value);
    }
  };

  return (
    <div className="relative" itemType="dropdown">
      <div
        tabIndex={0}
        className={`flex flex-row items-center justify-between w-[422px] max-md:w-[100%] px-[10px] py-[14px] border-[1px] border-[#D6D6D6] rounded-md outline-none font-nunito focus:border-primary ${
          error && "border-red-500"
        } cursor-pointer`}
        onClick={handleClick}
        itemType="dropdown"
      >
        {selectedItem ? (
          <div className="text-base">{selectedItem}</div>
        ) : (
          <div className=" text-[#BBB] text-base">{placeholder}</div>
        )}
        {visible ? <img src={ArrowUp} /> : <img src={ArrowDown} alt="arrow-down" />}
      </div>

      {visible && (
        <div className="absolute w-[100%] top-16 z-10 bg-white min-h-fit max-h-[300px] overflow-auto flex flex-col gap-2 px-6 py-4 border-[1px] border-[#D6D6D6] rounded-md cursor-pointer">
          {dropdownItems.map((dropdown, i) => (
            <div
              className="w-[100%] hover:bg-[#E9F6F2] rounded-md p-3 font-nunito text-[#2B2B2B]"
              key={`dropdown-${i}`}
              onClick={() => handleDropdownItemClick(dropdown)}
            >
              {dropdown}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
