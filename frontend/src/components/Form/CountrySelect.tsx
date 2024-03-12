import { useState } from "react";
import { ICountry } from "country-state-city";
import ArrowDown from "../../assets/arrow-down.svg";
import ArrowUp from "../../assets/arrow-up.svg";

interface CountrySelectProps {
  placeholder?: string;
  onSelect?: (name: string, value: ICountry) => void;
  dropdownItems: ICountry[];
  name?: string;
  value?: ICountry;
  error?: string;
}

export default function CountrySelect({
  placeholder,
  dropdownItems,
  name,
  error,
  value = {} as ICountry,
  onSelect,
}: CountrySelectProps) {
  const [visible, setVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(value);
  const [search, setSearch] = useState("");

  const handleClick = () => {
    setVisible((prev) => !prev);
  };

  const handleDropdownItemClick = (value: ICountry) => {
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
        {Object.keys(selectedItem).length ? (
          <div className="text-base">{selectedItem.name}</div>
        ) : (
          <div className=" text-[#BBB] text-base">{placeholder}</div>
        )}
        {visible ? <img src={ArrowUp} /> : <img src={ArrowDown} alt="arrow-down" />}
      </div>

      {visible && (
        <div className="absolute w-[100%] top-16 z-10 bg-white min-h-fit max-h-[300px] overflow-auto flex flex-col gap-2 px-6 py-4 border-[1px] border-[#D6D6D6] rounded-md cursor-pointer">
          <div className="w-[100%] h-[48px] flex items-center gap-3 p-3 rounded-md border-[#D6D6D6] border-[1px]">
            <SearchSvg />
            <input
              type="text"
              className="h-[46px] w-[100%] font-nunito outline-none text-[16px]"
              placeholder="Search Country"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {dropdownItems
            .filter((dropdown) => dropdown.name.toLowerCase().startsWith(search.toLowerCase()))
            .map((dropdown, i) => (
              <div
                className="w-[100%] hover:bg-[#E9F6F2] rounded-md p-3 font-nunito text-[#2B2B2B] flex items-center gap-2"
                key={`dropdown-${i}`}
                onClick={() => handleDropdownItemClick(dropdown)}
              >
                <p className="text-[20px]">{dropdown.flag}</p>
                {dropdown.name}
                <span className="text-[#BBB] text-[15px]">
                  (
                  {!dropdown.phonecode.startsWith("+")
                    ? `+${dropdown.phonecode}`
                    : dropdown.phonecode}
                  )
                </span>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

function SearchSvg() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M20.0308 20.7901C20.4908 21.2501 21.2008 20.5401 20.7408 20.0901L16.9908 16.3301C18.3063 14.8746 19.0334 12.9819 19.0308 11.0201C19.0308 6.63006 15.4608 3.06006 11.0708 3.06006C6.68084 3.06006 3.11084 6.63006 3.11084 11.0201C3.11084 15.4101 6.68084 18.9801 11.0708 18.9801C13.0508 18.9801 14.8808 18.2501 16.2808 17.0401L20.0308 20.7901ZM4.10984 11.0201C4.10984 7.18006 7.23984 4.06006 11.0698 4.06006C14.9098 4.06006 18.0298 7.18006 18.0298 11.0201C18.0298 14.8601 14.9098 17.9801 11.0698 17.9801C7.23984 17.9801 4.10984 14.8601 4.10984 11.0201Z"
        fill="#BBBBBB"
      />
    </svg>
  );
}
