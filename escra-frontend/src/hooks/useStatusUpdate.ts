import { useState, useEffect, useCallback } from 'react';
import { useWebSocket } from './useWebSocket';

interface StatusUpdate {
  type: 'status_change' | 'initial_status';
  entity_id: string;
  current_status: string;
  is_blocked: boolean;
  blocking_reason?: string;
}

interface UseStatusUpdateProps {
  entityType: 'contract' | 'task' | 'signature' | 'document';
  entityId: string;
  onStatusChange?: (status: string) => void;
  onBlocked?: (reason: string) => void;
  onUnblocked?: () => void;
}

export const useStatusUpdate = ({
  entityType,
  entityId,
  onStatusChange,
  onBlocked,
  onUnblocked
}: UseStatusUpdateProps) => {
  const [currentStatus, setCurrentStatus] = useState<string>('');
  const [isBlocked, setIsBlocked] = useState<boolean>(false);
  const [blockingReason, setBlockingReason] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // WebSocket connection
  const { lastMessage, sendMessage } = useWebSocket(
    `ws://localhost:8000/api/status/ws/${entityType}/${entityId}`
  );

  // Handle WebSocket messages
  useEffect(() => {
    if (lastMessage) {
      const data: StatusUpdate = JSON.parse(lastMessage.data);
      
      if (data.type === 'initial_status' || data.type === 'status_change') {
        setCurrentStatus(data.current_status);
        setIsBlocked(data.is_blocked);
        setBlockingReason(data.blocking_reason);
        setIsLoading(false);

        // Call callbacks
        if (onStatusChange) {
          onStatusChange(data.current_status);
        }

        if (data.is_blocked && onBlocked && data.blocking_reason) {
          onBlocked(data.blocking_reason);
        } else if (!data.is_blocked && onUnblocked) {
          onUnblocked();
        }
      }
    }
  }, [lastMessage, onStatusChange, onBlocked, onUnblocked]);

  // Update status function
  const updateStatus = useCallback(async (
    newStatus: string,
    changedBy: string,
    reason?: string
  ) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `http://localhost:8000/api/status/${entityType}/${entityId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            new_status: newStatus,
            changed_by: changedBy,
            reason,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to update status');
      }

      const data = await response.json();
      setCurrentStatus(data.current_status);
      setIsBlocked(data.is_blocked);
      setBlockingReason(data.blocking_reason);
      setIsLoading(false);

      if (onStatusChange) {
        onStatusChange(data.current_status);
      }

      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update status'));
      setIsLoading(false);
      throw err;
    }
  }, [entityType, entityId, onStatusChange]);

  // Get status history
  const getStatusHistory = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `http://localhost:8000/api/status/${entityType}/${entityId}/history`
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to get status history');
      }

      const data = await response.json();
      setIsLoading(false);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to get status history'));
      setIsLoading(false);
      throw err;
    }
  }, [entityType, entityId]);

  return {
    currentStatus,
    isBlocked,
    blockingReason,
    isLoading,
    error,
    updateStatus,
    getStatusHistory,
  };
}; 