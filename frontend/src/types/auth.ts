import { ICountry } from "country-state-city";

type Role = "owner" | "employee" | "manager" | string;

export interface AuthState {
  loading: boolean;
  updating: boolean;
  error: string;
  user: IUser | null;
  token: string;
  profileData: ProfileData;
  isAuthenticated: boolean;
  profileComplete: boolean;
}

export interface IProfile {
  business: ProfileData;
  contact: { name: string; number: string; role: Role; email: string; _id: string }[];
}

export interface ProfileData {
  name?: string;
  email?: string;
  country: ICountry | string;
  state: string;
  businessPhoneNumber: string;
  logo: string | Blob | ICloudinaryFile | null;
  backgroundImage: string | Blob | ICloudinaryFile | null;
  contactEmail: string;
  contactName: string;
  contactNumber: string;
  contactRole: Role;
  instagram: string;
  tiktok: string;
  whatsapp: string;
  facebook: string;
  details: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface IUser {
  _id: string;
  name: string;
  email: string;
  logo: ICloudinaryFile | null;
  phoneNumber?: string;
  profileComplete?: boolean;
  country: string | ICountry;
  state: string;
  instagram?: string;
  whatsapp?: string;
  tiktok?: string;
  facebook?: string;
}

export interface IBusinessProfile {
  name: string;
  email: string;
  logo: string;
  _id: string;
}

export interface IBusiness {
  name: string;
  email: string;
  logo: ICloudinaryFile | string | null;
  instagram?: string;
  tiktok?: string;
  _id: string;
}

export interface BusinessDetails {
  country: ICountry | string;
  state: string;
  businessPhoneNumber: string;
  logo: ICloudinaryFile | string | Blob | null;
  backgroundImage: ICloudinaryFile | string | Blob | null;
}

export interface Contact {
  contactRole: "owner" | "employee" | "manager" | string;
  contactName: string;
  contactEmail: string;
  contactNumber: string;
}

export interface Socials {
  tiktok: string;
  instagram: string;
  whatsapp: string;
  facebook: string;
}

export interface ICloudinaryFile {
  access_mode: string;
  api_key: string;
  asset_id: string;
  bytes: number;
  created_at: string;
  etag: string;
  folder: string;
  format: string;
  height: number;
  original_filename: string;
  placeholder: boolean;
  public_id: string;
  resource_type: "image" | "video";
  secure_url: string;
  signature: string;
  tags: [];
  type: string;
  url: string;
  version: number;
  version_id: string;
  width: number;
}
