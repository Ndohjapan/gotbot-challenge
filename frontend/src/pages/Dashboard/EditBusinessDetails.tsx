import Button from "../../components/Button";
import Field from "../../components/Form/Field";
import TextInput from "../../components/Form/TextInput";
import PhoneInput from "../../components/Form/PhoneInput";
import Dropdown from "../../components/Form/Dropdown";
import CountrySelect from "../../components/Form/CountrySelect";
import BackButton from "../../components/BackButton";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { useValidator } from "../../hooks/useValidator";
import { BusinessDetails } from "../../types/auth";
import { useState, useEffect } from "react";
import { authActions } from "../../redux/slices/authSlice";
import { Country, ICountry, State } from "country-state-city";
import * as yup from "yup";

const businessProfileSchema = yup.object({
  name: yup.string().required("Business name is required"),
  email: yup.string().email("Email must be a valid email").required("Business email is required"),
  country: yup.object().test("country", "Country is a required field", (value) => {
    if (Object.keys(value).length) return true;
    return false;
  }),
  state: yup.string(),
  businessPhoneNumber: yup.string(),
});

export default function EditBusinessDetails() {
  const dispatch = useAppDispatch();
  const { profileData, updating, user } = useAppSelector((state) => state.auth);

  const [formData, setFormData] =
    useState<Partial<BusinessDetails & { name: string; email: string }>>(profileData);
  const { errors, validate, clearErrOnFocus } = useValidator(formData, businessProfileSchema);

  useEffect(() => {
    setFormData(profileData);
  }, [profileData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, files } = e.target;
    if (type === "file" && files) {
      // Read the file as blob and set in redux
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData({ ...formData, [name]: event.target?.result as string | Blob });
        dispatch(authActions.updateLogoData(event.target?.result as string | Blob));
      };
      reader.readAsDataURL(files[0]);
    } else {
      setFormData({ ...formData, [name]: value });
      dispatch(authActions.updateProfileData({ [name]: value }));
    }
  };

  const handleSelectChange = (name: string, value: string | ICountry) => {
    setFormData({ ...formData, [name]: value });
    dispatch(authActions.updateProfileData({ [name]: value }));
    clearErrOnFocus({ target: { name } } as unknown as React.FocusEvent<HTMLInputElement>);
  };

  const handleSubmit = async () => {
    if (await validate()) {
      console.log("\nSUBMITTING FORM DATA:", formData);
      dispatch(authActions.updateProfile({ formData, businessId: user!._id }));
    }
  };

  return (
    <div className="w-full min-h-screen overflow-y-auto my-4 flex items-center justify-center bg-white">
      <div className="flex flex-col justify-center -translate-y-6">
        <BackButton />

        <div className="min-h-[600px] w-[522px] max-md:w-[95vw] py-8 md:px-10 max-md:px-4 bg-white md:shadow-md rounded-md mt-4">
          <>
            <div className="mt-8">
              <Field label="Business Name*" error={errors.name}>
                <TextInput
                  placeholder="ex. The Bistro Delight"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  onFocus={clearErrOnFocus}
                />
              </Field>
            </div>

            <div className="mt-4">
              <Field label="Business Email*" error={errors.email}>
                <TextInput
                  placeholder="ex. info@bistrodelightrestaurant.com"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  onFocus={clearErrOnFocus}
                  error={errors.email}
                />
              </Field>
            </div>

            <div className="mt-5">
              <Field label="Country" error={errors.country as string}>
                <CountrySelect
                  placeholder="Select your country"
                  dropdownItems={Country.getAllCountries()}
                  name="country"
                  value={formData.country as ICountry}
                  onSelect={handleSelectChange}
                />
              </Field>
            </div>

            <div className="mt-5">
              <Field label="State" error={errors.state}>
                <Dropdown
                  name="state"
                  value={formData.state}
                  dropdownItems={State.getStatesOfCountry(
                    (formData.country as ICountry).isoCode
                  ).map((state) => state.name)}
                  placeholder="Select your state"
                  onSelect={handleSelectChange}
                />
              </Field>
            </div>

            <div className="mt-5">
              <Field label="Business Phone Number" error={errors.businessPhoneNumber}>
                <PhoneInput
                  code={(profileData.country as ICountry)?.phonecode}
                  flag={(profileData.country as ICountry)?.flag}
                  name="businessPhoneNumber"
                  value={formData.businessPhoneNumber}
                  onChange={handleInputChange}
                />
              </Field>
            </div>

            <div className="mt-10">
              <Button onClick={handleSubmit} alternateFont="nunito" loading={updating}>
                Continue
              </Button>
            </div>
          </>
        </div>
      </div>
    </div>
  );
}
