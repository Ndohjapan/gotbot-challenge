import { ICloudinaryFile } from "./auth";

export interface IMenu {
  created_at: Date | undefined;
  _id?: string;
  name: string;
  description?: string;
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
