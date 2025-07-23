'use client';

import React, { useState } from 'react';
import { Table, Column } from '@/components/common/Table';
import { Badge } from '@/components/common/Badge';
import { ProgressBar } from '@/components/common/ProgressBar';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  progress: number;
  lastActive: string;
}

const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'Admin',
    status: 'active',
    progress: 75,
    lastActive: '2024-03-15',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'User',
    status: 'inactive',
    progress: 30,
    lastActive: '2024-03-10',
  },
  {
    id: '3',
    name: 'Bob Johnson',
    email: 'bob@example.com',
    role: 'Editor',
    status: 'pending',
    progress: 90,
    lastActive: '2024-03-14',
  },
  {
    id: '4',
    name: 'Alice Brown',
    email: 'alice@example.com',
    role: 'User',
    status: 'active',
    progress: 45,
    lastActive: '2024-03-13',
  },
  {
    id: '5',
    name: 'Charlie Wilson',
    email: 'charlie@example.com',
    role: 'Editor',
    status: 'inactive',
    progress: 60,
    lastActive: '2024-03-12',
  },
];

export default function TestTablePage() {
  const [loading, setLoading] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

  const columns: Column<User>[] = [
    {
      key: 'id',
      header: 'ID',
      sortable: true,
      align: 'center',
      width: '80px',
      sortValue: (user) => user.id,
      render: (user) => (
        <span className="text-primary underline font-semibold cursor-pointer text-xs">
          {user.id}
        </span>
      ),
    },
    {
      key: 'name',
      header: 'Name',
      sortable: true,
      width: '150px',
      align: 'left',
      sortValue: (user) => user.name,
      render: (user) => (
        <div className="text-xs font-bold text-gray-900">{user.name}</div>
      ),
    },
    {
      key: 'email',
      header: 'Email',
      sortable: true,
      width: '200px',
      align: 'left',
      sortValue: (user) => user.email,
      render: (user) => (
        <div className="text-xs text-gray-500">{user.email}</div>
      ),
    },
    {
      key: 'role',
      header: 'Role',
      sortable: true,
      align: 'center',
      width: '120px',
      sortValue: (user) => user.role,
      render: (user) => (
        <span className="inline-flex items-center justify-center min-w-[7rem] h-7 px-4 font-semibold rounded-full text-xs bg-primary/10 text-primary border border-primary/20">
          {user.role}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      align: 'center',
      width: '120px',
      sortValue: (user) => user.status,
      render: (user) => {
        const statusColors = {
          active: 'bg-green-50 text-green-700 border-green-200',
          inactive: 'bg-red-50 text-red-700 border-red-200',
          pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
        } as const;

        return (
          <span className={`inline-flex items-center justify-center min-w-[7rem] h-7 px-4 font-semibold rounded-full text-xs border ${statusColors[user.status]}`}>
            {user.status}
          </span>
        );
      },
    },
    {
      key: 'progress',
      header: 'Progress',
      sortable: true,
      align: 'center',
      width: '200px',
      sortValue: (user) => user.progress,
      render: (user) => (
        <div className="flex items-center justify-center">
          <ProgressBar
            value={user.progress}
            size="sm"
            showValue
            className="w-full"
          />
        </div>
      ),
    },
    {
      key: 'lastActive',
      header: 'Last Active',
      sortable: true,
      align: 'center',
      width: '120px',
      sortValue: (user) => user.lastActive,
      render: (user) => (
        <div className="text-xs text-gray-500">{user.lastActive}</div>
      ),
    },
  ];

  const customWidthColumns: Column<User>[] = [
    {
      ...columns[0],
      width: '5%',
    },
    {
      ...columns[1],
      width: '15%',
    },
    {
      ...columns[2],
      width: '25%',
    },
    {
      ...columns[3],
      width: '15%',
    },
    {
      ...columns[4],
      width: '15%',
    },
    {
      ...columns[5],
      width: '15%',
    },
    {
      ...columns[6],
      width: '10%',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8" style={{ fontFamily: 'Avenir, sans-serif' }}>
      <h1 className="text-2xl font-bold mb-8">Table Component Examples</h1>

      <div className="space-y-8">
        {/* Basic Table */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Basic Table</h2>
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div style={{ maxHeight: 'calc(100vh - 400px)', overflowY: 'scroll' }} className="relative overflow-x-auto">
              <Table<User>
                data={mockUsers}
                columns={columns}
                keyExtractor={(user) => user.id}
              />
            </div>
          </div>
        </section>

        {/* Table with Toolbar */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Table with Toolbar</h2>
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div style={{ maxHeight: 'calc(100vh - 400px)', overflowY: 'scroll' }} className="relative overflow-x-auto">
              <Table<User>
                data={mockUsers}
                columns={columns}
                keyExtractor={(user) => user.id}
                toolbar={{
                  showSearch: true,
                  showExport: true,
                  showFilter: true,
                  customActions: (
                    <button
                      onClick={() => setLoading(!loading)}
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-xs"
                    >
                      Toggle Loading
                    </button>
                  ),
                }}
                onExport={(data) => {
                  console.log('Exporting data:', data);
                }}
              />
            </div>
          </div>
        </section>

        {/* Selectable Table */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Selectable Table</h2>
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                Selected users: {selectedUsers.length}
              </p>
            </div>
            <div style={{ maxHeight: 'calc(100vh - 400px)', overflowY: 'scroll' }} className="relative overflow-x-auto">
              <Table<User>
                data={mockUsers}
                columns={columns}
                keyExtractor={(user) => user.id}
                selectable
                onSelectionChange={setSelectedUsers}
                hoverable
              />
            </div>
          </div>
        </section>

        {/* Table with Pagination */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Table with Pagination</h2>
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div style={{ maxHeight: 'calc(100vh - 400px)', overflowY: 'scroll' }} className="relative overflow-x-auto">
              <Table<User>
                data={mockUsers}
                columns={columns}
                keyExtractor={(user) => user.id}
                pagination={{
                  pageSize: 2,
                  pageSizeOptions: [2, 5, 10],
                  showPageSizeSelector: true,
                }}
              />
            </div>
          </div>
        </section>

        {/* Loading State */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Loading State</h2>
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="space-y-4">
              <button
                onClick={() => setLoading(!loading)}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-xs"
              >
                Toggle Loading
              </button>
              <div style={{ maxHeight: 'calc(100vh - 400px)', overflowY: 'scroll' }} className="relative overflow-x-auto">
                <Table<User>
                  data={mockUsers}
                  columns={columns}
                  keyExtractor={(user) => user.id}
                  loading={loading}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Empty State */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Empty State</h2>
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div style={{ maxHeight: 'calc(100vh - 400px)', overflowY: 'scroll' }} className="relative overflow-x-auto">
              <Table<User>
                data={[]}
                columns={columns}
                emptyMessage="No users found"
              />
            </div>
          </div>
        </section>

        {/* Custom Column Widths */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Custom Column Widths</h2>
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="w-full overflow-x-auto">
              <div className="min-w-[1000px]">
                <Table<User>
                  data={mockUsers}
                  columns={customWidthColumns}
                  keyExtractor={(user) => user.id}
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
} 