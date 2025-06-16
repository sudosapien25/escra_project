import React from 'react';
import { useStatusUpdate } from '../hooks/useStatusUpdate';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { formatDistanceToNow } from 'date-fns';

interface StatusHistoryProps {
  entityType: 'contract' | 'task' | 'signature' | 'document';
  entityId: string;
  className?: string;
}

export const StatusHistory: React.FC<StatusHistoryProps> = ({
  entityType,
  entityId,
  className = '',
}) => {
  const { getStatusHistory, isLoading, error } = useStatusUpdate({
    entityType,
    entityId,
  });

  const [history, setHistory] = React.useState<any[]>([]);

  React.useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await getStatusHistory();
        setHistory(data);
      } catch (err) {
        console.error('Failed to fetch status history:', err);
      }
    };

    fetchHistory();
  }, [getStatusHistory]);

  if (isLoading) {
    return <div className="animate-pulse">Loading history...</div>;
  }

  if (error) {
    return (
      <div className="text-red-500">
        Error: {error.message}
      </div>
    );
  }

  if (!history.length) {
    return (
      <div className="text-muted-foreground text-sm">
        No status history available
      </div>
    );
  }

  return (
    <ScrollArea className={`h-[300px] rounded-md border p-4 ${className}`}>
      <div className="space-y-4">
        {history.map((change, index) => (
          <div
            key={index}
            className="flex items-start gap-4 border-b pb-4 last:border-0"
          >
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="capitalize">
                  {change.old_status}
                </Badge>
                <span className="text-muted-foreground">→</span>
                <Badge className="capitalize">
                  {change.new_status}
                </Badge>
              </div>
              {change.reason && (
                <p className="text-sm text-muted-foreground">
                  {change.reason}
                </p>
              )}
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>Changed by {change.changed_by}</span>
                <span>•</span>
                <span>
                  {formatDistanceToNow(new Date(change.changed_at), {
                    addSuffix: true,
                  })}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}; 