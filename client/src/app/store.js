import { configureStore } from '@reduxjs/toolkit';
import registrationReducer from '../features/registration/registrationSlice';
import loginReducer from '../features/login/loginSlice';


export default configureStore({
  reducer: {
    registration: registrationReducer,
    login: loginReducer,
  },
});
