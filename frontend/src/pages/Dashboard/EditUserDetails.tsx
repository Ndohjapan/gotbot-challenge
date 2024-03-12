import Button from "../../components/Button";
import BackButton from "../../components/BackButton";
import PhoneInput from "../../components/Form/PhoneInput";
import TextInput from "../../components/Form/TextInput";
import Field from "../../components/Form/Field";
import Dropdown from "../../components/Form/Dropdown";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { useState, useEffect } from "react";
import { useValidator } from "../../hooks/useValidator";
import { authActions } from "../../redux/slices/authSlice";
import { Contact } from "../../types/auth";
import { ICountry } from "country-state-city";
import * as yup from "yup";

const contactSchema = yup.object({
  contactRole: yup.string().required("Onwership is a required field"),
  contactName: yup.string().required("Full Name is a required field"),
  contactEmail: yup
    .string()
    .email("Email must be a valid email")
    .required("Email Address is a required field"),
  contactNumber: yup.string().required("Phone Number is a required field"),
});

export default function EditUserDetails() {
  const dispatch = useAppDispatch();
  const { profileData, updating, user } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState<Partial<Contact>>(profileData);

  useEffect(() => {
    setFormData(profileData);
  }, [profileData]);

  const { errors, validate, clearErrOnFocus } = useValidator(formData, contactSchema);

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
    clearErrOnFocus({ target: { name } } as unknown as React.FocusEvent<HTMLInputElement>);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    if (await validate()) {
      dispatch(authActions.updateProfile({ formData, businessId: user!._id }));
    }
  };

  return (
    <div className="w-full min-h-screen overflow-y-auto my-4 flex items-center justify-center bg-white">
      <div className="flex flex-col justify-center -translate-y-6">
        <BackButton />

        <div className="min-h-[600px] w-[522px] max-md:w-[95vw] py-8 md:px-10 max-md:px-4 bg-white md:shadow-md rounded-md mt-4">
          <>
            <div className="mt-4">
              <Field label="Ownership" error={errors.contactRole}>
                <Dropdown
                  placeholder="Select your role in the business"
                  dropdownItems={["Owner", "Manager", "Employee"]}
                  name="contactRole"
                  onSelect={handleSelectChange}
                  value={formData.contactRole}
                />
              </Field>
            </div>

            <div className="mt-5">
              <Field label="Full Name" error={errors.contactName}>
                <TextInput
                  placeholder="ex. John Doe"
                  name="contactName"
                  value={formData.contactName}
                  onChange={handleInputChange}
                  onFocus={clearErrOnFocus}
                />
              </Field>
            </div>

            <div className="mt-5">
              <Field label="Email Address" error={errors.contactEmail}>
                <TextInput
                  placeholder="ex. johndoe@email.com"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleInputChange}
                  onFocus={clearErrOnFocus}
                />
              </Field>
            </div>

            <div className="mt-5">
              <Field label="Phone Number" error={errors.contactNumber}>
                <PhoneInput
                  code={(profileData.country as ICountry).phonecode}
                  flag={(profileData.country as ICountry).flag}
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleInputChange}
                  onFocus={clearErrOnFocus}
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
