export type NotificationType =
  | 'contract_signed'
  | 'comment_added'
  | 'wire_info_submitted'
  | 'contract_modified'
  | 'invited'
  | 'action_required'
  | 'contract_rejected'
  | 'role_change'
  | 'all_signatures_complete'
  | 'funds_received'
  | 'transaction_complete'
  | 'transaction_cancelled'
  | 'approaching_deadline'
  | 'overdue_action'
  | 'security_alert'
  | 'contract_created'
  | 'document_created'
  | 'contract_voided'
  | 'contract_deleted'
  | 'document_deleted'
  | 'document_added'
  | 'task_created'
  | 'task_deleted'
  | 'signature_requested'
  | 'signature_rejected'
  | 'signature_voided'
  | 'signature_completed'
  | 'document_signed'
  | 'passkey_added'
  | 'passkey_removed'
  | 'wallet_added'
  | 'wallet_removed'
  | 'api_token_added'
  | 'api_token_removed'
  | 'webhook_added'
  | 'webhook_removed';

export interface NotificationMeta {
  contractId?: string;
  userId?: string;
  role?: string;
  deadline?: string;
  amount?: number;
  [key: string]: string | number | undefined;
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  timestamp: string; // ISO string
  icon?: string; // icon name or type, to be mapped in UI
  link?: string; // optional link for 'View Details'
  meta?: NotificationMeta; // for extensibility (contractId, etc.)
} 