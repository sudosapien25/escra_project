'use client';

import React, { useState, useRef, useEffect } from 'react';
import { NotificationProvider, useNotifications, getNotificationIcon } from '@/context/NotificationContext';
import { FaCheck } from 'react-icons/fa';
import { TbSettingsCog, TbFlag, TbFlagCheck, TbFlagOff, TbActivityHeartbeat, TbNotification, TbChevronDown, TbReload, TbDotsVertical, TbChevronLeft, TbChevronRight, TbSearch, TbArchive, TbTrash, TbMailOpened, TbMail, TbFlagExclamation, TbFileSearch } from 'react-icons/tb';
import clsx from 'clsx';
import { useToast } from '@/components/ui/use-toast';
import { mockContracts } from '@/data/mockContracts';

const notificationTabs = [
  { key: 'all', label: 'All' },
  { key: 'unread', label: 'Unread' },
  { key: 'read', label: 'Read' },
  { key: 'important', label: 'Important' },
  { key: 'archive', label: 'Archived' },
];

function NotificationPageContent() {
  const { notifications, markAsRead, markAllAsRead, markAsUnread, markAllAsUnread, unreadCount, filter, setFilter, addContractCreatedNotification, addDocumentCreatedNotification, addSignatureRequestedNotification, addSignatureRejectedNotification, addSignatureCompletedNotification, addTaskCreatedNotification, addContractVoidedNotification, addDocumentDeletedNotification, addPasskeyRemovedNotification, addWalletRemovedNotification, addApiTokenRemovedNotification, addWebhookRemovedNotification } = useNotifications();

  const [allSelected, setAllSelected] = useState(false);
  const [selectedNotifications, setSelectedNotifications] = useState<Set<string>>(new Set());
  const [showDropdown, setShowDropdown] = useState(false);
  const [showDotsDropdown, setShowDotsDropdown] = useState(false);
  const [showIndividualDropdown, setShowIndividualDropdown] = useState<string | null>(null);
  const [selectionFilter, setSelectionFilter] = useState<'all' | 'unread' | 'read' | 'important' | 'archive'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [importantNotifications, setImportantNotifications] = useState<Set<string>>(new Set());
  const [archivedNotifications, setArchivedNotifications] = useState<Set<string>>(new Set());
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dotsDropdownRef = useRef<HTMLDivElement>(null);
  const individualDropdownRef = useRef<HTMLDivElement>(null);
  const contractDropdownRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Contracts filter state
  const [showContractDropdown, setShowContractDropdown] = useState(false);
  const [selectedContracts, setSelectedContracts] = useState<string[]>([]);
  const [contractSearch, setContractSearch] = useState('');
  const [contracts, setContracts] = useState(mockContracts);

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

  // Function to archive notifications
  const archiveNotifications = (notificationIds: string[]) => {
    const newArchived = new Set(archivedNotifications);
    notificationIds.forEach(id => {
      newArchived.add(id);
      // Mark as read when archiving
      if (!notifications.find(n => n.id === id)?.read) {
        markAsRead(id);
      }
    });
    setArchivedNotifications(newArchived);
    
    toast({
      title: "Notifications archived",
      description: `${notificationIds.length} notification${notificationIds.length > 1 ? 's' : ''} archived`,
      duration: 3000,
    });
  };

  // Function to unarchive notifications
  const unarchiveNotifications = (notificationIds: string[]) => {
    const newArchived = new Set(archivedNotifications);
    notificationIds.forEach(id => {
      newArchived.delete(id);
    });
    setArchivedNotifications(newArchived);
    
    toast({
      title: "Notifications unarchived",
      description: `${notificationIds.length} notification${notificationIds.length > 1 ? 's' : ''} unarchived`,
      duration: 3000,
    });
  };

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      
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

      // Handle contracts dropdown
      if (showContractDropdown) {
        const isInsideDropdown = contractDropdownRef.current?.contains(target);
        const isInsideButton = target.closest('[data-contract-button]');
        
        if (!isInsideDropdown && !isInsideButton) {
          setShowContractDropdown(false);
        }
      }
    };

    if (showDropdown || showDotsDropdown || showIndividualDropdown || showContractDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown, showDotsDropdown, showIndividualDropdown, showContractDropdown]);

  // Filtering logic
  const filtered = notifications.filter((n) => {
    // First apply tab filter
    if (filter === 'all') {
      // For 'all' tab, only apply search filter
    } else if (filter === 'unread') {
      if (n.read) return false; // Must be unread
    } else if (filter === 'read') {
      if (!n.read) return false; // Must be read
    } else if (filter === 'important') {
      if (!importantNotifications.has(n.id)) return false; // Must be flagged as important
    } else if (filter === 'archive') {
      if (!archivedNotifications.has(n.id)) return false; // Must be archived
    }
    
    // Apply contract filter if contracts are selected
    if (selectedContracts.length > 0) {
      // Check if notification is related to any of the selected contracts
      const notificationContractIds = [];
      
      // Extract contract IDs from notification message/title
      if (n.message.includes('CON-')) {
        const contractMatches = n.message.match(/CON-\d{4}-\d{3}/g);
        if (contractMatches) {
          notificationContractIds.push(...contractMatches);
        }
      }
      
      // Also check if notification title contains contract information
      const contractFromMessage = contracts.find(contract => 
        n.message.includes(contract.title) || n.title.includes(contract.title)
      );
      if (contractFromMessage) {
        notificationContractIds.push(contractFromMessage.id);
      }
      
      // If no contract relationship found, exclude this notification
      if (notificationContractIds.length === 0) return false;
      
      // Check if any of the notification's contract IDs match selected contracts
      const hasMatchingContract = notificationContractIds.some(contractId => 
        selectedContracts.includes(contractId)
      );
      
      if (!hasMatchingContract) return false;
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
  }, [filter, searchTerm, selectedContracts]);

  // Function to add newly created contracts to the list
  const addNewContract = (newContract: any) => {
    setContracts(prev => [newContract, ...prev]);
  };

  // Listen for contract creation notifications to update contracts list
  useEffect(() => {
    // In a real app, this would listen to a contract creation event
    // For now, we'll just ensure the contracts state includes any new contracts
    // This could be improved by connecting to a global state or event system
  }, []);

  const createExampleNotifications = () => {
    // Get actual contracts from the contracts array for realistic examples
    const contract1 = contracts[0]; // New Property Acquisition
    const contract2 = contracts[1]; // Land Development Contract
    const contract3 = contracts[2]; // Construction Escrow
    
    // Regular notifications (created/added) - create first to appear at bottom
    addContractCreatedNotification(contract1.id, contract1.title);
    
    // Document created notification
    addDocumentCreatedNotification('DOC-2024-001', 'Property Survey Report', contract1.id, contract1.title);
    
    // Signature requested notification
    addSignatureRequestedNotification('SIG-2024-001', contract1.title, [{name: 'Robert Chen', email: 'robert.chen@company.com'}]);
    
    // Signature completed notification
    addSignatureCompletedNotification('Robert Chen', 'USR-2024-001', contract1.title, 'DOC-2024-001', contract1.id, contract1.title);
    
    // Task created notification
    addTaskCreatedNotification('TASK-2024-001', 'Review Property Documents', contract1.id, contract1.title);
    
    // Document created for second contract
    addDocumentCreatedNotification('DOC-2024-002', 'Environmental Assessment', contract2.id, contract2.title);
    
    // Signature requested for second contract
    addSignatureRequestedNotification('SIG-2024-002', contract2.title, [{name: 'GreenSpace Developers', email: 'contact@greenspace.com'}]);
    
    // Red notifications (rejected/removed/deleted) - create last to appear at top
    addSignatureRejectedNotification('SIG-2024-003', contract3.title, [{name: 'BuildRight Construction', email: 'info@buildright.com'}]);
    
    // Contract voided notification
    addContractVoidedNotification(contract3.id, contract3.title);
    
    // Document deleted notification
    addDocumentDeletedNotification('DOC-2024-003', 'Outdated Blueprints', contract3.id, contract3.title);
    
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
      description: `Added 12 sample notifications using real contracts: ${contract1.title}, ${contract2.title}, and ${contract3.title}`,
      duration: 3000,
    });
  };

  // Function to create additional test notifications with different contracts
  const createAdditionalTestNotifications = () => {
    // Get more contracts for variety
    const contract4 = contracts[3]; // Commercial Lease Amendment
    const contract5 = contracts[4]; // Property Sale Contract
    const contract6 = contracts[5]; // Investment Property Escrow
    
    // Create additional notifications with different contract types
    addContractCreatedNotification(contract4.id, contract4.title);
    addDocumentCreatedNotification('DOC-2024-004', 'Lease Amendment Terms', contract4.id, contract4.title);
    addSignatureRequestedNotification('SIG-2024-004', contract4.title, [{name: 'TechCorp Legal', email: 'legal@techcorp.com'}]);
    
    addContractCreatedNotification(contract5.id, contract5.title);
    addDocumentCreatedNotification('DOC-2024-005', 'Property Inspection Report', contract5.id, contract5.title);
    addTaskCreatedNotification('TASK-2024-002', 'Schedule Property Viewing', contract5.id, contract5.title);
    
    addContractCreatedNotification(contract6.id, contract6.title);
    addDocumentCreatedNotification('DOC-2024-006', 'Investment Analysis', contract6.id, contract6.title);
    addSignatureCompletedNotification('InvestPro Team', 'USR-2024-002', contract6.title, 'DOC-2024-006', contract6.id, contract6.title);
    
    toast({
      title: "Additional test notifications created",
      description: `Added 6 more notifications using contracts: ${contract4.title}, ${contract5.title}, and ${contract6.title}`,
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
        <div className="flex gap-2">
          <button 
            className="flex items-center justify-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-semibold"
            onClick={createExampleNotifications}
          >
            Create Examples
          </button>
          <button 
            className="flex items-center justify-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-semibold"
            onClick={createAdditionalTestNotifications}
          >
            More Examples
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
              placeholder="Search notification types, contracts, parties, documents or IDs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none focus:ring-0 focus:outline-none text-xs text-gray-700 dark:text-white placeholder-gray-400 font-medium min-w-0"
              style={{ fontFamily: 'Avenir, sans-serif' }}
            />
          </div>

          {/* Contract Filter */}
          <div className="relative">
            <button
              data-contract-button
              className="flex items-center justify-between bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-300 font-medium text-xs shadow-sm whitespace-nowrap"
              style={{ fontFamily: 'Avenir, sans-serif' }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowContractDropdown(prev => !prev);
              }}
            >
              <span className="flex items-center"><TbFileSearch className="text-gray-400 mr-2" size={17} />Contract</span>
              <TbChevronDown className="text-gray-400 dark:text-gray-500 ml-2" size={18} />
            </button>
            {showContractDropdown && (
              <div 
                ref={contractDropdownRef}
                className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 z-50 py-2" 
                style={{ 
                  fontFamily: 'Avenir, sans-serif'
                }}
              >
                {/* Search Bar */}
                <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search contracts..."
                      value={contractSearch}
                      onChange={(e) => setContractSearch(e.target.value)}
                      className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-lg text-xs font-medium text-gray-700 dark:text-white bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                      style={{ fontFamily: 'Avenir, sans-serif' }}
                    />
                    <TbSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                </div>

                <button
                  className={`w-full text-left px-4 py-2 text-xs hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center ${selectedContracts.length === 0 ? 'text-primary bg-primary/10' : 'text-gray-700 dark:text-gray-300'}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedContracts([]);
                  }}
                >
                  <div className="w-4 h-4 border border-gray-300 rounded mr-2 flex items-center justify-center">
                    {selectedContracts.length === 0 && (
                      <div className="w-3 h-3 bg-primary rounded-sm flex items-center justify-center">
                        <FaCheck className="text-white" size={8} />
                      </div>
                    )}
                  </div>
                  All
                </button>
                {contracts
                  .filter(contract => 
                    contract.id.toLowerCase().includes(contractSearch.toLowerCase()) ||
                    contract.title.toLowerCase().includes(contractSearch.toLowerCase())
                  )
                  .sort((a, b) => Number(a.id) - Number(b.id))
                  .map(contract => (
                    <button
                      key={contract.id}
                      className={`w-full text-left px-4 py-2 text-xs hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center whitespace-nowrap truncate ${selectedContracts.includes(String(contract.id)) ? 'text-primary bg-primary/10' : 'text-gray-700 dark:text-gray-300'}`}
                      onClick={(e) => {
                        e.preventDefault();
                        setSelectedContracts(prev => {
                          if (prev.includes(String(contract.id))) {
                            return prev.filter(id => id !== contract.id);
                          } else {
                            return [...prev, String(contract.id)];
                          }
                        });
                      }}
                    >
                      <div className="w-4 h-4 border border-gray-300 rounded mr-2 flex items-center justify-center">
                        {selectedContracts.includes(String(contract.id)) && (
                          <div className="w-3 h-3 bg-primary rounded-sm flex items-center justify-center">
                            <FaCheck className="text-white" size={8} />
                          </div>
                        )}
                      </div>
                      {contract.id} - {contract.title}
                    </button>
                  ))}
              </div>
            )}
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
              if (notificationsToSelect) {
                setSelectedNotifications(new Set(notificationsToSelect.map(n => n.id)));
              }
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
            <TbSettingsCog 
              className="ml-2 text-gray-600 dark:text-gray-300 w-5 h-5 cursor-pointer hover:text-gray-900 dark:hover:text-white transition-colors" 
            />
          </>
        ) : (
          <>
            <TbArchive 
              className="ml-2 text-gray-600 dark:text-gray-300 w-5 h-5 cursor-pointer hover:text-gray-900 dark:hover:text-white transition-colors" 
              onClick={() => {
                if (selectedNotifications.size > 0) {
                  const selectedNotificationObjects = notifications.filter(n => selectedNotifications.has(n.id));
                  const allArchived = selectedNotificationObjects.every(n => archivedNotifications.has(n.id));
                  
                  if (allArchived) {
                    unarchiveNotifications(Array.from(selectedNotifications));
                    toast({
                      title: "Notifications unarchived",
                      description: `${selectedNotifications.size} notification${selectedNotifications.size > 1 ? 's' : ''} unarchived`,
                      duration: 3000,
                    });
                  } else {
                    archiveNotifications(Array.from(selectedNotifications));
                    toast({
                      title: "Notifications archived",
                      description: `${selectedNotifications.size} notification${selectedNotifications.size > 1 ? 's' : ''} archived`,
                      duration: 3000,
                    });
                  }
                }
              }}
            />
            <TbTrash 
              className="ml-2 text-gray-600 dark:text-gray-300 w-5 h-5 cursor-pointer hover:text-gray-900 dark:hover:text-white transition-colors" 
            />
            <div className="ml-2 w-px h-5 bg-gray-300 dark:bg-gray-600"></div>
            {(() => {
              const selectedNotificationObjects = notifications.filter(n => selectedNotifications.has(n.id));
              const allRead = selectedNotificationObjects.every(n => n.read);
              const allUnread = selectedNotificationObjects.every(n => !n.read);
              const hasMixedReadState = !allRead && !allUnread;
              
              if (allUnread) {
                // All selected are unread - show open mail icon, mark as read
                return (
                  <TbMailOpened 
                    className="ml-2 text-gray-600 dark:text-gray-300 w-5 h-5 cursor-pointer hover:text-gray-900 dark:hover:text-white transition-colors" 
                    onClick={() => {
                      if (selectedNotifications.size > 0) {
                        selectedNotifications.forEach(id => markAsRead(id));
                        toast({
                          title: "Notifications marked as read",
                          description: `${selectedNotifications.size} notification${selectedNotifications.size > 1 ? 's' : ''} marked as read`,
                          duration: 3000,
                        });
                      }
                    }}
                  />
                );
              } else if (allRead) {
                // All selected are read - show closed mail icon, mark as unread
                return (
                  <TbMail 
                    className="ml-2 text-gray-600 dark:text-gray-300 w-5 h-5 cursor-pointer hover:text-gray-900 dark:hover:text-white transition-colors" 
                    onClick={() => {
                      if (selectedNotifications.size > 0) {
                        selectedNotifications.forEach(id => markAsUnread(id));
                        toast({
                          title: "Notifications marked as unread",
                          description: `${selectedNotifications.size} notification${selectedNotifications.size > 1 ? 's' : ''} marked as unread`,
                          duration: 3000,
                        });
                      }
                    }}
                  />
                );
              } else {
                // Mixed read/unread state - show open mail icon, mark as read
                return (
                  <TbMailOpened 
                    className="ml-2 text-gray-600 dark:text-gray-300 w-5 h-5 cursor-pointer hover:text-gray-900 dark:hover:text-white transition-colors" 
                    onClick={() => {
                      if (selectedNotifications.size > 0) {
                        selectedNotifications.forEach(id => markAsRead(id));
                        toast({
                          title: "Notifications marked as read",
                          description: `${selectedNotifications.size} notification${selectedNotifications.size > 1 ? 's' : ''} marked as read`,
                          duration: 3000,
                        });
                      }
                    }}
                  />
                );
              }
            })()}

            {/* Flag Icon */}
            {(() => {
              const selectedNotificationObjects = notifications.filter(n => selectedNotifications.has(n.id));
              const allFlagged = selectedNotificationObjects.every(n => importantNotifications.has(n.id));
              const allUnflagged = selectedNotificationObjects.every(n => !importantNotifications.has(n.id));
              const hasMixedFlagState = !allFlagged && !allUnflagged;
              
              if (allFlagged) {
                // All selected are flagged - show flag off icon, unflag all
                return (
                  <TbFlagOff 
                    className="ml-2 text-gray-600 dark:text-gray-300 w-5 h-5 cursor-pointer hover:text-gray-900 dark:hover:text-white transition-colors" 
                    onClick={() => {
                      if (selectedNotifications.size > 0) {
                        unflagAsImportant(Array.from(selectedNotifications));
                        toast({
                          title: "Notifications unflagged",
                          description: `${selectedNotifications.size} notification${selectedNotifications.size > 1 ? 's' : ''} unflagged`,
                          duration: 3000,
                        });
                      }
                    }}
                  />
                );
              } else if (allUnflagged) {
                // All selected are unflagged - show flag icon, flag all
                return (
                  <TbFlag 
                    className="ml-2 text-gray-600 dark:text-gray-300 w-5 h-5 cursor-pointer hover:text-gray-900 dark:hover:text-white transition-colors" 
                    onClick={() => {
                      if (selectedNotifications.size > 0) {
                        markAsImportant(Array.from(selectedNotifications));
                        toast({
                          title: "Notifications flagged as important",
                          description: `${selectedNotifications.size} notification${selectedNotifications.size > 1 ? 's' : ''} flagged as important`,
                          duration: 3000,
                        });
                      }
                    }}
                  />
                );
              } else {
                // Mixed flagged/unflagged state - show flag icon, flag unflagged ones
                return (
                  <TbFlag 
                    className="ml-2 text-gray-600 dark:text-gray-300 w-5 h-5 cursor-pointer hover:text-gray-900 dark:hover:text-white transition-colors" 
                    onClick={() => {
                      if (selectedNotifications.size > 0) {
                        const unflaggedIds = selectedNotificationObjects
                          .filter(n => !importantNotifications.has(n.id))
                          .map(n => n.id);
                        markAsImportant(unflaggedIds);
                        toast({
                          title: "Notifications flagged as important",
                          description: `${unflaggedIds.length} notification${unflaggedIds.length > 1 ? 's' : ''} flagged as important`,
                          duration: 3000,
                        });
                      }
                    }}
                  />
                );
              }
            })()}
            <TbDotsVertical 
              data-dots-button
              className="ml-2 text-gray-600 dark:text-gray-300 w-4 h-4 cursor-pointer hover:text-gray-900 dark:hover:text-white transition-colors" 
              onClick={() => setShowDotsDropdown(v => !v)}
            />
            <TbSettingsCog 
              className="ml-2 text-gray-600 dark:text-gray-300 w-5 h-5 cursor-pointer hover:text-gray-900 dark:hover:text-white transition-colors" 
            />
          </>
        )}
        
        {/* Dots Dropdown */}
        {showDotsDropdown && (
          <div ref={dotsDropdownRef} className={`absolute top-full mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50 ${
            selectedNotifications.size > 0 ? 'ml-44 w-48' : 'ml-28 w-40'
          }`}>
            {selectedNotifications.size > 0 ? (
              <>
                {(() => {
                  // Check if all selected notifications are unread
                  const selectedNotificationObjects = notifications.filter(n => selectedNotifications.has(n.id));
                  const allUnread = selectedNotificationObjects.every(n => !n.read);
                  const allRead = selectedNotificationObjects.every(n => n.read);
                  
                  // Check if any selected notifications are already flagged
                  const hasFlagged = selectedNotificationObjects.some(n => importantNotifications.has(n.id));
                  const allFlagged = selectedNotificationObjects.every(n => importantNotifications.has(n.id));
                  const hasUnflagged = selectedNotificationObjects.some(n => !importantNotifications.has(n.id));
                  
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
                            if (allFlagged) {
                              unflagAsImportant(Array.from(selectedNotifications));
                            } else if (hasFlagged && hasUnflagged) {
                              // Mixed selection: only flag the unflagged ones
                              const unflaggedIds = selectedNotificationObjects
                                .filter(n => !importantNotifications.has(n.id))
                                .map(n => n.id);
                              markAsImportant(unflaggedIds);
                            } else {
                              markAsImportant(Array.from(selectedNotifications));
                            }
                            setShowDotsDropdown(false);
                          }}
                        >
                          {allFlagged ? 'Unflag' : 'Flag as Important'}
                        </button>
                        <button
                          className="w-full text-left px-4 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          onClick={() => {
                            if (selectedNotificationObjects.every(n => archivedNotifications.has(n.id))) {
                              unarchiveNotifications(Array.from(selectedNotifications));
                            } else {
                              archiveNotifications(Array.from(selectedNotifications));
                            }
                            setShowDotsDropdown(false);
                          }}
                        >
                          {selectedNotificationObjects.every(n => archivedNotifications.has(n.id)) ? 'Unarchive' : 'Archive'}
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
                            if (allFlagged) {
                              unflagAsImportant(Array.from(selectedNotifications));
                            } else if (hasFlagged && hasUnflagged) {
                              // Mixed selection: only flag the unflagged ones
                              const unflaggedIds = selectedNotificationObjects
                                .filter(n => !importantNotifications.has(n.id))
                                .map(n => n.id);
                              markAsImportant(unflaggedIds);
                            } else {
                              markAsImportant(Array.from(selectedNotifications));
                            }
                            setShowDotsDropdown(false);
                          }}
                        >
                          {allFlagged ? 'Unflag' : 'Flag as Important'}
                        </button>
                        <button
                          className="w-full text-left px-4 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          onClick={() => {
                            if (selectedNotificationObjects.every(n => archivedNotifications.has(n.id))) {
                              unarchiveNotifications(Array.from(selectedNotifications));
                            } else {
                              archiveNotifications(Array.from(selectedNotifications));
                            }
                            setShowDotsDropdown(false);
                          }}
                        >
                          {selectedNotificationObjects.every(n => archivedNotifications.has(n.id)) ? 'Unarchive' : 'Archive'}
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
                                  if (allFlagged) {
                                    unflagAsImportant(Array.from(selectedNotifications));
                                  } else if (hasFlagged && hasUnflagged) {
                                    // Mixed selection: only flag the unflagged ones
                                    const unflaggedIds = selectedNotificationObjects
                                      .filter(n => !importantNotifications.has(n.id))
                                      .map(n => n.id);
                                    markAsImportant(unflaggedIds);
                                  } else {
                                    markAsImportant(Array.from(selectedNotifications));
                                  }
                                  setShowDotsDropdown(false);
                                }}
                              >
                                {allFlagged ? 'Unflag' : 'Flag as Important'}
                              </button>
                              <button
                                className="w-full text-left px-4 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                onClick={() => {
                                  if (selectedNotificationObjects.every(n => archivedNotifications.has(n.id))) {
                                    unarchiveNotifications(Array.from(selectedNotifications));
                                  } else {
                                    archiveNotifications(Array.from(selectedNotifications));
                                  }
                                  setShowDotsDropdown(false);
                                }}
                              >
                                {selectedNotificationObjects.every(n => archivedNotifications.has(n.id)) ? 'Unarchive' : 'Archive'}
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
              <>
                {(() => {
                  // Check if all notifications are archived
                  const allArchived = notifications.length > 0 && notifications.every(n => archivedNotifications.has(n.id));
                  // Check if all notifications are read
                  const allRead = notifications.length > 0 && notifications.every(n => n.read);
                  // Check if all notifications are unread
                  const allUnread = notifications.length > 0 && notifications.every(n => !n.read);
                  
                  if (allArchived) {
                    return (
                      <button
                        className="w-full text-left px-4 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        onClick={() => {
                          // Unarchive all notifications
                          unarchiveNotifications(notifications.map(n => n.id));
                          setShowDotsDropdown(false);
                        }}
                      >
                        Unarchive All
                      </button>
                    );
                  } else if (allRead) {
                    return (
                      <>
                        <button
                          className="w-full text-left px-4 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          onClick={() => {
                            // Mark all notifications as unread
                            markAllAsUnread();
                            setShowDotsDropdown(false);
                          }}
                        >
                          Mark all as Unread
                        </button>
                        <button
                          className="w-full text-left px-4 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          onClick={() => {
                            // Archive all notifications
                            archiveNotifications(notifications.map(n => n.id));
                            setShowDotsDropdown(false);
                          }}
                        >
                          Archive All
                        </button>
                      </>
                    );
                  } else if (allUnread) {
                    return (
                      <>
                        <button
                          className="w-full text-left px-4 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          onClick={() => {
                            // Mark all notifications as read
                            markAllAsRead();
                            setShowDotsDropdown(false);
                          }}
                        >
                          Mark all as Read
                        </button>
                        <button
                          className="w-full text-left px-4 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          onClick={() => {
                            // Archive all notifications
                            archiveNotifications(notifications.map(n => n.id));
                            setShowDotsDropdown(false);
                          }}
                        >
                          Archive All
                        </button>
                      </>
                    );
                  } else {
                    // Mixed state - show all options
                    return (
                      <>
                        <button
                          className="w-full text-left px-4 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          onClick={() => {
                            // Mark all notifications as read
                            markAllAsRead();
                            setShowDotsDropdown(false);
                          }}
                        >
                          Mark all as Read
                        </button>
                        <button
                          className="w-full text-left px-4 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          onClick={() => {
                            // Mark all notifications as unread
                            markAllAsUnread();
                            setShowDotsDropdown(false);
                          }}
                        >
                          Mark all as Unread
                        </button>
                        <button
                          className="w-full text-left px-4 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          onClick={() => {
                            // Archive all notifications
                            archiveNotifications(notifications.map(n => n.id));
                            setShowDotsDropdown(false);
                          }}
                        >
                          Archive All
                        </button>
                      </>
                    );
                  }
                })()}
              </>
            )}
          </div>
        )}
        
        {/* Pagination Section - Right Side */}
        <div className="ml-auto flex items-center gap-3">
          {/* Selected Count */}
          {selectedNotifications.size > 0 && (
            <div className="text-xs text-gray-600 dark:text-gray-300">
              ({selectedNotifications.size} selected)
            </div>
          )}
          {/* Count Display */}
          <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-300">
            {/* Status Counts */}
            <div className="flex items-center gap-3">
              {/* Read Count */}
              <div className="flex items-center gap-1">
                <span className="text-green-600 dark:text-green-400">Read: {filtered.filter(n => n.read).length}</span>
              </div>
              
              {/* Unread Count */}
              <div className="flex items-center gap-1">
                <span className="text-blue-600 dark:text-blue-400">Unread: {filtered.filter(n => !n.read).length}</span>
              </div>
              
              {/* Flagged Count */}
              <div className="flex items-center gap-1">
                <span className="text-yellow-600 dark:text-yellow-400">Flagged: {filtered.filter(n => importantNotifications.has(n.id)).length}</span>
              </div>
            </div>
            
            {/* Pagination Count */}
            <div>
              {filtered.length > 0 ? `${startIndex + 1}-${endIndex} of ${filtered.length}` : '0 of 0'}
            </div>
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
            <button
              className={`w-full text-left px-4 py-2 text-xs font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                selectionFilter === 'important' ? 'text-primary bg-primary/10' : 'text-gray-700 dark:text-gray-300'
              }`}
              onClick={() => {
                setSelectionFilter('important');
                // Clear current selection and select only important notifications on the current page
                const importantNotificationIds = currentNotifications.filter(n => importantNotifications.has(n.id)).map(n => n.id);
                setSelectedNotifications(new Set(importantNotificationIds));
                setAllSelected(importantNotificationIds.length > 0);
                setShowDropdown(false);
              }}
            >
              Important
            </button>
            <button
              className={`w-full text-left px-4 py-2 text-xs font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                selectionFilter === 'archive' ? 'text-primary bg-primary/10' : 'text-gray-700 dark:text-gray-300'
              }`}
              onClick={() => {
                setSelectionFilter('archive');
                // Clear current selection and select only archived notifications on the current page
                const archivedNotificationIds = currentNotifications.filter(n => archivedNotifications.has(n.id)).map(n => n.id);
                setSelectedNotifications(new Set(archivedNotificationIds));
                setAllSelected(archivedNotificationIds.length > 0);
                setShowDropdown(false);
              }}
            >
              Archived
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
                {archivedNotifications.has(n.id) && (
                  <span className="ml-2 px-2 py-0.5 text-xs font-semibold rounded bg-gray-500 text-white border border-gray-500">Archived</span>
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
                              if (archivedNotifications.has(n.id)) {
                                unarchiveNotifications([n.id]);
                              } else {
                                archiveNotifications([n.id]);
                              }
                              setShowIndividualDropdown(null);
                            }}
                          >
                            {archivedNotifications.has(n.id) ? 'Unarchive' : 'Archive'}
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
                              if (archivedNotifications.has(n.id)) {
                                unarchiveNotifications([n.id]);
                              } else {
                                archiveNotifications([n.id]);
                              }
                              setShowIndividualDropdown(null);
                            }}
                          >
                            {archivedNotifications.has(n.id) ? 'Unarchive' : 'Archive'}
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