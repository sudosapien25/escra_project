export interface SignatureDocument {
  id: string;
  document: string;
  parties: string[];
  status: SignatureStatus;
  signatures: string;
  contractId: string;
  contract: string;
  assignee: string;
  dateSent: string;
  dueDate: string;
  message?: string;
  subject?: string;
  documentId?: string;
  recipients?: SignatureRecipient[];
}

export interface SignatureRecipient {
  id: string;
  name: string;
  email: string;
  status: SignatureStatus;
  signed_at?: string;
}

export type SignatureStatus =
  | 'Pending'
  | 'Completed'
  | 'Rejected'
  | 'Expired'
  | 'Voided';

export interface SignatureRequest {
  documentId: string;
  contractId: string;
  recipients: {
    name: string;
    email: string;
  }[];
  subject?: string;
  message?: string;
  dueDate?: string;
}