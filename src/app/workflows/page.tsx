'use client';

import React, { useRef } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { mockContracts } from '@/data/mockContracts';

// Icons
import { HiOutlineDocumentText, HiOutlineViewBoards } from 'react-icons/hi';
import { CgPlayPauseR, CgPlayStopR } from 'react-icons/cg';
import { BsPerson } from 'react-icons/bs';
import { LuCalendarClock } from 'react-icons/lu';
import { FaPlus, FaSearch, FaRetweet } from 'react-icons/fa';
import { PiListMagnifyingGlassBold, PiListPlusBold } from 'react-icons/pi';
import { FaRegSquareCheck } from 'react-icons/fa6';
import { BiDotsHorizontal } from 'react-icons/bi';

interface Task {
  id?: string;
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
}

// Add date formatting utilities
function formatDateToInput(dateStr: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '';
  return d.toISOString().slice(0, 10);
}
function formatDatePretty(dateStr: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function WorkflowsPage() {
  const [kanbanTab, setKanbanTab] = React.useState('Active Tasks');
  const kanbanTabs = ['All Tasks', 'Active Tasks', 'Upcoming'];
  const [taskSearchTerm, setTaskSearchTerm] = React.useState('');
  const [openMenuTask, setOpenMenuTask] = React.useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [selectedAssignee, setSelectedAssignee] = React.useState('All');
  const [selectedContract, setSelectedContract] = React.useState('All');
  const [selectedStatuses, setSelectedStatuses] = React.useState<string[]>([]);
  const [openAssigneeDropdown, setOpenAssigneeDropdown] = React.useState(false);
  const [openContractDropdown, setOpenContractDropdown] = React.useState(false);
  const [openStatusDropdown, setOpenStatusDropdown] = React.useState(false);
  const assigneeButtonRef = useRef<HTMLButtonElement>(null);
  const contractButtonRef = useRef<HTMLButtonElement>(null);
  const statusButtonRef = useRef<HTMLButtonElement>(null);
  const [openColumnMenu, setOpenColumnMenu] = React.useState<string | null>(null);
  const columnMenuRef = useRef<HTMLDivElement>(null);
  const [selectedTask, setSelectedTask] = React.useState<Task | null>(null);
  const [editedTaskTitle, setEditedTaskTitle] = React.useState(selectedTask?.title || '');
  const [editedContractTitle, setEditedContractTitle] = React.useState(
    mockContracts.find(c => c.id === selectedTask?.contractId)?.title || ''
  );
  const [editedDueDate, setEditedDueDate] = React.useState(selectedTask?.due || '');
  const [editedAssignee, setEditedAssignee] = React.useState(selectedTask?.assignee || '');

  // Define Kanban columns as a single source of truth
  const kanbanColumns = [
    {
      key: 'todo',
      title: 'To Do',
      color: 'bg-gray-100',
      icon: <PiListPlusBold className="text-xl mr-2 text-gray-500" />,
      tasks: [
        { code: 'TSK-003', title: 'Verify Payment Schedule', contractId: '9548', type: 'Task', due: 'May 24, 2025', progress: '0 of 2', assignee: 'Michael Brown', assigneeInitials: 'MB', assigneeColor: 'bg-purple-200 text-purple-700', taskNumber: 101 },
        { code: 'TSK-008', title: 'Negotiate Updated Terms', contractId: '9550', type: 'Task', due: 'May 29, 2025', progress: '0 of 3', assignee: 'Robert Green', assigneeInitials: 'RG', assigneeColor: 'bg-pink-200 text-pink-700', taskNumber: 102 },
        { code: 'TSK-009', title: 'Finalize Pricing Details', contractId: '9145', type: 'Task', due: 'May 30, 2025', progress: '1 of 4', assignee: 'Emily Davis', assigneeInitials: 'ED', assigneeColor: 'bg-blue-200 text-blue-700', taskNumber: 103 },
      ],
    },
    {
      key: 'blocked',
      title: 'Blocked',
      color: 'bg-red-100',
      icon: <CgPlayStopR className="text-xl mr-2 text-red-500" />,
      tasks: [
        { code: 'TSK-002', title: 'Obtain Client Signatures', contractId: '8784', type: 'Task', due: 'May 27, 2025', progress: '0 of 2', assignee: 'Sarah Miller', assigneeInitials: 'SM', assigneeColor: 'bg-purple-200 text-purple-700', taskNumber: 104 },
        { code: 'TSK-012', title: 'Third Party Risk Assessment', contractId: '8423', type: 'Task', due: 'June 3, 2025', progress: '0 of 5', assignee: 'Alex Johnson', assigneeInitials: 'AJ', assigneeColor: 'bg-pink-200 text-pink-700', taskNumber: 105 },
      ],
    },
    {
      key: 'onhold',
      title: 'On Hold',
      color: 'bg-orange-100',
      icon: <CgPlayPauseR className="text-xl mr-2 text-orange-500" />,
      tasks: [
        { code: 'TSK-005', title: 'Review Employment Terms', contractId: '7804', type: 'Task', due: 'May 23, 2025', progress: '1 of 3', assignee: 'Emily Davis', assigneeInitials: 'ED', assigneeColor: 'bg-blue-200 text-blue-700', taskNumber: 106 },
      ],
    },
    {
      key: 'inprogress',
      title: 'In Progress',
      color: 'bg-blue-100',
      icon: <FaRetweet className="text-xl mr-2 text-blue-500" />,
      tasks: [
        { code: 'TSK-001', title: 'Review Contract Terms', contractId: '7234', type: 'Task', due: 'May 25, 2025', progress: '2 of 3', assignee: 'Alex Johnson', assigneeInitials: 'AJ', assigneeColor: 'bg-pink-200 text-pink-700', taskNumber: 107 },
        { code: 'TSK-007', title: 'Legal Review of License Terms', contractId: '9102', type: 'Task', due: 'May 22, 2025', progress: '2 of 5', assignee: 'Jennifer White', assigneeInitials: 'JW', assigneeColor: 'bg-green-200 text-green-700', taskNumber: 108 },
        { code: 'TSK-011', title: 'Update Statement of Work', contractId: '6891', type: 'Task', due: 'May 28, 2025', progress: '1 of 4', assignee: 'Michael Brown', assigneeInitials: 'MB', assigneeColor: 'bg-purple-200 text-purple-700', taskNumber: 109 },
        { code: 'TSK-015', title: 'Coordinate Inspection', contractId: '6453', type: 'Task', due: 'June 1, 2025', progress: '0 of 2', assignee: 'Samantha Fox', assigneeInitials: 'SF', assigneeColor: 'bg-orange-200 text-orange-700', taskNumber: 113 },
        { code: 'TSK-016', title: 'Draft Addendum', contractId: '10001', type: 'Task', due: 'June 2, 2025', progress: '1 of 3', assignee: 'David Miller', assigneeInitials: 'DM', assigneeColor: 'bg-blue-200 text-blue-700', taskNumber: 114 },
        { code: 'TSK-017', title: 'Schedule Appraisal', contractId: '10002', type: 'Task', due: 'June 3, 2025', progress: '0 of 1', assignee: 'Alice Lee', assigneeInitials: 'AL', assigneeColor: 'bg-teal-200 text-teal-700', taskNumber: 115 },
        { code: 'TSK-018', title: 'Send Disclosures', contractId: '10003', type: 'Task', due: 'June 4, 2025', progress: '2 of 2', assignee: 'Robert Green', assigneeInitials: 'RG', assigneeColor: 'bg-pink-200 text-pink-700', taskNumber: 116 },
        { code: 'TSK-019', title: 'Confirm Title Insurance', contractId: '10004', type: 'Task', due: 'June 5, 2025', progress: '1 of 1', assignee: 'Sarah Miller', assigneeInitials: 'SM', assigneeColor: 'bg-green-200 text-green-700', taskNumber: 117 },
        { code: 'TSK-020', title: 'Finalize Closing Statement', contractId: '10005', type: 'Task', due: 'June 6, 2025', progress: '0 of 4', assignee: 'Emily Davis', assigneeInitials: 'ED', assigneeColor: 'bg-blue-200 text-blue-700', taskNumber: 118 },
      ],
    },
    {
      key: 'inreview',
      title: 'In Review',
      color: 'bg-yellow-100',
      icon: <PiListMagnifyingGlassBold className="text-xl mr-2 text-yellow-500" />,
      tasks: [
        { code: 'TSK-004', title: 'Final Document Verification', contractId: '10001', type: 'Task', due: 'May 26, 2025', progress: '2 of 3', assignee: 'Alex Johnson', assigneeInitials: 'AJ', assigneeColor: 'bg-pink-200 text-pink-700', taskNumber: 110 },
      ],
    },
    {
      key: 'done',
      title: 'Done',
      color: 'bg-green-100',
      icon: <FaRegSquareCheck className="text-xl mr-2 text-green-600" />,
      tasks: [
        { code: 'TSK-013', title: 'Archive Completed Files', contractId: '10005', type: 'Task', due: 'May 20, 2025', progress: '5 of 5', assignee: 'Sarah Miller', assigneeInitials: 'SM', assigneeColor: 'bg-green-200 text-green-700', taskNumber: 111 },
        { code: 'TSK-014', title: 'Send Completion Notice', contractId: '10002', type: 'Task', due: 'May 19, 2025', progress: '3 of 3', assignee: 'Robert Green', assigneeInitials: 'RG', assigneeColor: 'bg-green-200 text-green-700', taskNumber: 112 },
      ],
    },
  ];

  // Kanban state for drag-and-drop
  const [kanbanState, setKanbanState] = React.useState(kanbanColumns);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        (openMenuTask && menuRef.current && !menuRef.current.contains(event.target as Node)) ||
        (openAssigneeDropdown && assigneeButtonRef.current && !assigneeButtonRef.current.contains(event.target as Node)) ||
        (openContractDropdown && contractButtonRef.current && !contractButtonRef.current.contains(event.target as Node)) ||
        (openStatusDropdown && statusButtonRef.current && !statusButtonRef.current.contains(event.target as Node)) ||
        (openColumnMenu && columnMenuRef.current && !columnMenuRef.current.contains(event.target as Node))
      ) {
        setOpenMenuTask(null);
        setOpenAssigneeDropdown(false);
        setOpenContractDropdown(false);
        setOpenStatusDropdown(false);
        setOpenColumnMenu(null);
      }
    }
    if (openMenuTask || openAssigneeDropdown || openContractDropdown || openStatusDropdown || openColumnMenu) {
      document.addEventListener('click', handleClickOutside);
    } else {
      document.removeEventListener('click', handleClickOutside);
    }
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [openMenuTask, openAssigneeDropdown, openContractDropdown, openStatusDropdown, openColumnMenu]);

  const allTasks = kanbanColumns.flatMap(col => col.tasks);
  const uniqueAssignees = Array.from(new Set(allTasks.map(t => t.assignee))).sort();

  // Add this after the uniqueAssignees constant
  const statusOptions = [
    { key: 'todo', title: 'To Do' },
    { key: 'blocked', title: 'Blocked' },
    { key: 'onhold', title: 'On Hold' },
    { key: 'inprogress', title: 'In Progress' },
    { key: 'inreview', title: 'In Review' },
    { key: 'done', title: 'Done' }
  ];

  // Helper to filter tasks in a column according to current filters
  function filterTasks(tasks: Task[]) {
    return tasks.filter(task => {
      let matches = true;
      if (selectedAssignee !== 'All') {
        matches = matches && (task.assignee || '').trim().toLowerCase() === selectedAssignee.trim().toLowerCase();
      }
      if (selectedContract !== 'All') {
        matches = matches && (String(task.contractId) === String(selectedContract));
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
    setKanbanState(prev => {
      const sourceColIdx = prev.findIndex(col => col.key === source.droppableId);
      const destColIdx = prev.findIndex(col => col.key === destination.droppableId);
      if (sourceColIdx === -1 || destColIdx === -1) return prev;
      const sourceCol = { ...prev[sourceColIdx], tasks: [...prev[sourceColIdx].tasks] };
      const destCol = sourceColIdx === destColIdx ? sourceCol : { ...prev[destColIdx], tasks: [...prev[destColIdx].tasks] };
      const [movedTask] = sourceCol.tasks.splice(source.index, 1);
      destCol.tasks.splice(destination.index, 0, movedTask);
      const newState = [...prev];
      newState[sourceColIdx] = sourceCol;
      newState[destColIdx] = destCol;
      return newState;
    });
  }

  React.useEffect(() => {
    setEditedTaskTitle(selectedTask?.title || '');
    setEditedContractTitle(mockContracts.find(c => c.id === selectedTask?.contractId)?.title || '');
    setEditedDueDate(formatDateToInput(selectedTask?.due || ''));
    setEditedAssignee(selectedTask?.assignee || '');
  }, [selectedTask]);

  return (
    <div className="space-y-4">
      {/* Workflow Title and Button */}
      <div className="flex justify-between items-center">
        {/* Group title and subtitle with controlled spacing */}
        <div className="pb-1">
          <h1 className="text-[30px] font-bold text-black mb-1">Tasks</h1>
          <p className="text-gray-500 text-[16px] mt-0">Track &amp; manage your activity</p>
        </div>
        <button className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-semibold">
          <FaPlus className="mr-2 text-base" />
          New Task
        </button>
      </div>

      <hr className="my-6 border-gray-300" />

      {/* Workflow Stats and Filters Section */}
      <div className="space-y-4">
        {/* Tabs */}
        <div className="bg-white border border-gray-200 rounded-xl px-4 py-4 flex gap-1 w-fit">
          {kanbanTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setKanbanTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-medium border border-gray-200 transition-colors font-sans min-w-[120px] ${kanbanTab === tab ? 'bg-teal-50 text-teal-500' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
            >
              {tab}
            </button>
          ))}
        </div>
        {/* Stat Cards */}
        <div className="flex gap-6 mb-6 mt-4">
          {/* Tasks in Progress */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 flex items-center gap-4 shadow-sm h-full flex-1 min-w-[200px]">
            <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center border-2 border-blue-200">
              <FaRetweet size={18} color="#3b82f6" />
            </div>
            <div className="flex flex-col items-start h-full">
              <p className="text-sm font-medium text-gray-500 mb-1 font-sans">Tasks in Progress</p>
              <p className="text-2xl font-bold text-gray-900">{kanbanState.find(col => col.key === 'inprogress')?.tasks.length || 0}</p>
              <p className="text-xs invisible">placeholder</p>
            </div>
          </div>
          {/* Due Within 7 Days */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 flex items-center gap-4 shadow-sm h-full flex-1 min-w-[200px]">
            <div className="h-10 w-10 rounded-lg bg-yellow-100 flex items-center justify-center border-2 border-yellow-200">
              <LuCalendarClock size={18} color="#f59e42" />
            </div>
            <div className="flex flex-col items-start h-full">
              <p className="text-sm font-medium text-gray-500 mb-1 font-sans">Due Within 7 Days</p>
              <p className="text-2xl font-bold text-gray-900">5</p>
              <p className="text-xs text-gray-400">Needs attention</p>
            </div>
          </div>
          {/* Blocked Tasks */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 flex items-center gap-4 shadow-sm h-full flex-1 min-w-[200px]">
            <div className="h-10 w-10 rounded-lg bg-red-100 flex items-center justify-center border-2 border-red-200">
              <CgPlayStopR size={18} color="#ef4444" />
            </div>
            <div className="flex flex-col items-start h-full">
              <p className="text-sm font-medium text-gray-500 mb-1 font-sans">Blocked Tasks</p>
              <p className="text-2xl font-bold text-gray-900">{kanbanState.find(col => col.key === 'blocked')?.tasks.length || 0}</p>
              <p className="text-xs text-gray-400">Requires action</p>
            </div>
          </div>
        </div>
        {/* Filter Bar */}
        <div className="bg-white border border-gray-200 rounded-xl px-4 py-4 mb-6 flex items-center w-full mt-2">
          <div className="relative ml-1">
            <button
              ref={assigneeButtonRef}
              className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2 text-gray-700 font-medium text-xs min-w-[120px]"
              style={{ fontFamily: 'Avenir, sans-serif' }}
              onClick={() => { setOpenAssigneeDropdown(v => !v); setOpenContractDropdown(false); }}
            >
            <BsPerson className="text-gray-400 text-lg" />
            <span>Assignee</span>
            <span className="ml-1 text-gray-400">&#9662;</span>
          </button>
            {openAssigneeDropdown && (
              <div className="absolute left-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 z-50 py-2" style={{ minWidth: '180px', fontFamily: 'Avenir, sans-serif' }}>
                <button className={`w-full text-left px-4 py-2 text-xs font-medium ${selectedAssignee === 'All' ? 'bg-primary/10 text-primary' : 'text-gray-900 hover:bg-primary/10 hover:text-primary'}`} onClick={() => { setSelectedAssignee('All'); setOpenAssigneeDropdown(false); }}>All Assignees</button>
                {uniqueAssignees.map(assignee => (
                  <button key={assignee} className={`w-full text-left px-4 py-2 text-xs font-medium ${selectedAssignee === assignee ? 'bg-primary/10 text-primary' : 'text-gray-900 hover:bg-primary/10 hover:text-primary'}`} onClick={() => { setSelectedAssignee(assignee); setOpenAssigneeDropdown(false); }}>{assignee}</button>
                ))}
              </div>
            )}
          </div>
          <div className="relative ml-1">
            <button
              ref={contractButtonRef}
              className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2 text-gray-700 font-medium text-xs min-w-[120px]"
              style={{ fontFamily: 'Avenir, sans-serif' }}
              onClick={() => { setOpenContractDropdown(v => !v); setOpenAssigneeDropdown(false); }}
            >
            <HiOutlineDocumentText className="text-gray-400 text-lg" />
            <span>Contract</span>
            <span className="ml-1 text-gray-400">&#9662;</span>
          </button>
            {openContractDropdown && (
              <div className="absolute left-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-100 z-50 py-2 min-w-[400px] w-96" style={{ fontFamily: 'Avenir, sans-serif' }}>
                <button className={`w-full text-left px-4 py-2 text-xs font-medium ${selectedContract === 'All' ? 'bg-primary/10 text-primary' : 'text-gray-900 hover:bg-primary/10 hover:text-primary'}`} onClick={() => { setSelectedContract('All'); setOpenContractDropdown(false); }}>All Contracts</button>
                {mockContracts.map(contract => (
                  <button
                    key={contract.id}
                    className={`w-full text-left px-4 py-2 text-xs font-medium whitespace-nowrap truncate ${selectedContract === String(contract.id) ? 'bg-primary/10 text-primary' : 'text-gray-900 hover:bg-primary/10 hover:text-primary'}`}
                    onClick={() => {
                      console.log('Setting selectedContract to:', contract.id);
                      setSelectedContract(String(contract.id));
                      setOpenContractDropdown(false);
                    }}
                    style={{ width: '100%' }}
                  >
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
              <span className="ml-1 text-gray-400">&#9662;</span>
            </button>
            {openStatusDropdown && (
              <div className="absolute left-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 z-50 py-2" style={{ minWidth: '180px', fontFamily: 'Avenir, sans-serif' }}>
                {statusOptions.map(status => (
                  <button
                    key={status.key}
                    className={`w-full text-left px-4 py-2 text-xs font-medium flex items-center ${
                      selectedStatuses.includes(status.key) ? 'bg-primary/10 text-primary' : 'text-gray-900 hover:bg-primary/10 hover:text-primary'
                    }`}
                    onClick={() => {
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
                        <svg className="w-2 h-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
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
            {kanbanState
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
                          <div className="relative">
                            <button
                              className="border border-gray-300 rounded-md px-1 py-0.5 text-gray-700 hover:border-primary hover:text-primary transition-colors"
                              style={{ fontFamily: 'Avenir, sans-serif' }}
                              title="Column options"
                              onClick={e => {
                                e.stopPropagation();
                                setOpenColumnMenu(openColumnMenu === col.key ? null : col.key);
                              }}
                            >
                              <BiDotsHorizontal size={18} />
                            </button>
                            {openColumnMenu === col.key && (
                              <div
                                ref={columnMenuRef}
                                className="absolute right-0 -mt-[1px] w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50"
                                style={{
                                  fontFamily: 'Avenir, sans-serif',
                                  boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                                }}
                              >
                                <button className="w-full text-left px-4 py-2 text-xs font-medium text-gray-900 hover:bg-primary/10 hover:text-primary">Add Task</button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      {/* Scrollable Content */}
                      <div className="p-4 overflow-y-auto max-h-[calc(100vh-300px)]">
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
                                  onClick={() => setSelectedTask(task)}
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
                                  <div className="mb-2">
                                    <span className="text-[10px] font-bold bg-gray-100 text-gray-700 px-2 py-0.5 rounded border border-gray-200">
                                      Task #{task.taskNumber}
                                    </span>
                                    <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded border border-primary/20 ml-1">
                                      # {task.contractId}
                                    </span>
                                  </div>

                                  {/* Task Title */}
                                  <h3 className="text-sm font-medium text-gray-900 mb-2">{task.title}</h3>

                                  {/* Contract Info */}
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-bold text-primary">
                                      {mockContracts.find(c => c.id === task.contractId)?.title}
                                    </span>
                                    <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded border border-primary/20">
                                      {task.contractId}
                                    </span>
                                  </div>

                                  {/* Due Date */}
                                  <div className="flex items-center gap-1 mb-3">
                                    <LuCalendarClock className="text-gray-400 text-sm" />
                                    <span className="text-xs text-gray-500">{task.due}</span>
                                  </div>

                                  {/* Progress Section */}
                                  <div className="space-y-2 mb-3">
                                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                      <div
                                        className="h-full bg-primary rounded-full"
                                        style={{
                                          width: `${(parseInt(task.progress.split(' of ')[0]) / parseInt(task.progress.split(' of ')[1])) * 100}%`,
                                        }}
                                      />
                                    </div>
                                  </div>

                                  {/* Assignee and Progress */}
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-900">{task.assignee}</span>
                                    <span className="text-xs text-gray-900">{task.progress}</span>
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
            {kanbanState
              .filter(col => col.key !== 'done' && (selectedStatuses.length === 0 || selectedStatuses.includes(col.key)))
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
                          <div className="relative">
                            <button
                              className="border border-gray-300 rounded-md px-1 py-0.5 text-gray-700 hover:border-primary hover:text-primary transition-colors"
                              style={{ fontFamily: 'Avenir, sans-serif' }}
                              title="Column options"
                              onClick={e => {
                                e.stopPropagation();
                                setOpenColumnMenu(openColumnMenu === col.key ? null : col.key);
                              }}
                            >
                              <BiDotsHorizontal size={18} />
                            </button>
                            {openColumnMenu === col.key && (
                              <div
                                ref={columnMenuRef}
                                className="absolute right-0 -mt-[1px] w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50"
                                style={{
                                  fontFamily: 'Avenir, sans-serif',
                                  boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                                }}
                              >
                                <button className="w-full text-left px-4 py-2 text-xs font-medium text-gray-900 hover:bg-primary/10 hover:text-primary">Add Task</button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      {/* Scrollable Content */}
                      <div className="p-4 overflow-y-auto max-h-[calc(100vh-300px)]">
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
                                  onClick={() => setSelectedTask(task)}
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
                                  <div className="mb-2">
                                    <span className="text-[10px] font-bold bg-gray-100 text-gray-700 px-2 py-0.5 rounded border border-gray-200">
                                      Task #{task.taskNumber}
                                    </span>
                                    <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded border border-primary/20 ml-1">
                                      # {task.contractId}
                                    </span>
                                  </div>

                                  {/* Task Title */}
                                  <h3 className="text-sm font-medium text-gray-900 mb-2">{task.title}</h3>

                                  {/* Contract Info */}
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-bold text-primary">
                                      {mockContracts.find(c => c.id === task.contractId)?.title}
                                    </span>
                                    <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded border border-primary/20">
                                      {task.contractId}
                                    </span>
                                  </div>

                                  {/* Due Date */}
                                  <div className="flex items-center gap-1 mb-3">
                                    <LuCalendarClock className="text-gray-400 text-sm" />
                                    <span className="text-xs text-gray-500">{task.due}</span>
                                  </div>

                                  {/* Progress Section */}
                                  <div className="space-y-2 mb-3">
                                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                      <div
                                        className="h-full bg-primary rounded-full"
                                        style={{
                                          width: `${(parseInt(task.progress.split(' of ')[0]) / parseInt(task.progress.split(' of ')[1])) * 100}%`,
                                        }}
                                      />
                                    </div>
                                  </div>

                                  {/* Assignee and Progress */}
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-900">{task.assignee}</span>
                                    <span className="text-xs text-gray-900">{task.progress}</span>
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
      {kanbanTab === 'Completed' && (
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex flex-grow overflow-x-auto space-x-6 p-4 rounded-lg">
            {kanbanState
              .filter(col => col.key === 'done' && (selectedStatuses.length === 0 || selectedStatuses.includes(col.key)))
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
                          <div className="relative">
                            <button
                              className="border border-gray-300 rounded-md px-1 py-0.5 text-gray-700 hover:border-primary hover:text-primary transition-colors"
                              style={{ fontFamily: 'Avenir, sans-serif' }}
                              title="Column options"
                              onClick={e => {
                                e.stopPropagation();
                                setOpenColumnMenu(openColumnMenu === col.key ? null : col.key);
                              }}
                            >
                              <BiDotsHorizontal size={18} />
                            </button>
                            {openColumnMenu === col.key && (
                              <div
                                ref={columnMenuRef}
                                className="absolute right-0 -mt-[1px] w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50"
                                style={{
                                  fontFamily: 'Avenir, sans-serif',
                                  boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                                }}
                              >
                                <button className="w-full text-left px-4 py-2 text-xs font-medium text-gray-900 hover:bg-primary/10 hover:text-primary">Add Task</button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      {/* Scrollable Content */}
                      <div className="p-4 overflow-y-auto max-h-[calc(100vh-300px)]">
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
                                  onClick={() => setSelectedTask(task)}
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
                                  <div className="mb-2">
                                    <span className="text-[10px] font-bold bg-gray-100 text-gray-700 px-2 py-0.5 rounded border border-gray-200">
                                      Task #{task.taskNumber}
                                    </span>
                                    <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded border border-primary/20 ml-1">
                                      # {task.contractId}
                                    </span>
                                  </div>

                                  {/* Task Title */}
                                  <h3 className="text-sm font-medium text-gray-900 mb-2">{task.title}</h3>

                                  {/* Contract Info */}
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-bold text-primary">
                                      {mockContracts.find(c => c.id === task.contractId)?.title}
                                    </span>
                                    <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded border border-primary/20">
                                      {task.contractId}
                                    </span>
                                  </div>

                                  {/* Due Date */}
                                  <div className="flex items-center gap-1 mb-3">
                                    <LuCalendarClock className="text-gray-400 text-sm" />
                                    <span className="text-xs text-gray-500">{task.due}</span>
                                  </div>

                                  {/* Progress Section */}
                                  <div className="space-y-2 mb-3">
                                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                      <div
                                        className="h-full bg-primary rounded-full"
                                        style={{
                                          width: `${(parseInt(task.progress.split(' of ')[0]) / parseInt(task.progress.split(' of ')[1])) * 100}%`,
                                        }}
                                      />
                                    </div>
                                  </div>

                                  {/* Assignee and Progress */}
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-900">{task.assignee}</span>
                                    <span className="text-xs text-gray-900">{task.progress}</span>
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
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="text-sm font-semibold text-gray-900 mb-4">Task Details</h3>
                    {/* 3-row, 2-column layout */}
                    {/* Row 1: Task Title | Contract Title */}
                    <div className="grid grid-cols-2 gap-6 mb-4">
                      <div>
                        <div className="text-gray-500 text-xs mb-1" style={{ fontFamily: 'Avenir, sans-serif' }}>Task Title</div>
                        <input
                          type="text"
                          className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg text-xs font-medium text-gray-900 focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                          placeholder={selectedTask?.title || ''}
                          value={editedTaskTitle}
                          onChange={e => setEditedTaskTitle(e.target.value)}
                          style={{ fontFamily: 'Avenir, sans-serif' }}
                        />
                      </div>
                      <div>
                        <div className="text-gray-500 text-xs mb-1" style={{ fontFamily: 'Avenir, sans-serif' }}>Contract Title</div>
                        <input
                          type="text"
                          className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg text-xs font-medium text-gray-900 focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                          placeholder={mockContracts.find(c => c.id === selectedTask?.contractId)?.title || ''}
                          value={editedContractTitle}
                          onChange={e => setEditedContractTitle(e.target.value)}
                          style={{ fontFamily: 'Avenir, sans-serif' }}
                        />
                      </div>
                    </div>
                    {/* Row 2: Assignee | Status */}
                    <div className="grid grid-cols-2 gap-6 mb-4">
                      <div>
                        <div className="text-gray-500 text-xs mb-1" style={{ fontFamily: 'Avenir, sans-serif' }}>Assignee</div>
                        <div className="relative w-full">
                          <select
                            className="w-full px-4 pr-10 py-2 border-2 border-gray-200 rounded-lg text-xs font-medium text-gray-900 focus:ring-2 focus:ring-primary focus:border-primary transition-colors appearance-none"
                            value={editedAssignee}
                            onChange={e => setEditedAssignee(e.target.value)}
                            style={{ fontFamily: 'Avenir, sans-serif' }}
                          >
                            {uniqueAssignees.map(assignee => (
                              <option key={assignee} value={assignee}>{assignee}</option>
                            ))}
                          </select>
                          <svg className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-500 text-xs mb-1" style={{ fontFamily: 'Avenir, sans-serif' }}>Status</div>
                        <div className="relative w-full">
                          <select 
                            className="w-full text-xs font-medium text-gray-900 border-2 border-gray-200 rounded-lg px-3 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none"
                            value={kanbanState.find(col => col.tasks.some(t => t.code === selectedTask.code))?.key || 'todo'}
                            style={{ fontFamily: 'Avenir, sans-serif' }}
                          >
                            <option value="todo">To Do</option>
                            <option value="blocked">Blocked</option>
                            <option value="onhold">On Hold</option>
                            <option value="inprogress">In Progress</option>
                            <option value="inreview">In Review</option>
                            <option value="done">Done</option>
                          </select>
                          <svg className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    {/* Row 3: Due Date | Created Date + Last Updated */}
                    <div className="grid grid-cols-2 gap-6 mb-4">
                      <div>
                        <div className="text-gray-500 text-xs mb-1" style={{ fontFamily: 'Avenir, sans-serif' }}>Due Date</div>
                        <div className="relative w-full flex items-center">
                          <input
                            type="date"
                            className="w-full pl-3 pr-2 py-2 border-2 border-gray-200 rounded-lg text-xs font-medium text-gray-900 focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                            value={editedDueDate}
                            placeholder={selectedTask?.due ? formatDateToInput(selectedTask.due) : ''}
                            onChange={e => setEditedDueDate(e.target.value)}
                            style={{ fontFamily: 'Avenir, sans-serif' }}
                          />
                          {/* Show pretty date as overlay if input is empty */}
                          {!editedDueDate && selectedTask?.due && (
                            <span className="absolute left-3 text-xs text-gray-500 pointer-events-none select-none">
                              {selectedTask.due}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-end gap-32 w-full">
                        <div>
                          <div className="text-gray-500 text-xs mb-1" style={{ fontFamily: 'Avenir, sans-serif' }}>Created Date</div>
                          <div className="text-xs font-medium text-gray-900" style={{ fontFamily: 'Avenir, sans-serif' }}>
                            2024-05-01
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-500 text-xs mb-1" style={{ fontFamily: 'Avenir, sans-serif' }}>Last Updated</div>
                          <div className="text-xs font-medium text-gray-900" style={{ fontFamily: 'Avenir, sans-serif' }}>
                            2024-05-02
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contract Info Box */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="text-sm font-semibold text-gray-900 mb-4">Contract Information</h3>
                    <div className="grid grid-cols-1 gap-4">
                      {/* Contract Title */}
                      <div>
                        <div className="text-gray-500 text-xs mb-1">Contract Title</div>
                        <div className="text-sm font-medium text-primary">
                          {mockContracts.find(c => c.id === selectedTask.contractId)?.title}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Assignee Box */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="text-sm font-semibold text-gray-900 mb-4">Assignee Information</h3>
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${selectedTask.assigneeColor}`}>
                        <span className="text-sm font-medium">{selectedTask.assigneeInitials}</span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{selectedTask.assignee}</div>
                        <div className="text-xs text-gray-500">Assigned to this task</div>
                      </div>
                    </div>
                  </div>

                  {/* Progress Box */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="text-sm font-semibold text-gray-900 mb-4">Progress Tracking</h3>
                    <div className="space-y-4">
                      {/* Progress Bar */}
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{
                            width: `${(parseInt(selectedTask.progress.split(' of ')[0]) / parseInt(selectedTask.progress.split(' of ')[1])) * 100}%`,
                          }}
                        />
                      </div>
                      {/* Progress Text */}
                      <div className="text-sm text-gray-900">
                        {selectedTask.progress} steps completed
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