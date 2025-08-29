import Cookies from 'js-cookie';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface ContractParty {
  id: string;
  name: string;
  email?: string;
  role: string;
  phone?: string;
  address?: string;
}

export interface ContractTask {
  id: string;
  title: string;
  description?: string;
  status: string;
  assignee?: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContractDocument {
  id: string;
  name: string;
  type: string;
  status: string;
  size: number;
  url?: string;
  uploadedAt: string;
}

export interface ContractSignature {
  id: string;
  party: string;
  partyId: string;
  status: string;
  signedAt?: string;
  ipAddress?: string;
}

export interface ContractComment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  avatarColor: string;
  textColor: string;
}

export interface ActivityLogEntry {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  details?: string;
}

export interface Contract {
  id: string;
  title: string;
  type: string;
  status: string;
  
  // Party Information
  buyer: string;
  buyerEmail?: string;
  seller: string;
  sellerEmail?: string;
  agent?: string;
  agentEmail?: string;
  
  // Property Details
  propertyAddress?: string;
  propertyType?: string;
  escrowNumber?: string;
  
  // Financial Details  
  value?: number | string;
  earnestMoney?: number;
  downPayment?: number;
  loanAmount?: number;
  interestRate?: number;
  loanTerm?: number;
  lenderName?: string;
  
  // Banking Details
  sellerFinancialInstitution?: string;
  buyerFinancialInstitution?: string;
  buyerAccountNumber?: string;
  sellerAccountNumber?: string;
  buyerFinancialInstitutionRoutingNumber?: string;
  sellerFinancialInstitutionRoutingNumber?: string;
  
  // Additional Details
  titleCompany?: string;
  insuranceCompany?: string;
  inspectionPeriod?: string;
  contingencies?: string;
  specialProvisions?: string;
  milestone?: string;
  notes?: string;
  
  // Dates
  closingDate?: string;
  dueDate?: string;
  createdAt?: string;
  updatedAt?: string;
  
  // User association
  created_by?: string;
  shared_with?: string[];
  
  // Related Data
  tasks?: ContractTask[];
  documentsList?: ContractDocument[];
  signatures?: ContractSignature[];
  comments?: ContractComment[];
  activityLog?: ActivityLogEntry[];
  
  // Computed fields
  parties?: string;
  updated?: string;
  documents?: number;
}

export interface ContractListResponse {
  contracts: Array<{
    id: string;
    title: string;
    parties: string;
    status: string;
    updated: string;
    updatedAt: string;
    value: string;
    documents: number;
    type: string;
    milestone?: string;
    closingDate?: string;
    dueDate?: string;
  }>;
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface ContractCreateRequest {
  title: string;
  type: string;
  status?: string;
  buyer: string;
  buyerEmail?: string;
  seller: string;
  sellerEmail?: string;
  agent?: string;
  agentEmail?: string;
  propertyAddress?: string;
  propertyType?: string;
  value?: number;
  closingDate?: string;
  dueDate?: string;
  milestone?: string;
  notes?: string;
  earnestMoney?: number;
  downPayment?: number;
  loanAmount?: number;
  interestRate?: number;
  loanTerm?: number;
  lenderName?: string;
}

export interface ContractUpdateRequest {
  title?: string;
  type?: string;
  status?: string;
  buyer?: string;
  buyerEmail?: string;
  seller?: string;
  sellerEmail?: string;
  agent?: string;
  agentEmail?: string;
  propertyAddress?: string;
  propertyType?: string;
  value?: number;
  closingDate?: string;
  dueDate?: string;
  milestone?: string;
  notes?: string;
}

export interface StatusUpdateRequest {
  status: string;
  reason?: string;
}

export class ContractService {
  private static getAuthHeaders(): HeadersInit {
    const token = Cookies.get('auth_token');
    return {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
  }

  static async getContracts(params?: {
    page?: number;
    limit?: number;
    status?: string;
    type?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
  }): Promise<ContractListResponse> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.status) queryParams.append('status', params.status);
      if (params?.type) queryParams.append('type', params.type);
      if (params?.search) queryParams.append('search', params.search);
      if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);

      const response = await fetch(`${API_BASE_URL}/api/contracts?${queryParams}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch contracts');
      }

      return await response.json();
    } catch (error) {
      console.error('Get contracts error:', error);
      throw error;
    }
  }

  static async getContract(contractId: string): Promise<Contract> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/contracts/${contractId}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch contract');
      }

      return await response.json();
    } catch (error) {
      console.error('Get contract error:', error);
      throw error;
    }
  }

  static async createContract(contractData: any): Promise<Contract> {
    try {
      // Convert value to number if it's a string
      if (contractData.value && typeof contractData.value === 'string') {
        contractData.value = parseFloat(contractData.value.replace(/[$,]/g, '') || '0');
      }
      
      const response = await fetch(`${API_BASE_URL}/api/contracts`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(contractData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to create contract');
      }

      return await response.json();
    } catch (error) {
      console.error('Create contract error:', error);
      throw error;
    }
  }

  static async updateContract(contractId: string, updates: any): Promise<Contract> {
    try {
      // Convert value to number if it's a string
      if (updates.value && typeof updates.value === 'string') {
        updates.value = parseFloat(updates.value.replace(/[$,]/g, '') || '0');
      }
      
      const response = await fetch(`${API_BASE_URL}/api/contracts/${contractId}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error('Failed to update contract');
      }

      return await response.json();
    } catch (error) {
      console.error('Update contract error:', error);
      throw error;
    }
  }

  static async updateContractField(contractId: string, field: string, value: any): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/contracts/${contractId}`, {
        method: 'PATCH',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ field, value }),
      });

      if (!response.ok) {
        throw new Error('Failed to update contract field');
      }

      return await response.json();
    } catch (error) {
      console.error('Update contract field error:', error);
      throw error;
    }
  }

  static async deleteContract(contractId: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/contracts/${contractId}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to delete contract');
      }
    } catch (error) {
      console.error('Delete contract error:', error);
      throw error;
    }
  }

  static async updateContractStatus(contractId: string, status: string, reason?: string): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/contracts/${contractId}/status`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ status, reason }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to update status');
      }

      return await response.json();
    } catch (error) {
      console.error('Update status error:', error);
      throw error;
    }
  }

  static async addComment(contractId: string, content: string): Promise<ContractComment> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/contracts/${contractId}/comments`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        throw new Error('Failed to add comment');
      }

      return await response.json();
    } catch (error) {
      console.error('Add comment error:', error);
      throw error;
    }
  }

  static async getContractTasks(contractId: string): Promise<{ tasks: ContractTask[] }> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/contracts/${contractId}/tasks`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }

      return await response.json();
    } catch (error) {
      console.error('Get tasks error:', error);
      throw error;
    }
  }

  static async uploadDocument(contractId: string, file: File): Promise<ContractDocument> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const token = Cookies.get('auth_token');
      const response = await fetch(`${API_BASE_URL}/api/contracts/${contractId}/documents`, {
        method: 'POST',
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload document');
      }

      return await response.json();
    } catch (error) {
      console.error('Upload document error:', error);
      throw error;
    }
  }

  // Dashboard specific methods
  static async getDashboardStats(): Promise<{
    totalContracts: number;
    totalValue: number;
    pendingSignatures: number;
    wirePending: number;
    averageCompletionTime: number;
    recentActivity: any[];
  }> {
    try {
      const response = await this.getContracts({ limit: 100 });
      const contracts = response.contracts;
      
      // Calculate stats from contracts
      const totalContracts = response.pagination.total;
      const totalValue = contracts.reduce((sum, c) => {
        const value = parseFloat(c.value.replace(/[$,]/g, '') || '0');
        return sum + value;
      }, 0);
      
      const pendingSignatures = contracts.filter(c => c.status === 'Signatures').length;
      const wirePending = contracts.filter(c => c.status === 'Wire Details').length;
      
      // Mock average completion time for now
      const averageCompletionTime = 3.2;
      
      // Mock recent activity for now
      const recentActivity = [
        {
          id: '1',
          action: 'Contract created',
          contractId: contracts[0]?.id,
          contractTitle: contracts[0]?.title,
          timestamp: new Date().toISOString(),
          user: 'System'
        }
      ];
      
      return {
        totalContracts,
        totalValue,
        pendingSignatures,
        wirePending,
        averageCompletionTime,
        recentActivity
      };
    } catch (error) {
      console.error('Get dashboard stats error:', error);
      // Return default values if API fails
      return {
        totalContracts: 0,
        totalValue: 0,
        pendingSignatures: 0,
        wirePending: 0,
        averageCompletionTime: 0,
        recentActivity: []
      };
    }
  }
}