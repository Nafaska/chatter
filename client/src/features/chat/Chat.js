import React, { useContext, useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { WebSocketContext } from "../../WebSocket";
import { ReactComponent as LogoutImg } from "../../assets/logout.svg";
import { ReactComponent as AdminPageImg } from "../../assets/adminPage.svg";
import { useHistory } from "react-router-dom";
import {
  typeMessage,
  selectMessage,
  selectDescription,
  selectName,
  getChatInfo,
  addEmoji,
  cleanMessageInput,
  selectIsBurgerMenuOpen,
  selectChannelsContent,
} from "./chatSlice";
import { readToken, selectUsername, selectRole } from "../auth/authSlice";
import avatar from "../../assets/cat-avatar.png";
import { useParams } from "react-router-dom";
import { getListOfChannels, selectChannelList } from "../channel/channelSlice";
import Picker from "emoji-picker-react";
import Spinner from "../helpers/Spinner";
import LogOutConfirmation from "../modal/LogOutConfirmation";
import ConfirmationModal from "../modal/ConfirmationModal";
import { openModal } from "../modal/confirmationSlice";
import { topography } from "hero-patterns";
import BurgerMenu from "./BurgerMenu";
import BurgerButton from "./BurgerButton";

const Chat = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const message = useSelector(selectMessage);
  const username = useSelector(selectUsername);
  const name = useSelector(selectName);
  const description = useSelector(selectDescription);
  const ws = useContext(WebSocketContext);
  const regexOnlyWhiteSpace = /^\s*$/;
  const { channel } = useParams();
  const listOfChannels = useSelector(selectChannelList);
  const channelsContent = useSelector(selectChannelsContent);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const isAdmin = useSelector(selectRole).includes("admin");
  const isBurgerMenuOpen = useSelector(selectIsBurgerMenuOpen);

  const pickerWrapper = useRef();
  const emojiButton = useRef();

  const backgroundStyle = {
    backgroundImage: topography("#F3D5AD", 0.5),
  };

  const sendMessage = () => {
    ws.sendMessage({
      username: username,
      message: message,
      channel: name,
    });
    dispatch(cleanMessageInput());
  };

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
    <div className={`font-mono w-full border shadow bg-white`}>
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
          <div className="border-b flex p-3 h-16 items-center">
            <span
              title="Go to Channels"
              onClick={() => history.push("/channels")}
              className={`text-2xl ${
                isBurgerMenuOpen ? "hidden" : "hidden sm:block"
              } tracking-widest ml-12 cursor-pointer px-2 font-extrabold flex justify-between`}
            >
              Chatter:
            </span>
            <div className="flex flex-col ml-12 sm:ml-0">
              <h3 className="text-grey-900 text-md mb-1 truncate font-extrabold">
                {name}
              </h3>
              <div className="text-grey font-light truncate text-sm">
                {description}
              </div>
            </div>
            <div className="inline-flex absolute top-0 right-0 inline-flex ">
              <button
                title="Log Out"
                onClick={() => dispatch(openModal())}
                className="my-3 flex justify-center p-1 border text-sm font-medium rounded-md text-white bg-gray-400 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <LogoutImg className="mx-auto h-7 w-auto" />
              </button>
              {isAdmin ? (
                <button
                  onClick={() => history.push("/admin")}
                  className="my-3 mr-3 flex rounded-l-none justify-center p-1 border text-sm font-medium rounded-md text-white bg-gray-400 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <AdminPageImg className="mx-auto h-7 w-auto" />
                </button>
              ) : (
                false
              )}
            </div>
          </div>
          <div
            id="channel"
            style={backgroundStyle}
            className="border-b px-6 py-4 flex-1 overflow-y-auto"
          >
            {!name && <Spinner height="h-4/5" />}
            {channelsContent[name]
              ? Object.values(channelsContent[name]).map((it) => {
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
                          {it.username === username ? (
                            <span className="font-bold text-blue-700 text-md mr-2">
                              {it.username}
                            </span>
                          ) : (
                            <span className="font-bold text-md mr-2">
                              {it.username}
                            </span>
                          )}
                          <span className="text-grey-700 text-xs font-light">
                            {new Date(it.time).toLocaleString()}
                          </span>
                        </div>
                        <p className="font-light break-words text-md text-grey-800 pt-1">
                          {it.message}
                        </p>
                      </div>
                    </div>
                  );
                })
              : " "}
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
              placeholder={name && `Message to #${name}`}
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
      <ConfirmationModal body={<LogOutConfirmation />} />
    </div>
  );
};

export default Chat;
