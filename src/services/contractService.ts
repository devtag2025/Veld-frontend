import axios, { type AxiosResponse } from 'axios';

const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL || '/api';

interface ContractParams {
  search?: string;
  status?: string;
  package?: string;
  page?: number;
  limit?: number;
  [key: string]: any;
}

import { type Contract } from '../types/contract';

interface Template {
  id: string;
  [key: string]: any;
}

interface ContractStats {
  total: number;
  signed: number;
  pending: number;
  expired: number;
  [key: string]: any;
}

interface EmailData {
  to: string;
  subject: string;
  message: string;
  [key: string]: any;
}

/**
 * Contract Service
 * Handles all contract-related API calls
 */
class ContractService {
  /**
   * Get all contracts with optional filters
   * @param params - Query parameters (search, status, package, page, limit)
   * @returns Contract list and pagination data
   */
  async getContracts(params: ContractParams = {}): Promise<any> {
    try {
      const response: AxiosResponse = await axios.get(`${API_BASE_URL}/contracts`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching contracts:', error);
      throw error;
    }
  }

  /**
   * Get a single contract by ID
   * @param contractId - Contract ID
   * @returns Contract data
   */
  async getContractById(contractId: string): Promise<Contract> {
    try {
      const response: AxiosResponse<Contract> = await axios.get(`${API_BASE_URL}/contracts/${contractId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching contract:', error);
      throw error;
    }
  }

  /**
   * Create a new contract
   * @param contractData - Contract data
   * @returns Created contract
   */
  async createContract(contractData: Partial<Contract>): Promise<Contract> {
    try {
      const response: AxiosResponse<Contract> = await axios.post(`${API_BASE_URL}/contracts`, contractData);
      return response.data;
    } catch (error) {
      console.error('Error creating contract:', error);
      throw error;
    }
  }

  /**
   * Update an existing contract
   * @param contractId - Contract ID
   * @param contractData - Updated contract data
   * @returns Updated contract
   */
  async updateContract(contractId: string, contractData: Partial<Contract>): Promise<Contract> {
    try {
      const response: AxiosResponse<Contract> = await axios.put(`${API_BASE_URL}/contracts/${contractId}`, contractData);
      return response.data;
    } catch (error) {
      console.error('Error updating contract:', error);
      throw error;
    }
  }

  /**
   * Delete a contract
   * @param contractId - Contract ID
   * @returns Deletion confirmation
   */
  async deleteContract(contractId: string): Promise<any> {
    try {
      const response: AxiosResponse = await axios.delete(`${API_BASE_URL}/contracts/${contractId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting contract:', error);
      throw error;
    }
  }

  /**
   * Get contract statistics
   * @returns Contract stats (total, signed, pending, expired)
   */
  async getContractStats(): Promise<ContractStats> {
    try {
      const response: AxiosResponse<ContractStats> = await axios.get(`${API_BASE_URL}/contracts/stats`);
      return response.data;
    } catch (error) {
      console.error('Error fetching contract stats:', error);
      throw error;
    }
  }

  /**
   * Send contract via email
   * @param contractId - Contract ID
   * @param emailData - Email details (to, subject, message)
   * @returns Send confirmation
   */
  async sendContractEmail(contractId: string, emailData: EmailData): Promise<any> {
    try {
      const response: AxiosResponse = await axios.post(`${API_BASE_URL}/contracts/${contractId}/send-email`, emailData);
      return response.data;
    } catch (error) {
      console.error('Error sending contract email:', error);
      throw error;
    }
  }

  /**
   * Download contract PDF
   * @param contractId - Contract ID
   * @returns PDF blob
   */
  async downloadContractPDF(contractId: string): Promise<Blob> {
    try {
      const response: AxiosResponse<Blob> = await axios.get(`${API_BASE_URL}/contracts/${contractId}/pdf`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Error downloading contract PDF:', error);
      throw error;
    }
  }

  /**
   * Get all contract templates
   * @returns Template list
   */
  async getTemplates(): Promise<Template[]> {
    try {
      const response: AxiosResponse<Template[]> = await axios.get(`${API_BASE_URL}/contracts/templates`);
      return response.data;
    } catch (error) {
      console.error('Error fetching templates:', error);
      throw error;
    }
  }

  /**
   * Get a single template by ID
   * @param templateId - Template ID
   * @returns Template data
   */
  async getTemplateById(templateId: string): Promise<Template> {
    try {
      const response: AxiosResponse<Template> = await axios.get(`${API_BASE_URL}/contracts/templates/${templateId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching template:', error);
      throw error;
    }
  }

  /**
   * Create a new contract template
   * @param templateData - Template data
   * @returns Created template
   */
  async createTemplate(templateData: Partial<Template>): Promise<Template> {
    try {
      const response: AxiosResponse<Template> = await axios.post(`${API_BASE_URL}/contracts/templates`, templateData);
      return response.data;
    } catch (error) {
      console.error('Error creating template:', error);
      throw error;
    }
  }

  /**
   * Update an existing template
   * @param templateId - Template ID
   * @param templateData - Updated template data
   * @returns Updated template
   */
  async updateTemplate(templateId: string, templateData: Partial<Template>): Promise<Template> {
    try {
      const response: AxiosResponse<Template> = await axios.put(`${API_BASE_URL}/contracts/templates/${templateId}`, templateData);
      return response.data;
    } catch (error) {
      console.error('Error updating template:', error);
      throw error;
    }
  }

  /**
   * Delete a template
   * @param templateId - Template ID
   * @returns Deletion confirmation
   */
  async deleteTemplate(templateId: string): Promise<any> {
    try {
      const response: AxiosResponse = await axios.delete(`${API_BASE_URL}/contracts/templates/${templateId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting template:', error);
      throw error;
    }
  }

  /**
   * Duplicate a template
   * @param templateId - Template ID to duplicate
   * @returns Duplicated template
   */
  async duplicateTemplate(templateId: string): Promise<Template> {
    try {
      const response: AxiosResponse<Template> = await axios.post(`${API_BASE_URL}/contracts/templates/${templateId}/duplicate`);
      return response.data;
    } catch (error) {
      console.error('Error duplicating template:', error);
      throw error;
    }
  }

  /**
   * Set a template as default
   * @param templateId - Template ID
   * @returns Update confirmation
   */
  async setDefaultTemplate(templateId: string): Promise<any> {
    try {
      const response: AxiosResponse = await axios.patch(`${API_BASE_URL}/contracts/templates/${templateId}/set-default`);
      return response.data;
    } catch (error) {
      console.error('Error setting default template:', error);
      throw error;
    }
  }

  /**
   * Bulk operations on contracts
   * @param action - Action to perform (delete, send-email, download)
   * @param contractIds - Array of contract IDs
   * @returns Operation result
   */
  async bulkAction(action: 'delete' | 'send-email' | 'download', contractIds: string[]): Promise<any> {
    try {
      const response: AxiosResponse = await axios.post(`${API_BASE_URL}/contracts/bulk-action`, {
        action,
        contractIds
      });
      return response.data;
    } catch (error) {
      console.error('Error performing bulk action:', error);
      throw error;
    }
  }
}

export default new ContractService();
