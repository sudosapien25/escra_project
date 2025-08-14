# Contracts API Specification

## Overview
This document defines the API specification for the contracts module, bridging the gap between the current frontend implementation and the backend Python FastAPI service.

## Current State Analysis

### Frontend (Next.js)
- **Current Implementation**: Uses mock data with local file storage (JSON files)
- **API Base**: `/api/contracts` (Next.js API routes)
- **Data Format**: Complex nested structure with extensive property fields

### Backend (FastAPI)
- **Current Implementation**: Basic MongoDB CRUD operations
- **API Base**: `/api/mongo/contracts`
- **Data Format**: Simplified contract structure

## Required API Endpoints

### 1. List Contracts
**Endpoint**: `GET /api/contracts`

**Query Parameters**:
```typescript
{
  page?: number;          // Default: 1
  limit?: number;         // Default: 20
  status?: string;        // Filter by status
  type?: string;          // Filter by type
  search?: string;        // Search in title, parties
  sortBy?: string;        // Field to sort by
  sortOrder?: 'asc' | 'desc'; // Sort direction
}
```

**Response**:
```json
{
  "contracts": [
    {
      "id": "string",
      "title": "string",
      "parties": "string", // Formatted string of parties
      "status": "string",
      "updated": "string", // Relative time (e.g., "2 hours ago")
      "updatedAt": "ISO 8601 datetime",
      "value": "string",   // Formatted currency
      "documents": 0,      // Count of documents
      "type": "string",
      "milestone": "string",
      "closingDate": "YYYY-MM-DD",
      "dueDate": "YYYY-MM-DD"
    }
  ],
  "pagination": {
    "total": 0,
    "page": 1,
    "limit": 20,
    "pages": 1
  }
}
```

### 2. Get Contract Details
**Endpoint**: `GET /api/contracts/{contractId}`

**Response**:
```json
{
  "id": "string",
  "title": "string",
  "type": "string",
  "status": "string",
  "parties": "string",
  "value": "string",
  "documents": 0,
  "updated": "string",
  "updatedAt": "ISO 8601 datetime",
  "createdAt": "ISO 8601 datetime",
  
  // Party Details
  "buyer": "string",
  "buyerEmail": "string",
  "seller": "string", 
  "sellerEmail": "string",
  "agent": "string",
  "agentEmail": "string",
  
  // Property Details
  "propertyAddress": "string",
  "propertyType": "string",
  "escrowNumber": "string",
  
  // Financial Details
  "earnestMoney": "string",
  "downPayment": "string",
  "loanAmount": "string",
  "interestRate": "string",
  "loanTerm": "string",
  "lenderName": "string",
  
  // Banking Details
  "sellerFinancialInstitution": "string",
  "buyerFinancialInstitution": "string",
  "buyerAccountNumber": "string",
  "sellerAccountNumber": "string",
  "buyerFinancialInstitutionRoutingNumber": "string",
  "sellerFinancialInstitutionRoutingNumber": "string",
  
  // Additional Details
  "titleCompany": "string",
  "insuranceCompany": "string",
  "inspectionPeriod": "string",
  "contingencies": "string",
  "specialProvisions": "string",
  "milestone": "string",
  "notes": "string",
  "closingDate": "YYYY-MM-DD",
  "dueDate": "YYYY-MM-DD",
  
  // Related Data
  "tasks": [
    {
      "id": "string",
      "title": "string",
      "status": "string",
      "assignee": "string",
      "dueDate": "YYYY-MM-DD"
    }
  ],
  "documentsList": [
    {
      "id": "string",
      "name": "string",
      "type": "string",
      "status": "string",
      "uploadedAt": "ISO 8601 datetime",
      "size": 0,
      "url": "string"
    }
  ],
  "signatures": [
    {
      "id": "string",
      "party": "string",
      "status": "pending | signed | rejected",
      "signedAt": "ISO 8601 datetime",
      "ipAddress": "string"
    }
  ],
  "comments": [
    {
      "id": "string",
      "author": "string",
      "content": "string",
      "timestamp": "ISO 8601 datetime"
    }
  ],
  "activityLog": [
    {
      "id": "string",
      "action": "string",
      "user": "string",
      "timestamp": "ISO 8601 datetime",
      "details": "string"
    }
  ]
}
```

### 3. Create Contract
**Endpoint**: `POST /api/contracts`

**Request Body**:
```json
{
  "title": "string",
  "type": "Property Sale | Commercial Lease | Construction Escrow | Investment Property",
  "status": "Initiation",
  
  // Party Information
  "buyer": "string",
  "buyerEmail": "string",
  "seller": "string",
  "sellerEmail": "string",
  "agent": "string",
  "agentEmail": "string",
  
  // Property Details
  "propertyAddress": "string",
  "propertyType": "string",
  "value": "number",
  
  // Dates
  "closingDate": "YYYY-MM-DD",
  "dueDate": "YYYY-MM-DD",
  
  // Financial Details (optional)
  "earnestMoney": "number",
  "downPayment": "number",
  "loanAmount": "number",
  "interestRate": "number",
  "loanTerm": "number",
  "lenderName": "string",
  
  // Additional Details (optional)
  "notes": "string",
  "milestone": "string",
  "contingencies": "string",
  "specialProvisions": "string"
}
```

**Response**: Same as Get Contract Details

### 4. Update Contract
**Endpoint**: `PUT /api/contracts/{contractId}`

**Request Body**: Partial update - any fields from Create Contract

**Response**: Same as Get Contract Details

### 5. Update Contract Field
**Endpoint**: `PATCH /api/contracts/{contractId}`

**Request Body**:
```json
{
  "field": "string",
  "value": "any"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Contract updated successfully",
  "updated": {
    "field": "string",
    "value": "any"
  }
}
```

### 6. Delete Contract
**Endpoint**: `DELETE /api/contracts/{contractId}`

**Response**:
```json
{
  "success": true,
  "message": "Contract deleted successfully"
}
```

### 7. Contract Status Update
**Endpoint**: `PUT /api/contracts/{contractId}/status`

**Request Body**:
```json
{
  "status": "Initiation | Preparation | Wire Details | In Review | Signatures | Funds Disbursed | Complete",
  "reason": "string (optional)"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Status updated successfully",
  "contract": { /* updated contract */ }
}
```

### 8. Contract Comments
**Endpoint**: `POST /api/contracts/{contractId}/comments`

**Request Body**:
```json
{
  "content": "string"
}
```

**Response**:
```json
{
  "id": "string",
  "contractId": "string",
  "author": "string",
  "content": "string",
  "timestamp": "ISO 8601 datetime"
}
```

### 9. Contract Documents
**Endpoint**: `POST /api/contracts/{contractId}/documents`

**Request**: Multipart form data with file upload

**Response**:
```json
{
  "id": "string",
  "contractId": "string",
  "name": "string",
  "type": "string",
  "size": 0,
  "url": "string",
  "uploadedAt": "ISO 8601 datetime"
}
```

### 10. Contract Tasks
**Endpoint**: `GET /api/contracts/{contractId}/tasks`

**Response**:
```json
{
  "tasks": [
    {
      "id": "string",
      "contractId": "string",
      "title": "string",
      "description": "string",
      "status": "pending | in_progress | completed",
      "assignee": "string",
      "dueDate": "YYYY-MM-DD",
      "createdAt": "ISO 8601 datetime",
      "updatedAt": "ISO 8601 datetime"
    }
  ]
}
```

## Status Workflow

Valid status transitions:
1. **Initiation** → Preparation
2. **Preparation** → Wire Details
3. **Wire Details** → In Review
4. **In Review** → Signatures
5. **Signatures** → Funds Disbursed
6. **Funds Disbursed** → Complete

## Data Validation Rules

### Required Fields for Contract Creation:
- `title`: Non-empty string, max 200 characters
- `type`: Must be one of the defined types
- `buyer`: Non-empty string
- `seller`: Non-empty string
- `value`: Positive number

### Email Validation:
- All email fields must be valid email format
- Optional but validated if provided

### Date Validation:
- `closingDate` must be future date
- `dueDate` must be on or after current date
- Dates in YYYY-MM-DD format

### Financial Validation:
- All monetary values must be positive numbers
- Interest rate between 0 and 100
- Loan term must be positive integer

## Error Responses

### Standard Error Format:
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": { /* optional additional details */ }
  }
}
```

### Common Error Codes:
- `CONTRACT_NOT_FOUND`: Contract with specified ID doesn't exist
- `VALIDATION_ERROR`: Input validation failed
- `UNAUTHORIZED`: User not authorized for this action
- `INVALID_STATUS_TRANSITION`: Invalid status change
- `DUPLICATE_CONTRACT`: Contract with same details already exists

## Backend Implementation Requirements

### 1. Database Schema Updates
The MongoDB collection needs to be updated to support all the fields used by the frontend:

```python
# Extended Contract Model
class Contract(BaseModel):
    # Basic Information
    id: str
    title: str
    type: str
    status: str
    
    # Parties
    buyer: str
    buyerEmail: Optional[str]
    seller: str
    sellerEmail: Optional[str]
    agent: Optional[str]
    agentEmail: Optional[str]
    
    # Property Details
    propertyAddress: Optional[str]
    propertyType: Optional[str]
    escrowNumber: Optional[str]
    
    # Financial Details
    value: Optional[float]
    earnestMoney: Optional[float]
    downPayment: Optional[float]
    loanAmount: Optional[float]
    interestRate: Optional[float]
    loanTerm: Optional[int]
    lenderName: Optional[str]
    
    # Banking Details
    sellerFinancialInstitution: Optional[str]
    buyerFinancialInstitution: Optional[str]
    buyerAccountNumber: Optional[str]
    sellerAccountNumber: Optional[str]
    buyerFinancialInstitutionRoutingNumber: Optional[str]
    sellerFinancialInstitutionRoutingNumber: Optional[str]
    
    # Additional Details
    titleCompany: Optional[str]
    insuranceCompany: Optional[str]
    inspectionPeriod: Optional[str]
    contingencies: Optional[str]
    specialProvisions: Optional[str]
    milestone: Optional[str]
    notes: Optional[str]
    
    # Dates
    closingDate: Optional[date]
    dueDate: Optional[date]
    createdAt: datetime
    updatedAt: datetime
    
    # Related Data References
    documents: List[str] = []
    tasks: List[str] = []
    signatures: List[str] = []
    comments: List[str] = []
```

### 2. Service Layer Implementation
Create a contracts service layer to handle business logic:

```python
# services/contract_service.py
class ContractService:
    @staticmethod
    async def create_contract(contract_data: dict) -> Contract:
        # Validate business rules
        # Generate unique ID
        # Set initial status
        # Create audit log entry
        pass
    
    @staticmethod
    async def update_status(contract_id: str, new_status: str) -> Contract:
        # Validate status transition
        # Update contract
        # Create activity log
        # Send notifications
        pass
    
    @staticmethod
    async def calculate_metrics() -> dict:
        # Calculate dashboard metrics
        # Total contracts, values, pending items
        pass
```

### 3. Frontend Integration Updates

#### Environment Configuration
Add to `.env.local`:
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

#### API Service Update
Update `src/services/contractService.ts`:

```typescript
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export class ContractService {
  static async getContracts(params?: any) {
    const response = await axios.get(`${API_URL}/contracts`, { params });
    return response.data;
  }
  
  static async getContract(id: string) {
    const response = await axios.get(`${API_URL}/contracts/${id}`);
    return response.data;
  }
  
  static async createContract(contractData: any) {
    const response = await axios.post(`${API_URL}/contracts`, contractData);
    return response.data;
  }
  
  static async updateContract(id: string, updates: any) {
    const response = await axios.put(`${API_URL}/contracts/${id}`, updates);
    return response.data;
  }
  
  static async deleteContract(id: string) {
    const response = await axios.delete(`${API_URL}/contracts/${id}`);
    return response.data;
  }
}
```

### 4. Authentication & Authorization
Implement JWT-based authentication:

```python
# Middleware for protected routes
@router.get("/contracts", dependencies=[Depends(get_current_user)])
async def get_contracts(current_user: User = Depends(get_current_user)):
    # Filter contracts based on user permissions
    pass
```

### 5. Real-time Updates
Implement WebSocket support for real-time contract updates:

```python
# WebSocket endpoint for contract updates
@router.websocket("/ws/contracts/{contract_id}")
async def contract_updates(websocket: WebSocket, contract_id: str):
    await websocket.accept()
    # Send real-time updates for contract changes
```

## Migration Strategy

### Phase 1: Backend API Implementation
1. Update MongoDB schema
2. Implement all CRUD endpoints
3. Add validation and error handling
4. Implement business logic

### Phase 2: Frontend Integration
1. Update environment configuration
2. Replace mock service with API calls
3. Add error handling and loading states
4. Implement real-time updates

### Phase 3: Data Migration
1. Export existing mock data
2. Transform to new schema format
3. Import into MongoDB
4. Verify data integrity

### Phase 4: Testing & Deployment
1. Unit tests for API endpoints
2. Integration tests
3. E2E tests with frontend
4. Deploy to staging
5. Production deployment

## Performance Considerations

1. **Pagination**: Implement cursor-based pagination for large datasets
2. **Caching**: Use Redis for frequently accessed data
3. **Indexing**: Create MongoDB indexes on frequently queried fields
4. **Rate Limiting**: Implement rate limiting for API endpoints
5. **Batch Operations**: Support bulk create/update operations

## Security Considerations

1. **Input Validation**: Strict validation of all input data
2. **SQL Injection**: Use parameterized queries
3. **XSS Prevention**: Sanitize all user input
4. **CORS**: Configure appropriate CORS policies
5. **Audit Logging**: Log all contract modifications
6. **Encryption**: Encrypt sensitive financial data at rest