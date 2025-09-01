'use client';

import React, { useState, useRef, useEffect } from 'react';
import { NotificationProvider, useNotifications, getNotificationIcon } from '@/context/NotificationContext';
import { FaCheck } from 'react-icons/fa';
import { TbSettingsCog, TbFlag, TbFlagCheck, TbActivityHeartbeat, TbNotification, TbChevronDown, TbReload, TbDotsVertical, TbChevronLeft, TbChevronRight, TbSearch, TbArchive, TbTrash, TbMailOpened, TbFlagExclamation } from 'react-icons/tb';
import clsx from 'clsx';
import { useToast } from '@/components/ui/use-toast';

const notificationTabs = [
  { key: 'all', label: 'All' },
  { key: 'unread', label: 'Unread' },
  { key: 'read', label: 'Read' },
  { key: 'archive', label: 'Archived' },
];

function NotificationPageContent() {
  const { notifications, markAsRead, markAsUnread, markAllAsRead, unreadCount, filter, setFilter, addContractCreatedNotification, addDocumentCreatedNotification, addSignatureRequestedNotification, addSignatureRejectedNotification, addSignatureCompletedNotification, addTaskCreatedNotification, addContractVoidedNotification, addDocumentDeletedNotification, addPasskeyRemovedNotification, addWalletRemovedNotification, addApiTokenRemovedNotification, addWebhookRemovedNotification } = useNotifications();
  const [markAllReadClicked, setMarkAllReadClicked] = useState(false);
  const [allSelected, setAllSelected] = useState(false);
  const [selectedNotifications, setSelectedNotifications] = useState<Set<string>>(new Set());
  const [showDropdown, setShowDropdown] = useState(false);
  const [showDotsDropdown, setShowDotsDropdown] = useState(false);
  const [showIndividualDropdown, setShowIndividualDropdown] = useState<string | null>(null);
  const [selectionFilter, setSelectionFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [importantNotifications, setImportantNotifications] = useState<Set<string>>(new Set());
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dotsDropdownRef = useRef<HTMLDivElement>(null);
  const individualDropdownRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Function to mark notifications as important
  const markAsImportant = (notificationIds: string[]) => {
    const newImportant = new Set(importantNotifications);
    notificationIds.forEach(id => {
      newImportant.add(id);
    });
    setImportantNotifications(newImportant);
    
    toast({
      title: "Notifications flagged as important",
      description: `${notificationIds.length} notification${notificationIds.length > 1 ? 's' : ''} marked as important`,
      duration: 3000,
    });
  };

  // Function to unflag notifications
  const unflagAsImportant = (notificationIds: string[]) => {
    const newImportant = new Set(importantNotifications);
    notificationIds.forEach(id => {
      newImportant.delete(id);
    });
    setImportantNotifications(newImportant);
    
    toast({
      title: "Notifications unflagged",
      description: `${notificationIds.length} notification${notificationIds.length > 1 ? 's' : ''} unflagged`,
      duration: 3000,
    });
  };

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
      
      // Handle individual dropdown
      if (showIndividualDropdown) {
        const isInsideDropdown = individualDropdownRef.current?.contains(target);
        const isInsideButton = target.closest('[data-individual-dots-button]');
        
        if (!isInsideDropdown && !isInsideButton) {
          setShowIndividualDropdown(null);
        }
      }
    };

    if (showDropdown || showDotsDropdown || showIndividualDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown, showDotsDropdown, showIndividualDropdown]);

  // Filtering logic
  const filtered = notifications.filter((n) => {
    // First apply tab filter
    if (filter === 'all') {
      // For 'all' tab, only apply search filter
    } else if (filter === 'unread') {
      if (n.read) return false; // Must be unread
    } else if (filter === 'read') {
      if (!n.read) return false; // Must be read
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
    
    // Signature completed notification
    addSignatureCompletedNotification('John Doe', 'USR-2024-001', 'Software Development Agreement', 'DOC-2024-001', 'CON-2024-001', 'Software Development Agreement');
    
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
      description: "Added 12 sample notifications to demonstrate the activity monitor",
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
        <div className="flex items-center gap-1">
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
                onClick={() => {
                  setFilter(tab.key);
                  setSelectedNotifications(new Set());
                  setAllSelected(false);
                }}
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
      <div className="flex items-center mt-4 relative ml-[2px]">
        <div 
          className={`w-[17px] h-4 border border-gray-300 rounded flex items-center justify-center cursor-pointer ml-7 ${
            allSelected ? 'border-primary' : 'border-gray-300'
          }`}
          onClick={() => {
            const newAllSelected = !allSelected;
            setAllSelected(newAllSelected);
            if (newAllSelected) {
              // Select notifications based on current filter tab
              let notificationsToSelect;
              if (filter === 'all') {
                notificationsToSelect = filtered;
              } else if (filter === 'unread') {
                notificationsToSelect = filtered.filter(n => !n.read);
              } else if (filter === 'read') {
                notificationsToSelect = filtered.filter(n => n.read);
              } else if (filter === 'archive') {
                notificationsToSelect = filtered;
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
        {selectedNotifications.size === 0 ? (
          <>
            <TbReload 
              className="ml-2 text-gray-600 dark:text-gray-300 w-5 h-5 cursor-pointer hover:text-gray-900 dark:hover:text-white transition-colors" 
            />
            <TbDotsVertical 
              data-dots-button
              className="ml-2 text-gray-600 dark:text-gray-300 w-4 h-4 cursor-pointer hover:text-gray-900 dark:hover:text-white transition-colors" 
              onClick={() => setShowDotsDropdown(v => !v)}
            />
          </>
        ) : (
          <>
            <TbArchive 
              className="ml-2 text-gray-600 dark:text-gray-300 w-5 h-5 cursor-pointer hover:text-gray-900 dark:hover:text-white transition-colors" 
            />
            <TbTrash 
              className="ml-2 text-gray-600 dark:text-gray-300 w-5 h-5 cursor-pointer hover:text-gray-900 dark:hover:text-white transition-colors" 
            />
            <div className="ml-2 w-px h-5 bg-gray-300 dark:bg-gray-600"></div>
            <TbMailOpened 
              className="ml-2 text-gray-600 dark:text-gray-300 w-5 h-5 cursor-pointer hover:text-gray-900 dark:hover:text-white transition-colors" 
            />
            <TbDotsVertical 
              data-dots-button
              className="ml-2 text-gray-600 dark:text-gray-300 w-4 h-4 cursor-pointer hover:text-gray-900 dark:hover:text-white transition-colors" 
              onClick={() => setShowDotsDropdown(v => !v)}
            />
          </>
        )}
        
        {/* Dots Dropdown */}
        {showDotsDropdown && (
          <div ref={dotsDropdownRef} className={`absolute top-full mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50 ${
            selectedNotifications.size > 0 ? 'ml-44 w-40' : 'ml-28 w-32'
          }`}>
            {selectedNotifications.size > 0 ? (
              <>
                {(() => {
                  // Check if all selected notifications are unread
                  const selectedNotificationObjects = notifications.filter(n => selectedNotifications.has(n.id));
                  const allUnread = selectedNotificationObjects.every(n => !n.read);
                  const allRead = selectedNotificationObjects.every(n => n.read);
                  
                                     if (allUnread) {
                     return (
                       <>
                         <button
                           className="w-full text-left px-4 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                           onClick={() => {
                             // Mark only selected notifications as read
                             selectedNotifications.forEach(id => markAsRead(id));
                             setShowDotsDropdown(false);
                           }}
                         >
                           Mark as Read
                         </button>
                         <button
                           className="w-full text-left px-4 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                           onClick={() => {
                             markAsImportant(Array.from(selectedNotifications));
                             setShowDotsDropdown(false);
                           }}
                         >
                           Flag as Important
                         </button>
                         <button
                           className="w-full text-left px-4 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                           onClick={() => {
                             // TODO: Implement archive functionality
                             setShowDotsDropdown(false);
                           }}
                         >
                           Archive
                         </button>
                       </>
                     );
                   } else if (allRead) {
                     return (
                       <>
                         <button
                           className="w-full text-left px-4 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                           onClick={() => {
                             // Mark only selected notifications as unread
                             selectedNotifications.forEach(id => markAsUnread(id));
                             setShowDotsDropdown(false);
                           }}
                         >
                           Mark as Unread
                         </button>
                         <button
                           className="w-full text-left px-4 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                           onClick={() => {
                             markAsImportant(Array.from(selectedNotifications));
                             setShowDotsDropdown(false);
                           }}
                         >
                           Flag as Important
                         </button>
                         <button
                           className="w-full text-left px-4 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                           onClick={() => {
                             // TODO: Implement archive functionality
                             setShowDotsDropdown(false);
                           }}
                         >
                           Archive
                         </button>
                       </>
                     );
                   } else {
                     // Mixed read/unread - show appropriate options
                     return (
                       <>
                         {(() => {
                           // Check if any selected notifications are unread
                           const hasUnread = selectedNotificationObjects.some(n => !n.read);
                           // Check if any selected notifications are read
                           const hasRead = selectedNotificationObjects.some(n => n.read);
                           
                           return (
                             <>
                               {hasUnread && (
                                 <button
                                   className="w-full text-left px-4 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                   onClick={() => {
                                     // Mark only unread selected notifications as read
                                     selectedNotificationObjects.filter(n => !n.read).forEach(n => markAsRead(n.id));
                                     setShowDotsDropdown(false);
                                   }}
                                 >
                                   Mark as Read
                                 </button>
                               )}
                               {hasRead && (
                                 <button
                                   className="w-full text-left px-4 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                   onClick={() => {
                                     // Mark only read selected notifications as unread
                                     selectedNotificationObjects.filter(n => n.read).forEach(n => markAsUnread(n.id));
                                     setShowDotsDropdown(false);
                                   }}
                                 >
                                   Mark as Unread
                                 </button>
                               )}
                               <button
                                 className="w-full text-left px-4 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                 onClick={() => {
                                   markAsImportant(Array.from(selectedNotifications));
                                   setShowDotsDropdown(false);
                                 }}
                               >
                                 Flag as Important
                               </button>
                               <button
                                 className="w-full text-left px-4 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                 onClick={() => {
                                   // TODO: Implement archive functionality
                                   setShowDotsDropdown(false);
                                 }}
                               >
                                 Archive
                               </button>
                             </>
                           );
                         })()}
                       </>
                     );
                   }
                })()}
              </>
            ) : (
              <button
                className="w-full text-left px-4 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                onClick={() => {
                  markAllAsRead();
                  setShowDotsDropdown(false);
                }}
              >
                Mark all as Read
              </button>
            )}
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
          <div ref={dropdownRef} className="absolute top-full mt-1 left-[60px] w-32 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
            <button
              className={`w-full text-left px-4 py-2 text-xs font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                selectionFilter === 'all' ? 'text-primary bg-primary/10' : 'text-gray-700 dark:text-gray-300'
              }`}
              onClick={() => {
                setSelectionFilter('all');
                // Clear current selection and select all notifications on the current page
                const currentPageNotificationIds = currentNotifications.map(n => n.id);
                setSelectedNotifications(new Set(currentPageNotificationIds));
                setAllSelected(currentPageNotificationIds.length > 0);
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
                // Clear current selection and select only unread notifications on the current page
                const unreadNotificationIds = currentNotifications.filter(n => !n.read).map(n => n.id);
                setSelectedNotifications(new Set(unreadNotificationIds));
                setAllSelected(unreadNotificationIds.length > 0);
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
                // Clear current selection and select only read notifications on the current page
                const readNotificationIds = currentNotifications.filter(n => n.read).map(n => n.id);
                setSelectedNotifications(new Set(readNotificationIds));
                setAllSelected(readNotificationIds.length > 0);
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
            <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400 mt-48">
              <TbActivityHeartbeat className="w-6 h-6 mb-2 text-primary" />
              <p className="text-sm" style={{ fontFamily: 'Avenir, sans-serif' }}>No activity found</p>
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
                'flex items-start gap-4 p-6 mx-1 sm:mx-2 my-5 rounded cursor-pointer hover:shadow-lg transition-shadow relative',
                selectedNotifications.has(n.id) && 'bg-gray-100 dark:bg-gray-700',
                !n.read && !selectedNotifications.has(n.id) && (['contract_voided', 'contract_deleted', 'document_deleted', 'task_deleted', 'signature_voided', 'signature_rejected', 'passkey_removed', 'wallet_removed', 'api_token_removed', 'webhook_removed'].includes(n.type) ? 'bg-red-50/50 dark:bg-red-900/20 shadow-[0_0_0_1px_rgba(220,38,38,0.3)] dark:shadow-[0_0_0_1px_rgba(248,113,113,0.3)]' : 'bg-gray-100/70 dark:bg-gray-700/25 shadow-[0_0_0_1px_rgba(20,184,166,0.3)] dark:shadow-[0_0_0_1px_rgba(20,184,166,0.3)]'),
                n.read && !selectedNotifications.has(n.id) && 'border border-gray-200 dark:border-gray-700',
                index > 0 && 'border-t border-gray-100 dark:border-gray-700',
                'transition-colors'
              )}
          >
            <div className="flex-shrink-0 mt-1">
              {/* Selection Checkbox */}
              <div 
                className={`w-[17px] h-4 border border-gray-300 rounded flex items-center justify-center cursor-pointer ${
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
                            <div className="flex items-center gap-2 relative">
                {getNotificationIcon(n.type)}
                <span className={`font-semibold text-sm ${
                  ['contract_voided', 'contract_deleted', 'document_deleted', 'task_deleted', 'signature_voided', 'signature_rejected', 'passkey_removed', 'wallet_removed', 'api_token_removed', 'webhook_removed'].includes(n.type)
                    ? 'text-red-600 dark:text-red-400' 
                    : ['signature_completed', 'task_created', 'signature_requested', 'document_created', 'contract_created'].includes(n.type)
                      ? 'text-primary'
                      : 'text-gray-900 dark:text-white'
                }`}>{n.title}</span>
                {!n.read && (
                  <span className="ml-2 px-2 py-0.5 text-xs font-semibold rounded bg-gray-600 text-white border border-gray-600">Unread</span>
                )}
                <div className="relative">
                  <TbDotsVertical 
                    data-individual-dots-button
                    className="ml-[1px] text-gray-600 dark:text-gray-300 w-4 h-4 cursor-pointer hover:text-gray-900 dark:hover:text-white transition-colors" 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setShowIndividualDropdown(showIndividualDropdown === n.id ? null : n.id);
                    }}
                  />
                
                  {/* Individual Notification Dropdown */}
                  {showIndividualDropdown === n.id && (
                    <div 
                      ref={individualDropdownRef} 
                      className="absolute top-full left-2 mt-1 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50"
                    >
                      {!n.read ? (
                        <>
                          <button
                            className="w-full text-left px-4 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              markAsRead(n.id);
                              setShowIndividualDropdown(null);
                            }}
                          >
                            Mark as Read
                          </button>
                          <button
                            className="w-full text-left px-4 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              if (importantNotifications.has(n.id)) {
                                unflagAsImportant([n.id]);
                              } else {
                                markAsImportant([n.id]);
                              }
                              setShowIndividualDropdown(null);
                            }}
                          >
                            {importantNotifications.has(n.id) ? 'Unflag' : 'Flag as Important'}
                          </button>
                          <button
                            className="w-full text-left px-4 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              // TODO: Implement archive functionality
                              setShowIndividualDropdown(null);
                            }}
                          >
                            Archive
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className="w-full text-left px-4 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              markAsUnread(n.id);
                              setShowIndividualDropdown(null);
                            }}
                          >
                            Mark as Unread
                          </button>
                          <button
                            className="w-full text-left px-4 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              if (importantNotifications.has(n.id)) {
                                unflagAsImportant([n.id]);
                              } else {
                                markAsImportant([n.id]);
                              }
                              setShowIndividualDropdown(null);
                            }}
                          >
                            {importantNotifications.has(n.id) ? 'Unflag' : 'Flag as Important'}
                          </button>
                          <button
                            className="w-full text-left px-4 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              // TODO: Implement archive functionality
                              setShowIndividualDropdown(null);
                            }}
                          >
                            Archive
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className="text-gray-600 dark:text-gray-400 text-xs mt-4 mb-2">{n.message}</div>
              <a href={n.link || '#'} className="text-primary text-xs font-medium hover:underline">View Details</a>
            </div>
            <div className="flex flex-col items-end gap-2 min-w-[100px]">
              <span className="text-xs text-gray-900 dark:text-white mb-2 whitespace-nowrap">{formatTimeAgo(n.timestamp)}</span>
              {importantNotifications.has(n.id) && (
                <TbFlagExclamation className="text-yellow-500 text-xl" />
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