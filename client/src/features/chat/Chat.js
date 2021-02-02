import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getChatInfo, addEmoji, selectIsBurgerMenuOpen } from "./chatSlice";
import { readToken } from "../auth/authSlice";
import { useParams } from "react-router-dom";
import { getListOfChannels, selectChannelList } from "../channel/channelSlice";
import Picker from "emoji-picker-react";
import LogOutConfirmation from "../modal/LogOutConfirmation";
import ConfirmationModal from "../modal/ConfirmationModal";
import BurgerMenu from "./BurgerMenu";
import BurgerButton from "./BurgerButton";
import Header from "./Header";
import MessageInput from "./MessageInput";
import HandleMessages from "./HandleMessages";

const Chat = () => {
  const dispatch = useDispatch();
  const { channel } = useParams();
  const listOfChannels = useSelector(selectChannelList);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const isBurgerMenuOpen = useSelector(selectIsBurgerMenuOpen);

  const pickerWrapper = useRef();
  const emojiButton = useRef();

  useEffect(() => {
    const startSequence = async () => {
      const isTokenSuccess = await dispatch(readToken());
      if (isTokenSuccess) {
        await dispatch(getChatInfo(channel));
        if (listOfChannels.length === 0) {
          await dispatch(getListOfChannels());
        }
      }
    };
    startSequence();

    const handleClickOutside = (e) => {
      if (showEmojiPicker && !pickerWrapper.current.contains(e.target)) {
        setShowEmojiPicker(false);
      }

      if (!showEmojiPicker && e.target === emojiButton.current) {
        setShowEmojiPicker(true);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [channel, listOfChannels, dispatch, showEmojiPicker]);

  return (
    <div className="font-mono w-full border shadow bg-white">
      <div className="flex">
        <div
          className={`${
            isBurgerMenuOpen
              ? "bg-gradient-to-r from-gray-400 to-blue-500"
              : "bg-transparent"
          }`}
        >
          <BurgerButton />
          <BurgerMenu />
        </div>
        <div
          className={`${
            isBurgerMenuOpen
              ? "hidden sm:flex w-3/4 absolute right-0"
              : "w-full"
          } flex h-screen flex-col`}
        >
          <Header />
          <HandleMessages />
          <div
            ref={pickerWrapper}
            className={showEmojiPicker ? "absolute block bottom-20" : "hidden"}
          >
            <Picker
              disableSkinTonePicker="true"
              preload="true"
              onEmojiClick={(event, emojiObject) =>
                dispatch(addEmoji(emojiObject.emoji))
              }
            />
          </div>
          <MessageInput emojiButton={emojiButton} />
        </div>
      </div>
      <ConfirmationModal body={<LogOutConfirmation />} />
    </div>
  );
};

export default Chat;
