import { configureStore } from '@reduxjs/toolkit';
import registrationReducer from '../features/registration/registrationSlice';
import loginReducer from "../features/login/loginSlice";
import chatReducer from "../features/chat/chatSlice";


export default configureStore({
  reducer: {
    registration: registrationReducer,
    login: loginReducer,
    chat: chatReducer,
  },
});
