import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Notification, NotificationType } from '../types/notifications';
import { FaCheckCircle, FaExclamationTriangle, FaUserPlus, FaEdit, FaFileSignature, FaCommentDots, FaMoneyCheckAlt, FaTimesCircle, FaClock, FaLock, FaChartLine, FaCheck, FaSignature } from 'react-icons/fa';
import { TbWritingSign, TbCloudUpload, TbFileText, TbFileDescription, TbApiApp, TbApiAppOff, TbWebhook, TbWebhookOff } from 'react-icons/tb';
import { PiMoneyWavyBold } from 'react-icons/pi';
import { AiOutlineFileDone } from 'react-icons/ai';
import { HiOutlineClipboardCheck } from 'react-icons/hi';
import { LuCalendarPlus } from 'react-icons/lu';
import { HiOutlineKey } from 'react-icons/hi';

// Map notification type to icon component
const notificationIcons: Record<NotificationType, React.ReactNode> = {
  contract_signed: <TbWritingSign className="text-primary text-2xl" />,
  comment_added: <TbCloudUpload className="text-primary text-2xl" />,
  wire_info_submitted: <PiMoneyWavyBold className="text-primary text-2xl" />,
  contract_modified: <FaEdit className="text-primary text-xl" />,
  invited: <FaUserPlus className="text-primary text-xl" />,
  action_required: <FaExclamationTriangle className="text-yellow-500 text-xl" />,
  contract_rejected: <FaTimesCircle className="text-red-500 text-xl" />,
  role_change: <FaUserPlus className="text-primary text-xl" />,
  all_signatures_complete: <HiOutlineClipboardCheck className="text-primary text-2xl" />,
  funds_received: <PiMoneyWavyBold className="text-primary text-2xl" />,
  transaction_complete: <FaCheckCircle className="text-green-500 text-xl" />,
  transaction_cancelled: <FaTimesCircle className="text-red-500 text-xl" />,
  approaching_deadline: <LuCalendarPlus className="text-primary text-2xl" />,
  overdue_action: <FaExclamationTriangle className="text-red-500 text-xl" />,
  security_alert: <FaLock className="text-red-500 text-xl" />,
  contract_created: <TbFileText className="text-primary text-2xl" />,
  document_created: <TbFileDescription className="text-primary text-2xl" />,
  contract_voided: <FaTimesCircle className="text-red-500 text-xl" />,
  contract_deleted: <FaTimesCircle className="text-red-500 text-xl" />,
  document_deleted: <FaTimesCircle className="text-red-500 text-xl" />,
  task_created: <TbFileDescription className="text-primary text-2xl" />,
  task_deleted: <FaTimesCircle className="text-red-500 text-xl" />,
  signature_requested: <FaSignature className="text-primary text-2xl" />,
  signature_voided: <FaTimesCircle className="text-red-500 text-xl" />,
  document_signed: <FaSignature className="text-primary text-2xl" />,
  passkey_added: <HiOutlineKey className="text-primary text-2xl" />,
  passkey_removed: <FaTimesCircle className="text-red-500 text-xl" />,
  wallet_added: <PiMoneyWavyBold className="text-primary text-2xl" />,
  wallet_removed: <FaTimesCircle className="text-red-500 text-xl" />,
  api_token_added: <TbApiApp className="text-primary text-2xl" />,
  api_token_removed: <TbApiAppOff className="text-red-500 text-2xl" />,
  webhook_added: <TbWebhook className="text-primary text-2xl" />,
  webhook_removed: <TbWebhookOff className="text-red-500 text-2xl" />,
};

// Start with empty notifications array
const mockNotifications: Notification[] = [];

interface NotificationContextType {
  notifications: Notification[];
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  unreadCount: number;
  filter: string;
  setFilter: (filter: string) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  addContractCreatedNotification: (contractId: string, contractTitle: string) => void;
  addDocumentCreatedNotification: (documentId: string, documentName: string, contractId: string, contractTitle: string) => void;
  addContractVoidedNotification: (contractId: string, contractTitle: string) => void;
  addContractDeletedNotification: (contractId: string, contractTitle: string) => void;
  addDocumentDeletedNotification: (documentId: string, documentName: string, contractId: string, contractTitle: string) => void;
  addTaskCreatedNotification: (taskId: string, taskName: string, contractId: string, contractTitle: string) => void;
  addTaskDeletedNotification: (taskId: string, taskName: string, contractId: string, contractTitle: string) => void;
  addSignatureRequestedNotification: (signatureId: string, documentName: string, recipients: Array<{name: string, email: string}>) => void;
  addSignatureVoidedNotification: (signatureId: string, documentName: string, recipients: Array<{name: string, email: string}>) => void;
  addDocumentSignedNotification: (documentId: string, documentName: string, contractId: string, contractName: string, signerName?: string) => void;
  addPasskeyAddedNotification: (passkeyName: string) => void;
  addPasskeyRemovedNotification: (passkeyName: string) => void;
  addWalletAddedNotification: (walletName: string) => void;
  addWalletRemovedNotification: (walletName: string) => void;
  addApiTokenAddedNotification: (tokenName: string) => void;
  addApiTokenRemovedNotification: (tokenName: string) => void;
  addWebhookAddedNotification: (webhookUrl: string) => void;
  addWebhookRemovedNotification: (webhookUrl: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [filter, setFilter] = useState<string>('all');

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    };
    setNotifications((prev) => [newNotification, ...prev]);
  };

  const addContractCreatedNotification = (contractId: string, contractTitle: string) => {
    addNotification({
      type: 'contract_created',
      title: 'Contract Created Successfully',
      message: `"${contractTitle}" has been created with Contract ID #${contractId}`,
      read: false,
      icon: 'contract_created',
      link: `/contracts`,
      meta: { contractId },
    });
  };

  const addDocumentCreatedNotification = (documentId: string, documentName: string, contractId: string, contractTitle: string) => {
    addNotification({
      type: 'document_created',
      title: 'Document Created Successfully',
      message: `"${documentName}" with Document ID #${documentId} has been created for Contract ID #${contractId} - ${contractTitle}`,
      read: false,
      icon: 'document_created',
      link: `/contracts`,
      meta: { contractId, documentId },
    });
  };

  const addContractVoidedNotification = (contractId: string, contractTitle: string) => {
    addNotification({
      type: 'contract_voided',
      title: 'Contract Voided Successfully',
      message: `"${contractTitle}" with Contract ID #${contractId} has been voided along with its associated documents`,
      read: false,
      icon: 'contract_voided',
      link: `/contracts`,
      meta: { contractId },
    });
  };

  const addContractDeletedNotification = (contractId: string, contractTitle: string) => {
    addNotification({
      type: 'contract_deleted',
      title: 'Contract Deleted Successfully',
      message: `"${contractTitle}" with Contract ID #${contractId} has been deleted along with its associated documents`,
      read: false,
      icon: 'contract_deleted',
      link: `/contracts`,
      meta: { contractId },
    });
  };

  const addDocumentDeletedNotification = (documentId: string, documentName: string, contractId: string, contractTitle: string) => {
    addNotification({
      type: 'document_deleted',
      title: 'Document Deleted Successfully',
      message: `"${documentName}" with Document ID #${documentId} associated with Contract ID #${contractId} - ${contractTitle} has been deleted`,
      read: false,
      icon: 'document_deleted',
      link: `/contracts`,
      meta: { contractId, documentId },
    });
  };

  const addTaskCreatedNotification = (taskId: string, taskName: string, contractId: string, contractTitle: string) => {
    addNotification({
      type: 'task_created',
      title: 'Task Created Successfully',
      message: `"${taskName}" with Task ID #${taskId} has been created for Contract ID #${contractId} - ${contractTitle}`,
      read: false,
      icon: 'task_created',
      link: `/workflows`,
      meta: { contractId, taskId },
    });
  };

  const addTaskDeletedNotification = (taskId: string, taskName: string, contractId: string, contractTitle: string) => {
    addNotification({
      type: 'task_deleted',
      title: 'Task Deleted Successfully',
      message: `"${taskName}" with Task ID #${taskId} associated with Contract ID #${contractId} - ${contractTitle} has been deleted`,
      read: false,
      icon: 'task_deleted',
      link: `/workflows`,
      meta: { contractId, taskId },
    });
  };

  const addSignatureRequestedNotification = (signatureId: string, documentName: string, recipients: Array<{name: string, email: string}>) => {
    // Filter out recipients with empty names
    const validRecipients = recipients.filter(recipient => recipient.name && recipient.name.trim() !== '');
    
    // Create bulleted list of recipients
    const recipientsList = validRecipients.map(recipient => 
      `• ${recipient.name} at ${recipient.email}`
    ).join('\n');
    
    const message = validRecipients.length > 0 
      ? `Requests for signature have been sent to:\n${recipientsList}`
      : `"${documentName}" has been sent for signature`;
    
    addNotification({
      type: 'signature_requested',
      title: 'Signatures Requested Successfully',
      message: message,
      read: false,
      icon: 'signature_requested',
      link: `/signatures`,
      meta: { signatureId, documentName, recipientCount: validRecipients.length },
    });
  };

  const addSignatureVoidedNotification = (signatureId: string, documentName: string, recipients: Array<{name: string, email: string}>) => {
    // Filter out recipients with empty names
    const validRecipients = recipients.filter(recipient => recipient.name && recipient.name.trim() !== '');
    
    // Create bulleted list of recipients
    const recipientsList = validRecipients.map(recipient => 
      `• ${recipient.name} at ${recipient.email}`
    ).join('\n');
    
    const message = validRecipients.length > 0 
      ? `Request for signature to the following individuals has been voided and canceled:\n${recipientsList}`
      : `"${documentName}" signature request has been voided and canceled`;
    
    addNotification({
      type: 'signature_voided',
      title: 'Signature Request Voided Successfully',
      message: message,
      read: false,
      icon: 'signature_voided',
      link: `/signatures`,
      meta: { signatureId, documentName, recipientCount: validRecipients.length },
    });
  };

  const addDocumentSignedNotification = (documentId: string, documentName: string, contractId: string, contractName: string, signerName?: string) => {
    const message = signerName 
      ? `${signerName} has successfully signed Document ID #${documentId} - ${documentName} for Contract ID #${contractId} - ${contractName}`
      : `You have successfully signed Document ID #${documentId} - ${documentName} for Contract ID #${contractId} - ${contractName}`;
    
    const title = signerName 
      ? 'Recipient Signed Document Successfully'
      : 'You Signed Document Successfully';
    
    addNotification({
      type: 'document_signed',
      title: title,
      message: message,
      read: false,
      icon: 'document_signed',
      link: `/signatures`,
      meta: { documentId, documentName, contractId, contractName, signerName },
    });
  };

  const addPasskeyAddedNotification = (passkeyName: string) => {
    addNotification({
      type: 'passkey_added',
      title: 'Passkey Added Successfully',
      message: `"${passkeyName}" has been added successfully to your account`,
      read: false,
      icon: 'passkey_added',
      link: `/admin-settings`,
      meta: { passkeyName },
    });
  };

  const addPasskeyRemovedNotification = (passkeyName: string) => {
    addNotification({
      type: 'passkey_removed',
      title: 'Passkey Removed Successfully',
      message: `"${passkeyName}" has been removed successfully from your account`,
      read: false,
      icon: 'passkey_removed',
      link: `/admin-settings`,
      meta: { passkeyName },
    });
  };

  const addWalletAddedNotification = (walletName: string) => {
    addNotification({
      type: 'wallet_added',
      title: 'Wallet Added Successfully',
      message: `"${walletName}" has been added successfully to your account`,
      read: false,
      icon: 'wallet_added',
      link: `/admin-settings`,
      meta: { walletName },
    });
  };

  const addWalletRemovedNotification = (walletName: string) => {
    addNotification({
      type: 'wallet_removed',
      title: 'Wallet Removed Successfully',
      message: `"${walletName}" has been removed successfully from your account`,
      read: false,
      icon: 'wallet_removed',
      link: `/admin-settings`,
      meta: { walletName },
    });
  };

  const addApiTokenAddedNotification = (tokenName: string) => {
    addNotification({
      type: 'api_token_added',
      title: 'API Token Added Successfully',
      message: `"${tokenName}" has been added successfully to your account`,
      read: false,
      icon: 'api_token_added',
      link: `/admin-settings`,
      meta: { tokenName },
    });
  };

  const addApiTokenRemovedNotification = (tokenName: string) => {
    addNotification({
      type: 'api_token_removed',
      title: 'API Token Removed Successfully',
      message: `"${tokenName}" has been removed successfully from your account`,
      read: false,
      icon: 'api_token_removed',
      link: `/admin-settings`,
      meta: { tokenName },
    });
  };

  const addWebhookAddedNotification = (webhookUrl: string) => {
    addNotification({
      type: 'webhook_added',
      title: 'Webhook Added Successfully',
      message: `Webhook for URL "${webhookUrl}" has been added successfully`,
      read: false,
      icon: 'webhook_added',
      link: `/admin-settings`,
      meta: { webhookUrl },
    });
  };

  const addWebhookRemovedNotification = (webhookUrl: string) => {
    addNotification({
      type: 'webhook_removed',
      title: 'Webhook Removed Successfully',
      message: `Webhook for URL "${webhookUrl}" has been removed successfully`,
      read: false,
      icon: 'webhook_removed',
      link: `/admin-settings`,
      meta: { webhookUrl },
    });
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider value={{ 
      notifications, 
      markAsRead, 
      markAllAsRead, 
      deleteNotification,
      unreadCount, 
      filter, 
      setFilter,
      addNotification,
      addContractCreatedNotification,
      addDocumentCreatedNotification,
      addContractVoidedNotification,
      addContractDeletedNotification,
      addDocumentDeletedNotification,
      addTaskCreatedNotification,
      addTaskDeletedNotification,
      addSignatureRequestedNotification,
      addSignatureVoidedNotification,
      addDocumentSignedNotification,
      addPasskeyAddedNotification,
      addPasskeyRemovedNotification,
      addWalletAddedNotification,
      addWalletRemovedNotification,
      addApiTokenAddedNotification,
      addApiTokenRemovedNotification,
      addWebhookAddedNotification,
      addWebhookRemovedNotification
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotifications must be used within a NotificationProvider');
  return context;
};

export const getNotificationIcon = (type: NotificationType) => notificationIcons[type]; 