import { create } from 'zustand';
import type { ContractTemplate, ContractTemplateFormData } from '../types/contractTemplate';
import * as templateApi from '../api/contractTemplate.api';

interface ContractTemplateState {
  templates: ContractTemplate[];
  isLoading: boolean;
  error: string | null;
  
  fetchTemplates: () => Promise<void>;
  createTemplate: (data: ContractTemplateFormData) => Promise<void>;
  updateTemplate: (id: string, data: Partial<ContractTemplateFormData>) => Promise<void>;
  deleteTemplate: (id: string) => Promise<void>;
  seedDefaultTemplate: () => Promise<void>;
}

export const useContractTemplateStore = create<ContractTemplateState>((set, get) => ({
  templates: [],
  isLoading: false,
  error: null,

  fetchTemplates: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await templateApi.getContractTemplates();
      set({ templates: data, isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch templates', 
        isLoading: false 
      });
    }
  },

  createTemplate: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const newTemplate = await templateApi.createContractTemplate(payload);
      set({ templates: [newTemplate, ...get().templates], isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to create template', 
        isLoading: false 
      });
      throw error;
    }
  },

  updateTemplate: async (id, payload) => {
    set({ isLoading: true, error: null });
    try {
      const updatedTemplate = await templateApi.updateContractTemplate(id, payload);
      set({ 
        templates: get().templates.map(t => (t._id === id || t.id === id) ? updatedTemplate : t), 
        isLoading: false 
      });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to update template', 
        isLoading: false 
      });
      throw error;
    }
  },

  deleteTemplate: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await templateApi.deleteContractTemplate(id);
      set({ 
        templates: get().templates.filter(t => t._id !== id && t.id !== id), 
        isLoading: false 
      });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to delete template', 
        isLoading: false 
      });
      throw error;
    }
  },
  
  seedDefaultTemplate: async () => {
    set({ isLoading: true, error: null });
    try {
      await templateApi.seedDefaultTemplate();
      // If it exists in the list, we might want to update it. Otherwise, refresh
      await get().fetchTemplates();
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to seed default template', 
        isLoading: false 
      });
      throw error;
    }
  }
}));
