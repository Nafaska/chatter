import { createSlice } from "@reduxjs/toolkit";

export const confirmationSlice = createSlice({
  name: "modal",
  initialState: {
    userIdToDelete: "",
    usernameToDelete: "",
    modalIsOpen: false,
  },
  reducers: {
    openModal: (state, action) => {
      state.modalIsOpen = true;
      state.userIdToDelete = action.payload ? action.payload.id : "";
      state.usernameToDelete = action.payload ? action.payload.username : "";
    },
    closeModal: (state) => {
      state.modalIsOpen = false;
      state.userIdToDelete = "";
      state.usernameToDelete = "";
    },
  },
});

export const { openModal, closeModal } = confirmationSlice.actions;

export const selectModalIsOpen = (state) => state.modal.modalIsOpen;
export const selectUsernameToDelete = (state) => state.modal.usernameToDelete;
export const selectUserIdToDelete = (state) => state.modal.userIdToDelete;

export default confirmationSlice.reducer;