import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../assets/logo.svg";
import TextInput from "../components/Form/TextInput";
import Button from "../components/Button";
import Eye from "../assets/eye.svg";
import EyeShut from "../assets/eye-shut.svg";
import Field from "../components/Form/Field";
import { useValidator } from "../hooks/useValidator";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { authActions } from "../redux/slices/authSlice";
import * as yup from "yup";

const loginSchema = yup.object({
  email: yup.string().email("Email must be a valid email").required("Email is required"),
  password: yup.string().required("Password is required"),
});

export default function Login() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { profileComplete } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [passwordVisible, setPasswordVisible] = useState(false);

  const { errors, validate, clearErrOnFocus } = useValidator(formData, loginSchema);
  const { loading } = useAppSelector((state) => state.auth);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    if (await validate()) {
      await dispatch(authActions.loginUser({ formData }));

      if (profileComplete) {
        navigate("/dashboard");
      } else {
        navigate("/create-profile");
      }
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-bg max-md:bg-white">
      <div className="flex flex-col max-md:items-center justify-center -translate-y-6">
        <img src={Logo} alt="kota-logo" className="max-md:mt-4 w-[90px]" />

        <div className="h-fit w-[522px] max-md:w-[95vw] py-8 md:px-10 max-md:px-4 bg-white md:shadow-md rounded-md mt-4">
          <div className="w-[422px] max-md:w-[100%] mx-auto">
            <h2 className="text-primary text-[26px] text-[500] max-md:text-center">
              Sign in to your account
            </h2>

            <div className="mt-8">
              <Field label="Business Email" error={errors.email}>
                <TextInput
                  placeholder="ex. info@bistrodelightrestaurant.com"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  onFocus={clearErrOnFocus}
                />
              </Field>
            </div>

            <div className="mt-5">
              <Field label="Password" error={errors.password}>
                <TextInput
                  placeholder=""
                  secure
                  rightIcon={passwordVisible ? Eye : EyeShut}
                  showPass={passwordVisible}
                  onRightIconClick={() => setPasswordVisible((prev) => !prev)}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  onFocus={clearErrOnFocus}
                />
              </Field>
            </div>

            <p className="text-primary my-4">
              <Link to="/forgot-password">Forgot Password</Link>
            </p>

            <div className="mt-10">
              <Button onClick={handleSubmit} loading={loading}>
                Sign in
              </Button>
            </div>

            <div className="mt-10">
              <p className="font-nunito text-sm text-center">
                Don't have an account?{" "}
                <span className="text-[#05A2FA]">
                  <Link to="/register">Sign up</Link>
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
