import React, { createContext } from "react";
import io from "socket.io-client";
import { useDispatch } from "react-redux";
import { storeMessages } from "./features/chat/chatSlice";

const WebSocketContext = createContext(null);

export { WebSocketContext };

let socket;
let ws;

// eslint-disable-next-line import/no-anonymous-default-export
export default ({ children }) => {
  const dispatch = useDispatch();

  const sendMessage = (message) => {
    const payload = {
      data: message,
    };
    socket.emit("send message", JSON.stringify(payload));
  };

  if (!socket) {
    socket = io.connect(process.env.REACT_APP_SERVER_URL, {
      withCredentials: true,
    });
    console.log("creating socket");
    socket.on("get message", (msg) => {
      console.log("got message from server", msg);
      const payload = JSON.parse(msg);
      dispatch(storeMessages(payload));
    });
  }

  ws = {
    socket: socket,
    sendMessage,
  };

  return (
    <WebSocketContext.Provider value={ws}>{children}</WebSocketContext.Provider>
  );
};
