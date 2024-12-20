import React, { createContext, useState, useEffect, useContext } from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

const WebSocketContext = createContext();

export const WebSocketProvider = ({ children }) => {

  const [stompClient, setStompClient] = useState(null);

  const url = 'https://fact-frenzy-service-993031554602.us-west1.run.app/connect';

  useEffect(() => {


 
 
    const newSocket = new SockJS(url, null, {
      transports: ['websocket', 'xhr-streaming', 'xhr-polling'],
      withCredentials: true
    });

    const newStompClient = Stomp.over(newSocket);

    newStompClient.connect({}, () => {
      console.log("STOMP client connected");
      setStompClient(newStompClient);
    }, (error) => {
      console.error("STOMP client connection error:", error);
    });

    return () => {
      if (stompClient) {
        stompClient.disconnect();
      }
    };
  }, []);



  return (
    <WebSocketContext.Provider value={{stompClient}}>
      {children}
    </WebSocketContext.Provider>
  );
};

// Custom hook to use the WebSocket context
export const useWebSocket = () => {
  return useContext(WebSocketContext);
};