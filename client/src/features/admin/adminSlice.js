import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

export const adminSlice = createSlice({
  name: "admin",
  initialState: {
    users: [],
    newEmail: "",
    newUsername: "",
    id: "",
    isAdmin: null,
  },
  reducers: {
    saveUsersFromServer: (state, action) => {
      state.users = action.payload;
    },
    updateUsername: (state, action) => {
      state.newUsername = action.payload;
    },
    updateEmail: (state, action) => {
      state.newEmail = action.payload;
    },
    updateRole: (state, action) => {
      state.isAdmin = action.payload;
    },
    getId: (state, action) => {
      state.id = action.payload;
    },
  },
});

export const getAllUsers = () => async (dispatch) => {
  await axios
    .get(`/api/v2/users`, {
      withCredentials: true,
    })
    .then((res) => {
      dispatch(saveUsersFromServer(res.data));
    })
    .catch((err) => {
      console.log(err);
    });
};

export const deleteUser = (id) => async (dispatch, getState) => {
  const myId = getState().auth.id;
  await axios
    .delete(`/api/v2/users/${id}`, {
      data: { id: myId },
      withCredentials: true,
    })
    .then((res) => {
      console.log(res.data.message);
      dispatch(saveUsersFromServer(res.data.users));
    })
    .catch((err) => {
      console.log(err, err.response.data.error);
      toast.error(err.response.data.error);
    });
};

export const asyncUpdateUser = () => async (dispatch, getState) => {
  const { id, newEmail, newUsername, isAdmin } = getState().admin;
  const myId = getState().auth.id;

  await axios
    .patch(
      `/api/v2/users/${id}`,
      {
        newUsername,
        newEmail,
        newRole: isAdmin ? ["admin", "user"] : ["user"],
        id: myId,
      },
      {
        withCredentials: true,
      }
    )
    .then((res) => dispatch(saveUsersFromServer(res.data.users)))
    .catch((err) => {
      console.log(err, err.response.data.error);
      toast.error(err.response.data.error);
    });
};

export const {
  saveUsersFromServer,
  updateUsername,
  updateEmail,
  updateRole,
  getId,
} = adminSlice.actions;

export const selectUsers = (state) => state.admin.users;
export const selectNewUsername = (state) => state.admin.newUsername;
export const selectNewEmail = (state) => state.admin.newEmail;
export const selectId = (state) => state.admin.id;
export const selectIsAdmin = (state) => state.admin.isAdmin;

export default adminSlice.reducer;
