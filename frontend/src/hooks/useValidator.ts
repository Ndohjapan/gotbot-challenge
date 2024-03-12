import { useState } from "react";
import { ObjectSchema, ValidationError } from "yup";

export function useValidator<T>(formData: T, schema: ObjectSchema<object>) {
  const [errors, setErrors] = useState<Partial<T>>({});

  async function validate(): Promise<boolean> {
    try {
      await schema.validate(formData, { abortEarly: false });
      return true;
    } catch (validationErrors) {
      const errors: Record<string, string> = {};
      (validationErrors as { inner: ValidationError[] }).inner.map((error) => {
        errors[error.path!] = error.message;
      });

      setErrors(errors as Partial<T>);
      return false;
    }
  }

  function clearErrOnFocus(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name } = e.target;
    setErrors({ ...errors, [name]: "" });
  }

  return {
    validate,
    errors,
    clearErrOnFocus,
  };
}
