import Cookies from 'js-cookie';
import { Task } from '@/types/task';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface TaskResponse {
  tasks: Task[];
}

export class TaskService {
  private static getAuthHeaders(): HeadersInit {
    const token = Cookies.get('auth_token');
    return {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
  }

  // Get all tasks from all contracts
  static async getAllTasks(): Promise<Task[]> {
    try {
      // First, get all contracts
      const contractsResponse = await fetch(`${API_BASE_URL}/api/contracts`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!contractsResponse.ok) {
        throw new Error('Failed to fetch contracts');
      }

      const contractsData = await contractsResponse.json();
      const allTasks: Task[] = [];

      // For each contract, fetch its tasks
      for (const contract of contractsData.contracts) {
        try {
          const tasksResponse = await fetch(`${API_BASE_URL}/api/contracts/${contract.id}/tasks`, {
            method: 'GET',
            headers: this.getAuthHeaders(),
          });

          if (tasksResponse.ok) {
            const tasksData = await tasksResponse.json();
            if (tasksData.tasks && Array.isArray(tasksData.tasks)) {
              // Map the API task format to our Task interface
              const contractTasks = tasksData.tasks.map((task: any) => ({
                id: task.id,
                code: task.code || `TSK-${task.id}`,
                title: task.title,
                contractId: contract.id,
                contractName: contract.title,
                type: task.type || 'Task',
                due: task.dueDate || task.due,
                progress: task.progress || '0 of 0',
                assignee: task.assignee || 'Unassigned',
                assigneeInitials: task.assignee ? task.assignee.split(' ').map((n: string) => n[0]).join('') : 'U',
                assigneeColor: 'bg-blue-200 text-blue-700',
                taskNumber: parseInt(task.id) || 0,
                description: task.description || '',
                status: task.status || 'To Do',
                subtasks: task.subtasks || [],
              }));
              allTasks.push(...contractTasks);
            }
          }
        } catch (error) {
          console.error(`Failed to fetch tasks for contract ${contract.id}:`, error);
        }
      }

      return allTasks;
    } catch (error) {
      console.error('Get all tasks error:', error);
      // Return empty array if API fails
      return [];
    }
  }

  // Get tasks for a specific contract
  static async getContractTasks(contractId: string): Promise<Task[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/contracts/${contractId}/tasks`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }

      const data = await response.json();
      
      // Map the API task format to our Task interface
      if (data.tasks && Array.isArray(data.tasks)) {
        return data.tasks.map((task: any) => ({
          id: task.id,
          code: task.code || `TSK-${task.id}`,
          title: task.title,
          contractId: contractId,
          type: task.type || 'Task',
          due: task.dueDate || task.due,
          progress: task.progress || '0 of 0',
          assignee: task.assignee || 'Unassigned',
          assigneeInitials: task.assignee ? task.assignee.split(' ').map((n: string) => n[0]).join('') : 'U',
          assigneeColor: 'bg-blue-200 text-blue-700',
          taskNumber: parseInt(task.id) || 0,
          description: task.description || '',
          status: task.status || 'To Do',
          subtasks: task.subtasks || [],
        }));
      }
      
      return [];
    } catch (error) {
      console.error('Get contract tasks error:', error);
      return [];
    }
  }

  // Create a new task
  static async createTask(contractId: string, taskData: Partial<Task>): Promise<Task | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/contracts/${contractId}/tasks`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          title: taskData.title,
          description: taskData.description,
          status: taskData.status || 'To Do',
          assignee: taskData.assignee,
          dueDate: taskData.due,
          type: taskData.type || 'Task'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create task');
      }

      const createdTask = await response.json();
      
      // Map the response to our Task interface
      return {
        id: createdTask.id,
        code: createdTask.code || `TSK-${createdTask.id}`,
        title: createdTask.title,
        contractId: contractId,
        type: createdTask.type || 'Task',
        due: createdTask.dueDate || createdTask.due,
        progress: createdTask.progress || '0 of 0',
        assignee: createdTask.assignee || 'Unassigned',
        assigneeInitials: createdTask.assignee ? createdTask.assignee.split(' ').map((n: string) => n[0]).join('') : 'U',
        assigneeColor: 'bg-blue-200 text-blue-700',
        taskNumber: parseInt(createdTask.id) || 0,
        description: createdTask.description || '',
        status: createdTask.status || 'To Do',
        subtasks: createdTask.subtasks || []
      };
    } catch (error) {
      console.error('Create task error:', error);
      return null;
    }
  }

  // Update a task
  static async updateTask(contractId: string, taskId: string, updates: Partial<Task>): Promise<Task | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/contracts/${contractId}/tasks/${taskId}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          title: updates.title,
          description: updates.description,
          status: updates.status,
          assignee: updates.assignee,
          dueDate: updates.due,
          type: updates.type,
          subtasks: updates.subtasks
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update task');
      }

      const updatedTask = await response.json();
      
      // Map the response to our Task interface
      return {
        id: updatedTask.id,
        code: updatedTask.code || `TSK-${updatedTask.id}`,
        title: updatedTask.title,
        contractId: contractId,
        type: updatedTask.type || 'Task',
        due: updatedTask.dueDate || updatedTask.due,
        progress: updatedTask.progress || '0 of 0',
        assignee: updatedTask.assignee || 'Unassigned',
        assigneeInitials: updatedTask.assignee ? updatedTask.assignee.split(' ').map((n: string) => n[0]).join('') : 'U',
        assigneeColor: 'bg-blue-200 text-blue-700',
        taskNumber: parseInt(updatedTask.id) || 0,
        description: updatedTask.description || '',
        status: updatedTask.status || 'To Do',
        subtasks: updatedTask.subtasks || [],
      };
    } catch (error) {
      console.error('Update task error:', error);
      return null;
    }
  }

  // Delete a task
  static async deleteTask(contractId: string, taskId: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/contracts/${contractId}/tasks/${taskId}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });

      return response.ok;
    } catch (error) {
      console.error('Delete task error:', error);
      return false;
    }
  }
}