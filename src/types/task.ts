export interface Task {
  id: string;
  code: string;
  title: string;
  contractId: string;
  type: string;
  due: string;
  progress: string;
  assignee: string;
  assigneeInitials: string;
  assigneeColor: string;
  taskNumber: number;
  description: string;
  status: 'To Do' | 'Blocked' | 'On Hold' | 'In Progress' | 'In Review' | 'Done' | 'Canceled';
  subtasks: Subtask[];
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
} 