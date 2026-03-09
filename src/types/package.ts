export interface Package {
  id?: string;
  _id?: string;
  name: string;
  price: number;
  details?: string;
  [key: string]: any;
}

export interface PackageFormData {
  name: string;
  price: number;
  details?: string;
}
