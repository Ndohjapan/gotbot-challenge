import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { Socials } from "../../types/auth";
import { useState, useEffect } from "react";
import { useValidator } from "../../hooks/useValidator";
import { authActions } from "../../redux/slices/authSlice";
import TextInput from "../../components/Form/TextInput";
import Field from "../../components/Form/Field";
import Button from "../../components/Button";
import BackButton from "../../components/BackButton";
import * as yup from "yup";

const socialSchema = yup.object({
  whatsapp: yup.string().required("Whatsapp Number is a required field"),
});

export default function EditSocials() {
  const dispatch = useAppDispatch();
  const { profileData, updating, user } = useAppSelector((state) => state.auth);
  const [formData, setFormData] = useState<Partial<Socials>>(profileData);

  useEffect(() => {
    setFormData(profileData);
  }, [profileData]);

  const { errors, validate } = useValidator(formData, socialSchema);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    dispatch(authActions.updateProfileData({ [name]: value }));
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
              <Field label="Instagram Handle">
                <TextInput
                  placeholder="ex. the_bistrodelight"
                  name="instagram"
                  value={formData.instagram}
                  onChange={handleInputChange}
                />
              </Field>
            </div>

            <div className="mt-5">
              <Field label="WhatsApp Number" error={errors.whatsapp}>
                <TextInput
                  placeholder="+234"
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleInputChange}
                />
              </Field>
            </div>

            <div className="mt-5">
              <Field label="TikTok Handle">
                <TextInput
                  placeholder="ex. the_bistrodelight"
                  name="tiktok"
                  value={formData.tiktok}
                  onChange={handleInputChange}
                />
              </Field>
            </div>

            <div className="mt-5">
              <Field label="Facebook Handle">
                <TextInput
                  placeholder="ex. the_bistrodelight"
                  name="facebook"
                  value={formData.facebook}
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
