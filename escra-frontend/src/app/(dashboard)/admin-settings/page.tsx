'use client';

import React, { useState, useRef, useEffect } from 'react';
import { FaUser } from 'react-icons/fa';
import { TbCameraCog, TbActivity } from 'react-icons/tb';
import { HiChevronDown, HiOutlineChevronDoubleLeft, HiOutlineChevronDoubleRight, HiOutlineKey } from 'react-icons/hi';
import { MdOutlineGeneratingTokens, MdWebhook } from 'react-icons/md';
import { HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';
import { PiEjectBold, PiPowerBold, PiLockKeyBold } from 'react-icons/pi';

const TABS = [
  { key: 'profile', label: 'Profile' },
  { key: 'company', label: 'Company' },
  { key: 'security', label: 'Security' },
  { key: 'notifications', label: 'Notifications' },
  { key: 'integrations', label: 'Integrations' },
  { key: 'api', label: 'API' },
  { key: 'webhooks', label: 'Webhooks' },
  { key: 'billing', label: 'Billing' },
];

const USER_ROLES = ['Admin', 'Creator', 'Editor', 'Viewer'];
const DOCUMENT_LANGUAGES = ['English', 'Spanish', 'French', 'Italian'];
const SIGNATURE_SETTINGS = ['Draw', 'Type', 'Upload'];
const SIGNING_CERTIFICATE_OPTIONS = ['Yes', 'No'];
const WEBHOOK_TRIGGERS = [
  'document.created',
  'document.signed',
  'document.completed',
  'document.deleted',
  'signature.requested',
  'signature.completed',
  'user.invited',
  'user.removed'
];

// Mock activity data
const recentActivityData = [
  {
    date: '7/29/2025, 1:39 PM',
    device: 'Mac OS (10.15.7)',
    browser: 'Brave',
    ipAddress: '24.164.49.187',
    action: 'Profile updated'
  },
  {
    date: '7/28/2025, 3:27 PM',
    device: 'Mac OS (10.15.7)',
    browser: 'Brave',
    ipAddress: '24.164.49.187',
    action: 'Signed In'
  },
  {
    date: '6/27/2025, 9:44 AM',
    device: 'Mac OS (10.15.7)',
    browser: 'Brave',
    ipAddress: '24.164.49.187',
    action: 'Signed In'
  },
  {
    date: '6/27/2025, 9:43 AM',
    device: 'iOS (18.5)',
    browser: 'Brave',
    ipAddress: '24.164.49.187',
    action: 'Signed In'
  }
];

// Mock sessions data
const sessionsData = [
  {
    device: 'Brave (Mac OS)',
    ipAddress: '24.164.49.187',
    lastActive: '1 day ago',
    created: '1 day ago',
    isCurrent: true
  },
  {
    device: 'Safari (iPhone)',
    ipAddress: '24.164.49.187',
    lastActive: '3 hours ago',
    created: '2 days ago',
    isCurrent: false
  },
  {
    device: 'Firefox (Mac OS)',
    ipAddress: '24.164.49.187',
    lastActive: '1 week ago',
    created: '1 week ago',
    isCurrent: false
  }
];

// Mock passkeys data
const passkeysData = [
  {
    name: 'iPhone 15 Pro',
    created: '2 weeks ago',
    lastUsed: '1 day ago'
  },
  {
    name: 'MacBook Pro',
    created: '1 month ago',
    lastUsed: '3 hours ago'
  },
  {
    name: 'iPad Air',
    created: '3 weeks ago',
    lastUsed: '1 week ago'
  }
];

// Mock API tokens data
const apiTokensData = [
  {
    name: 'Production API',
    created: '1 month ago',
    lastUsed: '2 hours ago'
  },
  {
    name: 'Development API',
    created: '2 weeks ago',
    lastUsed: '1 day ago'
  },
  {
    name: 'Testing API',
    created: '1 week ago',
    lastUsed: '3 days ago'
  }
];

// Mock webhooks data
const webhooksData = [
  {
    name: 'Contract Signed Webhook',
    url: 'https://api.example.com/webhooks/contract-signed',
    created: '2 weeks ago',
    lastUsed: '1 day ago'
  }
];

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [avatarImage, setAvatarImage] = useState<string | null>(null);
  const [userRole, setUserRole] = useState('Admin');
  const [showUserRoleDropdown, setShowUserRoleDropdown] = useState(false);
  const [defaultLanguage, setDefaultLanguage] = useState('English');
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [includeSigningCertificate, setIncludeSigningCertificate] = useState('Yes');
  const [showSigningCertificateDropdown, setShowSigningCertificateDropdown] = useState(false);
  const [defaultSignatureSettings, setDefaultSignatureSettings] = useState<string[]>(['Draw', 'Type', 'Upload']);
  const [showSignatureSettingsDropdown, setShowSignatureSettingsDropdown] = useState(false);
  const [showRecentActivity, setShowRecentActivity] = useState(false);
  const [showSessions, setShowSessions] = useState(false);
  const [showPasskeys, setShowPasskeys] = useState(false);
  const [showAddPasskeyModal, setShowAddPasskeyModal] = useState(false);
  const [showEnable2FAModal, setShowEnable2FAModal] = useState(false);
  const [passkeyName, setPasskeyName] = useState('Brave (Mac OS)');
  const [showApiTokens, setShowApiTokens] = useState(false);
  const [showAddApiTokenModal, setShowAddApiTokenModal] = useState(false);
  const [apiTokenName, setApiTokenName] = useState('');
  const [tokenNeverExpire, setTokenNeverExpire] = useState(true);
  const [showTokenExpirationDropdown, setShowTokenExpirationDropdown] = useState(false);
  const [selectedTokenExpiration, setSelectedTokenExpiration] = useState('');
  const [showWebhooks, setShowWebhooks] = useState(false);
  const [showAddWebhookModal, setShowAddWebhookModal] = useState(false);
  const [webhookName, setWebhookName] = useState('');
  const [webhookUrl, setWebhookUrl] = useState('');
  const [webhookEnabled, setWebhookEnabled] = useState(true);
  const [webhookSecret, setWebhookSecret] = useState('');
  const [webhookSecretVisible, setWebhookSecretVisible] = useState(false);
  const [webhookTriggers, setWebhookTriggers] = useState<string[]>([]);
  const [showTriggersDropdown, setShowTriggersDropdown] = useState(false);
  
  // Password visibility states
  const [currentPasswordVisible, setCurrentPasswordVisible] = useState(false);
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  const [repeatPasswordVisible, setRepeatPasswordVisible] = useState(false);
  
  // Password actual values
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  
  // Password display values (for masking)
  const [currentPasswordDisplay, setCurrentPasswordDisplay] = useState('');
  const [newPasswordDisplay, setNewPasswordDisplay] = useState('');
  const [repeatPasswordDisplay, setRepeatPasswordDisplay] = useState('');
  
  // Password input handlers
  const handleCurrentPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (currentPasswordVisible) {
      // When visible, update normally
      setCurrentPassword(inputValue);
      setCurrentPasswordDisplay(inputValue);
    } else {
      // When concealed, handle masking properly
      const currentLength = currentPassword.length;
      const inputLength = inputValue.length;
      
      if (inputLength > currentLength) {
        // Adding characters
        const newChar = inputValue.slice(-1);
        const newPassword = currentPassword + newChar;
        setCurrentPassword(newPassword);
        setCurrentPasswordDisplay(newPassword.replace(/./g, '*'));
      } else if (inputLength < currentLength) {
        // Removing characters
        const newPassword = currentPassword.slice(0, -1);
        setCurrentPassword(newPassword);
        setCurrentPasswordDisplay(newPassword.replace(/./g, '*'));
      }
    }
  };
  
  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (newPasswordVisible) {
      setNewPassword(inputValue);
      setNewPasswordDisplay(inputValue);
    } else {
      const currentLength = newPassword.length;
      const inputLength = inputValue.length;
      
      if (inputLength > currentLength) {
        const newChar = inputValue.slice(-1);
        const newPasswordValue = newPassword + newChar;
        setNewPassword(newPasswordValue);
        setNewPasswordDisplay(newPasswordValue.replace(/./g, '*'));
      } else if (inputLength < currentLength) {
        const newPasswordValue = newPassword.slice(0, -1);
        setNewPassword(newPasswordValue);
        setNewPasswordDisplay(newPasswordValue.replace(/./g, '*'));
      }
    }
  };
  
  const handleRepeatPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (repeatPasswordVisible) {
      setRepeatPassword(inputValue);
      setRepeatPasswordDisplay(inputValue);
    } else {
      const currentLength = repeatPassword.length;
      const inputLength = inputValue.length;
      
      if (inputLength > currentLength) {
        const newChar = inputValue.slice(-1);
        const newRepeatPassword = repeatPassword + newChar;
        setRepeatPassword(newRepeatPassword);
        setRepeatPasswordDisplay(newRepeatPassword.replace(/./g, '*'));
      } else if (inputLength < currentLength) {
        const newRepeatPassword = repeatPassword.slice(0, -1);
        setRepeatPassword(newRepeatPassword);
        setRepeatPasswordDisplay(newRepeatPassword.replace(/./g, '*'));
      }
    }
  };
  
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const userRoleDropdownRef = useRef<HTMLDivElement>(null);
  const languageDropdownRef = useRef<HTMLDivElement>(null);
  const signingCertificateDropdownRef = useRef<HTMLDivElement>(null);
  const signatureSettingsDropdownRef = useRef<HTMLDivElement>(null);
  const tokenExpirationDropdownRef = useRef<HTMLDivElement>(null);

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  // Handle dropdown click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      
      // Close user role dropdown if click is outside
      if (userRoleDropdownRef.current && !userRoleDropdownRef.current.contains(target)) {
        setShowUserRoleDropdown(false);
      }
      
      // Close language dropdown if click is outside
      if (languageDropdownRef.current && !languageDropdownRef.current.contains(target)) {
        setShowLanguageDropdown(false);
      }
      
      // Close signing certificate dropdown if click is outside
      if (signingCertificateDropdownRef.current && !signingCertificateDropdownRef.current.contains(target)) {
        setShowSigningCertificateDropdown(false);
      }
      
      // Close signature settings dropdown if click is outside
      if (signatureSettingsDropdownRef.current && !signatureSettingsDropdownRef.current.contains(target)) {
        setShowSignatureSettingsDropdown(false);
      }
      
      // Close token expiration dropdown if click is outside
      if (tokenExpirationDropdownRef.current && !tokenExpirationDropdownRef.current.contains(target)) {
        setShowTokenExpirationDropdown(false);
      }
    }

    // Use both mousedown and click events for better coverage
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('click', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleSignatureSettingToggle = (setting: string) => {
    setDefaultSignatureSettings(prev => 
      prev.includes(setting)
        ? prev.filter(s => s !== setting)
        : [...prev, setting]
    );
  };

  const getSignatureSettingsDisplayText = () => {
    if (defaultSignatureSettings.length === 0) return 'Select signature settings';
    return defaultSignatureSettings.join(', ');
  };

  return (
    <div className="flex h-screen">
      {/* Hidden file input for avatar upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleAvatarUpload}
        className="hidden"
      />
      
      <div className="w-64 bg-gray-50 dark:bg-gray-900 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 flex flex-col items-center mb-8 shadow-sm ml-[-6]">
          <div className="relative w-32 h-32 mb-4">
            <div className="w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center overflow-hidden">
              {avatarImage ? (
                <img 
                  src={avatarImage} 
                  alt="Profile Avatar" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <FaUser className="w-16 h-16 text-gray-400 dark:text-gray-500" />
              )}
            </div>
            <button 
              onClick={handleCameraClick}
              className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full hover:bg-primary-dark transition-colors cursor-pointer"
            >
              <TbCameraCog className="w-4 h-4" />
            </button>
          </div>
          <h3 className="text-lg font-bold text-black dark:text-white">John Doe</h3>
          <p className="text-gray-500 dark:text-gray-400 text-xs">Administrator</p>
        </div>
      </div>

      <div className="flex-1 bg-gray-50 dark:bg-gray-900">
        {/* Top Navigation Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6">
            {TABS.map(tab => (
              <button
                key={tab.key}
                className={
                  activeTab === tab.key
                    ? 'px-4 py-3 text-sm font-semibold border-b-2 border-primary text-primary'
                    : 'px-4 py-3 text-sm font-semibold text-gray-500 dark:text-gray-400'
                }
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
        <div className="p-6 space-y-6">
          {/* Page Title and Subtitle */}
          <div>
            <h1 className="text-[30px] font-bold text-black dark:text-white mb-1">Admin Settings</h1>
            <p className="text-gray-500 dark:text-gray-400 text-[16px] mt-0">Manage your account & system preferences</p>
          </div>
          {/* Tab Content */}
          {activeTab === 'profile' && (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 w-full shadow-sm">
              <h2 className="text-xl font-bold mb-4 text-black dark:text-white">Profile Information</h2>
              <p className="text-gray-600 dark:text-gray-400 text-xs mb-6">Update your personal details and contact information.</p>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-medium text-black dark:text-white mb-1">First Name</label>
                    <input type="text" className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs" placeholder="Enter your name..." />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-black dark:text-white mb-1">Last Name</label>
                                          <input type="text" className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs" placeholder="Enter last name..." />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-medium text-black dark:text-white mb-1">Email Address</label>
                                          <input type="email" className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs" placeholder="Enter your email address..." />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-black dark:text-white mb-1">Phone Number</label>
                                          <input type="text" className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs" placeholder="Enter your phone number..." />
                  </div>
                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-medium text-black dark:text-white mb-1">User Role</label>
                    <div className="relative w-full" ref={userRoleDropdownRef}>
                      <input
                        type="text"
                        className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs pr-10 cursor-pointer caret-transparent"
                        placeholder="Select a user role..."
                        value={userRole}
                        readOnly
                        onClick={() => setShowUserRoleDropdown(!showUserRoleDropdown)}
                      />
                      <HiChevronDown className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      {showUserRoleDropdown && (
                        <div className="absolute left-0 mt-1 w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 z-50 py-0.5" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                          {USER_ROLES.map(role => (
                            <button
                              key={role}
                              className={`w-full text-left px-3 py-2 text-xs font-medium ${userRole === role ? 'bg-primary/10 text-primary' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                              onClick={() => {
                                setUserRole(role);
                                setShowUserRoleDropdown(false);
                              }}
                            >
                              {role}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-black dark:text-white mb-1">Job Title</label>
                    <input type="text" className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs" placeholder="Enter your job title..." />
                  </div>
                </div>
                <div className="flex justify-end mt-4 pt-2">
                  <button 
                    type="submit" 
                    className="flex items-center justify-center w-full sm:w-auto px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-semibold mb-0"
                    style={{ fontFamily: 'Avenir, sans-serif' }}
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Change Password Card */}
          {activeTab === 'security' && (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 w-full shadow-sm">
              <h2 className="text-lg font-bold mb-4 text-black dark:text-white">Change Password</h2>
              <p className="text-gray-600 dark:text-gray-400 text-xs mb-6">Update your account password to keep your account secure</p>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <label className="text-xs font-medium text-black dark:text-white">
                        Current Password
                      </label>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setCurrentPasswordVisible(!currentPasswordVisible);
                        }}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer p-1 rounded"
                      >
                        {currentPasswordVisible ? (
                          <HiOutlineEyeOff className="h-3.5 w-3.5" />
                        ) : (
                          <HiOutlineEye className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>
                    <input 
                      type="text"
                      className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs" 
                      placeholder="Enter current password"
                      value={currentPasswordVisible ? currentPassword : currentPasswordDisplay}
                      onChange={handleCurrentPasswordChange}
                    />
                  </div>
                  <div>
                    {/* Empty right column on first row */}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <label className="text-xs font-medium text-black dark:text-white">
                        New Password
                      </label>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setNewPasswordVisible(!newPasswordVisible);
                        }}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer p-1 rounded"
                      >
                        {newPasswordVisible ? (
                          <HiOutlineEyeOff className="h-3.5 w-3.5" />
                        ) : (
                          <HiOutlineEye className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>
                    <input 
                      type="text"
                      className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs" 
                      placeholder="Enter new password"
                      value={newPasswordVisible ? newPassword : newPasswordDisplay}
                      onChange={handleNewPasswordChange}
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <label className="text-xs font-medium text-black dark:text-white">
                        Repeat Password
                      </label>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setRepeatPasswordVisible(!repeatPasswordVisible);
                        }}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer p-1 rounded"
                      >
                        {repeatPasswordVisible ? (
                          <HiOutlineEyeOff className="h-3.5 w-3.5" />
                        ) : (
                          <HiOutlineEye className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>
                    <input 
                      type="text"
                      className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs" 
                      placeholder="Repeat new password"
                      value={repeatPasswordVisible ? repeatPassword : repeatPasswordDisplay}
                      onChange={handleRepeatPasswordChange}
                    />
                  </div>
                </div>
                <div className="flex justify-end mt-4 pt-2">
                  <button 
                    type="submit" 
                    className="flex items-center justify-center w-full sm:w-auto px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-semibold mb-0"
                    style={{ fontFamily: 'Avenir, sans-serif' }}
                  >
                    Update Password
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Two Factor Authentication Card */}
          {activeTab === 'security' && (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 w-full shadow-sm">
              <h2 className="text-lg font-bold mb-4 text-black dark:text-white">Two Factor Authentication</h2>
              <p className="text-gray-600 dark:text-gray-400 text-xs mb-6">Add an extra layer of security to your account by enabling two-factor authentication</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center border-2 border-gray-200 dark:border-gray-600">
                    <PiLockKeyBold size={20} className="text-gray-600 dark:text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">2FA is currently disabled</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Enable two-factor authentication for enhanced security</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowEnable2FAModal(true)}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-semibold"
                >
                  Enable 2FA
                </button>
              </div>
            </div>
          )}

          {/* Passkeys Card */}
          {activeTab === 'security' && (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 w-full shadow-sm">
              <h2 className="text-lg font-bold mb-4 text-black dark:text-white">Passkeys</h2>
              <p className="text-gray-600 dark:text-gray-400 text-xs mb-6">Use passkeys for secure, passwordless authentication across your devices</p>
              {!showPasskeys && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center border-2 border-gray-200 dark:border-gray-600">
                      <HiOutlineKey size={20} className="text-gray-600 dark:text-gray-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{passkeysData.length} passkeys configured</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Manage your passkeys across devices</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowPasskeys(!showPasskeys)}
                    className="flex items-center gap-2 px-5 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer" style={{ fontFamily: 'Avenir, sans-serif' }}
                  >
                    Manage Passkeys
                  </button>
                </div>
              )}
              
              {showPasskeys && (
                <div className="flex justify-end mb-4">
                  <div className="flex flex-col gap-2">
                    <button 
                      onClick={() => setShowPasskeys(!showPasskeys)}
                      className="flex items-center gap-2 px-5 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                      style={{ fontFamily: 'Avenir, sans-serif' }}
                    >
                      Hide Passkeys
                    </button>
                    <button 
                      onClick={() => setShowAddPasskeyModal(true)}
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-semibold"
                      style={{ fontFamily: 'Avenir, sans-serif' }}
                    >
                      Add Passkey
                    </button>
                  </div>
                </div>
              )}
              
              {showPasskeys && (
                <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div className="overflow-x-auto overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar]:h-3 [&::-webkit-scrollbar-track]:bg-gray-50 [&::-webkit-scrollbar-track]:dark:bg-gray-700 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:dark:bg-gray-600 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-gray-400 [&::-webkit-scrollbar-thumb:hover]:dark:bg-gray-500 [&::-webkit-scrollbar-corner]:bg-gray-50 [&::-webkit-scrollbar-corner]:dark:bg-gray-700">
                    <table className="w-full">
                      <thead className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-2/5">Name</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-2/5">Created</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-1/5">Last Used</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {passkeysData.map((passkey, index) => (
                          <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-900 dark:text-white w-2/5">{passkey.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-900 dark:text-white w-2/5">{passkey.created}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-900 dark:text-white w-1/5">{passkey.lastUsed}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 px-6 py-3 border-t border-gray-200 dark:border-gray-600">
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-700 dark:text-gray-300">
                        Showing {passkeysData.length} passkeys.
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-700 dark:text-gray-300">Rows per page</span>
                          <div className="relative">
                            <select className="text-xs border border-gray-300 dark:border-gray-600 rounded px-2 py-1 pr-6 bg-white dark:bg-gray-800 text-gray-900 dark:text-white appearance-none">
                              <option>10</option>
                              <option>20</option>
                            </select>
                            <div className="absolute inset-y-0 right-1 flex items-center pointer-events-none">
                              <HiChevronDown className="w-3 h-3 text-gray-400" />
                            </div>
                          </div>
                        </div>
                        <div className="text-xs text-gray-700 dark:text-gray-300">
                          Page 1 of 1
                        </div>
                        <div className="flex space-x-1">
                          <button className="p-1 text-gray-400 cursor-not-allowed">
                            <HiOutlineChevronDoubleLeft className="w-3 h-3" />
                          </button>
                          <button className="p-1 text-gray-400 cursor-not-allowed">
                            <HiOutlineChevronDoubleLeft className="w-3 h-3 rotate-180" />
                          </button>
                          <button className="p-1 text-gray-400 cursor-not-allowed">
                            <HiOutlineChevronDoubleRight className="w-3 h-3 rotate-180" />
                          </button>
                          <button className="p-1 text-gray-400 cursor-not-allowed">
                            <HiOutlineChevronDoubleRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Recent Activity Card */}
          {activeTab === 'security' && (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 w-full shadow-sm">
              <h2 className="text-lg font-bold mb-4 text-black dark:text-white">Recent Activity</h2>
              <p className="text-gray-600 dark:text-gray-400 text-xs mb-6">Monitor your recent account activity & login attempts</p>
              {!showRecentActivity && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                                      <div className="h-10 w-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center border-2 border-gray-200 dark:border-gray-600">
                    <TbActivity size={20} className="text-gray-600 dark:text-gray-400" />
                  </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">No recent activity</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">View your account activity history</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowRecentActivity(!showRecentActivity)}
                    className="flex items-center gap-2 px-5 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                    style={{ fontFamily: 'Avenir, sans-serif' }}
                  >
                    View Activity
                  </button>
                </div>
              )}
              
              {showRecentActivity && (
                <div className="flex justify-end mb-4">
                  <button 
                    onClick={() => setShowRecentActivity(!showRecentActivity)}
                    className="flex items-center gap-2 px-5 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                    style={{ fontFamily: 'Avenir, sans-serif' }}
                  >
                    Hide Activity
                  </button>
                </div>
              )}
              
              {showRecentActivity && (
                <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div className="overflow-x-auto overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar]:h-3 [&::-webkit-scrollbar-track]:bg-gray-50 [&::-webkit-scrollbar-track]:dark:bg-gray-700 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:dark:bg-gray-600 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-gray-400 [&::-webkit-scrollbar-thumb:hover]:dark:bg-gray-500 [&::-webkit-scrollbar-corner]:bg-gray-50 [&::-webkit-scrollbar-corner]:dark:bg-gray-700">
                    <table className="w-full">
                      <thead className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Device</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Browser</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">IP Address</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Action</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {recentActivityData.map((activity, index) => (
                          <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-900 dark:text-white">{activity.date}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-900 dark:text-white">{activity.device}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-900 dark:text-white">{activity.browser}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-900 dark:text-white">{activity.ipAddress}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-900 dark:text-white">{activity.action}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 px-6 py-3 border-t border-gray-200 dark:border-gray-600">
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-700 dark:text-gray-300">
                        Showing {recentActivityData.length} results.
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-700 dark:text-gray-300">Rows per page</span>
                          <div className="relative">
                            <select className="text-xs border border-gray-300 dark:border-gray-600 rounded px-2 py-1 pr-6 bg-white dark:bg-gray-800 text-gray-900 dark:text-white appearance-none">
                              <option>10</option>
                              <option>20</option>
                            </select>
                            <div className="absolute inset-y-0 right-1 flex items-center pointer-events-none">
                              <HiChevronDown className="w-3 h-3 text-gray-400" />
                            </div>
                          </div>
                        </div>
                        <div className="text-xs text-gray-700 dark:text-gray-300">
                          Page 1 of 1
                        </div>
                        <div className="flex space-x-1">
                          <button className="p-1 text-gray-400 cursor-not-allowed">
                            <HiOutlineChevronDoubleLeft className="w-3 h-3" />
                          </button>
                          <button className="p-1 text-gray-400 cursor-not-allowed">
                            <HiOutlineChevronDoubleLeft className="w-3 h-3 rotate-180" />
                          </button>
                          <button className="p-1 text-gray-400 cursor-not-allowed">
                            <HiOutlineChevronDoubleRight className="w-3 h-3 rotate-180" />
                          </button>
                          <button className="p-1 text-gray-400 cursor-not-allowed">
                            <HiOutlineChevronDoubleRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Active Sessions Card */}
          {activeTab === 'security' && (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 w-full shadow-sm">
              <h2 className="text-lg font-bold mb-4 text-black dark:text-white">Active Sessions</h2>
              <p className="text-gray-600 dark:text-gray-400 text-xs mb-6">View & manage active sessions across different devices</p>
              {!showSessions && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                                      <div className="h-10 w-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center border-2 border-gray-200 dark:border-gray-600">
                    <PiPowerBold size={20} className="text-gray-600 dark:text-gray-400" />
                  </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">3 active sessions</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Manage your active sessions across devices</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowSessions(!showSessions)}
                    className="flex items-center gap-2 px-5 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                    style={{ fontFamily: 'Avenir, sans-serif' }}
                  >
                    Manage Sessions
                  </button>
                </div>
              )}
              
              {showSessions && (
                <div className="flex justify-end mb-4">
                  <div className="flex flex-col gap-2">
                    <button 
                      type="button" 
                      onClick={() => setShowSessions(!showSessions)}
                      className="flex items-center gap-2 px-5 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                      style={{ fontFamily: 'Avenir, sans-serif' }}
                    >
                      Hide Sessions
                    </button>
                    <button 
                      type="button" 
                      className="flex items-center justify-center w-full sm:w-auto px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-semibold mb-0"
                      style={{ fontFamily: 'Avenir, sans-serif' }}
                    >
                      Revoke All
                    </button>
                  </div>
                </div>
              )}
              
              {showSessions && (
                <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div className="overflow-x-auto overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar]:h-3 [&::-webkit-scrollbar-track]:bg-gray-50 [&::-webkit-scrollbar-track]:dark:bg-gray-700 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:dark:bg-gray-600 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-gray-400 [&::-webkit-scrollbar-thumb:hover]:dark:bg-gray-500 [&::-webkit-scrollbar-corner]:bg-gray-50 [&::-webkit-scrollbar-corner]:dark:bg-gray-700">
                    <table className="w-full">
                      <thead className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Device</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">IP Address</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Last Active</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Created</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Action</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {sessionsData.map((session, index) => (
                          <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-900 dark:text-white">
                              <div className="flex items-center gap-2">
                                <span>{session.device}</span>
                                {session.isCurrent && (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                    Current
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-900 dark:text-white">{session.ipAddress}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-900 dark:text-white">{session.lastActive}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-900 dark:text-white">{session.created}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-900 dark:text-white">
                              <div className="pl-2">
                                <button className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 dark:text-gray-300 hover:border-red-500 hover:text-red-500 transition-colors bg-transparent dark:bg-gray-800 dark:hover:border-red-500 dark:hover:text-red-500 relative group">
                                  <PiEjectBold className="h-4 w-4 transition-colors" />
                                  <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-gray-200 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                                    Revoke
                                  </span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 px-6 py-3 border-t border-gray-200 dark:border-gray-600">
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-700 dark:text-gray-300">
                        Showing {sessionsData.length} sessions.
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-700 dark:text-gray-300">Rows per page</span>
                          <div className="relative">
                            <select className="text-xs border border-gray-300 dark:border-gray-600 rounded px-2 py-1 pr-6 bg-white dark:bg-gray-800 text-gray-900 dark:text-white appearance-none">
                              <option>10</option>
                              <option>20</option>
                            </select>
                            <div className="absolute inset-y-0 right-1 flex items-center pointer-events-none">
                              <HiChevronDown className="w-3 h-3 text-gray-400" />
                            </div>
                          </div>
                        </div>
                        <div className="text-xs text-gray-700 dark:text-gray-300">
                          Page 1 of 1
                        </div>
                        <div className="flex space-x-1">
                          <button className="p-1 text-gray-400 cursor-not-allowed">
                            <HiOutlineChevronDoubleLeft className="w-3 h-3" />
                          </button>
                          <button className="p-1 text-gray-400 cursor-not-allowed">
                            <HiOutlineChevronDoubleLeft className="w-3 h-3 rotate-180" />
                          </button>
                          <button className="p-1 text-gray-400 cursor-not-allowed">
                            <HiOutlineChevronDoubleRight className="w-3 h-3 rotate-180" />
                          </button>
                          <button className="p-1 text-gray-400 cursor-not-allowed">
                            <HiOutlineChevronDoubleRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Preferences Box */}
          {activeTab === 'profile' && (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 w-full shadow-sm">
              <h2 className="text-xl font-bold mb-4 text-black dark:text-white">Preferences</h2>
              <p className="text-gray-600 dark:text-gray-400 text-xs mb-6">Customize your account preferences and settings.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-black dark:text-white mb-1">Default Language</label>
                    <div className="relative w-full" ref={languageDropdownRef}>
                      <input
                        type="text"
                        className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs pr-10 cursor-pointer caret-transparent"
                        placeholder="Select default language"
                        value={defaultLanguage}
                        readOnly
                        onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                      />
                      <HiChevronDown className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      {showLanguageDropdown && (
                        <div className="absolute left-0 mt-1 w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 z-50 py-0.5" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                          {DOCUMENT_LANGUAGES.map(language => (
                            <button
                              key={language}
                              className={`w-full text-left px-3 py-2 text-xs font-medium ${defaultLanguage === language ? 'bg-primary/10 text-primary' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                              onClick={() => {
                                setDefaultLanguage(language);
                                setShowLanguageDropdown(false);
                              }}
                            >
                              {language}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-black dark:text-white mb-1">Include Signing Certificate in Envelope</label>
                    <div className="relative w-full" ref={signingCertificateDropdownRef}>
                      <input
                        type="text"
                        className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs pr-10 cursor-pointer caret-transparent"
                        placeholder="Select option"
                        value={includeSigningCertificate}
                        readOnly
                        onClick={() => setShowSigningCertificateDropdown(!showSigningCertificateDropdown)}
                      />
                      <HiChevronDown className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      {showSigningCertificateDropdown && (
                        <div className="absolute left-0 mt-1 w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 z-50 py-0.5" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                          {SIGNING_CERTIFICATE_OPTIONS.map(option => (
                            <button
                              key={option}
                              className={`w-full text-left px-3 py-2 text-xs font-medium ${includeSigningCertificate === option ? 'bg-primary/10 text-primary' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                              onClick={() => {
                                setIncludeSigningCertificate(option);
                                setShowSigningCertificateDropdown(false);
                              }}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-black dark:text-white mb-1">Signature Options</label>
                  <div className="relative w-full" ref={signatureSettingsDropdownRef}>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs pr-10 cursor-pointer caret-transparent"
                      placeholder="Select signature settings"
                      value={getSignatureSettingsDisplayText()}
                      readOnly
                      onClick={() => setShowSignatureSettingsDropdown(!showSignatureSettingsDropdown)}
                    />
                    <HiChevronDown className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    {showSignatureSettingsDropdown && (
                      <div className="absolute left-0 mt-1 w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 z-50 py-0.5" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                        {SIGNATURE_SETTINGS.map(setting => (
                          <button
                            key={setting}
                            className={`w-full text-left px-3 py-2 text-xs font-medium flex items-center ${defaultSignatureSettings.includes(setting) ? 'bg-primary/10 text-primary' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                            onClick={() => handleSignatureSettingToggle(setting)}
                          >
                            <div className="w-4 h-4 border border-gray-300 rounded mr-2 flex items-center justify-center">
                              {defaultSignatureSettings.includes(setting) && (
                                <div className="w-3 h-3 bg-primary rounded-sm flex items-center justify-center">
                                  <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                </div>
                              )}
                            </div>
                            {setting}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex justify-end mt-6">
                <button 
                  type="button" 
                  className="flex items-center justify-center w-full sm:w-auto px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-semibold mb-0"
                  style={{ fontFamily: 'Avenir, sans-serif' }}
                >
                  Save
                </button>
              </div>
            </div>
          )}

          {/* Sign Out Box */}
          {activeTab === 'profile' && (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 w-full shadow-sm">
              <h2 className="text-xl font-bold mb-4 text-black dark:text-white">Sign Out</h2>
              <p className="text-gray-600 dark:text-gray-400 text-xs mb-6">Sign out of your account and return to the login page.</p>
              <div className="flex justify-end">
                <button 
                  type="button" 
                  className="flex items-center gap-2 px-5 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                  style={{ fontFamily: 'Avenir, sans-serif' }}
                >
                  Sign Out
                </button>
              </div>
            </div>
          )}

          {/* Delete Account Box */}
          {activeTab === 'profile' && (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 w-full shadow-sm">
              <h2 className="text-xl font-bold mb-4 text-black dark:text-white">Delete Account</h2>
              <p className="text-gray-600 dark:text-gray-400 text-xs mb-6">Delete your account and all its contents, including completed documents. This action is irreversible and will cancel your subscription, so proceed with caution</p>
              <div className="flex justify-end">
                <button 
                  type="button" 
                  className="flex items-center justify-center w-full sm:w-auto px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-semibold mb-0"
                  style={{ fontFamily: 'Avenir, sans-serif' }}
                >
                  Delete Account
                </button>
              </div>
            </div>
          )}
          {activeTab === 'api' && (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 w-full shadow-sm">
              <h2 className="text-lg font-bold mb-4 text-black dark:text-white">API Tokens</h2>
              <p className="text-gray-600 dark:text-gray-400 text-xs mb-6">Create & manage API tokens for secure access to your account</p>
              {!showApiTokens && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center border-2 border-gray-200 dark:border-gray-600">
                      <MdOutlineGeneratingTokens size={20} className="text-gray-600 dark:text-gray-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{apiTokensData.length} API tokens configured</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Manage your API tokens for secure access</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowApiTokens(!showApiTokens)}
                    className="flex items-center gap-2 px-5 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer" style={{ fontFamily: 'Avenir, sans-serif' }}
                  >
                    Manage Tokens
                  </button>
                </div>
              )}
              
              {showApiTokens && (
                <div className="flex justify-end mb-4">
                  <div className="flex flex-col gap-2">
                    <button 
                      onClick={() => setShowApiTokens(!showApiTokens)}
                      className="flex items-center gap-2 px-5 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                      style={{ fontFamily: 'Avenir, sans-serif' }}
                    >
                      Hide Tokens
                    </button>
                    <button 
                      onClick={() => setShowAddApiTokenModal(true)}
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-semibold"
                      style={{ fontFamily: 'Avenir, sans-serif' }}
                    >
                      Add Token
                    </button>
                  </div>
                </div>
              )}
              
              {showApiTokens && (
                <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div className="overflow-x-auto overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar]:h-3 [&::-webkit-scrollbar-track]:bg-gray-50 [&::-webkit-scrollbar-track]:dark:bg-gray-700 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:dark:bg-gray-600 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-gray-400 [&::-webkit-scrollbar-thumb:hover]:dark:bg-gray-500 [&::-webkit-scrollbar-corner]:bg-gray-50 [&::-webkit-scrollbar-corner]:dark:bg-gray-700">
                    <table className="w-full">
                      <thead className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-2/5">Token Name</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-2/5">Created</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-1/5">Last Used</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {apiTokensData.map((token, index) => (
                          <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-900 dark:text-white w-2/5">{token.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-900 dark:text-white w-2/5">{token.created}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-900 dark:text-white w-1/5">{token.lastUsed}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 px-6 py-3 border-t border-gray-200 dark:border-gray-600">
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-700 dark:text-gray-300">
                        Showing {apiTokensData.length} API tokens.
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-700 dark:text-gray-300">Rows per page</span>
                          <div className="relative">
                            <select className="text-xs border border-gray-300 dark:border-gray-600 rounded px-2 py-1 pr-6 bg-white dark:bg-gray-800 text-gray-900 dark:text-white appearance-none">
                              <option>10</option>
                              <option>20</option>
                            </select>
                            <div className="absolute inset-y-0 right-1 flex items-center pointer-events-none">
                              <HiChevronDown className="w-3 h-3 text-gray-400" />
                            </div>
                          </div>
                        </div>
                        <div className="text-xs text-gray-700 dark:text-gray-300">
                          Page 1 of 1
                        </div>
                        <div className="flex space-x-1">
                          <button className="p-1 text-gray-400 cursor-not-allowed">
                            <HiOutlineChevronDoubleLeft className="w-3 h-3" />
                          </button>
                          <button className="p-1 text-gray-400 cursor-not-allowed">
                            <HiOutlineChevronDoubleLeft className="w-3 h-3 rotate-180" />
                          </button>
                          <button className="p-1 text-gray-400 cursor-not-allowed">
                            <HiOutlineChevronDoubleRight className="w-3 h-3 rotate-180" />
                          </button>
                          <button className="p-1 text-gray-400 cursor-not-allowed">
                            <HiOutlineChevronDoubleRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'webhooks' && (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 w-full shadow-sm">
              <h2 className="text-lg font-bold mb-4 text-black dark:text-white">Webhooks</h2>
              <p className="text-gray-600 dark:text-gray-400 text-xs mb-6">Create new webhooks & manage existing ones</p>
              {!showWebhooks && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center border-2 border-gray-200 dark:border-gray-600">
                      <MdWebhook size={20} className="text-gray-600 dark:text-gray-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{webhooksData.length} webhooks configured</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Manage your webhooks for secure notifications</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowWebhooks(!showWebhooks)}
                    className="flex items-center gap-2 px-5 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer" style={{ fontFamily: 'Avenir, sans-serif' }}
                  >
                    Manage Webhooks
                  </button>
                </div>
              )}
              
              {showWebhooks && (
                <div className="flex justify-end mb-4">
                  <div className="flex flex-col gap-2">
                    <button 
                      onClick={() => setShowWebhooks(!showWebhooks)}
                      className="flex items-center gap-2 px-5 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                      style={{ fontFamily: 'Avenir, sans-serif' }}
                    >
                      Hide Webhooks
                    </button>
                    <button 
                      onClick={() => setShowAddWebhookModal(true)}
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-semibold"
                      style={{ fontFamily: 'Avenir, sans-serif' }}
                    >
                      Add Webhook
                    </button>
                  </div>
                </div>
              )}
              
              {showWebhooks && (
                <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div className="overflow-x-auto overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar]:h-3 [&::-webkit-scrollbar-track]:bg-gray-50 [&::-webkit-scrollbar-track]:dark:bg-gray-700 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:dark:bg-gray-600 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-gray-400 [&::-webkit-scrollbar-thumb:hover]:dark:bg-gray-500 [&::-webkit-scrollbar-corner]:bg-gray-50 [&::-webkit-scrollbar-corner]:dark:bg-gray-700">
                    <table className="w-full">
                      <thead className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-2/5">Webhook Name</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-2/5">URL</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-1/5">Created</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-1/5">Last Used</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {webhooksData.map((webhook, index) => (
                          <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-900 dark:text-white w-2/5">{webhook.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-900 dark:text-white w-2/5">{webhook.url}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-900 dark:text-white w-1/5">{webhook.created}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-900 dark:text-white w-1/5">{webhook.lastUsed}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 px-6 py-3 border-t border-gray-200 dark:border-gray-600">
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-700 dark:text-gray-300">
                        Showing {webhooksData.length} webhooks.
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-700 dark:text-gray-300">Rows per page</span>
                          <div className="relative">
                            <select className="text-xs border border-gray-300 dark:border-gray-600 rounded px-2 py-1 pr-6 bg-white dark:bg-gray-800 text-gray-900 dark:text-white appearance-none">
                              <option>10</option>
                              <option>20</option>
                            </select>
                            <div className="absolute inset-y-0 right-1 flex items-center pointer-events-none">
                              <HiChevronDown className="w-3 h-3 text-gray-400" />
                            </div>
                          </div>
                        </div>
                        <div className="text-xs text-gray-700 dark:text-gray-300">
                          Page 1 of 1
                        </div>
                        <div className="flex space-x-1">
                          <button className="p-1 text-gray-400 cursor-not-allowed">
                            <HiOutlineChevronDoubleLeft className="w-3 h-3" />
                          </button>
                          <button className="p-1 text-gray-400 cursor-not-allowed">
                            <HiOutlineChevronDoubleLeft className="w-3 h-3 rotate-180" />
                          </button>
                          <button className="p-1 text-gray-400 cursor-not-allowed">
                            <HiOutlineChevronDoubleRight className="w-3 h-3 rotate-180" />
                          </button>
                          <button className="p-1 text-gray-400 cursor-not-allowed">
                            <HiOutlineChevronDoubleRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {activeTab !== 'profile' && activeTab !== 'api' && activeTab !== 'webhooks' && activeTab !== 'security' && (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 w-full shadow-sm">
              <h2 className="text-xl font-bold mb-4 text-black dark:text-white">{TABS.find(tab => tab.key === activeTab)?.label} (Placeholder)</h2>
              <p className="text-gray-600 dark:text-gray-400 text-xs">Content for the {TABS.find(tab => tab.key === activeTab)?.label} tab will go here.</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Passkey Modal */}
      {showAddPasskeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 cursor-default select-none">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-6 cursor-default select-none">
            <div className="flex justify-between items-center mb-4 cursor-default select-none">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white cursor-default select-none">Add Passkey</h2>
              <button
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
                onClick={() => setShowAddPasskeyModal(false)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="mb-6 cursor-default select-none">
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 cursor-default select-none">
                Passkeys allow you to sign in and authenticate using biometrics, password managers, etc.
              </p>
              
              <div className="mb-6 cursor-default select-none">
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 cursor-default select-none">
                  Passkey Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={passkeyName}
                  onChange={(e) => setPasskeyName(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs"
                  placeholder="Enter passkey name..."
                />
              </div>
              
              <div className="space-y-3 cursor-default select-none">
                <p className="text-gray-600 dark:text-gray-400 text-sm cursor-default select-none">
                  When you click continue, you will be prompted to add the first available authenticator on your system.
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-sm cursor-default select-none">
                  If you do not want to use the authenticator prompted, you can close it, which will then display the next available authenticator.
                </p>
              </div>
            </div>
            
            <div className="flex justify-end gap-1 cursor-default select-none">
              <button
                onClick={() => setShowAddPasskeyModal(false)}
                className="px-5 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-semibold"
                style={{ fontFamily: 'Avenir, sans-serif' }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Handle add passkey logic here
                  setShowAddPasskeyModal(false);
                }}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-semibold"
                style={{ fontFamily: 'Avenir, sans-serif' }}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add API Token Modal */}
      {showAddApiTokenModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 cursor-default select-none">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-6 cursor-default select-none">
            <div className="flex justify-between items-center mb-4 cursor-default select-none">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white cursor-default select-none">Create New Token</h2>
              <button
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
                onClick={() => setShowAddApiTokenModal(false)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="mb-6 cursor-default select-none">
              <div className="mb-6 cursor-default select-none">
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 cursor-default select-none">
                  Token Name
                </label>
                <input
                  type="text"
                  value={apiTokenName}
                  onChange={(e) => setApiTokenName(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs"
                  placeholder="Enter new token name..."
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 italic cursor-default select-none">
                  Please enter a meaningful name for your token. This will help you identify it later.
                </p>
              </div>
              
              <div className="mb-6 cursor-default select-none">
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 cursor-default select-none">
                    Token Expiration Date
                  </label>
                  <div className="flex items-center gap-2 -mt-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400 cursor-default select-none">Never expire</span>
                    <button
                      type="button"
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                        tokenNeverExpire ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-600'
                      }`}
                      onClick={() => setTokenNeverExpire(!tokenNeverExpire)}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          tokenNeverExpire ? 'translate-x-5' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
                <div className="relative" ref={tokenExpirationDropdownRef}>
                  <input
                    type="text"
                    className={`w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs pr-10 cursor-pointer caret-transparent ${tokenNeverExpire ? 'opacity-50 cursor-not-allowed' : ''}`}
                    placeholder="Select expiration date..."
                    value={selectedTokenExpiration}
                    readOnly
                    disabled={tokenNeverExpire}
                    onClick={() => !tokenNeverExpire && setShowTokenExpirationDropdown(!showTokenExpirationDropdown)}
                  />
                  <HiChevronDown className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  {showTokenExpirationDropdown && !tokenNeverExpire && (
                    <div className="absolute left-0 mt-1 w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 z-50 py-0.5" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                      {['1 day', '7 days', '30 days', '90 days', '1 year'].map(option => (
                        <button
                          key={option}
                          className={`w-full text-left px-3 py-2 text-xs font-medium ${selectedTokenExpiration === option ? 'bg-primary/10 text-primary' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                          onClick={() => {
                            setSelectedTokenExpiration(option);
                            setShowTokenExpirationDropdown(false);
                          }}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-1 cursor-default select-none">
              <button
                onClick={() => setShowAddApiTokenModal(false)}
                className="px-5 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-semibold"
                style={{ fontFamily: 'Avenir, sans-serif' }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Handle create token logic here
                  setShowAddApiTokenModal(false);
                }}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-semibold"
                style={{ fontFamily: 'Avenir, sans-serif' }}
                              >
                Create Token
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Enable 2FA Modal */}
      {showEnable2FAModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 cursor-default select-none">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-6 cursor-default select-none">
            <div className="flex justify-between items-center mb-4 cursor-default select-none">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white cursor-default select-none">Enable Authenticator App</h2>
              <button
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
                onClick={() => setShowEnable2FAModal(false)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="mb-6 cursor-default select-none">
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 cursor-default select-none">
                To enable two-factor authentication, scan the following QR code using your authenticator app.
              </p>
              
              {/* QR Code Placeholder */}
              <div className="flex justify-center mb-6 cursor-default select-none">
                <div className="w-48 h-48 bg-white dark:bg-gray-900 rounded-lg flex items-center justify-center border-2 border-gray-200 dark:border-gray-600">
                  <span className="text-gray-500 dark:text-gray-400 text-sm">QR Code</span>
                </div>
              </div>
              
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-2 cursor-default select-none">
                If your authenticator app does not support QR codes, you can use the following code instead:
              </p>
              
              {/* Manual Code Field */}
              <div className="mb-6 cursor-default select-none">
                <input
                  type="text"
                  value="QIBXOTPMRVTTXMN6"
                  readOnly
                  className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg text-xs font-mono"
                />
              </div>
              
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 cursor-default select-none">
                Once you have scanned the QR code or entered the code manually, enter the code provided by your authenticator app below.
              </p>
              
              {/* Token Input Fields */}
              <div className="mb-6 cursor-default select-none">
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 cursor-default select-none">
                  Token
                </label>
                <div className="flex gap-2 justify-center">
                  {[1, 2, 3, 4, 5, 6].map((digit) => (
                    <input
                      key={digit}
                      type="text"
                      maxLength={1}
                      className="w-12 h-12 text-center border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-lg font-semibold"
                      placeholder=""
                    />
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-1 cursor-default select-none">
              <button
                onClick={() => setShowEnable2FAModal(false)}
                className="px-5 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-semibold"
                style={{ fontFamily: 'Avenir, sans-serif' }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Handle enable 2FA logic here
                  setShowEnable2FAModal(false);
                }}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-semibold"
                style={{ fontFamily: 'Avenir, sans-serif' }}
              >
                Enable 2FA
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Webhook Modal */}
      {showAddWebhookModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 cursor-default select-none">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg p-6 cursor-default select-none">
            <div className="flex justify-between items-start mb-4 cursor-default select-none">
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white cursor-default select-none">Create webhook</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 cursor-default select-none">On this page, you can create a new webhook.</p>
              </div>
              <button
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
                onClick={() => setShowAddWebhookModal(false)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-6 cursor-default select-none">
              {/* Webhook URL Section */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-medium text-gray-900 dark:text-white cursor-default select-none">
                    Webhook URL *
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-900 dark:text-white cursor-default select-none">Enabled</span>
                    <button
                      type="button"
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                        webhookEnabled ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-600'
                      }`}
                      onClick={() => setWebhookEnabled(!webhookEnabled)}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          webhookEnabled ? 'translate-x-5' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
                <input
                  type="url"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs"
                  placeholder="https://your-domain.com/webhook-endpoint"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 cursor-default select-none">
                  URL for where Escra will send webhook events
                </p>
              </div>
              
              {/* Triggers Section */}
              <div>
                <label className="block text-xs font-medium text-gray-900 dark:text-white mb-1 cursor-default select-none">
                  Triggers *
                </label>
                <div className="relative" ref={tokenExpirationDropdownRef}>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs pr-10 cursor-pointer caret-transparent"
                    placeholder="Select triggers"
                    value={webhookTriggers.length === 0 ? '' : webhookTriggers.join(', ')}
                    readOnly
                    onClick={() => setShowTriggersDropdown(!showTriggersDropdown)}
                  />
                  <HiChevronDown className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  {showTriggersDropdown && (
                    <div className="absolute left-0 mt-1 w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 z-50 py-0.5 max-h-48 overflow-y-auto">
                      {WEBHOOK_TRIGGERS.map(trigger => (
                        <button
                          key={trigger}
                          className={`w-full text-left px-3 py-2 text-xs font-medium flex items-center ${webhookTriggers.includes(trigger) ? 'bg-primary/10 text-primary' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                          onClick={() => {
                            setWebhookTriggers(prev => 
                              prev.includes(trigger)
                                ? prev.filter(t => t !== trigger)
                                : [...prev, trigger]
                            );
                          }}
                        >
                          <div className="w-4 h-4 border border-gray-300 rounded mr-2 flex items-center justify-center">
                            {webhookTriggers.includes(trigger) && (
                              <div className="w-3 h-3 bg-primary rounded-sm flex items-center justify-center">
                                <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                            )}
                          </div>
                          {trigger}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 cursor-default select-none">
                  Events that will trigger a webhook be sent to your URL
                </p>
              </div>
              
              {/* Secret Section */}
              <div>
                <label className="block text-xs font-medium text-gray-900 dark:text-white mb-1 cursor-default select-none">
                  Secret
                </label>
                <div className="relative">
                  <input
                    type={webhookSecretVisible ? 'text' : 'password'}
                    value={webhookSecret}
                    onChange={(e) => setWebhookSecret(e.target.value)}
                    className="w-full px-4 py-2 pr-10 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs"
                    placeholder="Enter secret (optional)"
                  />
                  <button
                    type="button"
                    onClick={() => setWebhookSecretVisible(!webhookSecretVisible)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer p-1 rounded"
                  >
                    {webhookSecretVisible ? (
                      <HiOutlineEyeOff className="h-3.5 w-3.5" />
                    ) : (
                      <HiOutlineEye className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 cursor-default select-none">
                  A secret that will be sent to your URL & used to verify the request has been sent by Escra
                </p>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-8 cursor-default select-none">
              <button
                onClick={() => setShowAddWebhookModal(false)}
                className="px-5 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-semibold"
                style={{ fontFamily: 'Avenir, sans-serif' }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Handle create webhook logic here
                  setShowAddWebhookModal(false);
                }}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-semibold"
                style={{ fontFamily: 'Avenir, sans-serif' }}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}