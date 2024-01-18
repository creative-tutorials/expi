import { useState } from "react";
import { useImgArr } from "@/hooks/img";
import { EyeOff, Eye, Clipboard, ClipboardCheckIcon } from "lucide-react";
import { toast } from "sonner";
import { CreditCardProps } from "@/app/types/card";

export function CreditCard({ account }: CreditCardProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [cardImage, setCardImage] = useState("card1.jpg");
  const [isHidden, setIsHidden] = useState(true);
  const [rotationX, setRotationX] = useState(0);
  const [rotationY, setRotationY] = useState(0);

  const handleMouseEnter = () => {};
  const handleMouseLeave = () => {
    // reset rotation
    setRotationX(0);
    setRotationY(0);
  };

  const handleMouseMove = (e: {
    currentTarget: { getBoundingClientRect: () => any };
    clientY: number;
    clientX: number;
  }) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const cardCenterX = rect.left + rect.width / 2;
    const cardCenterY = rect.top + rect.height / 2;
    const newRotationX = (e.clientY - cardCenterY) / 10;
    const newRotationY = (e.clientX - cardCenterX) / 10;
    setRotationX(newRotationX);
    setRotationY(newRotationY);
  };

  const RandomCardImage = () => {
    const randomIndex = Math.floor(Math.random() * useImgArr().length);
    setCardImage(useImgArr()[randomIndex]);
  };

  const copyText = () => {
    try {
      navigator.clipboard.writeText(account.card_number);
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 800);
    } catch (err) {
      console.error(err);
      toast.error("Error copying text", {
        action: {
          label: "Retry",
          onClick: () => copyText(),
        },
      });
      setIsCopied(false);
    }
  };

  return (
    <div
      id="card"
      className="p-4 mt-8 w-full bg-cover md:h-full lg:h-full h-56 md:max-h-[300px] lg:max-h-[300px] md:max-w-[500px] lg:max-w-[500px] relative flex items-center justify-center rounded-lg shadow-md"
      style={{
        backgroundImage: `url('/credit card/${cardImage}')`,
        filter: "grayscale(100%)",
        transition: "transform 0.3s",
        transformStyle: "preserve-3d",
        transform: `perspective(1000px) rotateX(${rotationX}deg) rotateY(${rotationY}deg)`,
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      <div id="open_close" className="absolute top-2 left-5">
        {isHidden ? (
          <EyeOff
            className="cursor-pointer"
            onClick={() => setIsHidden(false)}
          />
        ) : (
          <Eye className="cursor-pointer" onClick={() => setIsHidden(true)} />
        )}
      </div>
      <div
        id="mcard"
        className="absolute top-2 right-5 cursor-pointer"
        onClick={RandomCardImage}
      >
        <svg
          width="45"
          height="45"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g fill="currentColor" fillRule="evenodd">
            <circle cx="7" cy="12" r="7" />
            <circle cx="17" cy="12" r="7" fillOpacity=".8" />
          </g>
        </svg>
      </div>
      <div id="card-info" className="mt-auto flex flex-col gap-4">
        <div id="top-info" className="w-full flex justify-between">
          <h2 id="card-number" className="text-2xl font-medium select-none">
            {isHidden ? "XXXX-XXXX-XXXX-XXXX" : account.card_number}
          </h2>
          {isCopied ? (
            <ClipboardCheckIcon className="cursor-pointer w-4 h-4" />
          ) : (
            <Clipboard className="cursor-pointer w-4 h-4" onClick={copyText} />
          )}
        </div>
        <div id="bottom-info" className="flex justify-between">
          <h3 id="card-holder-name" className="select-none">
            {account.card_name}
          </h3>
          <h3 id="card-expiry" className="select-none">
            {account.expiry}
          </h3>
        </div>
      </div>
    </div>
  );
}
