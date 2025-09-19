# Escra System Architecture Diagrams

## 1. High-Level System Architecture

```mermaid
graph TB
    subgraph "Frontend (Next.js)"
        A[Dashboard Page] --> B[Contracts Page]
        A --> C[Signatures Page]
        A --> D[Workflows Page]
        A --> E[Admin Settings]
        F[Auth Context] --> A
        F --> B
        F --> C
        F --> D
        F --> E
        G[Notification Context] --> A
        H[Theme Context] --> A
    end
    
    subgraph "Backend (FastAPI)"
        I[Main API] --> J[MongoDB Routes]
        I --> K[Status Routes]
        J --> L[Contract Management]
        J --> M[Document Management]
        J --> N[Signature Management]
        K --> O[Status Tracking Service]
        K --> P[WebSocket Service]
    end
    
    subgraph "Database Layer"
        Q[(MongoDB)]
        R[(PostgreSQL)]
    end
    
    subgraph "External Services"
        S[DocuSign API]
        T[Blockchain Network]
        U[File Storage]
    end
    
    A --> I
    B --> I
    C --> I
    D --> I
    E --> I
    
    J --> Q
    O --> Q
    P --> Q
    
    N --> S
    L --> T
    M --> U
    
    style A fill:#23B5B5,stroke:#000,stroke-width:2px,color:#fff
    style I fill:#23B5B5,stroke:#000,stroke-width:2px,color:#fff
    style Q fill:#4CAF50,stroke:#000,stroke-width:2px,color:#fff
    style T fill:#FF9800,stroke:#000,stroke-width:2px,color:#fff
```

## 2. Authentication and User Flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant A as AuthContext
    participant B as Backend
    participant DB as Database
    
    U->>F: Access protected route
    F->>A: Check auth state
    A->>F: No token found
    F->>U: Redirect to /login
    
    U->>F: Enter credentials
    F->>A: login(email, password)
    A->>B: POST /auth/login
    B->>DB: Validate credentials
    DB->>B: Return user data
    B->>A: JWT token + user info
    A->>F: Set user state + cookie
    F->>U: Redirect to dashboard
    
    Note over U,DB: User is now authenticated
    
    U->>F: Access any protected route
    F->>A: Check auth state
    A->>F: Valid token found
    F->>U: Show protected content
    
    U->>F: Logout action
    F->>A: logout()
    A->>F: Clear user state + cookie
    F->>U: Redirect to login
```

## 3. Contract Lifecycle Workflow

```mermaid
stateDiagram-v2
    [*] --> Initiation : Contract Created
    
    Initiation --> Preparation : Basic details added
    Preparation --> WireDetails : Documents uploaded
    WireDetails --> InReview : Financial details complete
    InReview --> Signatures : Review approved
    Signatures --> FundsDisbursed : All signatures complete
    FundsDisbursed --> Complete : Wire transfer successful
    Complete --> [*]
    
    Initiation --> [*] : Contract cancelled
    Preparation --> [*] : Contract cancelled
    WireDetails --> [*] : Contract cancelled
    InReview --> Preparation : Review rejected
    Signatures --> InReview : Signatures rejected
    FundsDisbursed --> Signatures : Transfer failed
    
    note right of Initiation
        Contract created with
        basic information
    end note
    
    note right of Preparation
        Documents uploaded
        and parties added
    end note
    
    note right of WireDetails
        Banking information
        and wire instructions
    end note
    
    note right of Signatures
        All parties must
        sign documents
    end note
    
    note right of Complete
        Contract fully
        executed
    end note
```

## 4. Document Signing Process

```mermaid
sequenceDiagram
    participant U as User
    participant SP as Signatures Page
    participant SM as Signature Modal
    participant SPad as Signature Pad
    participant B as Backend
    participant DS as DocuSign
    participant DB as Database
    
    U->>SP: Click "Sign Document"
    SP->>SM: Open signature modal
    
    alt Native Escra Signing
        SM->>SPad: Show signature pad
        U->>SPad: Draw/type signature
        SPad->>SM: Return signature data
        SM->>B: POST /signatures/{id}/sign
        B->>DB: Update signature status
        DB->>B: Confirmation
        B->>SP: Success response
        SP->>U: Show success message
    else DocuSign Integration
        SM->>DS: Send document for signing
        DS->>U: Redirect to DocuSign
        U->>DS: Complete signing
        DS->>B: Webhook notification
        B->>DB: Update signature status
        B->>SP: Real-time update via WebSocket
        SP->>U: Show updated status
    end
    
    Note over U,DB: Signature process complete
```

## 5. Database Schema and Data Relationships

```mermaid
erDiagram
    CONTRACT {
        string id PK
        string code
        string title
        string type
        string status
        float value
        datetime created_at
        datetime updated_at
    }
    
    PARTY {
        string id PK
        string contract_id FK
        string name
        string role
        string type
        string email
        string phone
    }
    
    DOCUMENT {
        string id PK
        string contract_id FK
        string name
        string type
        string status
        string url
        int version
        datetime uploaded_at
    }
    
    SIGNATURE {
        string id PK
        string document_id FK
        string contract_id FK
        string status
        datetime sent_at
        datetime due_at
    }
    
    SIGNATURE_PARTY {
        string id PK
        string signature_id FK
        string name
        string role
        string status
        datetime signed_at
    }
    
    TASK {
        string id PK
        string contract_id FK
        string title
        string status
        datetime due_date
        string assignee_id FK
    }
    
    STATUS_TRACKING {
        string id PK
        string entity_type
        string entity_id
        string current_status
        boolean is_blocked
        datetime last_updated
    }
    
    USER {
        string id PK
        string email
        string name
        string role
        datetime created_at
    }
    
    CONTRACT ||--o{ PARTY : contains
    CONTRACT ||--o{ DOCUMENT : has
    CONTRACT ||--o{ SIGNATURE : includes
    CONTRACT ||--o{ TASK : contains
    DOCUMENT ||--o{ SIGNATURE : requires
    SIGNATURE ||--o{ SIGNATURE_PARTY : involves
    USER ||--o{ TASK : assigned_to
    STATUS_TRACKING }o--|| CONTRACT : tracks
    STATUS_TRACKING }o--|| DOCUMENT : tracks
    STATUS_TRACKING }o--|| SIGNATURE : tracks
    STATUS_TRACKING }o--|| TASK : tracks
```

## 6. Real-time Status Tracking System

```mermaid
graph TB
    subgraph "Frontend Components"
        A[Dashboard] --> B[Status Updates]
        C[Contracts Page] --> B
        D[Signatures Page] --> B
        E[Workflows Page] --> B
    end
    
    subgraph "Backend Services"
        F[Status Service] --> G[Status Tracking Collection]
        F --> H[WebSocket Service]
        H --> I[WebSocket Manager]
        I --> J[MongoDB Change Streams]
    end
    
    subgraph "Database"
        K[(MongoDB)]
        L[status_tracking collection]
        M[contracts collection]
        N[signatures collection]
        O[tasks collection]
    end
    
    subgraph "Real-time Flow"
        P[Status Change] --> Q[MongoDB Update]
        Q --> R[Change Stream Trigger]
        R --> S[WebSocket Broadcast]
        S --> T[Frontend Update]
    end
    
    A --> F
    C --> F
    D --> F
    E --> F
    
    G --> L
    J --> K
    L --> K
    M --> K
    N --> K
    O --> K
    
    P --> Q
    Q --> R
    R --> S
    S --> T
    T --> B
    
    style F fill:#23B5B5,stroke:#000,stroke-width:2px,color:#fff
    style H fill:#FF9800,stroke:#000,stroke-width:2px,color:#fff
    style K fill:#4CAF50,stroke:#000,stroke-width:2px,color:#fff
    style P fill:#E91E63,stroke:#000,stroke-width:2px,color:#fff
```

## 7. API Endpoints and Data Flow

```mermaid
graph LR
    subgraph "Frontend API Calls"
        A[Contracts API] --> B[GET /api/contracts]
        A --> C[POST /api/contracts]
        A --> D[PUT /api/contracts/{id}]
        A --> E[DELETE /api/contracts/{id}]
        
        F[Signatures API] --> G[GET /api/signatures]
        F --> H[POST /api/signatures]
        F --> I[PUT /api/signatures/{id}]
        
        J[Documents API] --> K[GET /api/documents]
        J --> L[POST /api/documents]
        J --> M[PUT /api/documents/{id}]
    end
    
    subgraph "Backend Routes"
        N[mongo_routes.py] --> O[Contract Management]
        N --> P[Document Management]
        N --> Q[Signature Management]
        N --> R[User Management]
        
        S[status.py] --> T[Status Updates]
        S --> U[WebSocket Endpoints]
    end
    
    subgraph "Data Processing"
        V[Status Service] --> W[Dependency Checking]
        V --> X[Status Transitions]
        V --> Y[Real-time Updates]
        
        Z[WebSocket Service] --> AA[Connection Management]
        Z --> BB[Broadcasting]
    end
    
    B --> O
    C --> O
    D --> O
    E --> O
    
    G --> Q
    H --> Q
    I --> Q
    
    K --> P
    L --> P
    M --> P
    
    O --> V
    P --> V
    Q --> V
    
    T --> V
    U --> Z
    
    style N fill:#23B5B5,stroke:#000,stroke-width:2px,color:#fff
    style S fill:#FF9800,stroke:#000,stroke-width:2px,color:#fff
    style V fill:#9C27B0,stroke:#000,stroke-width:2px,color:#fff
```

## 8. Component Architecture

```mermaid
graph TB
    subgraph "Pages"
        A[Dashboard Page] --> B[Contracts List]
        A --> C[Metrics Cards]
        A --> D[Activity Timeline]
        
        E[Contracts Page] --> F[Contracts Table]
        E --> G[New Contract Modal]
        E --> H[Contract Details]
        
        I[Signatures Page] --> J[Signatures Table]
        I --> K[Signature Modal]
        I --> L[Signature Pad]
        
        M[Workflows Page] --> N[Tasks Table]
        M --> O[Task Details]
        M --> P[Status Manager]
    end
    
    subgraph "Common Components"
        Q[Card] --> R[Button]
        Q --> S[Input]
        Q --> T[Select]
        Q --> U[Modal]
        
        V[Layout] --> W[Header]
        V --> X[Sidebar]
        V --> Y[Footer]
    end
    
    subgraph "Context Providers"
        Z[AuthContext] --> AA[User State]
        BB[NotificationContext] --> CC[Toast System]
        DD[ThemeContext] --> EE[Dark Mode]
    end
    
    subgraph "Data Stores"
        FF[Contract Store] --> GG[Contract State]
        HH[Document Store] --> II[Document State]
        JJ[Assignee Store] --> KK[Assignee State]
        LL[Task Store] --> MM[Task State]
    end
    
    A --> Q
    E --> Q
    I --> Q
    M --> Q
    
    A --> Z
    E --> Z
    I --> Z
    M --> Z
    
    A --> BB
    E --> BB
    I --> BB
    M --> BB
    
    E --> FF
    I --> HH
    M --> LL
    
    style A fill:#23B5B5,stroke:#000,stroke-width:2px,color:#fff
    style Q fill:#4CAF50,stroke:#000,stroke-width:2px,color:#fff
    style Z fill:#FF9800,stroke:#000,stroke-width:2px,color:#fff
    style FF fill:#9C27B0,stroke:#000,stroke-width:2px,color:#fff
```

## Key Architectural Patterns

### 1. **Frontend Architecture**
- **Next.js App Router**: File-based routing with layout nesting
- **Context API**: Global state management for auth, notifications, and theme
- **Component Composition**: Reusable UI components with consistent styling
- **Custom Hooks**: Business logic abstraction and state management

### 2. **Backend Architecture**
- **FastAPI**: Modern Python web framework with automatic API documentation
- **MongoDB**: Document-based database for flexible data modeling
- **WebSocket Integration**: Real-time status updates and notifications
- **Service Layer Pattern**: Business logic separation from API routes

### 3. **Data Flow Patterns**
- **Optimistic Updates**: Frontend updates immediately, syncs with backend
- **Real-time Synchronization**: WebSocket-based status tracking
- **Event-Driven Architecture**: Status changes trigger dependent updates
- **Dependency Management**: Cross-entity status dependencies

### 4. **Security & Authentication**
- **JWT-based Authentication**: Stateless token authentication
- **Role-based Access Control**: Admin, Editor, Signer, Viewer roles
- **Protected Routes**: Middleware-based route protection
- **CORS Configuration**: Secure cross-origin requests

### 5. **Integration Points**
- **DocuSign API**: External signature service integration
- **Blockchain Network**: Smart contract execution (planned)
- **File Storage**: Document upload and management
- **Webhook Support**: External service notifications

This architecture provides a scalable, maintainable, and secure foundation for the Escra smart contract platform, with clear separation of concerns and modern development practices.
