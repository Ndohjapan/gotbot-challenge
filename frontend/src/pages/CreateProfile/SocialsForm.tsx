import Field from "../../components/Form/Field";
import TextInput from "../../components/Form/TextInput";
import Button from "../../components/Button";
import { useEffect, useState } from "react";
import { Socials } from "../../types/auth";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { useValidator } from "../../hooks/useValidator";
import { authActions } from "../../redux/slices/authSlice";
import * as yup from "yup";

const socialSchema = yup.object({
  whatsapp: yup.string().required("Whatsapp Number is a required field"),
});

interface SocialsFormProps {
  onSubmit: () => void;
  prev: () => void;
  loading: boolean;
}

export default function SocialsForm({ prev, loading, onSubmit }: SocialsFormProps) {
  const dispatch = useAppDispatch();
  const profileData = useAppSelector((state) => state.auth.profileData);
  const [formData, setFormData] = useState<Partial<Socials>>(profileData);

  useEffect(() => {
    setFormData(profileData);
  }, [profileData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    dispatch(authActions.updateProfileData({ [name]: value }));
  };

  const { errors } = useValidator(formData, socialSchema);

  const handleSubmit = async () => {
    onSubmit();
  };

  return (
    <>
      <div className="mt-4">
        <Field label="Instagram Handle (optional)">
          <TextInput
            placeholder="ex. the_bistrodelight"
            name="instagram"
            value={formData.instagram}
            onChange={handleInputChange}
          />
        </Field>
      </div>

      <div className="mt-5">
        <Field label="WhatsApp Number (optional)" error={errors.whatsapp}>
          <TextInput
            placeholder="+234"
            name="whatsapp"
            value={formData.whatsapp}
            onChange={handleInputChange}
          />
        </Field>
      </div>

      <div className="mt-5">
        <Field label="TikTok Handle (optional)">
          <TextInput
            placeholder="ex. the_bistrodelight"
            name="tiktok"
            value={formData.tiktok}
            onChange={handleInputChange}
          />
        </Field>
      </div>

      <div className="mt-5">
        <Field label="Facebook Handle (optional)">
          <TextInput
            placeholder="ex. the_bistrodelight"
            name="facebook"
            value={formData.facebook}
            onChange={handleInputChange}
          />
        </Field>
      </div>

      <div className="mt-10">
        <Button onClick={handleSubmit} alternateFont="nunito" loading={loading}>
          Submit
        </Button>

        <div
          onClick={() => {
            if (loading) return;
            prev();
          }}
          className="text-center mt-5 cursor-pointer"
        >
          <p className="font-nunito text-base text-primary underline">Previous</p>
        </div>
      </div>
    </>
  );
}
