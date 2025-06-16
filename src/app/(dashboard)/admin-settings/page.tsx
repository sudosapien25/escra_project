'use client';

import React, { useState } from 'react';
import { FaUser, FaCamera } from 'react-icons/fa';

const TABS = [
  { key: 'profile', label: 'Profile' },
  { key: 'company', label: 'Company' },
  { key: 'security', label: 'Security' },
  { key: 'notifications', label: 'Notifications' },
  { key: 'integrations', label: 'Integrations' },
  { key: 'billing', label: 'Billing' },
];

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="flex h-screen">
      <div className="w-64 bg-white p-4">
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center mb-8 border border-gray-200 ml-[-6]">
          <div className="relative w-32 h-32 mb-4">
            <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center">
              <FaUser className="w-16 h-16 text-gray-400" />
            </div>
            <button className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full hover:bg-primary-dark">
              <FaCamera className="w-4 h-4" />
            </button>
          </div>
          <h3 className="text-lg font-bold text-black">John Doe</h3>
          <p className="text-gray-500 text-xs">Administrator</p>
        </div>
      </div>

      <div className="flex-1 bg-gray-50">
        {/* Top Navigation Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {TABS.map(tab => (
              <button
                key={tab.key}
                className={
                  activeTab === tab.key
                    ? 'px-4 py-3 text-sm font-semibold border-b-2 border-primary text-primary'
                    : 'px-4 py-3 text-sm font-semibold text-gray-500'
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
            <h1 className="text-[30px] font-bold text-black mb-1">Admin Settings</h1>
            <p className="text-gray-500 text-[16px] mt-0">Manage your account and system preferences</p>
          </div>
          {/* Tab Content */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-lg shadow p-6 w-full">
              <h2 className="text-xl font-bold mb-4 text-black">Profile Information</h2>
              <p className="text-gray-600 text-xs mb-6">Update your personal details and contact information.</p>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <input type="text" className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs" placeholder="John Doe" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input type="text" className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs" placeholder="Doe" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input type="email" className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs" placeholder="john.doe@email.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input type="text" className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs" placeholder="(555) 123-4567" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                  <input type="text" className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs" placeholder="Administrator" />
                </div>
                <div className="flex justify-end">
                  <button type="submit" className="bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-6 rounded-lg">Save Changes</button>
                </div>
              </form>
            </div>
          )}
          {activeTab !== 'profile' && (
            <div className="bg-white rounded-lg shadow p-6 w-full">
              <h2 className="text-xl font-bold mb-4 text-black">{TABS.find(tab => tab.key === activeTab)?.label} (Placeholder)</h2>
              <p className="text-gray-600 text-xs">Content for the {TABS.find(tab => tab.key === activeTab)?.label} tab will go here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}