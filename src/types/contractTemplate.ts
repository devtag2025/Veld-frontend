export interface ContractTemplate {
  _id: string; // The backend uses MongoDB _id usually, but let's check id mapping in our components
  id?: string;
  name: string;
  content: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ContractTemplateFormData {
  name: string;
  content: string;
  isDefault?: boolean;
}
