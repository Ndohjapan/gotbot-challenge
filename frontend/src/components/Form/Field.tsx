/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactElement, ReactNode, cloneElement } from "react";

interface FiledProps {
  children: ReactNode;
  error?: string;
  label?: string;
}

export default function Field({ children, error, label }: FiledProps) {
  return (
    <div>
      {label && <p className="font-nunito text-base text-[500] my-2">{label}</p>}
      {error ? cloneElement(children as ReactElement<any>, { error }) : children}
      {error && <small className="font-nunito text-red-500">{error}</small>}
    </div>
  );
}
