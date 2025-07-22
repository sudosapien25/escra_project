export interface SignatureDocument {
  id: string;
  document: string;
  parties: string[];
  status: string;
  signatures: string;
  contractId: string;
  contract: string;
  assignee: string;
  dateSent: string;
  dueDate: string;
  message?: string;
  subject?: string;
  documentId?: string;
  recipients?: any[];
}

export const mockSignatures: SignatureDocument[] = [
  {
    id: '1234',
    document: 'Purchase Agreement',
    parties: ['Robert Chen', 'Eastside Properties'],
    status: 'Pending',
    signatures: '1 of 2',
    contractId: '9548',
    contract: 'New Property Acquisition',
    assignee: 'John Smith',
    dateSent: '2024-03-15',
    dueDate: '2024-03-30'
  },
  {
    id: '2345',
    document: 'Closing Disclosure',
    parties: ['Sarah Johnson', 'Westside Holdings'],
    status: 'Pending',
    signatures: '0 of 2',
    contractId: '9550',
    contract: 'Land Development Contract',
    assignee: 'Sarah Johnson',
    dateSent: '2024-03-14',
    dueDate: '2024-03-29'
  },
  {
    id: '3456',
    document: 'Inspection Report',
    parties: ['BuildRight', 'Horizon Developers'],
    status: 'Rejected',
    signatures: '0 of 2',
    contractId: '9145',
    contract: 'Construction Escrow',
    assignee: 'Michael Brown',
    dateSent: '2024-03-13',
    dueDate: '2024-03-28'
  },
  {
    id: '4567',
    document: 'Lease Agreement',
    parties: ['Pacific Properties'],
    status: 'Expired',
    signatures: '0 of 1',
    contractId: '8784',
    contract: 'Commercial Lease Amendment',
    assignee: 'Emma Johnson',
    dateSent: '2024-03-12',
    dueDate: '2024-03-27'
  },
  {
    id: '5678',
    document: 'Title Insurance',
    parties: ['John Smith', 'Emma Johnson'],
    status: 'Voided',
    signatures: '0 of 2',
    contractId: '8423',
    contract: 'Property Sale Contract',
    assignee: 'Robert Chen',
    dateSent: '2024-03-11',
    dueDate: '2024-03-26'
  },
  {
    id: '6789',
    document: 'Appraisal',
    parties: ['Robert Wilson', 'Investment Group'],
    status: 'Pending',
    signatures: '0 of 2',
    contractId: '7804',
    contract: 'Investment Property Escrow',
    assignee: 'Sarah Miller',
    dateSent: '2024-03-10',
    dueDate: '2024-03-25'
  },
  {
    id: '7890',
    document: 'Appraisal Report',
    parties: ['David Miller', 'Sarah Thompson'],
    status: 'Pending',
    signatures: '1 of 2',
    contractId: '7234',
    contract: 'Residential Sale Agreement',
    assignee: 'David Miller',
    dateSent: '2024-03-09',
    dueDate: '2024-03-24'
  },
  {
    id: '8901',
    document: 'Closing Disclosure',
    parties: ['David Taylor'],
    status: 'Completed',
    signatures: '1 of 1',
    contractId: '6891',
    contract: 'Office Building Purchase',
    assignee: 'Emily Davis',
    dateSent: '2024-03-09',
    dueDate: '2024-03-24'
  },
  {
    id: '9012',
    document: 'Title Report',
    parties: ['Lisa Anderson', 'Metro Developers'],
    status: 'Pending',
    signatures: '0 of 2',
    contractId: '6456',
    contract: 'Commercial Development',
    assignee: 'Lisa Anderson',
    dateSent: '2024-03-08',
    dueDate: '2024-03-23'
  },
  {
    id: '0123',
    document: 'Inspection Report',
    parties: ['Quality Inspections', 'Sunset Properties'],
    status: 'Completed',
    signatures: '2 of 2',
    contractId: '6123',
    contract: 'Residential Inspection',
    assignee: 'Quality Inspections',
    dateSent: '2024-03-07',
    dueDate: '2024-03-22'
  }
]; 