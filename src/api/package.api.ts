import type { Package, PackageFormData } from "../types/package";

import http from "@/lib/httpClient";

export const getPackages = async (): Promise<Package[]> => {
  const { data } = await http.get("/packages");
  return data.data; // Assuming ApiResponse format { data: Package[], message: string }
};

export const getPackageById = async (id: string): Promise<Package> => {
  const { data } = await http.get(`/packages/${id}`);
  return data.data;
};

export const createPackage = async (payload: PackageFormData): Promise<Package> => {
  const { data } = await http.post("/packages", payload);
  return data.data;
};

export const updatePackage = async (id: string, payload: Partial<PackageFormData>): Promise<Package> => {
  const { data } = await http.put(`/packages/${id}`, payload);
  return data.data;
};

export const deletePackage = async (id: string): Promise<void> => {
  await http.delete(`/packages/${id}`);
};
