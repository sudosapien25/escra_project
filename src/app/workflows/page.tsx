'use client';

import React, { useRef } from 'react';
import { HiOutlineDocumentText, HiOutlineViewBoards } from 'react-icons/hi';
import { CgPlayPauseR } from 'react-icons/cg';
import { BsPerson } from 'react-icons/bs';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Card } from '@/components/common/Card';
import { LuCalendarClock } from 'react-icons/lu';
import { FaPlus, FaSearch, FaRetweet } from 'react-icons/fa';
import { PiListMagnifyingGlassBold, PiListPlusBold } from 'react-icons/pi';
import { FaRegSquareCheck } from 'react-icons/fa6';
import { ProgressBar } from '@/components/common/ProgressBar';
import { BiDotsHorizontal } from 'react-icons/bi';
import { mockContracts } from '@/data/mockContracts';
import { PageContentWrapper } from '@/components/layout/PageContentWrapper';
import { Button } from '@/components/common/Button';
import { DropdownMenu } from '@/components/common/DropdownMenu';
import { Avatar } from '@/components/common/Avatar';
import { Badge } from '@/components/common/Badge';
import { Tooltip } from '@/components/common/Tooltip';
import { Modal } from '@/components/common/Modal';
import { Input } from '@/components/common/Input';
import { Textarea } from '@/components/common/Textarea';
import { Select } from '@/components/common/Select';
import { HiOutlinePlus, HiOutlineDotsVertical, HiOutlineClock, HiOutlineUser, HiOutlineTag } from 'react-icons/hi';
import { FaCheckCircle, FaExclamationCircle, FaClock } from 'react-icons/fa';
import { MdOutlineDragIndicator } from 'react-icons/md';
import { FaFilter, FaCalendarAlt, FaSort, FaRetweet as FaRetweetIcon } from 'react-icons/fa';
import { FaPlus as FaPlusIcon } from 'react-icons/fa';
import { ProgressBar as ProgressBarComponent } from '@/components/common/ProgressBar';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  assignee?: string;
  dueDate?: string;
  priority: 'low' | 'medium' | 'high';
  tags: string[];
}

interface Column {
  id: string;
  title: string;
  tasks: Task[];
}

interface DragResult {
  draggableId: string;
  type: string;
  source: {
    droppableId: string;
    index: number;
  };
  destination?: {
    droppableId: string;
    index: number;
  };
}

export default function WorkflowsPage() {
  const [kanbanTab, setKanbanTab] = React.useState('Active Tasks');
  const kanbanTabs = ['All Tasks', 'Active Tasks', 'Upcoming', 'Completed'];
  const [taskSearchTerm, setTaskSearchTerm] = React.useState('');
  const [openMenuTask, setOpenMenuTask] = React.useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [selectedAssignee, setSelectedAssignee] = React.useState('All');
  const [selectedContract, setSelectedContract] = React.useState('All');
  const [openAssigneeDropdown, setOpenAssigneeDropdown] = React.useState(false);
  const [openContractDropdown, setOpenContractDropdown] = React.useState(false);
  const assigneeButtonRef = useRef<HTMLButtonElement>(null);
  const contractButtonRef = useRef<HTMLButtonElement>(null);
  const [openColumnMenu, setOpenColumnMenu] = React.useState<string | null>(null);
  const columnMenuRef = useRef<HTMLDivElement>(null);

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
      icon: <CgPlayPauseR className="text-xl mr-2 text-red-500" />,
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
      icon: <FaRetweetIcon className="text-xl mr-2 text-blue-500" />,
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
        (openColumnMenu && columnMenuRef.current && !columnMenuRef.current.contains(event.target as Node))
      ) {
        setOpenMenuTask(null);
        setOpenAssigneeDropdown(false);
        setOpenContractDropdown(false);
        setOpenColumnMenu(null);
      }
    }
    if (openMenuTask || openAssigneeDropdown || openContractDropdown || openColumnMenu) {
      document.addEventListener('click', handleClickOutside);
    } else {
      document.removeEventListener('click', handleClickOutside);
    }
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [openMenuTask, openAssigneeDropdown, openContractDropdown, openColumnMenu]);

  const allTasks = kanbanColumns.flatMap(col => col.tasks);
  const uniqueAssignees = Array.from(new Set(allTasks.map(t => t.assignee))).sort();
  const uniqueContracts = mockContracts;

  // Helper to filter tasks in a column according to current filters
  function filterTasks(tasks: any[]) {
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
      return !!matches;
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
          <FaPlusIcon className="mr-2 text-base" />
          New Task
        </button>
      </div>

      <hr className="my-6 border-gray-300" />

      {/* Workflow Stats and Filters Section */}
      <div className="space-y-4">
        {/* Tabs */}
        <div className="flex gap-1 mb-2">
          {kanbanTabs.map((tab, idx) => (
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
        <div className="flex gap-6 mb-8">
          {/* Tasks in Progress */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 flex items-center gap-4 shadow-sm h-full flex-1 min-w-[200px]">
            <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center border-2 border-blue-200">
              <FaRetweetIcon size={18} color="#3b82f6" />
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
              <CgPlayPauseR size={18} color="#ef4444" />
            </div>
            <div className="flex flex-col items-start h-full">
              <p className="text-sm font-medium text-gray-500 mb-1 font-sans">Blocked Tasks</p>
              <p className="text-2xl font-bold text-gray-900">{kanbanState.find(col => col.key === 'blocked')?.tasks.length || 0}</p>
              <p className="text-xs text-gray-400">Requires action</p>
            </div>
          </div>
        </div>
        {/* Filter Bar */}
        <div className="bg-white border border-gray-300 rounded-xl px-4 py-4 mb-6 flex items-center w-full mt-2">
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
          <button className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2 text-gray-700 font-medium text-xs min-w-[120px] ml-1" style={{ fontFamily: 'Avenir, sans-serif' }}>
            <HiOutlineViewBoards className="text-gray-400 text-lg" />
            <span>Status</span>
            <span className="ml-1 text-gray-400">&#9662;</span>
          </button>
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
      {kanbanTab === 'Active Tasks' && (
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex flex-grow overflow-x-auto space-x-6 p-4 rounded-lg">
            {/* Kanban Columns: show all except 'done' */}
            {kanbanState.filter(col => col.key !== 'done').map((col) => (
              <Droppable droppableId={col.key} key={col.key}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="flex-shrink-0 w-80 bg-white rounded-lg shadow-md p-4 border border-gray-200"
                  >
                    <div className={`flex items-center justify-between rounded-t-md py-2 px-4 text-lg font-semibold mb-4`}>
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
                            className="absolute z-50 bg-white rounded-xl shadow-lg border border-gray-100 py-2 overflow-y-auto"
                            style={{
                              width: '200px',
                              fontFamily: 'Avenir, sans-serif',
                              boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                              top: '28px',
                              right: 0,
                            }}
                          >
                            <button className="w-full text-left px-4 py-2 text-gray-900 text-xs font-medium transition-colors hover:bg-primary/10 hover:text-primary" onClick={() => setOpenColumnMenu(null)}>Move column to the left</button>
                            <button className="w-full text-left px-4 py-2 text-gray-900 text-xs font-medium transition-colors hover:bg-primary/10 hover:text-primary" onClick={() => setOpenColumnMenu(null)}>Move column to the right</button>
                            <button className="w-full text-left px-4 py-2 text-gray-900 text-xs font-medium transition-colors hover:bg-primary/10 hover:text-primary" onClick={() => setOpenColumnMenu(null)}>Set column limit</button>
                          </div>
                        )}
                      </div>
                    </div>
                    <div style={{ maxHeight: '520px', overflowY: 'auto' }} className="flex flex-col gap-y-4">
                      {filterTasks(col.tasks).map((task, idx) => {
                        // Parse progress string like '1 of 3'
                        const [completed, total] = (task.progress || '0 of 1').split(' of ').map(Number);
                        const percent = total > 0 ? (completed / total) * 100 : 0;
                        const contractObj = mockContracts.find(c => c.id === task.contractId);
                        return (
                          <Draggable draggableId={task.code} index={idx} key={task.code}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={{
                                  ...provided.draggableProps.style,
                                  boxShadow: snapshot.isDragging ? '0 4px 16px rgba(0,0,0,0.12)' : undefined,
                                }}
                              >
                                <Card key={task.code} className="p-4 rounded-xl border border-gray-300 relative">
                                  <div className="mb-2">
                                    <div className="flex w-full items-start justify-between">
                                      <span className="h-5 px-1.5 flex items-center justify-center rounded-lg bg-blue-100 text-blue-500 text-[11px] font-semibold border border-blue-200" style={{ minWidth: 24 }}>
                                        Task #{task.taskNumber}
                                      </span>
                                      <div className="relative">
                                        <button
                                          className="border border-gray-300 rounded-md px-1 py-0.5 text-gray-700 hover:border-primary hover:text-primary transition-colors"
                                          style={{ fontFamily: 'Avenir, sans-serif' }}
                                          title="More options"
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
                                            className="absolute z-50 bg-white rounded-xl shadow-lg border border-gray-100 py-2 overflow-y-auto"
                                            style={{
                                              width: '90%',
                                              maxWidth: '240px',
                                              minWidth: '180px',
                                              fontFamily: 'Avenir, sans-serif',
                                              boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                                              top: '28px',
                                              right: 'calc(100% + 4px)',
                                              maxHeight: '260px',
                                            }}
                                          >
                                            <button className="w-full text-left px-4 py-1.5 text-gray-900 rounded-t-xl text-xs font-medium transition-colors hover:bg-primary/10 hover:text-primary" style={{fontFamily: 'Avenir, sans-serif'}} onClick={() => setOpenMenuTask(null)}>View Details</button>
                                            <button className="w-full text-left px-4 py-1.5 text-gray-900 text-xs font-medium transition-colors hover:bg-primary/10 hover:text-primary" style={{fontFamily: 'Avenir, sans-serif'}} onClick={() => setOpenMenuTask(null)}>Mark Complete</button>
                                            <button className="w-full text-left px-4 py-1.5 text-gray-900 text-xs font-medium transition-colors hover:bg-primary/10 hover:text-primary" style={{fontFamily: 'Avenir, sans-serif'}} onClick={() => setOpenMenuTask(null)}>Reassign</button>
                                            <button className="w-full text-left px-4 py-1.5 text-gray-900 rounded-b-xl text-xs font-medium transition-colors hover:bg-red-50 hover:text-red-600" style={{fontFamily: 'Avenir, sans-serif'}} onClick={() => setOpenMenuTask(null)}>Delete</button>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                    <div className="h-2" />
                                    <div className="text-xs font-bold text-black whitespace-nowrap overflow-hidden text-ellipsis mt-2 p-0 m-0 leading-none" style={{ fontFamily: 'Avenir, sans-serif', marginTop: 0, padding: 0, lineHeight: 1 }}>
                                      {task.title}
                                    </div>
                                  </div>
                                  {/* Contract and Due Date Row (moved above progress bar) */}
                                  <div className="text-xs text-gray-700 flex flex-col gap-0.5 mb-1" style={{ fontFamily: 'Avenir, sans-serif' }}>
                                    <div className="flex items-center justify-between w-full mt-0 mb-0 p-0 m-0 leading-none" style={{ marginTop: 0, marginBottom: 0, padding: 0, lineHeight: 1 }}>
                                      <span className="text-black cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap">{contractObj?.title}</span>
                                      <span className="h-5 px-1.5 flex items-center justify-center rounded-lg bg-primary/10 text-primary text-[11px] font-semibold border border-primary/20 ml-2" style={{ minWidth: 24 }}>
                                        {contractObj?.id}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-1 mt-0.5 justify-between w-full">
                                      <div className="flex items-center gap-1">
                                        <LuCalendarClock className="text-gray-400 text-base" />
                                        <span className="text-xs text-gray-500">{task.due}</span>
                                      </div>
                                    </div>
                                    <div className="h-2" />
                                  </div>
                                  {/* Progress Bar Row */}
                                  <div className="mb-2">
                                    <ProgressBarComponent progress={percent} />
                                  </div>
                                  <div className="flex items-center justify-between mt-2">
                                    <div className="flex items-center gap-2">
                                      <BsPerson className="text-lg text-gray-400" />
                                      <span className="text-xs text-black">{task.assignee}</span>
                                    </div>
                                    <div className="text-xs font-bold text-black">{task.progress}</div>
                                  </div>
                                </Card>
                              </div>
                            )}
                          </Draggable>
                        );
                      })}
                      {provided.placeholder}
                    </div>
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </DragDropContext>
      )}
      {kanbanTab === 'Upcoming' && (
        <div className="flex flex-grow overflow-x-auto space-x-6 p-4 rounded-lg">
          {/* Placeholder: Upcoming Kanban */}
          <div className="text-gray-400 text-lg mx-auto my-12">Upcoming tasks kanban coming soon...</div>
        </div>
      )}
      {kanbanTab === 'Completed' && (
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex flex-grow overflow-x-auto space-x-6 p-4 rounded-lg">
            {/* Kanban Columns: show only 'done' */}
            {kanbanState.filter(col => col.key === 'done').map((col) => (
              <Droppable droppableId={col.key} key={col.key}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="flex-shrink-0 w-80 bg-white rounded-lg shadow-md p-4 border border-gray-200"
                  >
                    <div className={`flex items-center justify-between rounded-t-md py-2 px-4 text-lg font-semibold mb-4`}>
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
                            className="absolute z-50 bg-white rounded-xl shadow-lg border border-gray-100 py-2 overflow-y-auto"
                            style={{
                              width: '200px',
                              fontFamily: 'Avenir, sans-serif',
                              boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                              top: '28px',
                              right: 0,
                            }}
                          >
                            <button className="w-full text-left px-4 py-2 text-gray-900 text-xs font-medium transition-colors hover:bg-primary/10 hover:text-primary" onClick={() => setOpenColumnMenu(null)}>Move column to the left</button>
                            <button className="w-full text-left px-4 py-2 text-gray-900 text-xs font-medium transition-colors hover:bg-primary/10 hover:text-primary" onClick={() => setOpenColumnMenu(null)}>Move column to the right</button>
                            <button className="w-full text-left px-4 py-2 text-gray-900 text-xs font-medium transition-colors hover:bg-primary/10 hover:text-primary" onClick={() => setOpenColumnMenu(null)}>Set column limit</button>
                          </div>
                        )}
                      </div>
                    </div>
                    <div style={{ maxHeight: '520px', overflowY: 'auto' }} className="flex flex-col gap-y-4">
                      {filterTasks(col.tasks).map((task, idx) => {
                        // Parse progress string like '1 of 3'
                        const [completed, total] = (task.progress || '0 of 1').split(' of ').map(Number);
                        const percent = total > 0 ? (completed / total) * 100 : 0;
                        const contractObj = mockContracts.find(c => c.id === task.contractId);
                        return (
                          <Draggable draggableId={task.code} index={idx} key={task.code}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={{
                                  ...provided.draggableProps.style,
                                  boxShadow: snapshot.isDragging ? '0 4px 16px rgba(0,0,0,0.12)' : undefined,
                                }}
                              >
                                <Card key={task.code} className="p-4 rounded-xl border border-gray-300 relative">
                                  <div className="mb-2">
                                    <div className="flex w-full items-start justify-between">
                                      <span className="h-5 px-1.5 flex items-center justify-center rounded-lg bg-green-100 text-green-500 text-[11px] font-semibold border border-green-200" style={{ minWidth: 24 }}>
                                        Task #{task.taskNumber}
                                      </span>
                                      <div className="relative">
                                        <button
                                          className="border border-gray-300 rounded-md px-1 py-0.5 text-gray-700 hover:border-primary hover:text-primary transition-colors"
                                          style={{ fontFamily: 'Avenir, sans-serif' }}
                                          title="More options"
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
                                            className="absolute z-50 bg-white rounded-xl shadow-lg border border-gray-100 py-2 overflow-y-auto"
                                            style={{
                                              width: '90%',
                                              maxWidth: '240px',
                                              minWidth: '180px',
                                              fontFamily: 'Avenir, sans-serif',
                                              boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                                              top: '28px',
                                              right: 'calc(100% + 4px)',
                                              maxHeight: '260px',
                                            }}
                                          >
                                            <button className="w-full text-left px-4 py-1.5 text-gray-900 rounded-t-xl text-xs font-medium transition-colors hover:bg-primary/10 hover:text-primary" style={{fontFamily: 'Avenir, sans-serif'}} onClick={() => setOpenMenuTask(null)}>View Details</button>
                                            <button className="w-full text-left px-4 py-1.5 text-gray-900 text-xs font-medium transition-colors hover:bg-primary/10 hover:text-primary" style={{fontFamily: 'Avenir, sans-serif'}} onClick={() => setOpenMenuTask(null)}>Mark Complete</button>
                                            <button className="w-full text-left px-4 py-1.5 text-gray-900 text-xs font-medium transition-colors hover:bg-primary/10 hover:text-primary" style={{fontFamily: 'Avenir, sans-serif'}} onClick={() => setOpenMenuTask(null)}>Reassign</button>
                                            <button className="w-full text-left px-4 py-1.5 text-gray-900 rounded-b-xl text-xs font-medium transition-colors hover:bg-red-50 hover:text-red-600" style={{fontFamily: 'Avenir, sans-serif'}} onClick={() => setOpenMenuTask(null)}>Delete</button>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                    <div className="h-2" />
                                    <div className="text-xs font-bold text-black whitespace-nowrap overflow-hidden text-ellipsis mt-2 p-0 m-0 leading-none" style={{ fontFamily: 'Avenir, sans-serif', marginTop: 0, padding: 0, lineHeight: 1 }}>
                                      {task.title}
                                    </div>
                                  </div>
                                  {/* Contract and Due Date Row (moved above progress bar) */}
                                  <div className="text-xs text-gray-700 flex flex-col gap-0.5 mb-1" style={{ fontFamily: 'Avenir, sans-serif' }}>
                                    <div className="flex items-center justify-between w-full mt-0 mb-0 p-0 m-0 leading-none" style={{ marginTop: 0, marginBottom: 0, padding: 0, lineHeight: 1 }}>
                                      <span className="text-black cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap">{contractObj?.title}</span>
                                      <span className="h-5 px-1.5 flex items-center justify-center rounded-lg bg-primary/10 text-primary text-[11px] font-semibold border border-primary/20 ml-2" style={{ minWidth: 24 }}>
                                        {contractObj?.id}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-1 mt-0.5 justify-between w-full">
                                      <div className="flex items-center gap-1">
                                        <LuCalendarClock className="text-gray-400 text-base" />
                                        <span className="text-xs text-gray-500">{task.due}</span>
                                      </div>
                                    </div>
                                    <div className="h-2" />
                                  </div>
                                  {/* Progress Bar Row */}
                                  <div className="mb-2">
                                    <ProgressBarComponent progress={percent} />
                                  </div>
                                  <div className="flex items-center justify-between mt-2">
                                    <div className="flex items-center gap-2">
                                      <BsPerson className="text-lg text-gray-400" />
                                      <span className="text-xs text-black">{task.assignee}</span>
                                    </div>
                                    <div className="text-xs font-bold text-black">{task.progress}</div>
                                  </div>
                                </Card>
                              </div>
                            )}
                          </Draggable>
                        );
                      })}
                      {provided.placeholder}
                    </div>
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </DragDropContext>
      )}
      {kanbanTab === 'All Tasks' && (
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex flex-grow overflow-x-auto space-x-6 p-4 rounded-lg">
            {/* Kanban Columns: show all columns */}
            {kanbanState.map((col) => (
              <Droppable droppableId={col.key} key={col.key}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="flex-shrink-0 w-80 bg-white rounded-lg shadow-md p-4 border border-gray-200"
                  >
                    <div className={`flex items-center justify-between rounded-t-md py-2 px-4 text-lg font-semibold mb-4`}>
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
                            className="absolute z-50 bg-white rounded-xl shadow-lg border border-gray-100 py-2 overflow-y-auto"
                            style={{
                              width: '200px',
                              fontFamily: 'Avenir, sans-serif',
                              boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                              top: '28px',
                              right: 0,
                            }}
                          >
                            <button className="w-full text-left px-4 py-2 text-gray-900 text-xs font-medium transition-colors hover:bg-primary/10 hover:text-primary" onClick={() => setOpenColumnMenu(null)}>Move column to the left</button>
                            <button className="w-full text-left px-4 py-2 text-gray-900 text-xs font-medium transition-colors hover:bg-primary/10 hover:text-primary" onClick={() => setOpenColumnMenu(null)}>Move column to the right</button>
                            <button className="w-full text-left px-4 py-2 text-gray-900 text-xs font-medium transition-colors hover:bg-primary/10 hover:text-primary" onClick={() => setOpenColumnMenu(null)}>Set column limit</button>
                          </div>
                        )}
                      </div>
                    </div>
                    <div style={{ maxHeight: '520px', overflowY: 'auto' }} className="flex flex-col gap-y-4">
                      {filterTasks(col.tasks).map((task, idx) => {
                        // Parse progress string like '1 of 3'
                        const [completed, total] = (task.progress || '0 of 1').split(' of ').map(Number);
                        const percent = total > 0 ? (completed / total) * 100 : 0;
                        const contractObj = mockContracts.find(c => c.id === task.contractId);
                        return (
                          <Draggable draggableId={task.code} index={idx} key={task.code}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={{
                                  ...provided.draggableProps.style,
                                  boxShadow: snapshot.isDragging ? '0 4px 16px rgba(0,0,0,0.12)' : undefined,
                                }}
                              >
                                <Card key={task.code} className="p-4 rounded-xl border border-gray-300 relative">
                                  <div className="mb-2">
                                    <div className="flex w-full items-start justify-between">
                                      <span className="h-5 px-1.5 flex items-center justify-center rounded-lg bg-blue-100 text-blue-500 text-[11px] font-semibold border border-blue-200" style={{ minWidth: 24 }}>
                                        Task #{task.taskNumber}
                                      </span>
                                      <div className="relative">
                                        <button
                                          className="border border-gray-300 rounded-md px-1 py-0.5 text-gray-700 hover:border-primary hover:text-primary transition-colors"
                                          style={{ fontFamily: 'Avenir, sans-serif' }}
                                          title="More options"
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
                                            className="absolute z-50 bg-white rounded-xl shadow-lg border border-gray-100 py-2 overflow-y-auto"
                                            style={{
                                              width: '90%',
                                              maxWidth: '240px',
                                              minWidth: '180px',
                                              fontFamily: 'Avenir, sans-serif',
                                              boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                                              top: '28px',
                                              right: 'calc(100% + 4px)',
                                              maxHeight: '260px',
                                            }}
                                          >
                                            <button className="w-full text-left px-4 py-1.5 text-gray-900 rounded-t-xl text-xs font-medium transition-colors hover:bg-primary/10 hover:text-primary" style={{fontFamily: 'Avenir, sans-serif'}} onClick={() => setOpenMenuTask(null)}>View Details</button>
                                            <button className="w-full text-left px-4 py-1.5 text-gray-900 text-xs font-medium transition-colors hover:bg-primary/10 hover:text-primary" style={{fontFamily: 'Avenir, sans-serif'}} onClick={() => setOpenMenuTask(null)}>Mark Complete</button>
                                            <button className="w-full text-left px-4 py-1.5 text-gray-900 text-xs font-medium transition-colors hover:bg-primary/10 hover:text-primary" style={{fontFamily: 'Avenir, sans-serif'}} onClick={() => setOpenMenuTask(null)}>Reassign</button>
                                            <button className="w-full text-left px-4 py-1.5 text-gray-900 rounded-b-xl text-xs font-medium transition-colors hover:bg-red-50 hover:text-red-600" style={{fontFamily: 'Avenir, sans-serif'}} onClick={() => setOpenMenuTask(null)}>Delete</button>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                    <div className="h-2" />
                                    <div className="text-xs font-bold text-black whitespace-nowrap overflow-hidden text-ellipsis mt-2 p-0 m-0 leading-none" style={{ fontFamily: 'Avenir, sans-serif', marginTop: 0, padding: 0, lineHeight: 1 }}>
                                      {task.title}
                                    </div>
                                  </div>
                                  {/* Contract and Due Date Row (moved above progress bar) */}
                                  <div className="text-xs text-gray-700 flex flex-col gap-0.5 mb-1" style={{ fontFamily: 'Avenir, sans-serif' }}>
                                    <div className="flex items-center justify-between w-full mt-0 mb-0 p-0 m-0 leading-none" style={{ marginTop: 0, marginBottom: 0, padding: 0, lineHeight: 1 }}>
                                      <span className="text-black cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap">{contractObj?.title}</span>
                                      <span className="h-5 px-1.5 flex items-center justify-center rounded-lg bg-primary/10 text-primary text-[11px] font-semibold border border-primary/20 ml-2" style={{ minWidth: 24 }}>
                                        {contractObj?.id}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-1 mt-0.5 justify-between w-full">
                                      <div className="flex items-center gap-1">
                                        <LuCalendarClock className="text-gray-400 text-base" />
                                        <span className="text-xs text-gray-500">{task.due}</span>
                                      </div>
                                    </div>
                                    <div className="h-2" />
                                  </div>
                                  {/* Progress Bar Row */}
                                  <div className="mb-2">
                                    <ProgressBarComponent progress={percent} />
                                  </div>
                                  <div className="flex items-center justify-between mt-2">
                                    <div className="flex items-center gap-2">
                                      <BsPerson className="text-lg text-gray-400" />
                                      <span className="text-xs text-black">{task.assignee}</span>
                                    </div>
                                    <div className="text-xs font-bold text-black">{task.progress}</div>
                                  </div>
                                </Card>
                              </div>
                            )}
                          </Draggable>
                        );
                      })}
                      {provided.placeholder}
                    </div>
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </DragDropContext>
      )}
    </div>
  );
} 