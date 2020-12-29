import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import history from "../../history";
import Cookies from "universal-cookie";

const cookies = new Cookies();

export const registrationSlice = createSlice({
  name: "registration",
  initialState: {
    password: "",
    email: "",
    token: cookies.get("token"),
    user: {},
  },
  reducers: {
    createPassword: (state, action) => {
      state.password = action.payload;
    },
    createEmail: (state, action) => {
      state.email = action.payload;
    },
    addUser: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
    },
  },
});

export const {
  createEmail,
  createPassword,
  addUser,
} = registrationSlice.actions;

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched
// export const incrementAsync = (amount) => (dispatch) => {
//   setTimeout(() => {
//     dispatch(incrementByAmount(amount));
//   }, 1000);
// };

export const createUser = (email, password) => async (dispatch) => {
  const credentials = {
    email,
    password,
  };
  await axios
    .post("http://localhost:5000/api/v1/auth/signup", credentials, {
      withCredentials: true,
    })
    .then((res) => {
      dispatch(
        addUser({ token: res.data.token, user: res.data.userInfo.role })
      );
      history.push("/chat");
    })
    .catch((err) => {
      console.log(err);
    });
  // try {
  //   fetch("http://localhost:5000/api/v1/auth/signup", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       email,
  //       password,
  //     }),
  //   })
  //     .then((res) => console.log(typeof res, res))
  //     .then((res) => {
  //       if (!res.status !== 200) {
  //         throw new Error(res.status);
  //       }
  //       return res.json();
  //     })
  //     .then((data) => {
  //       dispatch(data.token);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // } catch (err) {
  //   console.log(err);
  // }
};

export const selectEmail = (state) => state.registration.email;
export const selectPassword = (state) => state.registration.password;

export default registrationSlice.reducer;
