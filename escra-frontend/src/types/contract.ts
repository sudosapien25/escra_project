import { Party, DocumentReference, TaskReference, SignatureReference } from './common';

export interface Contract {
  id: string;
  code: string;
  title: string;
  type: string;
  status: string;
  parties: Party[];
  value?: number;
  dates: {
    created: Date;
    updated: Date;
    effective: Date;
  };
  documents: DocumentReference[];
  tasks: TaskReference[];
  signatures: SignatureReference[];
  metadata: Record<string, any>;
}

export type ContractStatus = 
  | 'Initiation'
  | 'Preparation'
  | 'Wire Details'
  | 'In Review'
  | 'Signatures'
  | 'Funds Disbursed'
  | 'Complete';

export type ContractType = 
  | 'Property Sale'
  | 'Commercial Lease'
  | 'Construction Escrow'
  | 'Investment Property'; 