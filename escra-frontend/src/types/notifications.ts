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
  | 'security_alert';

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