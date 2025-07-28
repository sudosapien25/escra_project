import React from 'react';
import { cn } from '../../../../lib/utils';

interface SignaturePadColorPickerProps {
  selectedColor: string;
  setSelectedColor: (color: string) => void;
}

export const SignaturePadColorPicker: React.FC<SignaturePadColorPickerProps> = ({
  selectedColor,
  setSelectedColor,
}) => {
  const colors = [
    { name: 'Black', value: 'black', class: 'bg-black' },
    { name: 'White', value: 'white', class: 'bg-white border border-gray-300' },
  ];

  return (
    <div className="absolute top-3 right-3 flex gap-2">
      {colors.map((color) => (
        <button
          key={color.value}
          onClick={() => setSelectedColor(color.value)}
          className={cn(
            'w-6 h-6 rounded-full border-2 transition-all',
            color.class,
            selectedColor === color.value
              ? 'border-primary ring-2 ring-primary ring-offset-2'
              : 'border-gray-300 hover:border-gray-400'
          )}
          title={color.name}
        />
      ))}
    </div>
  );
}; 