import apiClient from '@/lib/apiClient';
import { SignatureDocument, SignatureRequest, SignatureStatus } from '@/types/signature';

export interface SignatureFilters {
  status?: SignatureStatus;
  contractId?: string;
  page?: number;
  limit?: number;
}

export interface SignatureResponse {
  signatures: SignatureDocument[];
  total: number;
  page: number;
  totalPages: number;
}

export const signatureApi = {
  async getSignatures(filters?: SignatureFilters): Promise<SignatureResponse> {
    try {
      const params = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.append(key, String(value));
          }
        });
      }

      const response = await apiClient.client.get<SignatureResponse>(
        `/api/signatures?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching signatures:', error);
      throw error;
    }
  },

  async getSignature(id: string): Promise<SignatureDocument> {
    try {
      const response = await apiClient.client.get<SignatureDocument>(`/api/signatures/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching signature ${id}:`, error);
      throw error;
    }
  },

  async requestSignature(data: SignatureRequest): Promise<SignatureDocument> {
    try {
      const response = await apiClient.client.post<SignatureDocument>('/api/signatures', data);
      return response.data;
    } catch (error) {
      console.error('Error requesting signature:', error);
      throw error;
    }
  },

  async cancelSignature(id: string): Promise<void> {
    try {
      await apiClient.client.post(`/api/signatures/${id}/cancel`);
    } catch (error) {
      console.error(`Error canceling signature ${id}:`, error);
      throw error;
    }
  },

  async voidSignature(id: string): Promise<void> {
    try {
      await apiClient.client.post(`/api/signatures/${id}/void`);
    } catch (error) {
      console.error(`Error voiding signature ${id}:`, error);
      throw error;
    }
  },

  async getSignaturesByContract(contractId: string): Promise<SignatureDocument[]> {
    try {
      const response = await apiClient.client.get<SignatureDocument[]>(
        `/api/contracts/${contractId}/signatures`
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching signatures for contract ${contractId}:`, error);
      throw error;
    }
  }
};