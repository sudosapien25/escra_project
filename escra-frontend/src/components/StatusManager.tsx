import React, { useState, useEffect } from 'react';
import { useStatusUpdate } from '../hooks/useStatusUpdate';
import { Badge } from './ui/badge';
import { Button } from './common/Button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { toast } from './ui/use-toast';

interface StatusManagerProps {
  entityType: 'contract' | 'task' | 'signature' | 'document';
  entityId: string;
  availableStatuses: string[];
  currentUserId: string;
  onStatusChange?: (status: string) => void;
  className?: string;
}

export const StatusManager: React.FC<StatusManagerProps> = ({
  entityType,
  entityId,
  availableStatuses,
  currentUserId,
  onStatusChange,
  className = '',
}) => {
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  const {
    currentStatus,
    isBlocked,
    blockingReason,
    isLoading,
    error,
    updateStatus,
  } = useStatusUpdate({
    entityType,
    entityId,
    onStatusChange,
    onBlocked: (reason) => {
      toast({
        title: 'Status Update Blocked',
        description: reason,
        variant: 'destructive',
      });
    },
    onUnblocked: () => {
      toast({
        title: 'Status Update Unblocked',
        description: 'The status can now be updated.',
      });
    },
  });

  useEffect(() => {
    if (currentStatus) {
      setSelectedStatus(currentStatus);
    }
  }, [currentStatus]);

  const handleStatusChange = async (newStatus: string) => {
    try {
      setIsUpdating(true);
      await updateStatus(newStatus, currentUserId);
      toast({
        title: 'Status Updated',
        description: `Status changed to ${newStatus}`,
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to update status',
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return <div className="animate-pulse">Loading status...</div>;
  }

  if (error) {
    return (
      <div className="text-red-500">
        Error: {error.message}
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Status:</span>
        <Badge
          variant={isBlocked ? 'destructive' : 'default'}
          className="capitalize"
        >
          {currentStatus}
        </Badge>
      </div>

      <Select
        value={selectedStatus}
        onValueChange={handleStatusChange}
        disabled={isBlocked || isUpdating}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Change status" />
        </SelectTrigger>
        <SelectContent>
          {availableStatuses.map((status) => (
            <SelectItem key={status} value={status}>
              {status}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {isBlocked && blockingReason && (
        <div className="text-sm text-red-500">
          {blockingReason}
        </div>
      )}
    </div>
  );
}; 