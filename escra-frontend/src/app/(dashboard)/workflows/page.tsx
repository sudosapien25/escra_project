'use client';
import React, { useRef, useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { mockContracts } from '@/data/mockContracts';
import { Task } from '@/types/task';

// Icons
import { HiOutlineDocumentText, HiOutlineViewBoards, HiOutlineUpload, HiOutlineEye, HiOutlineDownload, HiOutlineTrash, HiPlus, HiChevronDown } from 'react-icons/hi';
import { HiMiniChevronDown } from 'react-icons/hi2';
import { CgPlayPauseR, CgPlayStopR } from 'react-icons/cg';
import { BsPerson } from 'react-icons/bs';
import { LuCalendarClock, LuSendHorizontal, LuCalendarFold } from 'react-icons/lu';
import { FaPlus, FaSearch, FaRetweet, FaCheckCircle, FaCheck } from 'react-icons/fa';
import { PiListMagnifyingGlassBold, PiListPlusBold, PiDotsThreeOutline } from 'react-icons/pi';
import { FaRegSquareCheck } from 'react-icons/fa6';
import { BiDotsHorizontal, BiCommentAdd } from 'react-icons/bi';
import { MdCancelPresentation, MdOutlineLibraryAddCheck } from 'react-icons/md';
import { MdOutlineLightMode, MdOutlineDarkMode } from 'react-icons/md';
import { RiUserSearchLine } from 'react-icons/ri';
import { HiOutlineDocumentSearch } from 'react-icons/hi';
import { TbDeviceDesktopPlus, TbBrandGoogleDrive, TbBrandOnedrive } from 'react-icons/tb';
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

type TaskStatus = 'To Do' | 'Blocked' | 'On Hold' | 'In Progress' | 'In Review' | 'Done' | 'Canceled';
type StatusOption = TaskStatus | 'All';

export default function WorkflowsPage() {
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
  const [contractSearch, setContractSearch] = useState('');
  const [showContractDropdown, setShowContractDropdown] = useState(false);
  const filteredContracts = mockContracts.filter(c => c.title.toLowerCase().includes(contractSearch.toLowerCase()));
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
  const [uploadContractId, setUploadContractId] = React.useState<string | null>(null);
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
  
  // Add state for upload modal assignee dropdown
  const [uploadModalAssignee, setUploadModalAssignee] = useState<string>('');
  const [showUploadModalAssigneeDropdown, setShowUploadModalAssigneeDropdown] = useState(false);
  const uploadModalAssigneeDropdownRef = useRef<HTMLDivElement>(null);
  const uploadModalAssigneeInputRef = useRef<HTMLInputElement>(null);

  // Use the task store
  const {
    tasks,
    selectedTask,
    setSelectedTask,
    updateTask,
    moveTask,
    getTasksByStatus,
    initializeTasks
  } = useTaskStore();

  // Initialize tasks from storage
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      initializeTasks();
      console.log('Initialized tasks:', tasks);
    }
  }, []); // Remove initializeTasks from dependencies to prevent infinite loop

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
      icon: <PiListPlusBold className="text-xl mr-2 text-gray-500" />,
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
      icon: <PiListMagnifyingGlassBold className="text-xl mr-2 text-yellow-500" />,
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
      icon: <MdCancelPresentation className="text-xl mr-2 text-purple-500" />,
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
        const contractObj = mockContracts.find(c => c.id === task.contractId);
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
          setEditedContractName(mockContracts.find(c => c.id === selectedTask?.contractId)?.title || '');
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

  // Horizontal scroll on wheel
  const handleKanbanWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (kanbanBoardRef.current) {
      if (e.deltaY !== 0) {
        e.preventDefault();
        kanbanBoardRef.current.scrollLeft += e.deltaY;
      }
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
        <button
          onClick={() => setShowNewTaskModal(true)}
          className="flex items-center justify-center w-full sm:w-auto px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-semibold"
        >
          <MdOutlineLibraryAddCheck className="mr-2 text-lg" />
          New Task
        </button>
      </div>

      <hr className="my-3 md:my-6 border-gray-300 cursor-default select-none" />

      {/* Workflow Stats and Filters Section */}
      <div className="space-y-4">
        {/* Tabs */}
        {/* Mobile: Stacked layout */}
        <div className="lg:hidden cursor-default select-none mb-2">
          <div className="flex flex-col gap-2 cursor-default select-none">
            {kanbanTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setKanbanTab(tab)}
                className={`flex items-center justify-between w-full bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-gray-700 font-medium text-xs shadow-sm whitespace-nowrap transition-all duration-300 ${
                  kanbanTab === tab 
                    ? 'bg-white dark:bg-gray-800 text-teal-500 dark:text-teal-400 border-2 border-gray-200 dark:border-gray-700' 
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                }`}
                style={{ fontFamily: 'Avenir, sans-serif' }}
              >
                <span className="flex items-center">
                  <span className={`inline-block transition-all duration-300 ${kanbanTab === tab ? 'opacity-100 mr-1.5' : 'opacity-0 w-0 mr-0'}`} style={{width: kanbanTab === tab ? 16 : 0}}>
                    {kanbanTab === tab && <Logo width={16} height={16} className="pointer-events-none" />}
                  </span>
                  {tab}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Desktop: Horizontal layout */}
        <div className="hidden lg:flex gap-1 cursor-default select-none mb-6">
          {kanbanTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setKanbanTab(tab)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all duration-300 font-sans flex items-center justify-center ${
                kanbanTab === tab 
                  ? 'bg-white dark:bg-gray-800 text-teal-500 dark:text-teal-400 min-w-[90px] border-2 border-gray-200 dark:border-gray-700' 
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 w-fit border border-gray-200 dark:border-gray-700'
              }`}
            >
              <span className={`inline-block transition-all duration-300 ${kanbanTab === tab ? 'opacity-100 mr-1.5' : 'opacity-0 w-0 mr-0'}`} style={{width: kanbanTab === tab ? 16 : 0}}>
                {kanbanTab === tab && <Logo width={16} height={16} className="pointer-events-none" />}
              </span>
              {tab}
            </button>
          ))}
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 mt-4">
          {/* Tasks in Progress */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 flex items-center gap-4 shadow-sm h-full">
            <div className="h-10 w-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center border-2 border-blue-200 dark:border-blue-800">
              <FaRetweet size={18} className="text-blue-500 dark:text-blue-400" />
            </div>
            <div className="flex flex-col items-start h-full">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 font-sans">Tasks in Progress</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{kanbanColumns.find(col => col.key === 'In Progress')?.tasks.length || 0}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500">Currently active</p>
            </div>
          </div>

          {/* Due Within 7 Days */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 flex items-center gap-4 shadow-sm h-full">
            <div className="h-10 w-10 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center border-2 border-yellow-200 dark:border-yellow-800">
              <LuCalendarClock size={18} className="text-yellow-500 dark:text-yellow-400" />
            </div>
            <div className="flex flex-col items-start h-full">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 font-sans">Due Within 7 Days</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">5</p>
              <p className="text-xs text-gray-400 dark:text-gray-500">Needs attention</p>
            </div>
          </div>

          {/* Blocked Tasks */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 flex items-center gap-4 shadow-sm h-full">
            <div className="h-10 w-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center border-2 border-red-200 dark:border-red-800">
              <CgPlayStopR size={18} className="text-red-500 dark:text-red-400" />
            </div>
            <div className="flex flex-col items-start h-full">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 font-sans">Blocked Tasks</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{kanbanColumns.find(col => col.key === 'Blocked')?.tasks.length || 0}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500">Requires action</p>
            </div>
          </div>

          {/* Completed Tasks */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 flex items-center gap-4 shadow-sm h-full">
            <div className="h-10 w-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center border-2 border-green-200 dark:border-green-800">
              <FaRegSquareCheck size={18} className="text-green-500 dark:text-green-400" />
            </div>
            <div className="flex flex-col items-start h-full">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 font-sans">Completed</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{kanbanColumns.find(col => col.key === 'Done')?.tasks.length || 0}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500">This month</p>
            </div>
          </div>
        </div>

        <hr className="my-3 md:my-6 border-gray-300 cursor-default select-none" />

        {/* Filter Bar - Responsive Design */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-4 mb-6 mt-2">
          {/* Mobile: Stacked layout */}
          <div className="lg:hidden">
            {/* Search Bar */}
            <div className="flex items-center bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 w-full">
              <FaSearch className="text-gray-400 mr-2" size={18} />
              <input
                type="text"
                placeholder="Search tasks, assignees, contracts or IDs"
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
                  <span className="flex items-center"><HiOutlineDocumentSearch className="text-gray-400 text-base mr-2" />Contract</span>
                  <HiMiniChevronDown className="text-gray-400" size={16} />
                </button>
                {openContractDropdown && (
                  <div ref={mobileContractDropdownRef} className="absolute top-full left-0 mt-2 w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 z-50 py-2 min-w-[300px] max-w-[90vw] contract-dropdown" style={{ 
                    fontFamily: 'Avenir, sans-serif',
                    maxWidth: 'calc(100vw - 2rem)',
                    right: '0',
                    transform: 'translateX(0)'
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
                        <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
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
                    {mockContracts
                      .filter(contract => 
                        contract.id.toLowerCase().includes(contractSearch.toLowerCase()) ||
                        contract.title.toLowerCase().includes(contractSearch.toLowerCase())
                      )
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
                  <span className="flex items-center"><RiUserSearchLine className="text-gray-400 text-base mr-2" />Assignee</span>
                  <HiMiniChevronDown className="text-gray-400" size={16} />
                </button>
                {openAssigneeDropdown && (
                  <div ref={mobileAssigneeDropdownRef} className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 z-50 py-2 assignee-dropdown" style={{ minWidth: '180px', fontFamily: 'Avenir, sans-serif' }}>
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
                  <span className="flex items-center"><HiOutlineViewBoards className="text-gray-400 text-base mr-2" />Status</span>
                  <HiMiniChevronDown className="text-gray-400" size={16} />
                </button>
                {showStatusDropdown && (
                  <div ref={mobileStatusDropdownRef} className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 z-50 py-2 status-filter-dropdown" style={{ minWidth: '180px', fontFamily: 'Avenir, sans-serif' }}>
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
            </div>
          </div>
          {/* Desktop: Horizontal layout */}
          <div className="hidden lg:flex items-center gap-1">
            {/* Search Bar */}
            <div className="flex items-center bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 flex-1 min-w-0">
              <FaSearch className="text-gray-400 mr-2" size={18} />
              <input
                type="text"
                placeholder="Search tasks, assignees, contracts or IDs"
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
                  <HiOutlineDocumentSearch className="text-gray-400 w-4 h-4" />
                  <span>Contract</span>
                  <HiMiniChevronDown className="ml-1 text-gray-400" size={16} />
                </button>
                {openContractDropdown && (
                  <div 
                    ref={contractDropdownRef}
                    className="absolute left-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 z-50 py-2 min-w-[400px] w-96 contract-dropdown" 
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
                        <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
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
                    {mockContracts
                      .filter(contract => 
                        contract.id.toLowerCase().includes(contractSearch.toLowerCase()) ||
                        contract.title.toLowerCase().includes(contractSearch.toLowerCase())
                      )
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
                  <RiUserSearchLine className="text-gray-400 w-4 h-4" />
                  <span>Assignee</span>
                  <HiMiniChevronDown className="ml-1 text-gray-400" size={16} />
                </button>
                {openAssigneeDropdown && (
                  <div 
                    ref={assigneeDropdownRef}
                    className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 z-50 py-2 assignee-dropdown" 
                    style={{ minWidth: '180px', fontFamily: 'Avenir, sans-serif' }}
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
                  <HiOutlineViewBoards className="text-gray-400 w-4 h-4" />
                  <span>Status</span>
                  <HiMiniChevronDown className="ml-1 text-gray-400" size={16} />
                </button>
                {showStatusDropdown && (
                  <div 
                    ref={statusDropdownRef}
                    className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 z-50 py-2 status-filter-dropdown" 
                    style={{ minWidth: '180px', fontFamily: 'Avenir, sans-serif' }}
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
            </div>
          </div>
        </div>
      </div>

      {/* Kanban Board Section (filtered by tab) */}
      {kanbanTab === 'All' && (
        <DragDropContext onDragEnd={onDragEnd}>
          <div
            ref={kanbanBoardRef}
            onWheel={handleKanbanWheel}
            className="flex flex-grow overflow-x-auto space-x-6 p-4 rounded-lg [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-white [&::-webkit-scrollbar-track]:dark:bg-gray-800 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:dark:bg-gray-600 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-gray-400 [&::-webkit-scrollbar-thumb:hover]:dark:bg-gray-500"
          >
            {kanbanColumns
              .filter(col => selectedStatuses.includes('All') || selectedStatuses.includes(col.key as TaskStatus))
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
                      <div className="p-4 overflow-y-auto h-[600px] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-white [&::-webkit-scrollbar-track]:dark:bg-gray-800 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:dark:bg-gray-600 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-gray-400 [&::-webkit-scrollbar-thumb:hover]:dark:bg-gray-500">
                        <div className="space-y-3">
                          {filterTasks(col.tasks).map((task, index) => (
                            <Draggable key={task.code} draggableId={task.code} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 p-4 shadow-lg hover:shadow-md transition-shadow relative ${
                                    snapshot.isDragging ? 'shadow-lg' : ''
                                  }`}
                                  onClick={() => {
                                    const fullTask = tasks.find(t => t.code === task.code);
                                    setSelectedTask(fullTask || task);
                                  }}
                                >
                                  {/* Task Menu - Positioned at top right */}
                                  <div className="absolute top-3 right-3">
                                    <button
                                      className="border border-gray-300 dark:border-gray-600 rounded-md px-1 py-0.5 text-gray-700 dark:text-gray-300 hover:border-primary hover:text-primary transition-colors"
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
                                        className="absolute right-0 mt-[1px] w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50"
                                        style={{ fontFamily: 'Avenir, sans-serif' }}
                                      >
                                        <button className="w-full text-left px-4 py-2 text-xs font-medium text-gray-900 hover:bg-primary/10 hover:text-primary">View Details</button>
                                        <button className="w-full text-left px-4 py-2 text-xs font-medium text-gray-900 hover:bg-primary/10 hover:text-primary">Edit Task</button>
                                        <button className="w-full text-left px-4 py-2 text-xs font-medium text-gray-900 hover:bg-primary/10 hover:text-primary">Change Status</button>
                                        <button className="w-full text-left px-4 py-2 text-xs font-medium text-gray-900 hover:bg-red-50 hover:text-red-700">Delete Task</button>
                                      </div>
                                    )}
                                  </div>

                                  {/* Task Number - Top Left */}
                                  <div className="mb-3">
                                    <span className="text-[10px] font-bold bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded border border-gray-700 dark:border-gray-500">
                                      # {task.taskNumber}
                                    </span>
                                    <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded border border-primary ml-1">
                                      # {task.contractId}
                                    </span>
                                  </div>

                                  {/* Task Title */}
                                  <h3 className="text-xs font-bold text-gray-900 dark:text-white mb-2">{task.title}</h3>

                                  {/* Contract Info */}
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="text-xs font-bold text-primary">
                                      {mockContracts.find(c => c.id === task.contractId)?.title}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1 mb-3">
                                    <LuCalendarClock className="text-gray-400 text-sm" />
                                    <span className="text-xs text-gray-500">{formatDatePretty(task.due)}</span>
                                  </div>

                                  {/* Progress Section */}
                                  <div className="space-y-2 mb-3">
                                    <div className="h-2 bg-gray-100 dark:bg-gray-600 rounded-full overflow-hidden">
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
                                    <span className="text-xs text-gray-900 dark:text-white">{(() => {
                                      const taskSubtasks = task.subtasks || [];
                                      const completed = taskSubtasks.filter(st => st.completed).length;
                                      return `${completed} of ${taskSubtasks.length}`;
                                    })()}</span>
                                  </div>
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
      )}
      {kanbanTab === 'Active' && (
        <DragDropContext onDragEnd={onDragEnd}>
          <div
            ref={kanbanBoardRef}
            onWheel={handleKanbanWheel}
            className="flex flex-grow overflow-x-auto space-x-6 p-4 rounded-lg [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-white [&::-webkit-scrollbar-track]:dark:bg-gray-800 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:dark:bg-gray-600 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-gray-400 [&::-webkit-scrollbar-thumb:hover]:dark:bg-gray-500"
          >
            {kanbanColumns
              .filter(col => col.key !== 'Done' && col.key !== 'Canceled')
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
                      <div className="p-4 overflow-y-auto h-[600px] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-white [&::-webkit-scrollbar-track]:dark:bg-gray-800 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:dark:bg-gray-600 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-gray-400 [&::-webkit-scrollbar-thumb:hover]:dark:bg-gray-500">
                        <div className="space-y-3">
                          {filterTasks(col.tasks).map((task, index) => (
                            <Draggable key={task.code} draggableId={task.code} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 p-4 shadow-lg hover:shadow-md transition-shadow relative ${snapshot.isDragging ? 'shadow-lg' : ''}`}
                                  onClick={() => {
                                    const fullTask = tasks.find(t => t.code === task.code);
                                    setSelectedTask(fullTask || task);
                                  }}
                                >
                                  {/* Task Menu - Positioned at top right */}
                                  <div className="absolute top-3 right-3">
                                    <button
                                      className="border border-gray-300 dark:border-gray-600 rounded-md px-1 py-0.5 text-gray-700 dark:text-gray-300 hover:border-primary hover:text-primary transition-colors"
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
                                        className="absolute right-0 mt-[1px] w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50"
                                        style={{ fontFamily: 'Avenir, sans-serif' }}
                                      >
                                        <button className="w-full text-left px-4 py-2 text-xs font-medium text-gray-900 hover:bg-primary/10 hover:text-primary">View Details</button>
                                        <button className="w-full text-left px-4 py-2 text-xs font-medium text-gray-900 hover:bg-primary/10 hover:text-primary">Edit Task</button>
                                        <button className="w-full text-left px-4 py-2 text-xs font-medium text-gray-900 hover:bg-primary/10 hover:text-primary">Change Status</button>
                                        <button className="w-full text-left px-4 py-2 text-xs font-medium text-gray-900 hover:bg-red-50 hover:text-red-700">Delete Task</button>
                                      </div>
                                    )}
                                  </div>
                                  {/* Task Number - Top Left */}
                                  <div className="mb-3">
                                    <span className="text-[10px] font-bold bg-gray-100 text-gray-700 px-2 py-0.5 rounded border border-gray-700">
                                      # {task.taskNumber}
                                    </span>
                                    <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded border border-primary ml-1">
                                      # {task.contractId}
                                    </span>
                                  </div>
                                  {/* Task Title */}
                                  <h3 className="text-xs font-bold text-gray-900 mb-2">{task.title}</h3>
                                  {/* Contract Info */}
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="text-xs font-bold text-primary">
                                      {mockContracts.find(c => c.id === task.contractId)?.title}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1 mb-3">
                                    <LuCalendarClock className="text-gray-400 text-sm" />
                                    <span className="text-xs text-gray-500">{formatDatePretty(task.due)}</span>
                                  </div>
                                  {/* Progress Section */}
                                  <div className="space-y-2 mb-3">
                                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
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
                                    <span className="text-xs text-gray-900">{task.assignee}</span>
                                    <span className="text-xs text-gray-900">{(() => {
                                      const taskSubtasks = task.subtasks || [];
                                      const completed = taskSubtasks.filter(st => st.completed).length;
                                      return `${completed} of ${taskSubtasks.length}`;
                                    })()}</span>
                                  </div>
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
      )}

      {/* Task Details Modal */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 cursor-default select-none">
          <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-[calc(100%-1rem)] max-w-[1400px] mx-4 my-8 max-h-[90vh] flex flex-col overflow-hidden cursor-default select-none">
            {/* Sticky Header with Task ID and Close buttons */}
            <div className="sticky top-0 z-40 bg-gray-50 dark:bg-gray-900 px-6 py-4 cursor-default select-none">
              <div className="flex items-start justify-between cursor-default select-none">
                {/* Left: Task ID and Contract ID */}
                <div className="flex-1 min-w-0 cursor-default select-none">
                  <div className="flex items-center mb-4 cursor-default select-none">
                    <span className="text-[10px] font-bold bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded border border-gray-700 dark:border-gray-600 cursor-default select-none">
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
                  onClick={() => setSelectedTask(null)}
                  aria-label="Close"
                >
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-900 cursor-default select-none [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-white [&::-webkit-scrollbar-track]:dark:bg-gray-800 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:dark:bg-gray-600 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-gray-400 [&::-webkit-scrollbar-thumb:hover]:dark:bg-gray-500">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Task Details Box */}
                  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 min-h-[420px] cursor-default select-none">
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
                                              {/* Row 1: Task Title | Contract Name */}
                    <div className="grid grid-cols-2 gap-6 mb-4 cursor-default select-none">
                      <div>
                        <div className="text-gray-500 dark:text-gray-400 text-xs mb-1 cursor-default select-none" style={{ fontFamily: 'Avenir, sans-serif' }}>Task Title</div>
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
                          {mockContracts.find(c => c.id === selectedTask?.contractId)?.title || ''}
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
                            className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-lg text-xs font-medium text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary transition-colors bg-white dark:bg-gray-900"
                            placeholder={selectedTask?.assignee || ''}
                            value={editedAssignee}
                            onChange={e => setEditedAssignee(e.target.value)}
                            onFocus={() => setShowAssigneeDropdown(true)}
                            style={{ fontFamily: 'Avenir, sans-serif' }}
                            autoComplete="off"
                          />
                          {showAssigneeDropdown && (
                            <div className="absolute left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-white [&::-webkit-scrollbar-track]:dark:bg-gray-800 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:dark:bg-gray-600 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-gray-400 [&::-webkit-scrollbar-thumb:hover]:dark:bg-gray-500" style={{ fontFamily: 'Avenir, sans-serif' }}>
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
                          <HiChevronDown className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          {showModalStatusDropdown && (
                            <div ref={modalStatusDropdownRef} className="absolute left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 z-50 py-2 status-dropdown" style={{ minWidth: '180px', fontFamily: 'Avenir, sans-serif' }}>
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
                            className="w-full px-4 py-2 pr-10 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs text-gray-900 dark:text-white bg-white dark:bg-gray-900 [&::-webkit-calendar-picker-indicator]:hidden"
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
                    <div className="mb-4 cursor-default select-none">
                      <div className="text-gray-500 dark:text-gray-400 text-xs mb-1 cursor-default select-none" style={{ fontFamily: 'Avenir, sans-serif' }}>Description</div>
                      <textarea
                        className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-lg text-xs font-medium text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary transition-colors resize-none bg-white dark:bg-gray-900"
                        rows={3}
                        placeholder="Enter task description..."
                        style={{ fontFamily: 'Avenir, sans-serif' }}
                      />
                    </div>
                  </div>

                  {/* Subtasks Box */}
                  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 min-h-[336px] cursor-default select-none">
                    <div className="flex items-center justify-between mb-4 cursor-default select-none">
                      <span className="text-sm font-semibold text-gray-900 dark:text-white cursor-default select-none" style={{ fontFamily: 'Avenir, sans-serif' }}>Subtasks</span>
                      <button className="flex items-center gap-2 px-2 py-1 rounded-lg border border-gray-200 dark:border-transparent bg-gray-100 dark:bg-primary text-gray-700 dark:text-white font-semibold text-xs hover:bg-gray-200 dark:hover:bg-primary-dark transition-colors cursor-pointer" style={{ fontFamily: 'Avenir, sans-serif' }}>
                        <span className="text-base font-bold text-primary dark:text-white">+</span> New Subtask
                      </button>
                    </div>
                    <div className="space-y-2 cursor-default select-none">
                      {selectedTask?.subtasks?.map((subtask) => (
                        <div key={subtask.id} className="flex items-center gap-3 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                          <div className="flex-1">
                            <span className="text-xs font-medium text-gray-900 dark:text-white">{subtask.title}</span>
                          </div>
                          <div className="w-5 h-5 border border-gray-300 rounded flex items-center justify-center cursor-pointer" onClick={() => {
                            const fullTask = tasks.find(t => t.code === selectedTask.code);
                            if (fullTask) {
                              const updatedSubtasks = fullTask.subtasks.map(st =>
                                st.id === subtask.id ? { ...st, completed: !st.completed } : st
                              );
                              updateTask(fullTask.code, { subtasks: updatedSubtasks });
                              // After updating, get the latest task from the store and set it as selected
                              setTimeout(() => {
                                const refreshedTask = useTaskStore.getState().tasks.find(t => t.code === fullTask.code);
                                setSelectedTask(refreshedTask || { ...fullTask, subtasks: updatedSubtasks });
                              }, 0);
                            }
                          }}>
                            {subtask.completed && (
                              <div className="w-4 h-4 bg-primary rounded-sm flex items-center justify-center">
                                <FaCheck className="text-white" size={10} />
                              </div>
                            )}
                          </div>
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
                  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 min-h-[420px] cursor-default select-none">
                    <div className="flex items-center justify-between mb-4 cursor-default select-none">
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white cursor-default select-none">Documents</h3>
                      <button 
                        onClick={() => { setShowUploadModal(true); setUploadContractId(selectedTask?.contractId || null); }}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-transparent bg-gray-100 dark:bg-primary text-gray-700 dark:text-white font-semibold text-xs hover:bg-gray-200 dark:hover:bg-primary-dark transition-colors cursor-pointer" style={{ fontFamily: 'Avenir, sans-serif' }}
                      >
                        <HiOutlineUpload className="text-base text-primary dark:text-white" /> Upload
                      </button>
                    </div>
                    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 cursor-default select-none [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-white [&::-webkit-scrollbar-track]:dark:bg-gray-800 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:dark:bg-gray-600 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-gray-400 [&::-webkit-scrollbar-thumb:hover]:dark:bg-gray-500">
                      <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-3 border border-gray-200 dark:border-gray-600 cursor-default select-none">
                        <div className="flex items-center gap-3 cursor-default select-none">
                          <HiOutlineDocumentText className="w-5 h-5 text-primary" />
                          <div>
                            <div className="font-semibold text-xs text-gray-900 dark:text-white cursor-pointer hover:underline">Contract Agreement</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">2025-05-15 &bull; PDF &bull; 2.4 MB</div>
                          </div>
                        </div>
                        <div className="flex items-center justify-center space-x-1 cursor-default select-none">
                          <button className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 dark:text-gray-300 hover:border-primary hover:text-primary transition-colors bg-transparent dark:bg-gray-800 dark:hover:border-primary dark:hover:text-primary relative group cursor-pointer">
                            <HiOutlineEye className="h-4 w-4 transition-colors" />
                            <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-gray-200 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                              View
                            </span>
                          </button>
                          <button className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 dark:text-gray-300 hover:border-primary hover:text-primary transition-colors bg-transparent dark:bg-gray-800 dark:hover:border-primary dark:hover:text-primary relative group cursor-pointer">
                            <HiOutlineDownload className="h-4 w-4 transition-colors" />
                            <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-gray-200 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                              Download
                            </span>
                          </button>
                          <button className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 dark:text-gray-300 hover:border-red-500 hover:text-red-500 transition-colors bg-transparent dark:bg-gray-800 dark:hover:border-red-500 dark:hover:text-red-500 relative group cursor-pointer">
                            <HiOutlineTrash className="h-4 w-4 transition-colors" />
                            <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-gray-200 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                              Delete
                            </span>
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-3 border border-gray-200 dark:border-gray-600 cursor-default select-none">
                        <div className="flex items-center gap-3 cursor-default select-none">
                          <HiOutlineDocumentText className="w-5 h-5 text-primary" />
                          <div>
                            <div className="font-semibold text-xs text-gray-900 dark:text-white cursor-pointer hover:underline">Payment Schedule</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">2025-05-16 &bull; XLSX &bull; 1.8 MB</div>
                          </div>
                        </div>
                        <div className="flex items-center justify-center space-x-1 cursor-default select-none">
                          <button className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 dark:text-gray-300 hover:border-primary hover:text-primary transition-colors bg-transparent dark:bg-gray-800 dark:hover:border-primary dark:hover:text-primary relative group cursor-pointer">
                            <HiOutlineEye className="h-4 w-4 transition-colors" />
                            <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-gray-200 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                              View
                            </span>
                          </button>
                          <button className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 dark:text-gray-300 hover:border-primary hover:text-primary transition-colors bg-transparent dark:bg-gray-800 dark:hover:border-primary dark:hover:text-primary relative group cursor-pointer">
                            <HiOutlineDownload className="h-4 w-4 transition-colors" />
                            <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-gray-200 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                              Download
                            </span>
                          </button>
                          <button className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 dark:text-gray-300 hover:border-red-500 hover:text-red-500 transition-colors bg-transparent dark:bg-gray-800 dark:hover:border-red-500 dark:hover:text-red-500 relative group cursor-pointer">
                            <HiOutlineTrash className="h-4 w-4 transition-colors" />
                            <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-gray-200 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                              Delete
                            </span>
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-3 border border-gray-200 dark:border-gray-600 cursor-default select-none">
                        <div className="flex items-center gap-3 cursor-default select-none">
                          <HiOutlineDocumentText className="w-5 h-5 text-primary" />
                          <div>
                            <div className="font-semibold text-xs text-gray-900 dark:text-white cursor-pointer hover:underline">Terms and Conditions</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">2025-05-17 &bull; DOCX &bull; 1.2 MB</div>
                          </div>
                        </div>
                        <div className="flex items-center justify-center space-x-1 cursor-default select-none">
                          <button className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 dark:text-gray-300 hover:border-primary hover:text-primary transition-colors bg-transparent dark:bg-gray-800 dark:hover:border-primary dark:hover:text-primary relative group cursor-pointer">
                            <HiOutlineEye className="h-4 w-4 transition-colors" />
                            <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-gray-200 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                              View
                            </span>
                          </button>
                          <button className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 dark:text-gray-300 hover:border-primary hover:text-primary transition-colors bg-transparent dark:bg-gray-800 dark:hover:border-primary dark:hover:text-primary relative group cursor-pointer">
                            <HiOutlineDownload className="h-4 w-4 transition-colors" />
                            <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-gray-200 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                              Download
                            </span>
                          </button>
                          <button className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 dark:text-gray-300 hover:border-red-500 hover:text-red-500 transition-colors bg-transparent dark:bg-gray-800 dark:hover:border-red-500 dark:hover:text-red-500 relative group cursor-pointer">
                            <HiOutlineTrash className="h-4 w-4 transition-colors" />
                            <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-gray-200 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                              Delete
                            </span>
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-3 border border-gray-200 dark:border-gray-600 cursor-default select-none">
                        <div className="flex items-center gap-3 cursor-default select-none">
                          <HiOutlineDocumentText className="w-5 h-5 text-primary" />
                          <div>
                            <div className="font-semibold text-xs text-gray-900 dark:text-white cursor-pointer hover:underline">Meeting Notes</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">2025-05-18 &bull; DOCX &bull; 0.8 MB</div>
                          </div>
                        </div>
                        <div className="flex items-center justify-center space-x-1 cursor-default select-none">
                          <button className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 dark:text-gray-300 hover:border-primary hover:text-primary transition-colors bg-transparent dark:bg-gray-800 dark:hover:border-primary dark:hover:text-primary relative group cursor-pointer">
                            <HiOutlineEye className="h-4 w-4 transition-colors" />
                            <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-gray-200 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                              View
                            </span>
                          </button>
                          <button className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 dark:text-gray-300 hover:border-primary hover:text-primary transition-colors bg-transparent dark:bg-gray-800 dark:hover:border-primary dark:hover:text-primary relative group cursor-pointer">
                            <HiOutlineDownload className="h-4 w-4 transition-colors" />
                            <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-gray-200 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                              Download
                            </span>
                          </button>
                          <button className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 dark:text-gray-300 hover:border-red-500 hover:text-red-500 transition-colors bg-transparent dark:bg-gray-800 dark:hover:border-red-500 dark:hover:text-red-500 relative group cursor-pointer">
                            <HiOutlineTrash className="h-4 w-4 transition-colors" />
                            <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-gray-200 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                              Delete
                            </span>
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-3 border border-gray-200 dark:border-gray-600 cursor-default select-none">
                        <div className="flex items-center gap-3 cursor-default select-none">
                          <HiOutlineDocumentText className="w-5 h-5 text-primary" />
                          <div>
                            <div className="font-semibold text-xs text-gray-900 dark:text-white cursor-pointer hover:underline">Project Timeline</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">2025-05-19 &bull; XLSX &bull; 1.5 MB</div>
                          </div>
                        </div>
                        <div className="flex items-center justify-center space-x-1 cursor-default select-none">
                          <button className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 dark:text-gray-300 hover:border-primary hover:text-primary transition-colors bg-transparent dark:bg-gray-800 dark:hover:border-primary dark:hover:text-primary relative group cursor-pointer">
                            <HiOutlineEye className="h-4 w-4 transition-colors" />
                            <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-gray-200 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                              View
                            </span>
                          </button>
                          <button className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 dark:text-gray-300 hover:border-primary hover:text-primary transition-colors bg-transparent dark:bg-gray-800 dark:hover:border-primary dark:hover:text-primary relative group cursor-pointer">
                            <HiOutlineDownload className="h-4 w-4 transition-colors" />
                            <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-gray-200 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                              Download
                            </span>
                          </button>
                          <button className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 dark:text-gray-300 hover:border-red-500 hover:text-red-500 transition-colors bg-transparent dark:bg-gray-800 dark:hover:border-red-500 dark:hover:text-red-500 relative group cursor-pointer">
                            <HiOutlineTrash className="h-4 w-4 transition-colors" />
                            <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-gray-200 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                              Delete
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recent Activity Box */}
                  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 min-h-[300px] cursor-default select-none">
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
                  <div className="space-y-4 mb-4 max-h-[300px] overflow-y-auto pr-2 cursor-default select-none [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-white [&::-webkit-scrollbar-track]:dark:bg-gray-800 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:dark:bg-gray-600 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-gray-400 [&::-webkit-scrollbar-thumb:hover]:dark:bg-gray-500">
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
                                <BiCommentAdd className="w-5 h-5 text-gray-700 dark:text-white group-hover:text-primary transition-colors" />
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
              {uploadContractId && (
                <span>
                  For Task: <span className="font-semibold text-primary">#{uploadContractId}</span>
                </span>
              )}
            </div>
            <form
              className="p-0"
              onSubmit={e => {
                e.preventDefault();
                setShowUploadModal(false);
                setUploadModalFiles([]);
              }}
            >
              <div className="flex flex-col gap-4 mb-4">
                {/* File Source - Left Column Width with Empty Right Column */}
                <div className="flex gap-4">
                  <div className="flex-1 w-0">
                    <div className="text-gray-500 dark:text-gray-400 text-xs mb-1" style={{ fontFamily: 'Avenir, sans-serif' }}>File Source</div>
                    <div className="relative" ref={uploadDropdownRef}>
                      <button
                        type="button"
                        onClick={e => { e.stopPropagation(); setShowUploadDropdown(!showUploadDropdown); }}
                        className="w-full h-[34px] px-4 rounded-lg border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-xs focus:ring-0 focus:ring-primary focus:border-primary transition-colors flex items-center justify-end relative cursor-pointer"
                        style={{ fontFamily: 'Avenir, sans-serif' }}
                      >
                        {selectedUploadSource ? (
                          <span className="flex items-center gap-2 absolute left-4 cursor-default select-none">
                            {selectedUploadSource === 'Desktop' && <TbDeviceDesktopPlus className="text-base text-primary" />}
                            {selectedUploadSource === 'Box' && <SiBox className="text-base text-primary" />}
                            {selectedUploadSource === 'Dropbox' && <SlSocialDropbox className="text-base text-primary" />}
                            {selectedUploadSource === 'Google Drive' && <TbBrandGoogleDrive className="text-base text-primary" />}
                            {selectedUploadSource === 'OneDrive' && <TbBrandOnedrive className="text-base text-primary" />}
                            <span className="text-xs text-gray-900 cursor-default select-none">{selectedUploadSource}</span>
                          </span>
                        ) : (
                          <span className="absolute left-4 text-xs text-gray-400 cursor-default select-none">Choose a source...</span>
                        )}
                        <HiChevronDown className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      </button>
                      {showUploadDropdown && (
                        <div className="absolute z-50 mt-1 w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 cursor-default select-none">
                          <div className="py-2">
                            <label htmlFor="upload-modal-file-upload" className="block px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 cursor-pointer select-none" onClick={() => { setSelectedUploadSource('Desktop'); setShowUploadDropdown(false); }}>
                              <div className="flex items-center gap-2">
                                <TbDeviceDesktopPlus className="text-base text-primary" />
                                <span className="text-xs cursor-default select-none">Desktop</span>
                              </div>
                            </label>
                            <button className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 text-gray-700 dark:text-gray-300 cursor-pointer select-none" onClick={() => { setSelectedUploadSource('Box'); setShowUploadDropdown(false); }}>
                              <SiBox className="text-base text-primary" />
                              <span className="text-xs cursor-default select-none">Box</span>
                            </button>
                            <button className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 text-gray-700 dark:text-gray-300 cursor-pointer select-none" onClick={() => { setSelectedUploadSource('Dropbox'); setShowUploadDropdown(false); }}>
                              <SlSocialDropbox className="text-base text-primary" />
                              <span className="text-xs cursor-default select-none">Dropbox</span>
                            </button>
                            <button className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 text-gray-700 dark:text-gray-300 cursor-pointer select-none" onClick={() => { setSelectedUploadSource('Google Drive'); setShowUploadDropdown(false); }}>
                              <TbBrandGoogleDrive className="text-base text-primary" />
                              <span className="text-xs cursor-default select-none">Google Drive</span>
                            </button>
                            <button className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 text-gray-700 dark:text-gray-300 cursor-pointer select-none" onClick={() => { setSelectedUploadSource('OneDrive'); setShowUploadDropdown(false); }}>
                              <TbBrandOnedrive className="text-base text-primary" />
                              <span className="text-xs cursor-default select-none">OneDrive</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex-1 w-0">
                    {/* Empty right column */}
                  </div>
                </div>

                {/* Document Name and Assignee - Side by Side */}
                <div className="flex gap-4">
                  <div className="flex-1 w-0">
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1" style={{ fontFamily: 'Avenir, sans-serif' }}>Document Name</label>
                    <input
                      type="text"
                      placeholder="Enter document name..."
                      className="w-full h-[34px] px-4 rounded-lg border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-xs focus:ring-2 focus:ring-primary focus:border-primary transition-colors cursor-text"
                      style={{ fontFamily: 'Avenir, sans-serif' }}
                    />
                  </div>
                  <div className="flex-1 w-0">
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1" style={{ fontFamily: 'Avenir, sans-serif' }}>Assignee</label>
                    <div className="relative" ref={uploadModalAssigneeDropdownRef}>
                      <input
                        ref={uploadModalAssigneeInputRef}
                        type="text"
                        className="w-full h-[34px] px-4 rounded-lg border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-xs focus:ring-2 focus:ring-primary focus:border-primary transition-colors cursor-text"
                        placeholder="Choose an assignee..."
                        value={uploadModalAssignee}
                        onChange={(e) => setUploadModalAssignee(e.target.value)}
                        onFocus={() => setShowUploadModalAssigneeDropdown(true)}
                        style={{ fontFamily: 'Avenir, sans-serif' }}
                        autoComplete="off"
                      />
                      {showUploadModalAssigneeDropdown && (
                        <div className="absolute left-0 right-0 mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 z-50 max-h-48 overflow-y-auto cursor-default select-none" style={{ fontFamily: 'Avenir, sans-serif' }}>
                          {uniqueAssignees.length > 0 ? (
                            <>
                              {uniqueAssignees.map((assignee: string) => (
                                <div
                                  key={assignee}
                                  className={`px-4 py-2 text-xs cursor-pointer ${uploadModalAssignee === assignee ? 'bg-primary/10 text-primary' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'} select-none`}
                                  onClick={() => {
                                    setUploadModalAssignee(assignee);
                                    setShowUploadModalAssigneeDropdown(false);
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
                                  setShowUploadModalAssigneeDropdown(false);
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
                                  setShowUploadModalAssigneeDropdown(false);
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
                </div>

                {/* Drag and Drop Area */}
                <div>
                  <label htmlFor="upload-modal-file-upload" className="block cursor-pointer">
                    <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 py-8 px-4 text-center transition hover:border-primary">
                      <HiOutlineUpload className="h-4 w-4 text-gray-400 mb-2" />
                      <div className="text-xs text-gray-700 dark:text-gray-300 font-medium">Click to upload or drag and drop</div>
                      <div className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">PDF, DOC, DOCX, or JPG (max. 10MB each)</div>
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
                  </label>
                  {uploadModalFiles.length > 0 && (
                    <ul className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                      {uploadModalFiles.map((file, idx) => (
                        <li key={idx} className="truncate">{file.name}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
              <div className="flex gap-1 mt-6">
                <button
                  type="button"
                  onClick={() => { setShowUploadModal(false); setUploadModalFiles([]); }}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-semibold"
                >
                  Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}