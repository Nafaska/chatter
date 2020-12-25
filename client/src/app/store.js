import { configureStore } from '@reduxjs/toolkit';
import registrationReducer from '../features/registration/registrationSlice';

export default configureStore({
  reducer: {
    registration: registrationReducer
  },
});
