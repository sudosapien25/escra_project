import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    if (error.response?.status === 401) {
      // Handle unauthorized - redirect to login
      Cookies.remove('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export class ContractServiceAPI {
  static async getContracts(params?: {
    page?: number;
    limit?: number;
    status?: string;
    type?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) {
    const response = await api.get('/contracts', { params });
    return response.data;
  }

  static async getContract(id: string) {
    const response = await api.get(`/contracts/${id}`);
    return response.data;
  }

  static async createContract(contractData: any) {
    const response = await api.post('/contracts', contractData);
    return response.data;
  }

  static async updateContract(id: string, updates: any) {
    const response = await api.put(`/contracts/${id}`, updates);
    return response.data;
  }

  static async updateContractField(id: string, field: string, value: any) {
    const response = await api.patch(`/contracts/${id}`, { field, value });
    return response.data;
  }

  static async deleteContract(id: string) {
    const response = await api.delete(`/contracts/${id}`);
    return response.data;
  }

  static async updateContractStatus(id: string, status: string, reason?: string) {
    const response = await api.put(`/contracts/${id}/status`, { status, reason });
    return response.data;
  }

  static async addComment(contractId: string, content: string) {
    const response = await api.post(`/contracts/${contractId}/comments`, { content });
    return response.data;
  }

  static async getContractTasks(contractId: string) {
    const response = await api.get(`/contracts/${contractId}/tasks`);
    return response.data;
  }

  static async uploadDocument(contractId: string, file: File) {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post(
      `/contracts/${contractId}/documents`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  }
}