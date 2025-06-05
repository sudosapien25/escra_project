import { useState, useEffect, useRef, useCallback } from 'react';

interface WebSocketHook {
  lastMessage: MessageEvent | null;
  sendMessage: (message: string) => void;
  isConnected: boolean;
  error: Error | null;
}

export const useWebSocket = (url: string): WebSocketHook => {
  const [lastMessage, setLastMessage] = useState<MessageEvent | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Create WebSocket connection
    ws.current = new WebSocket(url);

    // Connection opened
    ws.current.onopen = () => {
      setIsConnected(true);
      setError(null);
    };

    // Connection closed
    ws.current.onclose = () => {
      setIsConnected(false);
    };

    // Connection error
    ws.current.onerror = (event) => {
      setError(new Error('WebSocket error occurred'));
      setIsConnected(false);
    };

    // Listen for messages
    ws.current.onmessage = (event) => {
      setLastMessage(event);
    };

    // Cleanup on unmount
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [url]);

  // Send message function
  const sendMessage = useCallback((message: string) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(message);
    } else {
      setError(new Error('WebSocket is not connected'));
    }
  }, []);

  return {
    lastMessage,
    sendMessage,
    isConnected,
    error,
  };
}; 