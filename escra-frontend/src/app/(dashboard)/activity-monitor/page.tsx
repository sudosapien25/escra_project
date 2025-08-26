'use client';

import React from 'react';
import { NotificationProvider, useNotifications, getNotificationIcon } from '@/context/NotificationContext';
import { FaCheck } from 'react-icons/fa';
import { HiOutlineCog } from 'react-icons/hi';
import { MdOutlineCheckBox } from 'react-icons/md';
import clsx from 'clsx';

const notificationTabs = [
  { key: 'all', label: 'All' },
  { key: 'unread', label: 'Unread' },
  { key: 'contracts', label: 'Contracts' },
  { key: 'wire_transfers', label: 'Wire Transfers' },
];

function NotificationPageContent() {
  const { notifications, markAsRead, markAllAsRead, unreadCount, filter, setFilter } = useNotifications();

  // Filtering logic
  const filtered = notifications.filter((n) => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !n.read;
    if (filter === 'contracts') return [
      'contract_signed', 'contract_modified', 'contract_rejected', 'all_signatures_complete', 'transaction_complete', 'transaction_cancelled', 'invited', 'role_change', 'action_required', 'comment_added', 'passkey_added', 'passkey_removed', 'wallet_added', 'wallet_removed'
    ].includes(n.type);
    if (filter === 'wire_transfers') return [
      'wire_info_submitted', 'funds_received', 'approaching_deadline', 'overdue_action'
    ].includes(n.type);
    return true;
  });

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="pb-1">
          <h1 className="text-[30px] font-bold text-black dark:text-white mb-1">Activity Monitor</h1>
          <p className="text-gray-500 dark:text-gray-400 text-[16px] mt-0">Stay updated on your activities</p>
        </div>
        <div className="flex">
          <button
            className="flex items-center justify-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-semibold"
            onClick={markAllAsRead}
          >
            <MdOutlineCheckBox className="mr-2 text-lg" />
            Mark All as Read
          </button>
          <button className="flex items-center justify-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-semibold ml-1">
            <HiOutlineCog className="mr-2 text-lg" />
            Notification Settings
          </button>
        </div>
      </div>

      {/* Tabs/Filters */}
      <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1 border-2 border-gray-200 dark:border-gray-600 w-fit mb-2">
        {notificationTabs.map((tab) => (
          <button
            key={tab.key}
            className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              filter === tab.key
                ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
            }`}
            onClick={() => setFilter(tab.key)}
          >
            {tab.label}
            {tab.key === 'unread' && unreadCount > 0 && (
              <span className="ml-2 inline-block text-[10px] font-bold bg-primary text-white px-2 py-0.5 rounded border border-primary">
                {unreadCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Notification List */}
      <div className="rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
        {filtered.length === 0 && (
          <div className="p-8 text-center text-gray-400 dark:text-gray-500 text-xs">No activity found.</div>
        )}
        {filtered.map((n, index) => (
          <div
            key={n.id}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              markAsRead(n.id);
            }}
                          className={clsx(
                'flex items-start gap-4 p-6 mx-1 my-1 rounded cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600',
                !n.read && (['contract_voided', 'passkey_removed', 'wallet_removed'].includes(n.type) ? 'bg-red-50/50 dark:bg-red-900/10' : 'bg-gray-100 dark:bg-gray-600'),
                index > 0 && 'border-t border-gray-100 dark:border-gray-700',
                'transition-colors'
              )}
          >
            <div className="flex-shrink-0 mt-1">
              {getNotificationIcon(n.type)}
                              <div 
                  className={`w-4 h-4 border border-gray-300 rounded flex items-center justify-center cursor-pointer mt-1 ${
                    ['contract_voided', 'passkey_removed', 'wallet_removed'].includes(n.type) ? 'border-red-500' : 'border-primary'
                  }`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  markAsRead(n.id);
                }}
              >
                {n.read && (
                  <div className={`w-3 h-3 rounded-sm flex items-center justify-center ${
                    ['contract_voided', 'passkey_removed', 'wallet_removed'].includes(n.type) ? 'bg-red-500' : 'bg-primary'
                  }`}>
                    <FaCheck className="text-white" size={8} />
                  </div>
                )}
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className={`font-semibold text-sm ${
                  ['contract_voided', 'passkey_removed', 'wallet_removed'].includes(n.type)
                    ? 'text-red-600 dark:text-red-400' 
                    : 'text-gray-900 dark:text-white'
                }`}>{n.title}</span>
                {!n.read && (
                  <span className="ml-2 px-2 py-0.5 text-xs font-semibold rounded bg-primary text-white border border-primary">Unread</span>
                )}
              </div>
              <div className="text-gray-600 dark:text-gray-400 text-xs mt-1 mb-2">{n.message}</div>
              <a href={n.link || '#'} className="text-primary text-xs font-medium hover:underline">View Details</a>
            </div>
            <div className="flex flex-col items-end gap-2 min-w-[100px]">
              <span className="text-xs text-gray-900 dark:text-white mb-2 whitespace-nowrap">{formatTimeAgo(n.timestamp)}</span>
              {!n.read && (
                <button
                  className="flex items-center gap-1 text-primary text-xs font-semibold hover:underline"
                  onClick={() => markAsRead(n.id)}
                >
                  <FaCheck className="text-primary" />
                  Mark as read
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function formatTimeAgo(iso: string) {
  const now = new Date();
  const date = new Date(iso);
  const diff = (now.getTime() - date.getTime()) / 1000;
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  if (diff < 172800) return 'Yesterday';
  return `${Math.floor(diff / 86400)} days ago`;
}

export default function NotificationsPage() {
  return (
    <NotificationProvider>
      <NotificationPageContent />
    </NotificationProvider>
  );
} 