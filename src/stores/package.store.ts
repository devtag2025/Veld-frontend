import { create } from 'zustand';
import type { Package, PackageFormData } from '../types/package';
import * as packageApi from '../api/package.api';

interface PackageState {
  packages: Package[];
  isLoading: boolean;
  error: string | null;
  
  fetchPackages: () => Promise<void>;
  createPackage: (data: PackageFormData) => Promise<void>;
  updatePackage: (id: string, data: Partial<PackageFormData>) => Promise<void>;
  deletePackage: (id: string) => Promise<void>;
}

export const usePackageStore = create<PackageState>((set, get) => ({
  packages: [],
  isLoading: false,
  error: null,

  fetchPackages: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await packageApi.getPackages();
      set({ packages: data, isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch packages', 
        isLoading: false 
      });
    }
  },

  createPackage: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const newPackage = await packageApi.createPackage(payload);
      set({ packages: [newPackage, ...get().packages], isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to create package', 
        isLoading: false 
      });
      throw error;
    }
  },

  updatePackage: async (id, payload) => {
    set({ isLoading: true, error: null });
    try {
      const updatedPackage = await packageApi.updatePackage(id, payload);
      set({ 
        packages: get().packages.map(p => p._id === id ? updatedPackage : p), 
        isLoading: false 
      });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to update package', 
        isLoading: false 
      });
      throw error;
    }
  },

  deletePackage: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await packageApi.deletePackage(id);
      set({ 
        packages: get().packages.filter(p => p._id !== id), 
        isLoading: false 
      });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to delete package', 
        isLoading: false 
      });
      throw error;
    }
  }
}));
