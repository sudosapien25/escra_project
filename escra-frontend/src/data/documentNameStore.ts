import { create } from 'zustand';

interface StoredDocument {
  id: string;
  name: string;
  type: string;
  size: number;
  content: string; // base64 encoded file content
  uploadedDate: string;
  contractId?: string;
  contractName?: string;
  assignee?: string;
  documentType?: string; // Custom document type field
}

interface DocumentStore {
  // Legacy support for existing document names
  documentNameMap: Record<string, string>;
  setDocumentName: (documentId: string, name: string) => void;
  getDocumentName: (documentId: string) => string | undefined;
  
  // New document storage with full file content
  documents: Record<string, StoredDocument>;
  addDocument: (file: File, contractId?: string, contractName?: string, uploadedBy?: string, assignee?: string, documentType?: string) => Promise<string>; // Returns document ID
  getDocument: (documentId: string) => StoredDocument | undefined;
  getDocumentsByContract: (contractId: string) => StoredDocument[];
  updateDocumentName: (documentId: string, newName: string) => void;
  removeDocument: (documentId: string) => void;
  getAllDocuments: () => StoredDocument[];
  updateDocumentContract: (documentId: string, contractId: string, contractName?: string) => void;
}

// Initial document names (legacy support)
const initialDocumentNames = {
  '1234': 'Contract Agreement',
  '2345': 'Terms and Conditions',
  '3456': 'Purchase Agreement',
  '4567': 'Service Contract',
  '5678': 'Lease Agreement',
  '6789': 'Employment Contract',
  '7890': 'NDA',
  '8901': 'Partnership Agreement',
  '9012': 'Sales Contract',
  '0123': 'Consulting Agreement'
};

// Helper function to convert File to base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the data URL prefix (e.g., "data:application/pdf;base64,")
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = error => reject(error);
  });
};

// Helper function to generate unique document ID in same format as mock documents
const generateDocumentId = (): string => {
  // Generate a 4-digit number starting from a high range to avoid conflicts with existing mock IDs
  // Mock IDs are 1234, 2345, 3456, etc. So we'll start from 8000+ range
  const randomId = Math.floor(Math.random() * 1000) + 8000;
  return randomId.toString();
};

// Helper function to migrate old document IDs to new format
const migrateDocumentIds = (documents: Record<string, StoredDocument>): Record<string, StoredDocument> => {
  const migratedDocuments: Record<string, StoredDocument> = {};
  
  Object.entries(documents).forEach(([oldId, doc]) => {
    // If document has old format ID (contains 'doc_'), migrate it
    if (oldId.startsWith('doc_')) {
      const newId = generateDocumentId();
      migratedDocuments[newId] = { ...doc, id: newId };
    } else {
      // Keep documents with numeric IDs as they are
      migratedDocuments[oldId] = doc;
    }
  });
  
  return migratedDocuments;
};

export const useDocumentStore = create<DocumentStore>((set, get) => {
  // Initialize legacy document names
  const storedNameMap = typeof window !== 'undefined' ? localStorage.getItem('documentNameMap') : null;
  const parsedNameMap = storedNameMap ? JSON.parse(storedNameMap) : {};
  const initialNameMap = { ...initialDocumentNames, ...parsedNameMap };

  // Initialize document storage
  const storedDocuments = typeof window !== 'undefined' ? localStorage.getItem('documentStore') : null;
  const parsedDocuments = storedDocuments ? JSON.parse(storedDocuments) : {};
  
  // Migrate any old document IDs to new format
  const migratedDocuments = migrateDocumentIds(parsedDocuments);
  
  // Save migrated documents back to localStorage if any changes were made
  if (typeof window !== 'undefined' && Object.keys(parsedDocuments).length !== Object.keys(migratedDocuments).length) {
    try {
      const documentsJson = JSON.stringify(migratedDocuments);
      
      // Check if the data is too large for localStorage
      const estimatedSize = new Blob([documentsJson]).size;
      const maxSize = 5 * 1024 * 1024; // 5MB limit
      
      if (estimatedSize > maxSize) {
        console.warn(`Document store size (${Math.round(estimatedSize / 1024 / 1024 * 100) / 100}MB) exceeds localStorage limit. Storing without content.`);
        
        // Store documents without content to avoid quota issues
        const documentsWithoutContent = Object.fromEntries(
          Object.entries(migratedDocuments).map(([id, doc]) => [
            id, 
            { ...doc, content: '' } // Remove content to save space
          ])
        );
        localStorage.setItem('documentStore', JSON.stringify(documentsWithoutContent));
      } else {
        localStorage.setItem('documentStore', documentsJson);
      }
    } catch (quotaError) {
      if (quotaError.name === 'QuotaExceededError') {
        console.warn('localStorage quota exceeded. Storing documents without content to save space.');
        
        // Store documents without content to avoid quota issues
        const documentsWithoutContent = Object.fromEntries(
          Object.entries(migratedDocuments).map(([id, doc]) => [
            id, 
            { ...doc, content: '' } // Remove content to save space
          ])
        );
        localStorage.setItem('documentStore', JSON.stringify(documentsWithoutContent));
      } else {
        throw quotaError;
      }
    }
  }

  return {
    // Legacy support
    documentNameMap: initialNameMap,
    setDocumentName: (documentId: string, name: string) => {
      const newMap = { ...get().documentNameMap, [documentId]: name };
      set({ documentNameMap: newMap });
      if (typeof window !== 'undefined') {
        localStorage.setItem('documentNameMap', JSON.stringify(newMap));
      }
    },
    getDocumentName: (documentId: string) => get().documentNameMap[documentId],

    // New document storage
    documents: migratedDocuments,

    addDocument: async (file: File, contractId?: string, contractName?: string, uploadedBy?: string, assignee?: string, documentType?: string): Promise<string> => {
      try {
        const content = await fileToBase64(file);
        const documentId = generateDocumentId();
        
        const storedDocument: StoredDocument = {
          id: documentId,
          name: file.name,
          type: file.type,
          size: file.size,
          content,
          uploadedDate: new Date().toISOString(),
          contractId,
          contractName,
          assignee,
          documentType
        };

        const newDocuments = { ...get().documents, [documentId]: storedDocument };
        set({ documents: newDocuments });

        // Persist to localStorage with quota management
        if (typeof window !== 'undefined') {
          try {
            const documentsJson = JSON.stringify(newDocuments);
            
            // Check if the data is too large for localStorage
            const estimatedSize = new Blob([documentsJson]).size;
            const maxSize = 5 * 1024 * 1024; // 5MB limit
            
            if (estimatedSize > maxSize) {
              console.warn(`Document store size (${Math.round(estimatedSize / 1024 / 1024 * 100) / 100}MB) exceeds localStorage limit. Storing without content.`);
              
              // Store documents without content to avoid quota issues
              const documentsWithoutContent = Object.fromEntries(
                Object.entries(newDocuments).map(([id, doc]) => [
                  id, 
                  { ...doc, content: '' } // Remove content to save space
                ])
              );
              localStorage.setItem('documentStore', JSON.stringify(documentsWithoutContent));
            } else {
              localStorage.setItem('documentStore', documentsJson);
            }
          } catch (quotaError) {
            if (quotaError.name === 'QuotaExceededError') {
              console.warn('localStorage quota exceeded. Storing documents without content to save space.');
              
              // Store documents without content to avoid quota issues
              const documentsWithoutContent = Object.fromEntries(
                Object.entries(newDocuments).map(([id, doc]) => [
                  id, 
                  { ...doc, content: '' } // Remove content to save space
                ])
              );
              localStorage.setItem('documentStore', JSON.stringify(documentsWithoutContent));
            } else {
              throw quotaError;
            }
          }
        }

        return documentId;
      } catch (error) {
        console.error('Error storing document:', error);
        throw error;
      }
    },

    getDocument: (documentId: string) => get().documents[documentId],

    getDocumentsByContract: (contractId: string) => {
      const documents = get().documents;
      return Object.values(documents).filter(doc => doc.contractId === contractId);
    },

    updateDocumentName: (documentId: string, newName: string) => {
      const documents = get().documents;
      if (documents[documentId]) {
        const updatedDocument = { ...documents[documentId], name: newName };
        const newDocuments = { ...documents, [documentId]: updatedDocument };
        set({ documents: newDocuments });

        if (typeof window !== 'undefined') {
          try {
            const documentsJson = JSON.stringify(newDocuments);
            
            // Check if the data is too large for localStorage
            const estimatedSize = new Blob([documentsJson]).size;
            const maxSize = 5 * 1024 * 1024; // 5MB limit
            
            if (estimatedSize > maxSize) {
              console.warn(`Document store size (${Math.round(estimatedSize / 1024 / 1024 * 100) / 100}MB) exceeds localStorage limit. Storing without content.`);
              
              // Store documents without content to avoid quota issues
              const documentsWithoutContent = Object.fromEntries(
                Object.entries(newDocuments).map(([id, doc]) => [
                  id, 
                  { ...doc, content: '' } // Remove content to save space
                ])
              );
              localStorage.setItem('documentStore', JSON.stringify(documentsWithoutContent));
            } else {
              localStorage.setItem('documentStore', documentsJson);
            }
          } catch (quotaError) {
            if (quotaError.name === 'QuotaExceededError') {
              console.warn('localStorage quota exceeded. Storing documents without content to save space.');
              
              // Store documents without content to avoid quota issues
              const documentsWithoutContent = Object.fromEntries(
                Object.entries(newDocuments).map(([id, doc]) => [
                  id, 
                  { ...doc, content: '' } // Remove content to save space
                ])
              );
              localStorage.setItem('documentStore', JSON.stringify(documentsWithoutContent));
            } else {
              throw quotaError;
            }
          }
        }
      }
    },

    removeDocument: (documentId: string) => {
      const documents = get().documents;
      const { [documentId]: removed, ...remainingDocuments } = documents;
      set({ documents: remainingDocuments });

      if (typeof window !== 'undefined') {
        try {
          const documentsJson = JSON.stringify(remainingDocuments);
          
          // Check if the data is too large for localStorage
          const estimatedSize = new Blob([documentsJson]).size;
          const maxSize = 5 * 1024 * 1024; // 5MB limit
          
          if (estimatedSize > maxSize) {
            console.warn(`Document store size (${Math.round(estimatedSize / 1024 / 1024 * 100) / 100}MB) exceeds localStorage limit. Storing without content.`);
            
            // Store documents without content to avoid quota issues
            const documentsWithoutContent = Object.fromEntries(
              Object.entries(remainingDocuments).map(([id, doc]) => [
                id, 
                { ...doc, content: '' } // Remove content to save space
              ])
            );
            localStorage.setItem('documentStore', JSON.stringify(documentsWithoutContent));
          } else {
            localStorage.setItem('documentStore', documentsJson);
          }
        } catch (quotaError) {
          if (quotaError.name === 'QuotaExceededError') {
            console.warn('localStorage quota exceeded. Storing documents without content to save space.');
            
            // Store documents without content to avoid quota issues
            const documentsWithoutContent = Object.fromEntries(
              Object.entries(remainingDocuments).map(([id, doc]) => [
                id, 
                { ...doc, content: '' } // Remove content to save space
              ])
            );
            localStorage.setItem('documentStore', JSON.stringify(documentsWithoutContent));
          } else {
            throw quotaError;
          }
        }
      }
    },

    getAllDocuments: () => Object.values(get().documents),

    updateDocumentContract: (documentId: string, contractId: string, contractName?: string) => {
      const documents = get().documents;
      if (documents[documentId]) {
        const updatedDocument = { ...documents[documentId], contractId, contractName };
        const newDocuments = { ...documents, [documentId]: updatedDocument };
        set({ documents: newDocuments });

        if (typeof window !== 'undefined') {
          localStorage.setItem('documentStore', JSON.stringify(newDocuments));
        }
      }
    }
  };
});

// Export legacy hook for backward compatibility
export const useDocumentNameStore = useDocumentStore; 