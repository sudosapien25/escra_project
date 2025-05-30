import React, { useState, useMemo } from 'react';
import clsx from 'clsx';
import { ChevronUpIcon, ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import { HiOutlineDownload, HiOutlineFilter } from 'react-icons/hi';

export interface Column<T> {
  /**
   * Unique key for the column
   */
  key: string;
  /**
   * Display header for the column
   */
  header: string;
  /**
   * Function to render the cell content
   */
  render: (item: T) => React.ReactNode;
  /**
   * Whether the column is sortable
   */
  sortable?: boolean;
  /**
   * Optional width for the column
   */
  width?: string;
  /**
   * Optional alignment for the column content
   */
  align?: 'left' | 'center' | 'right';
  /**
   * Optional function to get the raw value for sorting
   */
  sortValue?: (item: T) => string | number;
  filterable?: boolean;
  filterOptions?: { label: string; value: string }[];
}

export interface TableProps<T> {
  /**
   * Array of data items to display
   */
  data: T[];
  /**
   * Array of column definitions
   */
  columns: Column<T>[];
  /**
   * Optional key extractor function
   */
  keyExtractor?: (item: T) => string;
  /**
   * Whether to show a loading state
   */
  loading?: boolean;
  /**
   * Optional empty state message
   */
  emptyMessage?: string;
  /**
   * Whether to show row hover effect
   */
  hoverable?: boolean;
  /**
   * Optional click handler for rows
   */
  onRowClick?: (item: T) => void;
  /**
   * Additional CSS classes
   */
  className?: string;
  selectable?: boolean;
  onSelectionChange?: (selectedItems: T[]) => void;
  pagination?: {
    pageSize?: number;
    pageSizeOptions?: number[];
    showPageSizeSelector?: boolean;
  };
  toolbar?: {
    showSearch?: boolean;
    showExport?: boolean;
    showFilter?: boolean;
    customActions?: React.ReactNode;
  };
  onExport?: (data: T[]) => void;
}

export function Table<T extends Record<string, unknown>>({
  data,
  columns,
  keyExtractor,
  loading = false,
  emptyMessage = 'No data available',
  hoverable = false,
  onRowClick,
  className,
  selectable = false,
  onSelectionChange,
  pagination,
  toolbar,
  onExport,
}: TableProps<T>) {
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>(null);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(pagination?.pageSize || 10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<Record<string, string>>({});

  // Handle sorting
  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Handle row selection
  const handleSelectRow = (item: T) => {
    const key = keyExtractor ? keyExtractor(item) : String(item);
    const newSelectedRows = new Set(selectedRows);
    
    if (newSelectedRows.has(key)) {
      newSelectedRows.delete(key);
    } else {
      newSelectedRows.add(key);
    }
    
    setSelectedRows(newSelectedRows);
    onSelectionChange?.(data.filter(item => 
      newSelectedRows.has(keyExtractor ? keyExtractor(item) : String(item))
    ));
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectedRows.size === data.length) {
      setSelectedRows(new Set());
      onSelectionChange?.([]);
    } else {
      const allKeys = data.map(item => keyExtractor ? keyExtractor(item) : String(item));
      setSelectedRows(new Set(allKeys));
      onSelectionChange?.(data);
    }
  };

  // Apply sorting, filtering, and pagination
  const processedData = useMemo(() => {
    let result = [...data];

    // Apply search
    if (searchTerm) {
      result = result.filter(item =>
        Object.values(item).some(value =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        result = result.filter(item => {
          const column = columns.find(col => col.key === key);
          if (!column) return true;
          const itemValue = column.sortValue ? column.sortValue(item) : String(item[key as keyof T]);
          return String(itemValue).toLowerCase() === value.toLowerCase();
        });
      }
    });

    // Apply sorting
    if (sortConfig) {
      result.sort((a, b) => {
        const column = columns.find((col) => col.key === sortConfig.key);
        if (!column) return 0;

        const aValue = column.sortValue ? column.sortValue(a) : column.render(a);
        const bValue = column.sortValue ? column.sortValue(b) : column.render(b);

        if (aValue === bValue) return 0;
        if (aValue === null || aValue === undefined) return 1;
        if (bValue === null || bValue === undefined) return -1;

        const comparison = String(aValue).localeCompare(String(bValue));
        return sortConfig.direction === 'asc' ? comparison : -comparison;
      });
    }

    return result;
  }, [data, sortConfig, searchTerm, filters, columns, keyExtractor]);

  // Calculate pagination
  const totalPages = Math.ceil(processedData.length / pageSize);
  const paginatedData = processedData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Handle export
  const handleExport = () => {
    if (onExport) {
      onExport(processedData);
    } else {
      // Default CSV export
      const headers = columns.map(col => col.header).join(',');
      const rows = processedData.map(item =>
        columns.map(col => {
          const value = col.sortValue ? col.sortValue(item) : String(item[col.key as keyof T]);
          return `"${value}"`;
        }).join(',')
      ).join('\n');
      
      const csv = `${headers}\n${rows}`;
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'export.csv';
      a.click();
      window.URL.revokeObjectURL(url);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-10 bg-gray-200 rounded-t-lg" />
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-100 border-b border-gray-200" />
        ))}
      </div>
    );
  }

  return (
    <div className={clsx('w-full font-avenir', className)}>
      {/* Toolbar */}
      {(toolbar?.showSearch || toolbar?.showExport || toolbar?.showFilter || toolbar?.customActions) && (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {toolbar.showSearch && (
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
                <svg
                  className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            )}
            {toolbar.showFilter && (
              <button
                onClick={() => {/* Implement filter modal */}}
                className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50"
              >
                <HiOutlineFilter className="h-5 w-5" />
                Filter
              </button>
            )}
          </div>
          <div className="flex items-center gap-4">
            {toolbar.showExport && (
              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50"
              >
                <HiOutlineDownload className="h-5 w-5" />
                Export
              </button>
            )}
            {toolbar.customActions}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="relative overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full border-collapse">
          <colgroup>
            {selectable && <col style={{ width: '40px' }} />}
            {columns.map((column) => (
              <col key={column.key} style={{ width: column.width }} />
            ))}
          </colgroup>
          <thead className="bg-gray-50">
            <tr>
              {selectable && (
                <th scope="col" className="px-6 py-3">
                  <input
                    type="checkbox"
                    checked={selectedRows.size === data.length}
                    onChange={handleSelectAll}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  className={clsx(
                    'px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider',
                    column.sortable && 'cursor-pointer select-none',
                    column.align === 'center' && 'text-center',
                    column.align === 'right' && 'text-right',
                    column.align === 'left' && 'text-left'
                  )}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className={clsx(
                    'flex items-center',
                    column.align === 'center' && 'justify-center',
                    column.align === 'right' && 'justify-end',
                    column.align === 'left' && 'justify-start'
                  )}>
                    <span>{column.header}</span>
                    {column.sortable && (
                      <span className="ml-1">
                        {sortConfig?.key === column.key ? (
                          sortConfig.direction === 'asc' ? (
                            <ChevronUpIcon className="w-4 h-4" />
                          ) : (
                            <ChevronDownIcon className="w-4 h-4" />
                          )
                        ) : (
                          <ChevronUpIcon className="w-4 h-4 opacity-0 group-hover:opacity-50" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={selectable ? columns.length + 1 : columns.length}
                  className="px-6 py-4 text-sm text-gray-500 text-center"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginatedData.map((item, index) => (
                <tr
                  key={keyExtractor ? keyExtractor(item) : index}
                  className={clsx(
                    hoverable && 'hover:bg-gray-50 cursor-pointer',
                    onRowClick && 'cursor-pointer',
                    selectedRows.has(keyExtractor ? keyExtractor(item) : String(item)) && 'bg-primary/5'
                  )}
                  onClick={() => onRowClick?.(item)}
                >
                  {selectable && (
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedRows.has(keyExtractor ? keyExtractor(item) : String(item))}
                        onChange={() => handleSelectRow(item)}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </td>
                  )}
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={clsx(
                        'px-6 py-4 whitespace-nowrap text-sm text-gray-900',
                        column.align === 'center' && 'text-center',
                        column.align === 'right' && 'text-right',
                        column.align === 'left' && 'text-left'
                      )}
                    >
                      {column.render(item)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {pagination.showPageSizeSelector && (
              <>
                <span className="text-sm text-gray-700">Show</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="rounded-md border border-gray-300 py-1 px-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                  {(pagination.pageSizeOptions || [10, 25, 50, 100]).map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
                <span className="text-sm text-gray-700">entries</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="rounded-md border border-gray-300 p-1 text-sm disabled:opacity-50"
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </button>
            <span className="text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="rounded-md border border-gray-300 p-1 text-sm disabled:opacity-50"
            >
              <ChevronRightIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

Table.displayName = 'Table';

interface TableHeaderProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  children: React.ReactNode;
}

export const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  TableHeaderProps
>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={clsx('[&_tr]:border-b', className)}
    {...props}
  />
));

TableHeader.displayName = 'TableHeader';

interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  children: React.ReactNode;
}

export const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  TableBodyProps
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={clsx('[&_tr:last-child]:border-0', className)}
    {...props}
  />
));

TableBody.displayName = 'TableBody';

interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  children: React.ReactNode;
}

export const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, ...props }, ref) => (
    <tr
      ref={ref}
      className={clsx(
        'border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted',
        className
      )}
      {...props}
    />
  )
);

TableRow.displayName = 'TableRow';

interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  children: React.ReactNode;
}

export const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ className, ...props }, ref) => (
    <th
      ref={ref}
      className={clsx(
        'h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0',
        className
      )}
      {...props}
    />
  )
);

TableHead.displayName = 'TableHead';

interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  children: React.ReactNode;
}

export const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className, ...props }, ref) => (
    <td
      ref={ref}
      className={clsx('p-4 align-middle [&:has([role=checkbox])]:pr-0', className)}
      {...props}
    />
  )
);

TableCell.displayName = 'TableCell';

interface TableCaptionProps extends React.HTMLAttributes<HTMLTableCaptionElement> {
  children: React.ReactNode;
}

export const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  TableCaptionProps
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={clsx('mt-4 text-sm text-muted-foreground', className)}
    {...props}
  />
));

TableCaption.displayName = 'TableCaption'; 