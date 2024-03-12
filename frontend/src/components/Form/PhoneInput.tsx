interface TextInputProps {
  placeholder?: string;
  name?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: string;
  flag: string;
  code: string;
}

export default function PhoneInput({
  placeholder,
  flag,
  code = "",
  name,
  value,
  onChange,
  onFocus,
  error,
}: TextInputProps) {
  const phoneCode: string = code.length ? (code.startsWith("+") ? code : `+${code}`) : "";

  return (
    <div className="relative">
      <div className="flex border-[1px] border-[#D6D6D6] rounded-md overflow-hidden">
        <div className="w-[95px] flex justify-center items-center gap-2 border-r-[1px] border-[#D6D6D6]">
          <p className="text-[30px]">{flag}</p>
        </div>
        <div className="w-min pl-1 min-h-[100%] flex items-center justify-center">
          <p className="font-nunito">{phoneCode}</p>
        </div>
        <input
          name={name}
          type="text"
          className={`w-[422px] max-md:w-[100%] px-[10px] py-[14px] rounded-md outline-none font-nunito focus:border-primary ${
            error && "border-red-500"
          }`}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={onFocus}
        />
      </div>
    </div>
  );
}
