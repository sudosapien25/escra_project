import React, { useCallback, useState } from 'react';
import clsx from 'clsx';
import { useDropzone } from 'react-dropzone';

interface FileUploadProps extends React.HTMLAttributes<HTMLDivElement> {
  onFilesAccepted: (files: File[]) => void;
  multiple?: boolean;
  accept?: string | string[];
  children?: React.ReactNode;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFilesAccepted,
  multiple = false,
  accept,
  children,
  className,
  ...props
}) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    onFilesAccepted(acceptedFiles);
  }, [onFilesAccepted]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple,
    accept: accept ? 
      typeof accept === 'string' ? 
        { [accept]: ['.'] } :
        accept.reduce((acc, type) => ({ ...acc, [type]: ['.'] }), {}) 
      : undefined,
    onDragEnter: () => {},
    onDragLeave: () => {},
    onDragOver: () => {}
  });

  return (
    <div
      {...getRootProps()}
      className={clsx(
        'flex flex-col items-center justify-center w-full px-4 py-6 border-2 border-dashed rounded-md cursor-pointer',
        isDragActive ? 'border-primary text-primary' : 'border-gray-300 text-gray-500',
        className
      )}
      {...props}
    >
      <input {...getInputProps()} type="file" />
      {
        isDragActive ?
          <p>Drop the files here ...</p> :
          children ? children : <p>Drag 'n' drop some files here, or click to select files</p>
      }
    </div>
  );
};

FileUpload.displayName = 'FileUpload'; 