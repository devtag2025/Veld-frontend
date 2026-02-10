export interface Contract {
  id: string;
  hunterName: string;
  email: string;
  phone: string;
  address?: string;
  huntDate: string;
  package: string;
  pickupPoint?: string;
  pickupNotes?: string;
  charterOption?: string;
  trophyProcessing?: boolean;
  totalAmount?: number;
  firearmOption?: string;
  customNotes?: string;
  template?: string;
  status?: string;
  createdAt: string;
  updatedAt?: string;
  [key: string]: any;
}

export interface ContractFormData {
  hunterName: string;
  email: string;
  phone: string;
  address: string;
  huntDate: string;
  package: string;
  pickupPoint: string;
  pickupNotes: string;
  charterOption: string;
  trophyProcessing: boolean;
  firearmOption: string;
  customNotes: string;
  template: string;
}
