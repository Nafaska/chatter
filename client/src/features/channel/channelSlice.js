import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import history from "../../history";
import { getMyIP } from "../../utils/IPDetector";


export const channelSlice = createSlice({
  name: "channel",
  initialState: {
    channelList: [],
    newChannel: "",
  },
  reducers: {
    createNewChannel: (state, action) => {
      state.channelList = [...state.channelList, action.payload];
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
    .get(`http://${getMyIP()}:5000/api/v1/channels`, {
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
  await axios
    .post(`http://${getMyIP()}:5000/api/v1/channels`, {channel: channel}, {
      withCredentials: true,
    })
    .then((res) => {
      dispatch(
        createNewChannel({
          newChannel: res.data.channel,
        })
      );
      history.push(`channels/${res.data.newChannel}`);
    })
    .catch((err) => {
      console.log(err);
    });
};

export const {
  createNewChannel,
  updateChannelTitle,
  showChannelList,
} = channelSlice.actions;


export const selectChannel = (state) => state.channel.channelsList;
export const selectChannelTitle = (state) => state.channel.newChannel;
export const selectChannelList = (state) => state.channel.channelList;


export default channelSlice.reducer;
