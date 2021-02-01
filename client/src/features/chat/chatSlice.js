import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import history from "../../history";
import { getMyIP } from "../../utils/IPDetector";
import { toast } from "react-toastify";

const LIMIT_OF_MESSAGES = 5;

export const chatSlice = createSlice({
  name: "chat",
  initialState: {
    message: "",
    username: "",
    description: "",
    name: "",
    channelsContent: {},
    isBurgerMenuOpen: false,
  },
  reducers: {
    openChat: (state, action) => {
      state.description = action.payload.description;
      state.name = action.payload.name;
    },
    typeMessage: (state, action) => {
      state.message = action.payload;
    },
    addEmoji: (state, action) => {
      state.message = `${state.message}${action.payload}`;
    },
    cleanMessageInput: (state, action) => {
      state.message = "";
    },
    openBurgerMenu: (state, action) => {
      state.isBurgerMenuOpen = action.payload;
    },
    storeMessages: (state, action) => {
      const channelName = action.payload.data.channel;
      const newMessage = {
        message: action.payload.data.message,
        time: +new Date(),
        username: action.payload.data.username,
        name: channelName,
      };

      if (state.channelsContent[channelName]) {
        if (state.channelsContent[channelName].length >= LIMIT_OF_MESSAGES) {
          state.channelsContent[channelName] = [
            ...state.channelsContent[channelName].slice(1),
            newMessage,
          ];
        } else {
          state.channelsContent[channelName] = [
            ...state.channelsContent[channelName],
            newMessage,
          ];
        }
      } else {
        state.channelsContent[channelName] = [newMessage];
      }
    },
  },
});

export const {
  typeMessage,
  openChat,
  addEmoji,
  cleanMessageInput,
  storeMessages,
  openBurgerMenu,
} = chatSlice.actions;

export const getChatInfo = (channel) => async (dispatch) => {
  try {
    const res = await
    axios.get(
      `http://${getMyIP()}:5000/api/v2/channels/${channel}`,
      {
        withCredentials: true,
      }
    );
    dispatch(
      openChat({
        description: res.data.description,
        name: res.data.name,
      })
    );
  } catch (err) {
    console.log(err);
    toast.error(err.response.data);
    history.push(`/channels`);
  }
};

export const selectMessage = (state) => state.chat.message;
export const selectDescription = (state) => state.chat.description;
export const selectName = (state) => state.chat.name;
export const selectChannelsContent = (state) => state.chat.channelsContent;
export const selectIsBurgerMenuOpen = (state) => state.chat.isBurgerMenuOpen;

export default chatSlice.reducer;
