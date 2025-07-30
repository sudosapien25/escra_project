import React, { useState, useRef, useEffect } from 'react';
import { 
  LuEye, 
  LuZoomIn, 
  LuZoomOut, 
  LuRotateCcw,
  LuDownload,
  LuChevronLeft,
  LuChevronRight,
  LuX,
  LuPlus,
  LuTrash2,
  LuMove,
  LuMaximize2,
  LuMail,
  LuLink,
  LuSettings,
  LuType,
  LuSend,
  LuCopyPlus,
  LuBringToFront
} from 'react-icons/lu';
import { HiOutlineDocumentText, HiOutlineTrash } from 'react-icons/hi';
import { HiMiniChevronDown, HiMiniChevronUp } from 'react-icons/hi2';
import { FaCheck } from 'react-icons/fa';
import { MdOutlineAttachEmail } from 'react-icons/md';
import { TbUnlink, TbMailBolt, TbLinkPlus, TbLink } from 'react-icons/tb';
import { Logo } from '@/components/common/Logo';

// Field Types
export enum FieldType {
  SIGNATURE = 'SIGNATURE',
  INITIALS = 'INITIALS',
  EMAIL = 'EMAIL',
  NAME = 'NAME',
  DATE = 'DATE',
  TEXT = 'TEXT',
  NUMBER = 'NUMBER',
  RADIO = 'RADIO',
  CHECKBOX = 'CHECKBOX',
  DROPDOWN = 'DROPDOWN',
}

// Recipient Roles
export enum RecipientRole {
  SIGNER = 'SIGNER',
  APPROVER = 'APPROVER',
  VIEWER = 'VIEWER',
  ASSISTANT = 'ASSISTANT',
  CC = 'CC',
}

// Field Position Interface
export interface FieldPosition {
  pageNumber: number;
  pageX: number; // Percentage of page width
  pageY: number; // Percentage of page height
  pageWidth: number; // Percentage of page width
  pageHeight: number; // Percentage of page height
}

// Field Interface
export interface Field {
  id: string;
  type: FieldType;
  recipientId: string;
  position: FieldPosition;
  customText?: string;
  inserted: boolean;
  fieldMeta?: any;
}

// Recipient Interface
export interface Recipient {
  id: string;
  name: string;
  email: string;
  role: RecipientRole;
  signingOrder?: number;
  token?: string;
  sendStatus?: 'NOT_SENT' | 'SENT';
  signingStatus?: 'NOT_SIGNED' | 'SIGNED' | 'REJECTED';
}

// Document Interface
export interface Document {
  id: string;
  title: string;
  documentData: {
    id: string;
    type: 'S3_PATH' | 'BYTES' | 'BYTES_64';
    data: string;
  };
  recipients: Recipient[];
  fields: Field[];
  status: 'DRAFT' | 'PENDING' | 'COMPLETED' | 'REJECTED';
  documentMeta?: {
    subject?: string;
    message?: string;
    distributionMethod?: 'EMAIL' | 'NONE';
    signingOrder?: 'PARALLEL' | 'SEQUENTIAL';
    emailSettings?: any;
  };
}

interface DocumentPreparationModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentData: {
    recipients: any[];
    uploadedFiles: File[];
    selectedDocuments: any[];
  };
}

const FIELD_TYPE_LABELS = {
  [FieldType.SIGNATURE]: 'Signature',
  [FieldType.INITIALS]: 'Initials',
  [FieldType.EMAIL]: 'Email',
  [FieldType.NAME]: 'Name',
  [FieldType.DATE]: 'Date',
  [FieldType.TEXT]: 'Text',
  [FieldType.NUMBER]: 'Number',
  [FieldType.RADIO]: 'Radio',
  [FieldType.CHECKBOX]: 'Checkbox',
  [FieldType.DROPDOWN]: 'Dropdown',
};

const generateFieldId = () => `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

export const DocumentPreparationModal: React.FC<DocumentPreparationModalProps> = ({
  isOpen,
  onClose,
  documentData
}) => {
  const [selectedField, setSelectedField] = useState<FieldType | null>(null);
  const [selectedRecipient, setSelectedRecipient] = useState<Recipient | null>(null);
  const [fields, setFields] = useState<Field[]>([]);
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState<'preparation' | 'distribution'>('preparation');
  const canvasRef = useRef<HTMLDivElement>(null);

  // Distribution state
  const [distributionMethod, setDistributionMethod] = useState<'EMAIL' | 'NONE'>('EMAIL');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [emailSettings, setEmailSettings] = useState({
    recipientSigned: true,
    recipientSigningRequest: true,
    documentPending: true,
    documentCompleted: true,
    documentDeleted: false,
    ownerDocumentCompleted: true,
  });

  const [reminderSettings, setReminderSettings] = useState({
    every24Hours: false,
    every2Days: false,
    every7Days: false,
    every14Days: false,
    every30Days: false,
    every60Days: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showVariables, setShowVariables] = useState(false);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [selectedEmailTemplate, setSelectedEmailTemplate] = useState<string>('None');

  // Convert documentData recipients to our Recipient format
  useEffect(() => {
    if (documentData.recipients) {
      const convertedRecipients: Recipient[] = documentData.recipients.map((recipient: any, index: number) => ({
        id: recipient.id || `recipient_${index}`,
        name: recipient.name || '',
        email: recipient.email || '',
        role: RecipientRole.SIGNER,
        signingOrder: index + 1,
        signingStatus: 'NOT_SIGNED',
        sendStatus: 'NOT_SENT',
      }));
      setRecipients(convertedRecipients);
      if (convertedRecipients.length > 0) {
        setSelectedRecipient(convertedRecipients[0]);
      }
    }
  }, [documentData.recipients]);

  useEffect(() => {
    // Simulate document loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handlePageClick = (event: React.MouseEvent) => {
    // Close any open field toolbar
    setSelectedFieldId(null);
    
    if (!selectedField || !selectedRecipient) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    // Set different dimensions based on field type
    let pageWidth = 18; // Default width (same as signature)
    let pageHeight = 5; // Default height (same as signature)

    // All field types now use the same dimensions for consistency

    const newField: Field = {
      id: generateFieldId(),
      type: selectedField,
      recipientId: selectedRecipient.id,
      position: {
        pageNumber: currentPage,
        pageX: x,
        pageY: y,
        pageWidth: pageWidth,
        pageHeight: pageHeight,
      },
      inserted: false,
    };

    setFields(prev => [...prev, newField]);
  };

  const handleFieldSelect = (fieldType: FieldType) => {
    setSelectedField(fieldType);
  };

  const handleRecipientSelect = (recipient: Recipient) => {
    setSelectedRecipient(recipient);
  };

  const handleRemoveField = (fieldId: string) => {
    setFields(prev => prev.filter(f => f.id !== fieldId));
    setSelectedFieldId(null);
  };

  const handleDuplicateField = (fieldId: string) => {
    const fieldToDuplicate = fields.find(f => f.id === fieldId);
    if (!fieldToDuplicate) return;

    const newField: Field = {
      ...fieldToDuplicate,
      id: generateFieldId(),
      position: {
        ...fieldToDuplicate.position,
        pageX: fieldToDuplicate.position.pageX + 2, // Offset slightly
        pageY: fieldToDuplicate.position.pageY + 2,
      },
    };

    setFields(prev => [...prev, newField]);
  };

  const handleDuplicateOnAllPages = (fieldId: string) => {
    const fieldToDuplicate = fields.find(f => f.id === fieldId);
    if (!fieldToDuplicate) return;

    // For now, we'll just duplicate on the current page since we're assuming single page
    // In a multi-page implementation, you'd iterate through all pages
    const newField: Field = {
      ...fieldToDuplicate,
      id: generateFieldId(),
      position: {
        ...fieldToDuplicate.position,
        pageX: fieldToDuplicate.position.pageX + 2,
        pageY: fieldToDuplicate.position.pageY + 2,
      },
    };

    setFields(prev => [...prev, newField]);
  };

  const handleFieldClick = (fieldId: string) => {
    setSelectedFieldId(selectedFieldId === fieldId ? null : fieldId);
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.25, 0.25));
  };

  const handleResetZoom = () => {
    setZoom(1);
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, 1)); // Assuming single page for now
  };

  // Distribution functions
  const handleDistributionSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Simulate sending process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Document sent successfully', {
        distributionMethod,
        subject,
        message,
        emailSettings,
        recipients: recipients,
        fields: fields,
      });

      // Close modal after successful send
      onClose();
    } catch (error) {
      console.error('Failed to send document:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRecipientSummary = () => {
    const signers = recipients.filter(r => r.role === 'SIGNER');
    const approvers = recipients.filter(r => r.role === 'APPROVER');
    const viewers = recipients.filter(r => r.role === 'VIEWER');
    const cc = recipients.filter(r => r.role === 'CC');

    return {
      signers: signers.length,
      approvers: approvers.length,
      viewers: viewers.length,
      cc: cc.length,
      total: recipients.length,
    };
  };

  const getFieldsForPage = (pageNumber: number): Field[] => {
    return fields.filter(field => field.position.pageNumber === pageNumber);
  };

  const renderField = (field: Field) => {
    const style = {
      position: 'absolute' as const,
      left: `${field.position.pageX}%`,
      top: `${field.position.pageY}%`,
      width: `${field.position.pageWidth}%`,
      height: `${field.position.pageHeight}%`,
      transform: `rotate(${rotation}deg)`,
    };

    const getFieldContent = () => {
      switch (field.type) {
        case FieldType.SIGNATURE:
          return (
            <div className="border-2 border-dashed border-primary bg-primary/5 rounded flex items-center justify-center px-2 py-1">
              <span 
                className="text-lg text-primary font-medium whitespace-nowrap" 
                style={{ 
                  fontFamily: '"Dancing Script", "Great Vibes", "Alex Brush", "Brush Script MT", "Lucida Handwriting", cursive'
                }}
              >
                Signature
              </span>
            </div>
          );
        case FieldType.INITIALS:
          return (
            <div className="border-2 border-dashed border-primary bg-primary/5 rounded flex items-center justify-center px-2 py-1">
              <span className="text-xs text-primary font-medium whitespace-nowrap" style={{ fontFamily: 'Avenir, sans-serif' }}>Initials</span>
            </div>
          );
        case FieldType.EMAIL:
          return (
            <div className="border-2 border-dashed border-primary bg-primary/5 rounded flex items-center justify-center px-2 py-1">
              <span className="text-xs text-primary font-medium whitespace-nowrap" style={{ fontFamily: 'Avenir, sans-serif' }}>Email</span>
            </div>
          );
        case FieldType.NAME:
          return (
            <div className="border-2 border-dashed border-primary bg-primary/5 rounded flex items-center justify-center px-2 py-1">
              <span className="text-xs text-primary font-medium whitespace-nowrap" style={{ fontFamily: 'Avenir, sans-serif' }}>Name</span>
            </div>
          );
        case FieldType.DATE:
          return (
            <div className="border-2 border-dashed border-primary bg-primary/5 rounded flex items-center justify-center px-2 py-1">
              <span className="text-xs text-primary font-medium whitespace-nowrap" style={{ fontFamily: 'Avenir, sans-serif' }}>Date</span>
            </div>
          );
        case FieldType.TEXT:
          return (
            <div className="border-2 border-dashed border-primary bg-primary/5 rounded flex items-center justify-center px-2 py-1">
              <span className="text-xs text-primary font-medium whitespace-nowrap" style={{ fontFamily: 'Avenir, sans-serif' }}>Text</span>
            </div>
          );
        default:
          return (
            <div className="border-2 border-dashed border-primary bg-primary/5 rounded flex items-center justify-center px-2 py-1">
              <span className="text-xs text-primary font-medium whitespace-nowrap" style={{ fontFamily: 'Avenir, sans-serif' }}>{FIELD_TYPE_LABELS[field.type]}</span>
            </div>
          );
      }
    };

    const isSelected = selectedFieldId === field.id;

    return (
      <div
        key={field.id}
        style={style}
        className="cursor-pointer relative"
        onClick={(e) => {
          e.stopPropagation();
          handleFieldClick(field.id);
        }}
      >
        <div className="hover:shadow-lg transition-shadow">
          {getFieldContent()}
        </div>
        
        {/* Toolbar - appears when field is selected */}
        {isSelected && (
          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg px-2 py-1 flex items-center gap-1 z-50">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDuplicateField(field.id);
              }}
              className="p-1.5 text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
              title="Duplicate"
            >
              <LuCopyPlus size={14} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDuplicateOnAllPages(field.id);
              }}
              className="p-1.5 text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
              title="Duplicate on all pages"
            >
              <LuBringToFront size={14} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveField(field.id);
              }}
              className="p-1.5 text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
              title="Remove"
            >
              <HiOutlineTrash size={14} />
            </button>
          </div>
        )}
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-2 sm:p-4">
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-[1600px] max-h-[95vh] sm:max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="sticky top-0 z-40 bg-gray-100 dark:bg-gray-900 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white" style={{ fontFamily: 'Avenir, sans-serif' }}>
                Document Preparation
              </h2>
            </div>
            <button
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 sm:p-2 rounded-full"
              onClick={onClose}
              aria-label="Close"
            >
              <LuX className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-1 min-h-0 flex-col lg:flex-row">
          {currentStep === 'preparation' ? (
            <>
              {/* Left Sidebar - Field Palette */}
              <div className="w-full lg:w-80 border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-4 sm:px-6 py-4 sm:py-6">
            <div className="space-y-6">
              {/* Field Types */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3" style={{ fontFamily: 'Avenir, sans-serif' }}>
                  Field Types
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {Object.values(FieldType).map((fieldType) => (
                    <button
                      key={fieldType}
                      onClick={() => handleFieldSelect(fieldType)}
                      className={`p-3 rounded-lg border-2 text-xs font-medium transition-colors ${
                        selectedField === fieldType
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500'
                      }`}
                      style={{ fontFamily: 'Avenir, sans-serif' }}
                    >
                      {FIELD_TYPE_LABELS[fieldType]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Recipients */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3" style={{ fontFamily: 'Avenir, sans-serif' }}>
                  Recipients
                </h3>
                <div className="space-y-2">
                  {recipients.map((recipient) => (
                    <button
                      key={recipient.id}
                      onClick={() => handleRecipientSelect(recipient)}
                      className={`w-full p-3 rounded-lg border-2 text-left transition-colors ${
                        selectedRecipient?.id === recipient.id
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500'
                      }`}
                      style={{ fontFamily: 'Avenir, sans-serif' }}
                    >
                                              <div className="text-sm font-medium" style={{ fontFamily: 'Avenir, sans-serif' }}>{recipient.name}</div>
                                              <div className="text-xs text-gray-500 dark:text-gray-400" style={{ fontFamily: 'Avenir, sans-serif' }}>{recipient.email}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-gray-100 dark:bg-gray-900 p-3 rounded-lg border-2 border-gray-200 dark:border-gray-600">
                <h4 className="text-xs font-semibold text-gray-900 dark:text-white mb-2" style={{ fontFamily: 'Avenir, sans-serif' }}>
                  Instructions
                </h4>
                <ul className="text-xs text-gray-700 dark:text-gray-300 space-y-1">
                  <li>• Select a field type</li>
                  <li>• Choose a recipient</li>
                  <li>• Click on the document to place fields</li>
                  <li>• Drag fields to reposition them</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Center - Document Canvas */}
          <div className="flex-1 flex flex-col">
            {/* Toolbar */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-2 sm:p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleZoomOut}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    title="Zoom Out"
                  >
                    <LuZoomOut className="w-4 h-4" />
                  </button>
                  <span className="text-sm text-gray-600 dark:text-gray-400 min-w-[60px] text-center">
                    {Math.round(zoom * 100)}%
                  </span>
                  <button
                    onClick={handleZoomIn}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    title="Zoom In"
                  >
                    <LuZoomIn className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleResetZoom}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    title="Reset Zoom"
                  >
                    <LuEye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleRotate}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    title="Rotate"
                  >
                    <LuRotateCcw className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePreviousPage}
                    disabled={currentPage <= 1}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Previous Page"
                  >
                    <LuChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Page {currentPage} of 1
                  </span>
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage >= 1}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Next Page"
                  >
                    <LuChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Document Canvas */}
            <div className="flex-1 bg-gray-100 dark:bg-gray-900 p-6 overflow-auto">
              <div className="space-y-6">
                <div className="flex justify-center">
                  <div
                    ref={canvasRef}
                    className="relative bg-white shadow-lg"
                    style={{
                      transform: `scale(${zoom}) rotate(${rotation}deg)`,
                      transformOrigin: 'center',
                      transition: 'transform 0.2s ease-in-out',
                    }}
                  >
                    {/* Mock Document */}
                    <div
                      className="w-full max-w-[800px] h-auto min-h-[400px] sm:h-[800px] lg:h-[1000px] bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 relative cursor-crosshair"
                      style={{ aspectRatio: '4/5' }}
                      onClick={handlePageClick}
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center h-full">
                          <div className="text-gray-500">Loading document...</div>
                        </div>
                      ) : (
                        <>
                          {/* Document content placeholder */}
                          <div className="p-4 sm:p-6 lg:p-8">
                            <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4" style={{ fontFamily: 'Avenir, sans-serif' }}>
                              Sample Document
                            </h1>
                            <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 mb-3 sm:mb-4" style={{ fontFamily: 'Avenir, sans-serif' }}>
                              This is a sample document for field placement. Click on the document to add fields.
                            </p>
                            <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300" style={{ fontFamily: 'Avenir, sans-serif' }}>
                              The document will be replaced with the actual uploaded file content.
                            </p>
                          </div>
                          
                          {/* Render fields for current page */}
                          {getFieldsForPage(currentPage).map(renderField)}
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-1 pb-4 sm:pb-0">
                  <button
                    onClick={onClose}
                    className="px-5 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-semibold"
                    style={{ fontFamily: 'Avenir, sans-serif' }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setCurrentStep('distribution');
                    }}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-semibold"
                    style={{ fontFamily: 'Avenir, sans-serif' }}
                  >
                    Continue
                  </button>
                </div>
              </div>
            </div>
          </div>
            </>
          ) : (
            // Distribution Screen
            <>
              {/* Left Sidebar - Distribution Settings */}
              <div className="w-full lg:w-80 bg-gray-100 dark:bg-gray-900 px-4 sm:px-6 lg:pr-4 py-4 sm:py-6 flex flex-col">
                <div className="space-y-4 sm:space-y-6 flex-1">
                  {/* Recipient Summary */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3" style={{ fontFamily: 'Avenir, sans-serif' }}>
                      Recipients
                    </h3>
                    <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
                      <div className="text-center p-2 sm:p-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-lg">
                        <div className="text-base sm:text-lg font-semibold text-blue-600 dark:text-blue-400" style={{ fontFamily: 'Avenir, sans-serif' }}>
                          {getRecipientSummary().signers}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400" style={{ fontFamily: 'Avenir, sans-serif' }}>Signers</div>
                      </div>
                      <div className="text-center p-2 sm:p-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-lg">
                        <div className="text-base sm:text-lg font-semibold text-purple-600 dark:text-purple-400" style={{ fontFamily: 'Avenir, sans-serif' }}>
                          {getRecipientSummary().approvers}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400" style={{ fontFamily: 'Avenir, sans-serif' }}>Approvers</div>
                      </div>
                      <div className="text-center p-2 sm:p-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-lg">
                        <div className="text-base sm:text-lg font-semibold text-gray-600 dark:text-gray-400" style={{ fontFamily: 'Avenir, sans-serif' }}>
                          {getRecipientSummary().viewers}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400" style={{ fontFamily: 'Avenir, sans-serif' }}>Viewers</div>
                      </div>
                      <div className="text-center p-2 sm:p-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-lg">
                        <div className="text-base sm:text-lg font-semibold text-orange-600 dark:text-orange-400" style={{ fontFamily: 'Avenir, sans-serif' }}>
                          {getRecipientSummary().cc}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400" style={{ fontFamily: 'Avenir, sans-serif' }}>CC</div>
                      </div>
                    </div>
                  </div>

                  {/* Distribution Method */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3" style={{ fontFamily: 'Avenir, sans-serif' }}>
                      Distribution Method
                    </h3>
                    <div className="space-y-2">
                      <button
                        onClick={() => setDistributionMethod('EMAIL')}
                        className={`w-full p-3 rounded-lg border-2 text-left transition-colors ${
                          distributionMethod === 'EMAIL'
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500'
                        }`}
                        style={{ fontFamily: 'Avenir, sans-serif' }}
                      >
                        <div className="flex items-center gap-2">
                          <div className={`h-10 w-10 rounded-lg flex items-center justify-center border-2 ${
                            distributionMethod === 'EMAIL'
                              ? 'bg-primary text-white border-primary'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-600'
                          }`}>
                            <TbMailBolt size={20} />
                          </div>
                          <div>
                            <div className="text-sm font-medium" style={{ fontFamily: 'Avenir, sans-serif' }}>Email</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400" style={{ fontFamily: 'Avenir, sans-serif' }}>Send via email</div>
                          </div>
                        </div>
                      </button>
                      <button
                        onClick={() => setDistributionMethod('NONE')}
                        className={`w-full p-3 rounded-lg border-2 text-left transition-colors ${
                          distributionMethod === 'NONE'
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500'
                        }`}
                        style={{ fontFamily: 'Avenir, sans-serif' }}
                      >
                        <div className="flex items-center gap-2">
                          <div className={`h-10 w-10 rounded-lg flex items-center justify-center border-2 ${
                            distributionMethod === 'NONE'
                              ? 'bg-primary text-white border-primary'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-600'
                          }`}>
                            <TbLinkPlus size={20} />
                          </div>
                          <div>
                            <div className="text-sm font-medium" style={{ fontFamily: 'Avenir, sans-serif' }}>Signing Links</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400" style={{ fontFamily: 'Avenir, sans-serif' }}>Generate links</div>
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Previous Button in Left Sidebar */}
                <div className="pt-4 sm:pt-8">
                  <button
                    onClick={() => setCurrentStep('preparation')}
                    className="px-4 sm:px-5 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-semibold"
                    style={{ fontFamily: 'Avenir, sans-serif' }}
                  >
                    Previous
                  </button>
                </div>
              </div>

              {/* Center - Distribution Content */}
              <div className="flex-1 flex flex-col">
                {/* Scrollable Content */}
                <div className="flex-1 bg-gray-100 dark:bg-gray-900 p-4 sm:p-6 lg:pl-2 overflow-auto">
                  <div className="space-y-6 sm:space-y-8">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                      <div>
                        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white" style={{ fontFamily: 'Avenir, sans-serif' }}>
                          Distribution Settings
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1" style={{ fontFamily: 'Avenir, sans-serif' }}>
                          Configure how your document will be sent to recipients
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <LuSettings className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-400" style={{ fontFamily: 'Avenir, sans-serif' }}>
                          {getRecipientSummary().total} recipient{getRecipientSummary().total !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>

                    {/* Email Configuration */}
                    {distributionMethod === 'EMAIL' && (
                      <div className="space-y-4 sm:space-y-6">
                        {/* Subject and Message */}
                        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 sm:p-6">
                          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4" style={{ fontFamily: 'Avenir, sans-serif' }}>Add Message</h3>
                          
                          {/* Subject Field */}
                          <div className="mb-4">
                            <input
                              type="text"
                              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-xs font-medium bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                              placeholder="Enter subject..."
                              value={subject}
                              onChange={(e) => setSubject(e.target.value)}
                              style={{ fontFamily: 'Avenir, sans-serif' }}
                            />
                          </div>
                          
                          {/* Message Textarea */}
                                                                                <textarea
                            className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-xs font-medium bg-white dark:bg-gray-900 text-gray-900 dark:text-white resize-none [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-white [&::-webkit-scrollbar-track]:dark:bg-gray-800 [&::-webkit-scrollbar-track]:rounded-r-lg [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:dark:bg-gray-600 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-gray-400 [&::-webkit-scrollbar-thumb:hover]:dark:bg-gray-500"
                            rows={6}
                            placeholder="Enter your message..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            style={{ fontFamily: 'Avenir, sans-serif' }}
                          />
                          
                          {/* Email Templates */}
                          <div className="mt-6">
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3" style={{ fontFamily: 'Avenir, sans-serif' }}>
                              Email Templates
                            </h4>
                            <div className="flex flex-wrap gap-1">
                              {[
                                { name: 'Professional', subject: 'Please sign: {{document_title}}', message: 'Hi {{recipient_name}},\n\nPlease review and sign the attached document "{{document_title}}".\n\nThank you!' },
                                { name: 'Friendly', subject: 'Document for your signature: {{document_title}}', message: 'Hello {{recipient_name}},\n\nI hope this email finds you well. I have a document that needs your signature: "{{document_title}}".\n\nThanks!' },
                                { name: 'Brief', subject: 'Signature needed: {{document_title}}', message: 'Hi {{recipient_name}},\n\nPlease sign this document: {{document_title}}\n\nThanks!' },
                                { name: 'None', subject: '', message: '' }
                              ].map((template) => (
                                <button
                                  key={template.name}
                                  onClick={() => {
                                    setSelectedEmailTemplate(template.name);
                                    setSubject(template.subject);
                                    setMessage(template.message);
                                  }}
                                                                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all duration-300 font-sans flex items-center justify-center ${
                                  selectedEmailTemplate === template.name 
                                    ? `bg-white dark:bg-gray-800 text-teal-500 dark:text-teal-400 ${template.name === 'None' || template.name === 'Brief' || template.name === 'Friendly' ? 'min-w-[80px]' : 'min-w-[130px]'} border-2 border-gray-200 dark:border-gray-700` 
                                    : `bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 ${template.name === 'None' || template.name === 'Brief' || template.name === 'Friendly' ? 'w-fit' : 'w-fit'} border border-gray-200 dark:border-gray-700`
                                }`}
                                  style={{ fontFamily: 'Avenir, sans-serif' }}
                                >
                                  <span className={`inline-block transition-all duration-300 ${selectedEmailTemplate === template.name ? 'opacity-100 mr-1.5' : 'opacity-0 w-0 mr-0'}`} style={{width: selectedEmailTemplate === template.name ? 16 : 0}}>
                                    {selectedEmailTemplate === template.name && <Logo width={16} height={16} className="pointer-events-none" />}
                                  </span>
                                  {template.name}
                                </button>
                              ))}
                            </div>
                          </div>
                          

                        </div>

                        {/* Notification Settings */}
                        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 sm:p-6">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Left Column - Notification Settings */}
                            <div>
                              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4" style={{ fontFamily: 'Avenir, sans-serif' }}>
                                Notification Settings
                              </h3>
                              <div className="space-y-4">
                            <div className="flex items-center gap-2">
                              <div className="w-5 h-5 border border-gray-300 rounded flex items-center justify-center cursor-pointer" onClick={() => setEmailSettings(prev => ({ ...prev, recipientSigned: !prev.recipientSigned }))}>
                                {emailSettings.recipientSigned && (
                                  <div className="w-4 h-4 bg-primary rounded-sm flex items-center justify-center">
                                    <FaCheck className="text-white" size={10} />
                                  </div>
                                )}
                              </div>
                              <label 
                                className="text-xs font-medium text-gray-700 dark:text-gray-300 cursor-pointer"
                                style={{ fontFamily: 'Avenir, sans-serif' }}
                                onClick={() => setEmailSettings(prev => ({ ...prev, recipientSigned: !prev.recipientSigned }))}
                              >
                                When recipient signs the document
                              </label>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <div className="w-5 h-5 border border-gray-300 rounded flex items-center justify-center cursor-pointer" onClick={() => setEmailSettings(prev => ({ ...prev, recipientSigningRequest: !prev.recipientSigningRequest }))}>
                                {emailSettings.recipientSigningRequest && (
                                  <div className="w-4 h-4 bg-primary rounded-sm flex items-center justify-center">
                                    <FaCheck className="text-white" size={10} />
                                  </div>
                                )}
                              </div>
                              <label 
                                className="text-xs font-medium text-gray-700 dark:text-gray-300 cursor-pointer"
                                style={{ fontFamily: 'Avenir, sans-serif' }}
                                onClick={() => setEmailSettings(prev => ({ ...prev, recipientSigningRequest: !prev.recipientSigningRequest }))}
                              >
                                When signing request is sent to recipient
                              </label>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <div className="w-5 h-5 border border-gray-300 rounded flex items-center justify-center cursor-pointer" onClick={() => setEmailSettings(prev => ({ ...prev, documentPending: !prev.documentPending }))}>
                                {emailSettings.documentPending && (
                                  <div className="w-4 h-4 bg-primary rounded-sm flex items-center justify-center">
                                    <FaCheck className="text-white" size={10} />
                                  </div>
                                )}
                              </div>
                              <label 
                                className="text-xs font-medium text-gray-700 dark:text-gray-300 cursor-pointer"
                                style={{ fontFamily: 'Avenir, sans-serif' }}
                                onClick={() => setEmailSettings(prev => ({ ...prev, documentPending: !prev.documentPending }))}
                              >
                                When document is pending signatures
                              </label>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <div className="w-5 h-5 border border-gray-300 rounded flex items-center justify-center cursor-pointer" onClick={() => setEmailSettings(prev => ({ ...prev, documentCompleted: !prev.documentCompleted }))}>
                                {emailSettings.documentCompleted && (
                                  <div className="w-4 h-4 bg-primary rounded-sm flex items-center justify-center">
                                    <FaCheck className="text-white" size={10} />
                                  </div>
                                )}
                              </div>
                              <label 
                                className="text-xs font-medium text-gray-700 dark:text-gray-300 cursor-pointer"
                                style={{ fontFamily: 'Avenir, sans-serif' }}
                                onClick={() => setEmailSettings(prev => ({ ...prev, documentCompleted: !prev.documentCompleted }))}
                              >
                                When document is completed
                              </label>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <div className="w-5 h-5 border border-gray-300 rounded flex items-center justify-center cursor-pointer" onClick={() => setEmailSettings(prev => ({ ...prev, documentDeleted: !prev.documentDeleted }))}>
                                {emailSettings.documentDeleted && (
                                  <div className="w-4 h-4 bg-primary rounded-sm flex items-center justify-center">
                                    <FaCheck className="text-white" size={10} />
                                  </div>
                                )}
                              </div>
                              <label 
                                className="text-xs font-medium text-gray-700 dark:text-gray-300 cursor-pointer"
                                style={{ fontFamily: 'Avenir, sans-serif' }}
                                onClick={() => setEmailSettings(prev => ({ ...prev, documentDeleted: !prev.documentDeleted }))}
                              >
                                When document is deleted
                              </label>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <div className="w-5 h-5 border border-gray-300 rounded flex items-center justify-center cursor-pointer" onClick={() => setEmailSettings(prev => ({ ...prev, ownerDocumentCompleted: !prev.ownerDocumentCompleted }))}>
                                {emailSettings.ownerDocumentCompleted && (
                                  <div className="w-4 h-4 bg-primary rounded-sm flex items-center justify-center">
                                    <FaCheck className="text-white" size={10} />
                                  </div>
                                )}
                              </div>
                              <label 
                                className="text-xs font-medium text-gray-700 dark:text-gray-300 cursor-pointer"
                                style={{ fontFamily: 'Avenir, sans-serif' }}
                                onClick={() => setEmailSettings(prev => ({ ...prev, ownerDocumentCompleted: !prev.ownerDocumentCompleted }))}
                              >
                                When document is completed (owner notification)
                              </label>
                            </div>
                          </div>
                            </div>

                            {/* Right Column - Add Reminders */}
                            <div>
                              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4" style={{ fontFamily: 'Avenir, sans-serif' }}>
                                Add Reminders
                              </h3>
                              <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                  <div className="w-5 h-5 border border-gray-300 rounded flex items-center justify-center cursor-pointer" onClick={() => setReminderSettings(prev => ({ ...prev, every24Hours: !prev.every24Hours }))}>
                                    {reminderSettings.every24Hours && (
                                      <div className="w-4 h-4 bg-primary rounded-sm flex items-center justify-center">
                                        <FaCheck className="text-white" size={10} />
                                      </div>
                                    )}
                                  </div>
                                  <label 
                                    className="text-xs font-medium text-gray-700 dark:text-gray-300 cursor-pointer"
                                    style={{ fontFamily: 'Avenir, sans-serif' }}
                                    onClick={() => setReminderSettings(prev => ({ ...prev, every24Hours: !prev.every24Hours }))}
                                  >
                                    Every 24 hours
                                  </label>
                                </div>
                                
                                <div className="flex items-center gap-2">
                                  <div className="w-5 h-5 border border-gray-300 rounded flex items-center justify-center cursor-pointer" onClick={() => setReminderSettings(prev => ({ ...prev, every2Days: !prev.every2Days }))}>
                                    {reminderSettings.every2Days && (
                                      <div className="w-4 h-4 bg-primary rounded-sm flex items-center justify-center">
                                        <FaCheck className="text-white" size={10} />
                                      </div>
                                    )}
                                  </div>
                                  <label 
                                    className="text-xs font-medium text-gray-700 dark:text-gray-300 cursor-pointer"
                                    style={{ fontFamily: 'Avenir, sans-serif' }}
                                    onClick={() => setReminderSettings(prev => ({ ...prev, every2Days: !prev.every2Days }))}
                                  >
                                    Every 2 days
                                  </label>
                                </div>
                                
                                <div className="flex items-center gap-2">
                                  <div className="w-5 h-5 border border-gray-300 rounded flex items-center justify-center cursor-pointer" onClick={() => setReminderSettings(prev => ({ ...prev, every7Days: !prev.every7Days }))}>
                                    {reminderSettings.every7Days && (
                                      <div className="w-4 h-4 bg-primary rounded-sm flex items-center justify-center">
                                        <FaCheck className="text-white" size={10} />
                                      </div>
                                    )}
                                  </div>
                                  <label 
                                    className="text-xs font-medium text-gray-700 dark:text-gray-300 cursor-pointer"
                                    style={{ fontFamily: 'Avenir, sans-serif' }}
                                    onClick={() => setReminderSettings(prev => ({ ...prev, every7Days: !prev.every7Days }))}
                                  >
                                    Every 7 days
                                  </label>
                                </div>
                                
                                <div className="flex items-center gap-2">
                                  <div className="w-5 h-5 border border-gray-300 rounded flex items-center justify-center cursor-pointer" onClick={() => setReminderSettings(prev => ({ ...prev, every14Days: !prev.every14Days }))}>
                                    {reminderSettings.every14Days && (
                                      <div className="w-4 h-4 bg-primary rounded-sm flex items-center justify-center">
                                        <FaCheck className="text-white" size={10} />
                                      </div>
                                    )}
                                  </div>
                                  <label 
                                    className="text-xs font-medium text-gray-700 dark:text-gray-300 cursor-pointer"
                                    style={{ fontFamily: 'Avenir, sans-serif' }}
                                    onClick={() => setReminderSettings(prev => ({ ...prev, every14Days: !prev.every14Days }))}
                                  >
                                    Every 14 days
                                  </label>
                                </div>
                                
                                <div className="flex items-center gap-2">
                                  <div className="w-5 h-5 border border-gray-300 rounded flex items-center justify-center cursor-pointer" onClick={() => setReminderSettings(prev => ({ ...prev, every30Days: !prev.every30Days }))}>
                                    {reminderSettings.every30Days && (
                                      <div className="w-4 h-4 bg-primary rounded-sm flex items-center justify-center">
                                        <FaCheck className="text-white" size={10} />
                                      </div>
                                    )}
                                  </div>
                                  <label 
                                    className="text-xs font-medium text-gray-700 dark:text-gray-300 cursor-pointer"
                                    style={{ fontFamily: 'Avenir, sans-serif' }}
                                    onClick={() => setReminderSettings(prev => ({ ...prev, every30Days: !prev.every30Days }))}
                                  >
                                    Every 30 days
                                  </label>
                                </div>
                                
                                <div className="flex items-center gap-2">
                                  <div className="w-5 h-5 border border-gray-300 rounded flex items-center justify-center cursor-pointer" onClick={() => setReminderSettings(prev => ({ ...prev, every60Days: !prev.every60Days }))}>
                                    {reminderSettings.every60Days && (
                                      <div className="w-4 h-4 bg-primary rounded-sm flex items-center justify-center">
                                        <FaCheck className="text-white" size={10} />
                                      </div>
                                    )}
                                  </div>
                                  <label 
                                    className="text-xs font-medium text-gray-700 dark:text-gray-300 cursor-pointer"
                                    style={{ fontFamily: 'Avenir, sans-serif' }}
                                    onClick={() => setReminderSettings(prev => ({ ...prev, every60Days: !prev.every60Days }))}
                                  >
                                    Every 60 days
                                  </label>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Signing Links Preview */}
                    {distributionMethod === 'NONE' && (
                      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 sm:p-6">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4" style={{ fontFamily: 'Avenir, sans-serif' }}>
                          Signing Links
                        </h3>
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <TbLink className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300" style={{ fontFamily: 'Avenir, sans-serif' }}>
                              Signing links will be generated
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400" style={{ fontFamily: 'Avenir, sans-serif' }}>
                            After sending, you'll receive signing links for each recipient that you can share manually.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Fixed Action Buttons */}
                <div className="bg-gray-100 dark:bg-gray-900 px-4 sm:px-6 pt-0 pb-6">
                  <div className="flex justify-end gap-1">
                    <button
                      onClick={() => setCurrentStep('preparation')}
                      className="lg:hidden px-4 sm:px-5 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-semibold mr-auto"
                      style={{ fontFamily: 'Avenir, sans-serif' }}
                    >
                      Previous
                    </button>
                    <button
                      onClick={onClose}
                      className="px-5 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-semibold"
                      style={{ fontFamily: 'Avenir, sans-serif' }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDistributionSubmit}
                      disabled={isSubmitting}
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-semibold"
                      style={{ fontFamily: 'Avenir, sans-serif' }}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Sending...
                        </div>
                      ) : (
                        'Send'
                      )}
                    </button>
                  </div>
                </div>
              </div>


            </>
          )}
        </div>
      </div>
    </div>
  );
}; 