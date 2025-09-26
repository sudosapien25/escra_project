import apiClient from '@/lib/apiClient';
import { Contract, ContractStatus, ContractType } from '@/types/contract';

export interface ContractFilters {
  status?: ContractStatus;
  type?: ContractType;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ContractResponse {
  contracts: Contract[];
  total: number;
  page: number;
  totalPages: number;
}

export interface CreateContractData {
  title: string;
  type: ContractType;
  status?: ContractStatus;
  parties?: any[];
  value?: number;
  metadata?: Record<string, any>;
}

export interface UpdateContractData {
  title?: string;
  type?: ContractType;
  status?: ContractStatus;
  parties?: any[];
  value?: number;
  metadata?: Record<string, any>;
}

export const contractApi = {
  async getContracts(filters?: ContractFilters): Promise<ContractResponse> {
    try {
      const params = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.append(key, String(value));
          }
        });
      }

      const response = await apiClient.client.get<ContractResponse>(
        `/api/contracts?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching contracts:', error);
      throw error;
    }
  },

  async getContract(id: string): Promise<Contract> {
    try {
      const response = await apiClient.client.get<Contract>(`/api/contracts/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching contract ${id}:`, error);
      throw error;
    }
  },

  async createContract(data: CreateContractData): Promise<Contract> {
    try {
      const response = await apiClient.client.post<Contract>('/api/contracts', data);
      return response.data;
    } catch (error) {
      console.error('Error creating contract:', error);
      throw error;
    }
  },

  async updateContract(id: string, data: UpdateContractData): Promise<Contract> {
    try {
      const response = await apiClient.client.put<Contract>(`/api/contracts/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating contract ${id}:`, error);
      throw error;
    }
  },

  async deleteContract(id: string): Promise<void> {
    try {
      await apiClient.client.delete(`/api/contracts/${id}`);
    } catch (error) {
      console.error(`Error deleting contract ${id}:`, error);
      throw error;
    }
  },

  async searchContracts(query: string): Promise<Contract[]> {
    try {
      const response = await apiClient.client.get<Contract[]>('/api/contracts/search', {
        params: { q: query }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching contracts:', error);
      throw error;
    }
  }
};