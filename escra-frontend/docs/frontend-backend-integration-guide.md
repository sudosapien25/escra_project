# Frontend-Backend Integration Guide for Contracts

## Overview
This guide outlines the steps needed to integrate the frontend with the Python FastAPI backend for the contracts module.

## Prerequisites
1. Backend API running on `http://localhost:8000`
2. MongoDB instance running and accessible
3. Frontend running on `http://localhost:3000`

## Step 1: Environment Configuration

Create or update `.env.local` in the frontend:
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_WS_URL=ws://localhost:8000/ws
```

## Step 2: Update Contract Service

Replace the current mock service (`src/services/contractService.ts`) with:

```typescript
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // For cookie-based auth
});

// Add request interceptor for auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
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
    if (error.response?.status === 401) {
      // Handle unauthorized - redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export class ContractService {
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
```

## Step 3: Update Contracts Page Component

Key changes needed in `src/app/(dashboard)/contracts/page.tsx`:

### 1. Replace mock data import:
```typescript
// Remove this:
import { mockContracts } from '@/data/mockContracts';

// Add this:
import { ContractService } from '@/services/contractService';
```

### 2. Update data fetching in useEffect:
```typescript
useEffect(() => {
  const loadContracts = async () => {
    setLoading(true);
    try {
      const response = await ContractService.getContracts({
        page: currentPage,
        limit: 20,
        status: filterStatus,
        type: filterType,
        search: searchTerm,
        sortBy: sortField,
        sortOrder: sortDirection
      });
      
      setContracts(response.contracts);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Failed to load contracts:', error);
      toast.error('Failed to load contracts');
    } finally {
      setLoading(false);
    }
  };
  
  loadContracts();
}, [currentPage, filterStatus, filterType, searchTerm, sortField, sortDirection]);
```

### 3. Update contract creation:
```typescript
const handleCreateContract = async (formData: any) => {
  try {
    const newContract = await ContractService.createContract(formData);
    
    // Refresh contracts list
    await loadContracts();
    
    toast.success('Contract created successfully');
    setShowCreateModal(false);
  } catch (error) {
    console.error('Failed to create contract:', error);
    toast.error('Failed to create contract');
  }
};
```

### 4. Update contract deletion:
```typescript
const handleDeleteContract = async (contractId: string) => {
  try {
    await ContractService.deleteContract(contractId);
    
    // Refresh contracts list
    await loadContracts();
    
    toast.success('Contract deleted successfully');
  } catch (error) {
    console.error('Failed to delete contract:', error);
    toast.error('Failed to delete contract');
  }
};
```

### 5. Update field editing:
```typescript
const handleFieldUpdate = async (contractId: string, field: string, value: any) => {
  try {
    await ContractService.updateContractField(contractId, field, value);
    
    // Update local state optimistically
    setContracts(prev => prev.map(contract => 
      contract.id === contractId 
        ? { ...contract, [field]: value }
        : contract
    ));
    
    toast.success('Contract updated successfully');
  } catch (error) {
    console.error('Failed to update contract:', error);
    toast.error('Failed to update contract');
    
    // Revert on error
    await loadContracts();
  }
};
```

## Step 4: Add Loading States

Add loading indicators throughout the UI:

```typescript
// Add loading state
const [loading, setLoading] = useState(false);

// In the render:
{loading ? (
  <div className="flex items-center justify-center h-64">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
) : (
  <ContractsTable contracts={contracts} />
)}
```

## Step 5: Add Error Handling

Implement proper error handling with user feedback:

```typescript
// Add error state
const [error, setError] = useState<string | null>(null);

// In data fetching:
try {
  const data = await ContractService.getContracts();
  setContracts(data.contracts);
} catch (error) {
  setError('Failed to load contracts. Please try again.');
  console.error('Contract fetch error:', error);
}

// In the render:
{error && (
  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
    {error}
  </div>
)}
```

## Step 6: Update Type Definitions

Update `src/types/contract.ts` to match backend response:

```typescript
export interface Contract {
  id: string;
  title: string;
  type: ContractType;
  status: ContractStatus;
  parties: string;
  value: string;
  documents: number;
  updated: string;
  updatedAt: string;
  createdAt: string;
  
  // Party details
  buyer: string;
  buyerEmail?: string;
  seller: string;
  sellerEmail?: string;
  agent?: string;
  agentEmail?: string;
  
  // Property details
  propertyAddress?: string;
  propertyType?: string;
  escrowNumber?: string;
  
  // Financial details
  earnestMoney?: string;
  downPayment?: string;
  loanAmount?: string;
  interestRate?: number;
  loanTerm?: number;
  lenderName?: string;
  
  // Dates
  closingDate?: string;
  dueDate?: string;
  
  // Additional fields
  milestone?: string;
  notes?: string;
  contingencies?: string;
  specialProvisions?: string;
  
  // Related data
  tasks?: ContractTask[];
  documentsList?: ContractDocument[];
  signatures?: ContractSignature[];
  comments?: ContractComment[];
  activityLog?: ActivityLogEntry[];
}

export interface ContractListResponse {
  contracts: Contract[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}
```

## Step 7: Implement Real-time Updates (Optional)

Add WebSocket support for real-time contract updates:

```typescript
import { useEffect } from 'react';

const useContractWebSocket = (contractId: string) => {
  useEffect(() => {
    const ws = new WebSocket(`${process.env.NEXT_PUBLIC_WS_URL}/contracts/${contractId}`);
    
    ws.onmessage = (event) => {
      const update = JSON.parse(event.data);
      // Handle real-time updates
      handleContractUpdate(update);
    };
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
    
    return () => {
      ws.close();
    };
  }, [contractId]);
};
```

## Step 8: Testing Checklist

Before deploying, test the following:

- [ ] Contract list loads correctly
- [ ] Pagination works
- [ ] Filtering by status/type works
- [ ] Search functionality works
- [ ] Contract creation works
- [ ] Contract editing works
- [ ] Contract deletion works
- [ ] Field updates work
- [ ] Status transitions work correctly
- [ ] Comments can be added
- [ ] Documents can be uploaded
- [ ] Error states display correctly
- [ ] Loading states display correctly
- [ ] Authentication works (if implemented)

## Step 9: Backend Requirements

Ensure the backend has:

1. **CORS configured** for frontend URL
2. **MongoDB indexes** on frequently queried fields:
   ```python
   # Add in MongoDB setup
   await db.contracts.create_index([("id", 1)])
   await db.contracts.create_index([("status", 1)])
   await db.contracts.create_index([("type", 1)])
   await db.contracts.create_index([("updatedAt", -1)])
   ```

3. **Rate limiting** for API endpoints
4. **Input validation** for all endpoints
5. **Error logging** for debugging

## Step 10: Deployment Considerations

For production deployment:

1. **Environment Variables**: Use different API URLs for dev/staging/prod
2. **HTTPS**: Ensure API uses HTTPS in production
3. **Authentication**: Implement proper JWT-based auth
4. **Error Tracking**: Use services like Sentry
5. **Performance Monitoring**: Implement APM tools
6. **Caching**: Add Redis for frequently accessed data
7. **CDN**: Use CDN for static assets

## Common Issues and Solutions

### Issue: CORS errors
**Solution**: Ensure backend CORS middleware includes frontend URL:
```python
origins = [
    "http://localhost:3000",
    "https://your-frontend-domain.com"
]
```

### Issue: Date formatting inconsistencies
**Solution**: Use ISO 8601 format consistently and format in frontend:
```typescript
import { format } from 'date-fns';
const formattedDate = format(new Date(contract.closingDate), 'MMM dd, yyyy');
```

### Issue: Large payload sizes
**Solution**: Implement pagination and lazy loading:
```typescript
// Load detailed data only when needed
const contractDetails = await ContractService.getContract(id);
```

### Issue: Network errors
**Solution**: Implement retry logic:
```typescript
const retryRequest = async (fn: Function, retries = 3) => {
  try {
    return await fn();
  } catch (error) {
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return retryRequest(fn, retries - 1);
    }
    throw error;
  }
};
```

## Next Steps

After completing the contracts integration:

1. Implement similar patterns for other modules (Tasks, Signatures, Documents)
2. Add comprehensive error handling
3. Implement caching strategies
4. Add optimistic updates for better UX
5. Implement offline support with service workers
6. Add comprehensive testing (unit, integration, e2e)