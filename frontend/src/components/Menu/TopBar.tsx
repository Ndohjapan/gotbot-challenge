import { useMediaQuery } from "../../hooks/useMediaQuery";
import Button from "../Button";

interface TopBarProps {
  onPublishClick?: () => void;
}

export default function TopBar({ onPublishClick }: TopBarProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <div className="flex flex-row justify-between items-center w-[100%] px-16 max-md:px-6 h-[80px] max-md:min-h-[60px] bg-white">
      <h1 className="text-gray font-nunito text-[20px]">Main Menu</h1>

      <div className="flex flex-row gap-3">
        {!isMobile && (
          <Button inverted width="121px" height="55px">
            Save Changes
          </Button>
        )}

        <Button width={`${isMobile ? "100px" : "121px"}`} height="55px" onClick={onPublishClick}>
          Publish
        </Button>
      </div>
    </div>
  );
}
