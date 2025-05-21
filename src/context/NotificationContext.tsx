import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Notification, NotificationType } from '../types/notifications';
import { FaCheckCircle, FaExclamationTriangle, FaUserPlus, FaEdit, FaFileSignature, FaCommentDots, FaMoneyCheckAlt, FaTimesCircle, FaClock, FaBell, FaLock, FaCalendarAlt } from 'react-icons/fa';

// Map notification type to icon component
const notificationIcons: Record<NotificationType, React.ReactNode> = {
  contract_signed: <FaFileSignature className="text-primary text-xl" />,
  comment_added: <FaCommentDots className="text-primary text-xl" />,
  wire_info_submitted: <FaMoneyCheckAlt className="text-primary text-xl" />,
  contract_modified: <FaEdit className="text-primary text-xl" />,
  invited: <FaUserPlus className="text-primary text-xl" />,
  action_required: <FaExclamationTriangle className="text-yellow-500 text-xl" />,
  contract_rejected: <FaTimesCircle className="text-red-500 text-xl" />,
  role_change: <FaUserPlus className="text-primary text-xl" />,
  all_signatures_complete: <FaCheckCircle className="text-green-500 text-xl" />,
  funds_received: <FaMoneyCheckAlt className="text-primary text-xl" />,
  transaction_complete: <FaCheckCircle className="text-green-500 text-xl" />,
  transaction_cancelled: <FaTimesCircle className="text-red-500 text-xl" />,
  approaching_deadline: <FaClock className="text-yellow-500 text-xl" />,
  overdue_action: <FaExclamationTriangle className="text-red-500 text-xl" />,
  security_alert: <FaLock className="text-red-500 text-xl" />,
};

// Mock notifications
const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'wire_info_submitted',
    title: 'Contract #8423 Wire Transfer Requested',
    message: 'A wire transfer of $45,000 has been requested for Contract #8423.',
    read: false,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    icon: 'wire_info_submitted',
    link: '#',
    meta: { contractId: '8423' },
  },
  {
    id: '2',
    type: 'contract_signed',
    title: 'Sarah Johnson signed Contract #9102',
    message: 'The lease agreement has been signed by the tenant.',
    read: false,
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
    icon: 'contract_signed',
    link: '#',
    meta: { contractId: '9102' },
  },
  {
    id: '3',
    type: 'comment_added',
    title: 'Document Upload: Inspection Report',
    message: 'New document has been uploaded to Contract #7650.',
    read: true,
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    icon: 'comment_added',
    link: '#',
    meta: { contractId: '7650' },
  },
  {
    id: '4',
    type: 'all_signatures_complete',
    title: 'Inspection Completed',
    message: 'Property inspection for Contract #8423 has been completed.',
    read: true,
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    icon: 'all_signatures_complete',
    link: '#',
    meta: { contractId: '8423' },
  },
  {
    id: '5',
    type: 'funds_received',
    title: 'Wire Transfer Complete',
    message: 'A wire transfer of $92,000 for Contract #7124 has been completed.',
    read: true,
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    icon: 'funds_received',
    link: '#',
    meta: { contractId: '7124' },
  },
  {
    id: '6',
    type: 'approaching_deadline',
    title: 'Meeting Scheduled',
    message: 'Virtual closing meeting for Contract #9145 scheduled for May 25th, 10:00 AM.',
    read: true,
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    icon: 'approaching_deadline',
    link: '#',
    meta: { contractId: '9145' },
  },
];

interface NotificationContextType {
  notifications: Notification[];
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  unreadCount: number;
  filter: string;
  setFilter: (filter: string) => void;
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

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider value={{ notifications, markAsRead, markAllAsRead, unreadCount, filter, setFilter }}>
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