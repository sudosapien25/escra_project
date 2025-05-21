'use client';

import React from 'react';
import { NotificationProvider, useNotifications, getNotificationIcon } from '@/context/NotificationContext';
import { FaCheck, FaCog } from 'react-icons/fa';
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
      'contract_signed', 'contract_modified', 'contract_rejected', 'all_signatures_complete', 'transaction_complete', 'transaction_cancelled', 'invited', 'role_change', 'action_required', 'comment_added'
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
          <h1 className="text-[30px] font-bold text-black mb-1">Notifications</h1>
          <p className="text-gray-500 text-[16px] mt-0">Stay updated on your escrow activities</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            className="flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-2 bg-white text-gray-900 font-medium text-sm hover:bg-gray-50 transition-colors"
            onClick={markAllAsRead}
          >
            <FaCheck className="text-primary" />
            Mark All as Read
          </button>
          <button className="flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-2 bg-white text-gray-900 font-medium text-sm hover:bg-gray-50 transition-colors">
            <FaCog className="text-gray-500" />
            Notification Settings
          </button>
        </div>
      </div>

      {/* Tabs/Filters */}
      <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-1 w-fit mb-2">
        {notificationTabs.map((tab) => (
          <button
            key={tab.key}
            className={clsx(
              'relative px-4 py-2 rounded-lg font-semibold text-sm transition-colors',
              filter === tab.key
                ? 'bg-white text-primary shadow-sm'
                : 'text-gray-500 hover:text-primary',
              'focus:outline-none focus:ring-2 focus:ring-primary'
            )}
            onClick={() => setFilter(tab.key)}
          >
            {tab.label}
            {tab.key === 'unread' && unreadCount > 0 && (
              <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold rounded-full bg-primary text-white">
                {unreadCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Notification List */}
      <div className="rounded-2xl border border-gray-200 bg-white divide-y divide-gray-100">
        {filtered.length === 0 && (
          <div className="p-8 text-center text-gray-400 text-sm">No notifications found.</div>
        )}
        {filtered.map((n) => (
          <div
            key={n.id}
            className={clsx(
              'flex items-start gap-4 p-6',
              !n.read && 'bg-gray-50',
              'transition-colors'
            )}
          >
            <div className="flex-shrink-0 mt-1">{getNotificationIcon(n.type)}</div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-900 text-base">{n.title}</span>
                {!n.read && (
                  <span className="ml-2 px-2 py-0.5 text-xs font-semibold rounded-full bg-primary text-white">Unread</span>
                )}
              </div>
              <div className="text-gray-600 text-sm mt-1 mb-2">{n.message}</div>
              <a href={n.link || '#'} className="text-primary text-sm font-medium hover:underline">View Details</a>
            </div>
            <div className="flex flex-col items-end gap-2 min-w-[100px]">
              <span className="text-xs text-gray-400 mb-2 whitespace-nowrap">{formatTimeAgo(n.timestamp)}</span>
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