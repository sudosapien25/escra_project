# ESCRA Frontend - Mock Data Removal Plan

## Executive Summary

This document outlines a comprehensive plan to remove all mock data references from the ESCRA frontend codebase and replace them with real API integrations. The frontend currently uses mock data in 21 files across various components, services, and API routes.

## Current State Analysis

### Mock Data Files Identified

1. **Data Files:**
   - `/src/data/mockContracts.ts` - Contains 15 hardcoded contract objects
   - `/src/data/mockSignatures.ts` - Contains 10 hardcoded signature objects
   - `/src/data/taskStore.ts` - Contains mock tasks data
   - `/src/data/documentNameStore.ts` - References mock document patterns

2. **API Routes Using Mock Data:**
   - `/src/app/api/contracts/route.ts` - Uses mockContracts as base data
   - `/src/app/api/signatures/route.ts` - Uses mockSignatures as base data

3. **Services:**
   - `/src/services/contractService.ts` - Directly imports and uses mockContracts

4. **Components/Pages:**
   - `/src/app/(dashboard)/contracts/page.tsx`
   - `/src/app/(dashboard)/signatures/page.tsx`
   - `/src/app/(dashboard)/dashboard/page.tsx`
   - `/src/app/(dashboard)/blockchain/page.tsx`
   - `/src/app/(dashboard)/admin-settings/page.tsx`
   - `/src/app/(dashboard)/activity-monitor/page.tsx`
   - `/src/app/(dashboard)/workflows/page.tsx`
   - `/src/components/DocumentPreparationModal.tsx`
   - `/src/components/common/NewContractModal.tsx`
   - `/src/components/common/SignatureConfirmationModal.tsx`

5. **Context:**
   - `/src/context/NotificationContext.tsx` - Uses mockNotifications

6. **Test Page:**
   - `/src/app/test-table/page.tsx` - Contains mockUsers test data

## Backend API Availability

The backend API (`api-backend`) is available with the following endpoints:

- **Base URL:** `http://localhost:8000` (configured in `.env.local`)
- **Authentication:** JWT-based with access/refresh tokens
- **Key Endpoints:**
  - `/api/contracts` - Full CRUD operations for contracts
  - `/api/auth/*` - Authentication endpoints
  - Signature operations are embedded within contracts

## Implementation Plan

### Phase 1: Infrastructure Setup (Priority: HIGH)

#### 1.1 Create API Service Layer
- [ ] Create `/src/services/api/contractApi.ts`
  - Implement all contract CRUD operations using apiClient
  - Handle pagination, filtering, sorting
  - Error handling and retry logic

- [ ] Create `/src/services/api/signatureApi.ts`
  - Implement signature operations
  - Integrate with contract endpoints

- [ ] Create `/src/services/api/notificationApi.ts`
  - Replace mock notifications with real API calls

#### 1.2 Create Data Types
- [ ] Create `/src/types/contract.ts`
  - Define TypeScript interfaces matching backend models
  - Include all contract fields and relationships

- [ ] Create `/src/types/signature.ts`
  - Define signature interfaces
  - Match backend signature model structure

- [ ] Create `/src/types/notification.ts`
  - Define notification interfaces

### Phase 2: Replace Service Layer (Priority: HIGH)

#### 2.1 Update ContractService
- [ ] Refactor `/src/services/contractService.ts`
  - Remove mockContracts import
  - Replace all methods with API calls
  - Implement proper error handling
  - Add loading states

#### 2.2 Remove Internal API Routes
- [ ] Delete `/src/app/api/contracts/route.ts`
- [ ] Delete `/src/app/api/signatures/route.ts`
- [ ] Update all references to use service layer instead

### Phase 3: Update Data Stores (Priority: HIGH)

#### 3.1 Task Store
- [ ] Update `/src/data/taskStore.ts`
  - Remove mockTasks constant
  - Implement API data fetching in initializeTasks
  - Add real-time sync capabilities

#### 3.2 Document Store
- [ ] Update `/src/data/documentNameStore.ts`
  - Remove mock ID generation patterns
  - Use backend-generated IDs

### Phase 4: Update Components (Priority: MEDIUM)

#### 4.1 Dashboard Pages
- [ ] Update contracts page (`/src/app/(dashboard)/contracts/page.tsx`)
  - Replace mockContracts import with API service
  - Implement loading states
  - Add error boundaries

- [ ] Update signatures page (`/src/app/(dashboard)/signatures/page.tsx`)
  - Replace mock data with API calls
  - Implement real-time updates

- [ ] Update dashboard page (`/src/app/(dashboard)/dashboard/page.tsx`)
  - Replace all mock data references
  - Implement real data aggregation

- [ ] Update blockchain page (`/src/app/(dashboard)/blockchain/page.tsx`)
  - Remove mockContracts import
  - Fetch real contract data

- [ ] Update admin-settings page (`/src/app/(dashboard)/admin-settings/page.tsx`)
  - Replace mock data usage

- [ ] Update activity-monitor page (`/src/app/(dashboard)/activity-monitor/page.tsx`)
  - Remove mockContracts import
  - Implement real activity tracking

#### 4.2 Modal Components
- [ ] Update DocumentPreparationModal
  - Remove mock document references
  - Integrate with real document API

- [ ] Update NewContractModal
  - Ensure it uses API service for creation

- [ ] Update SignatureConfirmationModal
  - Remove mockSignatures type import
  - Use real signature types

### Phase 5: Update Context Providers (Priority: MEDIUM)

- [ ] Update NotificationContext
  - Remove mockNotifications
  - Implement real-time notification fetching
  - Add WebSocket support for live updates

### Phase 6: Cleanup (Priority: LOW)

#### 6.1 Remove Mock Files
- [ ] Delete `/src/data/mockContracts.ts`
- [ ] Delete `/src/data/mockSignatures.ts`
- [ ] Remove all mock-related comments

#### 6.2 Test Page
- [ ] Update or remove `/src/app/test-table/page.tsx`
- [ ] Replace mockUsers with test API endpoint if needed

### Phase 7: Testing & Validation (Priority: HIGH)

- [ ] Create unit tests for new API services
- [ ] Test all CRUD operations
- [ ] Verify data integrity
- [ ] Test error scenarios
- [ ] Validate authentication flow
- [ ] Performance testing with real data

## Implementation Strategy

### Recommended Approach

1. **Parallel Development:**
   - Start with Phase 1 (Infrastructure) immediately
   - Phase 2 and 3 can begin once API services are ready
   - Phase 4 components can be updated incrementally

2. **Feature Flags:**
   - Consider using feature flags to toggle between mock and real data
   - Allows gradual rollout and easy rollback

3. **Backward Compatibility:**
   - Keep mock data files temporarily during transition
   - Remove only after all components are updated and tested

### Risk Mitigation

1. **Data Migration:**
   - Ensure any locally stored mock data is preserved
   - Provide migration scripts if needed

2. **API Availability:**
   - Implement fallback mechanisms
   - Cache responses for offline functionality

3. **Performance:**
   - Implement pagination from the start
   - Use React Query or SWR for caching
   - Add loading skeletons

## Dependencies

- Backend API must be running and accessible
- Authentication system must be fully functional
- Environment variables properly configured
- API documentation available for reference

## Success Criteria

- [ ] All mock data imports removed
- [ ] All components fetch real data from API
- [ ] No hardcoded test data in production code
- [ ] All CRUD operations functional
- [ ] Proper error handling in place
- [ ] Loading states implemented
- [ ] Authentication integrated
- [ ] Performance acceptable with real data volumes

## Timeline Estimate

- **Phase 1-3:** 3-4 days (Infrastructure and Services)
- **Phase 4-5:** 4-5 days (Component Updates)
- **Phase 6-7:** 2-3 days (Cleanup and Testing)

**Total Estimated Time:** 9-12 days

## Notes

- The backend API at `api-backend` already has comprehensive contract and signature models
- Authentication is JWT-based with refresh token support
- Consider implementing real-time updates using WebSockets for better UX
- Ensure all API calls use the configured `apiClient` for consistent authentication handling

## Next Steps

1. Review and approve this plan
2. Set up development environment with backend API
3. Begin with Phase 1 - Infrastructure Setup
4. Create detailed tickets for each task
5. Establish testing protocols