import Button from "./Button";

interface SectionProps {
  image: string;
  imageBg?: string;
  title: string;
  content: string;
  hasButton?: boolean;
  onClick?: () => void;
}

export default function Section({ image, imageBg, title, content, hasButton }: SectionProps) {
  return (
    <div className="flex justify-between items-center w-[100%] mt-20 mx-20 max-lg:flex-col max-lg:mx-2 max-lg:items-stretch">
      <div className="max-w-[406px] flex flex-col gap-4">
        <h2 className="text-primary text-[32px] font-fredoka font-bold max-md:text-[24px]">
          {title}
        </h2>
        <p className="font-fredoka text-[#555]">{content}</p>
        <div className="w-[160px]">{hasButton && <Button>Get Started</Button>}</div>
      </div>
      <div className="relative mr-32 max-lg:mr-0 max-lg:ml-auto max-lg:mt-4">
        {Boolean(imageBg) && (
          <img
            src={imageBg}
            alt="section-image-background"
            className="object-contain absolute z-[1]"
          />
        )}
        <img src={image} alt="section-image" className="z-10 relative" />
      </div>
    </div>
  );
}
