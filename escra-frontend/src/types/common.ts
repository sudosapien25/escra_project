export interface Party {
  id: string;
  name: string;
  role: string;
  type: 'buyer' | 'seller' | 'agent' | 'other';
  email?: string;
  phone?: string;
  address?: string;
}

export interface DocumentReference {
  id: string;
  type: string;
  status: string;
  url: string;
  name: string;
  created_at: Date;
}

export interface TaskReference {
  id: string;
  title: string;
  status: string;
  assignee?: string;
  due_date?: Date;
}

export interface SignatureReference {
  id: string;
  status: string;
  document_id: string;
} 