import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import history from "../../history";
import { getMyIP } from "../../utils/IPDetector";


export const chatSlice = createSlice({
  name: "chat",
  initialState: {
    message: "",
    channel: [],
    username: "",
    description: "",
    name: "",
  },
  reducers: {
    openChat: (state, action) => {
      state.description = action.payload.description;
      state.name = action.payload.name;
    },
    postMessage: (state, action) => {
      state.message = "";
      state.channel = [
        ...state.channel,
        {
          message: action.payload.data.message,
          time: +new Date(),
          username: action.payload.data.username,
        },
      ];
    },
    typeMessage: (state, action) => {
      state.message = action.payload;
    },
  },
});

export const { postMessage, typeMessage, openChat } = chatSlice.actions;

export const getChatInfo = (channel) => async (dispatch) => {
  await axios
    .get(`http://${getMyIP()}:5000/api/v2/channels/${channel}`, {
      withCredentials: true,
    })
    .then((res) => {
      dispatch(
        openChat({
          description: res.data.description,
          name: res.data.name,
        })
      );
    })
    .catch((err) => {
      console.log(err);
      history.push(`/channels`);
    });
};

export const selectMessage = (state) => state.chat.message;
export const selectChannel = (state) => state.chat.channel;
export const selectDescription = (state) => state.chat.description;
export const selectName = (state) => state.chat.name;

export default chatSlice.reducer;
