'use client';

import React, { useState } from 'react';
import { Tabs, TabList, TabButton, TabPanel } from '@/components/common/Tabs';
import { Tabs_new } from '@/components/common/Tabs_new';
import { Logo } from '@/components/common/Logo';

export default function TestTabsPage() {
  // State for the new Tabs component
  const [activeTab, setActiveTab] = useState('tab1');
  const [escraTab, setEscraTab] = useState('tab1');

  const tabs = [
    { label: 'Tab 1', value: 'tab1' },
    { label: 'Tab 2', value: 'tab2' },
    { label: 'Tab 3', value: 'tab3', disabled: true },
  ];

  const escraTabs = [
    { key: 'tab1', label: 'Tab 1' },
    { key: 'tab2', label: 'Tab 2' },
    { key: 'tab3', label: 'Tab 3' },
    { key: 'tab4', label: 'Tab 4' },
  ];

  return (
    <div className="p-8 space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Original Tabs Component</h2>
        <Tabs defaultValue="tab1">
          <TabList>
            <TabButton tab="tab1">Tab 1</TabButton>
            <TabButton tab="tab2">Tab 2</TabButton>
            <TabButton tab="tab3">Tab 3</TabButton>
          </TabList>
          <TabPanel tab="tab1">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Tab 1 Content</h3>
              <p>This is the content for Tab 1.</p>
            </div>
          </TabPanel>
          <TabPanel tab="tab2">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Tab 2 Content</h3>
              <p>This is the content for Tab 2.</p>
            </div>
          </TabPanel>
          <TabPanel tab="tab3">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Tab 3 Content</h3>
              <p>This is the content for Tab 3.</p>
            </div>
          </TabPanel>
        </Tabs>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">New Tabs Component</h2>
        <Tabs_new
          tabs={tabs}
          value={activeTab}
          onChange={setActiveTab}
          className="mb-4"
        />
        <div className="p-4 bg-gray-50 rounded-lg">
          {activeTab === 'tab1' && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Tab 1 Content</h3>
              <p>This is the content for Tab 1 using the new component.</p>
            </div>
          )}
          {activeTab === 'tab2' && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Tab 2 Content</h3>
              <p>This is the content for Tab 2 using the new component.</p>
            </div>
          )}
          {activeTab === 'tab3' && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Tab 3 Content</h3>
              <p>This is the content for Tab 3 using the new component.</p>
            </div>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Escra Tabs Component</h2>
        <div className="relative w-full overflow-x-auto mb-6">
          <div className="flex min-w-[340px] sm:min-w-0">
            {escraTabs.map((tab) => (
              <button
                key={tab.key}
                className={`relative flex items-center gap-2 font-semibold transition-all duration-300 text-sm px-4 py-2 whitespace-nowrap
                  ${escraTab === tab.key
                    ? 'text-primary border-2 border-gray-200 rounded-lg'
                    : 'text-gray-500 hover:text-gray-700'}
                `}
                style={{ zIndex: 1 }}
                onClick={() => setEscraTab(tab.key)}
              >
                <span className={`inline-block transition-all duration-300 ${escraTab === tab.key ? 'opacity-100 mr-2' : 'opacity-0 w-0 mr-0'}`} style={{width: escraTab === tab.key ? 18 : 0}}>
                  {escraTab === tab.key && <Logo width={18} height={18} className="pointer-events-none" />}
                </span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          {escraTab === 'tab1' && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Tab 1 Content</h3>
              <p>This is the content for Tab 1 using the Escra tabs component.</p>
            </div>
          )}
          {escraTab === 'tab2' && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Tab 2 Content</h3>
              <p>This is the content for Tab 2 using the Escra tabs component.</p>
            </div>
          )}
          {escraTab === 'tab3' && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Tab 3 Content</h3>
              <p>This is the content for Tab 3 using the Escra tabs component.</p>
            </div>
          )}
          {escraTab === 'tab4' && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Tab 4 Content</h3>
              <p>This is the content for Tab 4 using the Escra tabs component.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 