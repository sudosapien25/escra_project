# Escra Frontend Development Prompt for Cursor

## Project Overview

Build an enterprise-grade React frontend for Escra - a smart contract-powered SaaS platform that automates contract execution and transaction management. The initial MVP focuses on real estate transactions, with future expansion to other industries planned.

## Technology Stack Requirements

- React with TypeScript
- Next.js for framework
- TailwindCSS for styling
- Authentication: JWT-based with Auth0 integration
- State Management: React Query for server state, Context API/Redux Toolkit for global state
- Form handling: React Hook Form with Zod validation

## Design Guidelines

- Primary Color: Teal (#23B5B5)
- Secondary Color: White (#FFFFFF)
- Tertiary Color: Black (#000000)
- Primary interface background: White
- Modern SaaS UI inspired by Qualia Connect/Core, Ironclad, Apollo, and Clay
- Mobile responsive design with PWA capabilities

## Project Structure

Create a Next.js application with the following file and folder structure:

```
escra-frontend/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── common/      # Base components (Button, Input, etc.)
│   │   ├── layout/      # Layout components (Header, Sidebar, etc.)
│   │   ├── dashboard/   # Dashboard-specific components
│   │   ├── contracts/   # Contract-related components
│   │   ├── documents/   # Document-related components
│   │   ├── users/       # User-related components
│   │   └── notifications/ # Notification-related components
│   ├── hooks/           # Custom React hooks
│   ├── services/        # API services
│   │   ├── api.ts       # Base API configuration
│   │   ├── auth.ts      # Authentication service
│   │   ├── contracts.ts # Contract management service
│   │   ├── documents.ts # Document management service
│   │   ├── users.ts     # User management service
│   │   └── notifications.ts # Notification service
│   ├── utils/           # Utility functions
│   ├── types/           # TypeScript definitions
│   ├── context/         # React context providers
│   │   ├── AuthContext.tsx    # Authentication context
│   │   ├── UserContext.tsx    # User context
│   │   └── NotificationContext.tsx # Notification context
│   ├── styles/          # Global styles
│   └── pages/           # Next.js page components
│       ├── _app.tsx
│       ├── _document.tsx
│       ├── index.tsx    # Landing/login page
│       ├── dashboard/   # Dashboard pages
│       ├── contracts/   # Contract management pages
│       ├── documents/   # Document management pages
│       ├── users/       # User management pages
│       └── settings/    # User/org settings pages
├── tailwind.config.js   # TailwindCSS configuration
├── tsconfig.json        # TypeScript configuration
├── next.config.js       # Next.js configuration
└── package.json         # Dependencies
```

## Key Components and Features to Implement

### 1. Authentication & User Management

- JWT-based authentication with Auth0
- Role-based access control (Admin, Creator, Editor, Signer, Viewer)
- User profile management
- Role assignment interface
- Multi-factor authentication (2FA)

### 2. Dashboard Interface

- Contract status overview with filterable/sortable table
- Dynamic milestone visualization (timeline/progress tracker)
- Action item management with priority indicators
- Quick access to recent documents
- Summary statistics (active contracts, pending approvals, etc.)

### 3. Contract Management Interface

- Step-by-step contract creation wizard
- Template selection and parameterization
- Participant invitation interface
- Milestone definition and tracking
- Document upload and association
- Smart contract status visualization
- Wire instruction input and verification

### 4. Document Management

- Drag-and-drop document upload
- Document preview functionality
- Version control/history
- Integration with DocuSign for e-signatures
- Document metadata management

### 5. Notification Center

- Real-time notifications via WebSockets
- Email/SMS notification preferences
- Notification history and management
- Action items from notification entries

### 6. Mobile Responsiveness

- Progressive Web App (PWA) capabilities
- Responsive design for all device sizes
- Touch-friendly interface elements

## State Management Approach

- **Authentication State**: Managed via AuthContext, stored in localStorage/cookies with JWTs
- **User Profile**: Stored in UserContext, fetched on login
- **Contracts Data**: Fetched via React Query, with caching and invalidation strategies
- **Form State**: Managed locally with React Hook Form
- **Document State**: Managed via React Query with upload progress tracking
- **Notifications**: Real-time updates via WebSocket, stored in NotificationContext

## API Integration

Implement services to interact with the following backend endpoints:

- Authentication Service (Auth0 integration)
- Contract Management Service
- Document Management Service
- Blockchain Interaction Service (for contract status)
- User Management Service
- Notification Service

## Component Details

### Common Components

- `Button`: Primary, secondary, and tertiary variants
- `Input`: Text, number, date, file inputs with validation
- `Select`: Dropdown selection with search
- `Modal`: Reusable modal dialog
- `Card`: Information card with various layouts
- `Table`: Sortable, filterable table
- `Tabs`: Tab navigation component
- `Alert`: Success, error, warning, info alerts
- `Badge`: Status indicators
- `Avatar`: User avatar with fallback
- `Tooltip`: Information tooltips
- `ProgressBar`: Progress visualization
- `Timeline`: Milestone visualization

### Page-Specific Components

- `Dashboard/ContractsList`: Overview of all contracts
- `Dashboard/MilestoneTracker`: Visual milestone progress
- `Dashboard/ActionItems`: Prioritized action items
- `Contracts/ContractWizard`: Step-by-step contract creation
- `Contracts/ContractDetails`: Contract information and status
- `Documents/DocumentUploader`: File upload interface
- `Documents/DocumentViewer`: Document preview
- `Users/UserManagement`: User list and role management
- `Settings/ProfileSettings`: User profile settings
- `Settings/NotificationPreferences`: Notification settings

## Interactions and Workflows

1. **Contract Creation Flow**:
   - Select contract type template
   - Input transaction details
   - Add participants and assign roles
   - Define milestones and conditions
   - Upload initial documents
   - Review and initiate contract on blockchain

2. **Document Signature Flow**:
   - Upload document requiring signatures
   - Select signatories from participants
   - Initiate DocuSign process
   - Track signature status
   - Update contract state upon completion

3. **Milestone Completion Flow**:
   - View pending milestones
   - Upload required documentation
   - Submit for approval
   - Multi-party verification when required
   - Automated and manual state transitions

4. **User Invitation Flow**:
   - Add user email and assign role
   - Send invitation email with temporary access
   - Track invitation status
   - Manage permissions post-acceptance

## Accessibility Requirements

- Implement WCAG 2.1 AA compliance
- Ensure keyboard navigation
- Screen reader compatibility
- Sufficient color contrast
- Proper focus management

## Performance Considerations

- Code splitting for page components
- Image optimization
- Lazy loading of heavy components
- Memoization of expensive calculations
- Efficient rendering with virtualized lists for large datasets
- API request batching and caching

## Testing Approach

- Unit tests for individual components
- Integration tests for workflows
- E2E tests for critical paths
- Accessibility testing
- Cross-browser compatibility testing
- Responsive design testing

## Deliverables

1. Complete Next.js React application with the structure and features specified
2. Clean, well-documented TypeScript code
3. Responsive design implementation
4. Integration with all specified backend services
5. Comprehensive test coverage
6. Deployment-ready configuration

## Phase 1 Implementation Priorities

Focus on implementing these core features first:

1. Authentication and basic user management
2. Dashboard with contract status overview
3. Simple contract creation flow
4. Document upload/management
5. Basic notification system

Additional features can be implemented in subsequent phases according to the project timeline.
