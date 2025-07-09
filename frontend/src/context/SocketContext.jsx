import React, { createContext, useContext, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";

const SOCKET_URL = "http://localhost:4000";

export const SocketContext = createContext();

let mountCount = 0;

export const SocketProvider = ({ children }) => {
  mountCount += 1;
  console.log("SocketProvider mount count:", mountCount);
  const socketRef = useRef();
  const navigate = useNavigate();

  if (!socketRef.current) {
    socketRef.current = io(import.meta.env.VITE_BACKEND_URL, {
      transports: ["websocket"],
      withCredentials: true,
    });
  }

  useEffect(() => {
    const socket = socketRef.current;
    console.trace("SocketProvider mounted, socket id:", socket.id);

    socket.on("connect", () => {
      console.log("Connected to Socket.IO server:", socket.id);
    });
    socket.on("disconnect", () => {
      console.log("Disconnected from Socket.IO server");
    });
    socket.on("connect_error", (err) => {
      console.error("Socket.IO connection error:", err.message);
    });

    // Global ride-started event listener
    const handleRideStarted = (data) => {
      console.log("[SOCKET CONTEXT] Ride started event received:", data);
      console.log("[SOCKET CONTEXT] Current pathname:", window.location.pathname);
      if (window.location.pathname !== "/riding") {
        console.log("[SOCKET CONTEXT] Navigating to /riding");
        navigate("/riding", { state: { ride: data } });
      }
    };

    socket.on("ride-started", handleRideStarted);

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("connect_error");
      socket.off("ride-started", handleRideStarted);
      socket.disconnect();
    };
  }, [navigate]);

  return (
    <SocketContext.Provider value={{ socket: socketRef.current }}>
      {children}
    </SocketContext.Provider>
  );
};

// Optional: custom hook for easy access
export const useSocket = () => useContext(SocketContext);
