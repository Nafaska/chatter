import { createSlice } from "@reduxjs/toolkit";

export const chatSlice = createSlice({
  name: "chat",
  initialState: {
    message: "",
    channel: [],
    username: ""
  },
  reducers: {
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

export const { postMessage, typeMessage } = chatSlice.actions;

export const selectMessage = (state) => state.chat.message;
export const selectChannel = (state) => state.chat.channel;

export default chatSlice.reducer;
