import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import history from "../../history";

export const chatSlice = createSlice({
  name: "chat",
  initialState: {
    message: "",
    channel: [],
    username: "",
    participants: [],
  },
  reducers: {
    openChat: (state, action) => {
      state.participants = action.payload;
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
    .get(
      `http://localhost:5000/api/v1/channels/${channel}`,
      {
        withCredentials: true,
      }
    )
    .then((res) => {
      dispatch(
        openChat({
          participants: res.data.username,
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
export const selectParticipants = (state) => state.chat.participants;

export default chatSlice.reducer;
