import { useContext } from "react";
import { WebSocketContext } from "../../WebSocket";
import { useSelector, useDispatch } from "react-redux";
import {
  typeMessage,
  selectMessage,
  cleanMessageInput,
  selectName,
} from "./chatSlice";
import { selectUsername } from "../auth/authSlice";

const MessageInput = (props) => {
  const regexOnlyWhiteSpace = /^\s*$/;
  const dispatch = useDispatch();
  const message = useSelector(selectMessage);
  const ws = useContext(WebSocketContext);
  const username = useSelector(selectUsername);
  const name = useSelector(selectName);

  const sendMessage = () => {
    ws.sendMessage({
      username: username,
      message: message,
      channel: name,
    });
    dispatch(cleanMessageInput());
  };

  return (
    <div
      style={{ width: "inherit" }}
      className="z-10 flex border p-6 bg-white fixed bottom-0"
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage();
          const channelEl = document.getElementById("channel");
          channelEl.scrollTop = channelEl.scrollHeight;
        }}
        className="flex h-10 w-full rounded-lg border-2 auto-overflow-anchoring"
      >
        {" "}
        <span
          ref={props.emojiButton}
          className="hover:bg-gray-200 text-3xl text-gray-500 cursor-pointer px-3 border-r-2"
        >
          ☺
        </span>
        <input
          type="text"
          className="resize-y w-full focus:ring-2 focus:outline-none ring-blue-600 px-4 mr-0.5"
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
  );
};

export default MessageInput;
