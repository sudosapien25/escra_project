import React from 'react';

interface SignaturePadTypeProps {
  value: string;
  onChange: (value: string) => void;
}

export const SignaturePadType: React.FC<SignaturePadTypeProps> = ({ value, onChange }) => {
  const [inputValue, setInputValue] = React.useState(value);

  // Sync with parent component value
  React.useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setInputValue(newValue);
    onChange(newValue);
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Input field */}
        <input
          placeholder="Type your signature"
          className="w-full bg-transparent px-4 py-2 text-center text-2xl text-gray-700 dark:text-gray-300 placeholder:text-lg placeholder:text-gray-400 focus:outline-none border-b-2 border-gray-300 dark:border-gray-600 focus:border-primary transition-colors"
          value={inputValue}
          onChange={handleInputChange}
          style={{
            fontFamily: '"Dancing Script", "Great Vibes", "Alex Brush", "Brush Script MT", "Lucida Handwriting", cursive'
          }}
        />
        
        {/* Preview area */}
        <div className="mt-6 p-4 border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 min-h-[120px] flex items-center justify-center">
          {inputValue ? (
            <div 
              className="text-3xl text-gray-900 dark:text-white text-center"
              style={{
                fontFamily: '"Dancing Script", "Great Vibes", "Alex Brush", "Brush Script MT", "Lucida Handwriting", cursive'
              }}
            >
              {inputValue}
            </div>
          ) : (
            <div className="text-gray-400 dark:text-gray-500 text-center">
              <div className="text-sm mb-2">Signature Preview</div>
              <div 
                className="text-lg"
                style={{
                  fontFamily: '"Dancing Script", "Great Vibes", "Alex Brush", "Brush Script MT", "Lucida Handwriting", cursive'
                }}
              >
                Your signature will appear here
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 