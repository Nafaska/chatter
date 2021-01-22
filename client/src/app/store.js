import { configureStore } from '@reduxjs/toolkit';
import authReducer from "../features/auth/authSlice";
import chatReducer from "../features/chat/chatSlice";
import channelReducer from "../features/channel/channelSlice";
import adminReducer from "../features/admin/adminSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    chat: chatReducer,
    channel: channelReducer,
    admin: adminReducer,
  },
});
