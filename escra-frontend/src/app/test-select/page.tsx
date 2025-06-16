'use client';

import React, { useState } from 'react';
import { Select_new, SelectOption } from '@/components/common/Select_new';

const options: SelectOption[] = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3 (Disabled)', disabled: true },
  { value: 'option4', label: 'Option 4' },
  { value: 'option5', label: 'Option 5' },
];

export default function TestSelectPage() {
  const [selectedValue, setSelectedValue] = useState('');
  const [selectedValue2, setSelectedValue2] = useState('');
  const [selectedValue3, setSelectedValue3] = useState('');

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-2xl font-bold mb-6">Select Component Test Page</h1>
      
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold mb-2">Default Select</h2>
          <Select_new
            options={options}
            value={selectedValue}
            onChange={setSelectedValue}
            placeholder="Choose an option"
          />
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">With Error State</h2>
          <Select_new
            options={options}
            value={selectedValue2}
            onChange={setSelectedValue2}
            placeholder="Choose an option"
            error={true}
            helperText="This field is required"
          />
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">Disabled State</h2>
          <Select_new
            options={options}
            value={selectedValue3}
            onChange={setSelectedValue3}
            placeholder="Choose an option"
            disabled={true}
          />
        </div>
      </div>

      <div className="mt-8 p-4 bg-gray-100 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Selected Values:</h2>
        <pre className="bg-white p-4 rounded">
          {JSON.stringify({
            default: selectedValue,
            error: selectedValue2,
            disabled: selectedValue3
          }, null, 2)}
        </pre>
      </div>
    </div>
  );
} 