import { useNavigate } from "react-router-dom";

export default function BackButton() {
  const navigate = useNavigate();

  return (
    <div
      className="flex items-center gap-1 cursor-pointer"
      onClick={() => {
        navigate(-1);
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="25"
        viewBox="0 0 24 25"
        fill="none"
      >
        <path
          d="M14 7.5L9 12.5L14 17.5"
          stroke="#2B6C57"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <p className="font-nunito text-primary text-[18px]">Back</p>
    </div>
  );
}
