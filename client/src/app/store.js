import { configureStore } from '@reduxjs/toolkit';
import authReducer from "../features/auth/authSlice";
import chatReducer from "../features/chat/chatSlice";
// import SocketIO from "socket.io-client";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    chat: chatReducer,
  },
});

// let socket;
// // const isBrowser = typeof window !== "undefined";
// if (true) {
//   localStorage.debug = "*";

//   const initSocket = () => {
//     socket = SocketIO(
//       // `${isBrowser ? window.location.origin : "ws://localhost"}/ws`
//       "http://localhost:5000/",
//       {
//         withCredentials: true,
//         // extraHeaders: {
//         //   // "my-custom-header": "abcd",
//         // },
//       }
//     );
//     // socket.onopen = () => {
//     //   store.dispatch(socketActions.connected);
//     // };
//     socket.emit('chat message', 'test message');
//     socket.on('chat message' , message => {
//       console.log(message);
//       // socket.close();
//     });
//     // socket.onclose = () => {
//     //   store.dispatch(socketActions.disconnected);
//     //   setTimeout(() => {
//     //     initSocket();
//     //   }, 2000);
//     // };
//   };
//   initSocket();
// }
// export function getSocket() {
//   return socket;
// }