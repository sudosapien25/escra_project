'use client';
import React, { useRef, useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { mockContracts } from '@/data/mockContracts';
import { Task } from '@/types/task';

// Icons
import { HiOutlineDocumentText, HiOutlineViewBoards, HiOutlineUpload, HiOutlineEye, HiOutlineDownload, HiOutlineTrash, HiPlus, HiChevronDown } from 'react-icons/hi';
import { CgPlayPauseR, CgPlayStopR } from 'react-icons/cg';
import { BsPerson } from 'react-icons/bs';
import { LuCalendarClock, LuSendHorizontal } from 'react-icons/lu';
import { FaPlus, FaSearch, FaRetweet } from 'react-icons/fa';
import { PiListMagnifyingGlassBold, PiListPlusBold, PiDotsThreeOutline } from 'react-icons/pi';
import { FaRegSquareCheck } from 'react-icons/fa6';
import { BiDotsHorizontal } from 'react-icons/bi';
import { MdCancelPresentation } from 'react-icons/md';
import { MdOutlineLightMode, MdOutlineDarkMode } from 'react-icons/md';

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

export default function WorkflowsPage() {
  const [kanbanTab, setKanbanTab] = React.useState('All Tasks');
  const kanbanTabs = ['All Tasks', 'Active Tasks', 'Upcoming'];
  const [taskSearchTerm, setTaskSearchTerm] = React.useState('');
  const [openMenuTask, setOpenMenuTask] = React.useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [selectedAssignee, setSelectedAssignee] = React.useState('All');
  const [selectedContract, setSelectedContract] = React.useState('All');
  const [selectedStatuses, setSelectedStatuses] = React.useState<string[]>([]);
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
  const [editedContractTitle, setEditedContractTitle] = React.useState('');
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
  const [editingCommentId, setEditingCommentId] = React.useState<string | null>(null);
  const [showNewTaskModal, setShowNewTaskModal] = React.useState(false);
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
    { key: 'To Do' as const, title: 'To Do' },
    { key: 'Blocked' as const, title: 'Blocked' },
    { key: 'On Hold' as const, title: 'On Hold' },
    { key: 'In Progress' as const, title: 'In Progress' },
    { key: 'In Review' as const, title: 'In Review' },
    { key: 'Done' as const, title: 'Done' },
    { key: 'Canceled' as const, title: 'Canceled' }
  ];

  // Helper to filter tasks in a column according to current filters
  function filterTasks(tasks: Task[]) {
    return tasks.filter(task => {
      let matches = true;
      if (selectedAssignees.length > 0) {
        matches = matches && selectedAssignees.includes(task.assignee);
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
          ))
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
    setEditedContractTitle(mockContracts.find(c => c.id === selectedTask?.contractId)?.title || '');
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

  // Add this useEffect for the contract dropdown click-outside handler
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement;
      const dropdown = document.querySelector('.contract-dropdown');
      const button = contractButtonRef.current;

      // Only close if clicking outside both the dropdown and button
      if (openContractDropdown && 
          !dropdown?.contains(target) && 
          !button?.contains(target)) {
        setOpenContractDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openContractDropdown]);

  // Add this useEffect for the status filter dropdown click-outside handler
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement;
      const dropdown = document.querySelector('.status-filter-dropdown');
      const button = statusButtonRef.current;

      // Only close if clicking outside both the dropdown and button
      if (openStatusDropdown && 
          !dropdown?.contains(target) && 
          !button?.contains(target)) {
        setOpenStatusDropdown(false);
      }
    }

    if (openStatusDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openStatusDropdown]);

  // Add this useEffect for the assignee filter dropdown click-outside handler
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement;
      const dropdown = document.querySelector('.assignee-dropdown');
      const button = assigneeButtonRef.current;

      // Only close if clicking outside both the dropdown and button
      if (openAssigneeDropdown && 
          !dropdown?.contains(target) && 
          !button?.contains(target)) {
        setOpenAssigneeDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openAssigneeDropdown]);

  // Update the status change handler for the task details modal
  const handleTaskStatusChange = (status: typeof statusOptions[number]['key']) => {
    if (selectedTask) {
      moveTask(selectedTask.code, status);
      // Update the selected task's status in the modal
      setSelectedTask({ ...selectedTask, status });
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

  // Add debug logs for selectedTask and subtasks
  if (selectedTask) {
    console.log('Selected Task:', selectedTask);
    console.log('Selected Task Subtasks:', selectedTask.subtasks);
  }

  // Debug: Print all tasks from the store to check for subtasks
  console.log('All tasks from store:', tasks);

  // Add this useEffect for the status dropdown click-outside handler in task details modal
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement;
      const dropdown = document.querySelector('.status-dropdown');
      const input = document.querySelector('input[placeholder*="Status"]');

      // Only close if clicking outside both the dropdown and input
      if (showStatusDropdown && 
          !dropdown?.contains(target) && 
          !input?.contains(target)) {
        setShowStatusDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showStatusDropdown]);

  return (
    <div className="space-y-4">
      {/* Workflow Title and Button */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-[30px] font-bold text-black dark:text-white mb-1">Tasks</h1>
          <p className="text-gray-500 dark:text-gray-400 text-[16px] mt-0">Track &amp; manage your activity</p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowNewTaskModal(true)}
            className="flex items-center justify-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-semibold"
          >
            <FaPlus className="mr-2 text-base" />
            New Task
          </button>
        </div>
      </div>

      <hr className="my-6 border-gray-300 dark:border-gray-700" />

      {/* Workflow Stats and Filters Section */}
      <div className="space-y-4">
        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-4 flex gap-1 w-fit">
          {kanbanTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setKanbanTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-medium border border-gray-200 dark:border-gray-700 transition-colors font-sans min-w-[120px] ${
                kanbanTab === tab 
                  ? 'bg-teal-50 dark:bg-teal-900/30 text-teal-500 dark:text-teal-400' 
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Stat Cards */}
        <div className="flex gap-6 mb-6 mt-4">
          {/* Tasks in Progress */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 flex items-center gap-4 shadow-sm h-full flex-1 min-w-[200px]">
            <div className="h-10 w-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center border-2 border-blue-200 dark:border-blue-800">
              <FaRetweet size={18} className="text-blue-500 dark:text-blue-400" />
            </div>
            <div className="flex flex-col items-start h-full">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 font-sans">Tasks in Progress</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{kanbanColumns.find(col => col.key === 'In Progress')?.tasks.length || 0}</p>
              <p className="text-xs invisible">placeholder</p>
            </div>
          </div>

          {/* Due Within 7 Days */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 flex items-center gap-4 shadow-sm h-full flex-1 min-w-[200px]">
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
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 flex items-center gap-4 shadow-sm h-full flex-1 min-w-[200px]">
            <div className="h-10 w-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center border-2 border-red-200 dark:border-red-800">
              <CgPlayStopR size={18} className="text-red-500 dark:text-red-400" />
            </div>
            <div className="flex flex-col items-start h-full">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 font-sans">Blocked Tasks</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{kanbanColumns.find(col => col.key === 'Blocked')?.tasks.length || 0}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500">Requires action</p>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-4 mb-6 flex items-center w-full mt-2">
          <div className="relative ml-1">
            <button
              ref={assigneeButtonRef}
              className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2 text-gray-700 font-medium text-xs min-w-[120px]"
              style={{ fontFamily: 'Avenir, sans-serif' }}
              onClick={() => { setOpenAssigneeDropdown(v => !v); setOpenContractDropdown(false); }}
            >
              <BsPerson className="text-gray-400 text-lg" />
              <span>Assignee</span>
              <HiChevronDown className="text-gray-400 text-base" />
            </button>
            {openAssigneeDropdown && (
              <div className="absolute left-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 z-50 py-2 assignee-dropdown" style={{ minWidth: '180px', fontFamily: 'Avenir, sans-serif' }}>
                <button
                  className={`w-full text-left px-4 py-2 text-xs font-medium flex items-center ${
                    selectedAssignees.length === 0 ? 'bg-primary/10 text-primary' : 'text-gray-900 hover:bg-primary/10 hover:text-primary'
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedAssignees([]);
                  }}
                >
                  <div className={`w-3 h-3 rounded-sm mr-2 flex items-center justify-center ${selectedAssignees.length === 0 ? 'bg-primary' : 'border border-gray-300'}`}>
                    {selectedAssignees.length === 0 && (
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  All Assignees
                </button>
                {uniqueAssignees.map(assignee => (
                  <button
                    key={assignee}
                    className={`w-full text-left px-4 py-2 text-xs font-medium flex items-center ${
                      selectedAssignees.includes(assignee) ? 'bg-primary/10 text-primary' : 'text-gray-900 hover:bg-primary/10 hover:text-primary'
                    }`}
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
                    <div className={`w-3 h-3 rounded-sm mr-2 flex items-center justify-center ${selectedAssignees.includes(assignee) ? 'bg-primary' : 'border border-gray-300'}`}>
                      {selectedAssignees.includes(assignee) && (
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    {assignee}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="relative ml-1">
            <button
              ref={contractButtonRef}
              className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2 text-gray-700 font-medium text-xs min-w-[120px]"
              style={{ fontFamily: 'Avenir, sans-serif' }}
              onClick={() => setOpenContractDropdown(v => !v)}
            >
              <HiOutlineDocumentText className="text-gray-400 text-lg" />
              <span>Contract</span>
              <HiChevronDown className="text-gray-400 text-base" />
            </button>
            {openContractDropdown && (
              <div 
                className="absolute left-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-100 z-50 py-2 min-w-[400px] w-96 contract-dropdown" 
                style={{ fontFamily: 'Avenir, sans-serif' }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Search Bar */}
                <div className="px-4 py-2 border-b border-gray-100">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search contracts..."
                      value={contractSearch}
                      onChange={(e) => setContractSearch(e.target.value)}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg text-xs font-medium text-black focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                      style={{ fontFamily: 'Avenir, sans-serif' }}
                    />
                    <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                </div>

                <button
                  className={`w-full text-left px-4 py-2 text-xs font-medium flex items-center ${
                    selectedContracts.length === 0 ? 'bg-primary/10 text-primary' : 'text-gray-900 hover:bg-primary/10 hover:text-primary'
                  }`}
                  onClick={() => setSelectedContracts([])}
                >
                  <div className={`w-3 h-3 rounded-sm mr-2 flex items-center justify-center ${selectedContracts.length === 0 ? 'bg-primary' : 'border border-gray-300'}`}>
                    {selectedContracts.length === 0 && (
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  All Contracts
                </button>
                {mockContracts
                  .filter(contract => 
                    contract.id.toLowerCase().includes(contractSearch.toLowerCase()) ||
                    contract.title.toLowerCase().includes(contractSearch.toLowerCase())
                  )
                  .map(contract => (
                    <button
                      key={contract.id}
                      className={`w-full text-left px-4 py-2 text-xs font-medium flex items-center whitespace-nowrap truncate ${
                        selectedContracts.includes(String(contract.id)) ? 'bg-primary/10 text-primary' : 'text-gray-900 hover:bg-primary/10 hover:text-primary'
                      }`}
                      onClick={() => {
                        setSelectedContracts(prev => {
                          if (prev.includes(String(contract.id))) {
                            return prev.filter(c => c !== String(contract.id));
                          } else {
                            return [...prev, String(contract.id)];
                          }
                        });
                      }}
                    >
                      <div className={`w-3 h-3 rounded-sm mr-2 flex items-center justify-center ${selectedContracts.includes(String(contract.id)) ? 'bg-primary' : 'border border-gray-300'}`}>
                        {selectedContracts.includes(String(contract.id)) && (
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      {contract.id} - {contract.title}
                    </button>
                  ))}
              </div>
            )}
          </div>
          <div className="relative ml-1">
            <button
              ref={statusButtonRef}
              className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2 text-gray-700 font-medium text-xs min-w-[120px]"
              style={{ fontFamily: 'Avenir, sans-serif' }}
              onClick={() => { setOpenStatusDropdown(v => !v); setOpenAssigneeDropdown(false); setOpenContractDropdown(false); }}
            >
              <HiOutlineViewBoards className="text-gray-400 text-lg" />
              <span>Status</span>
              <HiChevronDown className="text-gray-400 text-base" />
            </button>
            {openStatusDropdown && (
              <div 
                className="absolute left-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 z-50 py-2 status-filter-dropdown" 
                style={{ minWidth: '180px', fontFamily: 'Avenir, sans-serif' }}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className={`w-full text-left px-4 py-2 text-xs font-medium flex items-center ${
                    selectedStatuses.length === 0 ? 'bg-primary/10 text-primary' : 'text-gray-900 hover:bg-primary/10 hover:text-primary'
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedStatuses([]);
                  }}
                >
                  <div className={`w-3 h-3 rounded-sm mr-2 flex items-center justify-center ${selectedStatuses.length === 0 ? 'bg-primary' : 'border border-gray-300'}`}>
                    {selectedStatuses.length === 0 && (
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  All Statuses
                </button>
                {statusOptions.map(status => (
                  <button
                    key={status.key}
                    className={`w-full text-left px-4 py-2 text-xs font-medium flex items-center ${
                      selectedStatuses.includes(status.key) ? 'bg-primary/10 text-primary' : 'text-gray-900 hover:bg-primary/10 hover:text-primary'
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSelectedStatuses(prev => {
                        if (prev.includes(status.key)) {
                          return prev.filter(s => s !== status.key);
                        } else {
                          return [...prev, status.key];
                        }
                      });
                    }}
                  >
                    <div className={`w-3 h-3 rounded-sm mr-2 flex items-center justify-center ${selectedStatuses.includes(status.key) ? 'bg-primary' : 'border border-gray-300'}`}>
                      {selectedStatuses.includes(status.key) && (
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    {status.title}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="flex items-center bg-white border border-gray-200 rounded-xl px-4 py-2 flex-1 ml-1" style={{ fontFamily: 'Avenir, sans-serif' }}>
            <FaSearch className="text-gray-400 mr-2 text-lg" />
            <input
              type="text"
              placeholder="Search contracts, tasks, or numbers"
              value={taskSearchTerm}
              onChange={e => setTaskSearchTerm(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none focus:ring-0 focus:outline-none text-xs text-gray-700 placeholder-gray-400 font-medium min-w-0"
            />
          </div>
        </div>
      </div>

      <hr className="my-6 border-gray-300" />

      {/* Kanban Board Section (filtered by tab) */}
      {kanbanTab === 'All Tasks' && (
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex flex-grow overflow-x-auto space-x-6 p-4 rounded-lg">
            {kanbanColumns
              .filter(col => selectedStatuses.length === 0 || selectedStatuses.includes(col.key))
              .map((col) => (
                <Droppable droppableId={col.key} key={col.key}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="flex-shrink-0 w-80 bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden"
                    >
                      {/* Sticky Header */}
                      <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
                        <div className={`flex items-center justify-between rounded-t-md py-2 px-4 text-lg font-semibold`}>
                          <div className="flex items-center">
                            {React.cloneElement(col.icon, { className: col.icon.props.className, style: { ...col.icon.props.style, color: col.icon.props.color }, color: col.icon.props.color })}
                            <h3 className="text-lg font-semibold ml-2" style={{ color: col.icon.props.color }}>{col.title}</h3>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 overflow-y-auto h-[600px]">
                        <div className="space-y-3">
                          {filterTasks(col.tasks).map((task, index) => (
                            <Draggable key={task.code} draggableId={task.code} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`bg-white rounded-lg border border-gray-200 p-4 shadow-sm transition-shadow relative ${
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
                                      className="border border-gray-300 rounded-md px-1 py-0.5 text-gray-700 hover:border-primary hover:text-primary transition-colors"
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
                                    <span className="text-[10px] font-bold bg-gray-100 text-gray-700 px-2 py-0.5 rounded border border-gray-200">
                                      Task #{task.taskNumber}
                                    </span>
                                    <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded border border-primary/20 ml-1">
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
      {kanbanTab === 'Active Tasks' && (
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex flex-grow overflow-x-auto space-x-6 p-4 rounded-lg">
            {kanbanColumns
              .filter(col => col.key !== 'Done' && col.key !== 'Canceled' && (selectedStatuses.length === 0 || selectedStatuses.includes(col.key)))
              .map((col) => (
                <Droppable droppableId={col.key} key={col.key}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="flex-shrink-0 w-80 bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden"
                    >
                      {/* Sticky Header */}
                      <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
                        <div className={`flex items-center justify-between rounded-t-md py-2 px-4 text-lg font-semibold`}>
                          <div className="flex items-center">
                            {React.cloneElement(col.icon, { className: col.icon.props.className, style: { ...col.icon.props.style, color: col.icon.props.color }, color: col.icon.props.color })}
                            <h3 className="text-lg font-semibold ml-2" style={{ color: col.icon.props.color }}>{col.title}</h3>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 overflow-y-auto h-[600px]">
                        <div className="space-y-3">
                          {filterTasks(col.tasks).map((task, index) => (
                            <Draggable key={task.code} draggableId={task.code} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`bg-white rounded-lg border border-gray-200 p-4 shadow-sm transition-shadow relative ${snapshot.isDragging ? 'shadow-lg' : ''}`}
                                  onClick={() => {
                                    const fullTask = tasks.find(t => t.code === task.code);
                                    setSelectedTask(fullTask || task);
                                  }}
                                >
                                  {/* Task Menu - Positioned at top right */}
                                  <div className="absolute top-3 right-3">
                                    <button
                                      className="border border-gray-300 rounded-md px-1 py-0.5 text-gray-700 hover:border-primary hover:text-primary transition-colors"
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
                                    <span className="text-[10px] font-bold bg-gray-100 text-gray-700 px-2 py-0.5 rounded border border-gray-200">
                                      Task #{task.taskNumber}
                                    </span>
                                    <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded border border-primary/20 ml-1">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="relative bg-white rounded-2xl shadow-2xl w-[calc(100%-1rem)] max-w-[1400px] mx-4 my-8 max-h-[90vh] flex flex-col overflow-hidden">
            {/* Sticky Header with Task ID and Close buttons */}
            <div className="sticky top-0 z-40 bg-white px-6 py-4">
              <div className="flex items-start justify-between">
                {/* Left: Task ID and Contract ID */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center mb-4">
                    <span className="text-[10px] font-bold bg-gray-100 text-gray-700 px-2 py-0.5 rounded border border-gray-200">
                      Task #{selectedTask.taskNumber}
                    </span>
                    <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded border border-primary/20 ml-1">
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
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Task Details Box */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6 min-h-[420px]">
                    <h3 className="text-sm font-semibold text-gray-900 mb-4">Task Details</h3>
                    {/* 3-row, 2-column layout */}
                    {/* Row 1: Task Title | Contract Title */}
                    <div className="grid grid-cols-2 gap-6 mb-4">
                      <div>
                        <div className="text-gray-500 text-xs mb-1" style={{ fontFamily: 'Avenir, sans-serif' }}>Task Title</div>
                        <input
                          type="text"
                          className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg text-xs font-medium text-black focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                          placeholder={selectedTask?.title || ''}
                          value={editedTaskTitle}
                          onChange={e => setEditedTaskTitle(e.target.value)}
                          style={{ fontFamily: 'Avenir, sans-serif' }}
                        />
                      </div>
                      <div style={{ position: 'relative' }} ref={contractDropdownRef}>
                        <div className="text-gray-500 text-xs mb-1" style={{ fontFamily: 'Avenir, sans-serif' }}>Contract</div>
                        <div className="w-full pl-0 pr-4 py-2 text-xs font-medium text-black" style={{ fontFamily: 'Avenir, sans-serif' }}>
                          {mockContracts.find(c => c.id === selectedTask?.contractId)?.title || ''}
                        </div>
                      </div>
                    </div>
                    {/* Row 2: Assignee | Status */}
                    <div className="grid grid-cols-2 gap-6 mb-4">
                      <div>
                        <div className="text-gray-500 text-xs mb-1" style={{ fontFamily: 'Avenir, sans-serif' }}>Assignee</div>
                        <div className="relative w-full" ref={assigneeDropdownRef}>
                          <input
                            type="text"
                            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg text-xs font-medium text-black focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                            placeholder={selectedTask?.assignee || ''}
                            value={editedAssignee}
                            onChange={e => setEditedAssignee(e.target.value)}
                            onFocus={() => setShowAssigneeDropdown(true)}
                            style={{ fontFamily: 'Avenir, sans-serif' }}
                            autoComplete="off"
                          />
                          {showAssigneeDropdown && (
                            <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto" style={{ fontFamily: 'Avenir, sans-serif' }}>
                              {uniqueAssignees.length > 0 ? (
                                uniqueAssignees.map(assignee => (
                                  <div
                                    key={assignee}
                                    className="px-4 py-2 text-xs cursor-pointer hover:bg-primary/10 hover:text-primary"
                                    onClick={() => {
                                      handleAssigneeChange(assignee);
                                    }}
                                  >
                                    {assignee}
                                  </div>
                                ))
                              ) : (
                                <div className="px-4 py-2 text-xs text-gray-400">No assignees found</div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-500 text-xs mb-1" style={{ fontFamily: 'Avenir, sans-serif' }}>Status</div>
                        <div className="relative w-full" ref={statusDropdownRef}>
                          <input
                            type="text"
                            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg text-xs font-medium text-black focus:ring-2 focus:ring-primary focus:border-primary transition-colors pr-10"
                            placeholder={kanbanColumns.find(col => col.tasks.some(t => t.code === selectedTask.code))?.title || 'To Do'}
                            value={kanbanColumns.find(col => col.tasks.some(t => t.code === selectedTask.code))?.title || 'To Do'}
                            onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                            readOnly
                            style={{ fontFamily: 'Avenir, sans-serif' }}
                          />
                          <HiChevronDown className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          {showStatusDropdown && (
                            <div className="absolute left-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 z-50 py-2 status-dropdown" style={{ minWidth: '180px', fontFamily: 'Avenir, sans-serif' }}>
                              {statusOptions.map(status => (
                                <button
                                  key={status.key}
                                  className={`w-full text-left px-4 py-2 text-xs font-medium ${
                                    selectedTask?.status === status.key ? 'bg-primary/10 text-primary' : 'text-gray-900 hover:bg-primary/10 hover:text-primary'
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
                    <div className="grid grid-cols-2 gap-6 mb-4">
                      {/* Due Date (left) */}
                      <div>
                        <div className="text-gray-500 text-xs mb-1" style={{ fontFamily: 'Avenir, sans-serif' }}>Due Date</div>
                        <div className="relative flex items-center" style={{ width: '115px', minWidth: '115px' }}>
                          <input
                            type="date"
                            className="pl-3 pr-2 py-2 border-2 border-gray-200 rounded-lg text-xs text-black focus:ring-2 focus:ring-primary focus:border-primary transition-colors w-full"
                            value={editedDueDate}
                            placeholder={selectedTask?.due ? formatDateToInput(selectedTask.due) : ''}
                            onChange={e => handleDueDateChange(e.target.value)}
                            style={{ fontFamily: 'Avenir, sans-serif' }}
                          />
                        </div>
                      </div>
                      {/* Created/Updated Dates (right) */}
                      <div>
                        <div className="flex gap-6">
                          <div>
                            <div className="text-gray-500 text-xs mb-1" style={{ fontFamily: 'Avenir, sans-serif' }}>Created Date</div>
                          </div>
                          <div style={{ marginLeft: '75px' }}>
                            <div className="text-gray-500 text-xs mb-1" style={{ fontFamily: 'Avenir, sans-serif' }}>Last Updated</div>
                          </div>
                        </div>
                        <div className="flex gap-6 mt-3">
                          <div style={{ width: '90px' }}>
                            <div className="text-xs text-black" style={{ fontFamily: 'Avenir, sans-serif' }}>
                              2024-05-01
                            </div>
                          </div>
                          <div style={{ width: '90px', marginLeft: '58px' }}>
                            <div className="text-xs text-black" style={{ fontFamily: 'Avenir, sans-serif' }}>
                              2024-05-02
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Description Field */}
                    <div className="mb-4">
                      <div className="text-gray-500 text-xs mb-1" style={{ fontFamily: 'Avenir, sans-serif' }}>Description</div>
                      <textarea
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg text-xs font-medium text-black focus:ring-2 focus:ring-primary focus:border-primary transition-colors resize-none"
                        rows={3}
                        placeholder="Enter task description..."
                        style={{ fontFamily: 'Avenir, sans-serif' }}
                      />
                    </div>
                  </div>

                  {/* Subtasks Box */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6 min-h-[336px]">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-semibold text-gray-900" style={{ fontFamily: 'Avenir, sans-serif' }}>Subtasks</span>
                      <button className="flex items-center gap-2 px-2 py-1 rounded-lg border border-gray-200 bg-gray-100 text-gray-700 font-semibold text-xs hover:bg-gray-200 transition-colors" style={{ fontFamily: 'Avenir, sans-serif' }}>
                        <span className="text-base font-bold text-primary">+</span> New Subtask
                      </button>
                    </div>
                    <div className="space-y-2">
                      {selectedTask?.subtasks?.map((subtask) => (
                        <div key={subtask.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                          <div className="flex-1">
                            <span className="text-xs font-medium text-gray-900">{subtask.title}</span>
                          </div>
                          <label className="relative flex items-center cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={subtask.completed}
                              onChange={() => {
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
                              }}
                              className="peer absolute opacity-0 w-5 h-5 cursor-pointer"
                              tabIndex={0}
                              aria-checked={subtask.completed}
                            />
                            <span
                              className={
                                `w-5 h-5 flex items-center justify-center rounded-md border transition-colors duration-150 ` +
                                (subtask.completed
                                  ? 'bg-primary border-primary'
                                  : 'bg-white border-gray-300 hover:border-primary')
                              }
                            >
                              {subtask.completed && (
                                <svg className="w-3 h-3" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M5 10.5L9 14.5L15 7.5" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              )}
                            </span>
                          </label>
                        </div>
                      ))}
                      {(!selectedTask?.subtasks || selectedTask.subtasks.length === 0) && (
                        <div className="text-center py-8 text-gray-500 text-sm">
                          No subtasks yet. Click "New Subtask" to add one.
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Documents Box */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6 min-h-[420px]">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-semibold text-gray-900">Documents</h3>
                      <button className="flex items-center gap-2 px-2 py-1 rounded-lg border border-gray-200 bg-gray-100 text-gray-700 font-semibold text-xs hover:bg-gray-200 transition-colors" style={{ fontFamily: 'Avenir, sans-serif' }}>
                        <span className="text-base font-bold text-primary">+</span> Upload
                      </button>
                    </div>
                    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                      <div className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3 border border-gray-100">
                        <div className="flex items-center gap-3">
                          <HiOutlineDocumentText className="w-5 h-5 text-primary" />
                          <div>
                            <div className="font-semibold text-xs text-black cursor-pointer hover:underline">Contract Agreement</div>
                            <div className="text-xs text-gray-500">2025-05-15 &bull; PDF &bull; 2.4 MB</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 hover:border-primary hover:text-primary transition-colors" title="View">
                            <HiOutlineEye className="h-4 w-4" />
                          </button>
                          <button className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 hover:border-primary hover:text-primary transition-colors" title="Download">
                            <HiOutlineDownload className="h-4 w-4" />
                          </button>
                          <button className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 hover:border-primary hover:text-primary transition-colors" title="Delete">
                            <HiOutlineTrash className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3 border border-gray-100">
                        <div className="flex items-center gap-3">
                          <HiOutlineDocumentText className="w-5 h-5 text-primary" />
                          <div>
                            <div className="font-semibold text-xs text-black cursor-pointer hover:underline">Payment Schedule</div>
                            <div className="text-xs text-gray-500">2025-05-16 &bull; XLSX &bull; 1.8 MB</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 hover:border-primary hover:text-primary transition-colors" title="View">
                            <HiOutlineEye className="h-4 w-4" />
                          </button>
                          <button className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 hover:border-primary hover:text-primary transition-colors" title="Download">
                            <HiOutlineDownload className="h-4 w-4" />
                          </button>
                          <button className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 hover:border-primary hover:text-primary transition-colors" title="Delete">
                            <HiOutlineTrash className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3 border border-gray-100">
                        <div className="flex items-center gap-3">
                          <HiOutlineDocumentText className="w-5 h-5 text-primary" />
                          <div>
                            <div className="font-semibold text-xs text-black cursor-pointer hover:underline">Terms and Conditions</div>
                            <div className="text-xs text-gray-500">2025-05-17 &bull; DOCX &bull; 1.2 MB</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 hover:border-primary hover:text-primary transition-colors" title="View">
                            <HiOutlineEye className="h-4 w-4" />
                          </button>
                          <button className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 hover:border-primary hover:text-primary transition-colors" title="Download">
                            <HiOutlineDownload className="h-4 w-4" />
                          </button>
                          <button className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 hover:border-primary hover:text-primary transition-colors" title="Delete">
                            <HiOutlineTrash className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3 border border-gray-100">
                        <div className="flex items-center gap-3">
                          <HiOutlineDocumentText className="w-5 h-5 text-primary" />
                          <div>
                            <div className="font-semibold text-xs text-black cursor-pointer hover:underline">Meeting Notes</div>
                            <div className="text-xs text-gray-500">2025-05-18 &bull; DOCX &bull; 0.8 MB</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 hover:border-primary hover:text-primary transition-colors" title="View">
                            <HiOutlineEye className="h-4 w-4" />
                          </button>
                          <button className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 hover:border-primary hover:text-primary transition-colors" title="Download">
                            <HiOutlineDownload className="h-4 w-4" />
                          </button>
                          <button className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 hover:border-primary hover:text-primary transition-colors" title="Delete">
                            <HiOutlineTrash className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3 border border-gray-100">
                        <div className="flex items-center gap-3">
                          <HiOutlineDocumentText className="w-5 h-5 text-primary" />
                          <div>
                            <div className="font-semibold text-xs text-black cursor-pointer hover:underline">Project Timeline</div>
                            <div className="text-xs text-gray-500">2025-05-19 &bull; XLSX &bull; 1.5 MB</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 hover:border-primary hover:text-primary transition-colors" title="View">
                            <HiOutlineEye className="h-4 w-4" />
                          </button>
                          <button className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 hover:border-primary hover:text-primary transition-colors" title="Download">
                            <HiOutlineDownload className="h-4 w-4" />
                          </button>
                          <button className="border border-gray-300 rounded-md px-1.5 py-1 text-gray-700 hover:border-primary hover:text-primary transition-colors" title="Delete">
                            <HiOutlineTrash className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recent Activity Box */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6 min-h-[300px]">
                    <h3 className="text-sm font-semibold text-gray-900 mb-4">Recent Activity</h3>
                    <div className="flex flex-col gap-5">
                      {/* Activity 1 */}
                      <div className="flex items-start gap-3">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100">
                          <BsPerson className="text-blue-500 text-lg" />
                        </span>
                        <div>
                          <div className="text-xs font-medium text-gray-900">
                            <span className="font-semibold">Sarah Miller</span> assigned task to <span className="font-semibold">Michael Brown</span>
                          </div>
                          <div className="text-xs text-gray-500 mt-0.5">May 19, 2025 at 10:30 AM</div>
                        </div>
                      </div>
                      {/* Activity 2 */}
                      <div className="flex items-start gap-3">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-100">
                          <BsPerson className="text-green-500 text-lg" />
                        </span>
                        <div>
                          <div className="text-xs font-medium text-gray-900">
                            <span className="font-semibold">Michael Brown</span> marked subtask as complete
                          </div>
                          <div className="text-xs text-gray-500 mt-0.5">May 18, 2025 at 3:45 PM</div>
                        </div>
                      </div>
                      {/* Activity 3 */}
                      <div className="flex items-start gap-3">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-purple-100">
                          <BsPerson className="text-purple-500 text-lg" />
                        </span>
                        <div>
                          <div className="text-xs font-medium text-gray-900">
                            <span className="font-semibold">Emily Davis</span> uploaded a document
                          </div>
                          <div className="text-xs text-gray-500 mt-0.5">May 17, 2025 at 9:15 AM</div>
                        </div>
                      </div>
                      {/* Activity 4 */}
                      <div className="flex items-start gap-3">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-orange-100">
                          <LuCalendarClock className="text-orange-500 text-lg" />
                        </span>
                        <div>
                          <div className="text-xs font-medium text-gray-900">
                            Due date updated to <span className="font-semibold">May 24, 2025</span>
                          </div>
                          <div className="text-xs text-gray-500 mt-0.5">May 16, 2025 at 11:20 AM</div>
                        </div>
                      </div>
                      {/* Activity 5 */}
                      <div className="flex items-start gap-3">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-teal-100">
                          <FaPlus className="text-teal-500 text-lg" />
                        </span>
                        <div>
                          <div className="text-xs font-medium text-gray-900">
                            Task created by <span className="font-semibold">Alex Johnson</span>
                          </div>
                          <div className="text-xs text-gray-500 mt-0.5">May 15, 2025 at 2:00 PM</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Comments Box - Full Width */}
              <div className="mt-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">Comments</h3>
                  
                  {/* Comment History */}
                  <div className="space-y-4 mb-4 max-h-[300px] overflow-y-auto pr-2">
                    {(selectedTask ? (taskComments[selectedTask.code] || []) : []).map((comment) => (
                      <div key={comment.id} className="flex items-start gap-3">
                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${comment.avatarColor}`}>
                          <BsPerson className={`${comment.textColor} text-lg`} />
                        </span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-semibold text-gray-900">{comment.author}</span>
                            <span className="text-xs text-gray-500">{comment.timestamp}</span>
                          </div>
                          <div 
                            className="text-xs text-gray-900 font-medium mb-2"
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
                            <div className="flex gap-2 mb-2 bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 items-center">
                              <button onClick={() => commentEditor.chain().focus().toggleBold().run()} className={`text-xs px-1 rounded ${commentEditor.isActive('bold') ? 'bg-primary/10 text-primary' : 'text-gray-700 hover:bg-gray-100'}`} title="Bold"><b>B</b></button>
                              <button onClick={() => commentEditor.chain().focus().toggleItalic().run()} className={`text-xs px-1 rounded ${commentEditor.isActive('italic') ? 'bg-primary/10 text-primary' : 'text-gray-700 hover:bg-gray-100'}`} title="Italic"><i>I</i></button>
                              <button onClick={() => commentEditor.chain().focus().toggleUnderline().run()} className={`text-xs px-1 rounded ${commentEditor.isActive('underline') ? 'bg-primary/10 text-primary' : 'text-gray-700 hover:bg-gray-100'}`} title="Underline"><u>U</u></button>
                              <button onClick={() => commentEditor.chain().focus().toggleStrike().run()} className={`text-xs px-1 rounded ${commentEditor.isActive('strike') ? 'bg-primary/10 text-primary' : 'text-gray-700 hover:bg-gray-100'}`} title="Strikethrough"><s>S</s></button>
                              <button onClick={() => commentEditor.chain().focus().toggleBulletList().run()} className={`text-xs px-1 rounded ${commentEditor.isActive('bulletList') ? 'bg-primary/10 text-primary' : 'text-gray-700 hover:bg-gray-100'}`} title="Bullet List">• List</button>
                              <button onClick={() => commentEditor.chain().focus().toggleOrderedList().run()} className={`text-xs px-1 rounded ${commentEditor.isActive('orderedList') ? 'bg-primary/10 text-primary' : 'text-gray-700 hover:bg-gray-100'}`} title="Numbered List">1. List</button>
                              <button onClick={handlePostComment} className="ml-auto text-xs px-2 py-1 rounded transition-colors flex items-center group" title={editingCommentId ? "Update Comment" : "Post Comment"}>
                                <LuSendHorizontal className="w-4 h-4 text-black group-hover:text-primary transition-colors" />
                              </button>
                              {editingCommentId && (
                                <button 
                                  onClick={() => {
                                    setEditingCommentId(null);
                                    commentEditor.commands.clearContent();
                                  }} 
                                  className="text-xs px-2 py-1 rounded text-gray-500 hover:text-red-500 transition-colors"
                                >
                                  Cancel
                                </button>
                              )}
                            </div>
                            <div className="border-2 border-gray-200 rounded-lg bg-white focus-within:border-primary transition-colors">
                              <EditorContent
                                editor={commentEditor}
                                className="tiptap min-h-[48px] px-4 py-2 text-xs font-medium text-black font-sans outline-none"
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
    </div>
  );
}