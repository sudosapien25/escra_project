import { create } from 'zustand';
import { Task, Subtask } from '@/types/task';
import { TaskService } from '@/services/taskService';

interface TaskStore {
  tasks: Task[];
  editingTaskId: string | null;
  columns: {
    'To Do': Task[];
    'Blocked': Task[];
    'On Hold': Task[];
    'In Progress': Task[];
    'In Review': Task[];
    'Done': Task[];
    'Canceled': Task[];
  };
  isLoading: boolean;
  error: string | null;
  initializeTasks: () => Promise<void>;
  fetchTasks: () => Promise<void>;
  updateTask: (taskId: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  addTask: (task: Task) => Promise<void>;
  updateTaskStatus: (taskId: string, status: Task['status']) => Promise<void>;
  updateSubtasks: (taskId: string, subtasks: Subtask[]) => Promise<void>;
  setEditingTaskId: (taskId: string | null) => void;
  moveTask: (taskId: string, sourceStatus: Task['status'], destStatus: Task['status']) => void;
  getTasksByContract: (contractId: string) => Task[];
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  editingTaskId: null,
  columns: {
    'To Do': [],
    'Blocked': [],
    'On Hold': [],
    'In Progress': [],
    'In Review': [],
    'Done': [],
    'Canceled': [],
  },
  isLoading: false,
  error: null,

  initializeTasks: async () => {
    const { fetchTasks } = get();
    await fetchTasks();
  },

  fetchTasks: async () => {
    set({ isLoading: true, error: null });
    try {
      const tasks = await TaskService.getAllTasks();
      
      // Organize tasks by status
      const columns = {
        'To Do': [] as Task[],
        'Blocked': [] as Task[],
        'On Hold': [] as Task[],
        'In Progress': [] as Task[],
        'In Review': [] as Task[],
        'Done': [] as Task[],
        'Canceled': [] as Task[],
      };

      tasks.forEach(task => {
        const status = task.status as keyof typeof columns;
        if (columns[status]) {
          columns[status].push(task);
        }
      });

      set({ tasks, columns, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      set({ error: 'Failed to fetch tasks', isLoading: false });
    }
  },

  updateTask: async (taskId, updates) => {
    const { tasks } = get();
    const task = tasks.find(t => t.id === taskId);
    
    if (!task) return;

    try {
      const updatedTask = await TaskService.updateTask(task.contractId, taskId, updates);
      
      if (updatedTask) {
        const newTasks = tasks.map(t => t.id === taskId ? updatedTask : t);
        
        // Reorganize columns
        const columns = {
          'To Do': [] as Task[],
          'Blocked': [] as Task[],
          'On Hold': [] as Task[],
          'In Progress': [] as Task[],
          'In Review': [] as Task[],
          'Done': [] as Task[],
          'Canceled': [] as Task[],
        };

        newTasks.forEach(task => {
          const status = task.status as keyof typeof columns;
          if (columns[status]) {
            columns[status].push(task);
          }
        });

        set({ tasks: newTasks, columns });
      }
    } catch (error) {
      console.error('Failed to update task:', error);
      set({ error: 'Failed to update task' });
    }
  },

  deleteTask: async (taskId) => {
    const { tasks } = get();
    const task = tasks.find(t => t.id === taskId);
    
    if (!task) return;

    try {
      const success = await TaskService.deleteTask(task.contractId, taskId);
      
      if (success) {
        const newTasks = tasks.filter(t => t.id !== taskId);
        
        // Reorganize columns
        const columns = {
          'To Do': [] as Task[],
          'Blocked': [] as Task[],
          'On Hold': [] as Task[],
          'In Progress': [] as Task[],
          'In Review': [] as Task[],
          'Done': [] as Task[],
          'Canceled': [] as Task[],
        };

        newTasks.forEach(task => {
          const status = task.status as keyof typeof columns;
          if (columns[status]) {
            columns[status].push(task);
          }
        });

        set({ tasks: newTasks, columns });
      }
    } catch (error) {
      console.error('Failed to delete task:', error);
      set({ error: 'Failed to delete task' });
    }
  },

  addTask: async (task) => {
    try {
      const newTask = await TaskService.createTask(task.contractId, task);
      
      if (newTask) {
        const { tasks } = get();
        const newTasks = [...tasks, newTask];
        
        // Reorganize columns
        const columns = {
          'To Do': [] as Task[],
          'Blocked': [] as Task[],
          'On Hold': [] as Task[],
          'In Progress': [] as Task[],
          'In Review': [] as Task[],
          'Done': [] as Task[],
          'Canceled': [] as Task[],
        };

        newTasks.forEach(task => {
          const status = task.status as keyof typeof columns;
          if (columns[status]) {
            columns[status].push(task);
          }
        });

        set({ tasks: newTasks, columns });
      }
    } catch (error) {
      console.error('Failed to add task:', error);
      set({ error: 'Failed to add task' });
    }
  },

  updateTaskStatus: async (taskId, status) => {
    const { updateTask } = get();
    await updateTask(taskId, { status });
  },

  updateSubtasks: async (taskId, subtasks) => {
    const { updateTask } = get();
    await updateTask(taskId, { subtasks });
  },

  setEditingTaskId: (taskId) => set({ editingTaskId: taskId }),

  moveTask: (taskId, sourceStatus, destStatus) => {
    const { tasks, updateTaskStatus } = get();
    const task = tasks.find(t => t.id === taskId);
    
    if (task) {
      // Update task status
      updateTaskStatus(taskId, destStatus);
    }
  },

  getTasksByContract: (contractId) => {
    const { tasks } = get();
    return tasks.filter(task => task.contractId === contractId);
  },
}));