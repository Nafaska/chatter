import React, { useContext, useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { WebSocketContext } from "../../WebSocket";
import {
  typeMessage,
  selectMessage,
  selectDescription,
  selectChannel,
  selectName,
  getChatInfo,
  addEmoji,
} from "./chatSlice";
import { selectUsername } from "../auth/authSlice";
import avatar from "../../assets/cat-avatar.png";
import { useParams } from "react-router-dom";
import { getListOfChannels, selectChannelList } from "../channel/channelSlice";
import Picker from "emoji-picker-react";


const Chat = () => {
  const dispatch = useDispatch();
  const message = useSelector(selectMessage);
  const channelSelector = useSelector(selectChannel);
  const username = useSelector(selectUsername);
  const name = useSelector(selectName);
  const description = useSelector(selectDescription);
  const ws = useContext(WebSocketContext);
  const regexOnlyWhiteSpace = /^\s*$/;
  const { channel } = useParams();
  const listOfChannels = useSelector(selectChannelList);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // const onEmojiPickerClick = () => {
  //   console.log(showEmojiPicker);

  //   if (!showEmojiPicker) {
  //     setShowEmojiPicker(true);
  //   }

  //   console.log(showEmojiPicker);
  // };

    const pickerWrapper = useRef();
    const emojiButton = useRef();


  const sendMessage = () => {
    console.log("sending username message", username, message);
    ws.sendMessage({
      username: username,
      message: message,
    });
  };

  useEffect(() => {
    dispatch(getChatInfo(channel));
    dispatch(getListOfChannels());
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

  }, [channel, dispatch, showEmojiPicker]);

  return (
    <div className="font-mono w-full border shadow bg-white">
      <div className="flex">
        <div className="h-screen bg-gradient-to-r from-gray-400 to-blue-500 w-1/5 pb-6 hidden md:block">
          <h1 className="text-white text-2xl my-6 px-4 tracking-widest font-extrabold flex justify-between">
            <span>Chatter</span>
          </h1>
          <div className="h-4/5">
            <div className="px-4 my-2 tracking-wide text-gray-800 font-bold">
              Channels
            </div>
            <div className="overflow-y-auto h-3/5">
              <div className="bg-teal-600 mb-1 py-1 px-4 text-white font-semi-bold">
                <span className="pr-1">#</span> {name}
              </div>
              {listOfChannels
                .filter((ch) => ch !== name)
                .map((ch, index) => {
                  return (
                    <div
                      key={`${ch}_${index}`}
                      className="mb-1 py-1 px-4 text-white font-semi-bold"
                    >
                      <span className="pr-1">#</span> {ch}
                    </div>
                  );
                })}
            </div>
            <div className="px-4 my-3 tracking-wide text-gray-800 font-bold">
              Online
            </div>

            <div className="flex items-center mb-3 px-4">
              <span className="text-white">
                <span className="pr-1 text-white">#</span> Olivia Dunham{" "}
                <i className="text-gray-300 text-sm">(me)</i>
              </span>
            </div>

            <div className="flex items-center mb-3 px-4">
              <span className="text-white">
                <span className="pr-1 text-white">#</span> Adam Bishop
              </span>
            </div>

            <div className="flex items-center px-4 mb-6">
              <span className="text-white">
                <span className="pr-1 text-white">#</span> killgt
              </span>
            </div>
          </div>
        </div>

        <div className="w-full flex h-screen flex-col">
          <div className="border-b flex px-6 py-2 items-center">
            <div className="flex flex-col">
              <h3 className="text-grey-900 text-md mb-1 font-extrabold">
                {name}
              </h3>
              <div className="text-grey font-light text-sm">{description}</div>
            </div>
            <div className="ml-auto hidden md:block">
              <input
                type="search"
                placeholder="Search"
                className="border border-grey-600 rounded-lg p-2"
              />
            </div>
          </div>
          <div id="channel" className="px-6 py-4 flex-1 overflow-y-auto">
            {channelSelector.map((it) => {
              return (
                <div
                  key={it.time}
                  className="flex items-start mb-4 no-overflow-anchoring"
                >
                  <img
                    src={avatar}
                    className="w-12 h-12 rounded-full mr-3"
                    alt="user avatar"
                  />
                  <div className="flex flex-col">
                    <div className="flex items-end">
                      <span className="font-bold text-md mr-2">
                        {it.username}
                      </span>
                      <span className="text-grey-700 text-xs font-light">
                        {new Date(it.time).toLocaleString()}
                      </span>
                    </div>
                    <p className="font-light text-md text-grey-800 pt-1">
                      {it.message}
                    </p>
                  </div>
                </div>
              );
            })}
            <div className="h-1 auto-overflow-anchoring"></div>
          </div>
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
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
              const channelEl = document.getElementById("channel");
              channelEl.scrollTop = channelEl.scrollHeight;
            }}
            className="flex m-6 rounded-lg border-2 auto-overflow-anchoring"
          >
            {" "}
            <span
              ref={emojiButton}
              className="hover:bg-gray-200 text-3xl text-gray-500 cursor-pointer px-3 border-r-2"
            >
              ☺
            </span>
            <input
              type="text"
              className="w-full focus:ring-2 focus:outline-none ring-blue-600 px-4 mr-0.5"
              placeholder="Message to #general"
              value={message}
              onChange={(e) => {
                dispatch(typeMessage(e.target.value));
              }}
            />
            <button
              disabled={regexOnlyWhiteSpace.test(message)}
              type="submit"
              className="justify-center py-2 px-4 ring-2 text-sm font-medium rounded-r-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ring-blue-600"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;
