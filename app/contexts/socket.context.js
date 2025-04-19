import React from "react";
import { Platform } from 'react-native';
import io from "socket.io-client";


export const socketEndpoint = Platform.OS === 'web' ? "http://localhost:3000" : "http://10.60.104.81:3000";

export const socket = io(socketEndpoint, {
  transports: ["websocket"],
});;

export let hasConnection = false;

socket.on("connect", () => {
  console.log("connect: ", socket.id);
  hasConnection = true;
});

socket.on("disconnect", () => {
  hasConnection = false;
  console.log("disconnected from server");
  socket.removeAllListeners();
});

export const SocketContext = React.createContext();
