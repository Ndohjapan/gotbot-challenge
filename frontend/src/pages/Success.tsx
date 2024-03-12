import Lottie from "lottie-react";
import SuccessAnimationData from "../assets/lotties/success.json";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";

export default function Success() {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-white">
      <h1 className="mb-4 text-center text-2xl">Account Created Successfully!</h1>
      <p className="mb-12 text-center font-nunito">
        An email has been sent to you. Kindly check to verify your account.
      </p>
      <Lottie
        animationData={SuccessAnimationData}
        style={{ width: 250, height: 250 }}
        autoPlay={true}
        loop={false}
      />
      <div className="mt-4">
        <Button onClick={() => navigate("/")}>Go back to home</Button>
      </div>
    </div>
  );
}
