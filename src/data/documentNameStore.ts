import { create } from 'zustand';

interface DocumentNameStore {
  documentNameMap: Record<string, string>;
  setDocumentName: (documentId: string, name: string) => void;
  getDocumentName: (documentId: string) => string | undefined;
}

// Initial document names
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

export const useDocumentNameStore = create<DocumentNameStore>((set, get) => {
  // Initialize store with initial document names
  const storedMap = typeof window !== 'undefined' ? localStorage.getItem('documentNameMap') : null;
  const parsedMap = storedMap ? JSON.parse(storedMap) : {};
  
  // Always merge with initial document names to ensure they're available
  const initialMap = { ...initialDocumentNames, ...parsedMap };

  return {
    documentNameMap: initialMap,
    setDocumentName: (documentId: string, name: string) => {
      const newMap = { ...get().documentNameMap, [documentId]: name };
      set({ documentNameMap: newMap });
      if (typeof window !== 'undefined') {
        localStorage.setItem('documentNameMap', JSON.stringify(newMap));
      }
    },
    getDocumentName: (documentId: string) => get().documentNameMap[documentId]
  };
}); 