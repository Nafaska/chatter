import { createSlice } from "@reduxjs/toolkit";
// import axios from "axios";
// import history from "../../history";
// import Cookies from "universal-cookie";

// const cookies = new Cookies();

export const channelSlice = createSlice({
  name: "channel",
  initialState: {
    channelList: [],
    newChannel: "",
    dropdownState: false,
  },
  reducers: {
    createNewChannel: (state, action) => {
      state.channelList = [...state.channelList, action.newChannel];
    },
    expandedDropdown: (state, action) => {
      state.dropdownState = !state.dropdownState;
    },
  },
});

export const { createNewChannel, expandedDropdown } = channelSlice.actions;


export const selectChannel = (state) => state.channel.channelsList;
export const dropdownState = (state) => state.channel.dropdownState;


export default channelSlice.reducer;
