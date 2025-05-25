'use client';

import React from 'react';
import { FaArchive, FaBox, FaCheckCircle, FaRegSquare, FaBan, FaHandPaper, FaHammer, FaCog, FaEye, FaPlus, FaSearch, FaFilter, FaCalendarAlt, FaSort, FaSyncAlt, FaRegClock } from 'react-icons/fa';
import { FaCircleExclamation, FaClipboardCheck, FaCircleCheck } from 'react-icons/fa6';
import { FaArrowsAlt } from 'react-icons/fa';
import { HiOutlineDocumentText, HiOutlineUser, HiOutlineViewBoards } from 'react-icons/hi';
import { IconBaseProps } from 'react-icons';
import { Card } from '@/components/common/Card';
import { RiListCheck2 } from 'react-icons/ri';
import { BsExclamationSquare, BsListTask, BsPerson } from 'react-icons/bs';
import { TbListDetails, TbCalendarClock } from 'react-icons/tb';
import { CgPlayPauseR } from 'react-icons/cg';
import { FaRetweet, FaRegSquareCheck } from 'react-icons/fa6';
import { PiListMagnifyingGlassBold, PiListPlusBold } from 'react-icons/pi';
import { IoCheckboxOutline } from 'react-icons/io5';
import { CiBoxList } from 'react-icons/ci';
import { CgPlayStopR } from 'react-icons/cg';
import { FaList } from 'react-icons/fa6';
import { LuListStart, LuCalendarClock } from 'react-icons/lu';
import { ProgressBar } from '@/components/common/ProgressBar';
import { MdOutlineOpenInNew } from 'react-icons/md';
import { BiDotsHorizontal } from 'react-icons/bi';

export default function WorkflowsPage() {
  const [kanbanTab, setKanbanTab] = React.useState('Active Tasks');
  const kanbanTabs = ['Active Tasks', 'Upcoming', 'Completed', 'All Tasks'];
  const [taskSearchTerm, setTaskSearchTerm] = React.useState('');

  // Add the sampleContracts array from the contracts page for lookup
  const sampleContracts = [
    { id: '9548', title: 'New Property Acquisition' },
    { id: '9550', title: 'Land Development Contract' },
    { id: '9145', title: 'Construction Escrow' },
    { id: '8784', title: 'Commercial Lease Amendment' },
    { id: '8423', title: 'Property Sale Contract' },
    { id: '7804', title: 'Investment Property Escrow' },
    { id: '7234', title: 'Residential Sale Agreement' },
    { id: '9102', title: 'Commercial Lease Escrow' },
    { id: '6891', title: 'Office Building Purchase' },
    { id: '6453', title: 'Retail Space Lease' },
    { id: '10001', title: 'Downtown Condo Sale' },
    { id: '10002', title: 'Warehouse Lease' },
    { id: '10003', title: 'Luxury Villa Purchase' },
    { id: '10004', title: 'Industrial Park Development' },
    { id: '10005', title: 'Beachfront Property Sale' },
  ];

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
          New Workflow
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
              <FaRetweet size={18} color="#3b82f6" />
            </div>
            <div className="flex flex-col items-start h-full">
              <p className="text-sm font-medium text-gray-500 mb-1 font-sans">Tasks in Progress</p>
              <p className="text-2xl font-bold text-gray-900">3</p>
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
              <p className="text-2xl font-bold text-gray-900">2</p>
              <p className="text-xs text-gray-400">Requires action</p>
            </div>
          </div>
        </div>
        {/* Filter Bar */}
        <div className="bg-white border border-gray-300 rounded-xl px-4 py-4 mb-6 flex items-center w-full mt-2">
          <button className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2 text-gray-700 font-medium text-xs min-w-[120px] ml-1" style={{ fontFamily: 'Avenir, sans-serif' }}>
            <BsPerson className="text-gray-400 text-lg" />
            <span>Assignee</span>
            <span className="ml-1 text-gray-400">&#9662;</span>
          </button>
          <button className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2 text-gray-700 font-medium text-xs min-w-[120px] ml-1" style={{ fontFamily: 'Avenir, sans-serif' }}>
            <HiOutlineDocumentText className="text-gray-400 text-lg" />
            <span>Contract</span>
            <span className="ml-1 text-gray-400">&#9662;</span>
          </button>
          <button className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2 text-gray-700 font-medium text-xs min-w-[120px] ml-1" style={{ fontFamily: 'Avenir, sans-serif' }}>
            <HiOutlineViewBoards className="text-gray-400 text-lg" />
            <span>Status</span>
            <span className="ml-1 text-gray-400">&#9662;</span>
          </button>
          <div className="flex items-center bg-white border border-gray-200 rounded-xl px-4 py-2 flex-1 ml-1" style={{ fontFamily: 'Avenir, sans-serif' }}>
            <FaSearch className="text-gray-400 mr-2 text-lg" />
            <input
              type="text"
              placeholder="Search tasks or numbers"
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
        <div className="flex flex-grow overflow-x-auto space-x-6 p-4 rounded-lg">
          {/* Kanban Columns */}
          {[
            {
              key: 'todo',
              title: 'To Do',
              color: 'bg-gray-100',
              icon: <PiListPlusBold className="text-xl mr-2 text-gray-500" />,
              tasks: [
                {
                  code: 'TSK-003',
                  title: 'Verify Payment Schedule',
                  contract: 'New Property Acquisition',
                  type: 'Task',
                  due: 'May 24, 2025',
                  progress: '0 of 2',
                  assignee: 'Michael Brown',
                  assigneeInitials: 'MB',
                  assigneeColor: 'bg-purple-200 text-purple-700',
                  taskNumber: 101,
                },
                {
                  code: 'TSK-008',
                  title: 'Negotiate Updated Terms',
                  contract: 'Land Development Contract',
                  type: 'Task',
                  due: 'May 29, 2025',
                  progress: '0 of 3',
                  assignee: 'Robert Green',
                  assigneeInitials: 'RG',
                  assigneeColor: 'bg-pink-200 text-pink-700',
                  taskNumber: 102,
                },
                {
                  code: 'TSK-009',
                  title: 'Finalize Pricing Details',
                  contract: 'Construction Escrow',
                  type: 'Task',
                  due: 'May 30, 2025',
                  progress: '1 of 4',
                  assignee: 'Emily Davis',
                  assigneeInitials: 'ED',
                  assigneeColor: 'bg-blue-200 text-blue-700',
                  taskNumber: 103,
                },
              ],
            },
            {
              key: 'blocked',
              title: 'Blocked',
              color: 'bg-red-100',
              icon: <CgPlayStopR className="text-xl mr-2 text-red-500" />,
              tasks: [
                {
                  code: 'TSK-002',
                  title: 'Obtain Client Signatures',
                  contract: 'Commercial Lease Amendment',
                  type: 'Task',
                  due: 'May 27, 2025',
                  progress: '0 of 2',
                  assignee: 'Sarah Miller',
                  assigneeInitials: 'SM',
                  assigneeColor: 'bg-purple-200 text-purple-700',
                  taskNumber: 104,
                },
                {
                  code: 'TSK-012',
                  title: 'Third Party Risk Assessment',
                  contract: 'Property Sale Contract',
                  type: 'Task',
                  due: 'June 3, 2025',
                  progress: '0 of 5',
                  assignee: 'Alex Johnson',
                  assigneeInitials: 'AJ',
                  assigneeColor: 'bg-pink-200 text-pink-700',
                  taskNumber: 105,
                },
              ],
            },
            {
              key: 'onhold',
              title: 'On Hold',
              color: 'bg-orange-100',
              icon: <CgPlayPauseR className="text-xl mr-2 text-orange-500" />,
              tasks: [
                {
                  code: 'TSK-005',
                  title: 'Review Employment Terms',
                  contract: 'Investment Property Escrow',
                  type: 'Task',
                  due: 'May 23, 2025',
                  progress: '1 of 3',
                  assignee: 'Emily Davis',
                  assigneeInitials: 'ED',
                  assigneeColor: 'bg-blue-200 text-blue-700',
                  taskNumber: 106,
                },
              ],
            },
            {
              key: 'inprogress',
              title: 'In Progress',
              color: 'bg-blue-100',
              icon: <FaRetweet className="text-xl mr-2 text-blue-500" />,
              tasks: [
                {
                  code: 'TSK-001',
                  title: 'Review Contract Terms',
                  contract: 'Residential Sale Agreement',
                  type: 'Task',
                  due: 'May 25, 2025',
                  progress: '2 of 3',
                  assignee: 'Alex Johnson',
                  assigneeInitials: 'AJ',
                  assigneeColor: 'bg-pink-200 text-pink-700',
                  taskNumber: 107,
                },
                {
                  code: 'TSK-007',
                  title: 'Legal Review of License Terms',
                  contract: 'Commercial Lease Escrow',
                  type: 'Task',
                  due: 'May 22, 2025',
                  progress: '2 of 5',
                  assignee: 'Jennifer White',
                  assigneeInitials: 'JW',
                  assigneeColor: 'bg-green-200 text-green-700',
                  taskNumber: 108,
                },
                {
                  code: 'TSK-011',
                  title: 'Update Statement of Work',
                  contract: 'Office Building Purchase',
                  type: 'Task',
                  due: 'May 28, 2025',
                  progress: '1 of 4',
                  assignee: 'Michael Brown',
                  assigneeInitials: 'MB',
                  assigneeColor: 'bg-purple-200 text-purple-700',
                  taskNumber: 109,
                },
                // Additional example cards for scroll testing
                {
                  code: 'TSK-015',
                  title: 'Coordinate Inspection',
                  contract: 'Retail Space Lease',
                  type: 'Task',
                  due: 'June 1, 2025',
                  progress: '0 of 2',
                  assignee: 'Samantha Fox',
                  assigneeInitials: 'SF',
                  assigneeColor: 'bg-orange-200 text-orange-700',
                  taskNumber: 113,
                },
                {
                  code: 'TSK-016',
                  title: 'Draft Addendum',
                  contract: 'Land Development Contract',
                  type: 'Task',
                  due: 'June 2, 2025',
                  progress: '1 of 3',
                  assignee: 'David Miller',
                  assigneeInitials: 'DM',
                  assigneeColor: 'bg-blue-200 text-blue-700',
                  taskNumber: 114,
                },
                {
                  code: 'TSK-017',
                  title: 'Schedule Appraisal',
                  contract: 'New Property Acquisition',
                  type: 'Task',
                  due: 'June 3, 2025',
                  progress: '0 of 1',
                  assignee: 'Alice Lee',
                  assigneeInitials: 'AL',
                  assigneeColor: 'bg-teal-200 text-teal-700',
                  taskNumber: 115,
                },
                {
                  code: 'TSK-018',
                  title: 'Send Disclosures',
                  contract: 'Investment Property Escrow',
                  type: 'Task',
                  due: 'June 4, 2025',
                  progress: '2 of 2',
                  assignee: 'Robert Green',
                  assigneeInitials: 'RG',
                  assigneeColor: 'bg-pink-200 text-pink-700',
                  taskNumber: 116,
                },
                {
                  code: 'TSK-019',
                  title: 'Confirm Title Insurance',
                  contract: 'Property Sale Contract',
                  type: 'Task',
                  due: 'June 5, 2025',
                  progress: '1 of 1',
                  assignee: 'Sarah Miller',
                  assigneeInitials: 'SM',
                  assigneeColor: 'bg-green-200 text-green-700',
                  taskNumber: 117,
                },
                {
                  code: 'TSK-020',
                  title: 'Finalize Closing Statement',
                  contract: 'Downtown Condo Sale',
                  type: 'Task',
                  due: 'June 6, 2025',
                  progress: '0 of 4',
                  assignee: 'Emily Davis',
                  assigneeInitials: 'ED',
                  assigneeColor: 'bg-blue-200 text-blue-700',
                  taskNumber: 118,
                },
              ],
            },
            {
              key: 'inreview',
              title: 'In Review',
              color: 'bg-yellow-100',
              icon: <PiListMagnifyingGlassBold className="text-xl mr-2 text-yellow-500" />,
              tasks: [
                {
                  code: 'TSK-004',
                  title: 'Final Document Verification',
                  contract: 'Retail Space Lease',
                  type: 'Task',
                  due: 'May 26, 2025',
                  progress: '2 of 3',
                  assignee: 'Alex Johnson',
                  assigneeInitials: 'AJ',
                  assigneeColor: 'bg-pink-200 text-pink-700',
                  taskNumber: 110,
                },
              ],
            },
            {
              key: 'done',
              title: 'Done',
              color: 'bg-green-100',
              icon: <FaRegSquareCheck className="text-xl mr-2 text-green-600" />,
              tasks: [
                {
                  code: 'TSK-013',
                  title: 'Archive Completed Files',
                  contract: 'Downtown Condo Sale',
                  type: 'Task',
                  due: 'May 20, 2025',
                  progress: '5 of 5',
                  assignee: 'Sarah Miller',
                  assigneeInitials: 'SM',
                  assigneeColor: 'bg-green-200 text-green-700',
                  taskNumber: 111,
                },
                {
                  code: 'TSK-014',
                  title: 'Send Completion Notice',
                  contract: 'Warehouse Lease',
                  type: 'Task',
                  due: 'May 19, 2025',
                  progress: '3 of 3',
                  assignee: 'Robert Green',
                  assigneeInitials: 'RG',
                  assigneeColor: 'bg-green-200 text-green-700',
                  taskNumber: 112,
                },
              ],
            },
          ].map((col) => {
            // Filter tasks in each column by search term
            const filteredTasks = col.tasks.filter(task => {
              const search = taskSearchTerm.trim().toLowerCase();
              if (!search) return true;
              return (
                (task.title && task.title.toLowerCase().includes(search)) ||
                (task.taskNumber && String(task.taskNumber).includes(search))
              );
            });
            return (
              <div key={col.key} className="flex-shrink-0 w-80 bg-white rounded-lg shadow-md p-4 border border-gray-200">
                <div className={`flex items-center rounded-t-md py-2 px-4 text-lg font-semibold mb-4`}>
                  {React.cloneElement(col.icon, { className: col.icon.props.className, style: { ...col.icon.props.style, color: col.icon.props.color }, color: col.icon.props.color })}
                  <h3 className="text-lg font-semibold ml-2" style={{ color: col.icon.props.color }}>{col.title}</h3>
                </div>
                <div style={{ maxHeight: '520px', overflowY: 'auto' }} className="flex flex-col gap-y-4">
                  {filteredTasks.map((task) => {
                    // Parse progress string like '1 of 3'
                    const [completed, total] = (task.progress || '0 of 1').split(' of ').map(Number);
                    const percent = total > 0 ? (completed / total) * 100 : 0;
                    return (
                      <Card key={task.code} className="p-4 rounded-xl border border-gray-300">
                        <div className="mb-2">
                          <div className="flex w-full items-start justify-between">
                            <span className="h-5 px-1.5 flex items-center justify-center rounded-lg bg-blue-100 text-blue-500 text-[11px] font-semibold border border-blue-200" style={{ minWidth: 24 }}>
                              Task #{task.taskNumber}
                            </span>
                            <button
                              className="p-0 text-black hover:text-primary transition-colors ml-2"
                              style={{ fontFamily: 'Avenir, sans-serif' }}
                              title="More options"
                            >
                              <BiDotsHorizontal size={22} />
                  </button>
                </div>
                          <div className="h-2" />
                          <div className="text-xs font-bold text-black whitespace-nowrap overflow-hidden text-ellipsis mt-2 p-0 m-0 leading-none" style={{ fontFamily: 'Avenir, sans-serif', marginTop: 0, padding: 0, lineHeight: 1 }}>
                            {task.title}
                </div>
              </div>
                        {/* Contract and Due Date Row (moved above progress bar) */}
                        <div className="text-xs text-gray-700 flex flex-col gap-0.5 mb-1" style={{ fontFamily: 'Avenir, sans-serif' }}>
                          <div className="flex items-center justify-between w-full mt-0 mb-0 p-0 m-0 leading-none" style={{ marginTop: 0, marginBottom: 0, padding: 0, lineHeight: 1 }}>
                            <span className="text-black cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap">{task.contract}</span>
                            {(() => {
                              const contractName = (task.contract || '').trim().toLowerCase();
                              const found = sampleContracts.find(c => c.title.trim().toLowerCase() === contractName);
                              return found ? (
                                <span className="h-5 px-1.5 flex items-center justify-center rounded-lg bg-primary/10 text-primary text-[11px] font-semibold border border-primary/20 ml-2" style={{ minWidth: 24 }}>
                                  {found.id}
                                </span>
                              ) : null;
                            })()}
          </div>
                          <div className="flex items-center gap-1 mt-0.5 justify-between w-full">
                            <div className="flex items-center gap-1">
                              <LuCalendarClock className="text-yellow-500 text-base" />
                              <span className="text-xs text-gray-500">{task.due}</span>
                </div>
              </div>
                          <div className="h-2" />
          </div>
                        {/* Progress Bar Row */}
                        <div className="mb-2">
                          <ProgressBar progress={percent} />
            </div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2">
                            <BsPerson className="text-lg text-gray-400" />
                            <span className="text-xs text-black">{task.assignee}</span>
              </div>
                          <div className="text-xs font-bold text-black">{task.progress}</div>
              </div>
            </Card>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
      {kanbanTab === 'Upcoming' && (
        <div className="flex flex-grow overflow-x-auto space-x-6 p-4 rounded-lg">
          {/* Placeholder: Upcoming Kanban */}
          <div className="text-gray-400 text-lg mx-auto my-12">Upcoming tasks kanban coming soon...</div>
        </div>
      )}
      {kanbanTab === 'Completed' && (
        <div className="flex flex-grow overflow-x-auto space-x-6 p-4 rounded-lg">
          {/* Placeholder: Completed Kanban */}
          <div className="text-gray-400 text-lg mx-auto my-12">Completed tasks kanban coming soon...</div>
        </div>
      )}
      {kanbanTab === 'All Tasks' && (
        <div className="flex flex-grow overflow-x-auto space-x-6 p-4 rounded-lg">
          {/* Placeholder: All Tasks Kanban */}
          <div className="text-gray-400 text-lg mx-auto my-12">All tasks kanban coming soon...</div>
        </div>
      )}
    </div>
  );
} 