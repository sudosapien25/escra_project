import { create } from 'zustand';
import { Task, Subtask } from '@/types/task';

// Mock data for development
const mockTasks: Task[] = [
  // Contract 9548 - New Property Acquisition
  {
    id: '101',
    code: 'TSK-003',
    title: 'Verify Payment Schedule',
    contractId: '9548',
    type: 'Task',
    due: 'May 20, 2025',
    progress: '0 of 2',
    assignee: 'Michael Brown',
    assigneeInitials: 'MB',
    assigneeColor: 'bg-purple-200 text-purple-700',
    taskNumber: 101,
    description: 'Review and confirm all payment milestones and schedules.',
    status: 'To Do',
    subtasks: [
      {
        id: 'sub-101-1',
        title: 'Review initial payment terms',
        completed: false
      },
      {
        id: 'sub-101-2',
        title: 'Verify milestone dates',
        completed: false
      },
      {
        id: 'sub-101-3',
        title: 'Confirm payment methods',
        completed: false
      }
    ]
  },
  {
    id: '102',
    code: 'TSK-004',
    title: 'Title Search',
    contractId: '9548',
    type: 'Task',
    due: 'May 21, 2025',
    progress: '0 of 3',
    assignee: 'Robert Green',
    assigneeInitials: 'RG',
    assigneeColor: 'bg-pink-200 text-pink-700',
    taskNumber: 102,
    description: 'Conduct thorough title search and verify ownership.',
    status: 'In Progress',
    subtasks: [
      {
        id: 'sub-102-1',
        title: 'Request title documents',
        completed: true
      },
      {
        id: 'sub-102-2',
        title: 'Review title history',
        completed: false
      },
      {
        id: 'sub-102-3',
        title: 'Check for liens',
        completed: false
      }
    ]
  },
  {
    id: '103',
    code: 'TSK-005',
    title: 'Property Inspection',
    contractId: '9548',
    type: 'Task',
    due: 'May 22, 2025',
    progress: '0 of 2',
    assignee: 'Emily Davis',
    assigneeInitials: 'ED',
    assigneeColor: 'bg-blue-200 text-blue-700',
    taskNumber: 103,
    description: 'Schedule and complete property inspection.',
    status: 'Blocked',
    subtasks: [
      {
        id: 'sub-103-1',
        title: 'Schedule inspection date',
        completed: false
      },
      {
        id: 'sub-103-2',
        title: 'Prepare inspection checklist',
        completed: false
      },
      {
        id: 'sub-103-3',
        title: 'Coordinate with property owner',
        completed: false
      }
    ]
  },
  // Contract 9550 - Land Development Contract
  {
    id: '104',
    code: 'TSK-008',
    title: 'Environmental Assessment',
    contractId: '9550',
    type: 'Task',
    due: 'May 22, 2025',
    progress: '0 of 3',
    assignee: 'Robert Green',
    assigneeInitials: 'RG',
    assigneeColor: 'bg-pink-200 text-pink-700',
    taskNumber: 104,
    description: 'Conduct environmental impact assessment for the land development.',
    status: 'To Do',
    subtasks: [
      {
        id: 'sub-104-1',
        title: 'Hire environmental consultant',
        completed: false
      },
      {
        id: 'sub-104-2',
        title: 'Review site conditions',
        completed: false
      },
      {
        id: 'sub-104-3',
        title: 'Prepare assessment report',
        completed: false
      }
    ]
  },
  {
    id: '105',
    code: 'TSK-009',
    title: 'Zoning Verification',
    contractId: '9550',
    type: 'Task',
    due: 'May 23, 2025',
    progress: '0 of 2',
    assignee: 'Emily Davis',
    assigneeInitials: 'ED',
    assigneeColor: 'bg-blue-200 text-blue-700',
    taskNumber: 105,
    description: 'Verify zoning regulations and obtain necessary permits.',
    status: 'In Review',
    subtasks: [
      {
        id: 'sub-105-1',
        title: 'Check current zoning status',
        completed: true
      },
      {
        id: 'sub-105-2',
        title: 'Apply for permits',
        completed: false
      },
      {
        id: 'sub-105-3',
        title: 'Review zoning restrictions',
        completed: false
      }
    ]
  },
  {
    id: '106',
    code: 'TSK-010',
    title: 'Development Plan Review',
    contractId: '9550',
    type: 'Task',
    due: 'May 24, 2025',
    progress: '0 of 4',
    assignee: 'Michael Brown',
    assigneeInitials: 'MB',
    assigneeColor: 'bg-purple-200 text-purple-700',
    taskNumber: 106,
    description: 'Review and approve land development plans.',
    status: 'Done',
    subtasks: [
      {
        id: 'sub-106-1',
        title: 'Review architectural plans',
        completed: true
      },
      {
        id: 'sub-106-2',
        title: 'Check engineering specifications',
        completed: true
      },
      {
        id: 'sub-106-3',
        title: 'Verify compliance with regulations',
        completed: true
      }
    ]
  }
];

interface TaskState {
  tasks: Task[];
  selectedTask: Task | null;
  setSelectedTask: (task: Task | null) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  moveTask: (taskId: string, newStatus: Task['status']) => void;
  addTask: (task: Task) => void;
  deleteTask: (taskId: string) => void;
  getTasksByStatus: (status: Task['status']) => Task[];
  getTasksByContract: (contractId: string) => Task[];
  getTaskById: (taskId: string) => Task | undefined;
  initializeTasks: () => void;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: mockTasks, // Initialize with mock tasks by default
  selectedTask: null,

  setSelectedTask: (task) => set({ selectedTask: task }),

  updateTask: (taskId, updates) => set((state) => {
    const newTasks = state.tasks.map((task) =>
      task.code === taskId ? { ...task, ...updates } : task
    );
    console.log('Saving tasks to localStorage:', newTasks);
    if (typeof window !== 'undefined') {
      localStorage.setItem('tasks', JSON.stringify(newTasks));
    }
    return { tasks: newTasks };
  }),

  moveTask: (taskId, newStatus) => set((state) => {
    const newTasks = state.tasks.map((task) =>
      task.code === taskId ? { ...task, status: newStatus } : task
    );
    if (typeof window !== 'undefined') {
      localStorage.setItem('tasks', JSON.stringify(newTasks));
    }
    return { tasks: newTasks };
  }),

  addTask: (task) => set((state) => {
    const newTasks = [...state.tasks, task];
    if (typeof window !== 'undefined') {
      localStorage.setItem('tasks', JSON.stringify(newTasks));
    }
    return { tasks: newTasks };
  }),

  deleteTask: (taskId) => set((state) => {
    const newTasks = state.tasks.filter((task) => task.code !== taskId);
    if (typeof window !== 'undefined') {
      localStorage.setItem('tasks', JSON.stringify(newTasks));
    }
    return { tasks: newTasks };
  }),

  getTasksByStatus: (status) => {
    const tasks = get().tasks.filter((task) => task.status === status);
    console.log(`Getting tasks for status ${status}:`, tasks);
    return tasks;
  },

  getTasksByContract: (contractId) => {
    const tasks = get().tasks.filter((task) => task.contractId === contractId);
    console.log(`Getting tasks for contract ${contractId}:`, tasks);
    return tasks;
  },

  getTaskById: (taskId) => get().tasks.find((task) => task.code === taskId),

  initializeTasks: () => {
    if (typeof window !== 'undefined') {
      const savedTasks = localStorage.getItem('tasks');
      if (savedTasks) {
        try {
          const parsedTasks = JSON.parse(savedTasks);
          set({ tasks: parsedTasks });
        } catch (error) {
          console.error('Error parsing saved tasks:', error);
          localStorage.setItem('tasks', JSON.stringify(mockTasks));
          set({ tasks: mockTasks });
        }
      } else {
        localStorage.setItem('tasks', JSON.stringify(mockTasks));
        set({ tasks: mockTasks });
      }
    }
  }
})); 