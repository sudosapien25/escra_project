import { create } from 'zustand';

interface AssigneeStore {
  assigneeMap: Record<string, string>;
  allAssignees: string[];
  setAssignee: (documentId: string, assignee: string) => void;
  getAssignee: (documentId: string) => string | undefined;
}

// Initial assignees for documents
const initialAssignees = {
  '1234': 'John Smith',
  '2345': 'Sarah Johnson',
  '3456': 'Michael Brown',
  '4567': 'Emma Johnson',
  '5678': 'Robert Chen',
  '6789': 'Sarah Miller',
  '7890': 'David Miller',
  '8901': 'Emily Davis',
  '9012': 'Alex Johnson',
  '0123': 'Samantha Fox'
};

// Get unique initial assignees
const initialUniqueAssignees = Array.from(new Set(Object.values(initialAssignees))).sort();

export const useAssigneeStore = create<AssigneeStore>((set, get) => {
  // Initialize store with initial assignees
  const storedMap = typeof window !== 'undefined' ? localStorage.getItem('assigneeMap') : null;
  const parsedMap = storedMap ? JSON.parse(storedMap) : {};
  
  // Always merge with initial assignees to ensure they're available
  const initialMap = { ...initialAssignees, ...parsedMap };
  
  // Get all unique assignees, including initial ones
  const allAssignees = Array.from(new Set([...initialUniqueAssignees, ...Object.values(parsedMap as Record<string, string>)])).sort();

  return {
    assigneeMap: initialMap,
    allAssignees,
    setAssignee: (documentId: string, assignee: string) => {
      const newMap = { ...get().assigneeMap, [documentId]: assignee };
      // Update allAssignees to include the new assignee
      const newAllAssignees = Array.from(new Set([...initialUniqueAssignees, ...Object.values(newMap)])).sort();
      set({ assigneeMap: newMap, allAssignees: newAllAssignees });
      if (typeof window !== 'undefined') {
        localStorage.setItem('assigneeMap', JSON.stringify(newMap));
      }
    },
    getAssignee: (documentId: string) => get().assigneeMap[documentId]
  };
}); 