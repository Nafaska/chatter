import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import history from "../../history";
import { getMyIP } from "../../utils/IPDetector";


export const channelSlice = createSlice({
  name: "channel",
  initialState: {
    channelList: [],
    newChannel: "",
    newDescription: "",
  },
  reducers: {
    createNewChannel: (state, action) => {
      state.channelList = [...state.channelList, action.payload];
    },
    updateChannelName: (state, action) => {
      state.newChannel = action.payload;
    },
    updateChannelDescription: (state, action) => {
      state.newDescription = action.payload;
    },
    showChannelList: (state, action) => {
      state.channelList = [...action.payload];
    },
  },
});

export const getListOfChannels = () => async (dispatch) => {
  await axios
    .get(`http://${getMyIP()}:5000/api/v2/channels`, {
      withCredentials: true,
    })
    .then((res) => {
      const channels = res.data.map(channel => channel.name);
      dispatch(showChannelList(channels));
    })
    .catch((err) => {
      console.log(err);
    });
};

export const createChannel = (name, description) => async (dispatch) => {
  await axios
    .post(`http://${getMyIP()}:5000/api/v2/channels`, {name, description}, {
      withCredentials: true,
    })
    .then((res) => {
      dispatch(
        createNewChannel(res.data.name)
      );
      history.push(`channels/${res.data.name}`);
    })
    .catch((err) => {
      console.log(err);
    });
};

export const {
  createNewChannel,
  updateChannelName,
  showChannelList,
  updateChannelDescription,
} = channelSlice.actions;


export const selectChannel = (state) => state.channel.channelsList;
export const selectChannelName = (state) => state.channel.newChannel;
export const selectChannelList = (state) => state.channel.channelList;
export const selectChannelDescription = (state) => state.channel.newDescription;


export default channelSlice.reducer;
