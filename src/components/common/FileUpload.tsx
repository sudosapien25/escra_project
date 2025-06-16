import React from 'react';
import clsx from 'clsx';
import { HiOutlineUpload } from 'react-icons/hi';

export interface FileUploadProps {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in MB
  onChange?: (files: File[]) => void;
  className?: string;
  id?: string;
  name?: string;
  required?: boolean;
  disabled?: boolean;
}

export const FileUpload = React.forwardRef<HTMLInputElement, FileUploadProps>(
  ({ 
    label, 
    error, 
    helperText, 
    fullWidth = true, 
    accept = '.pdf,.doc,.docx,.jpg,.jpeg',
    multiple = false,
    maxSize = 10,
    onChange,
    className,
    id,
    name,
    required,
    disabled,
    ...props 
  }, ref) => {
    const [files, setFiles] = React.useState<File[]>([]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files) return;
      
      const newFiles = Array.from(e.target.files);
      const validFiles = newFiles.filter(file => {
        const isValidType = accept.split(',').some(type => {
          const ext = type.trim();
          return file.type === ext || file.name.toLowerCase().endsWith(ext);
        });
        const isValidSize = file.size <= maxSize * 1024 * 1024;
        return isValidType && isValidSize;
      });

      setFiles(validFiles);
      onChange?.(validFiles);
    };

    return (
      <div className={clsx('space-y-1', fullWidth && 'w-full')}>
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <label htmlFor={id} className="block cursor-pointer">
          <div className={clsx(
            'flex flex-col items-center justify-center border-2 border-dashed rounded-xl bg-gray-50 py-8 px-4 text-center transition',
            error ? 'border-red-300' : 'border-gray-300 hover:border-primary',
            disabled && 'opacity-50 cursor-not-allowed',
            className
          )}>
            <HiOutlineUpload className="text-3xl text-gray-400 mb-2" />
            <div className="text-xs text-gray-500 font-medium">Click to upload or drag and drop</div>
            <div className="text-xs text-gray-400 mt-1">
              {accept.split(',').join(', ')} (max. {maxSize}MB each)
            </div>
            <input
              ref={ref}
              type="file"
              id={id}
              name={name}
              accept={accept}
              multiple={multiple}
              onChange={handleFileChange}
              className="hidden"
              required={required}
              disabled={disabled}
              {...props}
            />
          </div>
        </label>
        {files.length > 0 && (
          <ul className="mt-3 text-sm text-gray-600">
            {files.map((file, idx) => (
              <li key={idx} className="truncate">{file.name}</li>
            ))}
          </ul>
        )}
        {(error || helperText) && (
          <p className={clsx('text-sm', error ? 'text-red-600' : 'text-gray-500')}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

FileUpload.displayName = 'FileUpload'; 