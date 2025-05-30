import React, { useState } from 'react';
import { Tabs, TabList, TabButton, TabPanel } from '../../components/common/Tabs';
import { Tabs_new } from '../../components/common/Tabs_new';

const TabsTest: React.FC = () => {
  // State for the new Tabs component
  const [activeTab, setActiveTab] = useState('tab1');

  const tabs = [
    { label: 'Tab 1', value: 'tab1' },
    { label: 'Tab 2', value: 'tab2' },
    { label: 'Tab 3', value: 'tab3', disabled: true },
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
    </div>
  );
};

export default TabsTest; 