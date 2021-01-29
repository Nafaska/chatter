import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import history from "../../history";
import Cookies from "universal-cookie";
import { getMyIP } from "../../utils/IPDetector";
import { toast } from "react-toastify";

const cookies = new Cookies();

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    password: "",
    email: "",
    token: cookies.get("token"),
    role: [],
    username: "",
    isAuthenticated: false,
    id: ""
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
      state.isAuthenticated = action.payload.role.length > 0;
      state.id = action.payload.id;
    },
    logout: (state, action) => {
      cookies.remove("token");
      state.token = '';
      state.role = [];
      state.email = "";
      state.username = "";
      state.password = "";
      state.isAuthenticated = false;
      state.id = "";
    },
  },
});

export const {
  validatePassword,
  validateEmail,
  validateUser,
  validateUsername,
  logout,
} = authSlice.actions;

export const authUser = (email, password) => async (dispatch) => {
  const credentials = {
    email,
    password,
  };
  try {
    const res = await axios.post(
      `http://${getMyIP()}:5000/api/v1/auth/signin`,
      credentials,
      {
        withCredentials: true,
      }
    );
    dispatch(
      validateUser({
        token: res.data.token,
        role: res.data.role,
        email: res.data.email,
        username: res.data.username,
        id: res.data.id,
      })
    );
  } catch (err) {
    console.log(err);
    toast.error(
      err.response ? err.response.data.error : "Something went wrong"
    );
  }
};

export const createUser = (email, password, username) => async (dispatch) => {
  const credentials = {
    email,
    password,
    username,
  };

  try {
    const res = await axios.post(
      `http://${getMyIP()}:5000/api/v1/auth/signup`,
      credentials,
      {
        withCredentials: true,
      }
    );
    dispatch(
      validateUser({
        token: res.data.token,
        role: res.data.role,
        email: res.data.email,
        username: res.data.username,
        id: res.data.id,
      })
    );
    history.push("/channels");
  } catch (err) {
    console.log(err);
    toast.error(
      err.response ? err.response.data.error : "Something went wrong"
    );
  }
};

export function readToken() {
  return async (dispatch) => {
    try {
      const res = await axios.get(
        `http://${getMyIP()}:5000/api/v1/auth/signin`,
        {
          withCredentials: true,
        }
      );
      dispatch(
        validateUser({
          token: res.data.token,
          role: res.data.role,
          email: res.data.email,
          username: res.data.username,
          id: res.data.id,
        })
      );
      return true;
    } catch (err) {
      dispatch(validateUser({ token: null, role: [] }));
      history.push("/login");
      toast.error("You have to login again");
      console.log(err, "You have to login again");
      return false;
    }
  };
}

export const selectEmail = (state) => state.auth.email;
export const selectUsername = (state) => state.auth.username;
export const selectPassword = (state) => state.auth.password;
export const selectRole = (state) => state.auth.role;
export const passToken = (state) => state.auth.token;

export default authSlice.reducer;
