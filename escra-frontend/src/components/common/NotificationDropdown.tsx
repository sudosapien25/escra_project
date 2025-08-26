'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useNotifications, getNotificationIcon } from '@/context/NotificationContext';
import { Notification } from '@/types/notifications';
import { formatDistanceToNow } from 'date-fns';
import { HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi';
import { BiDotsHorizontal } from 'react-icons/bi';
import { FaCheck } from 'react-icons/fa';

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  unreadCount: number;
}

const NOTIFICATIONS_PER_PAGE = 15;

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  isOpen,
  onClose,
  unreadCount,
}) => {
  const { notifications, markAsRead, markAllAsRead, deleteNotification } = useNotifications();
  const [currentPage, setCurrentPage] = useState(0);
  const [openMenuNotification, setOpenMenuNotification] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Cap the dropdown to show only the 50 most recent notifications
  const maxDropdownNotifications = 50;
  const dropdownNotifications = notifications.slice(0, maxDropdownNotifications);
  
  // Debug: Verify we're keeping the newest and dropping the oldest
  if (notifications.length > maxDropdownNotifications) {
    console.log('Oldest notification that fell off:', notifications[notifications.length - 1]?.title);
    console.log('Newest notification in dropdown:', dropdownNotifications[0]?.title);
  }
  
  const totalPages = Math.ceil(dropdownNotifications.length / NOTIFICATIONS_PER_PAGE);
  const startIndex = currentPage * NOTIFICATIONS_PER_PAGE;
  const endIndex = startIndex + NOTIFICATIONS_PER_PAGE;
  const currentNotifications = dropdownNotifications.slice(startIndex, endIndex);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    // TODO: Navigate to the notification link if needed
    // Temporarily disabled navigation to prevent page reload
    // if (notification.link) {
    //   window.location.href = notification.link;
    // }
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead();
  };

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(0, prev - 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50" onClick={onClose}>
      <div className="absolute inset-0 bg-black bg-opacity-25" />
      <div
        ref={dropdownRef}
        className="absolute right-14 top-[52px] w-[520px] max-h-[600px] bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Notifications
            </h3>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              ({unreadCount})
            </span>
          </div>
          <div className="flex items-center space-x-2">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-[13px] text-primary hover:text-primary/80 transition-colors"
              >
                Mark all as read
              </button>
            )}
            <button
              onClick={() => {
                onClose();
                window.location.href = '/activity-monitor';
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-[13px] hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
            >
              View all
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="max-h-[500px] overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-50 [&::-webkit-scrollbar-track]:dark:bg-gray-700 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:dark:bg-gray-600 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-gray-400 [&::-webkit-scrollbar-thumb:hover]:dark:bg-gray-500 [&::-webkit-scrollbar-corner]:bg-gray-50 [&::-webkit-scrollbar-corner]:dark:bg-gray-700">
          {currentNotifications.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              <div className="text-sm">No notifications</div>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {currentNotifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleNotificationClick(notification);
                  }}
                  className={`p-4 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer transition-colors group ${
                    !notification.read && (['contract_voided', 'contract_deleted', 'document_deleted', 'task_deleted', 'signature_voided', 'passkey_removed', 'wallet_removed'].includes(notification.type)
                      ? 'bg-red-50/70 dark:bg-red-900/25' 
                      : 'bg-gray-100 dark:bg-gray-700')
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 mt-1">
                      {!notification.read && (
                        <div 
                          className={`w-2 h-2 rounded-full flex-shrink-0 ${
                            ['contract_voided', 'contract_deleted', 'document_deleted', 'task_deleted', 'signature_voided', 'passkey_removed', 'wallet_removed'].includes(notification.type) ? 'bg-red-500' : 'bg-primary'
                          }`}
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className={`text-sm font-medium ${
                          ['contract_voided', 'contract_deleted', 'document_deleted', 'task_deleted', 'signature_voided', 'passkey_removed', 'wallet_removed'].includes(notification.type)
                            ? 'text-red-600 dark:text-red-400'
                            : !notification.read && (notification.type === 'signature_requested' || notification.type === 'task_created' || notification.type === 'document_created' || notification.type === 'contract_created' || notification.type === 'document_signed' || notification.type === 'passkey_added' || notification.type === 'wallet_added')
                              ? 'text-primary'
                              : !notification.read 
                                ? 'text-gray-900 dark:text-white' 
                                : 'text-gray-700 dark:text-gray-300'
                        }`}>
                          {notification.title}
                        </p>
                        <div className="relative">
                          <button 
                            className={`rounded-md px-1 py-0.5 transition-colors ${
                              ['contract_voided', 'contract_deleted', 'document_deleted', 'signature_voided', 'task_deleted', 'passkey_removed', 'wallet_removed'].includes(notification.type)
                                ? !notification.read
                                  ? 'border border-transparent text-gray-700 dark:text-gray-300 group-hover:border-gray-300 dark:group-hover:border-gray-700'
                                  : 'border border-transparent text-gray-400 dark:text-gray-400 group-hover:border-gray-400 dark:group-hover:border-gray-400'
                                : !notification.read 
                                  ? 'border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-primary hover:text-primary' 
                                  : 'border border-transparent text-gray-400 dark:text-gray-400 group-hover:border-gray-400 dark:group-hover:border-gray-400'
                            }`}
                            onClick={e => {
                              e.stopPropagation();
                              setOpenMenuNotification(openMenuNotification === notification.id ? null : notification.id);
                            }}
                          >
                            <BiDotsHorizontal size={16} />
                          </button>
                          {openMenuNotification === notification.id && (
                            <div
                              ref={menuRef}
                              className="absolute right-0 mt-[1px] w-32 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 py-2 z-50"
                              style={{ fontFamily: 'Avenir, sans-serif' }}
                            >
                              <button 
                                className="w-full text-left px-4 py-2 text-xs font-medium text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  markAsRead(notification.id);
                                  setOpenMenuNotification(null);
                                }}
                              >
                                Mark as read
                              </button>
                              <button 
                                className="w-full text-left px-4 py-2 text-xs font-medium text-gray-900 dark:text-white hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteNotification(notification.id);
                                  setOpenMenuNotification(null);
                                }}
                              >
                                Clear
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {notification.type === 'signature_requested' || notification.type === 'signature_voided' ? (
                          <div className="whitespace-pre-line">
                            {notification.message}
                          </div>
                        ) : (
                          <p className="line-clamp-2">
                            {notification.message}
                          </p>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                        {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination - Only show if more than 15 notifications */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 pt-2 pb-3 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={goToPreviousPage}
              disabled={currentPage === 0}
              className="flex items-center text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <HiOutlineChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </button>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {currentPage + 1} of {totalPages} ({dropdownNotifications.length} total)
            </span>
            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages - 1}
              className="flex items-center text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
              <HiOutlineChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        )}
        
        {/* Footer - Always visible */}
        <div className="px-4 pt-2 pb-3 border-t border-gray-200 dark:border-gray-700">
          <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
            {dropdownNotifications.length === 0 ? (
              <span>No notifications to display</span>
            ) : dropdownNotifications.length <= 15 ? (
              <span>Showing all {dropdownNotifications.length} notifications</span>
            ) : (
              <span>Showing {currentNotifications.length} of {dropdownNotifications.length} notifications</span>
            )}
          </div>
        </div>


      </div>
    </div>
  );
};
