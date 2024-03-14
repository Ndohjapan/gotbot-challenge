import { ICloudinaryFile } from "./auth";

export interface IMenu {
  created_at: string;
  _id?: string;
  name: string;
  description?: string;
  menu?: string;
  business?: string;
  categories?: number;
  items?: number;
  date?: Date;
}

export interface ICategory {
  _id?: string;
  name: string;
  items?: number;
  image?: ICloudinaryFile | string;
}

export interface IFood {
  _id?: string;
  name: string;
  price: string;
  image?: ICloudinaryFile | string;
  images?: (ICloudinaryFile | string)[];
}

// Menu Items with Category and Food
export interface ICategoryFood {
  category: string;
  items: IFood[];
}

export interface INewMenu {
  name: string;
  menu?: string;
  _id: string;
  description?: string;
}