import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import history from "../../history";
import Cookies from "universal-cookie";

const cookies = new Cookies();

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    password: "",
    email: "",
    token: cookies.get("token"),
    role: {},
    username: "",
  },
  reducers: {
    validatePassword: (state, action) => {
      state.password = action.payload;
    },
    validateEmail: (state, action) => {
      state.email = action.payload;
    },
    validateUsername: (state, action) => {
      state.username = action.payload;
    },

    validateUser: (state, action) => {
      state.token = action.payload.token;
      state.role = action.payload.role;
      state.email = action.payload.email;
      state.username = action.payload.username;
      state.password = "";
    },
  },
});

export const {
  validatePassword,
  validateEmail,
  validateUser,
  validateUsername,
} = authSlice.actions;

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
        validateUser({ token: res.data.token, role: res.data.user.role, email: res.data.user.email })
      );
      history.push("/chat");
    })
    .catch((err) => {
      console.log(err);
    });
};

export const createUser = (email, password, username) => async (dispatch) => {
  const credentials = {
    email,
    password,
    username,
  };
  await axios
    .post("http://localhost:5000/api/v1/auth/signup", credentials, {
      withCredentials: true,
    })
    .then((res) => {
      dispatch(
        validateUser({
          token: res.data.token,
          role: res.data.user.role,
          email: res.data.user.email,
          username: res.data.user.username,
        })
      );
      history.push("/chat");
    })
    .catch((err) => {
      console.log(err);
    });
}

export function readToken() {
  return async (dispatch) => {
    await axios
      .get("http://localhost:5000/api/v1/auth/signin", {
        withCredentials: true,
      })
      .then((res) => {
        dispatch(
          validateUser({
            token: res.data.token,
            role: res.data.user.role,
            email: res.data.user.email,
            username: res.data.user.username,
          })
        );
        history.push("/chat");
      })
      .catch((err) => {
        console.log(err, "You have to login again");
        dispatch(validateUser({ token: null, role: null }));
        history.push("/login");
      });
  };
}

export const selectEmail = (state) => state.auth.email;
export const selectUsername = (state) => state.auth.username;
export const selectPassword = (state) => state.auth.password;
export const passToken = (state) => state.auth.token;

export default authSlice.reducer;