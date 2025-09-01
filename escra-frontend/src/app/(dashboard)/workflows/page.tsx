'use client';
import React, { useRef, useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { mockContracts } from '@/data/mockContracts';
import { Task } from '@/types/task';

// Icons
import { HiOutlineViewBoards, HiOutlinePencil } from 'react-icons/hi';
import { CgPlayPauseR, CgPlayStopR } from 'react-icons/cg';
import { BsPerson } from 'react-icons/bs';
import { LuCalendarClock, LuSendHorizontal, LuCalendarFold, LuTable2, LuListTodo, LuListPlus } from 'react-icons/lu';
import { FaPlus, FaCheckCircle, FaCheck } from 'react-icons/fa';
import { FaRetweet } from 'react-icons/fa6';
import { PiListMagnifyingGlassBold, PiListPlusBold, PiDotsThreeOutline, PiCaretUpDown } from 'react-icons/pi';
import { FaRegSquareCheck } from 'react-icons/fa6';
import { BiDotsHorizontal, BiCommentAdd } from 'react-icons/bi';
import { MdCancelPresentation, MdOutlineLibraryAddCheck } from 'react-icons/md';
import { MdOutlineLightMode, MdOutlineDarkMode } from 'react-icons/md';
import { RiUserSearchLine, RiKanbanView2 } from 'react-icons/ri';
import { HiOutlineDocumentSearch } from 'react-icons/hi';
import { TbDeviceDesktopPlus, TbBrandGoogleDrive, TbBrandOnedrive, TbLibraryPlus, TbEdit, TbStatusChange, TbHistory, TbCategoryPlus, TbDragDrop, TbPencil, TbSubtask, TbSearch, TbFileSearch, TbDownload, TbCalendarClock, TbCancel, TbList, TbListSearch, TbUpload, TbLibrary, TbLibraryMinus, TbChevronDown, TbMessage2Plus, TbTrash, TbChevronsLeft, TbChevronsRight, TbUserSearch, TbLayoutGrid, TbCategory2, TbEye, TbPlus } from 'react-icons/tb';
import { SiBox } from 'react-icons/si';
import { SlSocialDropbox } from 'react-icons/sl';

// TipTap
import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { lowlight } from 'lowlight';
import Strike from '@tiptap/extension-strike';

// Add date formatting utilities
function formatDateToInput(dateStr: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '';
  // Adjust for timezone offset to prevent date shifting
  const offset = d.getTimezoneOffset();
  d.setMinutes(d.getMinutes() + offset);
  return d.toISOString().slice(0, 10);
}

function formatDatePretty(dateStr: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  // Adjust for timezone offset to prevent date shifting
  const offset = d.getTimezoneOffset();
  d.setMinutes(d.getMinutes() + offset);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

// Add Comment interface
interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  avatarColor: string;
  textColor: string;
}

// Use the task store
import { useTaskStore } from '@/data/taskStore';
import { Logo } from '@/components/common/Logo';
import { useToast } from '@/components/ui/use-toast';
import { ContractsToaster } from '@/components/ui/contracts-toaster';
import { useNotifications } from '@/context/NotificationContext';

type TaskStatus = 'To Do' | 'Blocked' | 'On Hold' | 'In Progress' | 'In Review' | 'Done' | 'Canceled';
type StatusOption = TaskStatus | 'All';

export default function WorkflowsPage() {
  const { toast } = useToast();
  const { addTaskCreatedNotification, addTaskDeletedNotification } = useNotifications();

  // Test function to generate multiple toast notifications
  const generateTestToasts = () => {
    // Generate test toasts with actual task style and text
    const testTaskId = "1001";
    const testTaskTitle = "Test Task";
    const testContractId = "1234";
    const testContractTitle = "Test Contract";
    
    // 1. Task Created Successfully
    toast({
      title: "Task Created Successfully",
              description: `"${testTaskTitle}" with Task ID #${testTaskId} has been created for Contract ID #${testContractId} - ${testContractTitle}`,
      duration: 30000,
    });
    
    // Add notification for test task created
    addTaskCreatedNotification(testTaskId, testTaskTitle, testContractId, testContractTitle);

    // 2. Task Deleted Successfully (after a delay)
    setTimeout(() => {
      toast({
        title: "Task Deleted Successfully",
        description: `"${testTaskTitle}" with Task ID #${testTaskId} associated with Contract ID #${testContractId} - ${testContractTitle} has been deleted`,
        variant: "voided",
        duration: 30000,
      });
      
      // Add notification for test task deleted
      addTaskDeletedNotification(testTaskId, testTaskTitle, testContractId, testContractTitle);
    }, 1000); // 1 second delay
  };
  const [kanbanTab, setKanbanTab] = React.useState('All');
  const kanbanTabs = ['All', 'Active', 'Upcoming'];
  const [taskSearchTerm, setTaskSearchTerm] = React.useState('');
  const [openMenuTask, setOpenMenuTask] = React.useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [selectedAssignee, setSelectedAssignee] = React.useState('All');
  const [selectedContract, setSelectedContract] = React.useState('All');
  const [selectedStatuses, setSelectedStatuses] = useState<StatusOption[]>(['All']);
  const [selectedAssignees, setSelectedAssignees] = React.useState<string[]>([]);
  const [selectedContracts, setSelectedContracts] = React.useState<string[]>([]);
  const [openAssigneeDropdown, setOpenAssigneeDropdown] = React.useState(false);
  const [openContractDropdown, setOpenContractDropdown] = React.useState(false);
  const [openStatusDropdown, setOpenStatusDropdown] = React.useState(false);
  const assigneeButtonRef = useRef<HTMLButtonElement>(null);
  const contractButtonRef = useRef<HTMLButtonElement>(null);
  const statusButtonRef = useRef<HTMLButtonElement>(null);
  const [openColumnMenu, setOpenColumnMenu] = React.useState<string | null>(null);
  const columnMenuRef = useRef<HTMLDivElement>(null);
  const [editedTaskTitle, setEditedTaskTitle] = React.useState('');
  const [editedContractName, setEditedContractName] = React.useState('');
  const [editedDueDate, setEditedDueDate] = React.useState('');
  const [editedAssignee, setEditedAssignee] = React.useState('');
  // Contracts state that includes both mock contracts and newly created contracts
  const [contracts, setContracts] = useState(mockContracts);
  
  const [contractSearch, setContractSearch] = useState('');
  const [showContractDropdown, setShowContractDropdown] = useState(false);
  const filteredContracts = contracts.filter(c => c.title.toLowerCase().includes(contractSearch.toLowerCase()));
  const contractDropdownRef = useRef<HTMLDivElement>(null);
  const assigneeDropdownRef = useRef<HTMLDivElement>(null);
  const [showAssigneeDropdown, setShowAssigneeDropdown] = React.useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = React.useState(false);
  const statusDropdownRef = useRef<HTMLDivElement>(null);
  const [showModalStatusDropdown, setShowModalStatusDropdown] = React.useState(false);
  const modalStatusDropdownRef = useRef<HTMLDivElement>(null);
  const [editingCommentId, setEditingCommentId] = React.useState<string | null>(null);
  const [showNewTaskModal, setShowNewTaskModal] = React.useState(false);
  const [showUploadModal, setShowUploadModal] = React.useState(false);
  const [uploadTaskId, setUploadTaskId] = React.useState<string | null>(null);
  const [uploadModalFiles, setUploadModalFiles] = React.useState<File[]>([]);
  const [taskCounts, setTaskCounts] = useState({
    total: 0,
    todo: 0,
    inProgress: 0,
    done: 0,
    blocked: 0,
    onHold: 0,
    inReview: 0,
    canceled: 0,
  });
  const taskDetailsAssigneeDropdownRef = useRef<HTMLDivElement>(null);
  const taskDetailsAssigneeInputRef = useRef<HTMLInputElement>(null);
  // Mobile filter refs
  const mobileAssigneeButtonRef = useRef<HTMLButtonElement>(null);
  const mobileContractButtonRef = useRef<HTMLButtonElement>(null);
  const mobileStatusButtonRef = useRef<HTMLButtonElement>(null);
  const mobileAssigneeDropdownRef = useRef<HTMLDivElement>(null);
  const mobileContractDropdownRef = useRef<HTMLDivElement>(null);
  const mobileStatusDropdownRef = useRef<HTMLDivElement>(null);
  // Ref for Kanban board container
  const kanbanBoardRef = React.useRef<HTMLDivElement>(null);
  // Add state and ref near other upload modal state
  const [selectedUploadSource, setSelectedUploadSource] = useState<string | null>(null);
  const [showUploadDropdown, setShowUploadDropdown] = useState(false);
  const uploadDropdownRef = useRef<HTMLDivElement>(null);
  const [showClickToUploadDropdown, setShowClickToUploadDropdown] = useState(false);
  const clickToUploadDropdownRef = useRef<HTMLDivElement>(null);
  
  // Add state for upload modal assignee dropdown
  const [uploadModalAssignee, setUploadModalAssignee] = useState<string>('');
  const [uploadModalDocumentName, setUploadModalDocumentName] = useState<string>('');
  const [showUploadModalAssigneeDropdown, setShowUploadModalAssigneeDropdown] = useState(false);
  const uploadModalAssigneeDropdownRef = useRef<HTMLDivElement>(null);
  const uploadModalAssigneeInputRef = useRef<HTMLInputElement>(null);
  
  // State for tracking added documents in upload modal
  const [uploadModalAddedDocuments, setUploadModalAddedDocuments] = useState<Array<{
    files: File[];
    documentName: string;
  }>>([]);
  
  // State for inline editing of upload modal documents
  const [editingUploadModalDocumentIndex, setEditingUploadModalDocumentIndex] = useState<number | null>(null);
  const [inlineEditingUploadModalDocumentName, setInlineEditingUploadModalDocumentName] = useState('');
  
  // Add state for task files
  const [taskFiles, setTaskFiles] = useState<Record<string, any>>({});
  
  // Add state for document name editing in task details modal
  const [editingDocumentName, setEditingDocumentName] = useState<string | null>(null);
  const [customDocumentNames, setCustomDocumentNames] = useState<Record<string, string>>({});
  
  // Add state for new subtask modal
  const [showNewSubtaskModal, setShowNewSubtaskModal] = useState(false);
  const [newSubtaskForm, setNewSubtaskForm] = useState({
    title: '',
    assignee: '',
    status: 'To Do' as TaskStatus,
    dueDate: '',
    description: ''
  });
  const [newSubtaskFormErrors, setNewSubtaskFormErrors] = useState<Record<string, boolean>>({});
  const [showNewSubtaskModalAssigneeDropdown, setShowNewSubtaskModalAssigneeDropdown] = useState(false);
  const [showNewSubtaskModalStatusDropdown, setShowNewSubtaskModalStatusDropdown] = useState(false);
  const newSubtaskModalAssigneeDropdownRef = useRef<HTMLDivElement>(null);
  const newSubtaskModalStatusDropdownRef = useRef<HTMLDivElement>(null);
  
  // Add state for edit subtask modal
  const [showEditSubtaskModal, setShowEditSubtaskModal] = useState(false);
  const [editingSubtask, setEditingSubtask] = useState<any>(null);
  const [editSubtaskForm, setEditSubtaskForm] = useState({
    title: '',
    assignee: '',
    status: 'To Do' as TaskStatus,
    dueDate: '',
    description: ''
  });
  const [editSubtaskFormErrors, setEditSubtaskFormErrors] = useState<Record<string, boolean>>({});
  const [showEditSubtaskModalAssigneeDropdown, setShowEditSubtaskModalAssigneeDropdown] = useState(false);
  const [showEditSubtaskModalStatusDropdown, setShowEditSubtaskModalStatusDropdown] = useState(false);
  const editSubtaskModalAssigneeDropdownRef = useRef<HTMLDivElement>(null);
  const editSubtaskModalStatusDropdownRef = useRef<HTMLDivElement>(null);
  
  // Add state for expanded subtask cards
  const [expandedSubtaskCards, setExpandedSubtaskCards] = useState<Set<string>>(new Set());

  // Track modal source for proper layering
  const [newSubtaskModalOpenedFromTaskDetails, setNewSubtaskModalOpenedFromTaskDetails] = useState(false);
  

  const [editSubtaskModalOpenedFromTaskDetails, setEditSubtaskModalOpenedFromTaskDetails] = useState(false);
  
  // Subtask context menu state
  const [openSubtaskMenu, setOpenSubtaskMenu] = useState<string | null>(null);
  const [subtaskMenuPosition, setSubtaskMenuPosition] = useState({ left: 0, top: 0 });
  const subtaskMenuRef = useRef<HTMLDivElement>(null);
  
  // View toggle state (Kanban vs Table)
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');

  // New Task Modal State
  const [showNewTaskInlineForm, setShowNewTaskInlineForm] = useState(false);
  const [newTaskModalStep, setNewTaskModalStep] = useState(1);
  const [newTaskModalForm, setNewTaskModalForm] = useState({
    title: '',
    assignee: '',
    status: 'To Do' as TaskStatus,
    dueDate: '',
    description: '',
    contract: ''
  });
  const [newTaskFormErrors, setNewTaskFormErrors] = useState<Record<string, boolean>>({});
  const [newTaskContractSearch, setNewTaskContractSearch] = useState('');
  const [showNewTaskAssigneeDropdown, setShowNewTaskAssigneeDropdown] = useState(false);
  const [showNewTaskContractDropdown, setShowNewTaskContractDropdown] = useState(false);
  const [showNewTaskStatusDropdown, setShowNewTaskStatusDropdown] = useState(false);
  const newTaskAssigneeDropdownRef = useRef<HTMLDivElement>(null);
  const newTaskContractDropdownRef = useRef<HTMLDivElement>(null);
  const newTaskStatusDropdownRef = useRef<HTMLDivElement>(null);
  const [showNewSubtaskStatusDropdown, setShowNewSubtaskStatusDropdown] = useState(false);
  const [showNewSubtaskAssigneeDropdown, setShowNewSubtaskAssigneeDropdown] = useState(false);
  const [newTaskUploadedFiles, setNewTaskUploadedFiles] = useState<File[]>([]);
  const [selectedNewTaskFileSource, setSelectedNewTaskFileSource] = useState<string | null>(null);
  const [showNewTaskFileSourceDropdown, setShowNewTaskFileSourceDropdown] = useState(false);
  const newTaskFileSourceDropdownRef = useRef<HTMLDivElement>(null);
  
  // Document fields for Step 3
  const [newTaskDocumentName, setNewTaskDocumentName] = useState('');
  
  // Inline editing state for uploaded files
  const [editingTaskFileIndex, setEditingTaskFileIndex] = useState<number | null>(null);
  const [inlineEditingTaskFileName, setInlineEditingTaskFileName] = useState('');
  
  // Inline editing state for subtasks
  const [editingSubtaskIndex, setEditingSubtaskIndex] = useState<number | null>(null);
  const [inlineEditingSubtaskTitle, setInlineEditingSubtaskTitle] = useState('');
  const [inlineEditingSubtaskAssignee, setInlineEditingSubtaskAssignee] = useState('');
  const [inlineEditingSubtaskDueDate, setInlineEditingSubtaskDueDate] = useState('');
  const [inlineEditingSubtaskDescription, setInlineEditingSubtaskDescription] = useState('');
  const [showInlineSubtaskAssigneeDropdown, setShowInlineSubtaskAssigneeDropdown] = useState(false);
  const inlineSubtaskAssigneeDropdownRef = useRef<HTMLDivElement>(null);
  
  // Subtasks state
  const [newTaskSubtasks, setNewTaskSubtasks] = useState<Array<{id: string, title: string, assignee: string, status: string, dueDate: string, description: string, completed: boolean}>>([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [newSubtaskAssignee, setNewSubtaskAssignee] = useState('');
  const [newSubtaskStatus, setNewSubtaskStatus] = useState('To Do');
  const [newSubtaskDueDate, setNewSubtaskDueDate] = useState('');
  const [newSubtaskDescription, setNewSubtaskDescription] = useState('');

  // Use the task store
  const {
    tasks,
    selectedTask,
    setSelectedTask,
    updateTask,
    moveTask,
    getTasksByStatus,
    initializeTasks,
    addTask,
    deleteTask
  } = useTaskStore();

  // Initialize tasks from storage
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      initializeTasks();
      console.log('Initialized tasks:', tasks);
    }
  }, []); // Remove initializeTasks from dependencies to prevent infinite loop

  // Load task files from localStorage
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTaskFiles = localStorage.getItem('taskFiles');
      if (savedTaskFiles) {
        try {
          setTaskFiles(JSON.parse(savedTaskFiles));
        } catch (error) {
          console.error('Error parsing task files:', error);
        }
      }
    }
  }, []);

  // Function to add a new contract to the contracts list
  const addNewContract = (newContract: any) => {
    setContracts(prev => [newContract, ...prev]);
  };

  // Load enhanced contracts (including additional contracts) on component mount
  React.useEffect(() => {
    const loadEnhancedContracts = async () => {
      try {
        const response = await fetch('/api/contracts');
        if (response.ok) {
          const data = await response.json();
          // Update contracts with enhanced data (mock + additional)
          if (data.contracts && data.contracts.length > 0) {
            setContracts(data.contracts);
          }
        } else {
          console.error('Failed to load enhanced contracts');
          // Keep the initial mockContracts that are already loaded
        }
      } catch (error) {
        console.error('Error loading enhanced contracts:', error);
        // Keep the initial mockContracts that are already loaded
      }
    };

    // Load enhanced contracts after a small delay
    const timeoutId = setTimeout(loadEnhancedContracts, 100);
    return () => clearTimeout(timeoutId);
  }, []);

  // Listen for new contracts from localStorage or other sources
  React.useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'newContract' && e.newValue) {
        try {
          const newContract = JSON.parse(e.newValue);
          addNewContract(newContract);
          // Clear the storage after reading
          localStorage.removeItem('newContract');
        } catch (error) {
          console.error('Error parsing new contract:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Update task counts when tasks change
  React.useEffect(() => {
    const counts = {
      total: tasks.length,
      todo: tasks.filter(t => t.status === 'To Do').length,
      inProgress: tasks.filter(t => t.status === 'In Progress').length,
      done: tasks.filter(t => t.status === 'Done').length,
      blocked: tasks.filter(t => t.status === 'Blocked').length,
      onHold: tasks.filter(t => t.status === 'On Hold').length,
      inReview: tasks.filter(t => t.status === 'In Review').length,
      canceled: tasks.filter(t => t.status === 'Canceled').length,
    };
    setTaskCounts(counts);
    console.log('Updated task counts:', counts);
  }, [tasks]);

  // Replace the comments state with taskComments
  const [taskComments, setTaskComments] = React.useState<Record<string, Comment[]>>(() => {
    if (typeof window !== 'undefined') {
      const savedComments = localStorage.getItem('taskComments');
      if (savedComments) {
        return JSON.parse(savedComments);
      }
    }
    return {};
  });

  // Save comments to localStorage whenever they change
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('taskComments', JSON.stringify(taskComments));
    }
  }, [taskComments]);

  // Define Kanban columns using the task store
  const kanbanColumns = [
    {
      key: 'To Do',
      title: 'To Do',
      color: 'bg-gray-100',
      icon: <TbList className="text-xl mr-2 text-gray-500" />,
      tasks: getTasksByStatus('To Do')
    },
    {
      key: 'Blocked',
      title: 'Blocked',
      color: 'bg-red-100',
      icon: <CgPlayStopR className="text-xl mr-2 text-red-500" />,
      tasks: getTasksByStatus('Blocked')
    },
    {
      key: 'On Hold',
      title: 'On Hold',
      color: 'bg-orange-100',
      icon: <CgPlayPauseR className="text-xl mr-2 text-orange-500" />,
      tasks: getTasksByStatus('On Hold')
    },
    {
      key: 'In Progress',
      title: 'In Progress',
      color: 'bg-blue-100',
      icon: <FaRetweet className="text-xl mr-2 text-blue-500" />,
      tasks: getTasksByStatus('In Progress')
    },
    {
      key: 'In Review',
      title: 'In Review',
      color: 'bg-yellow-100',
      icon: <TbListSearch className="text-xl mr-2 text-yellow-500" />,
      tasks: getTasksByStatus('In Review')
    },
    {
      key: 'Done',
      title: 'Done',
      color: 'bg-green-100',
      icon: <FaRegSquareCheck className="text-xl mr-2 text-green-600" />,
      tasks: getTasksByStatus('Done')
    },
    {
      key: 'Canceled',
      title: 'Canceled',
      color: 'bg-purple-100',
      icon: <TbCancel className="text-xl mr-2 text-purple-500" />,
      tasks: getTasksByStatus('Canceled')
    }
  ];

  const allTasks = tasks;
  const uniqueAssignees = Array.from(new Set(allTasks.map(t => t.assignee))).sort();

  // Add status options constant
  const statusOptions = [
    { key: 'To Do', title: 'To Do' },
    { key: 'Blocked', title: 'Blocked' },
    { key: 'On Hold', title: 'On Hold' },
    { key: 'In Progress', title: 'In Progress' },
    { key: 'In Review', title: 'In Review' },
    { key: 'Done', title: 'Done' },
    { key: 'Canceled', title: 'Canceled' }
  ] as const;

  type TaskStatus = typeof statusOptions[number]['key'];
  type StatusOption = TaskStatus | 'All';

  // Placeholder for current user's name
  const currentUserName = 'John Smith'; // TODO: Replace with actual user context

  // Helper to filter tasks in a column according to current filters
  function filterTasks(tasks: Task[]) {
    return tasks.filter(task => {
      let matches = true;
      if (selectedAssignees.length > 0) {
        if (selectedAssignees.includes('__ME__')) {
          matches = matches && task.assignee === currentUserName;
        } else {
          matches = matches && selectedAssignees.includes(task.assignee);
        }
      }
      if (selectedContracts.length > 0) {
        matches = matches && selectedContracts.includes(String(task.contractId));
      }
      if (taskSearchTerm.trim()) {
        const search = taskSearchTerm.trim().toLowerCase();
        const contractObj = contracts.find(c => c.id === task.contractId);
        matches = matches && (
          (typeof task.title === 'string' && task.title.toLowerCase().includes(search)) ||
          (typeof task.taskNumber !== 'undefined' && String(task.taskNumber).includes(search)) ||
          (!!contractObj && (
            contractObj.title.toLowerCase().includes(search) ||
            contractObj.id.toLowerCase().includes(search)
          )) ||
          (typeof task.assignee === 'string' && task.assignee.toLowerCase().includes(search))
        );
      }
      return matches;
    });
  }

  // Drag-and-drop handler
  function onDragEnd(result: DropResult) {
    const { source, destination } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const taskId = result.draggableId;
    console.log('Moving task:', taskId, 'to status:', destination.droppableId);
    moveTask(taskId, destination.droppableId as Task['status']);
  }

  React.useEffect(() => {
    setEditedTaskTitle(selectedTask?.title || '');
          setEditedContractName(contracts.find(c => c.id === selectedTask?.contractId)?.title || '');
    setEditedDueDate(formatDateToInput(selectedTask?.due || ''));
    setEditedAssignee(selectedTask?.assignee || '');
  }, [selectedTask]);

  // Inside WorkflowsPage component, before return:
  const commentEditor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Strike,
      Link,
      CodeBlockLowlight.configure({ lowlight }),
    ],
    content: '',
  });

  const handlePostComment = () => {
    if (!selectedTask || !commentEditor || !commentEditor.getText().trim()) return;

    const taskId = selectedTask.code;
    const currentComments = taskComments[taskId] || [];

    if (editingCommentId) {
      // Update existing comment
      setTaskComments({
        ...taskComments,
        [taskId]: currentComments.map((comment: Comment) => 
          comment.id === editingCommentId 
            ? { ...comment, content: commentEditor.getHTML() }
            : comment
        )
      });
      setEditingCommentId(null);
    } else {
      // Add new comment at the end
      const newComment: Comment = {
        id: Date.now().toString(),
        author: 'Current User',
        content: commentEditor.getHTML(),
        timestamp: new Date().toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          hour12: true
        }),
        avatarColor: 'bg-primary/10',
        textColor: 'text-primary'
      };
      setTaskComments({
        ...taskComments,
        [taskId]: [...currentComments, newComment]
      });
    }
    commentEditor.commands.clearContent();
  };

  const handleEditComment = (commentId: string) => {
    if (!selectedTask) return;
    const taskId = selectedTask.code;
    const currentComments = taskComments[taskId] || [];
    const comment = currentComments.find((c: Comment) => c.id === commentId);
    if (comment && commentEditor) {
      commentEditor.commands.setContent(comment.content);
      setEditingCommentId(commentId);
    }
  };

  const handleDeleteComment = (commentId: string) => {
    if (!selectedTask) return;
    const taskId = selectedTask.code;
    const currentComments = taskComments[taskId] || [];
    setTaskComments({
      ...taskComments,
      [taskId]: currentComments.filter((comment: Comment) => comment.id !== commentId)
    });
  };

  // Update the status change handler
  const handleStatusChange = (status: typeof statusOptions[number]['key']) => {
    if (selectedTask) {
      moveTask(selectedTask.id, status);
      setShowStatusDropdown(false);
    }
  };







  // Update the status change handler for the task details modal
  const handleTaskStatusChange = (status: StatusOption) => {
    if (selectedTask && status !== 'All') {
      const taskStatus = status as TaskStatus;
      moveTask(selectedTask.code, taskStatus);
      // Update the selected task's status in the modal
      setSelectedTask({ ...selectedTask, status: taskStatus });
      setShowStatusDropdown(false);
    }
  };

  // Add handler for assignee changes
  const handleAssigneeChange = (newAssignee: string) => {
    if (selectedTask) {
      // Update the task in the store
      updateTask(selectedTask.code, { ...selectedTask, assignee: newAssignee });
      // Update the selected task in the modal
      setSelectedTask({ ...selectedTask, assignee: newAssignee });
      setShowAssigneeDropdown(false);
    }
  };

  // Add handler for due date changes
  const handleDueDateChange = (newDueDate: string) => {
    if (selectedTask) {
      // Update the task in the store
      updateTask(selectedTask.code, { ...selectedTask, due: newDueDate });
      // Update the selected task in the modal
      setSelectedTask({ ...selectedTask, due: newDueDate });
      setEditedDueDate(newDueDate);
    }
  };

  const handleUploadModalFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file =>
      ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "image/jpeg"].includes(file.type) && file.size <= 10 * 1024 * 1024
    );
    setUploadModalFiles(validFiles);
    
    // Pre-populate document name with first file name (without extension) only if field is empty
    if (validFiles.length > 0 && !uploadModalDocumentName.trim()) {
      const fileName = validFiles[0].name;
      const nameWithoutExtension = fileName.replace(/\.[^/.]+$/, "");
      setUploadModalDocumentName(nameWithoutExtension);
    }
  };

  // Handler for adding documents to the upload modal
  const handleAddUploadModalDocument = () => {
    console.log('Add document triggered');
    console.log('Document name:', uploadModalDocumentName);
    console.log('Upload modal files:', uploadModalFiles);
    
    if (!uploadModalDocumentName.trim() || uploadModalFiles.length === 0) {
      console.log('Missing document name or files');
      return;
    }

    const newDocument = {
      files: [...uploadModalFiles],
      documentName: uploadModalDocumentName.trim()
    };

    console.log('Adding new document:', newDocument);

    setUploadModalAddedDocuments(prev => {
      const updated = [...prev, newDocument];
      console.log('Updated added documents:', updated);
      return updated;
    });

    // Clear the form
    setUploadModalFiles([]);
    setUploadModalDocumentName('');
  };

  // Handler for removing documents from the upload modal
  const handleRemoveUploadModalAddedDocument = (index: number) => {
    setUploadModalAddedDocuments(prev => prev.filter((_, i) => i !== index));
  };

  // Function to start inline editing of an upload modal document
  const handleStartInlineEditUploadModalDocument = (index: number) => {
    const doc = uploadModalAddedDocuments[index];
    setEditingUploadModalDocumentIndex(index);
    setInlineEditingUploadModalDocumentName(doc.documentName);
  };

  // Function to save inline edits of an upload modal document
  const handleSaveInlineEditUploadModalDocument = (index: number) => {
    if (inlineEditingUploadModalDocumentName.trim()) {
      setUploadModalAddedDocuments(prev => prev.map((doc, i) =>
        i === index ? { ...doc, documentName: inlineEditingUploadModalDocumentName.trim() } : doc
      ));
      setEditingUploadModalDocumentIndex(null);
      setInlineEditingUploadModalDocumentName('');
    }
  };

  // Function to cancel inline editing of an upload modal document
  const handleCancelInlineEditUploadModalDocument = () => {
    setEditingUploadModalDocumentIndex(null);
    setInlineEditingUploadModalDocumentName('');
  };

  // Document name editing functions for task details modal
  const getDocumentDisplayName = (file: any): string => {
    return customDocumentNames[file.originalName] || file.name;
  };

  const handleStartEditDocumentName = (file: any) => {
    setEditingDocumentName(file.originalName);
  };

  const handleSaveDocumentName = (file: any, newName: string) => {
    if (newName.trim()) {
      setCustomDocumentNames(prev => ({ ...prev, [file.originalName]: newName.trim() }));
    }
    setEditingDocumentName(null);
  };

  const handleCancelEditDocumentName = () => {
    setEditingDocumentName(null);
  };

  // Handler for uploading documents to task
  const handleUploadModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Upload modal submit triggered');
    console.log('uploadModalAddedDocuments:', uploadModalAddedDocuments);
    
    if (uploadModalAddedDocuments.length === 0) {
      console.log('No documents to upload');
      return;
    }

    // Get the current task ID
    const taskId = uploadTaskId;
    console.log('Task ID:', taskId);
    console.log('Selected Task:', selectedTask);
    
    if (!taskId || !selectedTask) {
      console.log('Missing task ID or selected task');
      return;
    }

    // Convert added documents to file objects for the task
    const newFiles = uploadModalAddedDocuments.flatMap(doc => 
      doc.files.map(file => ({
        name: doc.documentName,
        type: file.type,
        size: file.size,
        lastModified: file.lastModified,
        originalName: file.name
      }))
    );

    console.log('New files to be added:', newFiles);
    console.log('Number of new files:', newFiles.length);

    // Get existing files for this task
    const existingFiles = taskFiles[taskId]?.files || [];
    console.log('Existing files for task:', existingFiles);
    
    // Create new task files data
    const updatedTaskFiles = {
      ...taskFiles,
      [taskId]: {
        files: [...existingFiles, ...newFiles]
      }
    };

    console.log('Updated task files:', updatedTaskFiles);

    // Save to localStorage
    localStorage.setItem('taskFiles', JSON.stringify(updatedTaskFiles));
    
    // Update state
    setTaskFiles(updatedTaskFiles);

    // Close modal and reset form
    setShowUploadModal(false);
    setUploadModalFiles([]);
    setUploadModalDocumentName('');
    setSelectedUploadSource(null);
    setUploadTaskId(null);
    setUploadModalAddedDocuments([]);
    setEditingUploadModalDocumentIndex(null);
    setInlineEditingUploadModalDocumentName('');
  };

  // Add debug logs for selectedTask and subtasks
  if (selectedTask) {
    console.log('Selected Task:', selectedTask);
    console.log('Selected Task Subtasks:', selectedTask.subtasks);
  }

  // Debug: Print all tasks from the store to check for subtasks
  console.log('All tasks from store:', tasks);



  // Add click-off behavior for task details modal assignee dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement;
      const dropdown = taskDetailsAssigneeDropdownRef.current;
      const input = taskDetailsAssigneeInputRef.current;

      if (showAssigneeDropdown && 
          !dropdown?.contains(target) && 
          !input?.contains(target)) {
        setShowAssigneeDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showAssigneeDropdown]);

  // Add click-off behavior for upload modal assignee dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement;
      const dropdown = uploadModalAssigneeDropdownRef.current;
      const input = uploadModalAssigneeInputRef.current;

      if (showUploadModalAssigneeDropdown && 
          !dropdown?.contains(target) && 
          !input?.contains(target)) {
        setShowUploadModalAssigneeDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUploadModalAssigneeDropdown]);

  // Add click-off behavior for click to upload dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement;
      const dropdown = clickToUploadDropdownRef.current;

      if (showClickToUploadDropdown && 
          !dropdown?.contains(target)) {
        setShowClickToUploadDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showClickToUploadDropdown]);

  // Add this useEffect for the mobile assignee filter dropdown click-outside handler
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      const desktopDropdown = assigneeDropdownRef.current;
      const mobileDropdown = mobileAssigneeDropdownRef.current;
      const desktopButton = assigneeButtonRef.current;
      const mobileButton = mobileAssigneeButtonRef.current;
      
      // Only check if dropdown is open
      if (openAssigneeDropdown) {
        // Check if clicking inside either desktop or mobile dropdown, or either button
        const isInsideDropdown = desktopDropdown?.contains(target) || mobileDropdown?.contains(target);
        const isInsideButton = desktopButton?.contains(target) || mobileButton?.contains(target);
        
        // If clicking outside both dropdowns and buttons, close the dropdown
        if (!isInsideDropdown && !isInsideButton) {
          setOpenAssigneeDropdown(false);
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openAssigneeDropdown]);

  // Add this useEffect for the mobile contract filter dropdown click-outside handler
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      const desktopDropdown = contractDropdownRef.current;
      const mobileDropdown = mobileContractDropdownRef.current;
      const desktopButton = contractButtonRef.current;
      const mobileButton = mobileContractButtonRef.current;
      
      // Only check if dropdown is open
      if (openContractDropdown) {
        // Check if clicking inside either desktop or mobile dropdown, or either button
        const isInsideDropdown = desktopDropdown?.contains(target) || mobileDropdown?.contains(target);
        const isInsideButton = desktopButton?.contains(target) || mobileButton?.contains(target);
        
        // If clicking outside both dropdowns and buttons, close the dropdown
        if (!isInsideDropdown && !isInsideButton) {
          setOpenContractDropdown(false);
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openContractDropdown]);

  // Add this useEffect for the mobile status filter dropdown click-outside handler
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      const desktopDropdown = statusDropdownRef.current;
      const mobileDropdown = mobileStatusDropdownRef.current;
      const desktopButton = statusButtonRef.current;
      const mobileButton = mobileStatusButtonRef.current;
      
      // Only check if dropdown is open
      if (showStatusDropdown) {
        // Check if clicking inside either desktop or mobile dropdown, or either button
        const isInsideDropdown = desktopDropdown?.contains(target) || mobileDropdown?.contains(target);
        const isInsideButton = desktopButton?.contains(target) || mobileButton?.contains(target);
        
        // If clicking outside both dropdowns and buttons, close the dropdown
        if (!isInsideDropdown && !isInsideButton) {
          setShowStatusDropdown(false);
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showStatusDropdown]);

  // Add click-outside handler for modal status dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      const dropdown = modalStatusDropdownRef.current;
      
      if (showModalStatusDropdown && dropdown && !dropdown.contains(target)) {
        setShowModalStatusDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showModalStatusDropdown]);

  // Add click-outside handler for new task contract dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      const dropdown = newTaskContractDropdownRef.current;
      
      if (showNewTaskContractDropdown && dropdown && !dropdown.contains(target)) {
        setShowNewTaskContractDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNewTaskContractDropdown]);

  // Add click-outside handler for new subtask assignee dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement;
      
      if (showNewSubtaskAssigneeDropdown && !target.closest('#subtaskAssignee') && !target.closest('.subtask-assignee-dropdown')) {
        setShowNewSubtaskAssigneeDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNewSubtaskAssigneeDropdown]);

  // Add click-outside handler for new subtask status dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement;
      
      if (showNewSubtaskStatusDropdown && !target.closest('#subtaskStatus') && !target.closest('.subtask-status-dropdown')) {
        setShowNewSubtaskStatusDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNewSubtaskStatusDropdown]);

  // Add click-outside handler for new task assignee dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      const dropdown = newTaskAssigneeDropdownRef.current;
      
      if (showNewTaskAssigneeDropdown && dropdown && !dropdown.contains(target)) {
        setShowNewTaskAssigneeDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNewTaskAssigneeDropdown]);

  // Add click-outside handler for new task status dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      const dropdown = newTaskStatusDropdownRef.current;
      
      if (showNewTaskStatusDropdown && dropdown && !dropdown.contains(target)) {
        setShowNewTaskStatusDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNewTaskStatusDropdown]);



  // Add click-outside handler for new task file source dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      const dropdown = newTaskFileSourceDropdownRef.current;
      
      if (showNewTaskFileSourceDropdown && dropdown && !dropdown.contains(target)) {
        setShowNewTaskFileSourceDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNewTaskFileSourceDropdown]);

  // Add click-outside handler for inline subtask assignee dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      const dropdown = inlineSubtaskAssigneeDropdownRef.current;
      
      if (showInlineSubtaskAssigneeDropdown && dropdown && !dropdown.contains(target)) {
        setShowInlineSubtaskAssigneeDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showInlineSubtaskAssigneeDropdown]);

  // Add click-outside handler for new subtask modal assignee dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      const dropdown = newSubtaskModalAssigneeDropdownRef.current;
      
      if (showNewSubtaskModalAssigneeDropdown && dropdown && !dropdown.contains(target)) {
        setShowNewSubtaskModalAssigneeDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNewSubtaskModalAssigneeDropdown]);

  // Add click-outside handler for new subtask modal status dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      const dropdown = newSubtaskModalStatusDropdownRef.current;
      
      if (showNewSubtaskModalStatusDropdown && dropdown && !dropdown.contains(target)) {
        setShowNewSubtaskModalStatusDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNewSubtaskModalStatusDropdown]);

  // Add click-outside handler for edit subtask modal assignee dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      const dropdown = editSubtaskModalAssigneeDropdownRef.current;
      
      if (showEditSubtaskModalAssigneeDropdown && dropdown && !dropdown.contains(target)) {
        setShowEditSubtaskModalAssigneeDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showEditSubtaskModalAssigneeDropdown]);

  // Add click-outside handler for edit subtask modal status dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      const dropdown = editSubtaskModalStatusDropdownRef.current;
      
      if (showEditSubtaskModalStatusDropdown && dropdown && !dropdown.contains(target)) {
        setShowEditSubtaskModalStatusDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showEditSubtaskModalStatusDropdown]);

  // Add click-outside handler for kanban task menu dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      const dropdown = menuRef.current;
      
      // Check if the click is on a 3-dots button or its parent button
      const clickedButton = (target as Element).closest('button');
      const isDotsButton = clickedButton && clickedButton.querySelector('svg');
      
      if (openMenuTask && dropdown && !dropdown.contains(target) && !isDotsButton) {
        setOpenMenuTask(null);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openMenuTask]);

  // Add click-outside handler for subtask menu dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      const dropdown = subtaskMenuRef.current;
      
      if (openSubtaskMenu && dropdown && !dropdown.contains(target)) {
        setOpenSubtaskMenu(null);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openSubtaskMenu]);

  // Function to clean up all task-related data when deleting a task
  const cleanupTaskData = (taskId: string) => {
    // Clean up task files
    const existingTaskFiles = JSON.parse(localStorage.getItem('taskFiles') || '{}');
    if (existingTaskFiles[taskId]) {
      delete existingTaskFiles[taskId];
      localStorage.setItem('taskFiles', JSON.stringify(existingTaskFiles));
      setTaskFiles(existingTaskFiles);
    }

    // Clean up task comments
    const existingComments = JSON.parse(localStorage.getItem('taskComments') || '{}');
    if (existingComments[taskId]) {
      delete existingComments[taskId];
      localStorage.setItem('taskComments', JSON.stringify(existingComments));
      setTaskComments(existingComments);
    }
  };

  // Function to delete a subtask
  const deleteSubtask = (subtaskId: string) => {
    if (selectedTask) {
      const updatedSubtasks = selectedTask.subtasks.filter(st => st.id !== subtaskId);
      updateTask(selectedTask.code, { subtasks: updatedSubtasks });
      setSelectedTask({ ...selectedTask, subtasks: updatedSubtasks });
    }
  };

  // Calculate dropdown position to ensure it's always visible
  const getDropdownPosition = (event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const dropdownWidth = 192; // w-48 = 12rem = 192px
    const dropdownHeight = 80; // Approximate height of dropdown with 2 buttons
    
    let left = rect.right - dropdownWidth;
    let top = rect.bottom + 4;
    
    // Check if dropdown would go off the right edge
    if (left < 0) {
      left = 0;
    }
    
    // Check if dropdown would go off the bottom edge
    if (top + dropdownHeight > window.innerHeight) {
      top = rect.top - dropdownHeight - 4;
    }
    
    return { left, top };
  };

  // Inline editing functions for uploaded files
  const handleStartInlineEditTaskFile = (index: number) => {
    const file = newTaskUploadedFiles[index];
    setEditingTaskFileIndex(index);
    setInlineEditingTaskFileName(file.name.replace(/\.[^/.]+$/, "")); // Remove extension
  };

  const handleSaveInlineEditTaskFile = (index: number) => {
    if (inlineEditingTaskFileName.trim()) {
      const updatedFiles = [...newTaskUploadedFiles];
      const originalFile = updatedFiles[index];
      
      // Create a new File object with the updated name
      const newFileName = `${inlineEditingTaskFileName.trim()}.${originalFile.name.split('.').pop()}`;
      const newFile = new File([originalFile], newFileName, { type: originalFile.type });
      
      updatedFiles[index] = newFile;
      setNewTaskUploadedFiles(updatedFiles);
    }
    setEditingTaskFileIndex(null);
    setInlineEditingTaskFileName('');
  };

  const handleCancelInlineEditTaskFile = () => {
    setEditingTaskFileIndex(null);
    setInlineEditingTaskFileName('');
  };

  // Inline editing functions for subtasks
  const handleStartInlineEditSubtask = (index: number) => {
    const subtask = newTaskSubtasks[index];
    setEditingSubtaskIndex(index);
    setInlineEditingSubtaskTitle(subtask.title);
    setInlineEditingSubtaskAssignee(subtask.assignee);
    setInlineEditingSubtaskDueDate(subtask.dueDate);
    setInlineEditingSubtaskDescription(subtask.description);
  };

  const handleSaveInlineEditSubtask = (index: number) => {
    if (inlineEditingSubtaskTitle.trim()) {
      const updatedSubtasks = [...newTaskSubtasks];
      updatedSubtasks[index] = {
        ...updatedSubtasks[index],
        title: inlineEditingSubtaskTitle.trim(),
        assignee: inlineEditingSubtaskAssignee,
        dueDate: inlineEditingSubtaskDueDate,
        description: inlineEditingSubtaskDescription
      };
      setNewTaskSubtasks(updatedSubtasks);
    }
    setEditingSubtaskIndex(null);
    setInlineEditingSubtaskTitle('');
    setInlineEditingSubtaskAssignee('');
    setInlineEditingSubtaskDueDate('');
    setInlineEditingSubtaskDescription('');
    setShowInlineSubtaskAssigneeDropdown(false);
  };

  const handleCancelInlineEditSubtask = () => {
    setEditingSubtaskIndex(null);
    setInlineEditingSubtaskTitle('');
    setInlineEditingSubtaskAssignee('');
    setInlineEditingSubtaskDueDate('');
    setInlineEditingSubtaskDescription('');
    setShowInlineSubtaskAssigneeDropdown(false);
  };

  // Horizontal scroll on wheel
  const handleKanbanWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (kanbanBoardRef.current) {
      if (e.deltaY !== 0) {
        e.preventDefault();
        kanbanBoardRef.current.scrollLeft += e.deltaY;
      }
    }
  };

  // Helper function to get status badge styling (matching signatures table but using kanban icon colors)
  const getTaskStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'To Do': return 'bg-gray-100 dark:bg-gray-700/30 text-gray-800 dark:text-gray-400 border border-gray-800 dark:border-gray-500';
      case 'In Progress': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 border border-blue-800 dark:border-blue-800';
      case 'In Review': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 border border-yellow-800 dark:border-yellow-800';
      case 'Done': return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 border border-green-800 dark:border-green-800';
      case 'Blocked': return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 border border-red-800 dark:border-red-800';
      case 'On Hold': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-400 border border-orange-800 dark:border-orange-800';
      case 'Canceled': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400 border border-purple-800 dark:border-purple-800';
      default: return 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-400 border border-gray-800 dark:border-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      {/* Workflow Title and Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 sm:mb-6 gap-4">
        <div>
          <h1 className="text-[30px] font-bold text-black dark:text-white mb-1">Tasks</h1>
          <p className="text-gray-500 dark:text-gray-400 text-[16px] mt-0">Track &amp; manage your activity</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <button
            onClick={() => setShowNewTaskModal(true)}
            className="flex items-center justify-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-semibold w-full sm:w-auto"
          >
            <TbCategoryPlus className="mr-2 text-[22px]" />
            New Task
          </button>
          <button 
            onClick={generateTestToasts}
            className="flex items-center justify-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-semibold w-full sm:w-auto"
            style={{ fontFamily: 'Avenir, sans-serif' }}
          >
            🧪 Test 2 Toasts
          </button>
        </div>
      </div>

      <hr className="my-3 md:my-6 border-gray-300 cursor-default select-none" />

      {/* Scrollable Content Area */}
      <div className="overflow-y-auto max-h-[calc(100vh-300px)] [&::-webkit-scrollbar]:hidden">
        {/* Workflow Stats and Filters Section */}
      <div>
        {showNewTaskModal ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-300 dark:border-gray-700 px-6 py-4 sm:pt-8 sm:pb-6 mb-6 select-none">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center border-2 border-teal-200 dark:border-teal-800">
                  <TbCategoryPlus size={20} className="text-teal-500 dark:text-teal-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-black dark:text-white leading-tight">Create New Task</h2>
                  <p className="text-gray-500 text-xs leading-tight cursor-default select-none">Fill in the task details to get started</p>
                </div>
              </div>
              <button
                onClick={() => { 
                  setShowNewTaskModal(false); 
                  setNewTaskModalStep(1); 
                  setNewTaskModalForm({ title: '', assignee: '', status: 'To Do' as TaskStatus, dueDate: '', description: '', contract: '' }); 
                  setNewTaskFormErrors({}); 
                                          setNewTaskSubtasks([]);
                        setNewSubtaskTitle('');
                        setNewSubtaskAssignee('');
                        setNewSubtaskStatus('To Do');
                        setNewSubtaskDueDate('');
                        setNewSubtaskDescription('');
                        setShowNewSubtaskAssigneeDropdown(false);
                        setShowNewSubtaskStatusDropdown(false);
                        setNewTaskUploadedFiles([]);
                }} 
                className="text-gray-400 hover:text-gray-600 p-2 rounded-full -mt-3"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Stepper */}
            <div className="w-full overflow-x-auto [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-white [&::-webkit-scrollbar-track]:dark:bg-gray-800 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:dark:bg-gray-700 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-gray-400 [&::-webkit-scrollbar-thumb:hover]:dark:bg-gray-500">
              <div className="flex items-center justify-between mb-6 min-w-[340px] sm:min-w-0">
                <div className="flex items-center space-x-2 w-full flex-nowrap">
                  {[1, 2, 3].map((step, idx) => (
                    <React.Fragment key={step}>
                      <button
                        type="button"
                        onClick={() => setNewTaskModalStep(step)}
                        className={`flex items-center gap-2 rounded-xl font-semibold border transition-all duration-300 text-sm px-4 py-2 whitespace-nowrap
                          ${newTaskModalStep === step
                            ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-700 ring-1 ring-inset ring-gray-200 dark:ring-gray-600 shadow-sm'
                            : 'text-gray-500 dark:text-gray-400 border-transparent hover:bg-gray-100 dark:hover:bg-gray-700'
                          }`}
                      >
                        <span className={`inline-block transition-all duration-300 ${newTaskModalStep === step ? 'opacity-100 mr-2' : 'opacity-0 w-0 mr-0'}`} style={{width: newTaskModalStep === step ? 18 : 0}}>
                          {newTaskModalStep === step && <Logo width={18} height={18} className="pointer-events-none" />}
                        </span>
                        {step === 1 && 'Step 1: Details'}
                        {step === 2 && 'Step 2: Subtasks'}
                        {step === 3 && 'Step 3: Documents'}
                      </button>
                      {idx < 2 && <div className="flex-1 h-0.5 bg-gray-200 dark:bg-gray-700 mx-2 min-w-[20px]" />}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>

            {/* Form Content */}
            <div className="space-y-4 pt-4">
              {newTaskModalStep === 1 && (
                <>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="taskTitle" className="block text-xs font-medium text-gray-500 dark:text-white mb-1 cursor-default select-none">Task Name <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        id="taskTitle"
                        name="title"
                        required
                        value={newTaskModalForm.title}
                        onChange={(e) => {
                          setNewTaskModalForm(prev => ({ ...prev, title: e.target.value }));
                          if (newTaskFormErrors.title) {
                            setNewTaskFormErrors(prev => ({ ...prev, title: false }));
                          }
                        }}
                        className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs dark:bg-gray-900 dark:text-white"
                        placeholder="Enter task name..."
                      />
                      {newTaskFormErrors.title && (
                        <p className="mt-1 text-xs text-red-600 font-medium cursor-default select-none">Task name is required</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="taskAssignee" className="block text-xs font-medium text-gray-500 dark:text-white mb-1 cursor-default select-none">Assignee <span className="text-red-500">*</span></label>
                      <div className="relative" ref={newTaskAssigneeDropdownRef}>
                        <input
                          type="text"
                          id="taskAssignee"
                          name="assignee"
                          required
                          className="w-full h-[34px] px-4 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-xs transition-colors cursor-text focus:ring-2 focus:ring-primary focus:border-primary pr-10"
                          placeholder="Choose an assignee..."
                          value={newTaskModalForm.assignee}
                          onChange={(e) => {
                            setNewTaskModalForm(prev => ({ ...prev, assignee: e.target.value }));
                            if (newTaskFormErrors.assignee) {
                              setNewTaskFormErrors(prev => ({ ...prev, assignee: false }));
                            }
                            if (e.target.value === '') {
                              setShowNewTaskAssigneeDropdown(false);
                            } else if (!showNewTaskAssigneeDropdown) {
                              setShowNewTaskAssigneeDropdown(true);
                            }
                          }}
                          onFocus={() => setShowNewTaskAssigneeDropdown(true)}
                          onClick={() => setShowNewTaskAssigneeDropdown(true)}
                          style={{ fontFamily: 'Avenir, sans-serif' }}
                          autoComplete="off"
                        />
                                                      <TbChevronDown className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        {showNewTaskAssigneeDropdown && (
                          <div className="absolute left-0 right-0 mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 z-50 max-h-48 overflow-y-auto cursor-default select-none [&::-webkit-scrollbar]:hidden" style={{ fontFamily: 'Avenir, sans-serif' }}>
                            {uniqueAssignees.length > 0 ? (
                              <>
                                {uniqueAssignees.map((assignee: string) => (
                                  <div
                                    key={assignee}
                                    className={`px-4 py-2 text-xs cursor-pointer ${newTaskModalForm.assignee === assignee ? 'bg-primary/10 text-primary' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'} select-none`}
                                    onClick={() => {
                                      setNewTaskModalForm(prev => ({ ...prev, assignee }));
                                      setShowNewTaskAssigneeDropdown(false);
                                    }}
                                  >
                                    {assignee}
                                  </div>
                                ))}
                                <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>
                                <div
                                  className="px-4 py-2 text-xs cursor-pointer text-primary hover:bg-primary/10 select-none flex items-center gap-2"
                                  onClick={() => {
                                    // TODO: Add logic to create new assignee
                                    setShowNewTaskAssigneeDropdown(false);
                                  }}
                                >
                                  <FaPlus className="text-xs" />
                                  Add new assignee
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="px-4 py-2 text-xs text-gray-400 dark:text-gray-500 cursor-default select-none">No assignees found</div>
                                <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>
                                <div
                                  className="px-4 py-2 text-xs cursor-pointer text-primary hover:bg-primary/10 select-none flex items-center gap-2"
                                  onClick={() => {
                                    // TODO: Add logic to create new assignee
                                    setShowNewTaskAssigneeDropdown(false);
                                  }}
                                >
                                  <FaPlus className="text-xs" />
                                  Add new assignee
                                </div>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                      {newTaskFormErrors.assignee && (
                        <p className="mt-1 text-xs text-red-600 font-medium cursor-default select-none">Assignee selection is required</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="taskStatus" className="block text-xs font-medium text-gray-500 dark:text-white mb-1 cursor-default select-none">Status</label>
                      <div className="relative" ref={newTaskStatusDropdownRef}>
                        <input
                          type="text"
                          id="taskStatus"
                          name="status"
                          className="w-full h-[34px] px-4 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-xs transition-colors cursor-text focus:ring-2 focus:ring-primary focus:border-primary pr-10"
                          placeholder="Choose status..."
                          value={newTaskModalForm.status}
                          onChange={(e) => {
                            setNewTaskModalForm(prev => ({ ...prev, status: e.target.value as TaskStatus }));
                            if (e.target.value === '') {
                              setShowNewTaskStatusDropdown(false);
                            } else if (!showNewTaskStatusDropdown) {
                              setShowNewTaskStatusDropdown(true);
                            }
                          }}
                          onFocus={() => setShowNewTaskStatusDropdown(true)}
                          onClick={() => setShowNewTaskStatusDropdown(true)}
                          style={{ fontFamily: 'Avenir, sans-serif' }}
                          autoComplete="off"
                        />
                        <TbChevronDown className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                        {showNewTaskStatusDropdown && (
                          <div className="absolute left-0 right-0 mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 z-50 max-h-48 overflow-y-auto cursor-default select-none [&::-webkit-scrollbar]:hidden" style={{ fontFamily: 'Avenir, sans-serif' }}>
                            {statusOptions.map(status => (
                              <div
                                key={status.key}
                                className={`px-4 py-2 text-xs cursor-pointer ${newTaskModalForm.status === status.key ? 'bg-primary/10 text-primary' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'} select-none`}
                                onClick={() => {
                                  setNewTaskModalForm(prev => ({ ...prev, status: status.key }));
                                  setShowNewTaskStatusDropdown(false);
                                }}
                              >
                                {status.title}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <label htmlFor="taskDueDate" className="block text-xs font-medium text-gray-500 dark:text-white mb-1 cursor-default select-none">Due Date <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <input
                          type="date"
                          id="taskDueDate"
                          name="dueDate"
                          value={newTaskModalForm.dueDate}
                          onChange={(e) => {
                            setNewTaskModalForm(prev => ({ ...prev, dueDate: e.target.value }));
                            if (newTaskFormErrors.dueDate) {
                              setNewTaskFormErrors(prev => ({ ...prev, dueDate: false }));
                            }
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Backspace') {
                              e.preventDefault();
                              setNewTaskModalForm(prev => ({ ...prev, dueDate: '' }));
                            }
                          }}
                          className="w-full px-4 py-2 pr-10 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs text-black dark:text-white bg-white dark:bg-gray-900 [&::-webkit-calendar-picker-indicator]:hidden"
                          style={{ fontFamily: 'Avenir, sans-serif' }}
                        />
                        <button
                          type="button"
                          onClick={() => (document.getElementById('taskDueDate') as HTMLInputElement)?.showPicker()}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 flex items-center justify-center"
                        >
                          <LuCalendarFold className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                        </button>
                      </div>
                      {newTaskFormErrors.dueDate && (
                        <p className="mt-1 text-xs text-red-600 font-medium cursor-default select-none">Due date is required</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="taskContract" className="block text-xs font-medium text-gray-500 dark:text-white mb-1 cursor-default select-none">Contract <span className="text-red-500">*</span></label>
                      <div className="relative" ref={newTaskContractDropdownRef}>
                        <input
                          type="text"
                          id="taskContract"
                          name="contract"
                          className="w-full h-[34px] px-4 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-xs transition-colors cursor-text focus:ring-2 focus:ring-primary focus:border-primary pr-10"
                          placeholder="Choose a contract..."
                          value={newTaskModalForm.contract}
                          onChange={(e) => {
                            setNewTaskModalForm(prev => ({ ...prev, contract: e.target.value }));
                            if (newTaskFormErrors.contract) {
                              setNewTaskFormErrors(prev => ({ ...prev, contract: false }));
                            }
                            if (e.target.value === '') {
                              setShowNewTaskContractDropdown(false);
                            } else if (!showNewTaskContractDropdown) {
                              setShowNewTaskContractDropdown(true);
                            }
                          }}
                          onFocus={() => setShowNewTaskContractDropdown(true)}
                          onClick={() => setShowNewTaskContractDropdown(true)}
                          style={{ fontFamily: 'Avenir, sans-serif' }}
                          autoComplete="off"
                        />
                        <TbChevronDown className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                        {showNewTaskContractDropdown && (
                          <div className="absolute left-0 right-0 mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 z-50 cursor-default select-none" style={{ fontFamily: 'Avenir, sans-serif' }}>
                            {/* Fixed Search Bar */}
                            <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
                              <div className="relative">
                                <input
                                  type="text"
                                  placeholder="Search contracts..."
                                  value={newTaskContractSearch}
                                  onChange={(e) => setNewTaskContractSearch(e.target.value)}
                                  className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-lg text-xs font-medium text-gray-700 dark:text-white bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                                  style={{ fontFamily: 'Avenir, sans-serif' }}
                                />
                                <TbSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                              </div>
                            </div>
                            {/* Scrollable Contracts List */}
                            <div className="max-h-40 overflow-y-auto [&::-webkit-scrollbar]:hidden">
                              {contracts
                                .filter(contract => 
                                  contract.id.toLowerCase().includes(newTaskContractSearch.toLowerCase()) ||
                                  contract.title.toLowerCase().includes(newTaskContractSearch.toLowerCase())
                                )
                                .sort((a, b) => Number(a.id) - Number(b.id))
                                .map(contract => (
                                  <div
                                    key={contract.id}
                                    className={`px-4 py-2 text-xs cursor-pointer ${newTaskModalForm.contract === `${contract.id} - ${contract.title}` ? 'bg-primary/10 text-primary' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'} select-none`}
                                    onClick={() => {
                                      setNewTaskModalForm(prev => ({ ...prev, contract: `${contract.id} - ${contract.title}` }));
                                      setShowNewTaskContractDropdown(false);
                                    }}
                                  >
                                    {contract.id} - {contract.title}
                                  </div>
                                ))}
                            </div>
                          </div>
                        )}
                      </div>
                      {newTaskFormErrors.contract && (
                        <p className="mt-1 text-xs text-red-600 font-medium cursor-default select-none">Contract selection is required</p>
                      )}
                    </div>
                    <div className="col-span-2">
                      <label htmlFor="taskDescription" className="block text-xs font-medium text-gray-500 dark:text-white mb-1 cursor-default select-none">Description</label>
                      <textarea
                        id="taskDescription"
                        name="description"
                        value={newTaskModalForm.description}
                        onChange={(e) => {
                          setNewTaskModalForm(prev => ({ ...prev, description: e.target.value }));
                          if (newTaskFormErrors.description) {
                            setNewTaskFormErrors(prev => ({ ...prev, description: false }));
                          }
                        }}
                        className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs dark:bg-gray-900 dark:text-white [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-track]:dark:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:dark:bg-gray-700 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-gray-400 [&::-webkit-scrollbar-thumb:hover]:dark:bg-gray-500"
                        style={{ 
                          fontFamily: 'Avenir, sans-serif',
                          resize: 'none'
                        }}
                        placeholder="Enter task description..."
                        rows={3}
                      />
                      {newTaskFormErrors.description && (
                        <p className="mt-0.5 text-xs text-red-600 font-medium cursor-default select-none">Description is required</p>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button 
                      onClick={() => {
                        const newErrors: Record<string, boolean> = {};
                        
                        if (!newTaskModalForm.title.trim()) {
                          newErrors.title = true;
                        }
                        if (!newTaskModalForm.assignee.trim()) {
                          newErrors.assignee = true;
                        }
                        if (!newTaskModalForm.contract.trim()) {
                          newErrors.contract = true;
                        }
                        if (!newTaskModalForm.dueDate.trim()) {
                          newErrors.dueDate = true;
                        }
                        if (!newTaskModalForm.description.trim()) {
                          newErrors.description = true;
                        }
                        
                        if (Object.keys(newErrors).length > 0) {
                          setNewTaskFormErrors(newErrors);
                          return;
                        }
                        
                        setNewTaskFormErrors({});
                        setNewTaskModalStep(2);
                      }}
                      className="px-4 py-2 rounded-lg bg-primary text-white font-semibold hover:bg-primary-dark transition-colors text-sm"
                      style={{ fontFamily: 'Avenir, sans-serif' }}
                    >
                      Continue
                    </button>
                  </div>
                </>
              )}
              {newTaskModalStep === 2 && (
                <div className="space-y-4">
                  {/* Subtasks Form Section */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="subtaskTitle" className="block text-xs font-medium text-gray-500 dark:text-white mb-1 cursor-default select-none">Subtask Name</label>
                        <input
                          type="text"
                          id="subtaskTitle"
                          name="subtaskTitle"
                          value={newSubtaskTitle}
                          onChange={(e) => setNewSubtaskTitle(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              if (newSubtaskTitle.trim()) {
                                const newSubtask = {
                                  id: Date.now().toString(),
                                  title: newSubtaskTitle.trim(),
                                  assignee: newSubtaskAssignee,
                                  status: newSubtaskStatus,
                                  dueDate: newSubtaskDueDate,
                                  description: newSubtaskDescription,
                                  completed: false
                                };
                                setNewTaskSubtasks(prev => [...prev, newSubtask]);
                                setNewSubtaskTitle('');
                                setNewSubtaskAssignee('');
                                setNewSubtaskStatus('To Do');
                                setNewSubtaskDueDate('');
                                setNewSubtaskDescription('');
                              }
                            }
                          }}
                          className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs dark:bg-gray-900 dark:text-white"
                          placeholder="Enter subtask name..."
                        />
                      </div>
                                             <div>
                         <label htmlFor="subtaskAssignee" className="block text-xs font-medium text-gray-500 dark:text-white mb-1 cursor-default select-none">Assignee</label>
                         <div className="relative">
                           <input
                             type="text"
                             id="subtaskAssignee"
                             name="subtaskAssignee"
                             value={newSubtaskAssignee}
                             onChange={(e) => {
                               setNewSubtaskAssignee(e.target.value);
                               if (e.target.value === '') {
                                 setShowNewSubtaskAssigneeDropdown(false);
                               } else if (!showNewSubtaskAssigneeDropdown) {
                                 setShowNewSubtaskAssigneeDropdown(true);
                               }
                             }}
                             onFocus={() => setShowNewSubtaskAssigneeDropdown(true)}
                             onClick={() => setShowNewSubtaskAssigneeDropdown(true)}
                             className="w-full h-[34px] px-4 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-xs transition-colors cursor-text focus:ring-2 focus:ring-primary focus:border-primary pr-10"
                             placeholder="Choose an assignee..."
                             style={{ fontFamily: 'Avenir, sans-serif' }}
                                                          autoComplete="off"
                            />
                            <TbChevronDown className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                            {showNewSubtaskAssigneeDropdown && (
                             <div className="subtask-assignee-dropdown absolute left-0 right-0 mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 z-[9999] max-h-48 overflow-y-auto cursor-default select-none [&::-webkit-scrollbar]:hidden" style={{ fontFamily: 'Avenir, sans-serif' }}>
                               {uniqueAssignees.length > 0 ? (
                                 <>
                                   {uniqueAssignees.map((assignee: string) => (
                                     <div
                                       key={assignee}
                                       className={`px-4 py-2 text-xs cursor-pointer ${newSubtaskAssignee === assignee ? 'bg-primary/10 text-primary' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'} select-none`}
                                       onClick={() => {
                                         setNewSubtaskAssignee(assignee);
                                         setShowNewSubtaskAssigneeDropdown(false);
                                       }}
                                     >
                                       {assignee}
                                     </div>
                                   ))}
                                   <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>
                                   <div
                                     className="px-4 py-2 text-xs cursor-pointer text-primary hover:bg-primary/10 select-none flex items-center gap-2"
                                     onClick={() => {
                                       // TODO: Add logic to create new assignee
                                       setShowNewSubtaskAssigneeDropdown(false);
                                     }}
                                   >
                                     <FaPlus className="text-xs" />
                                     Add new assignee
                                   </div>
                                 </>
                               ) : (
                                 <>
                                   <div className="px-4 py-2 text-xs text-gray-400 dark:text-gray-500 cursor-default select-none">No assignees found</div>
                                   <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>
                                   <div
                                     className="px-4 py-2 text-xs cursor-pointer text-primary hover:bg-primary/10 select-none flex items-center gap-2"
                                     onClick={() => {
                                       // TODO: Add logic to create new assignee
                                       setShowNewSubtaskAssigneeDropdown(false);
                                     }}
                                   >
                                     <FaPlus className="text-xs" />
                                     Add new assignee
                                   </div>
                                 </>
                               )}
                             </div>
                           )}
                         </div>
                       </div>
                                             <div>
                         <label htmlFor="subtaskStatus" className="block text-xs font-medium text-gray-500 dark:text-white mb-1 cursor-default select-none">Status</label>
                         <div className="relative">
                           <input
                             type="text"
                             id="subtaskStatus"
                             name="subtaskStatus"
                             value={newSubtaskStatus}
                             onChange={(e) => {
                               setNewSubtaskStatus(e.target.value);
                               if (e.target.value === '') {
                                 setShowNewSubtaskStatusDropdown(false);
                               } else if (!showNewSubtaskStatusDropdown) {
                                 setShowNewSubtaskStatusDropdown(true);
                               }
                             }}
                             onFocus={() => setShowNewSubtaskStatusDropdown(true)}
                             onClick={() => setShowNewSubtaskStatusDropdown(true)}
                             className="w-full h-[34px] px-4 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-xs transition-colors cursor-text focus:ring-2 focus:ring-primary focus:border-primary pr-10"
                             placeholder="Choose status..."
                             style={{ fontFamily: 'Avenir, sans-serif' }}
                                                           autoComplete="off"
                            />
                            <TbChevronDown className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                            {showNewSubtaskStatusDropdown && (
                             <div className="subtask-status-dropdown absolute left-0 right-0 mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 z-[9999] max-h-48 overflow-y-auto cursor-default select-none [&::-webkit-scrollbar]:hidden" style={{ fontFamily: 'Avenir, sans-serif' }}>
                               {statusOptions.map(status => (
                                 <div
                                   key={status.key}
                                   className={`px-4 py-2 text-xs cursor-pointer ${newSubtaskStatus === status.key ? 'bg-primary/10 text-primary' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'} select-none`}
                                   onClick={() => {
                                     setNewSubtaskStatus(status.key);
                                     setShowNewSubtaskStatusDropdown(false);
                                   }}
                                 >
                                   {status.title}
                                 </div>
                               ))}
                             </div>
                           )}
                         </div>
                       </div>
                                             <div>
                         <label htmlFor="subtaskDueDate" className="block text-xs font-medium text-gray-500 dark:text-white mb-1 cursor-default select-none">Due Date</label>
                         <div className="relative">
                           <input
                             type="date"
                             id="subtaskDueDate"
                             name="subtaskDueDate"
                             value={newSubtaskDueDate}
                             onChange={(e) => setNewSubtaskDueDate(e.target.value)}
                             className="w-full px-4 py-2 pr-10 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs text-black dark:text-white bg-white dark:bg-gray-900 [&::-webkit-calendar-picker-indicator]:hidden"
                             style={{ fontFamily: 'Avenir, sans-serif' }}
                           />
                           <button
                             type="button"
                             onClick={() => (document.getElementById('subtaskDueDate') as HTMLInputElement)?.showPicker()}
                             className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 flex items-center justify-center"
                           >
                             <LuCalendarFold className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                           </button>
                         </div>
                       </div>
                    </div>
                    <div>
                      <label htmlFor="subtaskDescription" className="block text-xs font-medium text-gray-500 dark:text-white mb-1 cursor-default select-none">Description</label>
                      <textarea
                        id="subtaskDescription"
                        name="subtaskDescription"
                        value={newSubtaskDescription}
                        onChange={(e) => setNewSubtaskDescription(e.target.value)}
                        className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs dark:bg-gray-900 dark:text-white resize-none [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-track]:dark:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:dark:bg-gray-700 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-gray-400 [&::-webkit-scrollbar-thumb:hover]:dark:bg-gray-500"
                        rows={3}
                        placeholder="Enter subtask description..."
                        style={{ fontFamily: 'Avenir, sans-serif' }}
                      />
                    </div>
                  </div>

                  {/* Subtasks List Section */}
                  <div className="mt-6">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 cursor-default select-none">Added Subtasks</h4>
                    <div className="space-y-2 cursor-default select-none">
                      {newTaskSubtasks.map((subtask, idx) => (
                        <div key={subtask.id} className="bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors">
                          {editingSubtaskIndex === idx ? (
                            // Inline editing form
                            <div className="p-4 space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Task Name</label>
                                  <input
                                    type="text"
                                    placeholder="Enter subtask name..."
                                    className="w-full px-3 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-lg text-xs bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                                    value={inlineEditingSubtaskTitle}
                                    onChange={(e) => setInlineEditingSubtaskTitle(e.target.value)}
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Assignee</label>
                                  <div className="relative" ref={inlineSubtaskAssigneeDropdownRef}>
                                    <input
                                      type="text"
                                      className="w-full px-3 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-lg text-xs bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary transition-colors cursor-text pr-10"
                                      placeholder="Choose an assignee..."
                                      value={inlineEditingSubtaskAssignee}
                                      onChange={(e) => {
                                        setInlineEditingSubtaskAssignee(e.target.value);
                                        if (e.target.value === '') {
                                          setShowInlineSubtaskAssigneeDropdown(false);
                                        } else if (!showInlineSubtaskAssigneeDropdown) {
                                          setShowInlineSubtaskAssigneeDropdown(true);
                                        }
                                      }}
                                      onFocus={() => setShowInlineSubtaskAssigneeDropdown(true)}
                                      onClick={() => setShowInlineSubtaskAssigneeDropdown(true)}
                                                                                                                   autoComplete="off"
                                    />
                                    <TbChevronDown className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                                    {showInlineSubtaskAssigneeDropdown && (
                                      <div className="absolute left-0 right-0 mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 z-50 max-h-48 overflow-y-auto cursor-default select-none [&::-webkit-scrollbar]:hidden">
                                        {uniqueAssignees.length > 0 ? (
                                          <>
                                            {uniqueAssignees.map((assignee: string) => (
                                              <div
                                                key={assignee}
                                                className={`px-4 py-2 text-xs cursor-pointer ${inlineEditingSubtaskAssignee === assignee ? 'bg-primary/10 text-primary' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'} select-none`}
                                                onClick={() => {
                                                  setInlineEditingSubtaskAssignee(assignee);
                                                  setShowInlineSubtaskAssigneeDropdown(false);
                                                }}
                                              >
                                                {assignee}
                                              </div>
                                            ))}
                                            <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>
                                            <div
                                              className="px-4 py-2 text-xs cursor-pointer text-primary hover:bg-primary/10 select-none flex items-center gap-2"
                                              onClick={() => {
                                                setShowInlineSubtaskAssigneeDropdown(false);
                                              }}
                                            >
                                              <FaPlus className="text-xs" />
                                              Add new assignee
                                            </div>
                                          </>
                                        ) : (
                                          <>
                                            <div className="px-4 py-2 text-xs text-gray-400 dark:text-gray-500 cursor-default select-none">No assignees found</div>
                                            <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>
                                            <div
                                              className="px-4 py-2 text-xs cursor-pointer text-primary hover:bg-primary/10 select-none flex items-center gap-2"
                                              onClick={() => {
                                                setShowInlineSubtaskAssigneeDropdown(false);
                                              }}
                                            >
                                              <FaPlus className="text-xs" />
                                              Add new assignee
                                            </div>
                                          </>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </div>
                                                                 <div>
                                   <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Due Date</label>
                                   <div className="relative">
                                     <input
                                       type="date"
                                       id={`inline-subtask-due-date-${idx}`}
                                       className="w-full px-3 py-2 pr-10 border-2 border-gray-200 dark:border-gray-700 rounded-lg text-xs bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary transition-colors [&::-webkit-calendar-picker-indicator]:hidden"
                                       value={inlineEditingSubtaskDueDate}
                                       onChange={(e) => setInlineEditingSubtaskDueDate(e.target.value)}
                                       onKeyDown={(e) => {
                                         if (e.key === 'Backspace') {
                                           e.preventDefault();
                                           setInlineEditingSubtaskDueDate('');
                                         }
                                       }}
                                     />
                                     <button
                                       type="button"
                                       onClick={() => {
                                         const dateInput = document.getElementById(`inline-subtask-due-date-${idx}`) as HTMLInputElement;
                                         if (dateInput) dateInput.showPicker();
                                       }}
                                       className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 flex items-center justify-center"
                                     >
                                       <LuCalendarFold className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                                     </button>
                                   </div>
                                 </div>
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Description</label>
                                                                 <textarea
                                   className="w-full px-3 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-lg text-xs bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary transition-colors resize-none [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-white [&::-webkit-scrollbar-track]:dark:bg-gray-800 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:dark:bg-gray-700 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-gray-400 [&::-webkit-scrollbar-thumb:hover]:dark:bg-gray-500"
                                   rows={3}
                                   placeholder="Enter subtask description..."
                                   value={inlineEditingSubtaskDescription}
                                   onChange={(e) => setInlineEditingSubtaskDescription(e.target.value)}
                                 />
                              </div>
                              <div className="flex justify-end">
                                <button
                                  type="button"
                                  onClick={() => handleSaveInlineEditSubtask(idx)}
                                  disabled={!inlineEditingSubtaskTitle.trim()}
                                  className="px-2.5 py-1 rounded-lg bg-primary text-white text-xs font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  Save
                                </button>
                                <button
                                  type="button"
                                  onClick={handleCancelInlineEditSubtask}
                                  className="px-2.5 py-1 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ml-1"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            // Display mode
                            <div className="flex items-center gap-3 p-3">
                              <div className="flex-1 flex items-center gap-4">
                                <span className="text-xs font-medium text-gray-900 dark:text-white">{subtask.title}</span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">{subtask.dueDate ? formatDatePretty(subtask.dueDate) : 'No due date'}</span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">{subtask.assignee || 'Unassigned'}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => handleStartInlineEditSubtask(idx)}
                                  className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors p-1"
                                >
                                  <TbPencil className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => {
                                    setNewTaskSubtasks(prev => prev.filter(st => st.id !== subtask.id));
                                  }}
                                  className="text-gray-700 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-500 transition-colors p-1 relative group"
                                >
                                  <TbTrash className="w-4 h-4" />
                                  <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-gray-200 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                                    Delete
                                  </span>
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                      {newTaskSubtasks.length === 0 && (
                        <div className="text-center py-8 text-gray-500 dark:text-gray-400 text-xs cursor-default select-none">
                          <TbCategory2 className="mx-auto mb-2 w-6 h-6 text-primary" />
                          <div>No subtasks yet</div>
                          <div>Add a subtask by filling in the details above and clicking the "Add Subtask" button</div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between mt-6 gap-2 sm:gap-0">
                    <button 
                      onClick={() => setNewTaskModalStep(1)}
                      className="px-5 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-semibold" 
                      style={{ fontFamily: 'Avenir, sans-serif' }}
                    >
                      Previous
                    </button>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-0">
                      <button
                        onClick={() => {
                          if (newSubtaskTitle.trim()) {
                            const newSubtask = {
                              id: Date.now().toString(),
                              title: newSubtaskTitle.trim(),
                              assignee: newSubtaskAssignee,
                              status: newSubtaskStatus,
                              dueDate: newSubtaskDueDate,
                              description: newSubtaskDescription,
                              completed: false
                            };
                            setNewTaskSubtasks(prev => [...prev, newSubtask]);
                            setNewSubtaskTitle('');
                            setNewSubtaskAssignee('');
                            setNewSubtaskStatus('To Do');
                            setNewSubtaskDueDate('');
                            setNewSubtaskDescription('');
                          }
                        }}
                        className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-semibold flex items-center justify-center"
                        style={{ fontFamily: 'Avenir, sans-serif' }}
                      >
                        <TbPlus className="w-4 h-4 mr-2" />
                        Add Subtask
                      </button>
                      <button 
                        onClick={() => setNewTaskModalStep(3)}
                        className="px-4 py-2 rounded-lg bg-primary text-white font-semibold hover:bg-primary-dark transition-colors text-sm sm:ml-1"
                        style={{ fontFamily: 'Avenir, sans-serif' }}
                      >
                        Continue
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {newTaskModalStep === 3 && (
                <div className="space-y-6">
                  {/* Document Name Field */}
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1 cursor-default select-none" style={{ fontFamily: 'Avenir, sans-serif' }}>Document Name</label>
                      <input
                        type="text"
                        placeholder="Enter document name..."
                        className="w-full h-[34px] px-4 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-xs transition-colors cursor-text focus:ring-2 focus:ring-primary focus:border-primary"
                        value={newTaskDocumentName}
                        onChange={(e) => setNewTaskDocumentName(e.target.value)}
                        style={{ fontFamily: 'Avenir, sans-serif' }}
                      />
                    </div>
                    <div>
                      {/* Empty right column to maintain layout consistency */}
                    </div>
                  </div>

                  {/* Upload Area with Integrated File Source */}
                  <div className="relative mb-1" ref={newTaskFileSourceDropdownRef}>
                    <div 
                      className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-700 py-8 px-4 text-center transition hover:border-primary cursor-pointer"
                      onClick={() => {
                        setShowNewTaskFileSourceDropdown(!showNewTaskFileSourceDropdown);
                      }}
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        
                        const files = Array.from(e.dataTransfer.files);
                        if (files.length > 0) {
                          // Set file source to Desktop
                          setSelectedNewTaskFileSource('Desktop');
                          
                          // Add files to uploaded files
                          setNewTaskUploadedFiles(prev => [...prev, ...files]);
                          
                          // Pre-populate document name with first file name (without extension) only if field is empty
                          if (!newTaskDocumentName.trim()) {
                            const fileName = files[0].name;
                            const nameWithoutExtension = fileName.replace(/\.[^/.]+$/, "");
                            setNewTaskDocumentName(nameWithoutExtension);
                          }
                        }
                      }}
                    >
                      <TbDragDrop className="text-3xl text-gray-400 mb-2" />
                      <div className="text-xs text-gray-700 dark:text-gray-300 font-medium cursor-default select-none">Click to upload or drag and drop</div>
                      <div className="text-xs text-gray-400 dark:text-gray-500 mt-1 cursor-default select-none">PDF, DOC, DOCX, or JPG (max. 10MB each)</div>
                    </div>
                    
                    {/* Upload Source Dropdown */}
                    {showNewTaskFileSourceDropdown && (
                      <div className="absolute z-50 mt-1 w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 cursor-default select-none">
                        <div className="py-2">
                          <label htmlFor="new-task-desktop-file-upload" className="block px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 cursor-pointer select-none">
                            <div className="flex items-center gap-2">
                              <TbDeviceDesktopPlus className="text-base text-primary" />
                              <span className="text-xs cursor-default select-none">Desktop</span>
                            </div>
                          </label>
                          <input
                            id="new-task-desktop-file-upload"
                            name="new-task-desktop-file-upload"
                            type="file"
                            accept=".pdf,.doc,.docx,.jpg,.jpeg"
                            className="hidden"
                            multiple
                            onChange={(e) => {
                              setSelectedNewTaskFileSource('Desktop');
                              setShowNewTaskFileSourceDropdown(false);
                              if (e.target.files) {
                                const newFiles = Array.from(e.target.files);
                                setNewTaskUploadedFiles(prev => [...prev, ...newFiles]);
                                
                                // Pre-populate document name with first file name (without extension) only if field is empty
                                if (!newTaskDocumentName.trim()) {
                                  const fileName = newFiles[0].name;
                                  const nameWithoutExtension = fileName.replace(/\.[^/.]+$/, "");
                                  setNewTaskDocumentName(nameWithoutExtension);
                                }
                              }
                            }}
                          />
                          <button className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 text-gray-700 dark:text-gray-300 cursor-pointer select-none" onClick={() => { setSelectedNewTaskFileSource('Box'); setShowNewTaskFileSourceDropdown(false); }}>
                            <SiBox className="text-base text-primary" />
                            <span className="text-xs cursor-default select-none">Box</span>
                          </button>
                          <button className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 text-gray-700 dark:text-gray-300 cursor-pointer select-none" onClick={() => { setSelectedNewTaskFileSource('Dropbox'); setShowNewTaskFileSourceDropdown(false); }}>
                            <SlSocialDropbox className="text-base text-primary" />
                            <span className="text-xs cursor-default select-none">Dropbox</span>
                          </button>
                          <button className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 text-gray-700 dark:text-gray-300 cursor-pointer select-none" onClick={() => { setSelectedNewTaskFileSource('Google Drive'); setShowNewTaskFileSourceDropdown(false); }}>
                            <TbBrandGoogleDrive className="text-base text-primary" />
                            <span className="text-xs cursor-default select-none">Google Drive</span>
                          </button>
                          <button className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 text-gray-700 dark:text-gray-300 cursor-pointer select-none" onClick={() => { setSelectedNewTaskFileSource('OneDrive'); setShowNewTaskFileSourceDropdown(false); }}>
                            <TbBrandOnedrive className="text-base text-primary" />
                            <span className="text-xs cursor-default select-none">OneDrive</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Uploaded Files Display */}
                  {newTaskUploadedFiles.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-3 cursor-default select-none" style={{ fontFamily: 'Avenir, sans-serif' }}>Added Documents</h4>
                      <div className="flex flex-col gap-2 max-h-48 overflow-y-auto [&::-webkit-scrollbar]:hidden">
                        {newTaskUploadedFiles.map((file, idx) => (
                          <div key={idx} className="bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-3 border border-gray-200 dark:border-gray-700 transition-colors">
                            {editingTaskFileIndex === idx ? (
                              // Inline editing form
                              <div className="space-y-3">
                                <div className="flex gap-2">
                                  <input
                                    type="text"
                                    placeholder="Document name..."
                                    className="w-1/3 h-[28px] px-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs text-gray-900 dark:text-white focus:ring-1 focus:ring-primary focus:border-primary"
                                    value={inlineEditingTaskFileName}
                                    onChange={(e) => setInlineEditingTaskFileName(e.target.value)}
                                  />
                                </div>
                                <div className="flex justify-end">
                                  <button
                                    type="button"
                                    onClick={() => handleSaveInlineEditTaskFile(idx)}
                                    disabled={!inlineEditingTaskFileName.trim()}
                                    className="px-2.5 py-1 rounded-lg bg-primary text-white text-xs font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    Save
                                  </button>
                                  <button
                                    type="button"
                                    onClick={handleCancelInlineEditTaskFile}
                                    className="px-2.5 py-1 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ml-1"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            ) : (
                              // Display mode
                              <div className="flex items-center justify-between">
                                <div className="flex-1 min-w-0">
                                  <div className="font-semibold text-xs text-black dark:text-white flex-1 min-w-0 truncate">
                                    {file.name}
                                  </div>
                                  <div className="text-xs text-gray-500 cursor-default select-none">
                                    {file.name.split('.').pop()?.toUpperCase() || 'Unknown'} &bull; {(file.size / 1024 / 1024).toFixed(2)} MB
                                  </div>
                                </div>
                                <div className="flex items-center gap-1">
                                  <button 
                                    type="button"
                                    onClick={() => handleStartInlineEditTaskFile(idx)}
                                    className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors p-1"
                                  >
                                    <HiOutlinePencil className="h-4 w-4" />
                                  </button>
                                  <button 
                                    className="text-gray-700 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-500 transition-colors p-1"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setNewTaskUploadedFiles(prev => prev.filter((_, index) => index !== idx));
                                    }}
                                  >
                                    <TbTrash className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between mt-6">
                    <button 
                      onClick={() => setNewTaskModalStep(2)}
                      className="px-5 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-semibold" 
                      style={{ fontFamily: 'Avenir, sans-serif' }}
                    >
                      Previous
                    </button>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => {
                          // Handle task creation
                          console.log('Creating task:', newTaskModalForm);
                          console.log('Subtasks:', newTaskSubtasks);
                          console.log('Documents:', newTaskUploadedFiles);
                          
                          // Generate unique task ID and code
                          const newTaskId = Date.now().toString();
                          const newTaskNumber = Math.max(...tasks.map(t => t.taskNumber), 0) + 1;
                          const newTaskCode = `TSK-${String(newTaskNumber).padStart(3, '0')}`;
                          
                          // Parse contract ID from the contract string (format: "ID - Title")
                          const contractId = newTaskModalForm.contract.split(' - ')[0];
                          
                          // Generate assignee initials and color
                          const assigneeWords = newTaskModalForm.assignee.split(' ');
                          const assigneeInitials = assigneeWords.length >= 2 
                            ? `${assigneeWords[0][0]}${assigneeWords[1][0]}`.toUpperCase()
                            : newTaskModalForm.assignee.substring(0, 2).toUpperCase();
                          
                          const assigneeColors = [
                            'bg-purple-200 text-purple-700',
                            'bg-pink-200 text-pink-700', 
                            'bg-blue-200 text-blue-700',
                            'bg-green-200 text-green-700',
                            'bg-yellow-200 text-yellow-700',
                            'bg-red-200 text-red-700',
                            'bg-indigo-200 text-indigo-700'
                          ];
                          const assigneeColor = assigneeColors[Math.floor(Math.random() * assigneeColors.length)];
                          
                          // Convert form subtasks to the correct format
                          const formattedSubtasks = newTaskSubtasks.map((subtask, index) => ({
                            id: `sub-${newTaskId}-${index + 1}`,
                            title: subtask.title,
                            completed: subtask.completed || false
                          }));
                          
                          // Create the new task object
                          const newTask: Task = {
                            id: newTaskId,
                            code: newTaskCode,
                            title: newTaskModalForm.title,
                            contractId: contractId,
                            type: 'Task',
                            due: newTaskModalForm.dueDate,
                            progress: `${formattedSubtasks.filter(st => st.completed).length} of ${formattedSubtasks.length}`,
                            assignee: newTaskModalForm.assignee,
                            assigneeInitials: assigneeInitials,
                            assigneeColor: assigneeColor,
                            taskNumber: newTaskNumber,
                            description: newTaskModalForm.description,
                            status: newTaskModalForm.status,
                            subtasks: formattedSubtasks
                          };
                          
                          // Add the task to the store
                          addTask(newTask);
                          
                          // Show success toast notification
                          const selectedContract = contracts.find(c => c.id === contractId);
                          toast({
                            title: "Task Created Successfully",
                            description: `"${newTask.title}" with Task ID #${newTask.taskNumber} has been created for Contract ID #${contractId} - ${selectedContract?.title || 'Unknown Contract'}`,
                            duration: 30000, // 30 seconds
                          });
                          
                          // Add notification for task created
                          addTaskCreatedNotification(newTask.taskNumber.toString(), newTask.title, contractId, selectedContract?.title || 'Unknown Contract');
                          
                          // Store uploaded files with the task (you might want to implement file storage logic)
                          if (newTaskUploadedFiles.length > 0) {
                            // Store files in localStorage for now (in a real app, you'd upload to server)
                            const taskFilesData = {
                              taskId: newTaskId,
                              files: newTaskUploadedFiles.map(file => ({
                                name: file.name,
                                size: file.size,
                                type: file.type,
                                lastModified: file.lastModified
                              }))
                            };
                            const existingFiles = JSON.parse(localStorage.getItem('taskFiles') || '{}');
                            existingFiles[newTaskId] = taskFilesData;
                            localStorage.setItem('taskFiles', JSON.stringify(existingFiles));
                            
                            // Update state
                            setTaskFiles(existingFiles);
                          }
                          
                          // Reset form
                          setShowNewTaskModal(false);
                          setNewTaskModalStep(1);
                          setNewTaskModalForm({ title: '', assignee: '', status: 'To Do' as TaskStatus, dueDate: '', description: '', contract: '' });
                          setNewTaskFormErrors({});
                          setNewTaskUploadedFiles([]);
                          setNewTaskSubtasks([]);
                          setNewSubtaskTitle('');
                          setNewSubtaskAssignee('');
                          setNewSubtaskStatus('To Do');
                          setNewSubtaskDueDate('');
                          setNewSubtaskDescription('');
                          setShowNewSubtaskAssigneeDropdown(false);
                          setShowNewSubtaskStatusDropdown(false);
                          setNewTaskDocumentName('');
                          setEditingTaskFileIndex(null);
                          setInlineEditingTaskFileName('');
                          setEditingSubtaskIndex(null);
                          setInlineEditingSubtaskTitle('');
                          setInlineEditingSubtaskAssignee('');
                          setInlineEditingSubtaskDueDate('');
                          setInlineEditingSubtaskDescription('');
                          setShowInlineSubtaskAssigneeDropdown(false);
                        }}
                        className="px-4 py-2 rounded-lg bg-primary text-white font-semibold hover:bg-primary-dark transition-colors text-sm"
                        style={{ fontFamily: 'Avenir, sans-serif' }}
                      >
                        Create Task
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* Tabs */}
            {/* Mobile: Stacked layout */}
            <div className="lg:hidden cursor-default select-none mb-6">
              <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1 border border-gray-200 dark:border-gray-700 w-fit">
                {kanbanTabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setKanbanTab(tab)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center justify-center ${
                      kanbanTab === tab
                        ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                        : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Desktop: Horizontal layout */}
            <div className="hidden lg:flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1 border border-gray-200 dark:border-gray-700 w-fit cursor-default select-none mb-4">
              {kanbanTabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setKanbanTab(tab)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center justify-center ${
                      kanbanTab === tab
                        ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                        : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {/* Tasks in Progress */}
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 flex items-center gap-4 shadow-sm h-full cursor-default select-none">
                <div className="h-10 w-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center border-2 border-blue-200 dark:border-blue-800 cursor-default select-none">
                  <FaRetweet size={21} className="text-blue-500 dark:text-blue-400" />
                </div>
                <div className="flex flex-col items-start h-full cursor-default select-none">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 font-sans cursor-default select-none" style={{ fontFamily: 'Avenir, sans-serif' }}>Tasks In Progress</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white cursor-default select-none">{kanbanColumns.find(col => col.key === 'In Progress')?.tasks.length || 0}</p>
                  <p className="text-xs invisible cursor-default select-none">placeholder</p>
                </div>
              </div>

              {/* Due Within 7 Days */}
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 flex items-center gap-4 shadow-sm h-full cursor-default select-none">
                <div className="h-10 w-10 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center border-2 border-yellow-200 dark:border-yellow-800 cursor-default select-none">
                  <LuCalendarClock size={21} className="text-yellow-500 dark:text-yellow-400" />
                </div>
                <div className="flex flex-col items-start h-full cursor-default select-none">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 font-sans cursor-default select-none" style={{ fontFamily: 'Avenir, sans-serif' }}>Due Within 7 Days</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white cursor-default select-none">5</p>
                  <p className="text-xs invisible cursor-default select-none">placeholder</p>
                </div>
              </div>

              {/* Blocked Tasks */}
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 flex items-center gap-4 shadow-sm h-full cursor-default select-none">
                <div className="h-10 w-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center border-2 border-red-200 dark:border-red-800 cursor-default select-none">
                  <CgPlayStopR size={20} className="text-red-500 dark:text-red-400" />
                </div>
                <div className="flex flex-col items-start h-full cursor-default select-none">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 font-sans cursor-default select-none" style={{ fontFamily: 'Avenir, sans-serif' }}>Blocked Tasks</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white cursor-default select-none">{kanbanColumns.find(col => col.key === 'Blocked')?.tasks.length || 0}</p>
                  <p className="text-xs invisible cursor-default select-none">placeholder</p>
                </div>
              </div>

              {/* Completed Tasks */}
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 flex items-center gap-4 shadow-sm h-full cursor-default select-none">
                <div className="h-10 w-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center border-2 border-green-200 dark:border-green-800 cursor-default select-none">
                  <FaRegSquareCheck size={20} className="text-green-500 dark:text-green-400" />
                </div>
                <div className="flex flex-col items-start h-full cursor-default select-none">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 font-sans cursor-default select-none" style={{ fontFamily: 'Avenir, sans-serif' }}>Done Tasks</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white cursor-default select-none">{kanbanColumns.find(col => col.key === 'Done')?.tasks.length || 0}</p>
                  <p className="text-xs invisible cursor-default select-none">placeholder</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <hr className="my-3 md:my-6 border-gray-300 cursor-default select-none" />

      {/* Filter Bar - Responsive Design */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-4 mb-6 mt-2">
        {/* Mobile: Stacked layout */}
        <div className="lg:hidden">
          {/* Search Bar */}
          <div className="flex items-center bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 w-full">
            <TbSearch className="text-gray-400 mr-2" size={18} />
            <input
              type="text"
              placeholder="Search tasks, assignees, contracts or IDs..."
              value={taskSearchTerm}
              onChange={(e) => setTaskSearchTerm(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none focus:ring-0 focus:outline-none text-xs text-gray-700 dark:text-white placeholder-gray-400 font-medium"
              style={{ fontFamily: "Avenir, sans-serif" }}
            />
          </div>
          {/* Filter Buttons - Stacked, full width */}
          <div className="flex flex-col gap-2 mt-2">
            {/* Contract Filter */}
            <div className="relative">
              <button
                ref={mobileContractButtonRef}
                className="flex items-center justify-between w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2.5 text-gray-700 dark:text-gray-300 font-medium text-xs shadow-sm whitespace-nowrap"
                style={{ fontFamily: 'Avenir, sans-serif' }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setOpenContractDropdown(v => !v);
                  if (!openContractDropdown) {
                    setOpenAssigneeDropdown(false);
                    setShowStatusDropdown(false);
                  }
                }}
              >
                <span className="flex items-center"><TbFileSearch className="text-gray-400 mr-2" size={17} />Contract</span>
                <TbChevronDown className="text-gray-400 dark:text-gray-500" size={18} />
              </button>
              {openContractDropdown && (
                <div ref={mobileContractDropdownRef} className="absolute top-full right-0 mt-2 w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 z-50 py-2 contract-dropdown" style={{ 
                  fontFamily: 'Avenir, sans-serif'
                }}>
                  {/* Search Bar */}
                  <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search contracts..."
                        value={contractSearch}
                        onChange={(e) => setContractSearch(e.target.value)}
                        className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-lg text-xs font-medium text-gray-700 dark:text-white bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                        style={{ fontFamily: 'Avenir, sans-serif' }}
                      />
                      <TbSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>

                  <button
                    className={`w-full text-left px-4 py-2 text-xs hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center ${selectedContracts.length === 0 ? 'text-primary' : 'text-gray-700 dark:text-gray-300'}`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSelectedContracts([]);
                      // Do NOT close the dropdown here
                    }}
                  >
                    <div className="w-4 h-4 border border-gray-300 rounded mr-2 flex items-center justify-center">
                      {selectedContracts.length === 0 && (
                        <div className="w-3 h-3 bg-primary rounded-sm flex items-center justify-center">
                          <FaCheck className="text-white" size={8} />
                        </div>
                      )}
                    </div>
                    All
                  </button>
                  {contracts
                    .filter(contract => 
                      contract.id.toLowerCase().includes(contractSearch.toLowerCase()) ||
                      contract.title.toLowerCase().includes(contractSearch.toLowerCase())
                    )
                    .sort((a, b) => Number(a.id) - Number(b.id))
                    .map(contract => (
                      <button
                        key={contract.id}
                        className={`w-full text-left px-4 py-2 text-xs hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center whitespace-nowrap truncate ${selectedContracts.includes(String(contract.id)) ? 'text-primary' : 'text-gray-700 dark:text-gray-300'}`}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setSelectedContracts(prev => {
                            if (prev.includes(String(contract.id))) {
                              return prev.filter(c => c !== String(contract.id));
                            } else {
                              return [...prev, String(contract.id)];
                            }
                          });
                          // Do NOT close the dropdown here
                        }}
                      >
                        <div className="w-4 h-4 border border-gray-300 rounded mr-2 flex items-center justify-center">
                          {selectedContracts.includes(String(contract.id)) && (
                            <div className="w-3 h-3 bg-primary rounded-sm flex items-center justify-center">
                              <FaCheck className="text-white" size={8} />
                            </div>
                          )}
                        </div>
                        {contract.id} - {contract.title}
                      </button>
                    ))}
                </div>
              )}
            </div>
            {/* Assignee Filter */}
            <div className="relative">
              <button
                ref={mobileAssigneeButtonRef}
                className="flex items-center justify-between w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2.5 text-gray-700 dark:text-gray-300 font-medium text-xs shadow-sm whitespace-nowrap"
                style={{ fontFamily: 'Avenir, sans-serif' }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setOpenAssigneeDropdown(v => !v);
                  if (!openAssigneeDropdown) {
                    setOpenContractDropdown(false);
                    setShowStatusDropdown(false);
                  }
                }}
              >
                <span className="flex items-center"><TbUserSearch className="text-gray-400 mr-2" size={17} />Assignee</span>
                <TbChevronDown className="text-gray-400 dark:text-gray-500" size={18} />
              </button>
              {openAssigneeDropdown && (
                <div ref={mobileAssigneeDropdownRef} className="absolute top-full right-0 mt-2 w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 z-50 py-2 assignee-dropdown" style={{ fontFamily: 'Avenir, sans-serif' }}>
                  <button
                    className={`w-full px-4 py-2 text-left text-xs hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center ${selectedAssignees.length === 0 ? 'text-primary' : 'text-gray-700 dark:text-gray-300'}`}
                    onClick={(e: React.MouseEvent) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSelectedAssignees([]);
                      // Do NOT close the dropdown here
                    }}
                  >
                    <div className="w-4 h-4 border border-gray-300 rounded mr-2 flex items-center justify-center">
                      {selectedAssignees.length === 0 && (
                        <div className="w-3 h-3 bg-primary rounded-sm flex items-center justify-center">
                          <FaCheck className="text-white" size={8} />
                        </div>
                      )}
                    </div>
                    All
                  </button>
                  <button
                    className={`w-full px-4 py-2 text-left text-xs hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center ${selectedAssignees.includes('__ME__') ? 'text-primary' : 'text-gray-700 dark:text-gray-300'}`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSelectedAssignees(prev => {
                        if (prev.includes('__ME__')) {
                          return prev.filter(a => a !== '__ME__');
                        } else {
                          return [...prev, '__ME__'];
                        }
                      });
                      // Do NOT close the dropdown here
                    }}
                  >
                    <div className="w-4 h-4 border border-gray-300 rounded mr-2 flex items-center justify-center">
                      {selectedAssignees.includes('__ME__') && (
                        <div className="w-3 h-3 bg-primary rounded-sm flex items-center justify-center">
                          <FaCheck className="text-white" size={8} />
                        </div>
                      )}
                    </div>
                    Me
                  </button>
                  {uniqueAssignees.map(assignee => (
                    <button
                      key={assignee}
                      className={`w-full px-4 py-2 text-left text-xs hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center ${selectedAssignees.includes(assignee) ? 'text-primary' : 'text-gray-700 dark:text-gray-300'}`}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setSelectedAssignees(prev => {
                          if (prev.includes(assignee)) {
                            return prev.filter(a => a !== assignee);
                          } else {
                            return [...prev, assignee];
                          }
                        });
                        // Do NOT close the dropdown here
                      }}
                    >
                      <div className="w-4 h-4 border border-gray-300 rounded mr-2 flex items-center justify-center">
                        {selectedAssignees.includes(assignee) && (
                          <div className="w-3 h-3 bg-primary rounded-sm flex items-center justify-center">
                            <FaCheck className="text-white" size={8} />
                          </div>
                        )}
                      </div>
                      {assignee}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {/* Status Filter */}
            <div className="relative">
              <button
                ref={mobileStatusButtonRef}
                className="flex items-center justify-between w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2.5 text-gray-700 dark:text-gray-300 font-medium text-xs shadow-sm whitespace-nowrap"
                style={{ fontFamily: 'Avenir, sans-serif' }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowStatusDropdown(v => !v);
                  if (!showStatusDropdown) {
                    setOpenAssigneeDropdown(false);
                    setOpenContractDropdown(false);
                  }
                }}
              >
                                    <span className="flex items-center"><TbHistory className="text-gray-400 mr-2" size={17} />Status</span>
                <TbChevronDown className="text-gray-400 dark:text-gray-500" size={18} />
              </button>
              {showStatusDropdown && (
                <div ref={mobileStatusDropdownRef} className="absolute top-full right-0 mt-2 w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 z-50 py-2 status-filter-dropdown" style={{ fontFamily: 'Avenir, sans-serif' }}>
                  <button
                    className={`w-full px-4 py-2 text-left text-xs hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center ${selectedStatuses.includes('All') ? 'text-primary' : 'text-gray-700 dark:text-gray-300'}`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSelectedStatuses(['All']);
                    }}
                  >
                    <div className="w-4 h-4 border border-gray-300 rounded mr-2 flex items-center justify-center">
                      {selectedStatuses.includes('All') && (
                        <div className="w-3 h-3 bg-primary rounded-sm flex items-center justify-center">
                          <FaCheck className="text-white" size={8} />
                        </div>
                      )}
                    </div>
                    All
                  </button>
                  {statusOptions.map(status => (
                    <button
                      key={status.key}
                      className={`w-full px-4 py-2 text-left text-xs hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center ${selectedStatuses.includes(status.key as StatusOption) ? 'text-primary' : 'text-gray-700 dark:text-gray-300'}`}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setSelectedStatuses(prev => {
                          const newStatuses = prev.filter(s => s !== 'All');
                          if (prev.includes(status.key as StatusOption)) {
                            const filtered = newStatuses.filter(s => s !== status.key);
                            // If no statuses are selected, default to "All"
                            return filtered.length === 0 ? ['All'] : filtered;
                          } else {
                            return [...newStatuses, status.key as StatusOption];
                          }
                        });
                      }}
                    >
                      <div className="w-4 h-4 border border-gray-300 rounded mr-2 flex items-center justify-center">
                        {selectedStatuses.includes(status.key as StatusOption) && (
                          <div className="w-3 h-3 bg-primary rounded-sm flex items-center justify-center">
                            <FaCheck className="text-white" size={8} />
                          </div>
                        )}
                      </div>
                      {status.title}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* View Toggle - Mobile */}
            <div className="relative flex-shrink-0 mt-2">
              <div className="flex bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-0.5 justify-center">
                <button
                  className={`flex items-center gap-2 px-2.5 py-1 rounded-md text-xs font-medium transition-colors relative group ${
                    viewMode === 'kanban' 
                      ? 'bg-primary text-white shadow-sm' 
                      : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  }`}
                  onClick={() => setViewMode('kanban')}
                >
                  <RiKanbanView2 size={17} />
                  <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-gray-200 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                    Kanban
                  </span>
                </button>
                <button
                  className={`flex items-center gap-2 px-2.5 py-1 rounded-md text-xs font-medium transition-colors relative group ${
                    viewMode === 'table' 
                      ? 'bg-primary text-white shadow-sm' 
                      : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  }`}
                  onClick={() => setViewMode('table')}
                >
                  <LuTable2 size={17} />
                  <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-gray-200 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                    Table
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Desktop: Horizontal layout */}
        <div className="hidden lg:flex items-center gap-1">
          {/* Search Bar */}
          <div className="flex items-center bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 flex-1 min-w-0">
            <TbSearch className="text-gray-400 mr-2" size={18} />
            <input
              type="text"
              placeholder="Search tasks, assignees, contracts or IDs..."
              value={taskSearchTerm}
              onChange={(e) => setTaskSearchTerm(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none focus:ring-0 focus:outline-none text-xs text-gray-700 dark:text-white placeholder-gray-400 font-medium min-w-0"
              style={{ fontFamily: "Avenir, sans-serif" }}
            />
          </div>
          {/* Filter Buttons */}
          <div className="flex items-center">
            {/* Contract Filter */}
            <div className="relative flex-shrink-0">
              <button
                ref={contractButtonRef}
                className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-700 dark:text-gray-300 font-medium text-xs min-w-[120px] relative whitespace-nowrap"
                style={{ fontFamily: 'Avenir, sans-serif' }}
                onClick={() => { setOpenContractDropdown(v => !v); setOpenAssigneeDropdown(false); setShowStatusDropdown(false); }}
              >
                <TbFileSearch className="text-gray-400" size={18} />
                <span>Contract</span>
                <TbChevronDown className="ml-1 text-gray-400 dark:text-gray-500" size={18} />
              </button>
              {openContractDropdown && (
                <div 
                  ref={contractDropdownRef}
                  className="absolute right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 z-50 py-2 min-w-[320px] w-72 contract-dropdown" 
                  style={{ fontFamily: 'Avenir, sans-serif' }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Search Bar */}
                  <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search contracts..."
                        value={contractSearch}
                        onChange={(e) => setContractSearch(e.target.value)}
                        className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-lg text-xs font-medium text-gray-700 dark:text-white bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                        style={{ fontFamily: 'Avenir, sans-serif' }}
                      />
                      <TbSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>

                  <button
                    className={`w-full text-left px-4 py-2 text-xs hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center ${selectedContracts.length === 0 ? 'text-primary' : 'text-gray-700 dark:text-gray-300'}`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSelectedContracts([]);
                      // Do NOT close the dropdown here
                    }}
                  >
                    <div className="w-4 h-4 border border-gray-300 rounded mr-2 flex items-center justify-center">
                      {selectedContracts.length === 0 && (
                        <div className="w-3 h-3 bg-primary rounded-sm flex items-center justify-center">
                          <FaCheck className="text-white" size={8} />
                        </div>
                      )}
                    </div>
                    All
                  </button>
                  {contracts
                    .filter(contract => 
                      contract.id.toLowerCase().includes(contractSearch.toLowerCase()) ||
                      contract.title.toLowerCase().includes(contractSearch.toLowerCase())
                    )
                    .sort((a, b) => Number(a.id) - Number(b.id))
                    .map(contract => (
                      <button
                        key={contract.id}
                        className={`w-full text-left px-4 py-2 text-xs hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center whitespace-nowrap truncate ${selectedContracts.includes(String(contract.id)) ? 'text-primary' : 'text-gray-700 dark:text-gray-300'}`}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setSelectedContracts(prev => {
                            if (prev.includes(String(contract.id))) {
                              return prev.filter(c => c !== String(contract.id));
                            } else {
                              return [...prev, String(contract.id)];
                            }
                          });
                          // Do NOT close the dropdown here
                        }}
                      >
                        <div className="w-4 h-4 border border-gray-300 rounded mr-2 flex items-center justify-center">
                          {selectedContracts.includes(String(contract.id)) && (
                            <div className="w-3 h-3 bg-primary rounded-sm flex items-center justify-center">
                              <FaCheck className="text-white" size={8} />
                            </div>
                          )}
                        </div>
                        {contract.id} - {contract.title}
                      </button>
                    ))}
                </div>
              )}
            </div>
            {/* Assignee Filter */}
            <div className="relative flex-shrink-0 ml-1">
              <button
                ref={assigneeButtonRef}
                className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-700 dark:text-gray-300 font-medium text-xs min-w-[120px] relative whitespace-nowrap"
                style={{ fontFamily: 'Avenir, sans-serif' }}
                onClick={() => { setOpenAssigneeDropdown(v => !v); setOpenContractDropdown(false); setShowStatusDropdown(false); }}
              >
                <TbUserSearch className="text-gray-400" size={18} />
                <span>Assignee</span>
                <TbChevronDown className="ml-1 text-gray-400 dark:text-gray-500" size={18} />
              </button>
              {openAssigneeDropdown && (
                <div 
                  ref={assigneeDropdownRef}
                  className="absolute top-full right-0 mt-2 w-44 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 z-50 py-2 assignee-dropdown max-h-96 overflow-y-auto [&::-webkit-scrollbar]:hidden" 
                  style={{ fontFamily: 'Avenir, sans-serif' }}
                >
                  <button
                    className={`w-full px-4 py-2 text-left text-xs hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center ${selectedAssignees.length === 0 ? 'text-primary' : 'text-gray-700 dark:text-gray-300'}`}
                    onClick={(e: React.MouseEvent) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSelectedAssignees([]);
                    }}
                  >
                    <div className="w-4 h-4 border border-gray-300 rounded mr-2 flex items-center justify-center">
                      {selectedAssignees.length === 0 && (
                        <div className="w-3 h-3 bg-primary rounded-sm flex items-center justify-center">
                          <FaCheck className="text-white" size={8} />
                        </div>
                      )}
                    </div>
                    All
                  </button>
                  <button
                    className={`w-full px-4 py-2 text-left text-xs hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center ${selectedAssignees.includes('__ME__') ? 'text-primary' : 'text-gray-700 dark:text-gray-300'}`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSelectedAssignees(prev => {
                        if (prev.includes('__ME__')) {
                          return prev.filter(a => a !== '__ME__');
                        } else {
                          return [...prev, '__ME__'];
                        }
                      });
                    }}
                  >
                    <div className="w-4 h-4 border border-gray-300 rounded mr-2 flex items-center justify-center">
                      {selectedAssignees.includes('__ME__') && (
                        <div className="w-3 h-3 bg-primary rounded-sm flex items-center justify-center">
                          <FaCheck className="text-white" size={8} />
                        </div>
                      )}
                    </div>
                    Me
                  </button>
                  {uniqueAssignees.map(assignee => (
                    <button
                      key={assignee}
                      className={`w-full px-4 py-2 text-left text-xs hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center ${selectedAssignees.includes(assignee) ? 'text-primary' : 'text-gray-700 dark:text-gray-300'}`}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setSelectedAssignees(prev => {
                          if (prev.includes(assignee)) {
                            return prev.filter(a => a !== assignee);
                          } else {
                            return [...prev, assignee];
                          }
                        });
                      }}
                    >
                      <div className="w-4 h-4 border border-gray-300 rounded mr-2 flex items-center justify-center">
                        {selectedAssignees.includes(assignee) && (
                          <div className="w-3 h-3 bg-primary rounded-sm flex items-center justify-center">
                            <FaCheck className="text-white" size={8} />
                          </div>
                        )}
                      </div>
                      {assignee}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {/* Status Filter */}
            <div className="relative flex-shrink-0 ml-1">
              <button
                ref={statusButtonRef}
                className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-700 dark:text-gray-300 font-medium text-xs min-w-[120px] relative whitespace-nowrap" 
                style={{ fontFamily: 'Avenir, sans-serif' }}
                onClick={() => { setShowStatusDropdown(v => !v); setOpenAssigneeDropdown(false); setOpenContractDropdown(false); }}
              >
                                    <TbHistory className="text-gray-400" size={18} />
                    <span>Status</span>
                <TbChevronDown className="ml-1 text-gray-400 dark:text-gray-500" size={18} />
              </button>
              {showStatusDropdown && (
                <div 
                  ref={statusDropdownRef}
                  className="absolute top-full right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 z-50 py-2 status-filter-dropdown max-h-96 overflow-y-auto [&::-webkit-scrollbar]:hidden" 
                  style={{ fontFamily: 'Avenir, sans-serif' }}
                >
                  <button
                    className={`w-full px-4 py-2 text-left text-xs hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center ${selectedStatuses.includes('All') ? 'text-primary' : 'text-gray-700 dark:text-gray-300'}`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSelectedStatuses(['All']);
                    }}
                  >
                    <div className="w-4 h-4 border border-gray-300 rounded mr-2 flex items-center justify-center">
                      {selectedStatuses.includes('All') && (
                        <div className="w-3 h-3 bg-primary rounded-sm flex items-center justify-center">
                          <FaCheck className="text-white" size={8} />
                        </div>
                      )}
                    </div>
                    All
                  </button>
                  {statusOptions.map(status => (
                    <button
                      key={status.key}
                      className={`w-full px-4 py-2 text-left text-xs hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center ${selectedStatuses.includes(status.key as StatusOption) ? 'text-primary' : 'text-gray-700 dark:text-gray-300'}`}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setSelectedStatuses(prev => {
                          const newStatuses = prev.filter(s => s !== 'All');
                          if (prev.includes(status.key as StatusOption)) {
                            const filtered = newStatuses.filter(s => s !== status.key);
                            // If no statuses are selected, default to "All"
                            return filtered.length === 0 ? ['All'] : filtered;
                          } else {
                            return [...newStatuses, status.key as StatusOption];
                          }
                        });
                      }}
                    >
                      <div className="w-4 h-4 border border-gray-300 rounded mr-2 flex items-center justify-center">
                        {selectedStatuses.includes(status.key as StatusOption) && (
                          <div className="w-3 h-3 bg-primary rounded-sm flex items-center justify-center">
                            <FaCheck className="text-white" size={8} />
                          </div>
                        )}
                      </div>
                      {status.title}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* View Toggle */}
            <div className="relative flex-shrink-0 ml-1">
              <div className="flex bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-0.5">
                <button
                  className={`flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors relative group ${
                    viewMode === 'kanban' 
                      ? 'bg-primary text-white shadow-sm' 
                      : 'text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                  onClick={() => setViewMode('kanban')}
                >
                  <RiKanbanView2 size={17} />
                  <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-gray-200 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                    Kanban
                  </span>
                </button>
                <button
                  className={`flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors relative group ${
                    viewMode === 'table' 
                      ? 'bg-primary text-white shadow-sm' 
                      : 'text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                  onClick={() => setViewMode('table')}
                >
                  <LuTable2 size={17} />
                  <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-gray-200 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                    Table
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Single Filterable Kanban Board */}
      {viewMode === 'kanban' && (
        <div className="mt-4">
          <DragDropContext onDragEnd={onDragEnd}>
            <div
              ref={kanbanBoardRef}
              onWheel={handleKanbanWheel}
              className="flex flex-grow overflow-x-auto space-x-6 pt-4 pr-4 pb-4 pl-0 rounded-lg [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-white [&::-webkit-scrollbar-track]:dark:bg-gray-800 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:dark:bg-gray-700 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-gray-400 [&::-webkit-scrollbar-thumb:hover]:dark:bg-gray-500"
            >
            {kanbanColumns
              .filter(col => {
                // Filter columns based on selected tab
                if (kanbanTab === 'All') {
                  // Show all columns when "All" is selected
                  return selectedStatuses.includes('All') || selectedStatuses.includes(col.key as TaskStatus);
                } else if (kanbanTab === 'Active') {
                  // Only show columns that are not "Done" or "Canceled" for Active tab
                  return col.key !== 'Done' && col.key !== 'Canceled' && 
                         (selectedStatuses.includes('All') || selectedStatuses.includes(col.key as TaskStatus));
                }
                // For other tabs, show all columns (you can add more specific logic here)
                return selectedStatuses.includes('All') || selectedStatuses.includes(col.key as TaskStatus);
              })
              .map((col) => (
                <Droppable droppableId={col.key} key={col.key}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="flex-shrink-0 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden"
                    >
                      {/* Sticky Header */}
                      <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                        <div className={`flex items-center justify-between rounded-t-md py-2 px-4 text-lg font-semibold`}>
                          <div className="flex items-center">
                            {React.cloneElement(col.icon, { className: col.icon.props.className, style: { ...col.icon.props.style, color: col.icon.props.color }, color: col.icon.props.color })}
                            <h3 className="text-lg font-semibold ml-2 text-black dark:text-white">{col.title}</h3>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-white [&::-webkit-scrollbar-track]:dark:bg-gray-800 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:dark:bg-gray-700 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-gray-400 [&::-webkit-scrollbar-thumb:hover]:dark:bg-gray-500" style={{ height: 'calc(15 * 3.5rem + 3rem)' }}>
                        <div className="space-y-3">
                          {filterTasks(col.tasks).map((task, index) => (
                            <Draggable key={task.code} draggableId={task.code} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors relative ${
                                    snapshot.isDragging ? 'shadow-lg' : ''
                                  }`}
                                  onClick={() => {
                                    const fullTask = tasks.find(t => t.code === task.code);
                                    setSelectedTask(fullTask || task);
                                  }}
                                  onContextMenu={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setOpenMenuTask(openMenuTask === task.code ? null : task.code);
                                  }}
                                >
                                  {/* Task Menu - Positioned at top right */}
                                  <div className="absolute top-3 right-3">
                                    <button
                                      className="border border-gray-300 dark:border-gray-700 rounded-md px-1 py-0.5 text-gray-700 dark:text-gray-300 hover:border-primary hover:text-primary transition-colors"
                                      onClick={e => {
                                        e.stopPropagation();
                                        setOpenMenuTask(openMenuTask === task.code ? null : task.code);
                                      }}
                                    >
                                      <BiDotsHorizontal size={18} />
                                    </button>
                                    {openMenuTask === task.code && (
                                      <div
                                        ref={menuRef}
                                        className="absolute right-0 mt-[1px] w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 py-2 z-50"
                                        style={{ fontFamily: 'Avenir, sans-serif' }}
                                      >
                                        <button 
                                          className="w-full text-left px-4 py-2 text-xs font-medium text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            updateTask(task.code, { ...task, status: 'Done' });
                                            setOpenMenuTask(null);
                                            toast({
                                              title: "Task Marked as Done",
                                              description: `Task "${task.title}" has been marked as done.`,
                                            });
                                          }}
                                        >
                                          Mark as Done
                                        </button>
                                        <button 
                                          className="w-full text-left px-4 py-2 text-xs font-medium text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            // Set the task for the subtask modal without triggering task details modal
                                            const fullTask = tasks.find(t => t.code === task.code);
                                            setSelectedTask(fullTask || task);
                                            setShowNewSubtaskModal(true);
                                            setOpenMenuTask(null);
                                          }}
                                        >
                                          Add Subtask
                                        </button>
                                        <button className="w-full text-left px-4 py-2 text-xs font-medium text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700">Edit</button>
                                        <button 
                                          className="w-full text-left px-4 py-2 text-xs font-medium text-gray-900 dark:text-white hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            // Clean up all task-related data before deleting the task
                                            cleanupTaskData(task.id);
                                            deleteTask(task.code);
                                            setOpenMenuTask(null);
                                            toast({
                                              title: "Task Deleted Successfully",
                                              description: `"${task.title}" with Task ID #${task.taskNumber} associated with Contract ID #${task.contractId} - ${contracts.find(c => c.id === task.contractId)?.title || 'Unknown Contract'} has been deleted`,
                                              variant: "voided",
                                              duration: 30000, // 30 seconds
                                            });
                                            
                                            // Add notification for task deleted
                                            addTaskDeletedNotification(task.taskNumber.toString(), task.title, task.contractId, contracts.find(c => c.id === task.contractId)?.title || 'Unknown Contract');
                                          }}
                                        >
                                          Delete
                                        </button>
                                      </div>
                                    )}
                                  </div>

                                  {/* Task Number - Top Left */}
                                  <div className="mb-3">
                                    <span className="text-[10px] font-bold bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded border border-gray-700 dark:border-gray-500">
                                      # {task.taskNumber}
                                    </span>
                                    <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded border border-primary ml-1">
                                      # {task.contractId}
                                    </span>
                                  </div>

                                  {/* Task Name */}
                                  <h3 className="text-xs font-bold text-gray-900 dark:text-white mb-2">{task.title}</h3>

                                  {/* Contract Info */}
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="text-xs font-bold text-primary">
                                      {contracts.find(c => c.id === task.contractId)?.title}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1 mb-3">
                                    <TbCalendarClock className="text-gray-400 text-base" />
                                    <span className="text-xs text-gray-900 dark:text-white">{formatDatePretty(task.due)}</span>
                                  </div>

                                  {/* Progress Section */}
                                  <div className="space-y-2 mb-3">
                                    <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                      <div
                                        className="h-full bg-primary rounded-full"
                                        style={{
                                          width: `${(() => {
                                            const taskSubtasks = task.subtasks || [];
                                            const completed = taskSubtasks.filter(st => st.completed).length;
                                            return taskSubtasks.length === 0 ? 0 : (completed / taskSubtasks.length) * 100;
                                          })()}%`,
                                        }}
                                      />
                                    </div>
                                  </div>

                                  {/* Assignee and Progress */}
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-900 dark:text-white">{task.assignee}</span>
                                    <div className="flex items-center space-x-2">
                                      {task.subtasks && task.subtasks.length > 0 && (
                                        <button
                                          className="text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setExpandedSubtaskCards(prev => {
                                              const newSet = new Set(prev);
                                              if (newSet.has(task.code)) {
                                                newSet.delete(task.code);
                                              } else {
                                                newSet.add(task.code);
                                              }
                                              return newSet;
                                            });
                                          }}
                                        >
                                          <PiCaretUpDown 
                                            size={18}
                                            className={`transition-transform ${
                                              expandedSubtaskCards.has(task.code) ? 'rotate-180' : ''
                                            }`} 
                                          />
                                        </button>
                                      )}
                                      <button
                                        className="text-xs text-gray-900 dark:text-white hover:text-primary dark:hover:text-primary transition-colors"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setExpandedSubtaskCards(prev => {
                                            const newSet = new Set(prev);
                                            if (newSet.has(task.code)) {
                                              newSet.delete(task.code);
                                            } else {
                                              newSet.add(task.code);
                                            }
                                            return newSet;
                                          });
                                        }}
                                      >
                                        {(() => {
                                          const taskSubtasks = task.subtasks || [];
                                          const completed = taskSubtasks.filter(st => st.completed).length;
                                          return `${completed} of ${taskSubtasks.length}`;
                                        })()}
                                      </button>
                                    </div>
                                  </div>
                                  
                                  {/* Expanded Subtasks - Sorted with completed at bottom */}
                                  {expandedSubtaskCards.has(task.code) && task.subtasks && task.subtasks.length > 0 && (
                                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                                      <div className="space-y-1">
                                        {task.subtasks
                                          .sort((a: any, b: any) => {
                                            // Move completed subtasks to the bottom
                                            if (a.completed && !b.completed) return 1;
                                            if (!a.completed && b.completed) return -1;
                                            return 0;
                                          })
                                          .map((subtask: any, index: number) => (
                                          <div key={subtask.id || index} className="flex items-center justify-between">
                                            <span className={`text-xs text-gray-900 dark:text-white truncate flex-1 mr-2 ${
                                              subtask.completed || subtask.status === 'Done' ? 'line-through' : ''
                                            }`}>
                                              {subtask.title}
                                            </span>
                                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                                              subtask.completed 
                                                ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 border border-green-800 dark:border-green-800'
                                                : subtask.status === 'In Progress'
                                                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 border border-blue-800 dark:border-blue-800'
                                                : subtask.status === 'Blocked'
                                                ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 border border-red-800 dark:border-red-800'
                                                : subtask.status === 'On Hold'
                                                ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-400 border border-orange-800 dark:border-orange-800'
                                                : 'bg-gray-100 dark:bg-gray-700/30 text-gray-800 dark:text-gray-400 border border-gray-800 dark:border-gray-500'
                                            }`}>
                                              {subtask.completed ? 'Done' : subtask.status || 'To Do'}
                                            </span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      </div>
                    </div>
                  )}
                </Droppable>
              ))}
          </div>
        </DragDropContext>
        </div>
      )}




      {/* Table View */}
      {viewMode === 'table' && (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 cursor-default select-none relative">
          <div style={{ height: 'calc(15 * 3.5rem + 3rem)', minHeight: '300px' }} className="relative overflow-x-auto overflow-y-auto mt-4 pr-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar]:h-3 [&::-webkit-scrollbar-track]:bg-gray-50 [&::-webkit-scrollbar-track]:dark:bg-gray-700 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:dark:bg-gray-700 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-gray-400 [&::-webkit-scrollbar-thumb:hover]:dark:bg-gray-500 [&::-webkit-scrollbar-corner]:bg-gray-50 [&::-webkit-scrollbar-corner]:dark:bg-gray-700">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer select-none whitespace-nowrap text-center" style={{ minWidth: '100px' }}>
                    Task ID
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer select-none whitespace-nowrap text-left" style={{ minWidth: '200px' }}>
                    Task
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer select-none whitespace-nowrap text-center" style={{ minWidth: '120px' }}>
                    Contract ID
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer select-none whitespace-nowrap text-left" style={{ minWidth: '200px' }}>
                    Contract
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer select-none whitespace-nowrap text-center" style={{ minWidth: '120px' }}>
                    Status
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer select-none whitespace-nowrap text-center" style={{ minWidth: '120px' }}>
                    Due Date
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer select-none whitespace-nowrap text-center" style={{ minWidth: '120px' }}>
                    Subtasks
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer select-none whitespace-nowrap text-center" style={{ minWidth: '120px' }}>
                    Created Date
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer select-none whitespace-nowrap text-center" style={{ minWidth: '120px' }}>
                    Last Updated
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer select-none whitespace-nowrap text-center" style={{ minWidth: '120px' }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {tasks.map((task) => (
                  <tr
                    key={task.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                    onClick={() => setSelectedTask(task)}
                  >
                    <td className="px-6 py-2.5 whitespace-nowrap text-center text-xs">
                      <span className="text-primary underline font-semibold cursor-pointer">{task.taskNumber}</span>
                    </td>
                    <td className="px-6 py-2.5 whitespace-nowrap text-sm">
                      <div className="text-xs font-bold text-gray-900 dark:text-white">{task.title}</div>
                    </td>
                    <td className="px-6 py-2.5 whitespace-nowrap text-center text-xs">
                      <span className="text-primary underline font-semibold cursor-pointer">{task.contractId}</span>
                    </td>
                    <td className="px-6 py-2.5 whitespace-nowrap text-sm">
                      <div className="text-xs font-bold text-gray-900 dark:text-white">
                        {contracts.find(c => c.id === task.contractId)?.title || 'Unknown Contract'}
                      </div>
                    </td>
                    <td className="px-6 py-2.5 whitespace-nowrap text-center text-xs">
                      <span className={`inline-flex items-center justify-center w-28 h-7 px-2 font-semibold rounded-full ${getTaskStatusBadgeStyle(task.status)}`} style={{ minWidth: '7rem', display: 'inline-flex', borderWidth: '1px' }}>
                        {task.status}
                      </span>
                    </td>
                    <td className="px-6 py-2.5 whitespace-nowrap text-center text-xs">
                      <span className="text-gray-900 dark:text-white">{(() => {
                        if (!task.due) return '';
                        const d = new Date(task.due);
                        if (isNaN(d.getTime())) return task.due;
                        const year = d.getFullYear();
                        const month = String(d.getMonth() + 1).padStart(2, '0');
                        const day = String(d.getDate()).padStart(2, '0');
                        return `${year}-${month}-${day}`;
                      })()}</span>
                    </td>
                    <td className="px-6 py-2.5 whitespace-nowrap text-center text-xs">
                      <span className="text-gray-900 dark:text-white">{(() => {
                        const taskSubtasks = task.subtasks || [];
                        const completed = taskSubtasks.filter(st => st.completed).length;
                        return `${completed} of ${taskSubtasks.length}`;
                      })()}</span>
                    </td>
                    <td className="px-6 py-2.5 whitespace-nowrap text-center text-xs">
                      <span className="text-gray-900 dark:text-white">2024-05-01</span>
                    </td>
                    <td className="px-6 py-2.5 whitespace-nowrap text-center text-xs">
                      <span className="text-gray-900 dark:text-white">2024-05-02</span>
                    </td>
                    <td className="px-6 py-2.5 whitespace-nowrap text-center text-xs font-medium">
                      <div className="flex items-center justify-center space-x-1">
                        <button 
                          className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 dark:text-gray-300 hover:border-primary hover:text-primary transition-colors bg-transparent dark:bg-gray-800 dark:hover:border-primary dark:hover:text-primary relative group" 
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTask(task);
                          }}
                        >
                                                          <TbEye className="h-4 w-4 transition-colors" />
                          <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-gray-200 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                            View
                          </span>
                        </button>
                        <button 
                          className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 dark:text-gray-300 hover:border-primary hover:text-primary transition-colors bg-transparent dark:bg-gray-800 dark:hover:border-primary dark:hover:text-primary relative group" 
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTask(task);
                          }}
                        >
                          <TbEdit className="h-4 w-4 transition-colors" />
                          <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-gray-200 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                            Edit
                          </span>
                        </button>
                        <button 
                          className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 dark:text-gray-300 hover:border-red-500 hover:text-red-500 transition-colors bg-transparent dark:bg-gray-800 dark:hover:border-red-500 dark:hover:text-red-500 relative group"
                          onClick={(e) => {
                            e.stopPropagation();
                            // TODO: Implement delete task functionality
                          }}
                        >
                          <TbTrash className="h-4 w-4 transition-colors" />
                          <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-gray-200 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                            Delete
                          </span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Results Bar */}
          <div className="bg-white dark:bg-gray-800 px-6 py-3 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-700 dark:text-gray-300">
                Showing {tasks.length} of {tasks.length} results.
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-700 dark:text-gray-300">Rows per page</span>
                  <div className="relative">
                    <select 
                      className="text-xs border border-gray-300 dark:border-gray-700 rounded px-2 py-1 pr-6 bg-white dark:bg-gray-800 text-gray-900 dark:text-white appearance-none"
                      value={10}
                      onChange={() => {}}
                    >
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                    </select>
                    <div className="absolute inset-y-0 right-1 flex items-center pointer-events-none">
                      <TbChevronDown className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                    </div>
                  </div>
                </div>
                <div className="text-xs text-gray-700 dark:text-gray-300">
                  Page 1 of 1
                </div>
                <div className="flex space-x-1">
                  <button className="p-1 text-gray-400 dark:text-gray-500 cursor-not-allowed">
                    <TbChevronsLeft className="w-4 h-4" />
                  </button>
                  <button className="p-1 text-gray-400 dark:text-gray-500 cursor-not-allowed">
                    <TbChevronsRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Task Details Modal */}
      {selectedTask && !(showNewSubtaskModal && !newSubtaskModalOpenedFromTaskDetails) && !(showEditSubtaskModal && !editSubtaskModalOpenedFromTaskDetails) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 cursor-default select-none">
          <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-[calc(100%-1rem)] max-w-[1400px] mx-4 my-8 max-h-[90vh] flex flex-col overflow-hidden cursor-default select-none">
            {/* Sticky Header with Task ID and Close buttons */}
            <div className="sticky top-0 z-40 bg-gray-50 dark:bg-gray-900 px-6 py-4 cursor-default select-none">
              <div className="flex items-start justify-between cursor-default select-none">
                {/* Left: Task ID and Contract ID */}
                <div className="flex-1 min-w-0 cursor-default select-none">
                  <div className="flex items-center mb-4 cursor-default select-none">
                    <span className="text-[10px] font-bold bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded border border-gray-700 dark:border-gray-500 cursor-default select-none">
                      # {selectedTask.taskNumber}
                    </span>
                    <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded border border-primary ml-1 cursor-default select-none">
                      # {selectedTask.contractId}
                    </span>
                  </div>
                </div>
                {/* Right: Close Button */}
                <button
                  className="text-gray-400 hover:text-gray-600 p-2 rounded-full ml-4 mt-1"
                  onClick={() => {
                    // Sort subtasks when closing the modal
                    if (selectedTask && selectedTask.subtasks && selectedTask.subtasks.length > 0) {
                      const sortedSubtasks = [...selectedTask.subtasks].sort((a, b) => {
                        // Move completed subtasks to the bottom
                        if (a.completed && !b.completed) return 1;
                        if (!a.completed && b.completed) return -1;
                        return 0;
                      });
                      
                      // Update the task in the store with sorted subtasks
                      updateTask(selectedTask.code, { subtasks: sortedSubtasks });
                    }
                    
                    // Close the modal
                    setSelectedTask(null);
                  }}
                  aria-label="Close"
                >
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-900 cursor-default select-none [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-white [&::-webkit-scrollbar-track]:dark:bg-gray-800 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:dark:bg-gray-700 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-gray-400 [&::-webkit-scrollbar-thumb:hover]:dark:bg-gray-500">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Task Details Box */}
                  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 h-[440px] cursor-default select-none">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 cursor-default select-none">Task Details</h3>
                    {/* Task ID and Contract ID Row */}
                    <div className="grid grid-cols-2 gap-6 mb-4 cursor-default select-none">
                      <div>
                        <div className="text-gray-500 dark:text-gray-400 text-xs mb-1 cursor-default select-none" style={{ fontFamily: 'Avenir, sans-serif' }}>Task ID</div>
                        <div className="text-xs font-medium text-gray-900 dark:text-white select-none cursor-default" style={{ fontFamily: 'Avenir, sans-serif' }}>
                          {selectedTask.taskNumber}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-500 dark:text-gray-400 text-xs mb-1 cursor-default select-none" style={{ fontFamily: 'Avenir, sans-serif' }}>Contract ID</div>
                        <div className="text-xs font-medium text-gray-900 dark:text-white select-none cursor-default" style={{ fontFamily: 'Avenir, sans-serif' }}>
                          {selectedTask.contractId}
                        </div>
                      </div>
                    </div>
                                              {/* Row 1: Task Name | Contract Name */}
                    <div className="grid grid-cols-2 gap-6 mb-4 cursor-default select-none">
                      <div>
                        <div className="text-gray-500 dark:text-gray-400 text-xs mb-1 cursor-default select-none" style={{ fontFamily: 'Avenir, sans-serif' }}>Task Name</div>
                        <input
                          type="text"
                          className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-lg text-xs font-medium text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary transition-colors bg-white dark:bg-gray-900"
                          placeholder={selectedTask?.title || ''}
                          value={editedTaskTitle}
                          onChange={e => setEditedTaskTitle(e.target.value)}
                          style={{ fontFamily: 'Avenir, sans-serif' }}
                        />
                      </div>
                      <div style={{ position: 'relative' }} ref={contractDropdownRef}>
                        <div className="text-gray-500 dark:text-gray-400 text-xs mb-1 cursor-default select-none" style={{ fontFamily: 'Avenir, sans-serif' }}>Contract</div>
                        <div className="w-full pl-0 pr-4 py-2 text-xs font-medium text-gray-900 dark:text-white select-none cursor-default" style={{ fontFamily: 'Avenir, sans-serif' }}>
                          {contracts.find(c => c.id === selectedTask?.contractId)?.title || ''}
                        </div>
                      </div>
                    </div>
                    {/* Row 2: Assignee | Status */}
                    <div className="grid grid-cols-2 gap-6 mb-4 cursor-default select-none">
                      <div>
                        <div className="text-gray-500 dark:text-gray-400 text-xs mb-1 cursor-default select-none" style={{ fontFamily: 'Avenir, sans-serif' }}>Assignee</div>
                        <div className="relative w-full" ref={taskDetailsAssigneeDropdownRef}>
                          <input
                            ref={taskDetailsAssigneeInputRef}
                            type="text"
                            className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-lg text-xs font-medium text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary transition-colors pr-10 bg-white dark:bg-gray-900"
                            placeholder={selectedTask?.assignee || ''}
                            value={editedAssignee}
                            onChange={e => setEditedAssignee(e.target.value)}
                            onFocus={() => setShowAssigneeDropdown(true)}
                            style={{ fontFamily: 'Avenir, sans-serif' }}
                            autoComplete="off"
                          />
                          <TbChevronDown className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                          {showAssigneeDropdown && (
                            <div className="absolute left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto [&::-webkit-scrollbar]:hidden" style={{ fontFamily: 'Avenir, sans-serif' }}>
                              <div
                                className="px-4 py-2 text-xs cursor-pointer hover:bg-primary/10 hover:text-primary text-gray-900 dark:text-white"
                                onClick={() => {
                                  handleAssigneeChange(currentUserName);
                                }}
                              >
                                Me
                              </div>
                              {uniqueAssignees.length > 0 ? (
                                uniqueAssignees.map(assignee => (
                                  <div
                                    key={assignee}
                                    className="px-4 py-2 text-xs cursor-pointer hover:bg-primary/10 hover:text-primary text-gray-900 dark:text-white"
                                    onClick={() => {
                                      handleAssigneeChange(assignee);
                                    }}
                                  >
                                    {assignee}
                                  </div>
                                ))
                              ) : (
                                <div className="px-4 py-2 text-xs text-gray-400 dark:text-gray-500">No assignees found</div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-500 dark:text-gray-400 text-xs mb-1 cursor-default select-none" style={{ fontFamily: 'Avenir, sans-serif' }}>Status</div>
                        <div className="relative w-full">
                          <input
                            type="text"
                            className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-lg text-xs font-medium text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary transition-colors pr-10 bg-white dark:bg-gray-900"
                            placeholder={kanbanColumns.find(col => col.tasks.some(t => t.code === selectedTask.code))?.title || 'To Do'}
                            value={kanbanColumns.find(col => col.tasks.some(t => t.code === selectedTask.code))?.title || 'To Do'}
                            onClick={() => setShowModalStatusDropdown(!showModalStatusDropdown)}
                            readOnly
                            style={{ fontFamily: 'Avenir, sans-serif' }}
                          />
                          <TbChevronDown className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                          {showModalStatusDropdown && (
                            <div ref={modalStatusDropdownRef} className="absolute left-0 right-0 mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 z-50 max-h-48 overflow-y-auto [&::-webkit-scrollbar]:hidden status-dropdown" style={{ fontFamily: 'Avenir, sans-serif' }}>
                              {statusOptions.map(status => (
                                <button
                                  key={status.key}
                                  className={`w-full text-left px-4 py-2 text-xs font-medium ${
                                    selectedTask?.status === status.key ? 'bg-primary/10 text-primary' : 'text-gray-900 dark:text-gray-300 hover:bg-primary/10 hover:text-primary'
                                  }`}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleTaskStatusChange(status.key);
                                  }}
                                >
                                  {status.title}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    {/* Row 2.5: Due Date (left) | Created Date & Last Updated (right) */}
                    <div className="grid grid-cols-2 gap-6 mb-4 cursor-default select-none">
                      {/* Due Date (left) */}
                      <div>
                        <div className="text-gray-500 dark:text-gray-400 text-xs mb-1 cursor-default select-none" style={{ fontFamily: 'Avenir, sans-serif' }}>Due Date</div>
                        <div className="relative">
                          <input
                            type="date"
                            value={editedDueDate}
                            onChange={e => handleDueDateChange(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Backspace') {
                                e.preventDefault();
                                handleDueDateChange('');
                              }
                            }}
                            className="w-full px-4 py-2 pr-10 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs text-gray-900 dark:text-white bg-white dark:bg-gray-900 [&::-webkit-calendar-picker-indicator]:hidden"
                            style={{ fontFamily: 'Avenir, sans-serif' }}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const dateInput = document.querySelector('input[type="date"]') as HTMLInputElement;
                              if (dateInput) dateInput.showPicker();
                            }}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 flex items-center justify-center"
                          >
                            <LuCalendarFold className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                          </button>
                        </div>
                      </div>
                      {/* Created/Updated Dates (right) */}
                      <div>
                        <div className="flex gap-6">
                          <div className="min-w-0 flex-1">
                            <div className="text-gray-500 dark:text-gray-400 text-xs mb-1 cursor-default select-none" style={{ fontFamily: 'Avenir, sans-serif' }}>Created Date</div>
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-gray-500 dark:text-gray-400 text-xs mb-1 cursor-default select-none" style={{ fontFamily: 'Avenir, sans-serif' }}>Last Updated</div>
                          </div>
                        </div>
                        <div className="flex gap-6 mt-3">
                          <div className="min-w-0 flex-1">
                            <div className="text-xs text-gray-900 dark:text-white select-none cursor-default" style={{ fontFamily: 'Avenir, sans-serif' }}>
                              2024-05-01
                            </div>
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-xs text-gray-900 dark:text-white select-none cursor-default" style={{ fontFamily: 'Avenir, sans-serif' }}>
                              2024-05-02
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Description Field */}
                    <div className="mb-0 cursor-default select-none">
                      <div className="text-gray-500 dark:text-gray-400 text-xs mb-1 cursor-default select-none" style={{ fontFamily: 'Avenir, sans-serif' }}>Description</div>
                      <textarea
                        className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-lg text-xs font-medium text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary transition-colors resize-none bg-white dark:bg-gray-900 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-track]:dark:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:dark:bg-gray-700 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-gray-400 [&::-webkit-scrollbar-thumb:hover]:dark:bg-gray-500"
                        rows={3}
                        placeholder="Enter task description..."
                        value={selectedTask?.description || ''}
                        onChange={(e) => {
                          if (selectedTask) {
                            updateTask(selectedTask.code, { ...selectedTask, description: e.target.value });
                            setSelectedTask({ ...selectedTask, description: e.target.value });
                          }
                        }}
                        style={{ fontFamily: 'Avenir, sans-serif' }}
                      />
                    </div>
                  </div>

                  {/* Subtasks Box */}
                  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 h-[440px] cursor-default select-none">
                    <div className="flex items-center justify-between mb-4 cursor-default select-none">
                      <span className="text-sm font-semibold text-gray-900 dark:text-white cursor-default select-none" style={{ fontFamily: 'Avenir, sans-serif' }}>Subtasks</span>
                      <button 
                        onClick={() => {
                          setNewSubtaskModalOpenedFromTaskDetails(true);
                          setShowNewSubtaskModal(true);
                        }}
                        className="flex items-center gap-2 px-2 py-1 rounded-lg border border-gray-200 dark:border-transparent bg-gray-100 dark:bg-primary text-gray-700 dark:text-white font-semibold text-xs hover:bg-gray-200 dark:hover:bg-primary-dark transition-colors cursor-pointer" 
                        style={{ fontFamily: 'Avenir, sans-serif' }}
                      >
                        <span className="text-base font-bold text-primary dark:text-white">+</span> New Subtask
                      </button>
                    </div>
                    <div className="space-y-3 overflow-y-auto [&::-webkit-scrollbar]:hidden" style={{ height: 'calc(440px - 100px)', minHeight: '280px' }}>
                      {/* Subtasks maintain their visual positions while modal is open - sorting happens when modal closes */}
                      {selectedTask?.subtasks?.map((subtask) => (
                        <div 
                          key={subtask.id} 
                          className="flex items-center gap-3 px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors relative"
                          onClick={() => {
                            // Open edit subtask modal
                            setEditingSubtask(subtask);
                            setEditSubtaskForm({
                              title: subtask.title || '',
                              assignee: subtask.assignee || '',
                              status: subtask.status || 'To Do',
                              dueDate: subtask.dueDate || '',
                              description: subtask.description || ''
                            });
                            setEditSubtaskFormErrors({});
                            setEditSubtaskModalOpenedFromTaskDetails(true);
                            setShowEditSubtaskModal(true);
                          }}
                                onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
        const position = getDropdownPosition(e);
        setSubtaskMenuPosition(position);
        setOpenSubtaskMenu(openSubtaskMenu === subtask.id ? null : subtask.id);
                          }}
                        >
                          <div className="flex-1">
                            <div className={`font-semibold text-xs text-black dark:text-white flex-1 min-w-0 truncate ${
                              subtask.completed || subtask.status === 'Done' ? 'line-through' : ''
                            }`}>
                              {subtask.title}
                            </div>
                            <div className="text-xs text-gray-500 cursor-default select-none">
                              {subtask.assignee ? `${subtask.assignee} • ` : ''}{subtask.status} • {subtask.dueDate ? new Date(subtask.dueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'No due date'}
                            </div>
                          </div>
                          <div 
                            className="w-5 h-5 border border-gray-300 rounded flex items-center justify-center cursor-pointer" 
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent opening edit modal when clicking checkbox
                              
                              // Get the current task from the store to ensure we have the latest data
                              const currentTask = tasks.find(t => t.code === selectedTask.code);
                              if (currentTask) {
                                // Find the specific subtask by ID and toggle its completed status
                                const updatedSubtasks = currentTask.subtasks.map(st => {
                                  if (st.id === subtask.id) {
                                    return { ...st, completed: !st.completed };
                                  }
                                  return st;
                                });
                                
                                // Update the task in the store
                                updateTask(currentTask.code, { subtasks: updatedSubtasks });
                                
                                // Update the selected task immediately to reflect the change
                                setSelectedTask({ ...selectedTask, subtasks: updatedSubtasks });
                              }
                            }}
                          >
                            {subtask.completed && (
                              <div className="w-4 h-4 bg-primary rounded-sm flex items-center justify-center">
                                <FaCheck className="text-white" size={10} />
                              </div>
                            )}
                          </div>
                          
                          {/* Subtask Context Menu */}
                          {openSubtaskMenu === subtask.id && (
                            <div
                              ref={subtaskMenuRef}
                              className="fixed w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 py-2 z-[9999]"
                              style={{ 
                                fontFamily: 'Avenir, sans-serif',
                                left: `${subtaskMenuPosition.left}px`,
                                top: `${subtaskMenuPosition.top}px`
                              }}
                            >
                              <button 
                                className="w-full text-left px-4 py-2 text-xs font-medium text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // Open edit subtask modal
                                  setEditingSubtask(subtask);
                                  setEditSubtaskForm({
                                    title: subtask.title || '',
                                    assignee: subtask.assignee || '',
                                    status: subtask.status || 'To Do',
                                    dueDate: subtask.dueDate || '',
                                    description: subtask.description || ''
                                  });
                                  setEditSubtaskFormErrors({});
                                  setEditSubtaskModalOpenedFromTaskDetails(true);
                                  setShowEditSubtaskModal(true);
                                  setOpenSubtaskMenu(null);
                                }}
                              >
                                Edit Subtask
                              </button>
                              <button 
                                className="w-full text-left px-4 py-2 text-xs font-medium text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-red-600 dark:hover:text-red-400"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteSubtask(subtask.id);
                                  setOpenSubtaskMenu(null);
                                  toast({
                                    title: "Subtask Deleted",
                                    description: `Subtask "${subtask.title}" has been deleted.`,
                                  });
                                }}
                              >
                                Delete Subtask
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                      {(!selectedTask?.subtasks || selectedTask.subtasks.length === 0) && (
                        <div className="text-center py-8 text-gray-500 dark:text-gray-400 text-sm cursor-default select-none">
                          No subtasks yet. Click "New Subtask" to add one.
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Documents Box */}
                  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 h-[440px] cursor-default select-none">
                    <div className="flex items-center justify-between mb-4 cursor-default select-none">
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white cursor-default select-none">Documents</h3>
                      <button 
                        onClick={() => { setShowUploadModal(true); setUploadTaskId(selectedTask?.id || null); }}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-transparent bg-gray-100 dark:bg-primary text-gray-700 dark:text-white font-semibold text-xs hover:bg-gray-200 dark:hover:bg-primary-dark transition-colors cursor-pointer" style={{ fontFamily: 'Avenir, sans-serif' }}
                      >
                        <TbUpload className="text-base text-primary dark:text-white" /> Upload
                      </button>
                    </div>
                    <div className="space-y-3 overflow-y-auto [&::-webkit-scrollbar]:hidden" style={{ height: 'calc(440px - 100px)', minHeight: '280px' }}>
                      {selectedTask && taskFiles[selectedTask.id]?.files ? (
                        taskFiles[selectedTask.id].files.map((file: any, index: number) => (
                          <div key={index} className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-3 border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors select-none">
                            <div className="flex items-center gap-3 cursor-default select-none">
                              <TbLibrary className="w-5 h-5 text-primary" />
                              <div className="flex-1 min-w-0">
                                {editingDocumentName === file.originalName ? (
                                  <div className="flex items-center gap-1">
                                    <input
                                      type="text"
                                      value={getDocumentDisplayName(file)}
                                      onChange={(e) => {
                                        setCustomDocumentNames(prev => ({ ...prev, [file.originalName]: e.target.value }));
                                      }}
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                          handleSaveDocumentName(file, getDocumentDisplayName(file));
                                        } else if (e.key === 'Escape') {
                                          handleCancelEditDocumentName();
                                        }
                                      }}
                                      onBlur={() => handleSaveDocumentName(file, getDocumentDisplayName(file))}
                                      className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                                      style={{ fontFamily: 'Avenir, sans-serif' }}
                                      autoFocus
                                    />
                                    <button
                                      type="button"
                                      onClick={() => handleSaveDocumentName(file, getDocumentDisplayName(file))}
                                      className="px-2.5 py-1 rounded-lg bg-primary text-white text-xs font-medium hover:bg-primary-dark transition-colors"
                                    >
                                      Save
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleCancelEditDocumentName()}
                                      className="px-2.5 py-1 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                ) : (
                                  <div className="font-semibold text-xs text-black dark:text-white flex-1 min-w-0 truncate">
                                    {getDocumentDisplayName(file)}
                                  </div>
                                )}
                                <div className="text-xs text-gray-500 cursor-default select-none">
                                  {new Date(file.lastModified).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })} &bull; {file.type.split('/')[1]?.toUpperCase() || 'Unknown'} &bull; {(file.size / 1024 / 1024).toFixed(2)} MB
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 cursor-default select-none">
                              <button className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 dark:text-gray-300 hover:border-primary hover:text-primary transition-colors bg-transparent dark:bg-gray-800 dark:hover:border-primary dark:hover:text-primary relative group cursor-pointer">
                                <TbEye className="h-4 w-4 transition-colors" />
                                <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-gray-200 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                                  View
                                </span>
                              </button>
                              <button 
                                className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 dark:text-gray-300 hover:border-primary hover:text-primary transition-colors bg-transparent dark:bg-gray-800 dark:hover:border-primary dark:hover:text-primary relative group cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleStartEditDocumentName(file);
                                }}
                              >
                                <TbEdit className="h-4 w-4 transition-colors" />
                                <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-gray-200 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                                  Edit
                                </span>
                              </button>
                              <button className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 dark:text-gray-300 hover:border-primary hover:text-primary transition-colors bg-transparent dark:bg-gray-800 dark:hover:border-primary dark:hover:text-primary relative group cursor-pointer">
                                <TbDownload className="h-4 w-4 transition-colors" />
                                <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-gray-200 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                                  Download
                                </span>
                              </button>
                              <button className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 dark:text-gray-300 hover:border-red-500 hover:text-red-500 transition-colors bg-transparent dark:bg-gray-800 dark:hover:border-red-500 dark:hover:text-red-500 relative group cursor-pointer">
                                <TbLibraryMinus className="h-4 w-4 transition-colors" />
                                <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-gray-200 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                                  Remove
                                </span>
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400 text-sm cursor-default select-none -mt-8">
                          <TbLibrary size={26} className="mb-2 text-primary" />
                          <p>No documents uploaded yet</p>
                          <p className="text-xs">Click "Upload" to add documents</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Recent Activity Box */}
                  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 h-[440px] cursor-default select-none">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 cursor-default select-none">Recent Activity</h3>
                    <div className="flex flex-col gap-5 cursor-default select-none">
                      {/* Activity 1 */}
                      <div className="flex items-start gap-3 cursor-default select-none">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30">
                          <BsPerson className="text-blue-500 dark:text-blue-400 text-lg" />
                        </span>
                        <div>
                          <div className="text-xs font-medium text-gray-900 dark:text-white">
                            <span className="font-semibold">Sarah Miller</span> assigned task to <span className="font-semibold">Michael Brown</span>
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">May 19, 2025 at 10:30 AM</div>
                        </div>
                      </div>
                      {/* Activity 2 */}
                      <div className="flex items-start gap-3 cursor-default select-none">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30">
                          <BsPerson className="text-green-500 dark:text-green-400 text-lg" />
                        </span>
                        <div>
                          <div className="text-xs font-medium text-gray-900 dark:text-white">
                            <span className="font-semibold">Michael Brown</span> marked subtask as complete
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">May 18, 2025 at 3:45 PM</div>
                        </div>
                      </div>
                      {/* Activity 3 */}
                      <div className="flex items-start gap-3 cursor-default select-none">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30">
                          <BsPerson className="text-purple-500 dark:text-purple-400 text-lg" />
                        </span>
                        <div>
                          <div className="text-xs font-medium text-gray-900 dark:text-white">
                            <span className="font-semibold">Emily Davis</span> uploaded a document
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">May 17, 2025 at 9:15 AM</div>
                        </div>
                      </div>
                      {/* Activity 4 */}
                      <div className="flex items-start gap-3 cursor-default select-none">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30">
                          <LuCalendarClock className="text-orange-500 dark:text-orange-400 text-lg" />
                        </span>
                        <div>
                          <div className="text-xs font-medium text-gray-900 dark:text-white">
                            Due date updated to <span className="font-semibold">May 24, 2025</span>
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">May 16, 2025 at 11:20 AM</div>
                        </div>
                      </div>
                      {/* Activity 5 */}
                      <div className="flex items-start gap-3 cursor-default select-none">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-900/30">
                          <FaPlus className="text-teal-500 dark:text-teal-400 text-lg" />
                        </span>
                        <div>
                          <div className="text-xs font-medium text-gray-900 dark:text-white">
                            Task created by <span className="font-semibold">Alex Johnson</span>
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">May 15, 2025 at 2:00 PM</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Comments Box - Full Width */}
              <div className="mt-6 cursor-default select-none">
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 cursor-default select-none">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 cursor-default select-none">Comments</h3>
                  
                  {/* Comment History */}
                  <div className="space-y-4 mb-4 max-h-[300px] overflow-y-auto pr-2 cursor-default select-none [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-white [&::-webkit-scrollbar-track]:dark:bg-gray-800 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:dark:bg-gray-700 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-gray-400 [&::-webkit-scrollbar-thumb:hover]:dark:bg-gray-500">
                    {(selectedTask ? (taskComments[selectedTask.code] || []) : []).map((comment) => (
                      <div key={comment.id} className="flex items-start gap-3 cursor-default select-none">
                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${comment.avatarColor}`}>
                          <BsPerson className={`${comment.textColor} text-lg`} />
                        </span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-semibold text-gray-900 dark:text-white">{comment.author}</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">{comment.timestamp}</span>
                          </div>
                          <div 
                            className="text-xs text-gray-900 dark:text-white font-medium mb-2"
                            dangerouslySetInnerHTML={{ __html: comment.content }}
                          />
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => handleEditComment(comment.id)}
                              className="text-xs text-gray-500 hover:text-primary transition-colors flex items-center gap-1"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteComment(comment.id)}
                              className="text-xs text-gray-500 hover:text-red-500 transition-colors flex items-center gap-1"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add Comment Section */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-start gap-3">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                        <BsPerson className="text-primary text-lg" />
                      </span>
                      <div className="flex-1">
                        {/* Toolbar */}
                        {commentEditor && (
                          <>
                            <div className="flex gap-2 mb-2 bg-white dark:bg-gray-800 rounded-lg px-2 py-1 items-center cursor-default select-none">
                              <button onClick={() => commentEditor.chain().focus().toggleBold().run()} className={`text-xs px-1 rounded ${commentEditor.isActive('bold') ? 'bg-primary/10 text-primary' : 'text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'} cursor-pointer`} title="Bold"><b>B</b></button>
                              <button onClick={() => commentEditor.chain().focus().toggleItalic().run()} className={`text-xs px-1 rounded ${commentEditor.isActive('italic') ? 'bg-primary/10 text-primary' : 'text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'} cursor-pointer`} title="Italic"><i>I</i></button>
                              <button onClick={() => commentEditor.chain().focus().toggleUnderline().run()} className={`text-xs px-1 rounded ${commentEditor.isActive('underline') ? 'bg-primary/10 text-primary' : 'text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'} cursor-pointer`} title="Underline"><u>U</u></button>
                              <button onClick={() => commentEditor.chain().focus().toggleStrike().run()} className={`text-xs px-1 rounded ${commentEditor.isActive('strike') ? 'bg-primary/10 text-primary' : 'text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'} cursor-pointer`} title="Strikethrough"><s>S</s></button>
                              <button onClick={() => commentEditor.chain().focus().toggleBulletList().run()} className={`text-xs px-1 rounded ${commentEditor.isActive('bulletList') ? 'bg-primary/10 text-primary' : 'text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'} cursor-pointer`} title="Bullet List">• List</button>
                              <button onClick={() => commentEditor.chain().focus().toggleOrderedList().run()} className={`text-xs px-1 rounded ${commentEditor.isActive('orderedList') ? 'bg-primary/10 text-primary' : 'text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'} cursor-pointer`} title="Numbered List">1. List</button>
                              <button onClick={handlePostComment} className="ml-auto -mr-4 text-xs px-2 py-1 rounded transition-colors flex items-center group relative cursor-pointer" title="Send">
                                <TbMessage2Plus className="w-5 h-5 text-gray-700 dark:text-white group-hover:text-primary transition-colors" />
                                <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-gray-200 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10 cursor-default select-none">
                                  Send
                                </span>
                              </button>
                              {editingCommentId && (
                                <button 
                                  onClick={() => {
                                    setEditingCommentId(null);
                                    commentEditor.commands.clearContent();
                                  }} 
                                  className="text-xs px-2 py-1 rounded text-gray-500 hover:text-red-500 transition-colors cursor-pointer"
                                >
                                  Cancel
                                </button>
                              )}
                            </div>
                            <div className="border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 focus-within:border-primary transition-colors cursor-default select-none">
                              <EditorContent
                                editor={commentEditor}
                                className="tiptap min-h-[48px] px-4 py-2 text-xs font-medium text-black dark:text-white font-sans outline-none"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handlePostComment();
                                  }
                                }}
                              />
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-6 cursor-default select-none">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Upload Documents</h2>
              <button
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                onClick={() => { setShowUploadModal(false); setUploadModalFiles([]); }}
                aria-label="Close"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="mb-4 text-xs text-gray-500 dark:text-gray-400">
              {uploadTaskId && (
                <span>
                  For Task: <span className="font-semibold text-primary">#{uploadTaskId}</span>
                </span>
              )}
            </div>
            <form
              className="p-0 cursor-default select-none"
              onSubmit={handleUploadModalSubmit}
            >
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1 cursor-default select-none" style={{ fontFamily: 'Avenir, sans-serif' }}>Document Name</label>
                    <input
                      type="text"
                      placeholder="Enter document name..."
                      value={uploadModalDocumentName}
                      onChange={(e) => setUploadModalDocumentName(e.target.value)}
                      className="w-full h-[34px] px-4 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-xs focus:ring-2 focus:ring-primary focus:border-primary transition-colors cursor-text"
                      style={{ fontFamily: 'Avenir, sans-serif' }}
                    />
                  </div>
                  <div>
                    {/* Empty right column */}
                  </div>
                </div>

                {/* Click to Upload Box */}
                <div>
                  <div className="relative" ref={clickToUploadDropdownRef}>
                    <div 
                      className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-700 py-8 px-4 text-center transition hover:border-primary cursor-pointer select-none"
                      onClick={() => {
                        setShowClickToUploadDropdown(!showClickToUploadDropdown);
                      }}
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        
                        const files = Array.from(e.dataTransfer.files);
                        console.log('Files dropped:', files);
                        
                        if (files.length > 0) {
                          // Log file details for debugging
                          files.forEach((file, index) => {
                            console.log(`File ${index}:`, {
                              name: file.name,
                              type: file.type,
                              size: file.size,
                              sizeMB: (file.size / 1024 / 1024).toFixed(2)
                            });
                          });
                          
                          // More permissive file validation
                          const validFiles = files.filter(file => {
                            const isValidType = file.type.startsWith('application/') || 
                                              file.type.startsWith('image/') ||
                                              file.name.toLowerCase().endsWith('.pdf') ||
                                              file.name.toLowerCase().endsWith('.doc') ||
                                              file.name.toLowerCase().endsWith('.docx') ||
                                              file.name.toLowerCase().endsWith('.jpg') ||
                                              file.name.toLowerCase().endsWith('.jpeg');
                            const isValidSize = file.size <= 10 * 1024 * 1024;
                            
                            console.log(`File ${file.name} validation:`, { isValidType, isValidSize });
                            
                            return isValidType && isValidSize;
                          });
                          
                          console.log('Valid files:', validFiles.length);
                          
                          if (validFiles.length > 0) {
                            // Set file source to Desktop
                            setSelectedUploadSource('Desktop');
                            
                            // Add valid files to upload modal files
                            setUploadModalFiles(prev => [...prev, ...validFiles]);
                            
                            // Pre-populate document name with first file name (without extension) only if field is empty
                            if (!uploadModalDocumentName.trim()) {
                              const fileName = validFiles[0].name;
                              const nameWithoutExtension = fileName.replace(/\.[^/.]+$/, "");
                              setUploadModalDocumentName(nameWithoutExtension);
                            }
                            
                            console.log('Drag and drop success:');
                            console.log('Files added:', validFiles.length);
                            console.log('Document name:', uploadModalDocumentName.trim() || 'will be set from file');
                            console.log('File source set: Desktop');
                          } else {
                            console.log('No valid files found');
                          }
                        }
                      }}
                    >
                      <TbDragDrop className="h-5 w-5 text-gray-400 mb-2 select-none" />
                      <div className="text-xs text-gray-700 dark:text-gray-300 font-semibold select-none">Click to upload or drag and drop</div>
                      <div className="text-[10px] text-gray-400 dark:text-gray-500 mt-1 select-none">PDF, DOC, DOCX, or JPG (max. 10MB each)</div>
                      <input
                        id="upload-modal-file-upload"
                        name="upload-modal-file-upload"
                        type="file"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg"
                        className="hidden"
                        multiple
                        onChange={handleUploadModalFileChange}
                      />
                    </div>
                    
                    {/* Click to Upload Dropdown */}
                    {showClickToUploadDropdown && (
                      <div className="absolute z-50 mt-1 w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 cursor-default select-none">
                        <div className="py-2">
                          <label htmlFor="upload-modal-file-upload" className="block px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 cursor-pointer select-none">
                            <div className="flex items-center gap-2">
                              <TbDeviceDesktopPlus className="text-base text-primary" />
                              <span className="text-xs cursor-default select-none">Desktop</span>
                            </div>
                          </label>
                          <button className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 text-gray-700 dark:text-gray-300 cursor-pointer select-none" onClick={() => { setSelectedUploadSource('Box'); setShowClickToUploadDropdown(false); }}>
                            <SiBox className="text-base text-primary" />
                            <span className="text-xs cursor-default select-none">Box</span>
                          </button>
                          <button className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 text-gray-700 dark:text-gray-300 cursor-pointer select-none" onClick={() => { setSelectedUploadSource('Dropbox'); setShowClickToUploadDropdown(false); }}>
                            <SlSocialDropbox className="text-base text-primary" />
                            <span className="text-xs cursor-default select-none">Dropbox</span>
                          </button>
                          <button className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 text-gray-700 dark:text-gray-300 cursor-pointer select-none" onClick={() => { setSelectedUploadSource('Google Drive'); setShowClickToUploadDropdown(false); }}>
                            <TbBrandGoogleDrive className="text-base text-primary" />
                            <span className="text-xs cursor-default select-none">Google Drive</span>
                          </button>
                          <button className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 text-gray-700 dark:text-gray-300 cursor-pointer select-none" onClick={() => { setSelectedUploadSource('OneDrive'); setShowClickToUploadDropdown(false); }}>
                            <TbBrandOnedrive className="text-base text-primary" />
                            <span className="text-xs cursor-default select-none">OneDrive</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Show added documents */}
              {uploadModalAddedDocuments.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-3 cursor-default select-none" style={{ fontFamily: 'Avenir, sans-serif' }}>Added Documents</h4>
                  <div className="flex flex-col gap-2">
                    {uploadModalAddedDocuments.map((doc, idx) => (
                      <div key={idx} className="bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-2 border border-gray-200 dark:border-gray-700">
                        {editingUploadModalDocumentIndex === idx ? (
                          // Inline editing mode
                          <div className="space-y-3">
                            <div>
                              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1 cursor-default select-none" style={{ fontFamily: 'Avenir, sans-serif' }}>Document Name <span className="text-red-500">*</span></label>
                              <input
                                type="text"
                                placeholder="Enter document name..."
                                className="w-full h-[34px] px-3 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-xs transition-colors cursor-text focus:ring-2 focus:ring-primary focus:border-primary"
                                value={inlineEditingUploadModalDocumentName}
                                onChange={(e) => setInlineEditingUploadModalDocumentName(e.target.value)}
                                style={{ fontFamily: 'Avenir, sans-serif' }}
                              />
                            </div>
                            <div className="flex justify-end">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleSaveInlineEditUploadModalDocument(idx);
                                }}
                                disabled={!inlineEditingUploadModalDocumentName.trim()}
                                className="px-2.5 py-1 rounded-lg bg-primary text-white text-xs font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                style={{ fontFamily: 'Avenir, sans-serif' }}
                              >
                                Save
                              </button>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleCancelInlineEditUploadModalDocument();
                                }}
                                className="px-2.5 py-1 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ml-1"
                                style={{ fontFamily: 'Avenir, sans-serif' }}
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          // Display mode
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-xs text-black dark:text-white truncate">
                                {doc.documentName}
                              </div>
                              <div className="text-xs text-gray-500 cursor-default select-none">
                                {doc.files.length} file(s)
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <button 
                                className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors p-1"
                                onClick={() => handleStartInlineEditUploadModalDocument(idx)}
                              >
                                <HiOutlinePencil className="h-4 w-4" />
                              </button>
                              <button 
                                className="text-gray-700 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-500 transition-colors p-1"
                                onClick={() => handleRemoveUploadModalAddedDocument(idx)}
                              >
                                <TbTrash className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex justify-between items-center mt-6">
                <button
                  type="button"
                  onClick={() => { 
                    setShowUploadModal(false); 
                    setUploadModalFiles([]); 
                    setUploadModalDocumentName('');
                    setSelectedUploadSource(null);
                    setUploadTaskId(null);
                    setUploadModalAddedDocuments([]);
                    setEditingUploadModalDocumentIndex(null);
                    setInlineEditingUploadModalDocumentName('');
                  }}
                  className="px-5 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-semibold"
                  style={{ fontFamily: 'Avenir, sans-serif' }}
                >
                  Close
                </button>
                <div className="flex">
                  <button
                    type="button"
                    onClick={handleAddUploadModalDocument}
                    disabled={!uploadModalDocumentName.trim() || uploadModalFiles.length === 0}
                    className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ fontFamily: 'Avenir, sans-serif' }}
                  >
                    Add Document
                  </button>
                  <button
                    type="submit"
                    disabled={uploadModalAddedDocuments.length === 0}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed ml-1"
                    style={{ fontFamily: 'Avenir, sans-serif' }}
                  >
                    Upload
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Subtask Modal */}
      {showNewSubtaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-6 cursor-default select-none">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Create New Subtask</h2>
              <button
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                onClick={() => { 
                  setShowNewSubtaskModal(false); 
                  // Only clear selectedTask if modal was opened from kanban dropdown
                  if (!newSubtaskModalOpenedFromTaskDetails) {
                    setSelectedTask(null);
                  }
                  setNewSubtaskModalOpenedFromTaskDetails(false);
                  setNewSubtaskForm({ title: '', assignee: '', status: 'To Do' as TaskStatus, dueDate: '', description: '' }); 
                  setNewSubtaskFormErrors({}); 
                }}
                aria-label="Close"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="mb-4 text-xs text-gray-500 dark:text-gray-400">
              <span>
                For Task: <span className="font-semibold text-primary">#{selectedTask?.taskNumber}</span>
              </span>
            </div>
            <form
              className="p-0"
              onSubmit={e => {
                e.preventDefault();
                // Handle form submission
              }}
            >
                             <div className="flex flex-col gap-4 mb-4">
                 {/* Subtask Name */}
                 <div>
                   <label htmlFor="newSubtaskTitle" className="block text-xs text-gray-500 dark:text-gray-400 mb-1" style={{ fontFamily: 'Avenir, sans-serif' }}>Subtask Name <span className="text-red-500">*</span></label>
                   <input
                     type="text"
                     id="newSubtaskTitle"
                     name="title"
                     required
                     value={newSubtaskForm.title}
                     onChange={(e) => {
                       setNewSubtaskForm(prev => ({ ...prev, title: e.target.value }));
                       if (newSubtaskFormErrors.title) {
                         setNewSubtaskFormErrors(prev => ({ ...prev, title: false }));
                       }
                     }}
                     className="w-full h-[34px] px-4 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-xs focus:ring-2 focus:ring-primary focus:border-primary transition-colors cursor-text"
                     placeholder="Enter subtask name..."
                     style={{ fontFamily: 'Avenir, sans-serif' }}
                   />
                   {newSubtaskFormErrors.title && (
                     <p className="mt-1 text-xs text-red-600 font-medium">Subtask name is required</p>
                   )}
                 </div>

                 {/* Assignee and Status - Side by Side */}
                 <div className="flex gap-4">
                   <div className="flex-1 w-0">
                     <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1" style={{ fontFamily: 'Avenir, sans-serif' }}>Assignee</label>
                     <div className="relative" ref={newSubtaskModalAssigneeDropdownRef}>
                       <input
                         type="text"
                         id="newSubtaskAssignee"
                         name="assignee"
                         className="w-full h-[34px] px-4 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-xs focus:ring-2 focus:ring-primary focus:border-primary transition-colors cursor-text pr-10"
                         placeholder="Choose an assignee..."
                         value={newSubtaskForm.assignee}
                         onChange={(e) => {
                           setNewSubtaskForm(prev => ({ ...prev, assignee: e.target.value }));
                           if (e.target.value === '') {
                             setShowNewSubtaskModalAssigneeDropdown(false);
                           } else if (!showNewSubtaskModalAssigneeDropdown) {
                             setShowNewSubtaskModalAssigneeDropdown(true);
                           }
                         }}
                         onFocus={() => setShowNewSubtaskModalAssigneeDropdown(true)}
                         onClick={() => setShowNewSubtaskModalAssigneeDropdown(true)}
                         style={{ fontFamily: 'Avenir, sans-serif' }}
                                                   autoComplete="off"
                        />
                        <TbChevronDown className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                        {showNewSubtaskModalAssigneeDropdown && (
                         <div className="absolute left-0 right-0 mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 z-50 max-h-48 overflow-y-auto cursor-default select-none [&::-webkit-scrollbar]:hidden" style={{ fontFamily: 'Avenir, sans-serif' }}>
                           {uniqueAssignees.length > 0 ? (
                             <>
                               {uniqueAssignees.map((assignee: string) => (
                                 <div
                                   key={assignee}
                                   className={`px-4 py-2 text-xs cursor-pointer ${newSubtaskForm.assignee === assignee ? 'bg-primary/10 text-primary' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'} select-none`}
                                   onClick={() => {
                                     setNewSubtaskForm(prev => ({ ...prev, assignee }));
                                     setShowNewSubtaskModalAssigneeDropdown(false);
                                   }}
                                 >
                                   {assignee}
                                 </div>
                               ))}
                               <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>
                               <div
                                 className="px-4 py-2 text-xs cursor-pointer text-primary hover:bg-primary/10 select-none flex items-center gap-2"
                                 onClick={() => {
                                   // TODO: Add logic to create new assignee
                                   setShowNewSubtaskModalAssigneeDropdown(false);
                                 }}
                               >
                                 <FaPlus className="text-xs" />
                                 Add new assignee
                               </div>
                             </>
                           ) : (
                             <>
                               <div className="px-4 py-2 text-xs text-gray-400 dark:text-gray-500 cursor-default select-none">No assignees found</div>
                               <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>
                               <div
                                 className="px-4 py-2 text-xs cursor-pointer text-primary hover:bg-primary/10 select-none flex items-center gap-2"
                                 onClick={() => {
                                   // TODO: Add logic to create new assignee
                                   setShowNewSubtaskModalAssigneeDropdown(false);
                                 }}
                               >
                                 <FaPlus className="text-xs" />
                                 Add new assignee
                               </div>
                             </>
                           )}
                         </div>
                       )}
                     </div>
                   </div>
                   <div className="flex-1 w-0">
                     <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1" style={{ fontFamily: 'Avenir, sans-serif' }}>Status</label>
                     <div className="relative" ref={newSubtaskModalStatusDropdownRef}>
                       <input
                         type="text"
                         id="newSubtaskStatus"
                         name="status"
                         className="w-full h-[34px] px-4 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-xs focus:ring-2 focus:ring-primary focus:border-primary transition-colors cursor-text pr-10"
                         placeholder="Choose status..."
                         value={newSubtaskForm.status}
                         onChange={(e) => {
                           setNewSubtaskForm(prev => ({ ...prev, status: e.target.value as TaskStatus }));
                           if (e.target.value === '') {
                             setShowNewSubtaskModalStatusDropdown(false);
                           } else if (!showNewSubtaskModalStatusDropdown) {
                             setShowNewSubtaskModalStatusDropdown(true);
                           }
                         }}
                         onFocus={() => setShowNewSubtaskModalStatusDropdown(true)}
                         onClick={() => setShowNewSubtaskModalStatusDropdown(true)}
                         style={{ fontFamily: 'Avenir, sans-serif' }}
                                                   autoComplete="off"
                        />
                        <TbChevronDown className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                        {showNewSubtaskModalStatusDropdown && (
                         <div className="absolute left-0 right-0 mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 z-50 max-h-48 overflow-y-auto cursor-default select-none [&::-webkit-scrollbar]:hidden" style={{ fontFamily: 'Avenir, sans-serif' }}>
                           {statusOptions.map(status => (
                             <div
                               key={status.key}
                               className={`px-4 py-2 text-xs cursor-pointer ${newSubtaskForm.status === status.key ? 'bg-primary/10 text-primary' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'} select-none`}
                               onClick={() => {
                                 setNewSubtaskForm(prev => ({ ...prev, status: status.key }));
                                 setShowNewSubtaskModalStatusDropdown(false);
                               }}
                             >
                               {status.title}
                             </div>
                           ))}
                         </div>
                       )}
                     </div>
                   </div>
                 </div>

                 {/* Due Date */}
                 <div>
                   <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1" style={{ fontFamily: 'Avenir, sans-serif' }}>Due Date</label>
                   <div className="relative">
                     <input
                       type="date"
                       id="newSubtaskDueDate"
                       name="dueDate"
                       value={newSubtaskForm.dueDate}
                       onChange={(e) => {
                         setNewSubtaskForm(prev => ({ ...prev, dueDate: e.target.value }));
                       }}
                       className="w-full h-[34px] px-4 pr-10 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-xs focus:ring-2 focus:ring-primary focus:border-primary transition-colors cursor-text [&::-webkit-calendar-picker-indicator]:hidden"
                       style={{ fontFamily: 'Avenir, sans-serif' }}
                     />
                     <button
                       type="button"
                       onClick={() => (document.getElementById('newSubtaskDueDate') as HTMLInputElement)?.showPicker()}
                       className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 flex items-center justify-center"
                     >
                       <LuCalendarFold className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                     </button>
                   </div>
                 </div>

                 {/* Description */}
                 <div>
                   <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1" style={{ fontFamily: 'Avenir, sans-serif' }}>Description</label>
                   <textarea
                     id="newSubtaskDescription"
                     name="description"
                     value={newSubtaskForm.description}
                     onChange={(e) => {
                       setNewSubtaskForm(prev => ({ ...prev, description: e.target.value }));
                     }}
                     className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-xs focus:ring-2 focus:ring-primary focus:border-primary transition-colors cursor-text resize-none [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-track]:dark:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:dark:bg-gray-700 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-gray-400 [&::-webkit-scrollbar-thumb:hover]:dark:bg-gray-500"
                     placeholder="Enter subtask description..."
                     rows={3}
                     style={{ fontFamily: 'Avenir, sans-serif' }}
                   />
                 </div>
               </div>
               <div className="flex gap-1 mt-6">
                 <button
                   type="button"
                   onClick={() => { 
                     setShowNewSubtaskModal(false); 
                     // Only clear selectedTask if modal was opened from kanban dropdown
                     if (!newSubtaskModalOpenedFromTaskDetails) {
                       setSelectedTask(null);
                     }
                     setNewSubtaskModalOpenedFromTaskDetails(false);
                     setNewSubtaskForm({ title: '', assignee: '', status: 'To Do' as TaskStatus, dueDate: '', description: '' }); 
                     setNewSubtaskFormErrors({}); 
                   }}
                   className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-semibold"
                 >
                   Cancel
                 </button>
                 <button
                   type="button"
                   onClick={() => {
                     const newErrors: Record<string, boolean> = {};
                     
                     if (!newSubtaskForm.title.trim()) {
                       newErrors.title = true;
                     }
                     
                     if (Object.keys(newErrors).length > 0) {
                       setNewSubtaskFormErrors(newErrors);
                       return;
                     }
                     
                     // Create new subtask
                     if (selectedTask) {
                       const newSubtaskId = Date.now().toString();
                       const newSubtask = {
                         id: newSubtaskId,
                         title: newSubtaskForm.title.trim(),
                         assignee: newSubtaskForm.assignee || '',
                         status: newSubtaskForm.status || 'To Do',
                         dueDate: newSubtaskForm.dueDate || '',
                         description: newSubtaskForm.description || '',
                         completed: false
                       };
                       
                       // Update the task with the new subtask
                       const updatedSubtasks = [...(selectedTask.subtasks || []), newSubtask];
                       updateTask(selectedTask.code, { subtasks: updatedSubtasks });
                       
                       // Update the selected task in the modal
                       setSelectedTask({ ...selectedTask, subtasks: updatedSubtasks });
                     }
                     
                     // Reset form and close modal
                     setShowNewSubtaskModal(false);
                     // Only clear selectedTask if modal was opened from kanban dropdown
                     if (!newSubtaskModalOpenedFromTaskDetails) {
                       setSelectedTask(null);
                     }
                     setNewSubtaskModalOpenedFromTaskDetails(false);
                     setNewSubtaskForm({ title: '', assignee: '', status: 'To Do' as TaskStatus, dueDate: '', description: '' });
                     setNewSubtaskFormErrors({});
                   }}
                   className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-semibold flex items-center justify-center"
                 >
                   <TbPlus className="w-4 h-4 mr-2" />
                   Create Subtask
                 </button>
               </div>
             </form>
           </div>
                 </div>
      )}

      {/* Edit Subtask Modal */}
      {showEditSubtaskModal && editingSubtask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-6 cursor-default select-none">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Edit Subtask</h2>
              <button
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                onClick={() => {
                  setShowEditSubtaskModal(false);
                  setEditSubtaskModalOpenedFromTaskDetails(false);
                  setEditingSubtask(null);
                  setEditSubtaskForm({ title: '', assignee: '', status: 'To Do' as TaskStatus, dueDate: '', description: '' });
                  setEditSubtaskFormErrors({});
                }}
                aria-label="Close"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
                          </div>
            <div className="mb-4 text-xs text-gray-500 dark:text-gray-400">
              <span>
                For Task: <span className="font-semibold text-primary">#{selectedTask?.taskNumber}</span>
              </span>
                        </div>
            <form
              className="p-0"
              onSubmit={e => {
                e.preventDefault();
                // Handle form submission
              }}
            >
              <div className="flex flex-col gap-4 mb-4">
                {/* Subtask Name */}
                <div>
                  <label htmlFor="editSubtaskTitle" className="block text-xs text-gray-500 dark:text-gray-400 mb-1" style={{ fontFamily: 'Avenir, sans-serif' }}>Subtask Name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    id="editSubtaskTitle"
                    name="title"
                    required
                    value={editSubtaskForm.title}
                    onChange={(e) => {
                      setEditSubtaskForm(prev => ({ ...prev, title: e.target.value }));
                      if (editSubtaskFormErrors.title) {
                        setEditSubtaskFormErrors(prev => ({ ...prev, title: false }));
                      }
                    }}
                    className="w-full h-[34px] px-4 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-xs focus:ring-2 focus:ring-primary focus:border-primary transition-colors cursor-text"
                    placeholder="Enter subtask name..."
                    style={{ fontFamily: 'Avenir, sans-serif' }}
                  />
                  {editSubtaskFormErrors.title && (
                    <p className="mt-1 text-xs text-red-600 font-medium">Subtask name is required</p>
                  )}
                      </div>

                {/* Assignee and Status - Side by Side */}
                <div className="flex gap-4">
                  <div className="flex-1 w-0">
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1" style={{ fontFamily: 'Avenir, sans-serif' }}>Assignee</label>
                    <div className="relative" ref={editSubtaskModalAssigneeDropdownRef}>
                      <input
                        type="text"
                        id="editSubtaskAssignee"
                        name="assignee"
                        className="w-full h-[34px] px-4 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-xs focus:ring-2 focus:ring-primary focus:border-primary transition-colors cursor-text pr-10"
                        placeholder="Choose an assignee..."
                        value={editSubtaskForm.assignee}
                        onChange={(e) => {
                          setEditSubtaskForm(prev => ({ ...prev, assignee: e.target.value }));
                          if (e.target.value === '') {
                            setShowEditSubtaskModalAssigneeDropdown(false);
                          } else if (!showEditSubtaskModalAssigneeDropdown) {
                            setShowEditSubtaskModalAssigneeDropdown(true);
                          }
                        }}
                        onFocus={() => setShowEditSubtaskModalAssigneeDropdown(true)}
                        onClick={() => setShowEditSubtaskModalAssigneeDropdown(true)}
                        style={{ fontFamily: 'Avenir, sans-serif' }}
                                                 autoComplete="off"
                       />
                       <TbChevronDown className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                       {showEditSubtaskModalAssigneeDropdown && (
                        <div className="absolute left-0 right-0 mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 z-50 max-h-48 overflow-y-auto cursor-default select-none [&::-webkit-scrollbar]:hidden" style={{ fontFamily: 'Avenir, sans-serif' }}>
                          {uniqueAssignees.length > 0 ? (
                            <>
                              {uniqueAssignees.map((assignee: string) => (
                                <div
                                  key={assignee}
                                  className={`px-4 py-2 text-xs cursor-pointer ${editSubtaskForm.assignee === assignee ? 'bg-primary/10 text-primary' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'} select-none`}
                                  onClick={() => {
                                    setEditSubtaskForm(prev => ({ ...prev, assignee }));
                                    setShowEditSubtaskModalAssigneeDropdown(false);
                                  }}
                                >
                                  {assignee}
                                </div>
                              ))}
                              <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>
                              <div
                                className="px-4 py-2 text-xs cursor-pointer text-primary hover:bg-primary/10 select-none flex items-center gap-2"
                                onClick={() => {
                                  // TODO: Add logic to create new assignee
                                  setShowEditSubtaskModalAssigneeDropdown(false);
                                }}
                              >
                                <FaPlus className="text-xs" />
                                Add new assignee
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="px-4 py-2 text-xs text-gray-400 dark:text-gray-500 cursor-default select-none">No assignees found</div>
                              <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>
                              <div
                                className="px-4 py-2 text-xs cursor-pointer text-primary hover:bg-primary/10 select-none flex items-center gap-2"
                                onClick={() => {
                                  // TODO: Add logic to create new assignee
                                  setShowEditSubtaskModalAssigneeDropdown(false);
                                }}
                              >
                                <FaPlus className="text-xs" />
                                Add new assignee
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex-1 w-0">
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1" style={{ fontFamily: 'Avenir, sans-serif' }}>Status</label>
                    <div className="relative" ref={editSubtaskModalStatusDropdownRef}>
                      <input
                        type="text"
                        id="editSubtaskStatus"
                        name="status"
                        className="w-full h-[34px] px-4 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-xs focus:ring-2 focus:ring-primary focus:border-primary transition-colors cursor-text pr-10"
                        placeholder="Choose status..."
                        value={editSubtaskForm.status}
                        onChange={(e) => {
                          setEditSubtaskForm(prev => ({ ...prev, status: e.target.value as TaskStatus }));
                          if (e.target.value === '') {
                            setShowEditSubtaskModalStatusDropdown(false);
                          } else if (!showEditSubtaskModalStatusDropdown) {
                            setShowEditSubtaskModalStatusDropdown(true);
                          }
                        }}
                        onFocus={() => setShowEditSubtaskModalStatusDropdown(true)}
                        onClick={() => setShowEditSubtaskModalStatusDropdown(true)}
                        style={{ fontFamily: 'Avenir, sans-serif' }}
                                                 autoComplete="off"
                       />
                       <TbChevronDown className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                       {showEditSubtaskModalStatusDropdown && (
                        <div className="absolute left-0 right-0 mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 z-50 max-h-48 overflow-y-auto cursor-default select-none [&::-webkit-scrollbar]:hidden" style={{ fontFamily: 'Avenir, sans-serif' }}>
                          {statusOptions.map(status => (
                            <div
                              key={status.key}
                              className={`px-4 py-2 text-xs cursor-pointer ${editSubtaskForm.status === status.key ? 'bg-primary/10 text-primary' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'} select-none`}
                              onClick={() => {
                                setEditSubtaskForm(prev => ({ ...prev, status: status.key }));
                                setShowEditSubtaskModalStatusDropdown(false);
                              }}
                            >
                              {status.title}
                            </div>
                          ))}
                                      </div>
                                    )}
                                  </div>
                  </div>
                                  </div>

                {/* Due Date */}
                <div>
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1" style={{ fontFamily: 'Avenir, sans-serif' }}>Due Date</label>
                  <div className="relative">
                    <input
                      type="date"
                      id="editSubtaskDueDate"
                      name="dueDate"
                      value={editSubtaskForm.dueDate}
                      onChange={(e) => {
                        setEditSubtaskForm(prev => ({ ...prev, dueDate: e.target.value }));
                      }}
                      className="w-full h-[34px] px-4 pr-10 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-xs focus:ring-2 focus:ring-primary focus:border-primary transition-colors cursor-text [&::-webkit-calendar-picker-indicator]:hidden"
                      style={{ fontFamily: 'Avenir, sans-serif' }}
                    />
                    <button
                      type="button"
                      onClick={() => (document.getElementById('editSubtaskDueDate') as HTMLInputElement)?.showPicker()}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 flex items-center justify-center"
                    >
                      <LuCalendarFold className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                    </button>
                                  </div>
                                  </div>

                {/* Description */}
                <div>
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1" style={{ fontFamily: 'Avenir, sans-serif' }}>Description</label>
                  <textarea
                    id="editSubtaskDescription"
                    name="description"
                    value={editSubtaskForm.description}
                    onChange={(e) => {
                      setEditSubtaskForm(prev => ({ ...prev, description: e.target.value }));
                    }}
                    className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-xs focus:ring-2 focus:ring-primary focus:border-primary transition-colors cursor-text resize-none [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-track]:dark:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:dark:bg-gray-700 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-gray-400 [&::-webkit-scrollbar-thumb:hover]:dark:bg-gray-500"
                    placeholder="Enter subtask description..."
                    rows={3}
                    style={{ fontFamily: 'Avenir, sans-serif' }}
                                      />
                                    </div>
                                  </div>
              <div className="flex gap-1 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditSubtaskModal(false);
                    setEditSubtaskModalOpenedFromTaskDetails(false);
                    setEditingSubtask(null);
                    setEditSubtaskForm({ title: '', assignee: '', status: 'To Do' as TaskStatus, dueDate: '', description: '' });
                    setEditSubtaskFormErrors({});
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const newErrors: Record<string, boolean> = {};
                    
                    if (!editSubtaskForm.title.trim()) {
                      newErrors.title = true;
                    }
                    
                    if (Object.keys(newErrors).length > 0) {
                      setEditSubtaskFormErrors(newErrors);
                      return;
                    }
                    
                    // Update the subtask
                    if (selectedTask && editingSubtask) {
                      const updatedSubtasks = selectedTask.subtasks.map(st =>
                        st.id === editingSubtask.id
                          ? {
                              ...st,
                              title: editSubtaskForm.title.trim(),
                              assignee: editSubtaskForm.assignee,
                              status: editSubtaskForm.status,
                              dueDate: editSubtaskForm.dueDate,
                              description: editSubtaskForm.description
                            }
                          : st
                      );
                      
                      // Update the task with the modified subtask
                      updateTask(selectedTask.code, { subtasks: updatedSubtasks });
                      
                      // Update the selected task in the modal
                      setSelectedTask({ ...selectedTask, subtasks: updatedSubtasks });
                    }
                    
                    // Reset form and close modal
                    setShowEditSubtaskModal(false);
                    setEditSubtaskModalOpenedFromTaskDetails(false);
                    setEditingSubtask(null);
                    setEditSubtaskForm({ title: '', assignee: '', status: 'To Do' as TaskStatus, dueDate: '', description: '' });
                    setEditSubtaskFormErrors({});
                  }}
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-semibold"
                >
                  Save Changes
                                        </button>
                                    </div>
            </form>
                                  </div>
                                          </div>
      )}
      </div>
      
      {/* Toast Notifications */}
      <ContractsToaster />
    </div>
  );
}
