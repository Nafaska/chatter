import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import history from "../../history";
import Cookies from "universal-cookie";
import { addUser } from "../registration/registrationSlice";

const cookies = new Cookies();

export const loginSlice = createSlice({
  name: "login",
  initialState: {
    password: "",
    email: "",
    token: cookies.get("token"),
    user: {},
  },
  reducers: {
    validatePassword: (state, action) => {
      state.password = action.payload;
    },
    validateEmail: (state, action) => {
      state.email = action.payload;
    },
    validateUser: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.password = "";
    },
  },
});

export const {
  validatePassword,
  validateEmail,
  validateUser,
} = loginSlice.actions;

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched
// export const incrementAsync = (amount) => (dispatch) => {
//   setTimeout(() => {
//     dispatch(incrementByAmount(amount));
//   }, 1000);
// };

export const authUser = (email, password) => async (dispatch) => {
  const credentials = {
    email,
    password,
  };
  await axios
    .post("http://localhost:5000/api/v1/auth/signin", credentials, {
      withCredentials: true,
    })
    .then((res) => {
      dispatch(
        validateUser({ token: res.data.token, user: res.data.user.role })
      );
      history.push("/chat");
    })
    .catch((err) => {
      console.log(err);
    });
};

export function readToken() {
  return async (dispatch) => {
    await axios
      .get("http://localhost:5000/api/v1/auth/signin", {
        withCredentials: true,
      })
      .then((res) => {
        dispatch(validateUser({ token: res.data.token, user: res.data.user }));
        history.push("/chat");
      })
      .catch((err) => {
        console.log(err, "You have to login again");
        dispatch(validateUser({ token: null, user: null }));
        dispatch(addUser({ token: null, user: null }));
        history.push("/login");
      });
  };
}

export const selectEmail = (state) => state.login.email;
export const selectPassword = (state) => state.login.password;
export const passToken = (state) => state.login.token;

export default loginSlice.reducer;
