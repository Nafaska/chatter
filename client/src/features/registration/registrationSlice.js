import { createSlice } from "@reduxjs/toolkit";

export const registrationSlice = createSlice({
  name: "registration",
  initialState: {
    password: "",
    email: "",
  },
  reducers: {
    createPassword: (state, action) => {
      state.password = action.payload;
    },
    createEmail: (state, action) => {
      state.email = action.payload;
    },
  },
});

export const { createEmail, createPassword } = registrationSlice.actions;

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched
// export const incrementAsync = (amount) => (dispatch) => {
//   setTimeout(() => {
//     dispatch(incrementByAmount(amount));
//   }, 1000);
// };

// export const updateEmail = (email) => (dispatch) => {
//   setTimeout(() => {
//     dispatch(createEmail(email));
//   }, 1000);
// };
export const selectEmail = (state) => state.registration.email;
export const selectPassword = (state) => state.registration.password;

export default registrationSlice.reducer;
