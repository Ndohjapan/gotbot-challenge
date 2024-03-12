interface TextInputProps {
  placeholder?: string;
  name?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  error?: string;
}

export default function TextArea({
  placeholder,
  name,
  value,
  onChange,
  onFocus,
  error,
}: TextInputProps) {
  return (
    <div className="relative">
      <textarea
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        className={`w-[100%] h-[119px] px-3 py-[14px] border-[1px] border-[#D6D6D6] rounded-md outline-none font-nunito resize-none focus:border-primary ${
          error && "border-red-500"
        }`}
      ></textarea>
    </div>
  );
}
