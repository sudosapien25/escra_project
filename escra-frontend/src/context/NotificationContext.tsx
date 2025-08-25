import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Notification, NotificationType } from '../types/notifications';
import { FaCheckCircle, FaExclamationTriangle, FaUserPlus, FaEdit, FaFileSignature, FaCommentDots, FaMoneyCheckAlt, FaTimesCircle, FaClock, FaLock, FaChartLine, FaCheck } from 'react-icons/fa';
import { TbWritingSign, TbCloudUpload, TbFileText, TbFileDescription } from 'react-icons/tb';
import { PiMoneyWavyBold } from 'react-icons/pi';
import { AiOutlineFileDone } from 'react-icons/ai';
import { HiOutlineClipboardCheck } from 'react-icons/hi';
import { LuCalendarPlus } from 'react-icons/lu';

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
      message: `"${contractTitle}" has been created with Contract ID ${contractId}`,
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
      message: `"${documentName}" with Document ID ${documentId} has been created for Contract ID ${contractId} - ${contractTitle}`,
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
      message: `"${contractTitle}" with Contract ID ${contractId} has been voided along with all associated documents`,
      read: false,
      icon: 'contract_voided',
      link: `/contracts`,
      meta: { contractId },
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
      addContractVoidedNotification
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