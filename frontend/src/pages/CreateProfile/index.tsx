import { useState } from "react";
import Logo from "../../assets/logo.svg";
import Stepper from "../../components/Stepper";
import BusinessDetailsForm from "./BusinessDetailsForm";
import UserDetailsForm from "./UserDetailsForm";
import SocialsForm from "./SocialsForm";
import FadeIn from "react-fade-in/lib/FadeIn";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { authActions } from "../../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";

export default function CreateProfile() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, profileData } = useAppSelector((state) => state.auth);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const next = () => {
    setCurrentStepIndex((prev) => (prev >= 2 ? prev : prev + 1));
  };

  const prev = () => {
    setCurrentStepIndex((prev) => (prev <= 0 ? prev : prev - 1));
  };

  const handleSubmit = async () => {
    if (currentStepIndex < 2) {
      next();
    } else {
      await dispatch(authActions.createProfile({ formData: profileData }));
      navigate("/dashboard");
    }
  };

  const pages = [
    <BusinessDetailsForm onSubmit={handleSubmit} />,
    <UserDetailsForm prev={prev} onSubmit={handleSubmit} />,
    <SocialsForm prev={prev} onSubmit={handleSubmit} loading={loading} />,
  ];

  return (
    <div className="w-full min-h-screen overflow-y-auto my-4 flex items-center justify-center bg-gray-bg max-md:items-start max-md:mt-12 max-md:bg-white">
      <div className="flex flex-col justify-center -translate-y-6">
        <img src={Logo} alt="kota-logo" className="max-md:mt-4 w-[90px] max-md:mx-6" />
        <div className="min-h-[750px] w-[522px] max-md:w-[95vw] py-8 md:px-10 max-md:px-4 bg-white md:shadow-md rounded-md mt-4">
          <div className="w-[422px] max-md:w-[100%] mx-auto">
            <h2 className="text-primary text-[26px] text-[500] mb-6">Create your profile</h2>
            <FadeIn>
              <Stepper
                pagesLength={3}
                currrentPageIndex={currentStepIndex}
                pagesText={["Business Details", "Contact Details", "Social Media"]}
              />

              <div className="mb-6 mt-16">{pages[currentStepIndex]}</div>
            </FadeIn>
          </div>
        </div>
      </div>
    </div>
  );
}
