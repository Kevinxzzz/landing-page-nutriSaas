import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

export function useSocket() {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    socketRef.current = io('/', { path: '/socket.io' });

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  return socketRef;
}

export function useSocketEvent<T>(
  socketRef: React.RefObject<Socket | null>,
  event: string,
  callback: (data: T) => void,
) {
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    socket.on(event, callback);

    return () => {
      socket.off(event, callback);
    };
  }, [socketRef, event, callback]);
}
