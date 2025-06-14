import React, { createContext, useState, useEffect, useContext } from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

const WebSocketContext = createContext();

export const WebSocketProvider = ({ children }) => {
  const [stompClient, setStompClient] = useState(null);

  const API_BASE = process.env.REACT_APP_API_BASE;



  const url = `${API_BASE}/connect`;

  useEffect(() => {
    let socket, stomp;

    const connect = () => {
      socket = new SockJS(url, null, {
        transports: ['websocket', 'xhr-streaming', 'xhr-polling'],
        withCredentials: true,
      });

      stomp = Stomp.over(socket);

      stomp.connect(
        {},
        () => {
          console.log("STOMP client connected");
          setStompClient(stomp);
        },
        (error) => {
          console.error("STOMP client connection error:", error);
        }
      );

      socket.onclose = () => {
        console.error("STOMP client disconnected");
        connect(); // Recreate the connection
        console.log("Attempting to reconnect...");
      };
    };

    connect();

    return () => {
      if (stomp) {
        stomp.disconnect();
      }
    };
  }, []);

  return (
    <WebSocketContext.Provider value={{ stompClient }}>
      {children}
    </WebSocketContext.Provider>
  );
};

// Custom hook to use the WebSocket context
export const useWebSocket = () => {
  return useContext(WebSocketContext);
};
