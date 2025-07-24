# ESCRA Backend API Specification

## API Overview

**Base URL**: `https://api.escra.com/v1`  
**Protocol**: HTTPS only  
**Format**: JSON  
**Authentication**: Bearer Token (JWT)

## Common Headers

```
Content-Type: application/json
Authorization: Bearer <jwt_token>
X-Request-ID: <unique_request_id>
```

## Common Response Format

### Success Response
```json
{
  "success": true,
  "data": {
    // Response data
  },
  "meta": {
    "timestamp": "2024-01-01T00:00:00Z",
    "request_id": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {
      // Additional error details
    }
  },
  "meta": {
    "timestamp": "2024-01-01T00:00:00Z",
    "request_id": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

## Authentication Endpoints

### 1. Register User

**POST** `/auth/register`

Create a new user account.

#### Request Body
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "firstName": "John",
  "lastName": "Doe",
  "accountType": "personal" // "personal" or "business"
}
```

#### Response (201 Created)
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "usr_1234567890",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "accountType": "personal",
      "emailVerified": false,
      "createdAt": "2024-01-01T00:00:00Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Error Responses
- `400 Bad Request` - Invalid input data
- `409 Conflict` - Email already exists

### 2. Login

**POST** `/auth/login`

Authenticate user and receive access tokens.

#### Request Body
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

#### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "usr_1234567890",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "accountType": "personal",
      "emailVerified": true
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 3600
  }
}
```

#### Error Responses
- `401 Unauthorized` - Invalid credentials
- `403 Forbidden` - Account locked/suspended

### 3. Refresh Token

**POST** `/auth/refresh`

Get a new access token using refresh token.

#### Request Body
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 3600
  }
}
```

### 4. Logout

**POST** `/auth/logout`

Invalidate current session.

#### Headers
```
Authorization: Bearer <jwt_token>
```

#### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "message": "Successfully logged out"
  }
}
```

### 5. Forgot Password

**POST** `/auth/forgot-password`

Request password reset email.

#### Request Body
```json
{
  "email": "user@example.com"
}
```

#### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "message": "Password reset email sent"
  }
}
```

### 6. Reset Password

**POST** `/auth/reset-password`

Reset password using token from email.

#### Request Body
```json
{
  "token": "reset_token_from_email",
  "newPassword": "NewSecurePassword123!"
}
```

#### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "message": "Password successfully reset"
  }
}
```

## User Profile Endpoints

### 1. Get Current User Profile

**GET** `/users/me`

Get authenticated user's profile.

#### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "id": "usr_1234567890",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "accountType": "business",
    "company": {
      "name": "ACME Corp",
      "type": "corporation",
      "industry": "technology",
      "address": {
        "street": "123 Main St",
        "city": "San Francisco",
        "state": "CA",
        "zipCode": "94105",
        "country": "US"
      },
      "phone": "+1-555-123-4567",
      "website": "https://acme.com"
    },
    "preferences": {
      "emailNotifications": true,
      "smsNotifications": false,
      "language": "en",
      "timezone": "America/Los_Angeles"
    },
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

### 2. Update User Profile

**PUT** `/users/me`

Update authenticated user's profile.

#### Request Body
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "company": {
    "name": "ACME Corp",
    "website": "https://acme.com"
  },
  "preferences": {
    "emailNotifications": false
  }
}
```

#### Response (200 OK)
```json
{
  "success": true,
  "data": {
    // Updated user object
  }
}
```

### 3. Complete Onboarding

**POST** `/users/me/onboarding`

Complete user onboarding with additional information.

#### Request Body
```json
{
  "company": {
    "name": "ACME Corp",
    "type": "corporation",
    "industry": ["technology", "finance"],
    "address": {
      "street": "123 Main St",
      "city": "San Francisco",
      "state": "CA",
      "zipCode": "94105",
      "country": "US"
    },
    "phone": "+1-555-123-4567",
    "website": "https://acme.com"
  }
}
```

#### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "onboardingCompleted": true,
    "user": {
      // Updated user object with company info
    }
  }
}
```

## Contract Management Endpoints

### 1. List Contracts

**GET** `/contracts`

Get paginated list of contracts.

#### Query Parameters
- `page` (integer): Page number (default: 1)
- `limit` (integer): Items per page (default: 20, max: 100)
- `status` (string): Filter by status (draft, pending, active, completed, cancelled)
- `search` (string): Search in contract title/content
- `sort` (string): Sort field (createdAt, updatedAt, title)
- `order` (string): Sort order (asc, desc)

#### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "contracts": [
      {
        "id": "con_1234567890",
        "title": "Service Agreement",
        "description": "Web development services",
        "status": "active",
        "type": "service_agreement",
        "parties": [
          {
            "id": "usr_1234567890",
            "name": "John Doe",
            "email": "john@example.com",
            "role": "client"
          },
          {
            "id": "usr_0987654321",
            "name": "Jane Smith",
            "email": "jane@example.com",
            "role": "provider"
          }
        ],
        "value": {
          "amount": 50000,
          "currency": "USD"
        },
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-01T00:00:00Z",
        "expiresAt": "2024-12-31T23:59:59Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "pages": 8
    }
  }
}
```

### 2. Create Contract

**POST** `/contracts`

Create a new contract.

#### Request Body
```json
{
  "title": "Service Agreement",
  "description": "Web development services",
  "type": "service_agreement",
  "templateId": "tpl_1234567890", // Optional
  "content": {
    "html": "<h1>Service Agreement</h1>...",
    "variables": {
      "clientName": "John Doe",
      "providerName": "Jane Smith",
      "serviceDescription": "Web development",
      "amount": 50000
    }
  },
  "parties": [
    {
      "userId": "usr_1234567890",
      "role": "client",
      "signatureRequired": true,
      "signatureOrder": 1
    },
    {
      "email": "jane@example.com",
      "name": "Jane Smith",
      "role": "provider",
      "signatureRequired": true,
      "signatureOrder": 2
    }
  ],
  "value": {
    "amount": 50000,
    "currency": "USD"
  },
  "metadata": {
    "projectId": "proj_123",
    "department": "IT"
  },
  "expiresAt": "2024-12-31T23:59:59Z"
}
```

#### Response (201 Created)
```json
{
  "success": true,
  "data": {
    "id": "con_1234567890",
    "title": "Service Agreement",
    "status": "draft",
    // ... full contract object
  }
}
```

### 3. Get Contract

**GET** `/contracts/{contractId}`

Get specific contract details.

#### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "id": "con_1234567890",
    "title": "Service Agreement",
    "description": "Web development services",
    "status": "active",
    "type": "service_agreement",
    "content": {
      "html": "<h1>Service Agreement</h1>...",
      "variables": {
        "clientName": "John Doe",
        "providerName": "Jane Smith"
      }
    },
    "parties": [
      {
        "id": "usr_1234567890",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "client",
        "signatureStatus": "signed",
        "signedAt": "2024-01-02T10:00:00Z"
      }
    ],
    "signatures": [
      {
        "id": "sig_1234567890",
        "userId": "usr_1234567890",
        "type": "electronic",
        "ipAddress": "192.168.1.1",
        "userAgent": "Mozilla/5.0...",
        "timestamp": "2024-01-02T10:00:00Z",
        "certificate": "MIIC+TCCAeGgAwIBAgIJAKs..."
      }
    ],
    "blockchain": {
      "hash": "0x742d35Cc6634C0532925a3b844Bc9e7595f7F67b",
      "transactionId": "0x123...",
      "network": "ethereum",
      "blockNumber": 12345678,
      "timestamp": "2024-01-02T10:05:00Z"
    },
    "attachments": [
      {
        "id": "att_1234567890",
        "filename": "appendix-a.pdf",
        "size": 1048576,
        "mimeType": "application/pdf",
        "uploadedAt": "2024-01-01T10:00:00Z"
      }
    ],
    "audit": [
      {
        "action": "created",
        "userId": "usr_1234567890",
        "timestamp": "2024-01-01T00:00:00Z",
        "details": {}
      },
      {
        "action": "signed",
        "userId": "usr_1234567890",
        "timestamp": "2024-01-02T10:00:00Z",
        "details": {
          "signatureId": "sig_1234567890"
        }
      }
    ],
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-02T10:00:00Z"
  }
}
```

### 4. Update Contract

**PUT** `/contracts/{contractId}`

Update contract (only in draft status).

#### Request Body
```json
{
  "title": "Updated Service Agreement",
  "description": "Updated description",
  "content": {
    "html": "<h1>Updated content</h1>..."
  }
}
```

#### Response (200 OK)
```json
{
  "success": true,
  "data": {
    // Updated contract object
  }
}
```

### 5. Send Contract for Signature

**POST** `/contracts/{contractId}/send`

Send contract to parties for signature.

#### Request Body
```json
{
  "message": "Please review and sign this contract",
  "reminderDays": [3, 7, 14]
}
```

#### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "contractId": "con_1234567890",
    "status": "pending",
    "sentTo": [
      {
        "email": "john@example.com",
        "sentAt": "2024-01-01T10:00:00Z"
      },
      {
        "email": "jane@example.com",
        "sentAt": "2024-01-01T10:00:00Z"
      }
    ]
  }
}
```

### 6. Delete Contract

**DELETE** `/contracts/{contractId}`

Delete contract (only in draft status).

#### Response (204 No Content)

## Signature Endpoints

### 1. List Signatures

**GET** `/signatures`

Get list of signature requests.

#### Query Parameters
- `status` (string): Filter by status (pending, signed, declined)
- `contractId` (string): Filter by contract

#### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "signatures": [
      {
        "id": "sig_req_1234567890",
        "contractId": "con_1234567890",
        "contractTitle": "Service Agreement",
        "requestedFrom": {
          "id": "usr_1234567890",
          "name": "John Doe",
          "email": "john@example.com"
        },
        "status": "pending",
        "requestedAt": "2024-01-01T10:00:00Z",
        "expiresAt": "2024-01-15T23:59:59Z"
      }
    ]
  }
}
```

### 2. Sign Contract

**POST** `/signatures/{contractId}/sign`

Sign a contract.

#### Request Body
```json
{
  "signatureType": "drawn", // "drawn", "typed", "upload"
  "signatureData": "data:image/png;base64,iVBORw0KGgoAAAANS...", // For drawn/upload
  "signatureText": "John Doe", // For typed
  "acceptTerms": true,
  "ipAddress": "192.168.1.1" // Optional, auto-detected if not provided
}
```

#### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "signatureId": "sig_1234567890",
    "contractId": "con_1234567890",
    "timestamp": "2024-01-02T10:00:00Z",
    "certificate": "MIIC+TCCAeGgAwIBAgIJAKs...",
    "blockchainHash": "0x742d35Cc6634C0532925a3b844Bc9e7595f7F67b"
  }
}
```

### 3. Decline Signature

**POST** `/signatures/{contractId}/decline`

Decline to sign a contract.

#### Request Body
```json
{
  "reason": "Terms not acceptable",
  "message": "I need to discuss the payment terms"
}
```

#### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "contractId": "con_1234567890",
    "status": "declined",
    "declinedAt": "2024-01-02T10:00:00Z"
  }
}
```

## Template Endpoints

### 1. List Templates

**GET** `/templates`

Get available contract templates.

#### Query Parameters
- `category` (string): Filter by category
- `industry` (string): Filter by industry

#### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "templates": [
      {
        "id": "tpl_1234567890",
        "name": "Standard Service Agreement",
        "description": "General purpose service agreement",
        "category": "service",
        "industries": ["technology", "consulting"],
        "variables": [
          {
            "key": "clientName",
            "label": "Client Name",
            "type": "text",
            "required": true
          },
          {
            "key": "serviceDescription",
            "label": "Service Description",
            "type": "textarea",
            "required": true
          },
          {
            "key": "amount",
            "label": "Contract Amount",
            "type": "number",
            "required": true
          }
        ],
        "previewUrl": "https://api.escra.com/v1/templates/tpl_1234567890/preview"
      }
    ]
  }
}
```

### 2. Get Template

**GET** `/templates/{templateId}`

Get specific template details.

#### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "id": "tpl_1234567890",
    "name": "Standard Service Agreement",
    "content": {
      "html": "<h1>{{companyName}} Service Agreement</h1>...",
      "css": ".contract { font-family: Arial; }",
      "variables": [
        {
          "key": "clientName",
          "label": "Client Name",
          "type": "text",
          "required": true,
          "validation": {
            "minLength": 2,
            "maxLength": 100
          }
        }
      ]
    }
  }
}
```

## Blockchain Endpoints

### 1. Verify Contract

**POST** `/blockchain/verify`

Verify contract authenticity on blockchain.

#### Request Body
```json
{
  "contractId": "con_1234567890",
  "hash": "0x742d35Cc6634C0532925a3b844Bc9e7595f7F67b"
}
```

#### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "verified": true,
    "blockchain": {
      "network": "ethereum",
      "transactionId": "0x123...",
      "blockNumber": 12345678,
      "timestamp": "2024-01-02T10:05:00Z",
      "contractAddress": "0x742d35Cc6634C0532925a3b844Bc9e7595f7F67b"
    }
  }
}
```

### 2. Get Blockchain Status

**GET** `/blockchain/status/{contractId}`

Get blockchain transaction status for a contract.

#### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "contractId": "con_1234567890",
    "status": "confirmed",
    "transactions": [
      {
        "type": "contract_creation",
        "hash": "0x123...",
        "network": "ethereum",
        "status": "confirmed",
        "confirmations": 12,
        "gasUsed": "21000",
        "timestamp": "2024-01-02T10:05:00Z"
      }
    ]
  }
}
```

## Notification Endpoints

### 1. Get Notifications

**GET** `/notifications`

Get user notifications.

#### Query Parameters
- `unread` (boolean): Filter unread only
- `type` (string): Filter by type (signature_request, contract_signed, etc.)

#### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "id": "not_1234567890",
        "type": "signature_request",
        "title": "New signature request",
        "message": "John Doe requested your signature on Service Agreement",
        "data": {
          "contractId": "con_1234567890",
          "requesterId": "usr_1234567890"
        },
        "read": false,
        "createdAt": "2024-01-01T10:00:00Z"
      }
    ]
  }
}
```

### 2. Mark Notification as Read

**PUT** `/notifications/{notificationId}/read`

Mark notification as read.

#### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "id": "not_1234567890",
    "read": true,
    "readAt": "2024-01-01T10:05:00Z"
  }
}
```

## Webhook Events

Webhooks can be configured to receive real-time updates.

### Event Types

1. **contract.created** - New contract created
2. **contract.sent** - Contract sent for signatures
3. **contract.signed** - Contract signed by a party
4. **contract.completed** - All parties have signed
5. **contract.declined** - Contract declined by a party
6. **contract.expired** - Contract expired
7. **user.registered** - New user registered
8. **user.verified** - User email verified

### Webhook Payload Format

```json
{
  "id": "evt_1234567890",
  "type": "contract.signed",
  "created": "2024-01-01T10:00:00Z",
  "data": {
    "contractId": "con_1234567890",
    "userId": "usr_1234567890",
    "signatureId": "sig_1234567890"
  }
}
```

### Webhook Security

Webhooks are signed using HMAC-SHA256. Verify the signature:

```
Signature = HMAC-SHA256(webhook_secret, request_body)
```

Compare with `X-ESCRA-Signature` header.

## Rate Limiting

API requests are rate limited:

- **Authenticated requests**: 1000 requests per hour
- **Unauthenticated requests**: 100 requests per hour

Rate limit headers:
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
```

## Error Codes

| Code | Description |
|------|-------------|
| `AUTH_INVALID_CREDENTIALS` | Invalid email or password |
| `AUTH_TOKEN_EXPIRED` | JWT token has expired |
| `AUTH_TOKEN_INVALID` | Invalid JWT token |
| `USER_NOT_FOUND` | User does not exist |
| `USER_EMAIL_EXISTS` | Email already registered |
| `CONTRACT_NOT_FOUND` | Contract does not exist |
| `CONTRACT_ACCESS_DENIED` | No permission to access contract |
| `CONTRACT_ALREADY_SIGNED` | Contract already signed by user |
| `CONTRACT_EXPIRED` | Contract has expired |
| `VALIDATION_ERROR` | Input validation failed |
| `RATE_LIMIT_EXCEEDED` | Too many requests |
| `INTERNAL_ERROR` | Internal server error |

## SDKs and Code Examples

### JavaScript/TypeScript
```typescript
import { EscraClient } from '@escra/sdk';

const client = new EscraClient({
  apiKey: 'your_api_key',
  environment: 'production'
});

// Register user
const user = await client.auth.register({
  email: 'user@example.com',
  password: 'SecurePassword123!',
  firstName: 'John',
  lastName: 'Doe'
});

// Create contract
const contract = await client.contracts.create({
  title: 'Service Agreement',
  templateId: 'tpl_1234567890',
  parties: [
    { userId: 'usr_1234567890', role: 'client' }
  ]
});

// Sign contract
const signature = await client.signatures.sign(contract.id, {
  signatureType: 'drawn',
  signatureData: 'base64_signature_data'
});
```

### Python
```python
from escra import EscraClient

client = EscraClient(
    api_key='your_api_key',
    environment='production'
)

# Register user
user = client.auth.register(
    email='user@example.com',
    password='SecurePassword123!',
    first_name='John',
    last_name='Doe'
)

# Create contract
contract = client.contracts.create(
    title='Service Agreement',
    template_id='tpl_1234567890',
    parties=[
        {'user_id': 'usr_1234567890', 'role': 'client'}
    ]
)
```

## API Versioning

The API uses URL versioning. Current version is `v1`. When breaking changes are introduced, a new version will be released.

Deprecated versions will be supported for at least 6 months with advance notice.

## Support

- **Documentation**: https://docs.escra.com
- **API Status**: https://status.escra.com
- **Support Email**: api-support@escra.com
- **Developer Forum**: https://forum.escra.com