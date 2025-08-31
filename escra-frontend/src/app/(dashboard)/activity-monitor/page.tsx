'use client';

import React, { useState, useRef, useEffect } from 'react';
import { NotificationProvider, useNotifications, getNotificationIcon } from '@/context/NotificationContext';
import { FaCheck } from 'react-icons/fa';
import { TbSettingsCog, TbFlag, TbFlagCheck, TbActivityHeartbeat, TbNotification, TbChevronDown, TbReload, TbDotsVertical, TbChevronLeft, TbChevronRight, TbSearch } from 'react-icons/tb';
import clsx from 'clsx';
import { useToast } from '@/components/ui/use-toast';

const notificationTabs = [
  { key: 'all', label: 'All' },
  { key: 'unread', label: 'Unread' },
];

function NotificationPageContent() {
  const { notifications, markAsRead, markAllAsRead, unreadCount, filter, setFilter, addContractCreatedNotification, addDocumentCreatedNotification, addSignatureRequestedNotification, addSignatureRejectedNotification, addTaskCreatedNotification, addContractVoidedNotification, addDocumentDeletedNotification, addPasskeyRemovedNotification, addWalletRemovedNotification, addApiTokenRemovedNotification, addWebhookRemovedNotification } = useNotifications();
  const [markAllReadClicked, setMarkAllReadClicked] = useState(false);
  const [allSelected, setAllSelected] = useState(false);
  const [selectedNotifications, setSelectedNotifications] = useState<Set<string>>(new Set());
  const [showDropdown, setShowDropdown] = useState(false);
  const [showDotsDropdown, setShowDotsDropdown] = useState(false);
  const [selectionFilter, setSelectionFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dotsDropdownRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      
      // Handle chevron dropdown
      if (showDropdown) {
        const isInsideDropdown = dropdownRef.current?.contains(target);
        const isInsideButton = target.closest('[data-chevron-button]');
        
        if (!isInsideDropdown && !isInsideButton) {
          setShowDropdown(false);
        }
      }
      
      // Handle dots dropdown
      if (showDotsDropdown) {
        const isInsideDropdown = dotsDropdownRef.current?.contains(target);
        const isInsideButton = target.closest('[data-dots-button]');
        
        if (!isInsideDropdown && !isInsideButton) {
          setShowDotsDropdown(false);
        }
      }
    };

    if (showDropdown || showDotsDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown, showDotsDropdown]);

  // Filtering logic
  const filtered = notifications.filter((n) => {
    // First apply tab filter
    if (filter === 'all') {
      // For 'all' tab, only apply search filter
    } else if (filter === 'unread') {
      if (n.read) return false; // Must be unread
    }
    
    // Then apply search filter if search term exists
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      return (
        n.title.toLowerCase().includes(search) ||
        n.message.toLowerCase().includes(search) ||
        n.type.toLowerCase().includes(search)
      );
    }
    
    return true;
  });

  // Pagination logic
  const notificationsPerPage = 50;
  const totalPages = Math.ceil(filtered.length / notificationsPerPage);
  const startIndex = (currentPage - 1) * notificationsPerPage;
  const endIndex = startIndex + notificationsPerPage;
  const currentNotifications = filtered.slice(startIndex, endIndex);

  // Reset to first page when filter or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filter, searchTerm]);

  const createExampleNotifications = () => {
    // Regular notifications (created/added) - create first to appear at bottom
    addContractCreatedNotification('CON-2024-001', 'Software Development Agreement');
    
    // Document created notification
    addDocumentCreatedNotification('DOC-2024-001', 'Technical Specifications', 'CON-2024-001', 'Software Development Agreement');
    
    // Signature requested notification
    addSignatureRequestedNotification('SIG-2024-001', 'Software Development Agreement', [{name: 'John Doe', email: 'john.doe@company.com'}]);
    
    // Task created notification
    addTaskCreatedNotification('TASK-2024-001', 'Review Contract Terms', 'CON-2024-001', 'Software Development Agreement');
    
    // Red notifications (rejected/removed/deleted) - create last to appear at top
    addSignatureRejectedNotification('SIG-2024-002', 'Software Development Agreement', [{name: 'Jane Smith', email: 'jane.smith@company.com'}]);
    
    // Contract voided notification
    addContractVoidedNotification('CON-2024-002', 'Previous Agreement');
    
    // Document deleted notification
    addDocumentDeletedNotification('DOC-2024-002', 'Outdated Specifications', 'CON-2024-002', 'Previous Agreement');
    
    // Passkey removed notification
    addPasskeyRemovedNotification('passkey-001');
    
    // Wallet removed notification
    addWalletRemovedNotification('wallet-001');
    
    // API token removed notification
    addApiTokenRemovedNotification('api-token-001');
    
    // Webhook removed notification
    addWebhookRemovedNotification('webhook-001');
    
    toast({
      title: "Example notifications created",
      description: "Added 11 sample notifications to demonstrate the activity monitor",
      duration: 3000,
    });
  };

  return (
    <div className="max-w-6xl mx-auto py-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="pb-1">
          <h1 className="text-[30px] font-bold text-black dark:text-white mb-1">Activity Monitor</h1>
          <p className="text-gray-500 dark:text-gray-400 text-[16px] mt-0">Stay updated on your activities</p>
        </div>
        <div className="flex">
          <button
            className="flex items-center justify-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-semibold"
            onClick={() => {
              markAllAsRead();
              setMarkAllReadClicked(true);
            }}
          >
            {markAllReadClicked ? (
              <TbFlagCheck className="mr-2 text-lg" />
            ) : (
              <TbFlag className="mr-2 text-lg" />
            )}
            Mark All as Read
          </button>
          <button className="flex items-center justify-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-semibold ml-1">
            <TbSettingsCog className="mr-2 text-lg" />
            Notification Settings
          </button>
          <button 
            className="flex items-center justify-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-semibold ml-1"
            onClick={createExampleNotifications}
          >
            Create Examples
          </button>
        </div>
      </div>

      {/* Tabs/Filters and Search Container */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-4 mb-6 mt-6">
        <div className="flex items-center gap-3">
          {/* Tabs/Filters */}
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1 border border-gray-200 dark:border-gray-700 w-fit">
            {notificationTabs.map((tab) => (
              <button
                key={tab.key}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center justify-center ${
                  filter === tab.key
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
                onClick={() => setFilter(tab.key)}
              >
                <span className="flex items-center">
                  {tab.label}
                  {tab.key === 'unread' && unreadCount > 0 && (
                    <span className="ml-1.5 inline-flex items-center text-[9px] font-bold bg-primary text-white px-1.5 pt-1 pb-0.5 rounded border border-primary leading-none align-baseline">
                      {unreadCount}
                    </span>
                  )}
                </span>
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="flex items-center bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 flex-1">
            <TbSearch className="text-gray-400 mr-2" size={18} />
            <input
              type="text"
              placeholder="Search contracts, parties, documents or IDs"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none focus:ring-0 focus:outline-none text-xs text-gray-700 dark:text-white placeholder-gray-400 font-medium min-w-0"
              style={{ fontFamily: 'Avenir, sans-serif' }}
            />
          </div>
        </div>
      </div>

      {/* Notification Icon */}
      <div className="flex items-center mt-4 relative">
        <div 
          className={`w-4 h-4 border border-gray-300 rounded flex items-center justify-center cursor-pointer ml-7 hover:border-gray-400 dark:hover:border-gray-500 transition-colors ${
            allSelected ? 'border-primary' : 'border-gray-300'
          }`}
          onClick={() => {
            const newAllSelected = !allSelected;
            setAllSelected(newAllSelected);
            if (newAllSelected) {
              // Select notifications based on filter
              let notificationsToSelect;
              if (selectionFilter === 'all') {
                notificationsToSelect = filtered;
              } else if (selectionFilter === 'unread') {
                notificationsToSelect = filtered.filter(n => !n.read);
              } else if (selectionFilter === 'read') {
                notificationsToSelect = filtered.filter(n => n.read);
              }
              setSelectedNotifications(new Set(notificationsToSelect.map(n => n.id)));
            } else {
              // Deselect all notifications
              setSelectedNotifications(new Set());
            }
          }}
        >
          {allSelected && (
            <div className="w-3 h-3 rounded-sm flex items-center justify-center bg-primary">
              <FaCheck className="text-white" size={8} />
            </div>
          )}
        </div>
        <TbChevronDown 
          data-chevron-button
          className="ml-2 text-gray-600 dark:text-gray-300 w-4 h-4 cursor-pointer hover:text-gray-900 dark:hover:text-white transition-colors" 
          onClick={() => setShowDropdown(v => !v)}
        />
        <TbReload 
          className="ml-2 text-gray-600 dark:text-gray-300 w-5 h-5 cursor-pointer hover:text-gray-900 dark:hover:text-white transition-colors" 
        />
        <TbDotsVertical 
          data-dots-button
          className="ml-2 text-gray-600 dark:text-gray-300 w-4 h-4 cursor-pointer hover:text-gray-900 dark:hover:text-white transition-colors" 
          onClick={() => setShowDotsDropdown(v => !v)}
        />
        
        {/* Dots Dropdown */}
        {showDotsDropdown && (
          <div ref={dotsDropdownRef} className="absolute top-full mt-2 ml-24 w-32 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
            <button
              className="w-full text-left px-4 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              onClick={() => {
                markAllAsRead();
                setShowDotsDropdown(false);
              }}
            >
              Mark all as Read
            </button>
          </div>
        )}
        
        {/* Pagination Section - Right Side */}
        <div className="ml-auto flex items-center gap-3">
          {/* Count Display */}
          <div className="text-xs text-gray-600 dark:text-gray-300">
            {filtered.length > 0 ? `${startIndex + 1}-${endIndex} of ${filtered.length}` : '0 of 0'}
          </div>
          
          {/* Navigation Chevrons */}
          <div className="flex items-center gap-2">
            <TbChevronLeft 
              className={`w-5 h-5 cursor-pointer transition-colors ${
                currentPage > 1 
                  ? 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white' 
                  : 'text-gray-600 dark:text-gray-300 cursor-not-allowed'
              }`}
              onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
            />
            <TbChevronRight 
              className={`w-5 h-5 cursor-pointer transition-colors ${
                currentPage < totalPages 
                  ? 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white' 
                  : 'text-gray-600 dark:text-gray-300 cursor-not-allowed'
              }`}
              onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
            />
          </div>
        </div>
        
        {/* Dropdown */}
        {showDropdown && (
          <div ref={dropdownRef} className="absolute top-full mt-2 left-7 w-32 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
            <button
              className={`w-full text-left px-4 py-2 text-xs font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                selectionFilter === 'all' ? 'text-primary bg-primary/10' : 'text-gray-700 dark:text-gray-300'
              }`}
              onClick={() => {
                setSelectionFilter('all');
                setShowDropdown(false);
              }}
            >
              All
            </button>
            <button
              className={`w-full text-left px-4 py-2 text-xs font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                selectionFilter === 'unread' ? 'text-primary bg-primary/10' : 'text-gray-700 dark:text-gray-300'
              }`}
              onClick={() => {
                setSelectionFilter('unread');
                setShowDropdown(false);
              }}
            >
              Unread
            </button>
            <button
              className={`w-full text-left px-4 py-2 text-xs font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                selectionFilter === 'read' ? 'text-primary bg-primary/10' : 'text-gray-700 dark:text-gray-300'
              }`}
              onClick={() => {
                setSelectionFilter('read');
                setShowDropdown(false);
              }}
            >
              Read
            </button>
          </div>
        )}
      </div>

      {/* Notification List */}
      <div className="rounded-lg overflow-hidden mt-4">
        <div className="max-h-[calc(100vh-400px)] overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-white [&::-webkit-scrollbar-track]:dark:bg-gray-800 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:dark:bg-gray-600 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-gray-400 [&::-webkit-scrollbar-thumb:hover]:dark:bg-gray-500">
          {currentNotifications.length === 0 && (
            <div className="p-8 text-center text-gray-400 dark:text-gray-500 text-xs">
              <TbActivityHeartbeat className="mx-auto mb-2 w-6 h-6 text-primary" />
              No activity found
            </div>
          )}
          {currentNotifications.map((n, index) => (
          <div
            key={n.id}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              markAsRead(n.id);
            }}
                          className={clsx(
                'flex items-start gap-4 p-6 mx-1 sm:mx-2 my-5 rounded cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600',
                !n.read && (['contract_voided', 'contract_deleted', 'document_deleted', 'task_deleted', 'signature_voided', 'signature_rejected', 'passkey_removed', 'wallet_removed', 'api_token_removed', 'webhook_removed'].includes(n.type) ? 'bg-red-50/50 dark:bg-red-900/10 shadow-[0_0_0_1px_rgba(220,38,38,0.3)] dark:shadow-[0_0_0_1px_rgba(248,113,113,0.3)]' : 'bg-gray-100 dark:bg-gray-700 shadow-[0_0_0_1px_rgba(20,184,166,0.3)] dark:shadow-none'),
                index > 0 && 'border-t border-gray-100 dark:border-gray-700',
                'transition-colors'
              )}
          >
            <div className="flex-shrink-0 mt-1">
              {/* Selection Checkbox */}
              <div 
                className={`w-4 h-4 border border-gray-300 rounded flex items-center justify-center cursor-pointer ${
                  selectedNotifications.has(n.id) ? 'border-primary' : 'border-gray-300'
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const newSelected = new Set(selectedNotifications);
                  if (newSelected.has(n.id)) {
                    newSelected.delete(n.id);
                  } else {
                    newSelected.add(n.id);
                  }
                  setSelectedNotifications(newSelected);
                  setAllSelected(newSelected.size === filtered.length);
                }}
              >
                {selectedNotifications.has(n.id) && (
                  <div className="w-3 h-3 rounded-sm flex items-center justify-center bg-primary">
                    <FaCheck className="text-white" size={8} />
                  </div>
                )}
              </div>
            </div>
            <div className="flex-1">
                            <div className="flex items-center gap-2">
                {getNotificationIcon(n.type)}
                <span className={`font-semibold text-sm ${
                  ['contract_voided', 'contract_deleted', 'document_deleted', 'task_deleted', 'signature_voided', 'signature_rejected', 'passkey_removed', 'wallet_removed', 'api_token_removed', 'webhook_removed'].includes(n.type)
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