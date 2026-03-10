import http from "@/lib/httpClient";
import type { ContractTemplate, ContractTemplateFormData } from "@/types/contractTemplate";

export const getContractTemplates = async (): Promise<ContractTemplate[]> => {
  const { data } = await http.get("/contract-templates");
  return data.data as ContractTemplate[];
};

export const getContractTemplateById = async (id: string): Promise<ContractTemplate> => {
  const { data } = await http.get(`/contract-templates/${id}`);
  return data.data as ContractTemplate;
};

export const createContractTemplate = async (payload: ContractTemplateFormData): Promise<ContractTemplate> => {
  const { data } = await http.post("/contract-templates", payload);
  return data.data as ContractTemplate;
};

export const updateContractTemplate = async (id: string, payload: Partial<ContractTemplateFormData>): Promise<ContractTemplate> => {
  const { data } = await http.put(`/contract-templates/${id}`, payload);
  return data.data as ContractTemplate;
};

export const deleteContractTemplate = async (id: string): Promise<void> => {
  await http.delete(`/contract-templates/${id}`);
};

export const seedDefaultTemplate = async (): Promise<ContractTemplate> => {
  const { data } = await http.post("/contract-templates/seed-default");
  return data.data as ContractTemplate;
};
