import { configureStore } from '@reduxjs/toolkit';
import authReducer from "../features/auth/authSlice";
import chatReducer from "../features/chat/chatSlice";


export default configureStore({
  reducer: {
    auth: authReducer,
    chat: chatReducer,
  },
});
