interface TextInputProps {
  placeholder?: string;
  secure?: boolean;
  rightIcon?: string;
  onRightIconClick?: () => void;
  showPass?: boolean;
  name?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: string;
}

export default function TextInput({
  placeholder,
  secure,
  rightIcon,
  showPass,
  onRightIconClick,
  name,
  value,
  onChange,
  onFocus,
  error,
}: TextInputProps) {
  return (
    <div className="relative">
      <input
        name={name}
        type={secure && !showPass ? "password" : "text"}
        className={`w-[422px] max-md:w-[100%] px-[10px] py-[14px] border-[1px] border-[#D6D6D6] rounded-md outline-none font-nunito focus:border-primary ${
          error && "border-red-500"
        }`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
      />
      {rightIcon && (
        <div className="absolute top-4 right-4 cursor-pointer" onClick={onRightIconClick}>
          <img src={rightIcon} alt="icon" />
        </div>
      )}
    </div>
  );
}
