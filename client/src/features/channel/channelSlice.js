import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import history from "../../history";

export const channelSlice = createSlice({
  name: "channel",
  initialState: {
    channelList: [],
    newChannel: "",
    dropdownState: false,
  },
  reducers: {
    createNewChannel: (state, action) => {
      state.channelList = [...state.channelList, action.payload];
    },
    expandedDropdown: (state, action) => {
      state.dropdownState = !state.dropdownState;
    },
    updateChannelTitle: (state, action) => {
      state.newChannel = action.payload;
    },
    showChannelList: (state, action) => {
      state.channelList = [...action.payload];
    },
  },
});

export const getListOfChannels = () => async (dispatch) => {
  await axios
    .get("http://localhost:5000/api/v1/channels", {
      withCredentials: true,
    })
    .then((res) => {
      dispatch(showChannelList(res.data.listOfChannels));
    })
    .catch((err) => {
      console.log(err);
    });
};

export const createChannel = (channel) => async (dispatch) => {
  console.log(channel)
  await axios
    .post("http://localhost:5000/api/v1/channels", {channel: channel}, {
      withCredentials: true,
    })
    .then((res) => {
      dispatch(
        createNewChannel({
          newChannel: res.data.channel,
        })
      );
      console.log(res.data.updatedUser, res.data.newChannel);
      history.push(`chat/${res.data.newChannel}`);
    })
    .catch((err) => {
      console.log(err);
    });
};

export const {
  createNewChannel,
  expandedDropdown,
  updateChannelTitle,
  showChannelList,
} = channelSlice.actions;


export const selectChannel = (state) => state.channel.channelsList;
export const dropdownState = (state) => state.channel.dropdownState;
export const selectChannelTitle = (state) => state.channel.newChannel;
export const selectChannelList = (state) => state.channel.channelList;


export default channelSlice.reducer;
